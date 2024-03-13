import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from './layout.component';
import { HeaderComponent } from './header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';

@NgModule({
  imports: [
    //SharedModule,
    CommonModule,
    RouterModule,
    BrowserModule,
    MatToolbarModule,
    MatIconModule,
    MatBadgeModule,
    //ToastModule,
    FormsModule,
  ],
  declarations: [
    LayoutComponent,
    HeaderComponent,
    //LoginComponent,
  ],
  exports: [
    LayoutComponent,
    HeaderComponent,
    //LoginComponent,
  ],

})
export class LayoutModule { }
