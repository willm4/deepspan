import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Action } from '../classes/action';

@Injectable({
  providedIn: 'root'
})
export class ActionService {

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

  actions: Array<Action> = new Array<Action>();

  constructor(private api: ApiService) {  
  }


  public getActions(){
    return new Promise((resolve,reject)=>{
      this.api.get(this.api.allActions).then((response:any)=>{
        let actions = new Array<Action>();
        if(response && response.length > 0){
         response.forEach(a=>{
           actions.push(new Action(a));
         })
        }
        this.actions = actions
        resolve();
      }, err=>{
        reject(err);
      })
    })
  }

  public deleteAction(action: Action){
    return new Promise((resolve,reject)=>{
      this.api.delete(this.api.deleteAction + '/' + action.id ).then(()=>{
        resolve();
      }, err=>{
        reject(err);
      })
    })
  }

  updateAction(action: Action, edgeStatus: any){
    return new Promise((resolve,reject)=>{
      let params = {
        id: action.bubbleref.Int32,
        edgestatus: edgeStatus
      };
      this.api.put(this.api.invite, params).then((response)=>{
        resolve();
      }, err=>{
        reject(err);
      })
    })
  }

  replyAction(action: Action, accept: boolean){
    return new Promise((resolve,reject)=>{
      let params = '{"id": ' + action.id + '}'
       this.api.post(this.api.replyAction + (accept ? "accept" : "reject"), params).then((response)=>{
        resolve();
      }, err=>{
        reject(err);
      })
    })
  }
  
  addLink(action: Action){
    return new Promise((resolve,reject)=>{
      let params = '{"members": [{"email": "' + action.refemail +'","name": "'+ action.refname + '"}]}'
      this.api.post(this.api.reinvite, params).then((response)=>{
        resolve();
      }, err=>{
        reject(err);
      })
    })
  }


}
