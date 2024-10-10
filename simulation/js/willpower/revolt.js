import Drive from "../sentiment/drive.js";
import Card from "../cards/card.js";

/*
Incite Revolution. Form factions and roll Force 
against one another. If there are no Leaders in 
your faction, you may add one to your roll for
 every additional Willpower card you discard. 
 Revolution prevents any other action, and will 
 continue to subsequent rounds until resolved. 
 Discard this card. 
*/

export default class RevoltCard extends Card{
  
  name = "🏴 Revolt";
  
  setParameters() {
    this.range.drama = [Drive.High, Drive.Extreme];
    this.range.autonomy = [Drive.High, Drive.Extreme];
    this.range.strategy = [Drive.Low, Drive.Extreme];
    this.range.harmony = [Drive.None, Drive.Low];

    this.tags = Card.Tags.AffectsLeadership;
  }

}