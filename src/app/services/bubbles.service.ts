import { Injectable } from '@angular/core';
import { Bubble } from '../classes/bubble';
import * as cloneDeep from 'lodash/cloneDeep';

@Injectable({
  providedIn: 'root'
})
export class BubblesService {

  bubbles: Array<Bubble> = new Array<Bubble>();
  depth: Array<Bubble> = new Array<Bubble>();
  size: number = 0;
  constructor() { }

  addBubble(bubble: Bubble){
    this.bubbles.push(bubble);
  }

  removeBubble(id: number){
    this.bubbles.splice(this.bubbles.map(function(x) {return x.id; }).indexOf(id), 1);
  }

  refresh(bubData: any){
    let bubbles = new Array<Bubble>();
    let depth = new Array<Bubble>();
    if(bubData.core){
      bubData.core.forEach(bubble => {
        bubbles.push(new Bubble(bubble))
      });
    }
    if(bubData.depth){
      bubData.depth.forEach(bubble => {
        let newBub = new Bubble(bubble);
        depth.push(newBub)
      });
    }
    this.bubbles = bubbles;
    this.depth = depth;
  }

  getBubblesClone(){
    return cloneDeep(this.bubbles);
  }

  getChartData(name: string, id: number){ // ID AND NAME OF USER, USED TO SET USER BUBBLE

    let userBubble =    {  
      "name": name,
      "id": id,
      "value":900,
      "children":[  ],
      "linkWith": []
    };
    // ADD BUBBLES FROM CHILDREN
    this.bubbles.forEach(coreBubData=>{
      let childBub = {  
        "name":coreBubData.name ?? coreBubData.id,
        "value":600,
        "id": coreBubData.id,
        "u1id": coreBubData.user1id,
        "u2id": coreBubData.user2id,
        "linkWith":[ ],
        "children": [ ]
      };
      if(childBub.u1id == userBubble.id){
        userBubble.children.push(childBub);
      }
    });


    userBubble.children.forEach(childBub=>{
      let links = [];
      userBubble.children.filter(c=>{ return childBub.user1id == c.u1id }).map(c=>{
        links.push(c.name);
      });
      childBub.linkWith = links;

      this.depth.forEach(deepBubData =>{
        let depthBub = {  
          "name": 'N/A_' + deepBubData.id,
          "value":300,
          "id": deepBubData.id,
          "u1id": deepBubData.user1id,
          "u2id": deepBubData.user2id,
          "linkWith":[ ],
          "children": [ ]
        };
        if(depthBub.id != childBub.id){
          if(depthBub.u2id == childBub.u2id){
            childBub.children.push(depthBub);
          }
          if(depthBub.u1id == childBub.u1id){
            childBub.linkWith.push(depthBub.name);
           
          }
        }
        
      })



    });

    let size = userBubble.children.length;
    userBubble.children.forEach(c=>{
      size += c.children.length;
    });
    this.size = size;


    return [userBubble];
  }

}
