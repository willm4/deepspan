import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private isTest: boolean = false;
  public email: string = !this.isTest ? "" : "will@silvernovus.com";
  public password: string = !this.isTest ? "" : "Covid123";
  public name: string = !this.isTest ? "" : "Will";
  private servicetoken: string = !this.isTest ? "" : "9298b1f2-b952-4c37-70ba-427513dfecf8";

  constructor(private rest: RestService, private platform: Platform) { }

  public isValid(){
    let isValid = this.email && this.servicetoken;
    if(isValid){
      this.rest.setUserData(this.servicetoken, this.email);
    }
    return isValid;
  }

  public logout(){
    return new Promise((resolve,reject)=>{
      this.rest.logout().then(()=>{
        resolve();
      }, err=>{
        reject();
      })
    })
  }

  public login(username: string, password: string){
    return new Promise((resolve,reject)=>{
      this.rest.login(username, password)
      .then((response:any)=>{
        if(response){
          this.email = username;
          this.servicetoken = response.servicetoken;
          this.rest.setUserData(this.servicetoken, this.email);
          resolve();
        }
        else{
          reject('Oops, error loging in. Please try again.');
        }
      }, (err: any)=>{
        reject(err.error.message);
      })
    })
  }

  public signup(username: string, password: string, name: string){
    return new Promise((resolve,reject)=>{
      this.rest.signup(username, password, name)
      .then((response:any)=>{
        this.email = username;
        this.name = name;
        this.servicetoken = response.uuid;
        this.rest.setUserData(this.servicetoken, this.email);
        resolve();
      }, (err: any)=>{
        reject(err.error.message);
      })
    })
  }

  private setUserData(data: any){
    let userData = JSON.parse(data);
    this.email        = userData.username;
    this.servicetoken = userData.servicetoken;
    this.rest.setUserData(this.servicetoken, this.email);
  }

  private isPWA(){
    return !this.platform.is('cordova');
  }

  public checkUser(){
    return new Promise((resolve,reject)=>{
      if(this.isValid()){
        resolve();
      }
      else{
        this.rest.getNativeStorageItem('user').then(response=>{
          this.setUserData(response);
          resolve();
        }, err=>{
          reject(err);
        })
      }
    })
  }

}
