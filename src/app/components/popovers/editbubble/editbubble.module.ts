import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditbubblePageRoutingModule } from './editbubble-routing.module';

import { EditbubblePage } from './editbubble.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditbubblePageRoutingModule
  ],
  declarations: [EditbubblePage]
})
export class EditbubblePageModule {}
