import Record from "../record.js";
import SentimentRange from "../sentiment/sentimentrange.js";

export default class Card {
  
  name = "🎴 Card";

  deck;
  range = new SentimentRange();

  minimumResources = 0;
  minimumWillpower = 0;

  constructor(deck) {
    this.deck = deck;
    this.setParameters();
  }

  setParameters() {}

  rate(sentiment) {
    return this.range.rate(sentiment);
  }

  canBeActivated(player) {
    if (!(this.minimumResources || this.minimumWillpower)) return true;
    else
      return (
        player.community.resources.length >= this.minimumResources &&
        player.willpower.length >= this.minimumWillpower
      );
  }

  activate(player, others) {
    Record.log(`${player.name} uses ${this.name}`);
    this.discard();
  }

  discard() {
    this.deck.discard(this);
  }
}