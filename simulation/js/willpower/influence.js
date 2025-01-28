import Drive from "../sentiment/drive.js";
import Card from "../cards/card.js";
import Voice from "../voice.js";
import Record from "../record.js";
import { shuffle } from "../utils.js";

/*
Change the leadership status of any one community or 
give a Voice of the Leaders community an additional vote. 
Either effect lasts until the end of the round. 
Discard this card. 
*/


export default class InfluenceCard extends Card {
  name = "🎙️ Influence";

  setParameters() {
    this.range.drama = [Drive.High, Drive.Extreme];
    this.range.autonomy = [Drive.High, Drive.Extreme];
    this.range.strategy = [Drive.Mid, Drive.Extreme];
    this.range.harmony = [Drive.None, Drive.Mid];

    this.tags = Card.Tags.AffectsLeadership
  }

  play( player, society ) {
    super.play(player, society);
    const toInfluence = shuffle(society.players).at(0);

    if( toInfluence.voice == Voice.Leader ) {
      Record.log(`🎙️ ${player.name} influences ${toInfluence.name}, granting them an additional vote`);
    } else {
      Record.log(`🎙️ ${player.name} influences ${toInfluence.name}; they will act as a Leader this round`);
    }
  }
}