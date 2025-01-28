import Drive from "../sentiment/drive.js";
import Card from "../cards/card.js";
import Record from "../record.js";
import { shuffle } from "../utils.js";

// Look at another community's Willpower cards and take 
// one of your choice. Discard this card. 

export default class AppropriateCard extends Card{
  name = "🧐 Appropriate"

  setParameters() {
    this.range.drama = [Drive.Mid, Drive.Extreme];
    this.range.autonomy = [Drive.High, Drive.Extreme];
    this.range.strategy = [Drive.Mid, Drive.Extreme];
    this.range.harmony = [Drive.None, Drive.Mid];

    this.tags = Card.Tags.GrantsWillpower | Card.Tags.TakesFromOthers;
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
    player.receiveWillpower( willpower );

    Record.log( `🧐 ${player.name} takes ${willpower.name} from ${other.name}` );
  }
}