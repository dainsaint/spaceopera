import Drive from "../sentiment/drive.js";
import Card from "../cards/card.js";

export default class SacrificeCard extends Card{
  name = "❤️‍🔥 Sacrifice";
  setParameters() {
    this.range.drama = [Drive.Low, Drive.Extreme];
    this.range.autonomy = [Drive.Mid, Drive.Extreme];
    this.range.strategy = [Drive.Mid, Drive.Extreme];
    this.range.harmony = [Drive.None, Drive.Extreme];

    this.minimumResources = 1;
  }

}