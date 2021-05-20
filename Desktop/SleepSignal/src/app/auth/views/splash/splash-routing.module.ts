import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SplashPage } from './splash.page';
import { TabsPageModule } from 'src/app/tabs/tabs.module';

const routes: Routes = [
  {
    path: '',
    component: SplashPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), TabsPageModule],
  exports: [RouterModule],
})
export class SplashPageRoutingModule {}
