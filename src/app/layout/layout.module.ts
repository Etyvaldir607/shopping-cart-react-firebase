import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from './layout.component';



@NgModule({
  imports: [
    //SharedModule,
    CommonModule,
    RouterModule,
    BrowserModule,
    //ToastModule,
    FormsModule,
  ],
  declarations: [
    LayoutComponent,
    //LoginComponent,
  ],
  exports: [
    LayoutComponent,
    //LoginComponent,
  ],

})
export class LayoutModule { }
