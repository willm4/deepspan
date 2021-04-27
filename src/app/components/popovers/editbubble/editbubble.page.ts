import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams, ToastController, AlertController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import * as cloneDeep from 'lodash/cloneDeep';
import { User } from 'src/app/classes/user';
import { BubblesService } from 'src/app/services/bubbles.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-editbubble',
  templateUrl: './editbubble.page.html',
  styleUrls: ['./editbubble.page.scss'],
})


export class EditbubblePage implements OnInit {
  public  statuses = {
    MEMBER_INVITED: 0,
    MEMBER_DECLINED: 1,
    MEMBER_ACCEPTED: 2
  }
  isEdit: boolean = false;
  userRaw = new User();
  userEdits = new User()
  img: any = null;
  hideNode: boolean = false;
  
  disabled: any = {
    name: true,
    email: true,
    status: true,
    estimate: true,
    add: true,
    delete: true,
    update: true,
    merge: false,
    clear: false,
    hide: false,
    unhide: false,
    scenario: false
  }

  connections = [
    'Spouse/S.O',
    'Family',
    "Roommate",
    "Non-Resident Family",
    "Friend/Colleague"
  ];
  covidStatuses = [
    "Unknown",
    "Symptomatic",
    "Infected",
    "Previous Infection",
    "Vaccinated"
  ];
  privacy = [
    "Show only Bubble #",
    "Show Full Bubble",
    "Don't Show Anything"
  ];
  bubid: number;
  editIsMe: boolean = false;
  editIsNew: boolean = false;
  editIsZombie: boolean = false;
  editIsDirect: boolean = false;
  merged: boolean = false;
  node: any;
  isMerged: boolean = false;
  constructor(private popoverCtrl: PopoverController
    , private toastCtrl: ToastController
    , private params: NavParams
    , public bubbleCtrl: BubblesService
    , public userCtrl: UserService
    , private alertCtrl: AlertController) { 

  }

  ngOnInit() {
    this.init();
  }

