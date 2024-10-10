import Drive from "../sentiment/drive.js";
import Card from "../cards/card.js";

/*
Change the leadership status of any one community or 
give a Voice of the Leaders community an additional vote. 
Either effect lasts until the end of the round. 
Discard this card. 
*/


export default class InfluenceCard extends Card {
  name = "🎙️ Influence";

  setParameters() {
    this.range.drama = [Drive.Extreme, Drive.Extreme];
    this.range.autonomy = [Drive.High, Drive.Extreme];
    this.range.strategy = [Drive.Mid, Drive.Extreme];
    this.range.harmony = [Drive.None, Drive.Mid];

    this.tags = Card.Tags.AffectsLeadership
  }
}