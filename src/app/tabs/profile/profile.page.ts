import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(public user: UserService, private router: Router) { }

  ngOnInit() {
  }

  viewDoc(type){
    this.router.navigate(['/document', {type:type }])
  }

}
