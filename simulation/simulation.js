import GM from "./js/gm.js";
import Society from "./js/society.js";
import WillpowerDeck from "./js/willpowerdeck.js";

import { printNames } from "./js/utils.js";
import Record from "./js/record.js";
import Parameters from "./parameters.js";

export default function simulate() {
  Record.reset();

  const gm = new GM();
  const deck = new WillpowerDeck();
  const society = new Society(Parameters.get("communities"), Parameters.get("leaders"));
  society.deck = deck;

  Record.reset();

  function round(roundNumber) {
    Record.newRound();

    Record.set(`resources`, society.numResources);
    

    // Universal Phase
    if (roundNumber > 0) {
      gm.smite(society);
    }

    // Societal Phase
    society.cycleResources();

    const endangeredAtTop = society.players.filter(
      (player) => player.isEndangered
    );

    Record.log(
      `${society.name} have ${society.numIntactResources} resources. ${society.numAvailableResources} are available; ${society.numIntactResources - society.numAvailableResources} are exhausted.`
    );
    society.deliberate();

    //Galactic Phase
    const emissary = society.electEmissary();
    Record.log(`${society.name} send ${emissary.name} to the dais.`);

    let actionsToTake = roundNumber == 0 ? 1 : 2;

    const actions = [];
    const societyActions = [];

    for (let i = 0; i < actionsToTake; i++) 
      societyActions.push(society.takeAction());

    for (let i = 0; i < societyActions.length; i++) {
      const { log, resources } = societyActions[i];

      Record.log(`🌟 Action ${i + 1}: ` + log);


      const roll = society.roll(resources);
      if( resources.length )
        Record.log(`🎲 ${emissary.name} rolls ${roll.length}d6: `, roll);

      const risk = society.risk;
      const result = gm.resolveRoll(roll, risk);
      // Record.log( result );

      const impacted = emissary.chooseImpacted(result.impacted, resources);

      if (result.impacted)
        Record.log(
          `GM will impact ${result.impacted} resources. ${
            emissary.name
          } chooses ${printNames(impacted)}.`
        );

      const outcome = gm.adjudicate(result, impacted);

      actions.push({
        risk,
        roll,
        outcome,
      });

      emissary.distribute(outcome.resources, society.players);
      society.update(outcome);
    }

    Record.set("actions", actions);

    // Record.log( outcome );

    const endangeredAtBottom = society.players.filter(
      (player) => player.isEndangered
    );

    const toDestroy = endangeredAtTop.filter((player) =>
      endangeredAtBottom.includes(player)
    );

    if (toDestroy.length) {
      const communities = toDestroy.map((x) => ({name: x.name}));
      Record.log(`💀 ${printNames(communities)} die`);
      Record.increase("communities_lost", communities.length);
      toDestroy.forEach((player) => player.rollNewCommunity());
    }

    //Individual Phase
    for (const player of society.players) {
      player.drawWillpower(deck);
    }
  }

  
  Record.log( society.players.map( player => `<span class="tag ${player.voice.toLowerCase()}">${player.voice}</span> ${player.name}`).join("<br/>") );

  for (let i = 0; i < Parameters.get("rounds", 5); i++) {
    Record.log(`ROUND ${i + 1}`);
    round(i);
  }

  // Record.log(society);
  // Record.log(deck);

  return {
    rounds: Record.ledger.slice(1),
    log: Record.terminal
  }
}

