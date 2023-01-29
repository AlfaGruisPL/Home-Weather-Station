import {Chart} from "chart.js/auto";

export class Air {
  id: number = 0;
  charId: String = '';
  name: string = '';
  name1: string = '';
  name2: string = '';

  valueHistory: Array<number> = [];
  value_valHistory: Array<number> = [];
  data: Date = new Date();
  chartWidth = "120px";
  chartHeight = "50px";
  chart: any = null;

  constructor(name: string, name1: string, name2: string) {
    this.name = name;
    this.charId = name + "_chart";
    this.name1 = name1;
    this.name2 = name2;
  }

  value(): number {
    return this.valueHistory[0];
  }

  getEmoji(): string {
    if (this.value() >= 0 && this.value() <= 19) return "😇";
    if (this.value() >= 20 && this.value() <= 49) return "😀";
    if (this.value() >= 50 && this.value() <= 99) return "😥";
    if (this.value() >= 100 && this.value() <= 149) return "😷";
    return "😵";
  }


  getChart(): any {

    if (this.valueHistory.length < 2) return null;
    if (this.chart != null) {
      return this.chart;
    }
    const labelTmp = [];
    for (let index = 0; index < this.valueHistory.length; index++) {
      labelTmp.push(index)
    }
    labelTmp[labelTmp.length - 1] = "Dziś";
    // @ts-ignore
    this.chart = new Chart(this.charId, {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: labelTmp,
        datasets: [
          {
            label: "Wejście",
            data: this.valueHistory,
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
        aspectRatio: 3,
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
        },
        scales: {
          x: {
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
          }
        }
      }
    });
    return this.chart;
  }
}
