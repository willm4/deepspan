import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    this.handleUnauthorized();
  }

  handleUnauthorized(){
    setTimeout(()=>{
      this.router.navigate(['login'])
    }, 2000);
  }

  goToTabs(){
    setTimeout(()=>{
      this.router.navigate(['tabs/profile'])
    }, 2000);
  }

}
