import {Component, OnInit} from '@angular/core';
import {XiaomiSensor} from "../models/xiaomi-sensor";
import {Meteo} from "../models/meteo";
import {Energy} from "../models/energy";
import {NotifierService} from "angular-notifier";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  title = 'StacjaPogodowa2';
  XiaomiSensorDol = new XiaomiSensor();
  XiaomiSensorDuzyPokuj = new XiaomiSensor();
  XiaomiSensorTaty = new XiaomiSensor();
  XiaomiSensorDol2 = new XiaomiSensor();
  XiaomiSensorPawel = new XiaomiSensor();
  XiaomiSensorMateusz = new XiaomiSensor();

  meteo = new Meteo();
  energy = new Energy();
  time: string = '0';
  monitoring = false;
  power: number = 0
  dataSolar: any;

  constructor(private notifierService: NotifierService) {
  }

  ngOnInit() {
    const queryString = window.location.search;
    if (queryString.indexOf('local=true') >= 0) {
      this.monitoring = true;
    }

    var ostatnieWykonanie = 0;
    setInterval(() => {
      if (ostatnieWykonanie + 1000 < new Date().getTime()) {
        ostatnieWykonanie = new Date().getTime();
        this.getTimeClock();

      }
    }, 300)

    var ostatnieWykonanie1 = 0;
    setInterval(() => {
      if (ostatnieWykonanie1 + 10000 < new Date().getTime()) {
        ostatnieWykonanie1 = new Date().getTime();

        this.XiaomiSensors();
      }
    }, 300)

    var ostatnieWykonanie2 = 0;
    setInterval(() => {
      if (ostatnieWykonanie2 + 20000 < new Date().getTime()) {
        ostatnieWykonanie2 = new Date().getTime();
        this.pobierzPogode();
        this.energyYear();
      }
    }, 300)

    var ostatnieWykonanie3 = 0;
    setInterval(() => {
      if (ostatnieWykonanie3 + 3777 < new Date().getTime()) {
        ostatnieWykonanie3 = new Date().getTime();
        this.energyRequest();
      }
    }, 300)

  }

  XiaomiSensors() {
    fetch("https://spiderservices.pl/stacja/stacjaApi.php/temperature").then(function (response) {
      return response.json();
    }).then(k => {
      Object.assign(this.XiaomiSensorDuzyPokuj, k.inside2)
      Object.assign(this.XiaomiSensorDol, k.inside3)
      Object.assign(this.XiaomiSensorTaty, k.inside4)
      Object.assign(this.XiaomiSensorDol2, k.dol2)
      Object.assign(this.XiaomiSensorPawel, k.pawel)
      Object.assign(this.XiaomiSensorMateusz, k.mateusz)

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
      this.calc();
    })
  }

  getTimeClock() {
    const date = new Date();
    const hour = (date.getHours() >= 10 ? date.getHours() : '0' + date.getHours())
    const minute = (date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes())
    const second = (date.getSeconds() >= 10 ? date.getSeconds() : '0' + date.getSeconds())
    this.time = hour + ":" + minute + ":" + second;
  }

  calc() {
    if (Number(this.energy.getMocCzynnaSuma()) < 0) {
      this.power = Math.round(Number(this.energy.getMocCzynnaSuma()) + Number(this.dataSolar[0].energy1) + Number(this.dataSolar[1].energy * 1000))
    } else {
      this.power = Math.round(Number(this.energy.getMocCzynnaSuma()) - (Number(this.dataSolar[0].energy1) + Number(this.dataSolar[1].energy * 1000)))

    }

  }

  read(event: any) {
    this.dataSolar = event;
    this.calc();
  }

}

