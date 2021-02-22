import { Injectable } from '@angular/core';

import { HTTP } from '@ionic-native/http/ngx';
import { HttpClient, HttpHeaders } from  '@angular/common/http';
import { Platform } from '@ionic/angular';
import axios from 'axios';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private path: string = "https://bubblenet.appspot.com/api/";
  
  // USER
  public login: string = this.path + "login";
  public logout: string = this.path + "logout";
  public createAccount: string = this.path + "user/new";
  public sessionCheck: string = this.path + "session/check";
  public profile: string = this.path + "user/profile";
  public newPw: string = this.path + "password/new";
  public forgotPw: string = this.path + "password/forgot";

  // IPC
  public ipc: string = this.path +  "ipc";
  
  // DOCUMENTS -- TODO
  public doc: string = this.path + "document/"

  // BUBBLES
  public getBubblesWithoutEmail: string = this.path + "bubbles"
  public getBubblesWithEmail: string = this.getBubblesWithoutEmail + "/email"
  public deleteBubble: string = this.path + "bubble/" // ADD BUBBLE ID
  public getBubblesWithDepth: string = this.getBubblesWithoutEmail + "/depth/" // ADD DEPTH ONTO THIS
  public addBubbles: string = this.path + "bubbles" // SEND ARRAY OF EMAILS TO LINK

  constructor(private http: HTTP, private httpClient: HttpClient, public platform: Platform, private storage: NativeStorage) { }


  public isPWA(){
    return document.URL.indexOf('http') === 0;
  }

  getHeader(isLogin: boolean = false){
    return new Promise((resolve)=>{
      if(isLogin){
        resolve({});
      }
      else{
        if(this.isPWA()){
          let userData = localStorage.getItem('user');
          if(userData){
            let data = JSON.parse(userData);
            resolve({
              headers: {
                'Authorization' : 'Bearer ' + data.servicetoken,
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json; charset=UTF-8'
            }
            });
          }
          else{
            resolve({})
          }
        }
        else{
          this.storage.getItem('user').then((response:any)=>{
            let data = JSON.parse(response);
            resolve({
              Authorization: 'Bearer ' + data.servicetoken
            });
          }, err=>{
            resolve({});
          })
        }
      }
    })
  }

  public delete(path: string){
    return new Promise((resolve,reject)=>{

      this.getHeader().then(header=>{
        if(this.isPWA()){
          axios.delete(path,header).then(response =>{
              resolve();
            }, err=>{
              reject(err)
              console.log(err)
            });
        }
        else{
          this.http.delete(path, {}, header ).then(response=>{
            resolve();
          },err=>{
            reject(err.error.message);
          })
        }
      });
    })
  }

  public post(path: string, params: any = {}, isLogin: boolean = false){
    return new Promise((resolve,reject)=>{
      this.getHeader(isLogin).then(header=>{
        if(this.isPWA()){
          axios.post(path,params,header).then(response =>{
              resolve(response.data);
            }, err=>{
              reject(err)
              console.log(err)
            });
        }
        else{
          this.http.setDataSerializer("json");
          this.http.post( path, params, header).then(response=>{
            resolve(JSON.parse(response.data));
          }, err=>{
            reject(err.error.message);
          }).catch(err=>{
            reject(err);
          })
        }
      })
    });
  }

  public get(path: string){
    return new Promise((resolve,reject)=>{

      this.getHeader().then(header=>{
        if(this.isPWA()){
          axios.get(path,header).then(response =>{
              resolve(response.data);
            }, err=>{
              reject(err.error.message)
              console.log(err)
            });
        }
        else{
          this.http.get( path, {}, header).then(response=>{
            resolve(JSON.parse(response.data));
          }, err=>{
            reject(err);
          }).catch(err=>{
            reject(err);
          })
        }
      })
    });
  }



}
