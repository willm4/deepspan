import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { Action } from 'src/app/classes/action';
import { ToastController } from '@ionic/angular';
import { ActionService } from 'src/app/services/action.service';
import { BubblesService } from 'src/app/services/bubbles.service';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.page.html',
  styleUrls: ['./actions.page.scss'],
})
export class ActionsPage {
  actionTypes: {

  }
  lastUpdate: Date;
  notifications = [];
  constructor(public app: AppService, public actionCtrl: ActionService, public bubbleCtrl: BubblesService, private toastCtrl: ToastController) { }


  ionViewDidEnter(){
    this.refreshActions();
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

  refreshActions(){
    this.actionCtrl.getActions().then(()=>{
      this.actionCtrl.actions.forEach(a=>{
        let user = this.bubbleCtrl.users.filter(u=>{
          return u.id === a.userref.Int32;
        });
        if(user.length > 0){
          a.setImg(user[0].img);
        }
      });
    }, err=>{
      this.promptToast("There was an error getting actions." , "danger")
    })
  }

  updateAction(action, edgeStatus){
    if(edgeStatus == 0){ // RE-INVITE ACTION
      this.addLink(action)
    }
    //decline
    else if (edgeStatus == 1){
      this.replyAction(action, false);
    }
    //accept
    else if (edgeStatus == 2){
      this.replyAction(action,true);
    }
  }



  // accept/decline
  replyAction(action: any, accept: boolean){
    this.actionCtrl.replyAction(action, accept).then(response=>{
      // TODO SHOW SUCCESS
     this.refreshActions();
    }, err=>{
      // TODO SHOW TOAST
    })
  };

  // RE-INVITE
  addLink(action){
    this.actionCtrl.addLink(action).then(response=>{
      this.promptToast(action.refname + " has been reinvited.", "success");
    }, err=>{
      this.promptToast("There was an error trying to reinvite " + action.refname  , "danger")
    })
  }

  deleteAction(action: Action){
    let isInvite = action.actiontype == this.actionCtrl.actionTypes.ACTION_INVITE_SENT;
    this.actionCtrl.deleteAction(action).then(()=>{
      this.refreshActions();
      if(isInvite){
        this.promptToast("Invite for " + action.refname + " to join your bubble was revoked", "success")
      }
    }, err=>{
      this.promptToast("There was an error " + (isInvite  ? " revoking invite for " + action.refname + " to join your bubble." : " dismissing notification." ) , "danger")
    })
  }


  dismiss(index){
    this.notifications.splice(index,1);
  }




}
