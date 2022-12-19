export class Meteo {
  winddirection: string = '';
  temperature: string = '';
  windspeed: number = 0;
  weathercode: string = '';

  getWindDirection() {
    if (this.windspeed > 337.5) return 'Północny';
    if (this.windspeed > 292.5) return 'Północno- zachodni';
    if (this.windspeed > 247.5) return 'Zachodni';
    if (this.windspeed > 202.5) return 'Południowo- zachodni';
    if (this.windspeed > 157.5) return 'Południowy';
    if (this.windspeed > 122.5) return 'Południowo- wschodni';
    if (this.windspeed > 67.5) return 'Wschodni';
    if (this.windspeed > 22.5) {
      return 'Północno- wschodni';
    }
    return 'Północny';
  }
}
