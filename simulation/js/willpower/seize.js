import Drive from "../sentiment/drive.js";
import Card from "../cards/card.js";

/*
Permanently claim a resource from another 
community and take it as your own. Discard this card.
*/

export default class SeizeCard extends Card{
  name = "☠️ Seize";
  setParameters() {
    this.range.drama = [Drive.Mid, Drive.Extreme];
    this.range.autonomy = [Drive.Mid, Drive.Extreme];
    this.range.strategy = [Drive.None, Drive.Extreme];
    this.range.harmony = [Drive.None, Drive.Low];

    this.tags = Card.Tags.MovesResources;
  }

}