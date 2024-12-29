import Drive from "../sentiment/drive.js";
import Card from "../cards/card.js";
import Record from "../record.js";

/*
Permanently claim a resource from another 
community and take it as your own. Discard this card.
*/

export default class SeizeCard extends Card {
  name = "☠️ Seize";
  setParameters() {
    this.range.drama = [Drive.Mid, Drive.Extreme];
    this.range.autonomy = [Drive.Mid, Drive.Extreme];
    this.range.strategy = [Drive.None, Drive.Extreme];
    this.range.harmony = [Drive.None, Drive.Low];

    this.tags = Card.Tags.MovesResources;
  }

  play(player, society) {
    super.play(player, society);

    const target = society.players.find((other) => other != player);
    const resource = target.takeResource();
    if (resource) {
      player.addResource(resource);
      Record.log(`${player.name} seizes ${resource.name} from ${target.name}`);
    } else {
      Record.log("Nothing left to take...");
    }
  }
}