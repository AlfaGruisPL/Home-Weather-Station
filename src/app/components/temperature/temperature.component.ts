import {Component, OnInit} from '@angular/core';
import {Station} from "../../models/station";
import {XiaomiSensor} from "../../models/xiaomi-sensor";

@Component({
  selector: 'app-temperature',
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.scss']
})
export class TemperatureComponent implements OnInit {
  XiaomiSensorKorytarz = new XiaomiSensor();
  station: Station = new Station();

  constructor() {
  }

  ngOnInit(): void {
    this.XiaomiSensors();
    setInterval(() => {
      this.XiaomiSensors();
    }, 1000)
  }

  XiaomiSensors(): void {
    fetch("https://spiderservices.pl/stacja/stacjaApi.php/temperature").then(function (response) {
      return response.json();
    }).then(k => {
      Object.assign(this.station, k.outSite)
      Object.assign(this.XiaomiSensorKorytarz, k.inside)

    })
  }
}
