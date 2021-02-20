import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  currentPage: string = 'login';
  email: string = '';
  password: string = '';
  name: string = '';

  constructor(private app: AppService, private router: Router, private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  resetCredentials(){
    this.email = '';
    this.password = '';
    this.name = '';
  }

  public switchPage(page){
    this.resetCredentials();
    this.currentPage = page;
  }

  private goToRoot(){
    this.router.navigateByUrl('/tabs');
  }

  public login(){
    this.app.user.login(this.email, this.password).then(response=>{
      this.goToRoot();
    }, err=>{
      this.promptLoginFailedAlert(err);
    })
  }

  public signup(){
    this.app.user.signup(this.email, this.password, this.name).then(response=>{
      this.goToRoot();
    }, err=>{
      this.promptSignupFailedAlert(err);
    })
  }

  private promptLoginFailedAlert(err: string){
    this.promptErrAlert("LOGIN FAILED", err);
  }

  private promptSignupFailedAlert(err: string){
    this.promptErrAlert("SIGN UP FAILED", err);
  }
  
  private async promptErrAlert(title: string, msg: string){
    console.log(msg);
    const alert = await this.alertCtrl.create({
      header: title,
      subHeader: '',
      message: msg,
      buttons: ['CLOSE']
    });

    await alert.present();
  }

}
