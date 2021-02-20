import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private isTest: boolean = false;
  public email: string = !this.isTest ? "" : "will@silvernovus.com";

  constructor(private rest: RestService, private platform: Platform) { }

  public isValid(){
    let isValid = this.email;
    return isValid;
  }

  public logout(){
    return new Promise((resolve,reject)=>{
      this.rest.logout().then(()=>{
        resolve();
      }, err=>{
        reject(err);
      })
    })
  }

  public login(username: string, password: string){
    return new Promise((resolve,reject)=>{
      this.rest.login(username, password)
      .then((response:any)=>{
        if(response.result == "success"){
          this.email = username;
          resolve();
        }
        else{
          reject('Oops, error loging in. Please try again. '+ JSON.stringify(response));
        }
      }, (err: any)=>{
        reject(err);
      })
    })
  }

  public signup(username: string, password: string, name: string){
    return new Promise((resolve,reject)=>{
      this.rest.signup(username, password, name)
      .then((response:any)=>{
        this.email = username;
        resolve();
      }, (err: any)=>{
        reject(err);
      })
    })
  }

  private setUserData(userData: any){
    this.email = userData.username;
  }


  public checkUser(){
    return new Promise((resolve,reject)=>{
      this.rest.getNativeStorageItem('user').then(response=>{
        this.setUserData(response);
        resolve();
      }, err=>{
        reject(err);
      })
    })
  }

}
