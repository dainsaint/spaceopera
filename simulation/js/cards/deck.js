import Record from "../record.js";
import { shuffle } from "../utils.js";

export default class Deck {

  stack = [];
  discardPile = [];

  constructor( cards ) {
    const stack = [];
    for( let [Card, count] of cards ) {
      for( let i = 0; i < count; i++) {
        const card = new Card(this);
        stack.push(card);
      }
    }

    this.stack = shuffle( stack );

  }

  draw() {
    if(!this.stack.length) {
      this.stack = shuffle(this.discardPile);
      this.discardPile = [];
    }

    if(this.stack.length == 0)
      Record.log("no cards left");
    else
      return this.stack.pop();
  }

  discard(card) {
    this.discardPile.push(card);
  }

}