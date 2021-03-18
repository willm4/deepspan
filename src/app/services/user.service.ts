import { Injectable } from '@angular/core';
import { User } from '../classes/user';
import { ApiService } from './api.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { LocationService } from './location.service';
import {Md5} from 'ts-md5/dist/md5';
@Injectable({
  providedIn: 'root'
})
export class UserService {

    userStatuses =  {
      HEALTH_UNKNOWN      : 0,
      HEALTH_SYMPTOMATIC  : 1,
      HEALTH_INFECTED     : 2,
      HEALTH_CURED        : 3,
      HEALTH_VACCINATED   : 4
    }


    userStatusDict =  [
     {
       name: "UNKNOWN",
       value: this.userStatuses.HEALTH_UNKNOWN
     },
     {
      name: "INFECTED",
      value: this.userStatuses.HEALTH_INFECTED
     },
     {
      name: "CURED",
      value: this.userStatuses.HEALTH_CURED
     },
     {
      name: "VACCINATED",
      value: this.userStatuses.HEALTH_VACCINATED
     },
     {
      name: "SYMPTOMATIC",
      value: this.userStatuses.HEALTH_SYMPTOMATIC
     }
    ];

    public user: User = new User();
    public servicetoken: string = "";
    public build: any = "2.5";
  constructor(private api: ApiService,public nativeStorage: NativeStorage, public locationCtrl: LocationService) { }


  // PRIVATE 
  private clearStorage(){
    this.nativeStorage.clear();
    localStorage.clear();
  }

  private storeItem(name: any, val: any){
    this.nativeStorage.setItem(name,val);
    localStorage.setItem(name, val);
  }

  private getItem(item: string){
    return new Promise((resolve,reject)=>{
      if(this.api.isPWA()){
        let data = localStorage.getItem(item);
        if(data){
          resolve(data);
        }
        else{
          reject('err getting ' + item);
        }
      }
      else{
        this.nativeStorage.getItem(item).then(response=>{
          resolve(response);
        }, err=>{
          reject('err getting ' + item);
        })
      }
    })
  }


  getUserImg(user:User){
    let avatarTxt = user.name && user.name.length > 0
    ? user.name.length >= 2
      ? user.name.split(' ').slice(0,2).join('+')
      : user.name.replace(/ .*/,'')
    : '?'
    return "https://ui-avatars.com/api/?name=" + avatarTxt;

  }

  private handleUserData(data: any){
    this.storeItem('build', this.build);
    this.storeItem('servicetoken', data.session);
    this.setUser(new User(JSON.parse(data.user)));
    this.storeItem('user', JSON.stringify(this.user));
  }

  // PUBLIC
  public logout(){
    return new Promise((resolve,reject)=>{
      this.api.delete(this.api.logout).then(()=>{
        this.clearStorage();
        this.user = new User();
        resolve();
      }, err=>{
        reject(err);
      })
    })
  }

  public setExternalUserData(user: User){
    user.userStatusName = this.getUserStatusName(user);
    user.img = this.getUserImg(user);
    return user;
  }

  private setUser(user: User){
    this.user = this.setExternalUserData(user);
  } 

  private getUserStatusName(user: User){
    return this.userStatusDict.filter(u=>{
      return u.value == user.userstatus
    })[0];
  }

  public editProfile(user: User){
    return new Promise((resolve,reject)=>{
      console.log('editing')
      this.getEditUserParams(user).then((params:any)=>{
        this.api.put(this.api.profile, params).then(response=>{
          this.setUser(user);
          this.storeItem('user', JSON.stringify(user));
          resolve();
      }, err=>{
        reject(err);
      })
      },err=>{
        reject(err);
      })
    })
  } 

  public forgotPW(email: string){
    return new Promise((resolve,reject)=>{
      let params = {
        email: email
      };
      this.api.post(this.api.forgotPw, params).then(()=>{
        resolve();
      }, err=>{
        reject();
      })
    })
  }

