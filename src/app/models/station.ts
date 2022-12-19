export class Station {
  id?: number;
  data: string = '';
  temperatureDallas: number = -1;
  temperatureDHT: number = -1;
  temperatureBMP: number = -1;
  presureBMP: number = -1;
  humidityDHT: number = -1;
  dust: number = -1;
  light: number = -1;

  getPresure(): string {
    return (Math.round(this.presureBMP * 100) / 10000).toString().slice(0, -2) + 'hPa';
  }

  temperatureDallas1(): string {
    return this.temperatureDallas.toString().split('.')[0]
  }

  temperatureDallas2(): string {
    return this.temperatureDallas.toString().split('.')[1]
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
