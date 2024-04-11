import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { LayoutModule } from './layout/layout.module';
import { SharedModule } from './shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from "@angular/fire/auth";
import { LoginModule } from './modules/login/login.module';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { AuthService } from './shared/services/auth.service';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    CoreModule,
    LayoutModule,
    SharedModule,
    FormsModule,
    //ToastModule,

    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
  ],
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
