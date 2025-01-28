import Drive from "../sentiment/drive.js";
import Card from "../cards/card.js";
import Record from "../record.js";

/*
Destroy any resource belonging to any Community 
in your Society, then discard this card.
*/

export default class DestroyCard extends Card {
  name = "💥 Destroy";

  setParameters() {
    this.range.drama = [Drive.High, Drive.Extreme];
    this.range.autonomy = [Drive.Mid, Drive.Extreme];
    this.range.strategy = [Drive.None, Drive.Extreme];
    this.range.harmony = [Drive.None, Drive.Low];

    this.tags = Card.Tags.DestroysResources | Card.Tags.TakesFromOthers;
  }

  play(player, society) {
    super.play(player, society);

    const target = society.players.find( other => other != player );
    const resource = target.takeResource();
    if( resource ) {
      resource.destroy();
      Record.log(`💥 ${player.name} destroys ${resource.name}`);
    } else {
      Record.log("Nothing left to destroy...");
    }

  }
}