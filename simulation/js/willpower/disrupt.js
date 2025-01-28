import Drive from "../sentiment/drive.js";
import Card from "../cards/card.js";
import Record from "../record.js";

//Act as the Emissary for this round. Discard this card. 

export default class DisruptCard extends Card {
  name = "💫 Disrupt";

  setParameters() {
    this.range.drama = [Drive.Mid, Drive.Extreme];
    this.range.autonomy = [Drive.High, Drive.Extreme];
    this.range.strategy = [Drive.Mid, Drive.Extreme];
    this.range.harmony = [Drive.None, Drive.Mid];

    this.tags = Card.Tags.AffectsLeadership;
  }


  play( player, society ) {
    super.play(player, society);
    society.forceEmissary(player);
    Record.log(`💫 ${player.name} is the emissary now`)
  }

  
}