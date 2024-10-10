import Card from "../cards/card.js";
import Resource from "../resource.js";

//Discard any other Willpower card and
//exhaust any one resource to 
//create a new resource for your community. 
//Discard this card. 

export default class CreateCard extends Card {
  name = "🌱 Create";

  setParameters() {
    this.costResources = 1;
    this.costWillpower = 2;
    this.tags = Card.Tags.CreatesResources | Card.Tags.BurnsWillpower | Card.Tags.ExhaustsResources;
  }


  play(player, society) {
    super.play(player, society);

    const willpower = player.rateWillpower( player.willpower );
    const worstCard = willpower.at(-1);
    player.discardWillpower(worstCard);

    const resource = player.availableResources.at(0);
    resource.exhaust();

    const createdResource = new Resource();

    console.log( `${player.name} creates ${createdResource.name}`)

    player.addResource( createdResource );
  }

}