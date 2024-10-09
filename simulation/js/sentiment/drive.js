const toNumbers = {
  None: 0,
  Low: 1,
  Mid: 2,
  High: 3,
  Extreme: 4,
};

const toStrings = ["None", "Low", "Mid", "High", "Extreme"];

export default class Drive {
  static get Extreme() {
    return new Drive("Extreme");
  }

  static get High() {
    return new Drive("High");
  }

  static get Mid() {
    return new Drive("Mid");
  }

  static get Low() {
    return new Drive("Low");
  }

  static get None() {
    return new Drive("None");
  }

  static get Random() {
    return new Drive(toStrings[Math.floor(Math.random() * 3) + 1]);
  }

  constructor(value) {
    this.value = value;
  }

  increase() {
    const newNumber = Math.min(this.valueOf() + 1, 3);
    this.value = toStrings[newNumber];
  }

  decrease() {
    const newNumber = Math.max(this.valueOf() - 1, 0);
    this.value = toStrings[newNumber];
  }

  add(drive) {
    const newNumber = Math.min(this.valueOf() + drive.valueOf(), 4);
    return new Drive(toStrings[newNumber]);
  }

  print() {
    return ["⬛️", "🟦", "🟩", "🟧", "🟥"].at( this.valueOf() );
  }

  valueOf() {
    return toNumbers[this.value];
  }

  toString() {
    return this.value;
  }

  static fromNumber(number) {
    return new Drive( toStrings[ Math.min( Math.max( number, 0 ), 4 ) ] );
  }
}
