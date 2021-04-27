import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HiddenPage } from './hidden.page';

const routes: Routes = [
  {
    path: '',
    component: HiddenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HiddenPageRoutingModule {}
