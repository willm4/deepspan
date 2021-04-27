import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import * as cloneDeep from 'lodash/cloneDeep';
import { User } from 'src/app/classes/user';
import { AlertController, ToastController, PopoverController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { BubblesService } from 'src/app/services/bubbles.service';
import { EditbubblePage } from 'src/app/components/popovers/editbubble/editbubble.page';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  isEditing: boolean = false;
  userEdits: User = new User();

  constructor(public userCtrl: UserService, public popoverCtrl: PopoverController, public bubbleCtrl: BubblesService, public app: AppService, private router: Router, private alertCtrl: AlertController, private toastCtrl: ToastController) { 
    this.userEdits = this.userCtrl.getUserForEdits(this.bubbleCtrl.getNodes());
  }
  
  ionViewDidEnter(){
    if(this.bubbleCtrl.users.length == 0){
      this.refresh();
    }
    else{
      this.userEdits = this.userCtrl.getUserForEdits(this.bubbleCtrl.getNodes());
    }
  }


  edit(){
    this.isEditing = true;
    this.userEdits = this.userCtrl.getUserForEdits(this.bubbleCtrl.getNodes());
  }

  refresh(){
    this.isEditing = false;
    this.bubbleCtrl.getData().then(()=>{
      this.userEdits = this.userCtrl.getUserForEdits(this.bubbleCtrl.getNodes());
    })
  }
  
  async openUndoMerge(){
    let merged = this.userCtrl.user.merged.map(m=>{
      return m.label;
    }).join(', ').replace(/, ([^,]*)$/, ' and $1');
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Unmerge Accounts',
      subHeader:'Would you like to unlink your account from ' + merged + '?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        }, {
          text: 'Yes',
          handler: (ev) => {
            this.userCtrl.unmerge().then(()=>{
              this.bubbleCtrl.getData().then(()=>{
                this.userCtrl.getUserForEdits(this.bubbleCtrl.getNodes());
                this.userEdits.merged = this.userCtrl.user.merged;
              })
              this.promptToast('Unmerge success!', 'success');
            }, err=>{
              this.promptToast('Error unmerging.', 'danger');
            })
          }
        }
      ]
    });

    await alert.present();
  }

  async openMerged(node: any){ // {id, name}
  let user = new User();
   if(node){
     let users = this.bubbleCtrl.users.filter(u=>{
       return u.id == node.id
     });
     if(users && users.length > 0){
       user = this.userCtrl.setExternalUserData(users[0]);
     }
   }
   if(node){
     node.merged = [];
     const popover = await this.popoverCtrl.create({
       component: EditbubblePage,
       showBackdrop: true,
       componentProps:{
         node: node,
         user: user,
         isMerged: true
       }
     });
     await popover.present();
     await popover.onDidDismiss().then((response: any)=>{

     })
   }
 }

  setCurrentLocation(){
    this.userEdits.lat.Float64 = this.userCtrl.locationCtrl.location.lat;
    this.userEdits.lon.Float64 = this.userCtrl.locationCtrl.location.lon;
    this.userEdits.provincestate.String = this.userCtrl.locationCtrl.location.state
    this.userEdits.countryregion.String = 'US';
    this.userEdits.admin2.String = this.userCtrl.locationCtrl.location.admin2;
    this.userEdits['locatonName'] = this.userCtrl.locationCtrl.location.locationName;
  }

  cancel(){
    this.isEditing = false;
  }

  save(){
    this.isEditing = false;
    this.userEdits.userstatus = this.userEdits.userStatusName.value;
    this.userCtrl.editProfile(this.userEdits).then(()=>{
      this.userEdits = this.userCtrl.getUserForEdits(this.bubbleCtrl.getNodes());
    })
  }

  //TODO
  // unmerge () {
  //   axios.delete('/api/primary', 
  //   )
  //   .then((response) => {
  //       window.location.href = '/acct/profile';
  //   })
  //   .catch((error) => {
  //       console.log(error)
  //       // window.location.href = '/acct/profile'; //loops on mounted
  //   })
  // }

  async promptToast(message: string, color: string){
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom',
      buttons: [ {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }

  async resetPassword(){
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Reset Password',
      inputs: [
        {
          label: 'Current Password',
          name: 'currentpw',
          id: 'currentpw',
          type: 'password',
          placeholder: 'Confirm current password'
        },
        {
          label: 'New Password',
          name: 'newpw',
          type: 'password',
          id: 'newpw',
          placeholder: 'Enter new password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (ev) => {
           if(ev.currentpw && ev.newpw){
            this.userCtrl.newPW(ev.currentpw, ev.newpw).then(()=>{
              this.promptToast('Password reset!', 'success');
            }, err=>{
              this.promptToast('Error resetting password', 'danger');
            })
           }
           else{
            this.promptToast('Password not reset, new or current password missing', 'danger');
           }
          }
        }
      ]
    });

    await alert.present();
  }


  ngOnInit() {
  }

  viewDoc(type){
    this.router.navigate(['/document', {type:type }])
  }

  logout(){
    this.userCtrl.logout().then(()=>{
      this.router.navigateByUrl('/login')
    }, err=>{
      console.log('err signing out ' + err);
    })
  }

}
