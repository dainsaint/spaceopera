import Drive from "../sentiment/drive.js";
import Card from "../cards/card.js";
import { shuffle } from "../utils.js";
import Record from "../record.js";

/*
Discard a random Willpower card 
from another player’s hand. Discard this card. 
*/

export default class QuellCard extends Card {
  name = "💣 Quell";

  setParameters() {
    this.range.drama = [Drive.Mid, Drive.Extreme];
    this.range.autonomy = [Drive.High, Drive.Extreme];
    this.range.strategy = [Drive.Mid, Drive.Extreme];
    this.range.harmony = [Drive.None, Drive.Mid];

    this.tags = Card.Tags.GrantsWillpower;
  }


  play(player, society) {
    super.play(player, society);

    const othersWithWillpower = society.players.filter( other => other !== player && other.willpower.length > 0);
    
    if( othersWithWillpower.length == 0 ) {
      Record.log( `No other players with willpower cards!`);
      return;
    }

    const other = shuffle(othersWithWillpower).at(0);
    const willpower = shuffle(other.willpower).at(0);


    other.discardWillpower(willpower);

    Record.log( `💣 ${player.name} forces ${other.name} to discard ${willpower.name}` );
  }
}