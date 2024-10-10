import Drive from "../sentiment/drive.js";
import Card from "../cards/card.js";

/*
Become an ambassador without the approval of your society. 
Travel to any other society in the galaxy, 
bringing your community's resources with you. 
At that society, act as a Voice of the People, 
regardless of your leadership status. 
At the conclusion of this round, return to your society. 
Discard this card. 
*/

export default class TravelCard extends Card {
  name = "🚀 Travel";

  setParameters() {
    this.range.drama = [Drive.None, Drive.Extreme];
    this.range.autonomy = [Drive.Extreme, Drive.Extreme];
    this.range.strategy = [Drive.Mid, Drive.Extreme];
    this.range.harmony = [Drive.None, Drive.Extreme];

    this.tags = Card.Tags.AffectsLeadership;
  }
}