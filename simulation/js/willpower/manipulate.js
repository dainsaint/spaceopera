import Drive from "../sentiment/drive.js";
import Card from "../cards/card.js";

export default class ManipulateCard extends Card {
  name = "👁️‍🗨️ Manipulate";

  setParameters() {
    this.range.drama = [Drive.High, Drive.Extreme];
    this.range.autonomy = [Drive.None, Drive.Extreme];
    this.range.strategy = [Drive.High, Drive.Extreme];
    this.range.harmony = [Drive.None, Drive.Low];
  }
}