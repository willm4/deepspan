import { Injectable } from '@angular/core';
import { Bubble } from '../classes/bubble';

@Injectable({
  providedIn: 'root'
})
export class BubblesService {

  bubbles: Array<Bubble> = new Array<Bubble>();

  constructor() { }

  addBubble(name: string, val: number = null){
    this.bubbles.push(new Bubble(name, val));
  }

  removeBubble(name: string){
    this.bubbles.forEach((b,index)=>{
      if(b.name == name){
        console.log(b);
        this.bubbles.splice(index, 1);
      }
    })
  }

  updateBubbles(){
    for(var i = 0; i < this.bubbles.length; i++){
      if(this.bubbles[i].delete){
        this.bubbles.splice(i, 1);
      }
      else{
        this.bubbles[i].updateBubbles();
      }
    }
  }

  removeAdded(){
    for(var i = 0; i < this.bubbles.length; i++){
      if(this.bubbles[i].added){
        this.bubbles.splice(i, 1);
      }
      else{
        this.bubbles[i].removeAdded();
      }
    }
  }


  resetDeleted(){
    this.bubbles.forEach(b=>{
      b.resetDeleted()
      
    });
  }

  getChartData(){
    let result = [];
    this.bubbles.forEach(b=>{
      result.push(b.getChartData());
    });

    return result;
  }

}
