import Drive from "../sentiment/drive.js";
import Card from "../cards/card.js";

/*
You are the only Leader this round and cannot be 
vetoed in any decisions. Discard at the end of the round.
*/

export default class UsurpCard extends Card{
  name = "👑 Usurp";

  setParameters() {
    this.range.drama = [Drive.Extreme, Drive.Extreme];
    this.range.autonomy = [Drive.Extreme, Drive.Extreme];
    this.range.strategy = [Drive.Mid, Drive.Extreme];
    this.range.harmony = [Drive.None, Drive.Low];

    this.tags = Card.Tags.AffectsLeadership;
  }

}