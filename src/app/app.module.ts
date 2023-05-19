import { ApplicationModule, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgbAlertModule, NgbCarouselModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './components/header/header.component';
import { CarListComponent } from './components/car-list/car-list.component';
import { CarFormComponent } from './components/car-form/car-form.component';
import { HomeComponent } from './components/home/home.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { SplashScreenStateService } from './services/splash-screen-state.service';
import { CarService } from './services/car.service';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ToastGlobalComponent } from './components/toast-global/toast-global.component';
import { ToastsContainer } from "./components/toast-global/toasts-container.component";


@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        CarListComponent,
        CarFormComponent,
        HomeComponent,
        SplashScreenComponent,
        ToastGlobalComponent,
    ],
    // exports: [
    //   CommonModule,
    //   ApplicationModule
    // ],
    providers: [SplashScreenStateService, CarService],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        NgbModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        NgbCarouselModule,
        ToastsContainer
    ]
})
export class AppModule { }
