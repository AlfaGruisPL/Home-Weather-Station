export class XiaomiSensor {
  id?: number;
  id_czujnika: number = -1;
  data: string = '';
  temperature: number = -1;
  humidity: number = -1;
  battery?: string;
  errorCount: number = -1;
  adress?: string;

  temperature1(): string {
    return this.temperature.toString().split('.')[0]
  }

  temperature2(): string {
    return this.temperature.toString().split('.')[1]
  }


  getTimeToLastData(): number {
    return Math.round(Math.abs(this.getTime(this.data) - new Date().getTime()) / 1000);
  }


  getTime(data: string) {
    var dataloc = data.replace("-", " ").replace("-", " ").replace(":", " ").replace(":", " ").split(" ")
    var str = dataloc[0] + "-" + dataloc[1] + "-" + dataloc[2] + "T" + dataloc[3] + ":" + dataloc[4] + ":" + dataloc[5];
    return new Date(str).getTime() - 81000;
  }
}
