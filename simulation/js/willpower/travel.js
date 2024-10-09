import Drive from "../sentiment/drive.js";
import Card from "../cards/card.js";

export default class TravelCard extends Card {
  name = "🚀 Travel";

  setParameters() {
    this.range.drama = [Drive.None, Drive.Extreme];
    this.range.autonomy = [Drive.Extreme, Drive.Extreme];
    this.range.strategy = [Drive.Mid, Drive.Extreme];
    this.range.harmony = [Drive.None, Drive.Extreme];
  }
}