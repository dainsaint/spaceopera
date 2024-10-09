import Drive from "../sentiment/drive.js";
import Card from "../cards/card.js";

export default class LiberateCard extends Card {
  name = "💰 Liberate";

  setParameters() {
    this.range.drama = [Drive.High, Drive.Extreme];
    this.range.autonomy = [Drive.Mid, Drive.Extreme];
    this.range.strategy = [Drive.High, Drive.Extreme];
    this.range.harmony = [Drive.None, Drive.Extreme];
  }
}