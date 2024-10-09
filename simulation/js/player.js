import Community from "./community.js";
import Sentiment from "./sentiment/sentiment.js";
import Drive from "./sentiment/drive.js";
import { getName, shuffle } from "./utils.js";
import ResistCard from "./willpower/resist.js";
import Record from "./record.js";

export default class Player {
  name;
  community;
  voice;
  willpower = [];

  personality = new Sentiment();
  mood = new Sentiment(Drive.None, Drive.None, Drive.None, Drive.None);
  history = [];

  constructor() {
    this.name = getName("player");
    this.willpower = [];
    this.personality.randomize();
    this.rollNewCommunity();
  }

  rollNewCommunity() {
    if( this.community )
      this.history.push( this.community );
    
    this.community = new Community();
    this.community.initResources();

    Record.log( `${this.name} is now playing as ${this.community.name}`);
  }

  chooseImpacted(count, resources) {
    return shuffle(resources).slice(0, count);
  }

  consider(others) {
    //If i am very harmonious and not too autonomous, 
    //and i have more than 1 resource, 
    //i would give a resource to a zero resource community

    //Then, lemme see what i've got for willpower
    this.willpower.map((willpower) => willpower.evaluate(this, others));
  }

  distribute(resources, players) {

    const me = this;
    const endangeredPlayers = shuffle(players.filter((x) => x.community.state.endangered && x != me));
    const everyoneElse = shuffle( players.filter( x => !endangeredPlayers.includes(x) && x != me ) );

    let priority = [];
    if( this.community.isEndangered || this.sentiment.autonomy > this.sentiment.harmony ) 
      priority = [me, ...endangeredPlayers, ...everyoneElse];
    else
      priority = [...endangeredPlayers, me, ...everyoneElse];

    for (let i = 0; i < resources.length; i++) {
      const resource = resources[i];
      const player = priority.at(i);
      player.community.addResource(resource);

      if( player == me )
        Record.log( `${this.name} takes ${resource.name}` );
      else
        Record.log(`${this.name} gives ${resource.name} to ${player.community.name}`);
    }
  }

  decideWillpower(society) {
    const cards = this.willpower
      .filter((card) => card.canBeActivated(this))
      .sort(
        (a, b) => b.rate(this.sentiment) - a.rate(this.sentiment)
      );

    const bestCard = cards.at(0);

    if (bestCard && bestCard.rate(this.sentiment) >= 3)
      return bestCard;
    else
      return null;
  }

  playWillpower( card ) {
    const index = this.willpower.indexOf(card);
    this.willpower.splice(index, 1);
    card.activate( this );
  }

  handleSmite() {
    const resistCard = this.willpower.find( x => x instanceof ResistCard);

    if (resistCard) {
      this.playWillpower(resistCard);
      return;
    }

    const resources = shuffle( this.community.resources );
    const resource = resources.at(0);
    resource.destroy();
  }

  update(outcome) {
    const state = this.community.update();

    //idk about mood modelling yet;

    if( state.gained )
      this.mood.drama.decrease();

    if( state.destroyed )
      this.mood.drama.increase();

    
    if( state.total == 1 )
      this.mood.autonomy.increase();
    else if( state.total >= 3 )
      this.mood.autonomy.increase();
    else
      this.mood.autonomy.decrease();
    
    if( outcome.impacted.length > outcome.resources.length )
      this.mood.strategy.increase();
    else if (outcome.impacted.length < outcome.resources.length)
      this.mood.strategy.decrease();


    //probably needs to take into account more societal level stuff
    if( state.total > 2 )
      this.mood.harmony.increase();
    else if( state.total < 2 )
      this.mood.harmony.decrease();
  }

  drawWillpower(deck) {
    const card = deck.draw();
    if (card) this.willpower.push(card);
  }

  askForResource(requester) {
    const resources = this.availableResources;
    if (!resources.length) return null;

    const offer = resources.at(0);

    if (this.sentiment.harmony < Drive.Mid) return null;

    if (this.sentiment.strategy > Drive.Mid) {
      const willpower = requester.askForWillpower(this);
      if (willpower) {
        this.willpower.push(willpower);
        return offer;
      } else {
        return null;
      }
    }

    if (this.sentiment.drama > Drive.Mid && Math.random() <= 0.5) return null;

    return offer;
  }

  askForWillpower() {
    const leastAligned = this.willpower
      .sort((a, b) => a.rate(this.sentiment) - b.rate(this.sentiment))
      .at(0);

    if( leastAligned.rate(this.sentiment) < 3 )
      return leastAligned;
    else
      return null;
  }

  get sentiment() {
    return this.personality.add( this.mood );
  }

  get availableResources() {
    return this.community.availableResources;
  }
}
