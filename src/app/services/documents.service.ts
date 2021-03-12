import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  constructor(private storage: NativeStorage, private api: ApiService) { }

  getDocument(type: string){
    return new Promise((resolve,reject)=>{
      this.storage.getItem(type).then((response:any)=>{
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
    this.storage.setItem(type, JSON.stringify(doc));
  }

  getDocFromServer(type){
    return new Promise((resolve,reject)=>{
      this.api.get(this.api.doc + type).then(response=>{
        resolve(response['tbody']);
      })
    })
  }

}
