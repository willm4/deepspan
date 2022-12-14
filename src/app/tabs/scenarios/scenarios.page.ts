import { Component, OnInit, OnDestroy, AfterViewInit, NgZone, ElementRef, ViewChild } from '@angular/core';


import { ModalController, AlertController, ToastController, PopoverController } from '@ionic/angular';
import { Bubble } from 'src/app/classes/bubble';
import { AppService } from 'src/app/services/app.service';
import { Router, NavigationEnd } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { BubblesService } from 'src/app/services/bubbles.service';
import { EditbubblePage } from 'src/app/components/popovers/editbubble/editbubble.page';
import { User } from 'src/app/classes/user';
import { HiddenPage } from 'src/app/popovers/hidden/hidden.page';
declare var vis: any;
import * as cloneDeep from 'lodash/cloneDeep';


@Component({
  selector: 'app-scenarios',
  templateUrl: './scenarios.page.html',
  styleUrls: ['./scenarios.page.scss'],
})
export class ScenariosPage implements OnDestroy {

  nodes: Array<any> = new Array<any>();
  edges: Array<any> = new Array<any>();
  bubChartHeight: string = '100px';
  subtractedList: Array<number> = new Array<number>();
  //hidden: Array<any> = new Array<any>(); Jack - no need

  @ViewChild("scenarioschart") bubbleschart: ElementRef;
  @ViewChild("scenarioschartcontainer") bubchartcontainer: ElementRef;
  chartHeight: number = 300;
  bubbles: Array<Bubble> = new Array<Bubble>();
  gettingData: boolean = false;
  network: any;
  graphdata: any;
  options: any;
  projected: any;
  chartHeightCheckInterval;
  newEmail: string = null;

  constructor(public zone:NgZone
    , public modalCtrl: ModalController
    , public app: AppService
    , public userCtrl:UserService
    , public bubbleCtrl: BubblesService
    , public router: Router
    , public popoverCtrl:PopoverController
    , private alertCtrl:AlertController
    , private toastCtrl: ToastController) {
      //this.hidden = bubbleCtrl.hiddenScenarios;
      this.resetEdits();
  }

  ngOnDestroy(){
    this.gettingData = false;
    if(this.network){
      this.network.destroy();
    }
  }

