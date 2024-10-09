import Card from "../cards/card.js";

export default class CreateCard extends Card {
  name = "🌱 Create";

  setParameters() {
    this.minimumResources = 1;
    this.minimumWillpower = 2;
  }

  evaluate(player, others) {
    others = others.filter((other) => other != player);

    const card = others.find((other) => other.askForWillpower(player));
    console.log(card);

    // //can i use?

    // const withHelp =
    //   others.map( player => player.availableResources ).flat().length > 0
    //   && others.map( player => player.willpower ).flat().length > 0;

    // return {
    //   now,
    //   withHelp
    // }
  }
}