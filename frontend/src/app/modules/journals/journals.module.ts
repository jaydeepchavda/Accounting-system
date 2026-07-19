import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { JournalsRoutingModule } from './journals-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    JournalsRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class JournalsModule { }
