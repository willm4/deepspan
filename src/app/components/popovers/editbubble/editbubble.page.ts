import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams, ToastController } from '@ionic/angular';
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
  node: any;
  constructor(private popoverCtrl: PopoverController, private toastCtrl: ToastController, private params: NavParams, public bubbleCtrl: BubblesService, public userCtrl: UserService) { 

  }

  ngOnInit() {
    this.init();
  }

  toggleHidden(){
    this.hideNode = !this.hideNode;
  }

  setCanEdit(user: any, node :any){
    this.editIsMe = user.id == this.userCtrl.user.id;
    this.editIsZombie = (this.findEdge(this.userCtrl.user.id, node.id) != -1) && (user.role.Int32 == -2)
  }

  findEdge(id1, id2) {
    let index = this.bubbleCtrl.bubbles.findIndex((element, index) => { if (((element.user1id == id1)&&(element.user2id == id2)) || ((element.user1id == id2)&&(element.user2id == id1))){ return true}}, id1); 
    return (index == -1 ? -1 : this.bubbleCtrl.bubbles[index].id)
  };


  init(){
    this.isEdit = false;
    let node = this.params.get('node');//{id, name}
    let user = this.params.get('user');
    if(node && user){
      this.node = node;
      this.setCanEdit(user, node);
      this.bubid = node.id;
      this.img = node.image;
      this.userRaw = cloneDeep(user);
      this.userEdits = cloneDeep(user);
      this.isEdit = true;
    }
    else{
      this.editIsMe = true;
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
            this.bubbleCtrl.addBubble(this.userEdits).then(response=>{
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
          if(!this.editIsMe && !this.editIsZombie){
            console.log('closing');
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
              console.log(err);
              this.promptToast("Error updating " + this.userRaw.name + '.', 'danger' );
            });
          }
        }
    }

  canDelete(){
    
  }

  delete(){
    let edgeid = this.findEdge(this.userCtrl.user.id, this.node.id);
    console.log(edgeid)
    if(edgeid == -1){
      this.promptToast("Only bubbles in your immediate pod can be deleted.", 'danger' );
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
    this.popoverCtrl.dismiss({'hasChanges':hasChanges, hideNode: this.hideNode });
  }




}
