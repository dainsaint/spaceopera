import Drive from "../sentiment/drive.js";
import Card from "../cards/card.js";
import Resource from "../resource.js";
import { shuffle } from "../utils.js";
import Record from "../record.js";

/*

Destroy two resources and create a new one. 
The new resource must use one word from each destroyed 
resources. Discard this card. 

*/


export default class InventCard extends Card{
  
  name = "💡 Invent";
  
  setParameters() {
    this.range.drama = [Drive.None, Drive.Extreme];
    this.range.autonomy = [Drive.None, Drive.Extreme];
    this.range.strategy = [Drive.High, Drive.Extreme];
    this.range.harmony = [Drive.Mid, Drive.Extreme];

    this.costResources = 2;

    this.tags = Card.Tags.CreatesResources | Card.Tags.DestroysResources;
  }


  play( player, society ) {
    super.play(player, society);

    const resources = shuffle( player.resources );
    const inputs = resources.slice(0,2);
    const newResourceName = shuffle(inputs).map( resource => resource.name.split(' ') ).reduce( (names, parts, i) => [...names, parts[i]], [] ).join(' ');
    const resource = new Resource(newResourceName);
  
    Record.log(`💡 ${player.name} destroys ${inputs.at(0).name} and ${inputs.at(1).name} to invent ${resource.name}`);
    inputs.forEach( input => {
      player.resources.splice( player.resources.indexOf(input), 1) 
      input.destroy();
    });
    player.addResource(resource);
  }

}