import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Bubble } from '../classes/bubble';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private api: ApiService, public nativeStorage: NativeStorage) { }

  public getBubbles(){
    return new Promise((resolve,reject)=>{
      this.getBubblesFromServer().then((response:any)=>{
        resolve(response);
      }, err=>{
        reject(err);
      })
    })
  }

  public removeBubble(id: number){
    return new Promise((resolve,reject)=>{
      this.api.delete(this.api.deleteBubble  + id).then(response=>{
        resolve(response);
      }, err=>{
        reject(err);
      })
    })
  }

  public addBubble(bubble: Bubble){
    return new Promise((resolve,reject)=>{
      let params = {members: [{email: bubble.email, name: bubble.name}]};
      this.api.post(this.api.addBubbles, params).then(response=>{
        resolve(response);
      }, err=>{
        reject(err);
      })
    })
  }

  private getBubblesFromServer(){
    return new Promise((resolve,reject)=>{
      this.api.get(this.api.getBubblesWithEmail).then(response=>{
        let nativeData = {updated: new Date(), data: response};
        this.nativeStorage.setItem('bubbles', JSON.stringify(nativeData));
        resolve(response);
      }, err=>{
        reject(err);
      })
    })
  }

  public getIPC(region: string, state: string, lat: any = null, lon: any = null){
    return new Promise((resolve,reject)=>{
      console.log('getting ipc');
      this.getIPCFromServer(region,state,lat,lon).then(response=>{
        // let nativeData = {updated: new Date(), data: response};
        // this.nativeStorage.setItem('ipc', JSON.stringify(nativeData));
        resolve(response);
      },err=>{
        reject(err);
      })
    })
  }

  private getIPCFromServer(region: string = null, state: string = null, lat: any = null, lon: any = null){
    return new Promise((resolve,reject)=>{
      let body = {
        countryregion: 'US', // COUNTRY
        provincestate: state, // STATE
        admin2: region, //TODO  
        lat: lat,
        lon: lon
      };
      console.log(body)
      this.api.post(this.api.ipc, body).then(response=>{
        resolve(response);
      }, err=>{
        reject(err);
      })
    })
  }

  public logout(){
    return new Promise((resolve,reject)=>{
      this.api.delete(this.api.logout).then(response=>{
        this.nativeStorage.clear();
        localStorage.clear();
        resolve();
      }, err=>{
        reject();
      })
    });
  }

  public checkSession(){
    return new Promise((resolve,reject)=>{
      this.api.get(this.api.sessionCheck).then(response=>{
        resolve(response);
      }, err=>{
        reject();
      })
    })
  }

  public login(email: string, password: string){
    return new Promise((resolve,reject)=>{
      let params = {
        email: email,
        password: password
      };
      this.api.post(this.api.login, params, true).then((response:any)=>{
        let storageItem = JSON.stringify( {
          username: email,
          servicetoken:  response.session
        });
        this.nativeStorage.setItem('user',storageItem);
        localStorage.setItem('user', storageItem);
        this.getProfile().then(()=>{
          resolve();
        }, err=>{
          reject();
        })
      }, err=>{
        reject(err);
      });
    });
  }

  public getProfile(){
    return new Promise((resolve,reject)=>{
      this.api.get(this.api.profile).then((profData: any)=>{
        this.getNativeStorageItem('user').then((user: any)=>{
          user.name = profData.name;
          this.nativeStorage.setItem('user',JSON.stringify(user));
          localStorage.setItem('user', JSON.stringify(user));
          resolve();
        }, err=>{
          reject();
        });
      }, err=>{
        reject();
      })
    })
  }

  public signup(email: string, password: string, name: string){
    return new Promise((resolve,reject)=>{
      let params = {
        name: name,
        email: email,
        password: password,

      };
      this.api.post(this.api.createAccount, params, true).then((response:any)=>{
        let storageItem = JSON.stringify( {
          username: email,
          name: name,
          servicetoken:  response.session
        });
        this.nativeStorage.setItem('user',storageItem);
        localStorage.setItem('user', storageItem);
        resolve(response);
      }, err=>{
        reject(err);
      })
    });
  }

  getDocument(type: string){
    return new Promise((resolve,reject)=>{
      this.nativeStorage.getItem(type).then((response:any)=>{
        let doc = JSON.parse(response);
        if(new Date(doc['updated']).toLocaleDateString() == new Date().toLocaleDateString()){
          resolve(doc['data']);
        }
        else{
          this.getDocFromServer(type).then((response:string)=>{
            this.setDoc(type,response);
            resolve(response);
          }, err=>{
            reject(err);
          })
        }
      }, err=>{
        this.getDocFromServer(type).then((response:string)=>{
          this.setDoc(type,response);
          resolve(response);
        }, err=>{
          reject(err);
        })
      })
    })
  }

  setDoc(type: string, docData: string){
    let doc = {
      updated: new Date(),
      data: docData
    };
    this.nativeStorage.setItem(type, JSON.stringify(doc));
  }

  getDocFromServer(type){
    return new Promise((resolve,reject)=>{
      this.api.get(this.api.doc + type).then(response=>{
        resolve(response['tbody']);
      })
    })
  }


  public getNativeStorageItem(item: string){
    return new Promise((resolve,reject)=>{
      if(this.api.isPWA()){
        let data = localStorage.getItem(item);
        if(data){
          resolve(JSON.parse(data));
        }
        else{
          reject('err getting data');
        }
      }
      else{
        this.nativeStorage.getItem(item).then(response=>{
          resolve(JSON.parse(response));
        }, err=>{
          reject(err);
        })
      }
    })
  }


}
