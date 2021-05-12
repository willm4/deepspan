import { Bubble } from './../../classes/bubble';
import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { BubblesService } from 'src/app/services/bubbles.service';

@Component({
  selector: 'app-hidden',
  templateUrl: './hidden.page.html',
  styleUrls: ['./hidden.page.scss'],
})
export class HiddenPage implements OnInit {

//Jack - injected bubble service so the bubble service can handle who is hidden (however if we want hidden to remain after app is closed we will need to pass to server)

  hidden: Array<any> = new Array<any>();
  isBubblesTab: boolean;
  didUnhide: boolean;

  constructor(private params: NavParams, private popoverCtrl: PopoverController, public bubbleCtrl: BubblesService) { }

  ngOnInit() {
    // let hidden = this.params.get('hidden');
    // console.log(hidden)
    this.didUnhide = false;
    this.isBubblesTab = this.params.get('isBubblesTab');
    console.log("opened from bubbles tab: " + this.isBubblesTab)
    if(this.isBubblesTab){
      console.log("opened from bubbles tab")
      this.hidden = this.bubbleCtrl.hidden;
    } else {
      this.hidden = this.bubbleCtrl.hiddenScenarios;
    }

  }

  unhideSingleNode(id){
    console.log("entered unhide single node and id is " + id);
    this.hidden.forEach((h,index)=>{
      console.log("id is " + h.id)
      if(h.id == id){
        h.hidden = false;
        this.hidden.splice(index,1)
        this.didUnhide = true;
      }
    })
  }

  close(hasChanges: boolean = false, unhideNodes: boolean = false){
    if(unhideNodes){
      if(this.isBubblesTab){
        this.bubbleCtrl.hidden = new Array<any>();;
      } else {
        this.bubbleCtrl.hiddenScenarios = new Array<any>();;
      }
    }
    console.log(this.hidden);
    console.log("were there changes: " + hasChanges);
    this.popoverCtrl.dismiss({'hasChanges':hasChanges});
    //this.hidden = new Array<any>();
  }

}
