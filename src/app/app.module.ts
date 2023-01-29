import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {TemperatureComponent} from './components/temperature/temperature.component';
import {NotifierModule} from "angular-notifier";
import { SolarComponent } from './components/solar/solar.component';
import { FurnaceComponent } from './components/furnace/furnace.component';

@NgModule({
  declarations: [
    AppComponent,
    TemperatureComponent,
    SolarComponent,
    FurnaceComponent
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
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
