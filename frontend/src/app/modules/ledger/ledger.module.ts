import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LedgerRoutingModule } from './ledger-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LedgerRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class LedgerModule { }
