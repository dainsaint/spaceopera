import Record from "./js/record.js";
import Parameters from "./parameters.js";
import simulate from "./simulation.js";

let games = [];
let logs = [];
let currentGame = 0;

Parameters.load();

const printRound = ( round ) => {
  const die = [ "one", "two", "three", "four", "five", "six" ];
  const roll = round.roll.map( value => `<i class="die fa-solid fa-dice-${die[ value - 1]} ${ value <= round.stats.risk ? "impacted" : ""}"></i>` ).join(' ');
  return `<tr><td>${roll}</td><td>${round.results.label}</td><td>${round.response.create} (${round.willpower.create})</td><td>${round.response.destroy}</td><td>${round.resources.after}</td></tr>` 
}

const displayResults = ( results, logs )  => {
  const bars = document.querySelector(".js-bars");
  if( !(bars instanceof HTMLElement) )
    return;

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
  terminal.innerHTML = `${logs.map( (log, i) => {
    if(log.indexOf("ROUND") == 0)
      return `${i > 0 ?"</table>" : ""}<h4>${log}</h4><table>`;
    else
      return `<tr><td>${log}</td></tr>`
  }).join("\n")}</table>`
}

const displayDistribution = (games) => {
  const bell = document.querySelector(".js-bell");

  bell.innerHTML = "";
  const histogram = games.reduce(
    (acc, round) => {
      const end = round.at(-1);
      const create = round.reduce((acc, round) => acc + round.response.create, 0);
      const destroy = round.reduce((acc, round) => acc + round.response.destroy, 0);
      const lost = round.reduce((acc, round) => acc + round.results.lost, 0);
      const outcomes = round.reduce((acc, round) => {
        acc[round.results.label] = acc[round.results.label] + 1 || 1;
        return acc;
      }, {});

      acc.total[end.resources.after] = acc.total[end.resources.after] + 1 || 1;
      acc.created[create] = acc.created[create] + 1 || 1;
      acc.destroyed[destroy] = acc.destroyed[destroy] + 1 || 1;
      acc.lost[lost] = acc.lost[lost] + 1 || 1;
      Object.entries(outcomes).forEach(([label, count]) => {
        acc.outcomes[label] ??= 0;
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
        "No Resources": 0,
        "Critical Failure": 0,
        "Mixed Failure": 0,
        "Mixed Success": 0,
        "Success": 0,
        "Critical Success": 0,
      },
    }
  );


  for( var key in histogram ) {
    const range = Math.max(...Object.values(histogram[key]));
    bell.style.setProperty(`--max-${key}`, range);
  }

  for( var key in histogram ) {
    
    const data = histogram[key];
    const keys = Object.keys(data);

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



let chart;
const getChart = () => {
  const ctx = document.getElementById("js-chart");

  if( chart )
    return chart;
  
  Chart.defaults.color = "white"


  chart = new Chart(ctx, {
    type: "line",
    data: {},
    options: {
      spanGaps: true,
      elements: {
        line: {
          borderWidth: 1,
          borderColor: "rgba(158,95,179,.2)",
          tension: 0.3,
          pointRadius: 0,
        },
        point: {
          radius: 0,
        },
      },
      animation: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          type: "linear",
          position: "left",
          min: 0,
          ticks: {
            stepSize: 1,
          },
        },

        y1: {
          type: "linear",
          position: "right",
          ticks: {
            stepSize: 1,
          },
          afterDataLimits: (axis) => {
            if (axis.chart.scales.y._range) {
              axis.min = axis.chart.scales.y._range.min;
              axis.max = axis.chart.scales.y._range.max;
            }
          },
        },
      },
    },
  });

  return chart
}


const displayChart = (games, display = "total") => {

  display = display.replace('#', '');
  console.log( games );

  const outcomes = [
    "No Resources",
    "Critical Failure",
    "Mixed Failure",
    "Mixed Success",
    "Success",
    "Critical Success",
  ];

  const labels = [];
  for (let i = 0; i < Parameters.get("rounds", 5); i++) {
    labels.push(`Round ${i + 1}`);
  }


  const datasets = {
    total: {
      filter: (game) => game.resources.after,
      color: "rgba(158,95,179,.2)",
    },

    created: {
      filter: (game) => game.response.create,
      color: "rgba(6,176,106,.2)",
    },

    destroyed: {
      filter: (game) => game.response.destroy,
      color: "rgba(245,75,67,.2)",
    },

    outcomes: {
      filter: (game) => outcomes.indexOf( game.results.label ),
      color: "rgba(255,153,51,.2)",
    },

    lost: {
      filter: (game, i, games) => games.slice(0, i + 1).reduce((sum, game) => sum + game.results.lost, 0),
      color: "rgba(56, 72, 92,.2)",
    },
  };

  const handler = datasets[display];
  if( !handler )
    return;

  const chart = getChart();
  const { filter, color } = handler;

  const data = games.map((game) => ({
    data: game.map(filter)
  }));

  const current = data.splice(currentGame, 1)[0];
  data.unshift( current );
  current.borderColor = "white";
  current.borderWidth = "2";

  chart.data.labels = labels;
  chart.data.datasets = data;
  chart.options.elements.line.borderColor = color;

  chart.update();
};




window.addEventListener("DOMContentLoaded", () => {

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

  const updateCurrentGame = () => {
    currentGame = Math.min( Parameters.get("currentGame") , games.length - 1);

    displayResults(games.at(currentGame), logs.at(currentGame));
    displayChart(games, window.location.hash);
  }

  const run = () => {
    games = [];
    logs = [];
    
    for (let i = 0; i < Parameters.get("games", 500); i++) {
      const game = simulate();
      games.push( retrofit(game) );
      logs.push( game.log );
    }

    displayDistribution(games);
    updateCurrentGame();

    document.querySelector("button")?.classList.remove("active");
  };


  document.querySelectorAll("input").forEach((input) => {
    const outputs = document.querySelectorAll(`output[name="${input.name}"]`);

    const update = () => {
      Parameters.set(input.name, input.value);
      outputs.forEach((output) => (output.value = input.value));

      document.querySelector(`input[name="currentGame"]`)?.setAttribute("max", Parameters.get("games"))

      if( input.closest("details") ) {
        document.querySelector("button")?.classList.add("active");
      }
    };

    input.addEventListener("input", update);
    update();
  });

  document.querySelector(`input[name="currentGame"]`)?.addEventListener("input", updateCurrentGame);
  document.querySelector("button")?.addEventListener("click", run);

  window.addEventListener("hashchange", (event) => {
    displayChart(games, window.location.hash);
  });

  run();
})