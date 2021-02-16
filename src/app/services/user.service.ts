import { Injectable } from '@angular/core';
import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private isTest: boolean = true;
  public email: string = !this.isTest ? "" : "will@silvernovus.com";
  public password: string = !this.isTest ? "" : "Covid123";
  public name: string = !this.isTest ? "" : "Will";
  private servicetoken: string = !this.isTest ? "" : "b9b0e491-d741-4986-64ae-dc873cd89360";

  constructor(private rest: RestService) { }

  public isValid(){
    let isValid = this.email && this.password && this.servicetoken;
    if(isValid){
      this.rest.setServiceToken(this.servicetoken);
    }
    return isValid;
  }

  public login(username: string, password: string){
    return new Promise((resolve,reject)=>{
      this.rest.login(username, password)
      .then((response:any)=>{
        if(response.result == "success"){
          this.email = username;
          this.password = password;
          this.servicetoken = response.session;
          this.rest.setServiceToken(this.servicetoken);
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
        this.password = password;
        this.name = name;
        this.servicetoken = response.uuid;
        this.rest.setServiceToken(this.servicetoken);
        resolve();
      }, (err: any)=>{
        reject(err.error.message);
      })
    })
  }

  private setUserData(data: any){
    let userData = JSON.parse(data);
    this.email        = userData.username;
    this.password     = userData.password;
    this.servicetoken = userData.servicetoken;
    this.rest.setServiceToken(this.servicetoken);
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
