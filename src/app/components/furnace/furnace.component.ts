import {Component, OnInit} from '@angular/core';
import {Piec} from "../../models/piec";
import {Chart, TooltipItem} from "chart.js/auto";

@Component({
  selector: 'app-furnace',
  templateUrl: './furnace.component.html',
  styleUrls: ['./furnace.component.scss']
})
export class FurnaceComponent implements OnInit {
  piec = new Piec();
  charLabel: string[] = []
  charWejscie: number[] = []
  charWyjscie: number[] = [];
  public chart: any;
  private limit = 120;

  constructor() {
  }

  ngOnInit(): void {


    var ostatnieWykonanie = 0;
    setInterval(() => {
      if (ostatnieWykonanie + 1000 < new Date().getTime()) {
        ostatnieWykonanie = new Date().getTime();
        if (Number(this.piec.temp1.toString().split(",")[0]) > 17) {
          this.piecRequest();
        }
      }
    }, 300)

    var ostatnieWykonanie1 = 0;
    setInterval(() => {
      if (ostatnieWykonanie1 + 10000 < new Date().getTime()) {
        ostatnieWykonanie1 = new Date().getTime();
        if (Number(this.piec.temp1.toString().split(",")[0]) <= 17) {
          this.piecRequest();
        }
      }
    }, 300)

    setInterval(() => {
      if (Number(this.piec.temp1.toString().split(",")[0]) <= 17) {
        this.piecRequest();
      }
    }, 10000)
    this.charInit();


    var ostatnieWykonanie2 = 0;
    setInterval(() => {
      if (ostatnieWykonanie2 + 30000 < new Date().getTime()) {
        ostatnieWykonanie2 = new Date().getTime();
        this.piecChar();
      }
    }, 300)


  }

  piecChar() {
    fetch("https://spiderservices.pl/stacja/stacjaApi.php/furnaceStats").then(function (response) {
      return response.json();
    }).then((k: Array<any>) => {
      k = k.slice(0, this.limit)
      /*   console.log(k)
         const length = k.length;
         for (var kLicznik = 0; kLicznik < length - 2; kLicznik++) {
           // console.log(k[kLicznik]['time'])
           const minutes = (new Date(k[kLicznik]['time']).getTime() - new Date(k[kLicznik + 1]['time']).getTime()) / (1000 * 60);
           for (var kLicznikMinutes = 0; kLicznikMinutes < Math.round(minutes); kLicznikMinutes++) {
             const kTemp = k[kLicznik];
             //  if (kTemp != undefined) {
             //const k8 = kTemp['time'];
             //console.log(new Date(new Date(k8).getTime() - (100000 * (kLicznikMinutes + 1))))
             //   console.log(kTemp['time'])
             //const k9 = new Date(new Date(k[kLicznik - 1]).getTime() - (60000 * (kLicznikMinutes + 1)));
             //console.log(k9.getHours() + ":" + k9.getMinutes())
             //kTemp['time'] = " " + k9.getHours() + ":" + k9.getMinutes()

             k.splice(kLicznik + 1, 0, kTemp);
             console.log(k)
           }

           //console.log(k)


         }
   */
      //  console.table(k);
      var index = 0;
      while (this.charLabel.length > 0) {
        this.charLabel.pop()
        this.charWyjscie.pop();
        this.charWejscie.pop()
      }

      k.forEach((kLocal: any) => {
        this.charWyjscie.push(kLocal['wyjscie'])
        this.charWejscie.push(kLocal['wejscie'])
        // if (index % 5 == 1) {

        this.charLabel.push(kLocal['time'].split(' ')[1].slice(0, -3))
        //   } else {
        // this.charLabel.push("")

        //}
        index++;
      })
      this.charLabel[0] = "Teraz";
      this.chart.update();
    });
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

  charInit() {
    this.chart = new Chart("wykresZPieca1", {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: this.charLabel,
        datasets: [
          {
            label: "Wejście",
            data: this.charWejscie,
            borderColor: "#002cff",
            backgroundColor: "#002cff",
            fill: false,
            borderWidth: 4,
            pointStyle: 'rect',
            pointHitRadius: 5,
            pointRadius: 0.1,
            cubicInterpolationMode: 'monotone',
          },
          {
            pointRadius: 0.1,
            pointStyle: 'rect',
            label: "Wyjście",
            data: this.charWyjscie,
            borderColor: "#ff0000",
            backgroundColor: "#ff0000",
            fill: false,
            pointHitRadius: 5,
            borderWidth: 4,
            cubicInterpolationMode: 'monotone',
            //tension: 2.4
          }
        ]
      },
      options: {
        animation: false,
        aspectRatio: 1.5,
        responsive: true,
        elements: {
          point: {
            borderWidth: 0,
            radius: 0.1,

          }
        },
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
                return "Czas:  " + context[0].label
              },
              label(tooltipItem: TooltipItem<any>): string | string[] | void {
                return " " + tooltipItem.dataset.label + ":     " + tooltipItem.formattedValue + "°C"
              }/*,
              footer(tooltipItems: TooltipItem<any>[]): string | string[] | void {
                return "";
              }*/
            }
          }
        },
        scales: {
          x: {
            // stacked: true,
            ticks: {
              font: {
                size: 42,
              },
              maxRotation: 90,
              minRotation: 80,
              autoSkip: true
            },
          },
          y: {
            suggestedMin: 5,
            suggestedMax: 15,
            //stacked: true,
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

  setData(event: any) {
    this.limit = event.target.value;
    this.piecChar()
  }


}
