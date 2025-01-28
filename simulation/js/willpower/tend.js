import Drive from "../sentiment/drive.js";
import Card from "../cards/card.js";
import Record from "../record.js";
import { shuffle } from "../utils.js";

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

  play( player, society ) {
    super.play(player, society);
    const resource = shuffle(society.resources).find( resource => resource.isExhausted );
    if( !resource ){
      Record.log(`No exhausted resources to tend!`);
    } else {
      resource.refresh();
      Record.log(`❤️‍🩹 ${player.name} tends ${resource.name}; it is no longer exhausted`);
    }

  }
}