import {Component, OnInit} from '@angular/core';
import {Station} from "../../models/station";
import {XiaomiSensor} from "../../models/xiaomi-sensor";
import {Air} from "../../models/air";
import {Chart} from "chart.js/auto";

@Component({
  selector: 'app-temperature',
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.scss']
})
export class TemperatureComponent implements OnInit {
  XiaomiSensorKorytarz = new XiaomiSensor();
  station: Station = new Station();
  air_O3: Air = new Air("O3", "O", "3");
  air_PM10: Air = new Air("PM10", "PM", "10");
  air_PM25: Air = new Air("PM25", "PM", "25");
  air_CO: Air = new Air("CO", "CO", "");
  air_SO2: Air = new Air("SO2", "SO", "2");
  air_NO2: Air = new Air("CO3", "CO", "3");
  presureHistory: Array<number> = [1, 2, 3];
  presureChart: any;
  charLabel: any = ['', '', '']


  constructor() {
  }

  ngOnInit(): void {
    this.createPresureChart();
    this.airInfo()
    this.XiaomiSensors();
    setInterval(() => {
      this.XiaomiSensors();
    }, 4000)
    setInterval(() => {
      this.airInfo()
    }, 20000)

  }

  getAirTable(): Array<Air> {
    return [this.air_PM25, this.air_PM10, this.air_O3, this.air_NO2, this.air_SO2, this.air_CO]
  }

  airInfo() {
    fetch("https://spiderservices.pl/stacja/stacjaApi.php/air").then(function (response) {
      return response.json();
    }).then(k => {
      k.forEach((kValue: any) => {
        this.air_O3.valueHistory.push(kValue['O3'])
        this.air_PM10.valueHistory.push(kValue['PM10'])
        this.air_PM25.valueHistory.push(kValue['PM25'])
        this.air_CO.valueHistory.push(kValue['CO'])
        this.air_SO2.valueHistory.push(kValue['SO2'])
        this.air_NO2.valueHistory.push(kValue['NO2'])

        this.air_O3.value_valHistory.push(kValue['O3_val'])
        this.air_PM10.value_valHistory.push(kValue['PM10_val'])
        this.air_PM25.value_valHistory.push(kValue['PM25_val'])
        this.air_CO.value_valHistory.push(kValue['CO_val'])
        this.air_SO2.value_valHistory.push(kValue['SO2_val'])
        this.air_NO2.value_valHistory.push(kValue['NO2_val'])

      })
    });
  }

  XiaomiSensors(): void {
    fetch("https://spiderservices.pl/stacja/stacjaApi.php/temperature").then(function (response) {
      return response.json();
    }).then(k => {

      Object.assign(this.station, k.outSite)
      Object.assign(this.XiaomiSensorKorytarz, k.inside)
      while (this.presureHistory.length > 0) {
        this.presureHistory.pop();
        this.charLabel.pop()

      }

      k.presure.forEach((kk: any) => {
        if (Number(kk['presureBMP']) > 100) {

          this.presureHistory.push(Number((Math.round(kk['presureBMP'] * 100) / 10000).toString().slice(0, -2)));
          this.charLabel.push(kk['data'].split(' ')[1])
        }
        this.charLabel[0] = "teraz"
      })

      console.log(this.presureHistory);
      this.presureChart.update();
//      this.createPresureChart();
    })
  }

  createPresureChart(): any {
    this.presureChart = new Chart("presureChartID", {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: this.charLabel,
        datasets: [
          {
            label: "Wejście",
            data: this.presureHistory,
            borderColor: "#002cff",
            backgroundColor: "#002cff",
            fill: false,
            borderWidth: 4,
            pointStyle: 'rect',
            pointHitRadius: 5,
            pointRadius: 0.1,
            cubicInterpolationMode: 'monotone',
          }
        ]
      },
      options: {
        animation: false,
        aspectRatio: 4,
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
        },
        scales: {
          /* x: {
             ticks: {
               display: false //this will remove only the label
             },
             grid: {
               display: false
             }
           },
            y: {
              ticks: {
                display: false //this will remove only the label
              },
              grid: {
                display: false
              }
            }*/
        }
      }
    });
  }

  setZIndex(name: string, name2: string) {
    // @ts-ignore
    document.getElementById(name).style.zIndex = 11000;
    // @ts-ignore
    document.getElementById(name2).style.zIndex = 100;
  }
}
