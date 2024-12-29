import Record from "../record.js";
import SentimentRange from "../sentiment/sentimentrange.js";

export default class Card {
  static Tags = {
    None: 0,
    CreatesResources: 1,
    MovesResources: 2,
    ExhaustsResources: 4,
    DestroysResources: 8,
    GrantsWillpower: 16,
    BurnsWillpower: 32,
    AffectsLeadership: 64,
    IncreasesRisk: 128,
    PreventsDestruction: 256,
    PreventsExhaustion: 512,
    TakesFromOthers: 1024,
    GivesToOthers: 2048,
    IsUnilateral: 4096
  };

  name = "🎴 Card";

  deck;
  range = new SentimentRange();

  costResources = 0;
  costWillpower = 0;

  tags = Card.Tags.None;

  constructor(deck) {
    this.deck = deck;
    this.setParameters();
  }

  setParameters() {}

  rate(sentiment) {
    return this.range.rate(sentiment);
  }

  isPlayable(player) {
    if (!(this.costResources || this.costWillpower)) return true;
    else
      return (
        player.availableResources.length >= this.costResources &&
        player.willpower.length >= this.costWillpower
      );
  }

  play(player, society) {
    Record.log(`🎴 ${player.name} plays ${this.name}`);
    Record.increase(this.name);
    this.discard();
  }

  discard() {
    this.deck.discard(this);
  }

  hasTags( tags ) {
    return (this.tags & tags) == tags;
  }

}