  async openMerge(){
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Merge ' + this.userRaw.name,
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder:'Enter email',
          disabled: true,
          value: this.userRaw.email
        },
        {
          name: 'password',
          type: 'password',
          placeholder:'Enter password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Merge',
          handler: (data) => {
            if(data.password){
              this.bubbleCtrl.submitMerge(this.userRaw.email, data.password).then(()=>{
                this.promptToast('Merge with ' + this.userRaw.email + " successful!", "success");
                this.merged = true;
              }, err=>{
                this.promptToast("Merge failed - server error", "danger")
              })
            }
            else{
              this.promptToast("Merge failed - password missing", "danger")
            }
          }
        }
      ]
    });

    await alert.present();
  }

  toggleHidden(){
    this.hideNode = !this.hideNode;
  }

  setCanEdit(user: any, node: any, isScenario: boolean = false){
    this.editIsNew = false;
    this.editIsMe = this.userCtrl.user.id == node.id;
    this.editIsZombie =  (node.id != -1) && (user.role.Int32 == -2) && (user.creatorid.Valid) && (user.creatorid.Int32 == this.userCtrl.user.id)
    this.editIsDirect = (this.bubbleCtrl.bubbles.some(e => ((e.user1id == this.userCtrl.user.id) && (e.user2id == user.id)) || ((e.user2id == this.userCtrl.user.id) && (e.user1id == user.id))))
    this.disabled.scenario = isScenario;
    if(!isScenario){
      this.setDisabledFields();
    }
  }

  setDisabledFields(){
    this.disabled.name     = this.isMerged || (!this.editIsNew && !this.editIsMe && !this.editIsZombie);
    this.disabled.email    = this.isMerged || (!this.editIsNew && !this.editIsMe);
    this.disabled.status   = this.isMerged || (!this.editIsNew && !this.editIsMe && !this.editIsZombie);
    this.disabled.estimate = this.isMerged || (!this.editIsNew && !this.editIsZombie);
    this.disabled.add      = this.isMerged || (!this.editIsNew && (this.editIsMe || this.editIsDirect))
    this.disabled.delete   = this.isMerged || (!this.editIsDirect || this.editIsMe);
    this.disabled.update   = this.isMerged || (!this.editIsMe && !this.editIsZombie);
    this.disabled.merge    = this.isMerged || (this.editIsNew || this.disabled.scenario || this.editIsMe);
  }

  findEdge(id1, id2) {
    let index = this.bubbleCtrl.bubbles.findIndex((element, index) => { if (((element.user1id == id1)&&(element.user2id == id2)) || ((element.user1id == id2)&&(element.user2id == id1))){ return true}}, id1); 
    return (index == -1 ? -1 : this.bubbleCtrl.bubbles[index].id)
  };


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


  init(){
    this.isEdit = false;
    this.merged = false;
    let isScenario = this.params.get('isScenario');
    let node = this.params.get('node');//{id, name}
    let user = this.params.get('user');
    if(this.params.get('isMerged')){
      this.isMerged = this.params.get('isMerged')
    }
    if(node && user){
      this.node = node;
      this.bubid = node.id;
      //this.img = node.image;
      this.userRaw = cloneDeep(user);
      this.userEdits = cloneDeep(user);
      this.isEdit = true;
      this.setCanEdit(user, node, isScenario);
    }
    else{
      //this.img = 'https://ui-avatars.com/api/?background=D9D9D9'
      this.editIsMe = false;
      this.editIsNew = true;
      this.editIsDirect = false;
      this.editIsZombie = false;
      this.setDisabledFields();
    }
    this.updateImg();
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
          }
        }
      ]
    });
    toast.present();
  }

  updateImg(){
    if(this.node && !this.node.image.includes('https://ui-avatars.com')){
      this.img = this.node.image
    }
    else{
      let avatarLabel = this.userEdits.name && this.userEdits.name.length > 0
      ? this.userEdits.name.replace(/ .*/,'')
      : '?';
      let avatarTxt = this.userEdits.name && this.userEdits.name.length > 0
      ? this.userEdits.name.length >= 2
        ? this.userEdits.name.split(' ').slice(0,2).join('+')
        : avatarLabel
      : '?'
      this.img = 'https://ui-avatars.com/api/?name=' + avatarTxt + '&background=' + (this.node ? this.node.color.substring(1) : 'D9D9D9')
    }
    console.log('changed')
    
  }

  canSave(){
    return this.userEdits.name &&  this.userEdits.name.length > 0 && this.userEdits.email && this.userEdits.email.length > 0;
  }

  hasChanges(){
    return this.userRaw.name != this.userEdits.name
    || this.userRaw.email != this.userEdits.email
    || this.userRaw.userstatus != this.userEdits.userstatus;
  }

  save(){
        if(this.disabled.scenario){
          this.close();
        }
        else if(!this.isEdit){
          if(this.userEdits.name && this.userEdits.email){
            this.bubbleCtrl.addBubble(this.userEdits).then(response=>{
              this.promptToast("Bubble for " + this.userEdits.name + " added successfully!", 'success' );
              this.close(true);
            },err=>{
              this.promptToast("Oops, there was an error  bubble. Please try again. " + err, 'danger' );
            })
          }
          else{
            this.promptToast("Bubble can't be added, make sure the name and email are valid. ", 'danger' );
          }
        }
        else{
          if(!this.editIsMe && !this.editIsZombie){
            this.close();
          }
          else{
            this.userEdits.userstatus = this.userEdits.userStatusName.value
            this.userCtrl.editUser(this.userEdits).then(response=>{
              this.promptToast(this.userEdits.name + ' updated successfully!', 'success' );
              this.userRaw = cloneDeep(this.userEdits);
              this.close(true);
            }, err=>{
              if(this.hideNode){
                this.close();
              }
              this.promptToast("Error updating " + this.userRaw.name + '.', 'danger' );
            });
          }
        }
    }

  canDelete(){
    
  }

  add(){
    this.bubbleCtrl.addBubble(this.userRaw).then(response=>{
      this.promptToast("Bubble for " + this.userEdits.name + " added successfully!", 'success' );
      this.close(true);
    }, err=>{
      this.promptToast("Error: Bubble can't be added, please try again. ", 'danger' );
    })
  }

  subtract(){
    this.delete();
    // console.log('subtracting')
    // this.bubbleCtrl.subtractCount(this.userRaw.email).then(response=>{
    //   this.promptToast(this.userRaw.name + ' removed successfully!', 'success' );
    //   this.close(true); 
    // }, err=>{
    //   this.promptToast('Error removing ' + this.userRaw.name, 'danger' );
    // })
  }

  delete(){
    let edgeid = this.findEdge(this.userCtrl.user.id, this.node.id);
    if(edgeid == -1){
      this.subtract();
    }
    else{
      this.bubbleCtrl.removeBubble(edgeid).then(response=>{
        this.promptToast(this.userRaw.name + ' removed successfully!', 'success' );
        this.close(true);
      }, err=>{
        this.promptToast('Error removing ' + this.userRaw.name, 'danger' );
      })
    }
  }
  close(hasChanges: boolean = false){
    if(hasChanges){
      this.bubbleCtrl.refresh().then(()=>{
        this.dismissPopover(hasChanges);
      }, err=>{
        this.dismissPopover(hasChanges);
      })
    }
    else{
      this.dismissPopover(hasChanges);
    }
  }

  dismiss(){
    this.hideNode = false;
    this.dismissPopover(false);
  }

  dismissPopover(hasChanges: boolean){
    hasChanges = hasChanges || this.merged;
    this.popoverCtrl.dismiss({'hasChanges':hasChanges, hideNode: this.hideNode });
  }




}
