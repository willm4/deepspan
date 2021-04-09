import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { BubblesService } from './bubbles.service';
import { Action } from '../classes/action';
import { UserService } from './user.service';
import { User } from '../classes/user';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  build =  '2.5';
  ipc: number;
  actions: Array<Action> = new Array<Action>();
  statuses: Array<string> = new Array<string>();
  states = {"AL":"Alabama","AK":"Alaska","AZ":"Arizona","AR":"Arkansas","CA":"California","CO":"Colorado","CT":"Connecticut","DE":"Delaware","FL":"Florida","GA":"Georgia","HI":"Hawaii","ID":"Idaho","IL":"Illinois","IN":"Indiana","IA":"Iowa","KS":"Kansas","KY":"Kentucky","LA":"Louisiana","ME":"Maine","MD":"Maryland","MA":"Massachusetts","MI":"Michigan","MN":"Minnesota","MS":"Mississippi","MO":"Missouri","MT":"Montana","NE":"Nebraska","NV":"Nevada","NH":"New Hampshire","NJ":"New Jersey","NM":"New Mexico","NY":"New York","NC":"North Carolina","ND":"North Dakota","OH":"Ohio","OK":"Oklahoma","OR":"Oregon","PA":"Pennsylvania","RI":"Rhode Island","SC":"South Carolina","SD":"South Dakota","TN":"Tennessee","TX":"Texas","UT":"Utah","VT":"Vermont","VA":"Virginia","WA":"Washington","WV":"West Virginia","WI":"Wisconsin","WY":"Wyoming"};

  actionTypes =  {
    ACTION_INVITE_SENT       : 0, //user_id sends invite to user_ref  (bubble_ref)
    ACTION_INVITE_RECEIVED   : 1, //user_id receives invite from user_ref (bubble_ref)
    ACTION_INVITE_REVOKED    : 2, //user_id cancels invite previously sent to user_ref (bubble_ref: deleted)
    ACTION_INVITE_CANCELLED  : 3, //user_ref cancels invite previously sent to user_id (bubble_ref: deleted)
    ACTION_INVITE_ACCEPTED   : 4, //user_ref accepts invite from user_id (bubble_ref) - can toggle in future
    ACTION_INVITE_REJECTED   : 5, //user_ref rejects invite from user_id (bubble_ref) - can toggle in future
    ACTION_BUBBLE_EXPANDED   : 6, //user_ref bubble expanded, direct link (via bubble_ref)
    ACTION_BUBBLE_CONTRACTED : 7 //user_ref bubble contracted, direct link (via bubble_ref)
  }
  constructor(private rest: RestService,  public bubbleCtrl: BubblesService, public userCtrl: UserService ) {

   }

   public getChartData(){
     return this.bubbleCtrl.getChartData(this.userCtrl.user.name, this.userCtrl.user.id)
   }

   clearStorage(){
     this.rest.clearStorage();
   }


   public editInvitedUser(user: any){
     console.log('editing invited user')
     return new Promise((resolve,reject)=>{
      let params = {id: user.id,
         email:user.email
        ,creatorid:user.creatorid
        , name: user.name
        , userstatus:user.userstatus
        ,creatorestimate: user.creatorestimate};
        this.rest.editInvitedUser(params).then((response:any)=>{
          resolve()
        }, err=>{
          reject(err);
        })
     })
   }


   public setIPC(){
     return new Promise((resolve,reject)=>{
      //  console.log('getting pic')
      // this.rest.getIPC("King", "Washington", 47.608013, -122.335167).then((response:any)=>{
      //   this.ipc = Math.round(response.ipc);
      //   resolve();
      // },err=>{
      //   reject("Error, couldn't set IPC");
      // })
      this.userCtrl.locationCtrl.setLocation().then(()=>{
        this.rest.getIPC(this.userCtrl.locationCtrl.location.admin2, this.userCtrl.locationCtrl.location.provinceStateName, this.userCtrl.locationCtrl.location.lat, this.userCtrl.locationCtrl.location.lon).then((response:any)=>{
          this.ipc = Math.round(response.ipc);
          resolve();
        },err=>{
          reject("Error, couldn't set IPC");
        })
      }, err=>{
        reject();
      })
     })
   }

   public getActions(){
     return new Promise((resolve,reject)=>{
       this.rest.getActions().then((response:any)=>{
         let actions = new Array<Action>();
         if(response && response.length > 0){
          response.forEach(a=>{
            actions.push(new Action(a));
          })
         }
         this.actions = actions
         resolve();
       })
     })
   }

   public deleteAction(action: Action){
     return new Promise((resolve,reject)=>{
      this.rest.deleteAction(action).then(()=>{
        resolve();
      }, err=>{
        reject(err);
      })
     })
   }

   public updateAction(action: Action, edgeStatus: any){
    return new Promise((resolve,reject)=>{
     this.rest.updateAction(action, edgeStatus).then(()=>{
       resolve();
     }, err=>{
       reject(err);
     })
    })
  }


}
