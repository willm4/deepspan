import { Component, OnInit, OnDestroy, AfterViewInit, NgZone } from '@angular/core';

// amCharts imports
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4plugins_forceDirected from "@amcharts/amcharts4/plugins/forceDirected"; 
import { BubblesService } from 'src/app/services/bubbles.service';
import { PopoverController, ModalController } from '@ionic/angular';
import { AddBubblePage } from 'src/app/popovers/add-bubble/add-bubble.page';
import { Bubble } from 'src/app/classes/bubble';


am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-bubbles',
  templateUrl: './bubbles.page.html',
  styleUrls: ['./bubbles.page.scss'],
})
export class BubblesPage implements AfterViewInit, OnDestroy {

  chart: am4plugins_forceDirected.ForceDirectedTree;
  bubblesCtrl: BubblesService = new BubblesService();

  constructor(public zone:NgZone, public modalCtrl: ModalController) { }

  ngAfterViewInit() {

    this.zone.runOutsideAngular(() => {
      setTimeout(()=>{
        this.drawBubbles();
      }, 1000);
    });
  }


  drawBubbles(){
    let chart = am4core.create("bubbles-chart", am4plugins_forceDirected.ForceDirectedTree);
    let networkSeries = chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries());


    chart.data = [
    {
      name: "WILLIAM",
      children: [
        {
          name: "BILL",
          value:100
        },
        {
          name: "KATHY",
          value:50
        },
        {
          name: "JENN",
          value:50
        },
        {
          name: "ERIC",
          value:50,
          children: [
            {
              name: "JOAN",
              value:50,
              children:[
                {
                  name: "FRIEND",
                  value:50
                },
                {
                  name: "FRIEND",
                  value:50
                },
              ]
            },
          ]
        },
 

      ]
    },
    {
      name: "JOBY",
      children: [
        {
          name: "JENN",
          value:100,
          children: [
          ]
        },
        {
          name: "WILL",
          value:100,
          children: [
          ]
        }
 

      ]
    }
  ];



  networkSeries.dataFields.value = "value";
  networkSeries.dataFields.name = "name";
  networkSeries.dataFields.children = "children";
  networkSeries.nodes.template.tooltipText = "{name}:{value}";
  // networkSeries.nodes.template.tooltipHTML = '<button (click)="removeNode({name})">Remove</button>'
  // networkSeries.nodes.template.interactionsEnabled = true;
  networkSeries.nodes.template.fillOpacity = 1;
  networkSeries.manyBodyStrength = -20;
  networkSeries.links.template.strength = 0.8;
  networkSeries.minRadius = am4core.percent(2);

  networkSeries.nodes.template.label.text = "{name}"
  networkSeries.fontSize = 10;
  this.chart = chart;
  this.createBubblesFromChartData();
  this.chart.data = this.bubblesCtrl.getChartData();

  }

  createBubblesFromChartData(){
    this.bubblesCtrl = new BubblesService();
    this.chart.data.forEach(val =>{
      this.addBubbleFromChartData(val);
    });
    console.log(this.bubblesCtrl.bubbles)
    console.log(this.bubblesCtrl.getChartData())
  }

  addBubbleFromChartData(bubbleData: any){
    let val = bubbleData.value ? bubbleData.value : null;
    this.bubblesCtrl.addBubble(bubbleData.name, val);
    this.bubblesCtrl.bubbles[this.bubblesCtrl.bubbles.length - 1].addFromData(bubbleData);
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

  removeNode(name){
    console.log('removed')
  }

  async addBubble(){
    this.bubblesCtrl.resetDeleted();
    const modal = await this.modalCtrl.create({
      component: AddBubblePage,
      componentProps:{bubbles:this.bubblesCtrl.bubbles}
    });

    await modal.present();
    modal.onDidDismiss().then(response =>{
     let bubbles = response.data;
     if(bubbles){
       this.bubblesCtrl.bubbles = bubbles;
       this.bubblesCtrl.updateBubbles();
       this.chart.data = this.bubblesCtrl.getChartData();
     }
     else{
       console.log('removing added bubbles')
       this.bubblesCtrl.removeAdded();
       console.log(this.bubblesCtrl.bubbles)
     }
    });
    // let data = this.chart.data;
    // data[0].children.push({
    //   name: "NEW",
    //   value: Math.random() * 100
    // });
    // this.chart.data = data;
  }


}
