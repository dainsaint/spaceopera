import Drive from "../sentiment/drive.js";
import Card from "../cards/card.js";

export default class AppropriateCard extends Card{
  name = "🧐 Appropriate"

  setParameters() {
    this.range.drama = [Drive.Mid, Drive.Extreme];
    this.range.autonomy = [Drive.High, Drive.Extreme];
    this.range.strategy = [Drive.Mid, Drive.Extreme];
    this.range.harmony = [Drive.None, Drive.Mid];
  }
}