import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { BubblesService } from 'src/app/services/bubbles.service';

@Component({
  selector: 'app-hidden',
  templateUrl: './hidden.page.html',
  styleUrls: ['./hidden.page.scss'],
})
export class HiddenPage implements OnInit {

  hidden: Array<any> = new Array<any>();
  constructor(private params: NavParams, private popoverCtrl: PopoverController, public bubbleCtrl: BubblesService) { }

  ngOnInit() {
    let hidden = this.params.get('hidden');
    console.log(hidden)
    this.hidden = this.bubbleCtrl.hidden;
  }

  unhideSingleNode(id){
    console.log("entered unhide single node and id is " + id);
    this.hidden.forEach((h,index)=>{
      console.log("id is " + h.id)
      if(h.id == id){
        h.hidden = false;
        this.hidden.splice(index,1)
      }
    })
  }

  close(hasChanges: boolean = false, unhideNodes: boolean = false){
    if(unhideNodes){
      this.bubbleCtrl.hidden = new Array<any>();
    }
    console.log(this.hidden);
    this.popoverCtrl.dismiss({'hasChanges':hasChanges});
    //this.hidden = new Array<any>();
  }

}
