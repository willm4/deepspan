import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  public servicetoken: string;

  constructor(private api: ApiService, private nativeStorage: NativeStorage) { }


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


  public login(email: string, password: string){
    return new Promise((resolve,reject)=>{
      this.getNativeStorageItem('user').then(response=>{
        resolve(response);
      }, err=>{
        let params = {
          email: email,
          password: password
        };
        this.api.post(this.api.login, params).then(response=>{
          console.log(response);
          resolve(response);
        }, err=>{
          reject(err);
        })
      });
    });
  }

  public signup(email: string, password: string, name: string){
    return new Promise((resolve,reject)=>{
      this.getNativeStorageItem('user').then(response=>{
        resolve(response);
      }, err=>{
        let params = {
          name: name,
          email: email,
          password: password,

        };
        this.api.post(this.api.createAccount, params).then(response=>{
          console.log(response);
          resolve(response);
        }, err=>{
          reject(err);
        })
      });
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

  setServiceToken(token){
    this.servicetoken = token;
  }

  public getNativeStorageItem(item: string){
    return new Promise((resolve,reject)=>{
      this.nativeStorage.getItem(item).then(response=>{
        resolve(response);
      }, err=>{
        reject(err);
      })
    })
  }


}