  async promptToast(message: string, color: string){
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom',
      buttons: [ {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }


  addCount(){
    if(!this.bubbleCtrl.emailValid(this.newEmail)){
      this.promptToast("Please enter a valid email.", "danger");
    }
    else{
      this.bubbleCtrl.addCount(this.newEmail).then((data:any)=>{
        this.promptToast(this.newEmail + " added!", "success");
        let addedUser = this.bubbleCtrl.users.find(e => e.email == this.newEmail)
        console.log("subtracted user id is: " + addedUser.id);
        this.graphdata.nodes.update({id: addedUser.id, color: "#"+ addedUser.avatarBackground, border: "#" + addedUser.avatarBackground});
        this.subtractedList.splice(this.subtractedList.indexOf(addedUser.id));
        this.newEmail = null;
        this.handleProposed(data);
      }, err=>{
        this.promptToast("Error adding " + this.newEmail + ". err: 'email not found' ", "danger");
        console.log(err);
      })
    }
  }

  subtractCount(){
    if(!this.bubbleCtrl.emailValid(this.newEmail)){
      this.promptToast("Please enter a valid email.", "danger");
    }
    else{
      this.bubbleCtrl.subtractCount(this.newEmail).then((data:any)=>{
        this.promptToast(this.newEmail + " removed!", "success");
        let subtractedUser = this.bubbleCtrl.users.find(e => e.email == this.newEmail)
        console.log("subtracted user id is: " + subtractedUser.id);
        this.graphdata.nodes.update({id: subtractedUser.id, color: "#FF0207", border: "#FF0207"});
        this.subtractedList.push(subtractedUser.id);
        this.newEmail = null;
        this.handleProposed(data);
        console.log('success')
      }, err=>{
        //this.promptToast("Error removing " + this.newEmail, "danger");
        console.log('err')
      })
    }


  }

  handleProposed(data:any){
    let projected = data;
    console.log(data)
    projected["riskRate"] = "1 in " + ((data.total > 0) ? (data.total / data.riskier).toFixed(1).toString() : "0");
    this.projected = projected;
  }

  resetEdits(){
    this.newEmail = null;
    this.projected = null;
    this.subtractedList = new Array<number>();

    if (this.graphdata && this.graphdata.nodes){
      this.nodes = this.bubbleCtrl.getNodes();
      this.graphdata.nodes.update(this.nodes);
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
      //this.hidden = new Array<any>();
      this.drawBubbles();
    }
  }

  refreshBubbles(){
    this.resetEdits();
    this.bubbleCtrl.refresh().then(response=>{
      //this.hidden = new Array<any>();
      this.drawBubbles();
    }, err=>{
      console.log(err);
    })
  }

  hideNode(i) {
    let obj = this.graphdata.nodes.get(i);
    obj.hidden = true
    //this.hidden.push(obj); Jack
    this.bubbleCtrl.hiddenScenarios.push(obj)
    //this.graphdata.nodes[i] = obj;
    //this.cleanGraph();
    this.graphdata.nodes.update(obj);
}

  unhideNode(i) { //Jack - probabably no need for this
    let obj = this.graphdata.nodes.get(i);
    obj.hidden = false;
    console.log(obj);
    //this.graphdata.nodes[i] = obj;
    //this.cleanGraph();
    this.graphdata.nodes.update(obj);
  }

  unhideGraphNodes(){
    console.log("entered unhideGraphNodes");
    let unhideList = new Array<any>();
    this.graphdata.nodes.forEach(element => {
      if(element && element.hidden){
        let wasUnhidden = true;
        this.bubbleCtrl.hiddenScenarios.forEach(hiddenNode => {
          if(element.id == hiddenNode.id){
            wasUnhidden = false;
          }
        })
        if(wasUnhidden){
          unhideList.push({id: element.id, hidden: false});
        }
      }
    });
    this.graphdata.nodes.update(unhideList);
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
    var primaries = new Set()
    for (var i=0; i < this.nodes.length; i++) {
        if ((this.nodes[i].primaryid > 0) && (this.nodes[i].id == this.nodes[i].primaryid)) {
            primaries.add(this.nodes[i]);
        }
    }

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

  setBubbleData(){
    this.nodes = this.bubbleCtrl.getNodes();
    this.edges = this.bubbleCtrl.getEdges()
    this.graphdata = {
        nodes: new vis.DataSet(this.nodes),
        edges: new vis.DataSet(this.edges)
    };
    this.options = this.bubbleCtrl.getOptions();
  }

  resetBubbleData(){
    //this.hidden = new Array<any>(); // Jack shouldn't reset hidden
    console.log("Reseting Bubble data")
    this.nodes = this.bubbleCtrl.getNodes();
    this.edges = this.bubbleCtrl.getEdges()

    if (this.graphdata && this.graphdata.nodes && this.graphdata.edges){
      this.graphdata.nodes.update(this.nodes)
      this.graphdata.edges.update(this.edges)
    } else {
      this.setBubbleData();
    }

  }

  drawBubbles(resetData: boolean = true){
    if(resetData || this.nodes.length == 0){
      this.resetBubbleData();
    }
    if(this.network){
      //this.network.destroy();
    } else {
      this.setBubbleData();
      this.network = new vis.Network(this.bubbleschart.nativeElement, this.graphdata, this.options);
    }
    this.clusterbyprimary();

    this.network.on( 'selectNode', (properties)=> {
      var ids = properties.nodes;
      if(ids && ids.length > 0){
        let id = ids[0];
        if(typeof id == 'string'){
          id = Number(id.replace(' #', ""));
        }
        let clickedNode = this.graphdata.nodes.get(id);
        this.editNode(clickedNode)
      }
     //this.hideNode(ids[0]);
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
        this.newEmail = user.email
        //Jack - comment out below for no more popup
        const popover = await this.popoverCtrl.create({
          component: EditbubblePage,
          showBackdrop: true,
          componentProps:{
            node: node,
            user: user,
            isScenario: true
          }
        });
        await popover.present();
        await popover.onDidDismiss().then((response: any)=>{
          if(response.data && response.data.hideNode){
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
        isBubbleTab: false
        //hidden: cloneDeep(this.hidden) //Jack - changed from this.hidden
      }
    });
    await popover.present();
    await popover.onDidDismiss().then((response: any)=>{
      if(response.data && response.data.hasChanges){
        // let newHidden = new Array<any>();
        // let hidden = response.data.hidden;
        // for(var i = 0; i < hidden.length; i++){
        //   if(!hidden[i].hidden){
        //     this.unhideNode(hidden[i].id);
        //   }
        //   else{
        //     newHidden.push(hidden[i]);
        //   }
        // }
        // console.log(newHidden)
        // this.hidden = newHidden;
        //this.drawBubbles();
        this.unhideGraphNodes();
      }
    })
}











}
