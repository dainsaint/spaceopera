import Drive from "./drive.js";

export default class SentimentRange {

  drama = [Drive.None, Drive.Extreme];
  autonomy = [Drive.None, Drive.Extreme];
  strategy = [Drive.None, Drive.Extreme];
  harmony = [Drive.None, Drive.Extreme];

  constructor(drama = [Drive.None, Drive.Extreme], autonomy = [Drive.None, Drive.Extreme], strategy = [Drive.None, Drive.Extreme], harmony = [Drive.None, Drive.Extreme] ) {
    this.drama = drama;
    this.autonomy = autonomy;
    this.strategy = strategy;
    this.harmony = harmony;
  }

  rate(sentiment) {
    let rating = 0;

    if( sentiment.drama >= this.drama[0] && sentiment.drama <= this.drama[1] )
      rating++;

    if (sentiment.autonomy >= this.autonomy[0] && sentiment.autonomy <= this.autonomy[1])
      rating++;

    if (sentiment.strategy >= this.strategy[0] && sentiment.strategy <= this.strategy[1])
      rating++;

    if (sentiment.harmony >= this.harmony[0] && sentiment.harmony <= this.harmony[1])
      rating++;

    return rating;
  }
}