import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-hidden',
  templateUrl: './hidden.page.html',
  styleUrls: ['./hidden.page.scss'],
})
export class HiddenPage implements OnInit {

  hidden: Array<any> = new Array<any>();
  constructor(private params: NavParams, private popoverCtrl: PopoverController) { }

  ngOnInit() {
    let hidden = this.params.get('hidden');
    console.log(hidden)
    this.hidden = new Array<any>();
    if(hidden){
      hidden.forEach(h=>{
        if(h.hidden){
          this.hidden.push(h);
        }
      });
      
    }
  }

  close(hasChanges: boolean = false, unhideNodes: boolean = false){
    if(!hasChanges || unhideNodes){
      this.hidden.forEach(h=>{
        h.hidden = unhideNodes ? false : true;
      })
    }
    console.log(this.hidden);
    this.popoverCtrl.dismiss({'hasChanges':hasChanges, 'hidden': this.hidden});
    this.hidden = new Array<any>();
  }

}
