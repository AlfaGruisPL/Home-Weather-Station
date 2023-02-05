import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {TemperatureComponent} from './components/temperature/temperature.component';
import {NotifierModule} from "angular-notifier";
import {SolarComponent} from './components/solar/solar.component';
import {FurnaceComponent} from './components/furnace/furnace.component';
import {AirInfoComponent} from './components/temperature/air-info/air-info.component';
import {AppRoutingModule} from './app-routing.module';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    TemperatureComponent,
    SolarComponent,
    FurnaceComponent,
    AirInfoComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,

    NotifierModule.withConfig(
      {
        position: {
          horizontal: {
            position: 'right'
          },
          vertical: {
            position: "bottom"
          }
        }
      }
    ),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
