import Drive from "../sentiment/drive.js";
import Card from "../cards/card.js";

export default class UsurpCard extends Card{
  name = "👑 Usurp";

  setParameters() {
    this.range.drama = [Drive.Extreme, Drive.Extreme];
    this.range.autonomy = [Drive.Extreme, Drive.Extreme];
    this.range.strategy = [Drive.Mid, Drive.Extreme];
    this.range.harmony = [Drive.None, Drive.Low];
  }

}