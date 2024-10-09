import GM from "./js/gm.js";
import Society from "./js/society.js";
import WillpowerDeck from "./js/willpowerdeck.js";

import { printNames } from "./js/utils.js";
import Record from "./js/record.js";


export default function simulate() {
  const gm = new GM();
  const deck = new WillpowerDeck();
  const society = new Society(8, 3);

  Record.reset();

  function round(roundNumber) {
    Record.newRound();

    Record.set(`resources`, society.totalResources);

    // Universal Phase
    if (roundNumber > 0) {
      gm.smite(society);
    }

    // Societal Phase
    society.cycleResources();

    const endangeredAtTop = society.players.filter(
      (player) => player.community.isEndangered
    );

    const totalResources = society.players.reduce(
      (total, player) => total + player.community.intactResources.length,
      0
    );

    const availableResources = society.players.reduce(
      (total, player) => total + player.community.availableResources.length,
      0
    );

    Record.log(
      `${society.name} has ${totalResources} resources; ${availableResources} are not exhausted`
    );
    society.deliberate();

    //Galactic Phase
    const emissary = society.electEmissary();
    Record.log(`${society.name} sends ${emissary.name} to the dais.`);

    let actionsToTake = roundNumber == 0 ? 1 : 2;

    const actions = [];

    for (let i = 0; i < actionsToTake; i++) {
      const { log, resources } = society.takeAction();

      Record.log(`🌟 Action ${i + 1}: ` + log);

      const roll = society.roll(resources);
      Record.log(`🎲 ${emissary.name} rolls ${roll.length}d6: `, roll);

      const risk = 1;
      const result = gm.resolveRoll(roll, risk);
      // Record.log( result );

      const impacted = emissary.chooseImpacted(result.impacted, resources);

      if (result.impacted)
        Record.log(
          `GM decides ${result.impacted} resources will be impacted. ${
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
      (player) => player.community.isEndangered
    );

    const toDestroy = endangeredAtTop.filter((player) =>
      endangeredAtBottom.includes(player)
    );

    if (toDestroy.length) {
      const communities = toDestroy.map((x) => x.community);
      Record.log(`💀 ${printNames(communities)} die`);
      Record.increase("communities_lost", communities.length);
      toDestroy.forEach((player) => player.rollNewCommunity());
    }

    //Individual Phase
    for (const player of society.players) {
      player.drawWillpower(deck);
    }
  }

  for (let i = 0; i < 5; i++) {
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

