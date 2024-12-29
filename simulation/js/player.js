import Sentiment from "./sentiment/sentiment.js";
import Drive from "./sentiment/drive.js";
import { getName, shuffle, range } from "./utils.js";
import ResistCard from "./willpower/resist.js";
import Record from "./record.js";
import Resource from "./resource.js";

export default class Player {
  playerName;

  society;
  community;
  history = [];

  voice;
  resources = [];
  willpower = [];

  personality = new Sentiment();
  mood = new Sentiment(Drive.None, Drive.None, Drive.None, Drive.None);

  state = {
    gained: 0,
    destroyed: 0,
    lost: 0,
    total: 0,
    endangered: false,
  };

  constructor(society) {
    this.playerName = getName("player");
    this.society = society;
    this.willpower = [];
    this.personality.randomize();
    this.rollNewCommunity();
  }

  get name() {
    return `${this.playerName} (${this.community})`;
  }

  rollNewCommunity() {
    if (this.community) this.history.push(this.community);

    this.community = getName("community");
    this.initResources();

    Record.log(
      `${this.name} is now playing as ${this.community} with ${this.resources.length} resources`
    );
  }

  //RESOURCES

  initResources() {
    const numResources = range(1, 2);
    for (let i = 0; i < numResources; i++) {
      const resource = new Resource();
      this.resources.push(resource);
    }
  }

  addResource(resource) {
    this.resources.push(resource);
    this.state.gained++;
  }

  takeResource() {
    const intact = this.intactResources;
    if (!intact.length) return null;

    const resource = intact.pop();
    this.resources.splice(this.resources.indexOf(resource), 1);
    this.state.lost++;
    return resource;
  }

  useResource(resource) {
    resource.use();
  }

  //WILLPOWER

  drawWillpower(deck) {
    const card = deck.draw();
    if (card) this.willpower.push(card);
  }

  decideWillpower(society) {
    const playableCards = this.willpower.filter((card) =>
      card.isPlayable(this)
    );
    const ratedCards = this.rateWillpower(playableCards);

    const bestCard = ratedCards.at(0);

    if (bestCard && bestCard.rate(this.sentiment) >= 3) return bestCard;
    else return null;
  }

  rateWillpower(cards) {
    return cards.sort(
      (a, b) => b.rate(this.sentiment) - a.rate(this.sentiment)
    );
  }

  playWillpower(card) {
    this.discardWillpower(card);
    card.play(this, this.society);
  }

  discardWillpower(card) {
    const index = this.willpower.indexOf(card);
    this.willpower.splice(index, 1);
  }

  //DECISION MAKING

  chooseImpacted(count, resources) {
    return shuffle(resources).slice(0, count);
  }

  distribute(resources, players) {
    const me = this;
    const endangeredPlayers = shuffle(
      players.filter((x) => x.state.endangered && x != me)
    );
    const everyoneElse = shuffle(
      players.filter((x) => !endangeredPlayers.includes(x) && x != me)
    );

    let priority = [];
    if (this.isEndangered || this.sentiment.autonomy > this.sentiment.harmony)
      priority = [me, ...endangeredPlayers, ...everyoneElse];
    else
      priority = [...endangeredPlayers, me, ...everyoneElse];

    for (let i = 0; i < resources.length; i++) {
      const resource = resources[i];
      const player = priority.at(i);
      player.addResource(resource);

      if (player == me) Record.log(`${this.name} takes ${resource.name}`);
      else
        Record.log(
          `${this.name} gives ${resource.name} to ${player.name}`
        );
    }
  }

  handleSmite() {
    const resistCard = this.willpower.find((x) => x instanceof ResistCard);

    if (resistCard) {
      this.playWillpower(resistCard);
      return;
    }

    const resources = shuffle(this.resources);
    const resource = resources.at(0);
    resource.destroy();
  }

  //GAME STATE

  update(outcome) {

    //UPDATE STATE
    const resourcesDestroyed = this.resources.filter(
      (resource) => resource.isDestroyed
    );

    this.resources = this.resources.filter(
      (resource) => !resource.isDestroyed
    );

    this.state.destroyed = resourcesDestroyed.length;
    this.state.total = this.resources.length;
    this.state.endangered = this.resources.length == 0;


    // UPDATE MOOD
    if (this.state.gained) this.mood.drama.decrease();

    if (this.state.destroyed) this.mood.drama.increase();

    if (this.state.total == 1) this.mood.autonomy.increase();
    else if (this.state.total >= 3) this.mood.autonomy.increase();
    else this.mood.autonomy.decrease();

    if (outcome.impacted.length > outcome.resources.length)
      this.mood.strategy.increase();
    else if (outcome.impacted.length < outcome.resources.length)
      this.mood.strategy.decrease();

    //probably needs to take into account more societal level stuff
    if (this.state.total > 2) this.mood.harmony.increase();
    else if (this.state.total < 2) this.mood.harmony.decrease();
  }



  //GETTERS

  get intactResources() {
    return this.resources.filter((x) => !x.isDestroyed);
  }

  get availableResources() {
    return this.resources.filter((x) => x.isAvailable);
  }

  get isEndangered() {
    return this.resources.length == 0;
  }

  get sentiment() {
    return this.personality.add(this.mood);
  }
}
