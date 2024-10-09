import Drive from "../sentiment/drive.js";
import Card from "../cards/card.js";

export default class RevoltCard extends Card{
  
  name = "🏴 Incite";
  
  setParameters() {
    this.range.drama = [Drive.High, Drive.Extreme];
    this.range.autonomy = [Drive.High, Drive.Extreme];
    this.range.strategy = [Drive.Low, Drive.Extreme];
    this.range.harmony = [Drive.None, Drive.Low];
  }

}