import { Component, OnInit, Input } from '@angular/core';
import { Bubble } from 'src/app/classes/bubble';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'bubble-edit',
  templateUrl: './bubble-edit.component.html',
  styleUrls: ['./bubble-edit.component.scss'],
})



export class BubbleEditComponent implements OnInit {
  
  @Input() bubble: Bubble;
  @Input() index: number;

  constructor(private alertCtrl: AlertController) { 
    
  }



  removeBubble(index){
    this.removeBubble(index);
  }

  async addBubble(){
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'ADD BUBBLE',
      message: 'ADD CONNECTION TO ',
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

          }
        }
      }]
    });

    await alert.present();
  }



  ngOnInit() {}

}
