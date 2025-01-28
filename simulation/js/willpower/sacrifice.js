import Drive from "../sentiment/drive.js";
import Card from "../cards/card.js";
import { shuffle } from "../utils.js";
import Record from "../record.js";

/*
Destroy one of your resources. 
Gain 2 Willpower cards. Discard this card. 
*/

export default class SacrificeCard extends Card{
  name = "❤️‍🔥 Sacrifice";
  setParameters() {
    this.range.drama = [Drive.Low, Drive.Extreme];
    this.range.autonomy = [Drive.Mid, Drive.Extreme];
    this.range.strategy = [Drive.Mid, Drive.Extreme];
    this.range.harmony = [Drive.None, Drive.Extreme];

    this.costResources = 1;

    this.tags = Card.Tags.DestroysResources | Card.Tags.GrantsWillpower;
  }


  play( player, society ) {
    super.play(player, society);

    const resources = shuffle(player.resources);
    const resource = resources.at(0);

    if( resource ) {
      resource.destroy();
      const deck = society.deck;
      const card1 = player.drawWillpower(deck);
      const card2 = player.drawWillpower(deck);
      Record.log(`❤️‍🔥 ${player.name} sacrifices ${resource.name}, receiving ${card1.name} and ${card2.name}`);
    } 
  }

  

}