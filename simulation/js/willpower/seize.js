import Drive from "../sentiment/drive.js";
import Card from "../cards/card.js";

export default class SeizeCard extends Card{
  name = "☠️ Seize";
  setParameters() {
    this.range.drama = [Drive.Mid, Drive.Extreme];
    this.range.autonomy = [Drive.Mid, Drive.Extreme];
    this.range.strategy = [Drive.None, Drive.Extreme];
    this.range.harmony = [Drive.None, Drive.Low];
  }

}