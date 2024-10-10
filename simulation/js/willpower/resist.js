import Card from "../cards/card.js";

/*
Prevent a Resource from being transformed, 
occupied, seized, or destroyed by other Communities 
or by the GM. Then discard this card. Can be played 
during the Galactic phase.
*/

export default class ResistCard extends Card{
  name = "✊🏾 Resist";

  setParameters() {
    this.tags = Card.Tags.PreventsDestruction
  }
}