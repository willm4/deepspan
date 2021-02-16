import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams, ModalController } from '@ionic/angular';
import { Bubble } from 'src/app/classes/bubble';
import { Router } from '@angular/router';
import { BubblesService } from 'src/app/services/bubbles.service';

@Component({
  selector: 'app-add-bubble',
  templateUrl: './add-bubble.page.html',
  styleUrls: ['./add-bubble.page.scss'],
})
export class AddBubblePage implements OnInit {

  bubbles: Array<Bubble> = new Array<Bubble>();
  constructor(public modal: ModalController, private navParams: NavParams, private router: Router, private bubblesCtrl: BubblesService) { 
    let bubbles = this.navParams.get('bubbles');
    this.bubbles = bubbles;
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
    this.bubblesCtrl.bubbles = this.bubbles;
    this.modal.dismiss(this.bubbles)
  }

}
