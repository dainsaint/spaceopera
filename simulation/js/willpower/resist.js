import Card from "../cards/card.js";
import Drive from "../sentiment/drive.js";

/*
Prevent a Resource from being transformed, 
occupied, seized, or destroyed by other Communities 
or by the GM. Then discard this card. Can be played 
during the Galactic phase.
*/


export default class ResistCard extends Card{
  name = "✊🏾 Resist";

  setParameters() {
    this.range.drama = [Drive.None, Drive.None];
    this.range.autonomy = [Drive.None, Drive.None];
    this.range.strategy = [Drive.None, Drive.None];
    this.range.harmony = [Drive.None, Drive.None];

    this.tags = Card.Tags.PreventsDestruction
  }


  play( player, society ) {
    super.play(player, society);
    // Record.log(`✊🏾 ${player.name} resists!`);
  }
}