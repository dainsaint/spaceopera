import Drive from "../sentiment/drive.js";
import Card from "../cards/card.js";

/*
For this round, raise the risk level for the 
society you are currently in. Discard this card. 
*/

export default class ManipulateCard extends Card {
  name = "👁️‍🗨️ Manipulate";

  setParameters() {
    this.range.drama = [Drive.High, Drive.Extreme];
    this.range.autonomy = [Drive.None, Drive.Extreme];
    this.range.strategy = [Drive.High, Drive.Extreme];
    this.range.harmony = [Drive.None, Drive.Low];

    this.tags = Card.Tags.IncreasesRisk;
  }

  play(player, society) {
    super.play(player, society);
    society.increaseRisk();
  }
}