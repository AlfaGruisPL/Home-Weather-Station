import {Component, OnDestroy, OnInit} from '@angular/core';
import {Solar} from "../../models/solar";
import {Chart, TooltipItem} from 'chart.js/auto'
import {Energy} from "../../models/energy";

@Component({
  selector: 'app-solar',
  templateUrl: './solar.component.html',
  styleUrls: ['./solar.component.scss']
})
export class SolarComponent implements OnInit, OnDestroy {
  solar = new Solar();
  focus = false;
  solarWczoraj = new Solar();
  interval1: any;
  interval2: any;
  interval3: any;
  solarWykres: Solar[] = [];
  public chart: any;
  allDayLabel: String[] = [];
  allDayValue: number[] = [];

  allDayEnergySendValue: number[] = [];
  allDayEnergyReciveValue: number[] = [];
  energyData: Energy[] = [];


  constructor() {
  }

  ngOnInit(): void {
    this.solarRequest()
    this.createChart()

    this.interval3 = setInterval(() => {

      this.solarRequest();
    }, 4000)
    var active = false;
    var activeBack = 0;

    this.interval2 = setInterval(() => {
        var k = document.getElementById('solarPanel')
        if (document.activeElement == k) {
          active = true
        } else {
          active = false;
        }

      }
      , 100)
    this.interval1 = setInterval(() => {
      if (active) {

      }
    }, 71000)
  }

  ngOnDestroy() {
    clearInterval(this.interval1);
    clearInterval(this.interval2);
    clearInterval(this.interval3);
  }

  solarRequest() {
    fetch("https://spiderservices.pl/stacja/stacjaApi.php/solar").then(function (response) {
      return response.json();
    }).then(kLocal => {
      Object.assign(this.solar, kLocal['dzis'][0])
      Object.assign(this.solarWczoraj, kLocal['wczoraj'][0])
      if (!this.sameDay(new Date(), new Date(this.solar.time))) {
        this.solarWczoraj = this.solar;
        this.solar = new Solar();
      }
    })
  }

  solarRequestBottom() {
    fetch("https://spiderservices.pl/stacja/stacjaApi.php/solarBottom").then(function (response) {
      return response.json();
    }).then(kLocal => {
      let k3 = 0;
      while (this.allDayLabel.length > 0) {
        this.allDayLabel.pop();
      }
      while (this.allDayValue.length > 0) {
        this.allDayValue.pop();
      }
      while (this.allDayEnergySendValue.length > 0) {
        this.allDayEnergySendValue.pop();
      }
      while (this.allDayEnergyReciveValue.length > 0) {
        this.allDayEnergyReciveValue.pop();
      }
      while (this.energyData.length > 0) {
        this.energyData.pop();
      }
      this.chart.update();
      kLocal['energia'].forEach((k: any) => {
        k['date'] = new Date(k['date_timestamp'] * 1000)
      })
      kLocal['energia'].forEach((k: any) => {
        const kk = new Energy()
        Object.assign(kk, k)
        this.energyData.push(kk)
      })
      this.energyData.forEach((k5: any) => {
        this.allDayEnergySendValue.push(k5.send / 100);
        this.allDayEnergyReciveValue.push(k5.recive / 100);
      })
      kLocal['wykresDni'].forEach((k: Solar) => {
        const kk = new Solar();
        Object.assign(kk, k)
        this.solarWykres.push(kk)
        this.allDayValue.push(kk.all_at_day)
        if (k3 == 0) {
          this.allDayLabel.push("Dziś")
        } else if (k3 == 1) {
          this.allDayLabel.push("Wczoraj")
        } else {
          this.allDayLabel.push(String(kk.time).split(" ")[0].trim())
        }
        k3++;
      })
      if (!this.sameDay(new Date(), new Date(this.solar.time))) {
        this.allDayValue.push(0)
      }
      this.chart.update();
    })
  }

  createChart() {
    this.solarRequestBottom()
    setInterval(() => {
      this.solarRequestBottom()
    }, 30000)

    this.chart = new Chart("MyChart", {
      type: 'bar', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: this.allDayLabel,
        datasets: [
          {
            label: "Produkcja",
            data: this.allDayValue,
            backgroundColor: '#3eff00'
          },
          {
            label: "Wysłane",
            data: this.allDayEnergySendValue,
            backgroundColor: '#097dff'
          },
          {
            label: "Pobrane",
            data: this.allDayEnergyReciveValue,
            backgroundColor: '#000331'
          }
        ]
      },
      options: {
        animation: false,
        aspectRatio: 1.5,
        responsive: true,
        plugins: {
          legend: {
            labels: {
              // This more specific font property overrides the global property
              font: {
                size: 50
              }
            }
          },
          title: {
            display: true,
            font: {
              size: 50,
              family: 'vazir'
            }
          },
          tooltip: {
            mode: 'index',
            position: 'average',
            titleFont: {
              size: 50
            },
            footerFont: {
              size: 38
            },
            footerColor: '#ececec',
            bodyFont: {
              size: 50
            }, callbacks: {
              title: function (context) {
                return "Data:  " + context[0].label
              },
              label(tooltipItem: TooltipItem<any>): string | string[] | void {
                switch (tooltipItem.dataset.label) {
                  case 'Wysłane':
                    return " " + tooltipItem.dataset.label + ":     " + tooltipItem.formattedValue + " kWh"
                    break;
                  case 'Produkcja':
                    var k = tooltipItem.formattedValue;
                    if (k.toString().length <= 4) {
                      k += '0';
                    }
                    return " " + tooltipItem.dataset.label + ":   " + k + " kWh"
                    break;
                  default:
                    return " " + tooltipItem.dataset.label + ":     " + tooltipItem.formattedValue + " kWh"
                    break;
                }
              },
              footer(tooltipItems: TooltipItem<any>[]): string | string[] | void {
                if (tooltipItems[2] == undefined) return "----";
                // @ts-ignore
                const prad = Math.round(((tooltipItems[2].raw) - (tooltipItems[1].raw * 0.8)) * 100) / 100
                // @ts-ignore
                const autoKonsumpcja = Math.round((tooltipItems[0].raw - tooltipItems[1].raw) * 100) / 100
                return "Prąd realny: " + prad + " kWh     \nAutokonsumpcja: " + autoKonsumpcja + " kWh"
              }
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            ticks: {
              font: {
                size: 42,
              }
            }
          },
          y: {
            stacked: true,
            ticks: {
              font: {
                size: 42,
              }
            }
          }
        }
      }
    });
  }

  sameDay(k1: Date, k2: Date) {
    return k1.getFullYear() === k2.getFullYear() &&
      k1.getMonth() === k2.getMonth() &&
      k1.getDate() === k2.getDate();
  }
}