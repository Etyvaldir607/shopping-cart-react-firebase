import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCommonModule } from "@angular/material/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

//import { ToastComponent } from './components/toast/toast.component';
//import { ToastModule } from 'primeng/toast';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCommonModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,

  ],
  exports: [
  ],
})
export class SharedModule {}
