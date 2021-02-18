import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  public servicetoken: string;
  public email :string;
  constructor(private api: ApiService, private nativeStorage: NativeStorage) { }

  public getBubbles(){
    return new Promise((resolve,reject)=>{
      this.nativeStorage.getItem('bubbles').then((response)=>{
        let data = JSON.parse(response);
        if(new Date(data['updated']).toLocaleDateString() == new Date().toLocaleDateString()){
          resolve(data['data']);
        }
        else{
          this.getBubblesFromServer().then((response:any)=>{
            resolve(response);
          }, err=>{
            reject(err);
          })
        }
      }, err=>{
        this.getBubblesFromServer().then(response=>{
          resolve(response);
        }, err=>{
          reject(err);
        })
      })
    })
  }

  public removeBubble(id: number){
    return new Promise((resolve,reject)=>{
      this.api.delete(this.api.deleteBubble  + id , this.servicetoken).then(response=>{
        resolve(response);
      }, err=>{
        reject(err);
      })
    })
  }

  public addBubble(email: string){
    return new Promise((resolve,reject)=>{
      let params = {members: [email]};
      this.api.post(this.api.addBubbles, params, this.servicetoken).then(response=>{
        resolve(response);
      }, err=>{
        reject(err);
      })
    })
  }

  private getBubblesFromServer(){
    return new Promise((resolve,reject)=>{
      this.api.get(this.api.getBubblesWithEmail, this.servicetoken).then(response=>{
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
      this.nativeStorage.getItem('ipc').then((response:any)=>{
        let data = JSON.parse(response);
        if(new Date(data['updated']).toLocaleDateString() == new Date().toLocaleDateString()){
          resolve(data['data']);
        }
        else{
          this.getIPCFromServer(region,state,lat,lon).then(response=>{
            let nativeData = {updated: new Date(), data: response};
            this.nativeStorage.setItem('ipc', JSON.stringify(nativeData));
            resolve(response);
          },err=>{
            reject(err);
          })
        }
      }, err=>{
        this.getIPCFromServer(region,state,lat,lon).then(response=>{
          let nativeData = {updated: new Date(), data: response};
          this.nativeStorage.setItem('ipc', JSON.stringify(nativeData));
          resolve(response);
        },err=>{
          reject(err);
        })
      })
    })
  }

  private getIPCFromServer(region: string = null, state: string = null, lat: any = null, lon: any = null){
    return new Promise((resolve,reject)=>{
      if(!(region && state) && !(lat && lon)){
        reject();
      }
      else{
        let body = {
          countryregion: region || 'US', // COUNTRY
          provincestate: state || 'Washington', // STATE
          admin2: 'King', //TODO  
          lat: lat || '',
          lon: lon || ''
        };
        console.log(body)
        this.api.post(this.api.ipc, body).then(response=>{
          resolve(response);
        }, err=>{
          reject(err);
        })
      }
    })
  }

  public logout(){
    return new Promise((resolve,reject)=>{
      this.api.delete(this.api.logout, this.servicetoken).then(response=>{
        this.nativeStorage.clear();
        localStorage.clear();
        resolve();
      }, err=>{
        reject();
      })
    });
  }

  public login(email: string, password: string){
    return new Promise((resolve,reject)=>{
      let params = {
        email: email,
        password: password
      };
      this.api.post(this.api.login, params).then((response:any)=>{
        console.log(response);
        let storageItem = JSON.stringify( {
          username: email,
          servicetoken:  response.session
        });
        console.log('setting local storage item' + 'user');
        localStorage.setItem('user', storageItem);
        if(!this.api.isPWA()){
          this.nativeStorage.setItem('user',storageItem);
        }
        resolve(response);
      }, err=>{
        reject(err);
      });
    });
  }

  public signup(email: string, password: string, name: string){
    return new Promise((resolve,reject)=>{
      let params = {
        name: name,
        email: email,
        password: password,

      };
      this.api.post(this.api.createAccount, params).then((response:any)=>{
        console.log(response);
        let storageItem = JSON.stringify( {
          username: email,
          servicetoken:  response.session
        });
        localStorage.setItem('user', storageItem);
        if(!this.api.isPWA()){
          this.nativeStorage.setItem('user',storageItem);
        }
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
      this.api.get(this.api.document + type, this.servicetoken).then(response=>{
        resolve(response['tbody']);
      })
    })
  }

  setUserData(token, email){
    this.servicetoken = token;
    this.email = email;
  }

  public getNativeStorageItem(item: string){
    return new Promise((resolve,reject)=>{
      if(this.api.isPWA()){
        console.log('getting local storage item' + item);
        let data = localStorage.getItem(item);
        console.log('got local storage item' + data);
        if(data){
          resolve(data);
        }
        else{
          reject('err getting data');
        }
      }
      else{
        this.nativeStorage.getItem(item).then(response=>{
          resolve(response);
        }, err=>{
          reject(err);
        })
      }
    })
  }


}
