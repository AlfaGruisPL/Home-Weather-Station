import {Component, OnInit} from '@angular/core';
import {Meteo} from "./models/meteo";
import {Piec} from "./models/piec";
import {Energy} from "./models/energy";
import {Solar} from "./models/solar";
import {XiaomiSensor} from "./models/xiaomi-sensor";
import {NotifierService} from "angular-notifier";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'StacjaPogodowa2';
  XiaomiSensorDol = new XiaomiSensor();
  XiaomiSensorDuzyPokuj = new XiaomiSensor();
  solar = new Solar();

  meteo = new Meteo();
  piec = new Piec();
  energy = new Energy();
  time: string = '0';

  constructor(private notifierService: NotifierService) {
  }

  ngOnInit() {
    let isTabActive: boolean;
    let isTabActiveLast = false;
    window.onfocus = function () {
      isTabActive = true;
    };
    window.onblur = function () {
      isTabActive = false;
    };

    setInterval(() => {
      if (isTabActive != isTabActiveLast) {
        if (isTabActive) {
          this.getAll();
          this.notifierService.notify('success', 'Trwa odświeżanie danych');
        }
        isTabActiveLast = isTabActive
      }
    }, 100);


    this.getAll();
    setInterval(() => {
      this.piecRequest();
      this.getTimeClock();
    }, 1000)
    setInterval(() => {
      this.energyRequest();
      this.solarRequest();
      this.XiaomiSensors();
    }, 10000)
    setInterval(() => {
      this.pobierzPogode();
    }, 20000)
    setInterval(() => {
      this.energyYear();
    }, 60000)
  }

  getAll() {

    this.getTimeClock();
    this.pobierzPogode();
    this.piecRequest();
    this.energyRequest();
    this.energyYear();
    this.solarRequest();
    this.XiaomiSensors();

  }

  XiaomiSensors() {
    fetch("https://spiderservices.pl/stacja/stacjaApi.php/temperature").then(function (response) {
      return response.json();
    }).then(k => {
      Object.assign(this.XiaomiSensorDuzyPokuj, k.inside2)
      Object.assign(this.XiaomiSensorDol, k.inside3)

    })
  }

  pobierzPogode() {
    fetch("https://api.open-meteo.com/v1/dwd-icon?latitude=50.06&longitude=22.49&current_weather=true").then(function (response) {
      return response.json();
    }).then(k => {
      Object.assign(this.meteo, k['current_weather'])
    })
  }

  piecRequest() {
    fetch("https://spiderservices.pl/stacja/stacjaApi.php/furnace").then(function (response) {
      return response.json();
    }).then(kLocal => {
      Object.assign(this.piec, kLocal);
      if (Number(kLocal.temp1.split(",")[0]) > 25) {
        // @ts-ignore
        document.getElementById("furnaceImg2").style.opacity = "1"        // @ts-ignore
        document.getElementById("furnacFirePlate").style.opacity = "1"        // @ts-ignore
        document.getElementById("furnaceFire").style.opacity = "1";        // @ts-ignore
        document.getElementById('furnaceBack').style.background = "#ff9090";
      } else {
        // @ts-ignore
        document.getElementById("furnaceImg2").style.opacity = "0";       // @ts-ignore
        document.getElementById("furnacFirePlate").style.opacity = "0";       // @ts-ignore
        document.getElementById("furnaceFire").style.opacity = "0";        // @ts-ignore
        document.getElementById('furnaceBack').style.background = "#8af5ff";
      }
    })
  }

  energyYear() {
    fetch("https://spiderservices.pl/stacja/stacjaApi.php/energyYear").then(function (response) {
      return response.json();
    }).then(kLocal => {
      Object.assign(this.energy, kLocal[0])

    })
  }

  energyRequest() {
    fetch("https://spiderservices.pl/stacja/stacjaApi.php/energyNow").then(function (response) {
      return response.json();
    }).then(kLocal => {
      Object.assign(this.energy, kLocal)
    })
  }

  getTimeClock() {
    const date = new Date();
    const hour = (date.getHours() >= 10 ? date.getHours() : '0' + date.getHours())
    const minute = (date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes())
    const second = (date.getSeconds() >= 10 ? date.getSeconds() : '0' + date.getSeconds())
    this.time = hour + ":" + minute + ":" + second;
  }

  solarRequest() {
    fetch("https://spiderservices.pl/stacja/stacjaApi.php/solar").then(function (response) {
      return response.json();
    }).then(kLocal => {
      Object.assign(this.solar, kLocal[0])
    })
  }
}
