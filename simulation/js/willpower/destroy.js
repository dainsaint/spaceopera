import Drive from "../sentiment/drive.js";
import Card from "../cards/card.js";

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

    const victim = society.players.find( other => other != player );
    const resource = victim.resources.at(0);
    if( resource ) {
      resource.destroy();
      console.log(`${player.name} destroys ${resource.name}`);
    } else {
      console.log("Nothing left to destroy...");
    }

  }
}