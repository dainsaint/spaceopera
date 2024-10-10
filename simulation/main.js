import Record from "./js/record.js";
import simulate from "./simulation.js";


const printRound = ( round ) => {
  const die = [ "one", "two", "three", "four", "five", "six" ];
  const roll = round.roll.map( value => `<i class="die fa-solid fa-dice-${die[ value - 1]} ${ value <= round.stats.risk ? "impacted" : ""}"></i>` ).join(' ');
  return `<tr><td>${roll}</td><td>${round.results.label}</td><td>${round.response.create} (${round.willpower.create})</td><td>${round.response.destroy}</td><td>${round.resources.after}</td></tr>` 
}

const displayResults = ( results, logs )  => {
  const bars = document.querySelector(".js-bars");

  bars.innerHTML = "";

  for (const round of results) {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.setProperty("--value", round.resources.after);
    bar.setAttribute("data-value", round.resources.after);

    bars.appendChild(bar);
  }

  const maxResources = results.reduce((acc, cur) => Math.max(acc, cur.resources.after), 0);
  bars.style.setProperty("--max", maxResources);

  const log = document.querySelector(".js-log");
  log.innerHTML = `
    <th>Roll</th><th>Result</th><th>Created</th><th>Destroyed</th><th>Total</th>
    ${ results.map(printRound).join("\n") }
    `;

  const terminal  = document.querySelector(".js-terminal");
  terminal.innerHTML = `${logs.map( log => {
    if(log.indexOf("ROUND") == 0)
      return `<tr><th>${log}</th></tr>`;
    else
      return `<tr><td>${log}</td></tr>`
  }).join("\n")}`
}

const displayDistribution = (games) => {
  const bell = document.querySelector(".js-bell");

  bell.innerHTML = "";
  const histogram = games.reduce(
    (acc, cur) => {
      const end = cur.at(-1);
      const create = cur.reduce((acc, cur) => acc + cur.response.create, 0);
      const destroy = cur.reduce((acc, cur) => acc + cur.response.destroy, 0);
      const lost = cur.reduce((acc, cur) => acc + cur.results.lost, 0);
      const outcomes = cur.reduce((acca, cur) => {
        acca[cur.results.label] = acca[cur.results.label] + 1 || 1;
        return acca;
      }, {});

      acc.total[end.resources.after] = acc.total[end.resources.after] + 1 || 1;
      acc.created[create] = acc.created[create] + 1 || 1;
      acc.lost[lost] = acc.lost[lost] + 1 || 1;
      acc.destroyed[destroy] = acc.destroyed[destroy] + 1 || 1;
      Object.entries(outcomes).forEach(([label, count]) => {
        acc.outcomes[label] = acc.outcomes[label] + count || count;
      });
      return acc;
    },
    {
      total: {},
      created: {},
      destroyed: {},
      lost: {},
      outcomes: {
        "Critical Failure": 0,
        "Mixed Failure": 0,
        "Mixed Success": 0,
        "Success": 0,
        "Critical Success": 0,
      },
    }
  );

  const ranges = {};

  console.log( histogram );

  for( var key in histogram ) {

    const min = Math.min(...Object.keys(histogram[key])) || 0;
    const max = Math.max(...Object.keys(histogram[key])) || Object.keys(histogram[key]).length - 1;
    const range = Math.max(...Object.values(histogram[key]));

    bell.style.setProperty(`--max-${key}`, range);

    ranges[key] = { min, max, range };
  }

  for( var key in histogram ) {
    
    const data = histogram[key];
    const keys = Object.keys(data);
    console.log( keys );
    const {min, max} = ranges[key];

    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const bar = document.createElement("div");
      bar.classList.add("bar");
      bar.classList.add(`bar-${key}`);
      bar.style.setProperty("--value", data[k]);
      bar.setAttribute("data-value", k);

      bell.appendChild(bar);
    } 
  }

}



window.addEventListener("DOMContentLoaded", () => {
  // loadParameters();

  // document.querySelectorAll("input").forEach(input => {
  //   const output = input.closest("li").querySelector("output");
  //   const update = () => {
  //     updateParameter(input.name, input.value);
  //     if (output) output.value = input.value;
  //   }

  //   input.addEventListener("input", () => {
  //     update();
  //     updatePopulation();
  //   });

  //   update();
  // });

  document.querySelectorAll(".js-view").forEach(link =>
    link.addEventListener("click", () => {
      const bell = document.querySelector(".js-bell");
      bell.classList.remove("total", "created", "destroyed", "outcomes", "lost");
      bell.classList.add(link.dataset.type);
    })
  )

  const labels = ["Critical Failure", "Mixed Failure", "Mixed Failure", "Mixed Success", "Mixed Success", "Success", "Critical Success"];

  const retrofit = (game) => {

    return game.rounds.map( round => {
      const { roll, risk, outcome } = round.actions[0];
      
      const crit = roll.filter( die => die == 6 ).length > 1;
      let max = roll.reduce( (max, die) => Math.max(max, die), 0) - 1;
      if( crit ) max++;

      const result = {
        stats: {
          used: roll.length,
          risk: risk,
        },
        willpower: {
          create: 0,
        },
        roll,
        results: {
          label: labels[max] || "No Resources",
          impacted: outcome.impacted.length,
          lost: round.communities_lost || 0
        },
        response: {
          create: round.resources_created || 0,
          destroy: round.resources_destroyed || 0,
        },
        resources: {
          after: round.resources || 0,
        },
      };

      return result;
    })

    
  };

  const run = () => {
    const games = [];
    const logs = [];
    for (let i = 0; i < 1000; i++) {
      const game = simulate();
      games.push( retrofit(game) );
      logs.push( game.log );
    }

    // console.log( games );

    displayResults(games.at(-1), logs.at(-1) );
    displayDistribution(games);
  };

  // updatePopulation();

  document.querySelector("button").addEventListener("click", run);
  run();
})


// Record.debug = true;
// simulate();