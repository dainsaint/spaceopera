import Drive from "../sentiment/drive.js";
import Card from "../cards/card.js";

/*
Destroy one of your resources. 
Gain 2 Willpower cards. Discard this card. 
*/

export default class SacrificeCard extends Card{
  name = "❤️‍🔥 Sacrifice";
  setParameters() {
    this.range.drama = [Drive.Low, Drive.Extreme];
    this.range.autonomy = [Drive.Mid, Drive.Extreme];
    this.range.strategy = [Drive.Mid, Drive.Extreme];
    this.range.harmony = [Drive.None, Drive.Extreme];

    this.costResources = 1;

    this.tags = Card.Tags.DestroysResources | Card.Tags.GrantsWillpower;
  }

}