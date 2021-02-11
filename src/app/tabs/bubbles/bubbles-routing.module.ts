import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BubblesPage } from './bubbles.page';

const routes: Routes = [
  {
    path: '',
    component: BubblesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BubblesPageRoutingModule {}
