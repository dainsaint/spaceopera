import Resource from "./resource.js";
import Record from "./record.js";
import { printNames, range, shuffle } from "./utils.js";

export default class GM {

  destroyOnImpact = .75;
  createOnSuccess = .7;
  createOnMixed = .4;

  constructor() {

  }
  
  resolveRoll(roll, risk = 1) {
    const impacted = roll.filter((x) => x <= risk).length;
    const mixed =
      roll.some((x) => x == 4 || x == 5) && roll.every((x) => x != 6);
    const success = roll.some((x) => x == 6);
    const crit = roll.filter((x) => x == 6).length > 1;

    return {
      impacted,
      mixed,
      success,
      crit,
    };
  }

  adjudicate( result, impacted ) {
    for(const resource of impacted) {
      if (Math.random() < this.destroyOnImpact) {
        Record.log(`❌ GM destroys ${resource.name}.`);        
        resource.destroy();
      } else {
        Record.log(`⭕️ GM transforms ${resource.name}.`);
        resource.transform();
      }
    }

    const resources = [];

    if( result.success && Math.random() < this.createOnSuccess )
      resources.push( new Resource() );

    if( result.mixed && Math.random() < this.createOnMixed )
      resources.push( new Resource() );


    if( resources.length )
      Record.log(`🟢 GM creates ${ printNames( resources ) }`);

    return {
      resources,
      impacted
    }
  }

  smite( society ) {
    const numberToSmite = range(0, 4);
    const playersToSmite = shuffle( society.players.filter( x => x.community.resources.length ) ).slice(0, numberToSmite);
    
    if( !playersToSmite.length )
      return;

    Record.log(`⚡️ GM smites ${printNames(playersToSmite)}`);
    playersToSmite.forEach( player => player.handleSmite() );
  }
}
