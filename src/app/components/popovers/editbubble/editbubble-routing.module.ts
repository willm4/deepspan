import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditbubblePage } from './editbubble.page';

const routes: Routes = [
  {
    path: '',
    component: EditbubblePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditbubblePageRoutingModule {}
