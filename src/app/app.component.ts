import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private user: UserService, private platform: Platform, private router: Router) {
    this.platform.ready().then(()=>{
      this.checkUser();
    });

  }

  checkUser(){
    this.user.checkUser().then(()=>{
      if(this.user.isValid()){
        // proceed TODO
      }
      else{
        // login page TODO
      }
    }, err=>{
      console.log(err);
      this.goToLogin();
    })
  }

  login(){
    console.log('loggin in')
    this.user.login('will@silvernovus.com', 'Covid123').then(response=>{
      console.log('logged in')
      console.log(response);
    }, err=>{
      console.log(err);
    })
  }

  goToLogin(){
    this.router.navigateByUrl('/login');
  }


}
