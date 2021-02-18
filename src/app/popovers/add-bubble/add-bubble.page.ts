import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams, ModalController, AlertController } from '@ionic/angular';
import { Bubble } from 'src/app/classes/bubble';
import { Router } from '@angular/router';
import { BubblesService } from 'src/app/services/bubbles.service';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-add-bubble',
  templateUrl: './add-bubble.page.html',
  styleUrls: ['./add-bubble.page.scss'],
})
export class AddBubblePage implements OnInit {


  constructor(public modal: ModalController, private navParams: NavParams, private router: Router, private app: AppService, private alertCtrl: AlertController) {  }


  ngOnInit() {
  }

  goBack(){
    this.modal.dismiss();
  }

  saveBubbles(){
    this.modal.dismiss(true)
  }

  removeBubble(index){
    this.app.bubbleCtrl.bubbles.splice(index, 1);
  }

  async addBubble(){
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'ADD BUBBLE',
      message: 'CREATE NEW BUBBLE',
      inputs:[        {
        name: 'bubblename',
        type: 'text',
        id: 'bubblename',
        value: '',
        placeholder: 'Enter Name'
      }],
      buttons: ['CANCEL',
      {
        text: 'ADD',
        cssClass: 'secondary',
        handler: (alertData) => {
          if(alertData.bubblename){
            // let newBub = new Bubble(alertData.bubblename.toUpperCase(), 60);
            // this.app.bubbleCtrl.bubbles.push(newBub)
          }
        }
      }]
    });

    await alert.present();
  }

}
