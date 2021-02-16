import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  ipc: number = 0;
  region: string = '';
  state: string = '';
  lat: number;
  lon: number;

  constructor(private rest: RestService, private geolocation: Geolocation, private geocoder: NativeGeocoder ) {

   }

   public setIPC(){
     return new Promise((resolve,reject)=>{
      console.log('setting location')
      this.setLocation().then(()=>{
        console.log('set location')
        this.rest.getIPC(this.region, this.state, this.lat, this.lon).then((response:any)=>{
          console.log(response)
          this.ipc = response;
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
          this.region = response[0].subAdministrativeArea;
          this.state = response[0].administrativeArea;
          resolve();
        }
        else{
          this.region = null;
          this.state = null;
        }
        resolve();
      }, err=>{
        this.region = null;
        this.state = null;
        resolve();
      })
    })
   }


}
