import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {TemperatureComponent} from './components/temperature/temperature.component';
import {NotifierModule} from "angular-notifier";

@NgModule({
  declarations: [
    AppComponent,
    TemperatureComponent
  ],
  imports: [
    BrowserModule,
    NotifierModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
