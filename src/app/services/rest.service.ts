import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  public servicetoken: string;

  constructor(private api: ApiService, private nativeStorage: NativeStorage) { }

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
