import { Component } from '@angular/core';
import { HealthKit, HealthKitOptions } from '@ionic-native/health-kit/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage {

  height: number;
  currentHeight = 'No Data';
  currentWeight = 'No Data';
  gender = 'No Data';
  stepcount = 'No Data';
  distance = 'No Data';
  sleep = 'No Data'
  workouts = [];


  constructor(private healthKit: HealthKit, private plt: Platform) {
    this.plt.ready().then(() => {
      this.healthKit.available().then(available => {
        if (available) {
          // Request all permissions up front if you like to
          var options: HealthKitOptions = {
            readTypes: ['HKQuantityTypeIdentifierHeight', 'HKQuantityTypeIdentifierStepCount', 'HKWorkoutTypeIdentifier', 'HKQuantityTypeIdentifierActiveEnergyBurned', 'HKQuantityTypeIdentifierDistanceCycling'],
            writeTypes: ['HKQuantityTypeIdentifierHeight', 'HKWorkoutTypeIdentifier', 'HKQuantityTypeIdentifierActiveEnergyBurned', 'HKQuantityTypeIdentifierDistanceCycling']
          }
          this.healthKit.requestAuthorization(options).then(_ => {
            this.refreshData();
          })
        }
      });
    });
  }

  refreshData(){
    this.loadHealthData();
    this.loadSleep();
    this.loadDistance();
    this.loadSteps();
    this.loadWorkouts();
  }
 
  // Save a new height
  saveHeight() {
    this.healthKit.saveHeight({ unit: 'cm', amount: this.height }).then(_ => {
      this.height = null;
      this.loadHealthData();
    })
  }
 
  // Save a new dummy workout
  saveWorkout() {
    let workout = {
      'activityType': 'HKWorkoutActivityTypeCycling',
      'quantityType': 'HKQuantityTypeIdentifierDistanceCycling',
      'startDate': new Date(), // now
      'endDate': null, // not needed when using duration
      'duration': 6000, //in seconds
      'energy': 400, //
      'energyUnit': 'kcal', // J|cal|kcal
      'distance': 5, // optional
      'distanceUnit': 'km'
    }
    this.healthKit.saveWorkout(workout).then(res => {
      this.loadHealthData();
    })
  }
 
  // Reload all our data
  loadHealthData() {
    this.healthKit.readHeight({ unit: 'cm' }).then(val => {
      this.currentHeight = val.value;
    }, err => {
      console.log('No height: ', err);
    });
    this.healthKit.readWeight({unit:'lb'}).then(val=>{
      this.currentWeight = val.value;
    }, err=>{

    });
    this.healthKit.readGender().then(val=>{
      this.gender = val.value;
    });

  }

  loadSleep(){
    let options = {
      startDate: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      endDate: new Date(),
      sampleType: 'HKCategoryTypeIdentifierSleepAnalysis',
      limit: 1
    };
    this.healthKit.querySampleType(options).then(data => {
      this.sleep = ' got sleep data ';
      this.sleep += ' **sleep length ' + data.length;
      this.sleep += ' **first sleep ' + JSON.stringify(data[0].metadata);
      // let sleeps = [];
      // data.forEach(next => {
      //   sleeps.push({
      //     measure : next.value === 1 ? "Sleeping" : "In Bed",
      //      minutesSleep : this.diff_minutes(next.endDate, next.startDate),
      //      hoursSleep : Math.abs(next.endDate.getTime() - next.startDate.getTime()) / 3600000               
      //   })
      // });
      // this.sleep = JSON.stringify(sleeps)
    }, err => {
      this.sleep = 'err ' + JSON.stringify(err);
    });
  }

  diff_minutes(dt2, dt1) 
  {
 
   var diff =(dt2.getTime() - dt1.getTime()) / 1000;
   diff /= 60;
   return Math.abs(Math.round(diff));
   
  }
  

  loadDistance(){
    var options = {
      startDate: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      endDate: new Date(),
      sampleType: 'HKQuantityTypeIdentifierDistanceWalkingRunning',
      unit: 'm'
    }
    this.healthKit.querySampleType(options).then(data => {
      let distance = 0;
      data.forEach(element => {
        distance += element.quantity;
      });
      this.distance += distance.toString();
    }, err => {
      this.distance = 'err ' + JSON.stringify(err);
    });
  }


  loadSteps(){
    let stepOptions  = {
      startDate: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      endDate: new Date(),
      sampleType: 'HKQuantityTypeIdentifierStepCount',
      unit: 'count'
    };
 
    this.healthKit.querySampleType(stepOptions).then(data => {
      let stepSum = data.reduce((a, b) => a + b.quantity, 0);
      this.stepcount = stepSum;
    }, err => {
      console.log('No steps: ', err);
    });
  }


  loadWorkouts(){
    this.healthKit.findWorkouts().then(data => {
      this.workouts = data;
    }, err => {
      console.log('no workouts: ', err);
      // Sometimes the result comes in here, very strange.
      this.workouts = err;
    });
  }



}
