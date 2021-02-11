import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BubblesPageRoutingModule } from './bubbles-routing.module';

import { BubblesPage } from './bubbles.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BubblesPageRoutingModule
  ],
  declarations: [BubblesPage]
})
export class BubblesPageModule {}
