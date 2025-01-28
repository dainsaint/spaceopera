import Drive from "../sentiment/drive.js";
import Card from "../cards/card.js";
import { shuffle } from "../utils.js";
import Record from "../record.js";

// Exhaust any one resource. Discard this card. 

export default class ConsumeCard extends Card{

  name = "🍽️ Consume"
  
  setParameters() {
    this.range.drama = [Drive.High, Drive.Extreme];
    this.range.autonomy = [Drive.None, Drive.Extreme];
    this.range.strategy = [Drive.Mid, Drive.Extreme];
    this.range.harmony = [Drive.None, Drive.Mid];

    this.tags = Card.Tags.ExhaustsResources
  }

  play( player, society ) {
    super.play(player, society);

    const resources = shuffle( society.getAvailableResources() );
    const resource = resources.at(0);
    if( resource ) {
      resource.exhaust();
      Record.log(`🍽️ ${player.name} consumes ${resource.name}`)
    } else {
      Record.log(`No unexhausted resources!`)
    }
  }


}