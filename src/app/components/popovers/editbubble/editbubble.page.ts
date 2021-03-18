import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams, ToastController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import * as cloneDeep from 'lodash/cloneDeep';
import { User } from 'src/app/classes/user';
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
  canEdit: boolean = false;
  constructor(private popoverCtrl: PopoverController, private toastCtrl: ToastController, private params: NavParams, public app: AppService) { 
    // this.init();
  }

  ngOnInit() {
    this.init();
  }

  // ionViewDidEnter(){
  //   this.init();
  // }

  toggleHidden(){
    this.hideNode = !this.hideNode;
  }

  init(){
    this.isEdit = false;
    let node = this.params.get('node');//{id, name}
    let user = this.params.get('user');
    if(node && user){
      this.canEdit = user.userType != this.app.bubbleCtrl.userTypes.CURRENT_USER
      this.bubid = node.id;
      // console.log(this.bubid);
      this.img = node.image;
      this.userRaw = cloneDeep(user);
      this.userEdits = cloneDeep(user);
      this.isEdit = true;
    }
    else{
      this.canEdit = true;
      console.log('no node');
    }
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

  canSave(){
    return this.userEdits.name &&  this.userEdits.name.length > 0 && this.userEdits.email && this.userEdits.email.length > 0;
  }

  hasChanges(){
    return this.userRaw.name != this.userEdits.name
    || this.userRaw.email != this.userEdits.email
    || this.userRaw.userstatus != this.userEdits.userstatus;
  }

  save(){
        if(!this.isEdit){
          if(this.userEdits.name && this.userEdits.email){
            this.app.bubbleCtrl.addBubble(this.userEdits).then(response=>{
              this.promptToast("Bubble for " + this.userEdits.name + " added successfully!", 'success' );
              this.close(true);
            },err=>{
              this.promptToast("Oops, there was an error adding the bubble. Please try again. ", 'danger' );
            })
          }
          else{
            this.promptToast("Bubble can't be added, make sure the name and email are valid. ", 'danger' );
          }
        }
        else{
          let data = this.getDataFromEdge();
          if (!data.valid) {
            let errColor= 'danger';
            if(this.hideNode){
              errColor = 'warning';
            }
            if(this.hasChanges()){
              this.promptToast(data.invalidReason, errColor );
            }
            if(!this.hasChanges() || this.hideNode){
              this.close();
            }
          }
          else{
            this.userEdits.userstatus = this.userEdits.userStatusName.value
            this.app.editInvitedUser(this.userEdits).then(response=>{
              this.promptToast(this.userEdits.name + ' updated successfully!', 'success' );
              this.userRaw = cloneDeep(this.userEdits);
              this.close(true);
            }, err=>{
              if(this.hideNode){
                this.close();
              }
              console.log(err);
              this.promptToast("Error updating " + this.userRaw.name + '.', 'danger' );
            })
          }
        }
    }



  findEdge(id1, id2) {
    let index = this.app.bubbleCtrl.bubbles.findIndex((element, index) => { if (((element.user1id == id1)&&(element.user2id == id2)) || ((element.user1id == id2)&&(element.user2id == id1))){ return true}}, id1); 
    return (index == -1 ? -1 : this.app.bubbleCtrl.bubbles[index].id)
  };

  isDirect(id) {
      return(this.app.bubbleCtrl.bubbles.some(e => ((e.user1id == this.app.userCtrl.user.id) && (e.user2id == id)) || ((e.user2id == this.app.userCtrl.user.id) && (e.user1id == id))))
  };


  getDataFromEdge(){
    let data = {
      bubble: null,
      user: null,
      valid: false,
      invalidReason: ""
    };
    let edgeid = this.findEdge(this.app.userCtrl.user.id, this.bubid);
    if(edgeid == -1){
      data.invalidReason = "Action can't be completed. " + this.userRaw.name + " isn't in your immediate bubble."
    }
    else{
      let bubMatches = this.app.bubbleCtrl.bubbles.filter(b=>{
        return b.id == edgeid;
      });
      if(bubMatches.length == 0){
        data.invalidReason = "Action cannot be completed, no bubbles found."
      }
      else{
        let bub = bubMatches[0];
        let bubID = bub.user2id == this.app.userCtrl.user.id ? bub.user1id : bub.user2id;
        let userMatches = this.app.bubbleCtrl.users.filter(u=>{
          return u.id == bubID
        });
        if(userMatches.length == 0){
          data.invalidReason = "Action cannot be completed. no users found."
        }
        else{
          let user = userMatches[0];
          data.bubble = bub;
          data.user = user;
          data.valid = true;
          if(user.role.Int32 != -2){
            data.invalidReason = "Bubble can only be edited by " + this.userRaw.name;
            data.valid = false;
          }
        }
      }
    }
    return data;
  }
  

  delete(){

    let data = this.getDataFromEdge();
    console.log(data);
    if (!data.valid) {
      this.promptToast(data.invalidReason, 'danger' );
    }

    else{
      this.app.bubbleCtrl.removeBubble(data.bubble.id).then(response=>{
        this.promptToast(this.userRaw.name + ' removed successfully!', 'success' );
        this.close(true);
      }, err=>{
        this.promptToast('Error removing ' + this.userRaw.name, 'danger' );
      })
    }
  }
  close(hasChanges: boolean = false){
    if(hasChanges){
      this.app.bubbleCtrl.refresh().then(()=>{
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
    this.popoverCtrl.dismiss({'hasChanges':hasChanges, hideNode: this.hideNode });
  }
}
