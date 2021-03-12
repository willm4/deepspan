import { Component, OnInit, OnDestroy, AfterViewInit, NgZone, ElementRef, ViewChild } from '@angular/core';

// amCharts imports
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4plugins_forceDirected from "@amcharts/amcharts4/plugins/forceDirected"; 
import { ModalController, AlertController, ToastController, PopoverController } from '@ionic/angular';
import { Bubble } from 'src/app/classes/bubble';
import { AppService } from 'src/app/services/app.service';
import { EditbubblePage } from 'src/app/components/popovers/editbubble/editbubble.page';
import { User } from 'src/app/classes/user';
import { BubblesService } from 'src/app/services/bubbles.service';
declare var vis: any;
am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-bubbles',
  templateUrl: './bubbles.page.html',
  styleUrls: ['./bubbles.page.scss'],
})
export class BubblesPage {
  bubChartHeight: string = '100px';
  connections = [
    'Spouse/S.O',
    'Family',
    "Roommate",
    "Non-Resident Family",
    "Friend/Colleague"
  ];
  covidStatuses = [
    "Unknown",
    "Symptomatic",
    "Infected",
    "Previous Infection",
    "Vaccinated"
  ];
  privacy = [
    "Show only Bubble #",
    "Show Full Bubble",
    "Don't Show Anything"
  ];
  @ViewChild("bubbleschart") bubbleschart: ElementRef;
  @ViewChild("bubchartcontainer") bubchartcontainer: ElementRef;
  chartHeight: number = 300;
  chart: am4plugins_forceDirected.ForceDirectedTree;
  editing: boolean = false;
  bubbleEditType: string = 'add';
  newBubble: Bubble = new Bubble();
  bubbleEdit: Bubble = new Bubble();
  hasData: boolean = false;
  loadingBubbles: boolean = false;
  bubbles: Array<Bubble> = new Array<Bubble>();

  network: any;
  graphdata: any;
  options: any;

  constructor(public zone:NgZone
    , public modalCtrl: ModalController
    , public app: AppService
    ,public popoverCtrl: PopoverController
    , private alertCtrl:AlertController
    , private toastCtrl: ToastController) { 

  }

  ionViewDidEnter(){
    if(!this.app.ipc){
      this.app.setIPC();
    }
    if(!this.hasData){
      this.refreshBubbles();
    }
  }

  nodeColor(user: User) {
    if (user.userType == this.app.bubbleCtrl.userTypes.CURRENT_USER) {
        return ("#00FF00")
    } else if (user.userType == this.app.bubbleCtrl.userTypes.UNVALIDATED) {
        return ("#D9D9D9")
    } else {
        return("#97C2FC")
    }
};

  refreshBubbles(){
    this.app.bubbleCtrl.refresh().then(response=>{
      this.drawBubbles();
    }, err=>{
      console.log(err);
    })
  }

  hideNode(index) { 
    let obj = this.graphdata.nodes.get(index);
    // obj.color = "#DD0000"
    obj.hidden = true
    console.log(obj);
    this.graphdata.nodes[index] = obj;
    this.network.destroy();
    this.network = new vis.Network(this.bubbleschart.nativeElement, this.graphdata, this.options);
    this.network.on( 'click', (properties)=> {
      var ids = properties.nodes;
      var clickedNodes = this.graphdata.nodes.get(ids);
      this.editNode(clickedNodes[0])
  });
}
// unhideNodes() {
//     for(var i = 0; i < this.graphdata.nodes.length; i++){
//         let obj = this.graphdata.nodes[i]
//         // obj.color = "#DD0000"
//         obj.hidden = false
//         console.log(obj)
//         this.graphdata.nodes[i] = obj;

//     }
// }

  drawBubbles(){
    var anodes = this.app.bubbleCtrl.users.map(user => ({id: user.id, label: user.name,   shape: "circularImage", image: user.img, color: this.nodeColor(user), border: this.nodeColor(user)}));
    var aedges = this.app.bubbleCtrl.bubbles.map(bubble => ({from: bubble.user1id, to: bubble.user2id, arrows: 'to'}));
    this.graphdata = {
        nodes: new vis.DataSet(anodes),
        edges: new vis.DataSet(aedges)
    };
    this.options = {
      nodes:{
          borderWidth: 5,
          font: '15px SFPRO #222428',
          color: {
              background: '#50c8ff',
              highlight: {
                  background: '#62ceff'
              }
          }
      }
  }
   if(this.network){
    this.network.destroy();
   }
    this.network = new vis.Network(this.bubbleschart.nativeElement, this.graphdata, this.options);
    this.bubChartHeight = this.bubchartcontainer.nativeElement.scrollHeight + 'px'
    this.network.on( 'click', (properties)=> {
      var ids = properties.nodes;
      var clickedNodes = this.graphdata.nodes.get(ids);
     this.editNode(clickedNodes[0])
     //this.hideNode(ids[0]);
  });
    this.hasData = true;
  }




   async editNode(node: any){ // {id, name}
   let user = new User();
    if(node){
      let users = this.app.bubbleCtrl.users.filter(u=>{
        return u.id == node.id
      });
      if(users && users.length > 0){
        user = this.app.userCtrl.setExternalUserData(users[0]);
      }
    }
    if(node){
      const popover = await this.popoverCtrl.create({
        component: EditbubblePage,
        showBackdrop: true,
        componentProps:{
          node: node,
          user: user
        }
      });
      await popover.present();
      await popover.onDidDismiss().then((response: any)=>{
        console.log(response.data);
        if(response.data.hasChanges){
          if(response.data.hideNode){
            this.hideNode(node.id)
          }
          else{
            this.drawBubbles();
          }
        }
        else if(response.data.hideNode){
          this.hideNode(node.id)
        }
      })
    }
  }

  async addBubble(){
    const popover = await this.popoverCtrl.create({
      component: EditbubblePage,
      showBackdrop: true,
      componentProps:{
      }
    });
    await popover.present();
    await popover.onDidDismiss().then((response: any)=>{
      if(response.data.hasChanges){
        this.drawBubbles();
      }
    })
  }



}
