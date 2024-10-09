import Drive from "../sentiment/drive.js";
import Card from "../cards/card.js";

export default class DestroyCard extends Card{

  name = "💥 Destroy"

  setParameters() {
    this.range.drama = [Drive.High, Drive.Extreme];
    this.range.autonomy = [Drive.Mid, Drive.Extreme];
    this.range.strategy = [Drive.None, Drive.Extreme];
    this.range.harmony = [Drive.None, Drive.Low];
  }

}