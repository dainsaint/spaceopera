import Sentiment from "../sentiment/sentiment.js";
import Drive from "../sentiment/drive.js";
import Card from "../cards/card.js";

//You decide which communities are Voice of the Leaders 
//and Voice of the People for this round. 
//Then discard this card. 

export default class InciteCard extends Card {
  name = "💢 Incite";

  setParameters() {
    this.range.drama = [Drive.Mid, Drive.Extreme];
    this.range.autonomy = [Drive.High, Drive.Extreme];
    this.range.strategy = [Drive.Mid, Drive.Extreme];
    this.range.harmony = [Drive.None, Drive.Extreme];

    this.tags = Card.Tags.AffectsLeadership;
  }

    // play( player, society ) {
    //   super.play(player, society);
    //   society.forceEmissary(player);
    //   Record.log(`💫 ${player.name} is the emissary now`)
    // }
}