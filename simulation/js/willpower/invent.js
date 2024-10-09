import Drive from "../sentiment/drive.js";
import Card from "../cards/card.js";

export default class InventCard extends Card{
  
  name = "💡 Invent";
  
  setParameters() {
    this.range.drama = [Drive.None, Drive.Extreme];
    this.range.autonomy = [Drive.None, Drive.Extreme];
    this.range.strategy = [Drive.High, Drive.Extreme];
    this.range.harmony = [Drive.Mid, Drive.Extreme];

    this.minimumResources = 2;
  }

}