import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController, NavController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { User } from 'src/app/classes/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  currentPage: string = 'login';
  user: User = new User();

  constructor(private app: AppService, private router: Router, private alertCtrl: AlertController, private toastCtrl: ToastController, private nav: NavController) { }

  ngOnInit() {
  }

  resetCredentials(){
    this.user = new User();
  }

  public switchPage(page){
    this.resetCredentials();
    this.currentPage = page;
  }

  private goToRoot(){
    this.router.navigateByUrl('/tabs');
  }

  public login(){
    this.app.userCtrl.login(this.user).then(response=>{
      this.goToRoot();
    }, err=>{
      this.promptLoginFailedAlert(err);
    })
  }

  async promptToast(message: string, color: string){
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 15000,
      color: color,
      position: 'bottom',
      buttons: [ {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }
  
  async resetPW(){
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Reset Password',
      inputs: [
        {
          label: 'Email',
          name: 'email',
          id: 'email',
          type: 'email',
          placeholder: 'Enter email for your account'
        },
        {
          label: 'Temporary Password',
          name: 'resetpw',
          id: 'resetpw',
          type: 'password',
          placeholder: 'Enter temporary password'
        },
        {
          label: 'New Password',
          name: 'newpw',
          id: 'newpw',
          type: 'password',
          placeholder: 'Enter new password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (ev) => {
            console.log(ev)
           if(ev.email && ev.resetpw && ev.newpw){
            this.app.userCtrl.resetPW(ev.email, ev.newpw, ev.resetpw).then(()=>{
              this.promptToast('Success! Password reset, you can now log in. ', 'success');
            }, err=>{
              this.promptToast('Error resetting password', 'danger');
            })
           }
           else{
            this.promptToast('Password not reset, email missing.', 'danger');
           }
          }
        }
      ]
    });

    await alert.present();
  }

  async forgotPW(){
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Reset Password',
      inputs: [
        {
          label: 'Email',
          name: 'email',
          id: 'email',
          type: 'email',
          placeholder: 'Enter email for your account'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (ev) => {
            console.log(ev)
           if(ev.email){
            this.app.userCtrl.forgotPW(ev.email).then(()=>{
              this.promptToast('Success! A temporary password has been sent to you. The temporary  password will be valid for 10 minutes. The original password will always continue to work until the password is successfully changed. ', 'success');
            }, err=>{
              this.promptToast('Error resetting password', 'danger');
            })
           }
           else{
            this.promptToast('Password not reset, email missing.', 'danger');
           }
          }
        }
      ]
    });

    await alert.present();
  }

  public signup(){
    this.app.userCtrl.signup(this.user).then(response=>{
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
