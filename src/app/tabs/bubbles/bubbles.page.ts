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
import { Router, NavigationEnd, RouterEvent } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
declare var vis: any;
am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-bubbles',
  templateUrl: './bubbles.page.html',
  styleUrls: ['./bubbles.page.scss'],
})
export class BubblesPage implements OnDestroy {
  nodes: Array<any> = new Array<any>();
  edges: Array<any> = new Array<any>();
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
  bubbles: Array<Bubble> = new Array<Bubble>();
  gettingData: boolean = false;
  network: any;
  graphdata: any;
  options: any;
  chartHeightCheckInterval;

  constructor(public zone:NgZone
    , public modalCtrl: ModalController
    , public userCtrl: UserService
    , public bubbleCtrl: BubblesService
    , public app: AppService
    ,public popoverCtrl: PopoverController
    , private alertCtrl:AlertController
    , private toastCtrl: ToastController
    , private router: Router) { 
      this.router.events.subscribe((event: NavigationEnd)=>{
        if(event.url && event.url.includes('/tabs') && this.router.getCurrentNavigation().extractedUrl){
          if(!this.gettingData){
            this.app.statuses.push('EVENT URL ' + event.url)
            this.gettingData = true;
            setTimeout(()=>{
              this.initialize();
            }, 2000)
            setTimeout(()=>{
              this.gettingData = false;
            }, 5000)
          }
        }
      })
      
  }

  ngOnDestroy(){
    this.gettingData = false;
    if(this.network){
      this.network.destroy();
    }
  }

  ionViewDidEnter(){
    this.initialize();
  }

  initialize(){
    if(!this.userCtrl.ipc){
      this.userCtrl.setIPC();
    }
    if(this.bubbleCtrl.bubbles.length == 0 || this.bubbleCtrl.users.length == 0){
      this.refreshBubbles()
    }
    else{
      this.drawBubbles();
    }
  }

  refreshBubbles(){
    this.bubbleCtrl.refresh().then(response=>{
      this.app.statuses.push('refreshed bubble data');
      this.drawBubbles();
    }, err=>{
      console.log(err);
    })
  }

  hideNode(i) { 
    let obj = this.graphdata.nodes.get(i);
    obj.hidden = true
    this.graphdata.nodes[i] = obj;
    this.cleanGraph();
}

indexfromnodeid(nodeid) {
  return (this.nodes.findIndex((element, index) => { if (element.id == nodeid){ return true}}, nodeid))
  //return (this.nodes.filter((element, index) => { if (element.id == nodeid){ return true}}, nodeid)) 
}


cleanGraph () {
  // console.log("==Reset Visited Flags")
  for (var i = 0; i < this.nodes.length; i++){
    let obj = this.nodes[i];
      if(obj){
        obj.flag = false
        this.nodes[i] = obj;
      }
  }
  // console.log("==DFS")
  //DFS walk from user to mark up graph that is visible, everything unflagged is separated from user
  let stack = []
  let n = this.indexfromnodeid(this.userCtrl.user.id)
  // console.log("push: ", n)
  stack.push(n)
  while (stack.length > 0) {
      n = stack.pop()
      // console.log("pop: ", n, ", ", this.nodes[n].label)
      if (!this.nodes[n].flag) {
          this.nodes[n].flag = true
          // console.log("visited: ", n, ", ", this.nodes[n].label)
          for (var e = 0; e < this.edges.length; e++) {
            let edge = this.edges[e];
            if(edge){
              let nto = this.indexfromnodeid(edge.to)
              let nfrom = this.indexfromnodeid(edge.from)
              if ((edge.from == this.nodes[n].id) && (!this.nodes[nto].hidden)) {
                  // console.log("To push: ", nto, ", ", this.nodes[nto].label)
                  stack.push(nto)
              } else if ((edge.to == this.nodes[n].id) && (!this.nodes[nfrom].hidden)) {
                  // console.log(nodes"From push: ", nfrom, ", ", this.nodes[nfrom].label)
                  stack.push(nfrom)
              }
            }
          }
      }
  }
  // console.log("==Clean Pass")
  //second pass to clean all unflagged
  for (i = 0; i < this.nodes.length; i++){
      let obj = this.nodes[i]
      // console.log("nodestat: ", obj.label, " = ",obj.flag ? "flagged" : "unflagged")
      if (obj && !obj.flag) {                
          obj.hidden = true
      }
  }
  this.graphdata = {
    nodes: new vis.DataSet(this.nodes),
    edges: new vis.DataSet(this.edges)
  };
  this.drawBubbles(false);
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



  resetBubbleData(){
    this.nodes = this.bubbleCtrl.users.map(user => ({id: user.id, label: user.avatarLabel,   shape: "circularImage", image: user.img, color: "#"+ user.avatarBackground, border: "#" + user.avatarBackground}));
    this.edges = this.bubbleCtrl.bubbles.map(bubble => ({id: bubble.id, from: bubble.user1id, to: bubble.user2id, arrows: 'to'}));
    this.graphdata = {
        nodes: new vis.DataSet(this.nodes),
        edges: new vis.DataSet(this.edges)
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
  }
  drawBubbles(resetData: boolean = true){
    if(resetData){
      this.resetBubbleData();
    }
    if(this.network){
      this.network.destroy();
    }
    this.network = new vis.Network(this.bubbleschart.nativeElement, this.graphdata, this.options);

  
    this.network.on( 'click', (properties)=> {
      var ids = properties.nodes;
      var clickedNodes = this.graphdata.nodes.get(ids);
     this.editNode(clickedNodes[0])
     //this.hideNode(ids[0]);
    });
    this.hasData = true;
    this.app.statuses.push('bub chart height ' + this.bubchartcontainer.nativeElement.scrollHeight)
    let chartHeight = this.bubchartcontainer.nativeElement.scrollHeight;
    if(this.chartHeightCheckInterval ){
      clearInterval(this.chartHeightCheckInterval );
    }
    if(chartHeight && chartHeight > 0){
      this.bubChartHeight = this.bubchartcontainer.nativeElement.scrollHeight + 'px'
    }
    else{
      this.chartHeightCheckInterval = setInterval(()=>{
        chartHeight = this.bubchartcontainer.nativeElement.scrollHeight;
        let bubChartHeight = this.bubbleschart.nativeElement.height;
        if(chartHeight && this.chartHeight > 0){
          clearInterval(this.chartHeightCheckInterval);
          this.bubChartHeight = chartHeight + 'px';
          this.network.destroy();
          this.network = new vis.Network(this.bubbleschart.nativeElement, this.graphdata, this.options);
        }
      })
    }
  }




   async editNode(node: any){ // {id, name}
   let user = new User();
    if(node){
      let users = this.bubbleCtrl.users.filter(u=>{
        return u.id == node.id
      });
      if(users && users.length > 0){
        user = this.userCtrl.setExternalUserData(users[0]);
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
