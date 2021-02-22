import { Injectable } from '@angular/core';
import { Bubble } from '../classes/bubble';

@Injectable({
  providedIn: 'root'
})
export class BubblesService {

  bubbles: Array<Bubble> = new Array<Bubble>();
  level1: Array<Bubble> = new Array<Bubble>();
  constructor() { }

  addBubble(bubble: Bubble){
    this.bubbles.push(bubble);
  }

  removeBubble(id: number){
    this.bubbles.splice(this.bubbles.map(function(x) {return x.id; }).indexOf(id), 1);
  }

  refresh(bubData: any){

    let bubbles = new Array<Bubble>();
    let level1 = new Array<Bubble>();
    if(bubData.core){
      bubData.core.forEach(bubble => {
        bubbles.push(new Bubble(bubble))
      });
    }
    if(bubData.depth){
      bubData.depth.forEach(bubble => {
        let newBub = new Bubble(bubble);
        level1.push(newBub)
      });
    }
    this.bubbles = bubbles;
    this.level1 = level1;
  }

  getChartData(name: string, id: number){
    let userData =    {  
      "name": name,
      "id": id,
      "value":500,
      "children":[  
      ]
    };
    this.bubbles.forEach(d=>{
      let newBub = {  
        "name":d.name ?? d.id,
        "value":300,
        "id": d.id,
        "linkWith":[ ],
        "children": [ ]
      };
      
      /// LINK BUBBLES TO USER HERE, PASS BUBBLE TO PARAMS 

      // let links = [];
      // userData.children.filter(c=>{ return c.id != d.id }).map(c=>{
      //   links.push(c.name);
      // });
      // newBub.linkWith = links

      this.level1.forEach(b=>{
        if(b.id == d.id){
          newBub.children.push({
            "name":"?",
            id: b.id,
            "value":300
          });
        }
      });
      userData.children.push(newBub);
    });
    userData.children.forEach(d=>{

      // let links = [];
      // userData.children.filter(c=>{ return c.id != d.id }).map(c=>{
      //   links.push(c.name);
      // });
      // d.linkWith = links
    });
    return [userData];
  }

}
