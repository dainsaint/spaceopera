import Deck from "./cards/deck.js";

import AppropriateCard from "./willpower/appropriate.js";
import ConsumeCard from "./willpower/consume.js";
import CreateCard from "./willpower/create.js";
import DestroyCard from "./willpower/destroy.js";
import DisruptCard from "./willpower/disrupt.js";
import InciteCard from "./willpower/incite.js";
import InventCard from "./willpower/invent.js";
import LiberateCard from "./willpower/liberate.js";
import ManipulateCard from "./willpower/manipulate.js";
import QuellCard from "./willpower/quell.js";
import ResistCard from "./willpower/resist.js";
import RevoltCard from "./willpower/revolt.js";
import SacrificeCard from "./willpower/sacrifice.js";
import SeizeCard from "./willpower/seize.js";
import TendCard from "./willpower/tend.js";
import TravelCard from "./willpower/travel.js";
import UsurpCard from "./willpower/usurp.js";

export default class WillpowerDeck extends Deck {
  constructor() {
    super([
      [AppropriateCard, 10],
      [ConsumeCard, 10],
      [CreateCard, 10],
      [DestroyCard, 1],
      [DisruptCard, 1],
      [InciteCard, 10],
      [InventCard, 10],
      [LiberateCard, 5],
      [ManipulateCard, 5],
      [QuellCard, 10],
      [ResistCard, 1],
      [RevoltCard, 10],
      [SacrificeCard, 10],
      [SeizeCard, 10],
      [TendCard, 5],
      [TravelCard, 4],
      [UsurpCard, 1],
    ]);
  }
}
