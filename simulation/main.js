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
    (acc, cur) => {
      const end = cur.at(-1);
      const create = cur.reduce((acc, cur) => acc + cur.response.create, 0);
      const destroy = cur.reduce((acc, cur) => acc + cur.response.destroy, 0);
      const lost = cur.reduce((acc, cur) => acc + cur.results.lost, 0);
      const outcomes = cur.reduce((acc, cur) => {
        acc[cur.results.label] = acc[cur.results.label] + 1 || 1;
        return acc;
      }, {});

      acc.total[end.resources.after] = acc.total[end.resources.after] + 1 || 1;
      acc.created[create] = acc.created[create] + 1 || 1;
      acc.lost[lost] = acc.lost[lost] + 1 || 1;
      acc.destroyed[destroy] = acc.destroyed[destroy] + 1 || 1;
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
    data: {
      labels: ["Round 1", "Round 2", "Round 3", "Round 4", "Round 5"],
    },
    options: {
      spanGaps: true,
      elements: {
        line: {
          borderWidth: 1,
          borderColor: "rgba(158,95,179,.2)",
          tension: 0.3,
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
        left: {
          type: "linear",
          position: "left",
        },

        right: {
          type: "linear",
          position: "right",
        },
      },
    },
  });

  return chart
}




const displayChart = (games, display = "total") => {

  display = display.replace('#', '');

  const outcomes = [
    "No Resources",
    "Critical Failure",
    "Mixed Failure",
    "Mixed Success",
    "Success",
    "Critical Success",
  ];

  // console.log( games);

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
      filter: (game) => game.results.lost,
      color: "rgba(160,201,229,.2)",
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

  chart.data.datasets = data;
  chart.options.elements.line.borderColor = color;
  chart.update();
};




window.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll("input").forEach(input => {
    const outputs = document.querySelectorAll(`output[name="${input.name}"]`)
    
    const update = () => {
      Parameters.set(input.name, input.value);
      outputs.forEach(output => output.value = input.value);
    }

    input.addEventListener("input", update);
    update();
  });

  window.addEventListener("hashchange", event => {
    displayChart(games, window.location.hash)
  })

  // document.querySelectorAll(".js-view").forEach(link =>
  //   link.addEventListener("click", (e) => {
  //     e.preventDefault();
  //     history.pushState(null, null, link.getAttribute("href"));
  //     window.dispatchEvent(new Event("hashchange"));
  //   })
  // )

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
    
    for (let i = 0; i < 500; i++) {
      const game = simulate();
      games.push( retrofit(game) );
      logs.push( game.log );
    }

    displayDistribution(games);
    updateCurrentGame();
  };

  document.querySelector(`input[name="currentGame"]`)?.addEventListener("change", updateCurrentGame);

  document.querySelector("button")?.addEventListener("click", run);
  run();
})


// Record.debug = true;
// simulate();