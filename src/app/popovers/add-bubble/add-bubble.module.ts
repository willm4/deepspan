import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddBubblePageRoutingModule } from './add-bubble-routing.module';

import { AddBubblePage } from './add-bubble.page';
import { BubbleEditComponent } from 'src/app/components/bubble-edit/bubble-edit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddBubblePageRoutingModule
  ],
  declarations: [AddBubblePage,BubbleEditComponent]
})
export class AddBubblePageModule {}
