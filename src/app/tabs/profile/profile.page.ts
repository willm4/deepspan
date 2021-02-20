import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(public app: AppService, private router: Router) { }

  ngOnInit() {
  }

  viewDoc(type){
    this.router.navigate(['/document', {type:type }])
  }

  logout(){
    this.app.user.logout().then(()=>{
      this.router.navigateByUrl('/login')
    }, err=>{
      console.log('err signing out ' + err);
    })
  }

}
