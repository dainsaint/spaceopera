import Drive from "../sentiment/drive.js";
import Card from "../cards/card.js";

// Look at another community's Willpower cards and take 
// one of your choice. Discard this card. 

export default class AppropriateCard extends Card{
  name = "🧐 Appropriate"

  setParameters() {
    this.range.drama = [Drive.Mid, Drive.Extreme];
    this.range.autonomy = [Drive.High, Drive.Extreme];
    this.range.strategy = [Drive.Mid, Drive.Extreme];
    this.range.harmony = [Drive.None, Drive.Mid];

    this.tags = Card.Tags.GrantsWillpower | Card.Tags.TakesFromOthers;
  }
}