  public resetPW(email: string,password: string, resetpassword: string){
    return new Promise((resolve,reject)=>{
      let params = {
        email: email,
        password: password, 
        resetpassword: resetpassword
      };
      this.api.post(this.api.setNewPW, params).then(()=>{
        resolve();
      }, err=>{
        reject();
      })
    })
  } 

  public newPW(currentpw: string, newpw: string){
    return new Promise((resolve,reject)=>{
      let params = {
        id: this.user.id,
        password: currentpw,
        newPassword: newpw
      };
      this.api.put(this.api.newPw, params).then(response=>{
        resolve();
      }, err=>{
        reject();
      })
    })
  }

  public getEditUserParams(user: User){
    return new Promise((resolve,reject)=>{
      user.userstatus = user.userStatusName.value;
      let params = {
        admin2: {String: "", Valid: false},
        countryregion: {String: "", Valid: false},
        createdat: "2021-02-25T20:21:08.925228Z",
        creatorestimate: {Int32: 0, Valid: false},
        creatorid: {Int32: 1, Valid: true},
        Int32: 1,
        Valid: true,
        email: user.email,
        id: 4,
        lasttouch: {Time: "2021-03-10T02:45:19.139624Z", Valid: true},
        lat: {Float64: 0, Valid: false},
        lon: {Float64: 0, Valid: false},
        membercount: 8,
        name: user.name,
        ownerid: 0,
        password: "",
        provincestate: {String: "", Valid: false},
        resetexpiration: {Time: "0001-01-01T00:00:00Z", Valid: false},
        resetpassword: {String: "", Valid: false},
        resetuuid: {String: "", Valid: false},
        role: {Int32: 0, Valid: true},
        userstatus: user.userstatus,
        uuid: "cc1e8c0d-8b95-4665-41db-ade79b7abd70"
       }
        this.locationCtrl.setLocation().then(()=>{
          params.admin2 = this.locationCtrl.location.admin2;
          params.provincestate = this.locationCtrl.location.provinceStateName;
          params.lat = this.locationCtrl.location.lat;
          params.lon = this.locationCtrl.location.lon;
          resolve(params);
      }, err=>{
          reject(err);
      })
    })
  }

  public login(user: User){
      console.log('ogging in')
    return new Promise((resolve,reject)=>{
      let params = {
        email: user.email,
        password: user.password
      };
      this.api.post(this.api.login, params, true).then((response:any)=>{
          this.handleUserData(response);
        resolve();
      }, err=>{
        reject(err);
      });
    });
  }

  public signup(params:any){
    return new Promise((resolve,reject)=>{
      this.locationCtrl.setLocation().then(()=>{
        this.api.post(this.api.createAccount, params, true).then((response:any)=>{
          let user = new User();
          user.email = params.email;
          user.password = params.password;
              // TODO: get same as login -- missing service token 
          this.login(user).then((userdata: any)=>{
            resolve();
          }, err=>{
            reject();
          })
        }, err=>{
          reject(err);
        })
      })
    });
  }


  public checkSession(){
      console.log('checking')
    return new Promise((resolve,reject)=>{
        let serviceTokenPromise = new Promise((res,reject)=>{
            this.getItem('servicetoken').then((response: any)=>{
                this.servicetoken = response;
                res();
            }, err=>{
                reject();
            })
        });
        let buildPromise = new Promise((res,reject)=>{
            this.getItem('build').then((response: any)=>{
                if(this.build != response){
                    reject();
                }
                else{
                  res();
                }
            }, err=>{
                reject();
            });
        });
        let userPromise = new Promise((res,reject)=>{
            this.getItem('user').then((response: any)=>{
                this.setUser(new User(JSON.parse(response)));
                res();
            }, err=>{
                reject();
            })
        });

        Promise.all([serviceTokenPromise, buildPromise, userPromise]).then(()=>{
            resolve();
        }, err=>{
            reject();
        });
    });
  }

}
