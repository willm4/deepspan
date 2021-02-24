import { Component, OnInit, OnDestroy, AfterViewInit, NgZone, ElementRef, ViewChild } from '@angular/core';

// amCharts imports
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4plugins_forceDirected from "@amcharts/amcharts4/plugins/forceDirected"; 
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { Bubble } from 'src/app/classes/bubble';
import { AppService } from 'src/app/services/app.service';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-scenarios',
  templateUrl: './scenarios.page.html',
  styleUrls: ['./scenarios.page.scss'],
})
export class ScenariosPage implements AfterViewInit {

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
  @ViewChild("scenarioschart") bubbleschart: ElementRef;
  chart: am4plugins_forceDirected.ForceDirectedTree;
  editing: boolean = false;
  bubbleEditType: string = 'add';
  newBubble: Bubble = new Bubble();
  bubbleEdit: Bubble = new Bubble();
  hasData: boolean = false;
  loadingBubbles: boolean = false;
  bubbles: Array<Bubble> = new Array<Bubble>();

  constructor(public zone:NgZone
    , public modalCtrl: ModalController
    , public app: AppService
    , private alertCtrl:AlertController
    , private toastCtrl: ToastController) { 

  }

  resetBubbles(){
    this.bubbles = this.app.bubbleCtrl.getBubblesClone();
  }


  ngAfterViewInit() {
    setTimeout(()=>{
      if(!this.hasData){
        this.drawBubbles(true);
      }
      if(!this.app.ipc){
        this.app.setIPC();
      }
    }, 5000);
  }

  ionViewDidEnter(){
    if(!this.app.ipc){
      this.app.setIPC();
    }
    if(!this.hasData){
      this.drawBubbles(true);
    }
    this.resetBubbles();
  }
  edit(){
    this.editing = true;
  }

  cancelEdit(){
    this.resetTempBubs();
    this.bubbleEditType = 'add';
    this.editing = false;
  }

  saveBubbleChanges(){
    if(this.bubbleEdit.id){
      if(this.bubbleEdit.canSave(this.app.user.id)){
        this.app.editBubble(this.bubbleEdit).then(response=>{
          this.promptToast(this.bubbleEdit.name + ' updated successfully!', 'success' );
          this.bubbleEdit = new Bubble();
          this.drawBubbles(true);
        }, err=>{
          console.log(err);
          this.promptToast("Error updating " + this.bubbleEdit.name + '.', 'danger' );
        })
      }
      else{
        this.promptToast("Couldn't update " + this.bubbleEdit.name + '. Invalid name or permissions.', 'danger' );
      }
    }
  }
  
  removeBubble(){
    if(this.bubbleEdit.id){
      this.app.removeBubble(this.bubbleEdit.id).then(response=>{
        this.promptToast(this.bubbleEdit.email + ' was removed', 'success' );
        this.bubbleEdit = new Bubble();
        this.drawBubbles();
        this.resetBubbles();
      }, err=>{
        this.promptToast('Error removing ' +this.bubbleEdit.name, 'danger' );
      });
    }
  }

  addBubble(){
    if(this.newBubble.emailValid() && this.newBubble.name){
      this.app.addBubble(this.newBubble).then(()=>{
          this.drawBubbles(true);
          this.promptToast(this.newBubble.name + ' added successfully!', 'success' );
          this.newBubble = new Bubble();
        }, err=>{
          this.promptToast('Error adding ' +this.newBubble.name, 'danger' );
        })
    }
    else{
      this.promptToast("Bubble couldn't be added, email invalid.", 'danger' );
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

  resetTempBubs(){
    this.bubbleEdit = new Bubble();
    this.newBubble = new Bubble();
  }


  drawBubbles(isInit: boolean = false){
    am4core.useTheme(am4themes_animated);
    // Themes end

    let chart = am4core.create(this.bubbleschart.nativeElement, am4plugins_forceDirected.ForceDirectedTree);

    am4core.options.disableHoverOnTransform = "touch";

    chart.responsive.enabled = true;
    chart.width = am4core.percent(100);
    chart.height = am4core.percent(100);
    let networkSeries = chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries())
    networkSeries.dataFields.linkWith = "linkWith";
    networkSeries.dataFields.name = "name";
    networkSeries.dataFields.id = "name";
    networkSeries.dataFields.value = "value";
    networkSeries.dataFields.children = "children";
    networkSeries.tooltip.disabled = true;

    networkSeries.nodes.template.label.text = "{name}"
    networkSeries.fontSize = 8;
    networkSeries.linkWithStrength = 0;

    let nodeTemplate = networkSeries.nodes.template;
    nodeTemplate.tooltipText = "{name}";
    nodeTemplate.fillOpacity = 1;
    nodeTemplate.label.hideOversized = true;
    nodeTemplate.label.truncate = true;

    // let linkTemplate = networkSeries.links.template;
    // linkTemplate.strokeWidth = 1;
    // let linkHoverState = linkTemplate.states.create("hover");
    // linkHoverState.properties.strokeOpacity = 1;
    // linkHoverState.properties.strokeWidth = 2;

    nodeTemplate.events.on("over", function (event) {
        let dataItem = event.target.dataItem;
        dataItem.childLinks.each(function (link) {
            link.isHover = true;
        })
    })

    nodeTemplate.events.on("out", function (event) {
        let dataItem = event.target.dataItem;
        dataItem.childLinks.each(function (link) {
            link.isHover = false;
        })
    })

    if(isInit){
      this.getChartData().then((response:any)=>{
        networkSeries.data = response;
        this.hasData = response.length > 0;

      }, err=>{
        console.log(err);
      });
    }
    else{
      networkSeries.data = this.app.getChartData();
    }
  
}

getChartData(){
  return new Promise((resolve,reject)=>{
    this.app.getBubbles().then(()=>{
      let data = this.app.getChartData();
      this.app.statuses.push('app data ' + JSON.stringify(data));
      console.log('chart data');
      console.log(data);
      resolve(data);
      this.resetBubbles();
    }, err=>{
      reject(err);
    });
  })
}



}
