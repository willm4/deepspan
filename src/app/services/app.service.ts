import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { BubblesService } from './bubbles.service';
import { UserService } from './user.service';
import { Bubble } from '../classes/bubble';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  ipc: number;
  region: string = '';
  state: string = '';
  lat: number;
  lon: number;
  location: string;
  states = {"AL":"Alabama","AK":"Alaska","AZ":"Arizona","AR":"Arkansas","CA":"California","CO":"Colorado","CT":"Connecticut","DE":"Delaware","FL":"Florida","GA":"Georgia","HI":"Hawaii","ID":"Idaho","IL":"Illinois","IN":"Indiana","IA":"Iowa","KS":"Kansas","KY":"Kentucky","LA":"Louisiana","ME":"Maine","MD":"Maryland","MA":"Massachusetts","MI":"Michigan","MN":"Minnesota","MS":"Mississippi","MO":"Missouri","MT":"Montana","NE":"Nebraska","NV":"Nevada","NH":"New Hampshire","NJ":"New Jersey","NM":"New Mexico","NY":"New York","NC":"North Carolina","ND":"North Dakota","OH":"Ohio","OK":"Oklahoma","OR":"Oregon","PA":"Pennsylvania","RI":"Rhode Island","SC":"South Carolina","SD":"South Dakota","TN":"Tennessee","TX":"Texas","UT":"Utah","VT":"Vermont","VA":"Virginia","WA":"Washington","WV":"West Virginia","WI":"Wisconsin","WY":"Wyoming"};


  constructor(private rest: RestService, private geolocation: Geolocation, private geocoder: NativeGeocoder, public bubbleCtrl: BubblesService, public user: UserService ) {

   }

   public getChartData(){
     return this.bubbleCtrl.getChartData(this.user.name)
   }
   
   public getBubbles(){
     return new Promise((resolve,reject)=>{
       this.rest.getBubbles().then((bubbles: any)=>{
         if(bubbles){
           this.bubbleCtrl.refresh(bubbles);
         }
         resolve();
       }, err=>{
         reject(err);
       })
     })
   }

   public removeBubble(id: number){
     return new Promise((resolve,reject)=>{
       this.rest.removeBubble(id).then(response=>{
         this.bubbleCtrl.removeBubble(id);
         resolve();
       },err=>{
         reject(err);
       })
     })
   }

   public addBubble(bubble: Bubble){
     return new Promise((resolve,reject)=>{
       this.rest.addBubble(bubble).then(response=>{
       resolve();
       }, err=>{
         reject(err);
       })
     })
   }

   public setIPC(){
     return new Promise((resolve,reject)=>{
      console.log('setting location')
      this.setLocation().then(()=>{
        console.log('making ipc request')
        console.log('state ' + this.states[this.state]);
        this.rest.getIPC(this.region, this.states[this.state], this.lat, this.lon).then((response:any)=>{
          console.log(response)
          this.ipc = Math.round(response.ipc);
          resolve();
        },err=>{
          console.log("ERR SETTING IPC")
          reject("Error, couldn't set IPC");
        })
      }, err=>{
        console.log('err getting ipc')
        reject();
      })
     })
   }

   private setLocation(){
     return new Promise((resolve,reject)=>{
      this.geolocation.getCurrentPosition().then((response:Geoposition)=>{
        if(!response.coords){
          reject("Couldn't get valid location")
        }
        else{
          this.lat = response.coords.latitude;
          this.lon = response.coords.longitude;
          this.setLocationAddress().then(()=>{
            resolve();
          });
        }
      }, err=>{
        console.log('err setting location')
        reject("Couldn't get location.")
      }).catch(err=>{
        console.log(err)
        reject(err);
      })
     });
   }

   private setLocationAddress(){
    return new Promise((resolve)=>{
      this.geocoder.reverseGeocode(this.lat, this.lon).then((response:NativeGeocoderResult[])=>{
        if(response && response.length > 0){
          
          let locationObj: NativeGeocoderResult = response[0];
          var location = "";
         if(locationObj.subAdministrativeArea){
          this.region = locationObj.subAdministrativeArea;
         }
          if(locationObj.locality){
            location += locationObj.locality + ", ";
          }
          if(locationObj.administrativeArea){
            this.state = locationObj.administrativeArea;
           location += locationObj.administrativeArea + ", ";
          }
          if(locationObj.countryCode){
            location += locationObj.countryCode;
          }
          location = location.trim()
          if(location.length > 0 && location.charAt(location.length - 1) == ","){
            location = location.substring(0, location.length - 1);
          }
          this.location = location.toUpperCase();
          console.log(this.location)
          resolve();
        }
        else{
          this.region = null;
          this.state = null;
          resolve();
        }
      }, err=>{
        this.region = null;
        this.state = null;
        resolve();
      })
    })
   }


}
