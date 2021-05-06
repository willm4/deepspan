import { UserService } from 'src/app/services/user.service';
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
  hidden: Array<any> = new Array<any>(); // Jack - added hidden array here so we can keep track of what was hidden even we chane tabs
  userTypes = {
    UNVALIDATED: 0,
    VALIDATED: 1,
    CURRENT_USER: 2
  }

  constructor(private api: ApiService) { }




  private getMerged(primary, nodes){
    let merged = [];
    if(primary > 0){
      nodes.forEach(n => {
        if(n.primaryid == primary && n.primaryid != n.id){
          merged.push(n);
        }
      });
    }
    return merged;
  }

  private primary(node) {
    if (node.primaryid.Valid) {
        return (node.primaryid.Int32)
    } else {
        return(-1)
    }
  }

  private generateNode(user: User){
    return {id: user.id, label: user.avatarLabel,   shape: "circularImage", image: user.img, color: "#"+ user.avatarBackground, border: "#" + user.avatarBackground, primaryid: this.primary(user), merged: []}
  }

  public getNodes(){
    let nodes = this.users.map(user => (this.generateNode(user)));
    nodes.forEach((n:any)=>{
      if(n.primaryid > 0){
        n.merged = this.getMerged(n.primaryid, nodes);
      }
    });
    return nodes
  }

  public getEdges(){
    return this.bubbles.map(bubble => ({id: bubble.id, from: bubble.user1id, to: bubble.user2id, arrows: 'to'}));
  }

  public getPrimaries(nodes){
    var primaries = new Set()
    for (var i=0; i < nodes.length; i++) {
        if ((nodes[i].primaryid > 0) && (nodes[i].id == nodes[i].primaryid)) {
            primaries.add(nodes[i]);
        }
    }
    return primaries;
  }

  private indexfromnodeid(nodes,nodeid) {
    return (nodes.findIndex((element, index) => { if (element.id == nodeid){ return true}}, nodeid))
  }


  public cleanGraph (nodes,edges, userid) {
    for (var i = 0; i < nodes.length; i++){
      let obj = nodes[i];
        if(obj){
          obj.flag = false
          nodes[i] = obj;
        }
    }
    let stack = []
    let n = this.indexfromnodeid(nodes,userid)
    stack.push(n)
    while (stack.length > 0) {
        n = stack.pop()
        if (!nodes[n].flag) {
            nodes[n].flag = true
            for (var e = 0; e < edges.length; e++) {
              let edge = edges[e];
              if(edge){
                let nto = this.indexfromnodeid(nodes,edge.to)
                let nfrom = this.indexfromnodeid(nodes,edge.from)
                if ((edge.from == nodes[n].id) && (!nodes[nto].hidden)) {
                    stack.push(nto)
                } else if ((edge.to == nodes[n].id) && (!nodes[nfrom].hidden)) {
                    stack.push(nfrom)
                }
              }
            }
        }
    }
    for (i = 0; i < nodes.length; i++){
        let obj = nodes[i]
        if (obj && !obj.flag) {
            obj.hidden = true
        }
    }
    return {
      nodes: nodes,
      edges: edges
    }
  }

  public getOptions(){
    return {
      nodes:{
          borderWidth: 5,
          font: '15px SFPRO #222428',
          color: {
              background: '#50c8ff',
              highlight: {
                  background: '#62ceff'
              }
          }
      }
    }
  }



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

   submitMerge(email: any, password: any){
    let params = JSON.stringify({
      email: email,
      password: password
    });
    return new Promise((resolve,reject)=>{
      this.api.post(this.api.merge, params).then(()=>{
        this.refresh().then(()=>{
          resolve();
        })
      }, err=>{
        console.log(err);
        reject(err);
      })
    })
  }

  public addBubble(bubble: any){
    return new Promise((resolve,reject)=>{
      // let params = {members: [{email: bubble.email, name: bubble.name, userstatus: bubble.userStatusName.value}]};
      let params = '{"members": [{"email": "' + bubble.email +'","name": "'+ bubble.name + '","userstatus": '+ bubble.userStatusName.value + ',"creatorestimate": { "Int32": ' + bubble.creatorestimate.Int32 +  ', "Valid":true}}]}'

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
        if(response){ //Jack - only add if there is a response so it doesn't crash (may want to have let the user know what the error was)
          response.forEach(u=>{
            let user = new User(u);
            let promise =  user.setGravarImg().then(()=>{
              users.push(user);
            });
            promises.push(promise);
          });
        }
        console.log('setting users')
        Promise.all(promises).then(()=>{
          console.log("promises fullfilled");
          this.users = users;
          resolve();
        })
      }, err=>{
        console.log("error was " + JSON.stringify(err));
        this.users = users;
        resolve();
      })
    })
  }

  private getBubbles(){
    let bubbles = new Array<Bubble>();
    return new Promise((resolve)=>{
      this.api.get(this.api.bubbleGraph).then((response: any)=>{
        if(response){ //Jack - only add if there is a response so it doesn't crash (may want to have let the user know what the error was)
          console.log("get bubbles " + JSON.stringify(response));
          response.forEach(b=>{
            bubbles.push(new Bubble(b));
          });
          this.bubbles = bubbles;
          resolve();
        }
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
