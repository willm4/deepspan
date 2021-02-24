import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { AppService } from './services/app.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform: Platform, private router: Router, private app: AppService) {
    this.platform.ready().then(()=>{
      this.checkUser();
 
    });

  }

  checkUser(){
    this.app.user.isValid().then(isValid=>{
      if(!isValid){
        this.app.user.checkUser().then((validAfterCheck)=>{
          if(!validAfterCheck){
            this.goToLogin();
          }
        }, err=>{
          this.goToLogin();
        })
      }
    }, err=>{
      this.goToLogin();
    })
  }

  goToLogin(){
    this.router.navigateByUrl('/login');
  }


}
