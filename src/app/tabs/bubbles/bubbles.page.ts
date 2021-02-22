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
  selector: 'app-bubbles',
  templateUrl: './bubbles.page.html',
  styleUrls: ['./bubbles.page.scss'],
})
export class BubblesPage implements AfterViewInit {

  @ViewChild("bubbleschart") bubbleschart: ElementRef;
  chart: am4plugins_forceDirected.ForceDirectedTree;
  editing: boolean = false;
  bubbleEditType: string = 'add';
  newBubble: Bubble = new Bubble();
  bubbleEdit: Bubble = new Bubble();

  constructor(public zone:NgZone
    , public modalCtrl: ModalController
    , public app: AppService
    , private alertCtrl:AlertController
    , private toastCtrl: ToastController) { 

  }


  ngAfterViewInit() {
    setTimeout(()=>{
      this.drawBubbles(true);
      if(!this.app.ipc){
        this.app.setIPC();
      }
    }, 1000);
  }

  ionViewDidEnter(){
    if(!this.app.ipc){
      this.app.setIPC();
    }
  }
  edit(){
    this.editing = true;
  }

  cancelEdit(){
    this.resetTempBubs();
    this.bubbleEditType = 'add';
    this.editing = false;
  }
  
  removeBubble(){
    if(this.bubbleEdit.id){
      this.app.removeBubble(this.bubbleEdit.id).then(response=>{
        this.promptToast(this.bubbleEdit.email + ' was removed', 'success' );
        this.bubbleEdit = new Bubble();
        this.drawBubbles();
      }, err=>{
        this.promptToast('Error removing ' +this.bubbleEdit.email, 'danger' );
      });
    }
  }

  addBubble(){
    if(this.newBubble.emailValid() && this.newBubble.name){
      this.app.addBubble(this.newBubble).then(()=>{
          this.drawBubbles(true);
          this.newBubble = new Bubble();
          this.promptToast(this.newBubble.name + ' added successfully!', 'success' );
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
      resolve(this.app.getChartData());
    }, err=>{
      reject(err);
    });
  })
}



}
