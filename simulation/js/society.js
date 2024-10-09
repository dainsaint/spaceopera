import Player from "./player.js";
import Voice from  "./voice.js";
import { getName, shuffle, range, printNames } from "./utils.js";
import SentimentRange from "./sentiment/sentimentrange.js";
import Drive from "./sentiment/drive.js";
import Sentiment from "./sentiment/sentiment.js";
import Record from "./record.js";



const wouldDonateResource = new SentimentRange(
  [Drive.None, Drive.Mid],
  [Drive.Low, Drive.Mid],
  [Drive.None, Drive.High],
  [Drive.None, Drive.High]
)


export default class Society {
  name;
  players;

  constructor(numPlayers, numLeaders) {
    this.name = getName("society");
    this.players = [];

    for (let i = 0; i < numPlayers; i++) {
      let player = new Player();
      while (this.players.find((x) => x.name == player.name)) {
        player = new Player();
      }

      if (numLeaders-- > 0) player.voice = Voice.Leader;
      else player.voice = Voice.People;

      this.players.push(player);
    }
  }

  deliberate() {
    // deal with communities at risk
    const endangeredPlayers = this.players.filter( player => player.community.isEndangered );

    if( endangeredPlayers.length ) {
      Record.log( `‼️ ${ printNames(endangeredPlayers) } endangered` );
      // get players with more than one resource who would donate
      const potentialDonors = this.players.filter( player => 
        player.community.resources.length > 1
        && ( wouldDonateResource.rate(player.sentiment) > 1 )
      )

      if( potentialDonors.length ) {
        Record.log(`🤲 ${printNames(potentialDonors)} would donate`);
        for(let i = 0; i < endangeredPlayers.length; i++) {
          const j = i % potentialDonors.length;
          const donor = potentialDonors.at( j );
          const receiver = endangeredPlayers[i];

          const resource = donor.community.resources.pop();
          receiver.community.addResource(resource);
          Record.log(`🫱 ${donor.name} gives ${resource.name} to ${receiver.name}`)

          if( donor.community.resources.length == 1)
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
    const potentialEmissarys = this.players.filter(
      (player) => player.voice == Voice.Leader
    );
    return shuffle(potentialEmissarys).at(0);
  }

  takeAction() {
    const numResourcesToUse = range(1, 3);
    const availableResources = shuffle(
      this.players
        .map((player) =>
          player.community.resources.filter((resource) => resource.isAvailable)
        )
        .flat()
    );

    const resourcesForAction = availableResources.slice(0, numResourcesToUse);
    let log =
      resourcesForAction.length > 0
        ? `${this.name} uses ${resourcesForAction[0].name} to take action.`
        : `${this.name} has no resources available to take an action this round.`;

    for (let i = 1; i < resourcesForAction.length; i++)
      log += ` They aid with ${resourcesForAction[i].name}.`;

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

  update(outcome) {
    for( const player of this.players ) {
      player.update(outcome);
    }
  }

  cycleResources() {
    const resources = this.players.map( player => player.community.resources ).flat();
    resources.forEach((resource) => resource.cycle());
  }

  get totalResources() {
    return this.players.map( player => player.community.resources ).flat().length;
  }

  get averageSentiment() {
    return Sentiment.fromAverage( this.players.map( player => player.sentiment )  )
  }

  get leaderSentiment() {
    return Sentiment.fromAverage( this.players.filter( player => player.voice == Voice.Leader ).map( player => player.sentiment )  )
  }

  get peopleSentiment() {
    return Sentiment.fromAverage( this.players.filter( player => player.voice == Voice.People ).map( player => player.sentiment )  )
  }
}
