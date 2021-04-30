import { Component, OnInit, OnDestroy, AfterViewInit, NgZone, ElementRef, ViewChild } from '@angular/core';

// amCharts imports
import { ModalController, AlertController, ToastController, PopoverController } from '@ionic/angular';
import { Bubble } from 'src/app/classes/bubble';
import { AppService } from 'src/app/services/app.service';
import { EditbubblePage } from 'src/app/components/popovers/editbubble/editbubble.page';
import { User } from 'src/app/classes/user';
import { BubblesService } from 'src/app/services/bubbles.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { HiddenPage } from 'src/app/popovers/hidden/hidden.page';
declare var vis: any;
import * as cloneDeep from 'lodash/cloneDeep';

@Component({
  selector: 'app-bubbles',
  templateUrl: './bubbles.page.html',
  styleUrls: ['./bubbles.page.scss'],
})
export class BubblesPage implements OnDestroy {
  nodes: Array<any> = new Array<any>();
  edges: Array<any> = new Array<any>();
  bubChartHeight: string = '100px';
  hidden: Array<any> = new Array<any>();

  @ViewChild("bubbleschart") bubbleschart: ElementRef;
  @ViewChild("bubchartcontainer") bubchartcontainer: ElementRef;
  chartHeight: number = 300;
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
    , private router: Router
    , private route: ActivatedRoute) {

      this.route.queryParams
      .subscribe(params=>{
        if(params.refresh){
          this.initialize();
        }
      });
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
      this.hidden = new Array<any>();
      this.drawBubbles();
    }
  }

  refreshBubbles(){
    this.bubbleCtrl.refresh().then(response=>{
      this.hidden = new Array<any>();
      this.drawBubbles();
    }, err=>{
      console.log(err);
    })
  }

  hideNode(i) {
    let obj = this.graphdata.nodes.get(i);
    obj.hidden = true
    this.hidden.push(obj);
    this.graphdata.nodes[i] = obj;
    this.cleanGraph();
}

  unhideNode(i) {
    let obj = this.graphdata.nodes.get(i);
    obj.hidden = false;
    console.log(obj);
    this.graphdata.nodes[i] = obj;
    this.cleanGraph();
  }

cleanGraph () {
  let cleanData = this.bubbleCtrl.cleanGraph(this.nodes,this.edges,this.userCtrl.user.id);
  this.graphdata = {
    nodes: new vis.DataSet(cleanData.nodes),
    edges: new vis.DataSet(cleanData.edges)
  };
  this.drawBubbles(false);
}




  clusterbyprimary() {
    console.log('clustering')
    let primaries = this.bubbleCtrl.getPrimaries(this.nodes);
    var clusterOptionsByData;
    for (let primary of primaries) {
        let pstr = primary['primaryid'].toString() + " #"  //vis.js needs this
        let node = cloneDeep(primary);
        node.id = pstr;
        clusterOptionsByData = {
          joinCondition:  (childOptions)=> {
              return childOptions.primaryid == primary['primaryid'];
          },
          clusterNodeProperties: node
        };
        this.network.cluster(clusterOptionsByData);
    }
}


  resetBubbleData(){
    this.hidden = new Array<any>();
    this.nodes = this.bubbleCtrl.getNodes();
    this.edges = this.bubbleCtrl.getEdges()
    this.graphdata = {
        nodes: new vis.DataSet(this.nodes),
        edges: new vis.DataSet(this.edges)
    };
    this.options = this.bubbleCtrl.getOptions();
  }

  drawBubbles(resetData: boolean = true){
    if(resetData || this.nodes.length == 0){
      this.resetBubbleData();
    }
    if(this.network){
      this.network.destroy();
    }
    this.network = new vis.Network(this.bubbleschart.nativeElement, this.graphdata, this.options);
    this.clusterbyprimary();

    this.network.on( 'selectNode', (properties)=>{
      console.log(properties)
      var ids = properties.nodes;
      if(ids && ids.length > 0){
        let id = ids[0];
        if(typeof id == 'string'){
          id = Number(id.replace(' #', ""));
        }
        let clickedNode = this.graphdata.nodes.get(id);
        this.editNode(clickedNode)
      }
    });
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
        if(response && response.data && response.data.hasChanges){
          console.log(response.data);
          if(response.data.hideNode){
            this.hideNode(node.id)
          }
          else{
            this.drawBubbles();
          }
        }
        else if(response.data && response.data.hideNode){
          this.hideNode(node.id)
        }
      })
    }
  }



  async viewHidden(){
    const popover = await this.popoverCtrl.create({
      component: HiddenPage,
      showBackdrop: true,
      componentProps:{
        hidden: cloneDeep(this.hidden)
      }
    });
    await popover.present();
    await popover.onDidDismiss().then((response: any)=>{
      if(response.data && response.data.hasChanges){
        let newHidden = new Array<any>();
        let hidden = response.data.hidden;
        for(var i = 0; i < hidden.length; i++){
          if(!hidden[i].hidden){
            this.unhideNode(hidden[i].id);
          }
          else{
            newHidden.push(hidden[i]);
          }
        }
        console.log(newHidden)
        this.hidden = newHidden;
        this.drawBubbles();
      }
    })
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
