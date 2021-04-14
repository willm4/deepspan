import { Injectable } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';

@Injectable({
  providedIn: 'root'
})
export class LocationService {


  location: any = {
    lat: null,
    lon: null,
    admin2: null,
    provincestate: null,
    countryregion: null,
    locationName: null,
    provinceStateName: null
  }

  states = {"AL":"Alabama","AK":"Alaska","AZ":"Arizona","AR":"Arkansas","CA":"California","CO":"Colorado","CT":"Connecticut","DE":"Delaware","FL":"Florida","GA":"Georgia","HI":"Hawaii","ID":"Idaho","IL":"Illinois","IN":"Indiana","IA":"Iowa","KS":"Kansas","KY":"Kentucky","LA":"Louisiana","ME":"Maine","MD":"Maryland","MA":"Massachusetts","MI":"Michigan","MN":"Minnesota","MS":"Mississippi","MO":"Missouri","MT":"Montana","NE":"Nebraska","NV":"Nevada","NH":"New Hampshire","NJ":"New Jersey","NM":"New Mexico","NY":"New York","NC":"North Carolina","ND":"North Dakota","OH":"Ohio","OK":"Oklahoma","OR":"Oregon","PA":"Pennsylvania","RI":"Rhode Island","SC":"South Carolina","SD":"South Dakota","TN":"Tennessee","TX":"Texas","UT":"Utah","VT":"Vermont","VA":"Virginia","WA":"Washington","WV":"West Virginia","WI":"Wisconsin","WY":"Wyoming"};


  constructor(private geolocation: Geolocation, private geocoder: NativeGeocoder) { }

  public getLocation(){
    let response = {
      lat: null,
      lon: null,
      admin2: null,
      provincestate: null,
      countryregion: 'US',
      locationName: null,
      provinceStateName: null
    };
    return new Promise((resolve,reject)=>{
      this.getCoords().then((data: Geoposition)=>{
        response.lat = data.coords.latitude;
        response.lon = data.coords.longitude;
        this.getLocationName(data).then((locationData: any)=>{
          response.admin2 = locationData.admin2;
          response.provincestate = locationData.provincestate;
          response.provinceStateName = this.states[response.provincestate];
          response.locationName = locationData.locationName;
          resolve(response);
        })
      }, (errMsg: string)=>{
        reject(errMsg);
      })
    });
  }

  public getState(state){ // Android returns state as Washington, ios returns state as WA
    if(state.length>2){
      return state;
    }else{
      return this.states[state.toUpperCase()]
    }
  }

  public getStateKeyByValue(value) {
    if(value.length>2){
      return Object.keys(this.states).find(key => this.states[key] === value);
    }else{
      return value;
    }
  }

  public setLocation(){
    return new Promise((resolve,reject)=>{
      this.getLocation().then(response=>{
        this.location = response;
        resolve();
      }, err=>{
        reject(err);
      })
    });
  }

  private getCoords(){
    let errMsg = 'Location not found.';
    return new Promise((resolve,reject)=>{
      this.geolocation.getCurrentPosition().then((data: Geoposition)=>{
        if(!data.coords){
          reject(errMsg);
        }
        else{
          resolve(data);
        }
      }, err=>{
        reject(errMsg)
      })
    })
  }

  private getLocationName(position: Geoposition){
    let result = {
      admin2: null,
      provincestate: null,
      locationName: null
    };
    return new Promise((resolve)=>{
      this.geocoder.reverseGeocode(position.coords.latitude, position.coords.longitude).then((response:NativeGeocoderResult[])=>{
        if(response && response.length > 0){

          console.log("reversegeocoder " + JSON.stringify(response))
          let locationObj: NativeGeocoderResult = response[0];
          var location = "";
         if(locationObj.subAdministrativeArea){
          result.admin2 = locationObj.subAdministrativeArea.replace(" County", "");
         }
          if(locationObj.locality){
            location += locationObj.locality + ", ";
          }
          if(locationObj.administrativeArea){
            result.provincestate = this.getStateKeyByValue(locationObj.administrativeArea);
           location += result.provincestate + ", ";
          }
          if(locationObj.countryCode){
            location += locationObj.countryCode;
          }
          location = location.trim()
          if(location.length > 0 && location.charAt(location.length - 1) == ","){
            location = location.substring(0, location.length - 1);
          }
          result.locationName = location.toUpperCase();
        }
        resolve(result);
      }, err=>{
        resolve(result);
      })
    })
  }

}
