import { Injectable } from '@angular/core';

import { HTTP } from '@ionic-native/http/ngx';
import { HttpClient, HttpHeaders } from  '@angular/common/http';
import { Platform } from '@ionic/angular';
import axios from 'axios';

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
  public document: string = this.path + "document/"

  // BUBBLES
  public getBubblesWithoutEmail: string = this.path + "bubbles"
  public getBubblesWithEmail: string = this.getBubblesWithoutEmail + "/email"
  public deleteBubble: string = this.path + "bubble/" // ADD BUBBLE ID
  public getBubblesWithDepth: string = this.getBubblesWithoutEmail + "/depth/" // ADD DEPTH ONTO THIS
  public addBubbles: string = this.path + "bubbles" // SEND ARRAY OF EMAILS TO LINK

  constructor(private http: HTTP, private httpClient: HttpClient, public platform: Platform) { }


  public isPWA(){
    return !this.platform.is('cordova');
  }

  public delete(path: string, serviceToken: any){
    return new Promise((resolve,reject)=>{
      if(this.isPWA()){
        axios.delete(path,
          {
            headers: {
                'Authorization' : 'Bearer ' + serviceToken,
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json; charset=UTF-8',
            }
          }
          ).then(response =>{
            resolve();
          }, err=>{
            reject(err)
            console.log(err)
          });
      }
      else{
        let header: any = {
          Authorization: 'Bearer ' + serviceToken
        }
        this.http.delete(path, {}, header ).then(response=>{
          resolve();
        },err=>{
          reject(err);
        })
      }
    })
  }

  public post(path: string, params: any = false, serviceToken: any = false){
    return new Promise((resolve,reject)=>{
      let body = params ?? {};
      if(this.isPWA()){
        axios.post(path,params,
          {
            headers: {
                'Authorization' : 'Bearer ' + serviceToken,
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json; charset=UTF-8'
            }
          }
          ).then(response =>{
            resolve(response.data);
          }, err=>{
            reject(err)
            console.log(err)
          });
      }
      else{
        let header: any = {
          Authorization: 'Bearer ' + serviceToken
        }
        this.http.post( path, body, header).then(response=>{
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

      if(this.isPWA()){

        //WORKS 

        axios.get(path,
          {
            headers: {
                'Authorization' : 'Bearer ' + serviceToken,
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json; charset=UTF-8',
                'Access-Control-Allow-Methods':'GET, POST, PUT',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
          }
          ).then(response =>{
            resolve(response.data);
          }, err=>{
            reject(err)
            console.log(err)
          });

        // WORKS
          // this.httpClient.get(path, {headers:{'Authorization' : 'Bearer ' + serviceToken,  'Access-Control-Allow-Origin': '*',               'Content-Type': 'application/json; charset=UTF-8', }})
          // .subscribe(response=>{
          //   resolve(response);
          // }, err=>{
          //   console.log(err)
          //   reject(err);
          // })
      }
      else{
        let header: any = {
          Authorization: 'Bearer ' + serviceToken
        }
        this.http.get( path, {}, header).then(response=>{
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
