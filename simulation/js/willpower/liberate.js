import Drive from "../sentiment/drive.js";
import Card from "../cards/card.js";

/*
Redistribute or destroy ALL resources belonging 
to the Voice of the Leaders. Discard this card. 
*/

export default class LiberateCard extends Card {
  name = "💰 Liberate";

  setParameters() {
    this.range.drama = [Drive.High, Drive.Extreme];
    this.range.autonomy = [Drive.Mid, Drive.Extreme];
    this.range.strategy = [Drive.High, Drive.Extreme];
    this.range.harmony = [Drive.None, Drive.Extreme];

    this.tags = Card.Tags.AffectsLeadership | Card.Tags.MovesResources
  }

  play(player, society) {
    super.play(player, society);

    const resources = [];

    society.leaders.forEach((leader) => {
      const numIntact = leader.intactResources.length;
      for(let i = 0; i < numIntact; i++)
        resources.push( leader.takeResource() );
    });

    player.distribute(resources, society.players);    
  }

}