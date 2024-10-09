export default class Record {
  static ledger = [{}];
  static terminal = [];

  constructor() {
    this.ledger = [{}];
  }

  static log(...data) {
    this.terminal.push( data.join(" ") );
    // console.log(...data);
  }

  static reset() {
    this.ledger = [{}];
    this.terminal = [];
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