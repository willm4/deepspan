import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private isTest: boolean = false;
  public email: string = "";
  public name: string = "";
  public id: number;
  constructor(private rest: RestService, private platform: Platform) { }

  public isValid(){
    return new Promise((resolve,reject)=>{
      this.rest.getNativeStorageItem('user').then((userData)=>{
        this.setUserData(userData);
        resolve(this.email && this.name && this.id);
      }, err=>{
        reject(err);
      })
    })
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

  public checkSession(){
    return new Promise((resolve,reject)=>{
      this.rest.checkSession().then((response:any)=>{
        if(response.result == "success"){
          resolve();
        }
        else{
          reject();
        }
      },err=>{
        reject();
      })
    })
  }

  public login(username: string, password: string){
    return new Promise((resolve,reject)=>{
      this.rest.login(username, password)
      .then((response:any)=>{
        if(response.result == "success"){
          this.email = this.rest.email;
          this.id = this.rest.id;
          this.name = this.rest.name;
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
        this.email = this.rest.email;
        this.id = this.rest.id;
        this.name = this.rest.name;
        resolve();
      }, (err: any)=>{
        reject(err);
      })
    })
  }

  private setUserData(userData: any){
    return new Promise((resolve,reject)=>{
      if(userData && userData.username && userData.name && userData.id){
        this.email = userData.username;
        this.name = userData.name;
        this.id   = userData.id;
        resolve();
      }
      else{
        this.rest.getProfile().then(response=>{
          this.rest.getNativeStorageItem('user').then((userData: any)=>{
            this.name = userData.name;
            this.id = userData.id;
            resolve();
          }, err=>{
            reject();
          })
        }, err=>{
  
        })
      }
    })
  }


  public checkUser(){
    return new Promise((resolve,reject)=>{
      this.checkSession().then(()=>{
        this.isValid().then((response)=>{
          resolve(response);
        }, err=>{
          reject();
        })
      },err=>{
        reject();
      })
    })
  }

}
