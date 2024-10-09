export default class Record {
  static ledger = [{}];

  constructor() {
    this.ledger = [{}];
  }

  static log(...data) {
    // console.log(...data);
  }

  static reset() {
    this.ledger = [{}];
  }

  static newRound() {
    this.ledger.push({})
  }

  static increase(tag, number = 1) {
    const round = this.ledger.at(-1);
    if (!round[tag]) round[tag] = number;
    else round[tag]++;
  }

  static set(tag, number) {
    const round = this.ledger.at(-1);
    round[tag] = number;
  }
}