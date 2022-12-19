export class Energy {
  fae_balanced: number = -1;
  rae_balanced: number = -1;
  MocCzynna1: number = -1;
  MocCzynna2: number = -1;
  MocCzynna3: number = -1;
  MocCzynnaSuma: number = -1;

  getMocCzynna1() {
    return Math.round(this.MocCzynna1 * 10) / 10;
  }

  getMocCzynna2() {

    return Math.round(this.MocCzynna2 * 10) / 10;
  }

  getMocCzynna3() {

    return Math.round(this.MocCzynna3 * 10) / 10;
  }

  getMocCzynnaSuma() {

    return Math.round(this.MocCzynnaSuma * 10) / 10;
  }

  getEnergy() {
    return this.fae_balanced / 100000
  }

  sendEnergy() {
    return this.rae_balanced / 100000
  }

  akumulator() {
    return Math.round(((this.rae_balanced * 0.8) - (this.fae_balanced)) / 100000 * 100000) / 100000;
  }
}
