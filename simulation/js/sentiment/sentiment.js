import Drive from "./drive.js";
import { range } from "../utils.js";

export default class Sentiment {
  drama
  autonomy
  strategy
  harmony
  
  constructor(
    drama = Drive.Mid,
    autonomy = Drive.Mid,
    strategy = Drive.Mid,
    harmony = Drive.Mid
  ) {
    this.drama = drama;
    this.autonomy = autonomy;
    this.strategy = strategy;
    this.harmony = harmony;
  }

  add(sentiment) {
    return new Sentiment(
      this.drama.add(sentiment.drama),
      this.autonomy.add(sentiment.autonomy),
      this.strategy.add(sentiment.strategy),
      this.harmony.add(sentiment.harmony)
    );
  }

  randomize() {
    this.drama = Drive.Random;
    this.autonomy = Drive.Random;
    this.strategy = Drive.Random;
    this.harmony = Drive.Random;
  }

  print() {
    return this.drama.print() + 
      this.autonomy.print() + 
      this.strategy.print() + 
      this.harmony.print(); 
  }

  toArray() {
    return [this.drama, this.autonomy, this.strategy, this.harmony];
  }

  static fromArray(values) {
    return new Sentiment(
      Drive.fromNumber(values[0]),
      Drive.fromNumber(values[1]),
      Drive.fromNumber(values[2]),
      Drive.fromNumber(values[3])
    );
  }

  static fromAverage(sentiments) {
    const sum = [0, 0, 0, 0];
    sentiments.forEach((sentiment) => {
      sum[0] += sentiment.drama;
      sum[1] += sentiment.autonomy;
      sum[2] += sentiment.strategy;
      sum[3] += sentiment.harmony;
    });

    sum[0] = Math.floor( sum[0] / sentiments.length );
    sum[1] = Math.floor( sum[1] / sentiments.length );
    sum[2] = Math.floor( sum[2] / sentiments.length );
    sum[3] = Math.floor( sum[3] / sentiments.length );

    return this.fromArray(sum);
  }
}