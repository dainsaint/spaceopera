import Drive from "../sentiment/drive.js";
import Card from "../cards/card.js";

/*
Prevent any resource from being exhausted this round 
or refresh an exhausted resource. Discard this card. 
*/

export default class TendCard extends Card {
  name = "❤️‍🩹 Tend";

  setParameters() {
    this.range.drama = [Drive.None, Drive.Mid];
    this.range.autonomy = [Drive.None, Drive.Extreme];
    this.range.strategy = [Drive.None, Drive.Extreme];
    this.range.harmony = [Drive.None, Drive.High];
  }
}