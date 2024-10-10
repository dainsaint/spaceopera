import Drive from "../sentiment/drive.js";
import Card from "../cards/card.js";

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

}