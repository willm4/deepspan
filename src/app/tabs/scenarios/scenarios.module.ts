import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScenariosPageRoutingModule } from './scenarios-routing.module';

import { ScenariosPage } from './scenarios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScenariosPageRoutingModule
  ],
  declarations: [ScenariosPage]
})
export class ScenariosPageModule {}
