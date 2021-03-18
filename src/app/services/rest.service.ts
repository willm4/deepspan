import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Action } from '../classes/action';
import { User } from '../classes/user';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private api: ApiService, public nativeStorage: NativeStorage) { }


  public editInvitedUser(params:any){
    return new Promise((resolve,reject)=>{
      this.api.put(this.api.editInvited, params).then(response=>{
        resolve(response);
      }, err=>{
        reject(err);
      })
    })
  }


  public getIPC(admin2: string, state: string, lat: any = null, lon: any = null){
    return new Promise((resolve,reject)=>{
      this.getIPCFromServer(admin2,state,lat,lon).then(response=>{
        // let nativeData = {updated: new Date(), data: response};
        // this.nativeStorage.setItem('ipc', JSON.stringify(nativeData));
        resolve(response);
      },err=>{
        reject(err);
      })
    })
  }
v
  private getIPCFromServer(admin2: string = null, state: string = null, lat: any = null, lon: any = null){
    return new Promise((resolve,reject)=>{
      let body = {
        countryregion: 'US', // COUNTRY
        provincestate: state, // STATE
        admin2: admin2, //TODO  
        lat: lat,
        lon: lon
      };
      this.api.post(this.api.ipc, body).then(response=>{
        resolve(response);
      }, err=>{
        reject(err);
      })
    })
  }

  public clearStorage(){
    this.nativeStorage.clear();
    localStorage.clear();
  }

  public getActions(){
    return new Promise((resolve,reject)=>{
      this.api.get(this.api.allActions).then(response=>{
        resolve(response);
      }, err=>{
        reject(err);
      })
    })
  }

  public deleteAction(action: Action){
    return new Promise((resolve,reject)=>{
      let params = {
        id: action.id
      }
      this.api.delete(this.api.deleteAction + '/' + action.id ).then(()=>{
        resolve();
      }, err=>{
        reject(err);
      })
    })
  }

  updateAction(action: Action, edgeStatus: any){
    return new Promise((resolve,reject)=>{
      let params = {
        id: action.bubbleref.Int32,
        edgestatus: edgeStatus
      };
      this.api.put(this.api.invite, params).then((response)=>{
        resolve();
      }, err=>{
        reject(err);
      })
    })
  }




}
