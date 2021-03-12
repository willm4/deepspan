import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import * as cloneDeep from 'lodash/cloneDeep';
import { User } from 'src/app/classes/user';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  isEditing: boolean = false;
  userEdits: User = new User();

  constructor(public app: AppService, private router: Router, private alertCtrl: AlertController, private toastCtrl: ToastController) { 
    this.userEdits = cloneDeep(this.app.userCtrl.user);
  }
  
  ionViewDidEnter(){
    this.userEdits = cloneDeep(this.app.userCtrl.user);
    console.log(this.app.userCtrl.user)
  }

  edit(){
    this.isEditing = true;
    this.userEdits = cloneDeep(this.app.userCtrl.user);
  }

  setCurrentLocation(){
    this.userEdits.lat.Float64 = this.app.lat;
    this.userEdits.lon.Float64 = this.app.lon;
    this.userEdits.provincestate.String = this.app.state;
    this.userEdits.countryregion.String = 'US';
    this.userEdits.admin2.String = this.app.region;
    this.userEdits['locatonName'] = this.app.location;
  }

  cancel(){
    this.isEditing = false;
  }

  save(){
    this.isEditing = false;
    this.userEdits.userstatus = this.userEdits.userStatusName.value;
    console.log(this.userEdits);
    this.app.userCtrl.editProfile(this.userEdits).then(()=>{
      this.userEdits = cloneDeep(this.app.userCtrl.user);
    })
  }

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
            this.app.userCtrl.newPW(ev.currentpw, ev.newpw).then(()=>{
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
    this.app.userCtrl.logout().then(()=>{
      this.router.navigateByUrl('/login')
    }, err=>{
      console.log('err signing out ' + err);
    })
  }

}
