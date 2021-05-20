import { Component } from '@angular/core';
import { HealthKit } from '@ionic-native/health-kit/ngx';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private healthkit: HealthKit, private toastCtrl: ToastController) {
    this.healthkit.available().then(()=>{
      this.healthkit.checkAuthStatus({}).then((status)=>{
        console.log(status);
      })
    }, err=>{
      //this.promptToast("Can't use healthkit: " + err, 'danger');
    })

  }


  async promptToast(msg: string, color: string){
    await (await this.toastCtrl.create({header: msg, color: color, duration:2000})).present();
  }
}
