import Drive from "../sentiment/drive.js";
import Card from "../cards/card.js";

export default class InfluenceCard extends Card {
  name = "🎙️ Influence";

  setParameters() {
    this.range.drama = [Drive.Extreme, Drive.Extreme];
    this.range.autonomy = [Drive.High, Drive.Extreme];
    this.range.strategy = [Drive.Mid, Drive.Extreme];
    this.range.harmony = [Drive.None, Drive.Mid];
  }
}