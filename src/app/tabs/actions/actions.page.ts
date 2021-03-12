import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { Action } from 'src/app/classes/action';
import { ToastController } from '@ionic/angular';

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
  constructor(public app: AppService, private toastCtrl: ToastController) { }


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
    this.app.getActions().then(()=>{
      this.app.actions.forEach(a=>{
        let user = this.app.bubbleCtrl.users.filter(u=>{
          return u.id === a.userref.Int32;
        });
        if(user.length > 0){
          if(a.userref.Int32 === 1){
            console.log(user.length);
            console.log(a);
          }
          a.setImg(user[0].img);
        }
      });
    }, err=>{
      this.promptToast("There was an error getting actions." , "danger")
    })
  }

  updateAction(action, edgeStatus){
    if(!action.bubbleref.Valid){
      this.promptToast("Action can't be updated, user is no longer valid." , "danger")
    }
    else{
      this.app.updateAction(action,edgeStatus).then(()=>{
        this.refreshActions();
      }, err=>{
        this.promptToast("There was an error updating action: " + err , "danger")
      })
    }
  }

  deleteAction(action: Action){
    let isInvite = action.actiontype == this.app.actionTypes.ACTION_INVITE_SENT;
    this.app.deleteAction(action).then(()=>{
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

  reInvite(index){
    this.dismiss(index);
 
  }



}
