import {Component, OnInit} from '@angular/core';
import {Meteo} from "./models/meteo";
import {Energy} from "./models/energy";
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
  XiaomiSensorTaty = new XiaomiSensor();
  meteo = new Meteo();
  energy = new Energy();
  time: string = '0';
  monitoring = false;

  constructor(private notifierService: NotifierService) {
  }

  ngOnInit() {
    const queryString = window.location.search;
    if (queryString.indexOf('local=true') >= 0) {
      this.monitoring = true;
    }


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

      this.getTimeClock();
    }, 1000)
    setInterval(() => {
      this.energyRequest();
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
    this.energyRequest();
    this.energyYear();
    this.XiaomiSensors();

  }

  XiaomiSensors() {
    fetch("https://spiderservices.pl/stacja/stacjaApi.php/temperature").then(function (response) {
      return response.json();
    }).then(k => {
      Object.assign(this.XiaomiSensorDuzyPokuj, k.inside2)
      Object.assign(this.XiaomiSensorDol, k.inside3)
      Object.assign(this.XiaomiSensorTaty, k.inside4)
    })
  }

  toLocalNetwork() {
    window.location.href = "http://10.68.6.28/stacja/index/index.html?local=true"
  }

  pobierzPogode() {
    fetch("https://api.open-meteo.com/v1/dwd-icon?latitude=50.06&longitude=22.49&current_weather=true").then(function (response) {
      return response.json();
    }).then(k => {
      Object.assign(this.meteo, k['current_weather'])
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


}
