import Player from "./player.js";
import Voice from  "./voice.js";
import { getName, shuffle, range, printNames } from "./utils.js";
import SentimentRange from "./sentiment/sentimentrange.js";
import Drive from "./sentiment/drive.js";
import Sentiment from "./sentiment/sentiment.js";
import Record from "./record.js";
import Parameters from "../parameters.js";


const wouldDonateResource = new SentimentRange(
  [Drive.None, Drive.Mid],
  [Drive.Low, Drive.Mid],
  [Drive.None, Drive.High],
  [Drive.None, Drive.High]
)


export default class Society {
  name;
  players;
  risk = 1;

  emissaries = [];

  constructor(numPlayers, numLeaders) {
    this.name = getName("society");
    this.players = [];

    for (let i = 0; i < numPlayers; i++) {
      let player = new Player(this);
      while (this.players.find((x) => x.name == player.name)) {
        player = new Player(this);
      }

      if (numLeaders-- > 0) player.voice = Voice.Leader;
      else player.voice = Voice.People;

      this.players.push(player);
    }
  }

  deliberate() {
    // deal with communities at risk
    const endangeredPlayers = this.players.filter( player => player.isEndangered );

    if( endangeredPlayers.length ) {
      Record.log( `‼️ ${ printNames(endangeredPlayers) } endangered` );
      // get players with more than one resource who would donate
      const potentialDonors = this.players.filter( player => 
        player.resources.length > 1
        && ( wouldDonateResource.rate(player.sentiment) > 1 )
      )

      if( potentialDonors.length ) {
        Record.log(`🤲 ${printNames(potentialDonors)} would donate`);
        for(let i = 0; i < endangeredPlayers.length; i++) {
          const j = i % potentialDonors.length;
          const donor = potentialDonors.at( j );
          const receiver = endangeredPlayers[i];

          const resource = donor.resources.pop();
          receiver.addResource(resource);
          Record.log(`🫱 ${donor.name} gives ${resource.name} to ${receiver.name}`)

          if( donor.resources.length == 1)
            potentialDonors.splice(j, 1);

          if( potentialDonors.length == 0 )
            break;
        }
      } else {
        Record.log(`🙅 No players willing/able to donate`);
      }
    }

    // deal with willpower

    this.players.forEach( player => {
      const card = player.decideWillpower();

      if(card)
        player.playWillpower(card);
    })

  }

  electEmissary() {
    if( this.emissaries.length ) {
      const emissary = this.emissaries.at(-1);
      this.emissaries = [];
      return emissary;
    } else {
      const potentialEmissarys = this.players.filter(
        (player) => player.voice == Voice.Leader
      );
      return shuffle(potentialEmissarys).at(0);
    }
  }
  
  forceEmissary(player) {
    this.emissaries.push(player);
  }

  takeAction() {
    const numResourcesToUse = range(1, Parameters.get("maxresources", 3));
    const availableResources = shuffle( this.getAvailableResources() );

    const resourcesForAction = availableResources.slice(0, numResourcesToUse);
    let log =
      resourcesForAction.length > 0
        ? `${this.name} use ${resourcesForAction[0].name} to take action.`
        : `${this.name} have no resources available to take an action this round.`;

    const additionalResources = resourcesForAction.slice(1);
    if (additionalResources.length)
      log += ` They aid with ${printNames(additionalResources)}`;

    resourcesForAction.forEach( resource => resource.use() );

    return {
      log,
      resources: resourcesForAction,
    };
  }

  roll(resources) {
    const result = [];
    for (let d = 0; d < resources.length; d++) {
      const die = Math.floor(1 + Math.random() * 6);
      result.push(die);
    }

    return result;
  }

  increaseRisk() {
    this.risk++;
    Record.log(`${this.name} risk level is now ${this.risk}`);
  }

  update(outcome) {
    for( const player of this.players ) {
      player.update(outcome);
    }

    this.risk = 1;
  }

  cycleResources() {
    const allResources = this.players.map( x => x.resources ).flat();
    allResources.forEach((resource) => resource.cycle());
  }

  getAvailableResources() {
    return this.players.map( x => x.availableResources ).flat();
  }

  get people() {
    return this.players.filter( player => player.voice == Voice.People );
  }

  get leaders() {
    return this.players.filter( player => player.voice == Voice.Leader );
  }

  get resources() {
    return this.players.map( player => player.resources ).flat();
  }

  get numResources() {
    return this.players.map( player => player.resources ).flat().length;
  }

  get numIntactResources() {
    return this.players.map( player => player.intactResources ).flat().length;
  }

  get numAvailableResources() {
    return this.players.map( player => player.availableResources ).flat().length;
  }

  get averageSentiment() {
    return Sentiment.fromAverage( this.players.map( player => player.sentiment )  )
  }

  get leaderSentiment() {
    return Sentiment.fromAverage( this.leaders.map( player => player.sentiment )  )
  }

  get peopleSentiment() {
    return Sentiment.fromAverage( this.people.map( player => player.sentiment )  )
  }
}
