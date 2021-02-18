import { Injectable } from '@angular/core';
import { Bubble } from '../classes/bubble';

@Injectable({
  providedIn: 'root'
})
export class BubblesService {

  bubbles: Array<Bubble> = new Array<Bubble>();

  constructor() { }

  addBubble(bubble: Bubble){
    this.bubbles.push(bubble);
  }

  removeBubble(id: number){
    this.bubbles.splice(this.bubbles.map(function(x) {return x.id; }).indexOf(id), 1);
  }

  refresh(bubs: any){
    let bubbles = new Array<Bubble>();
    if(bubs){
      bubs.forEach(bubble => {
        bubbles.push(new Bubble(bubble))
      });
    }
    this.bubbles = bubbles;
  }

  getChartData(email: string){
    let userData =    {  
      "name": email,
      "value":100,
      "children":[  
    
      ]
    };
    this.bubbles.forEach(d=>{
      userData.children.push(
        {  
          "name":d.email,
          "value":50,
          "linkWith":[ ]
      }
      );
    });
    userData.children.forEach(d=>{
      let links = [];
      userData.children.filter(c=>{ return c.name != d.name }).map(c=>{
        links.push(c.name);
      });
      d.linkWith = links
    });
    return [userData];
  }

}
