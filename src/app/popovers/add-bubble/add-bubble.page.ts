import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams, ModalController } from '@ionic/angular';
import { Bubble } from 'src/app/classes/bubble';

@Component({
  selector: 'app-add-bubble',
  templateUrl: './add-bubble.page.html',
  styleUrls: ['./add-bubble.page.scss'],
})
export class AddBubblePage implements OnInit {

  bubbles: Array<Bubble> = new Array<Bubble>();
  constructor(public modal: ModalController, private navParams: NavParams) { 
    let bubbles = this.navParams.get('bubbles');
    this.bubbles = bubbles;
  }

  ionViewDidEnter(){
    this.bubbles = this.navParams.get('bubbles');
  }

  ngOnInit() {
  }

  goBack(){
    this.modal.dismiss();
  }

  removeBubble(bub){
    console.log(bub);
  }

  saveBubbles(){
    this.modal.dismiss(this.bubbles)
  }

}
