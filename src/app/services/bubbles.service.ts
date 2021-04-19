import { Injectable } from '@angular/core';
import { Bubble } from '../classes/bubble';
import * as cloneDeep from 'lodash/cloneDeep';
import { User } from '../classes/user';
import {Md5} from 'ts-md5/dist/md5';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class BubblesService {

  bubbles: Array<Bubble> = new Array<Bubble>();
  users: Array<User> = new Array<User>();
  size: number = 0;
  riskierSize: any;
  totalSize: any; 
  riskRate: any; 
  userTypes = {
    UNVALIDATED: 0,
    VALIDATED: 1,
    CURRENT_USER: 2
  }
  
  constructor(private api: ApiService) { }


  public removeBubble(id: number){ // user id
    return new Promise((resolve,reject)=>{
      this.api.delete(this.api.deleteBubble  + id).then(response=>{
        this.refresh().then(()=>{
          resolve();
        })
      }, err=>{
        reject(err);
      })
    })
  }

  public addBubble(bubble: any){
    return new Promise((resolve,reject)=>{
      // let params = {members: [{email: bubble.email, name: bubble.name, userstatus: bubble.userStatusName.value}]};
      console.log(bubble)
      let params = '{"members": [{"email": "' + bubble.email +'","name": "'+ bubble.name + '","userstatus": '+ bubble.userStatusName.value + ',"creatorestimate": { "Int32": ' + bubble.creatorestimate.Int32 +  ', "Valid":true}}]}'
      console.log(params)
      this.api.post(this.api.addBubbles, params).then(response=>{
        this.refresh().then(()=>{
          resolve();
        })
      }, err=>{
        reject(err);
      })
    })
  }

  private getUsers(){
    let users = new Array<User>();
    return new Promise((resolve)=>{
      this.api.get(this.api.userGraph).then((response: any)=>{
        let promises = [];
        console.log(response)
        response.forEach(u=>{
          let user = new User(u);
          let promise =  user.setGravarImg().then(()=>{
            users.push(user);
          });
          promises.push(promise);
        });
        Promise.all(promises).then(()=>{
          this.users = users;
          resolve();
        })
      }, err=>{
        this.users = users;
        resolve();
      })
    })
  }

  private getBubbles(){
    let bubbles = new Array<Bubble>();
    return new Promise((resolve)=>{
      this.api.get(this.api.bubbleGraph).then((response: any)=>{
        response.forEach(b=>{
          bubbles.push(new Bubble(b));
        });
        this.bubbles = bubbles;
        resolve();
      }, err=>{
        this.bubbles = bubbles;
        resolve();
      })
    })
  }

  public getData(){
    return new Promise((resolve)=>{
      resolve(Promise.all([this.getBubbles(), this.getUsers()]));
    })
  }

  async addCount(email: any = null){
    let params =  '{"email": "' + email + '"}'
    return await this.api.post(this.api.addProjected, params);
  }

  async subtractCount(email: any = null){
    let params =  '{"email": "' + email + '"}'
    return await this.api.post(this.api.subtractProjected, params);
  }

  refresh(){
    return new Promise((resolve)=>{
      this.getData().then(()=>{
        this.bubbles.forEach(b=>{
          this.users.forEach(u=>{
            if(u.id == b.id){
              b.name = u.name;
              b.email = u.email;
              b.img   = u.img;
            }
          })
        });
        let bubbleSizes = this.calcBubbleSizes(this.users);
        this.totalSize = bubbleSizes.totalSize;
        this.riskierSize = bubbleSizes.riskierSize;
        this.riskRate = bubbleSizes.riskRate;
        resolve();
      },err=>{
        resolve();
      })
    })
  }

  emailValid(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }


  calcBubbleSizes(users: Array<User>){
    let result = {
      totalSize: null,
      riskierSize: null,
      riskRate: null
    }
    result.totalSize =    users.reduce((prev, next) => prev + ((!next.primaryid.Valid || (next.primaryid.Int32 == next.id)) ? 1 : 0), 0) ;
    result.riskierSize   = users.reduce((prev, next) => prev + (((!next.primaryid.Valid || (next.primaryid.Int32 == next.id)) && (next.userstatus == 0)) ? 1 : 0), 0);
    result.riskRate    = "1 in " + ((result.totalSize > 0) ? (result.totalSize / result.riskierSize).toFixed(1).toString() : "0");
    return result;
  }

  getBubblesClone(){
    return cloneDeep(this.bubbles);
  }

  getChartData(name: string,id: number){
    let response = {
      "name": name,
      "id": id,
      "value": 900,
      "children": [ ]
    };
     this.bubbles.forEach(x=>{
      response.children.push({
        "name": x.name,
        "id": x.id,
        "user1id":x.user1id,
        "user2id": x.user2id,
        "value": 300,
        "children": []
      })
    });
    
    let level2 = this.bubbles.filter(x=>{
      return x.depth == 2;
    });
    
   
    
    response.children.forEach(x=>{
      let children = level2.filter(c=>{
        return c.user1id == x.user2id;
      });
      console.log(children)
      if(children.length > 0){
        x.name += " ("+ children.length + ")"
        children.forEach(c=>{
          x.children.push({
            "name": "?",
            "id": c.id,
             "user1id":c.user1id,
              "user2id": c.user2id,
            "value": 100,
            children:[]
          });
      })
     }
    })
    
    return [response];
  }

}
