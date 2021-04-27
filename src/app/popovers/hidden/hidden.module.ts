import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HiddenPageRoutingModule } from './hidden-routing.module';

import { HiddenPage } from './hidden.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HiddenPageRoutingModule
  ],
  declarations: [HiddenPage]
})
export class HiddenPageModule {}
