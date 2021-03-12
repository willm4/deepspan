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

  constructor(public zone:NgZone
    , public modalCtrl: ModalController
    , public app: AppService
    , private alertCtrl:AlertController
    , private toastCtrl: ToastController) { 

  }

  ngAfterViewInit(){
    
  }



}
