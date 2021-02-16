import { Injectable } from '@angular/core';

import { HTTP } from '@ionic-native/http/ngx';
import { HttpClient } from  '@angular/common/http';
import { Platform } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private path: string = "https://bubblenet.appspot.com/api/";
  
  // USER
  public login: string = this.path + "login";
  public createAccount: string = this.path + "user/new";
  public sessionCheck: string = this.path + "session/check";
  public profile: string = this.path + "user/profile";
  public newPw: string = this.path + "password/new";
  public forgotPw: string = this.path + "password/forgot";
  public document: string = this.path + "document/"
  // IPC
  public ipc: string = this.path + this.path + "ipc";
  
  // DOCUMENTS -- TODO

  
  constructor(private httpClient: HttpClient, private http: HTTP, public platform: Platform) { }


  private isPWA(){
    return !this.platform.is('cordova');
  }

  public post(path: string, params: any = false, serviceToken: any = false){
    return new Promise((resolve,reject)=>{
      let body = params ?? {};
      let header = serviceToken 
        ? {'bearer': serviceToken}
        : {};
      if(this.isPWA()){
        this.httpClient.post(path, JSON.stringify(body)).subscribe(response=>{
          console.log(response);
          resolve(response);
        }, err=>{
          console.log(err);
          reject(err);
        });
      }
      else{
        this.http.post(path, body, header).then(response=>{
          resolve(response);
        }, err=>{
          reject(err);
        }).catch(err=>{
          reject(err);
        })
      }
    });
  }

  public get(path: string, serviceToken: string){
    return new Promise((resolve,reject)=>{
      let header = {'bearer': serviceToken}
      if(this.isPWA()){
        this.httpClient.get(path).subscribe(response=>{
          resolve(response);
        }, err=>{
          console.log(err);
          reject(err);
        });
      }
      else{
        this.http.get(path, {}, header).then(response=>{
          resolve(response);
        }, err=>{
          reject(err);
        }).catch(err=>{
          reject(err);
        })
      }
    });
  }



}
