import { Component, OnInit, OnDestroy, AfterViewInit, NgZone } from '@angular/core';

// amCharts imports
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4plugins_forceDirected from "@amcharts/amcharts4/plugins/forceDirected"; 
import { BubblesService } from 'src/app/services/bubbles.service';
import { PopoverController, ModalController, AlertController } from '@ionic/angular';
import { AddBubblePage } from 'src/app/popovers/add-bubble/add-bubble.page';
import { Bubble } from 'src/app/classes/bubble';
import { AppService } from 'src/app/services/app.service';
// lodash
import { cloneDeep } from "lodash";

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-bubbles',
  templateUrl: './bubbles.page.html',
  styleUrls: ['./bubbles.page.scss'],
})
export class BubblesPage implements AfterViewInit, OnDestroy {

  chart: am4plugins_forceDirected.ForceDirectedTree;

  constructor(public zone:NgZone, public modalCtrl: ModalController, public app: AppService, private alertCtrl:AlertController) { 

  }

  ngAfterViewInit() {

    this.zone.runOutsideAngular(() => {
      setTimeout(()=>{
        this.drawBubbles(true);
      }, 1000);
    });
  }
  

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

  async removeBubble(){
    let inputs = []
    this.app.bubbleCtrl.bubbles.forEach(b=>{
      inputs.push(     {
        name: b.id,
        type: 'radio',
        label: b.email,
        value: b.id
      });
    });

    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'REMOVE BUBBLE',
      message: 'CHOOSE BUBBLE TO REMOVE',
      inputs: inputs,
      buttons: ['CANCEL',
      {
        text: 'REMOVE',
        cssClass: 'danger',
        handler: (bubbleID) => {
          if(bubbleID){
            this.app.removeBubble(bubbleID).then(()=>{
              this.drawBubbles();
            }, err=>{
              console.log(err);
            })
          }
        }
      }]
    });
    alert.present();

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
        placeholder: 'Enter email'
      }],
      buttons: ['CANCEL',
      {
        text: 'ADD',
        cssClass: 'success',
        handler: (alertData) => {
          if(alertData.bubblename){
            this.app.addBubble(alertData.bubblename).then(()=>{
              this.drawBubbles(true);
            }, err=>{
              console.log(err);
            })
          }
        }
      }]
    });
    alert.present();
  }


  // async addBubble(){
  //   const bubbleCtrl = cloneDeep(this.app.bubbleCtrl);
  //   const modal = await this.modalCtrl.create({
  //     component: AddBubblePage,
  //     componentProps:{bubbles:this.app.bubbleCtrl.bubbles}
  //   });

  //   await modal.present();
  //   modal.onDidDismiss().then((response) =>{
  //     this.drawBubbles();
  //   });
  // }

  drawBubbles(isInit: boolean = false){
    am4core.useTheme(am4themes_animated);
    // Themes end

    let chart = am4core.create("bubbles-chart", am4plugins_forceDirected.ForceDirectedTree);

    let networkSeries = chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries())
    networkSeries.dataFields.linkWith = "linkWith";
    networkSeries.dataFields.name = "name";
    networkSeries.dataFields.id = "name";
    networkSeries.dataFields.value = "value";
    networkSeries.dataFields.children = "children";

    networkSeries.nodes.template.label.text = "{name}"
    networkSeries.fontSize = 8;
    networkSeries.linkWithStrength = 0;

    let nodeTemplate = networkSeries.nodes.template;
    nodeTemplate.tooltipText = "{name}";
    nodeTemplate.fillOpacity = 1;
    nodeTemplate.label.hideOversized = true;
    nodeTemplate.label.truncate = true;

    let linkTemplate = networkSeries.links.template;
    linkTemplate.strokeWidth = 1;
    let linkHoverState = linkTemplate.states.create("hover");
    linkHoverState.properties.strokeOpacity = 1;
    linkHoverState.properties.strokeWidth = 2;

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
        alert(err);
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
