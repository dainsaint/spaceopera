let parameters = {
  communities: 8,
  leaderPct: .5,
}

const updatePopulation = () => {
  const leaders = document.querySelector(".js-leaders");
  const people = document.querySelector(".js-people");

  updateParameter("leaders", Math.floor(parameters.communities * parameters.leaderPct));
  updateParameter("people", parameters.communities - parameters.leaders);
  updateParameter("resources", parameters.leaders * parameters.leaderresources + parameters.people * parameters.peopleresources);

  leaders.innerHTML = parameters.leaders;
  people.innerHTML = parameters.people;
}

const updateParameter = (name, value) => {
  parameters[name] = value;
  saveParameters();
}

const gleanParameters = () => {
  document.querySelectorAll("input").forEach(input => parameters[input.name] = input.value);
}

const saveParameters = () => {
  localStorage.setItem("parameters", JSON.stringify(parameters) );
}

const loadParameters = () => {
  try {
    const loaded = localStorage.getItem("parameters");
    if( loaded )
      parameters = JSON.parse(loaded);
    
    for( var key in parameters ) {
      const input = document.querySelector(`input[name="${key}"]`)
      if( input )
        input.value = parameters[key];
    }

  } catch(e) {
    console.log("No save found, using default parameters.");
  }

  return false;
}

const simulate = () => {
  // roll
  const game = [];
  let before = parameters.resources;
  let after = parameters.resources;

  for( let i = 0; i < parameters.rounds; i++ ) {
    const roll = [];
    const used = Math.min( parameters.action, before );
    for( let d = 0; d < used; d++ ) {
      const die = Math.floor( 1 + Math.random() * 6 );
      roll.push(die);
    }

    const impacted = roll.filter( x => x <= parameters.risk ).length;
    const mixed = roll.some(x => x == 4 || x == 5);
    const success = roll.some( x => x == 6 );
    const crit = roll.filter( x => x == 6).length > 1;

    let max = roll.reduce( (max, die) => Math.max(max, die), 0) - 1;
    if( crit ) max++;

    const shouldCreate = (success && Math.random() <= parameters.success / 100) 
      || (mixed && Math.random() <= parameters.mixed / 100) 
      || (crit && Math.random() <= parameters.critsuccess / 100);
    const create = shouldCreate ? 1 : 0;
    const destroy = Math.floor( parameters.impacted / 100 * impacted );

    const labels = ["Critical Failure", "Mixed Failure", "Mixed Failure", "Mixed Success", "Mixed Success", "Success", "Critical Success"];
    const label = labels[max];


    after = before + create - destroy;
    
    const round = {
      stats: {
        used,
        risk: parameters.risk
      },
      roll,
      results: {
        label,
        impacted,
        success,
        crit
      },
      response: {
        create,
        destroy
      },
      resources: {
        before,
        after
      }
    }

    game.push( round );

    before = after;
  }

  return game;
}

const printRound = ( round ) => {
  const die = [ "one", "two", "three", "four", "five", "six" ];
  const roll = round.roll.map( value => `<i class="die fa-solid fa-dice-${die[ value - 1]} ${ value <= round.stats.risk ? "impacted" : ""}"></i>` ).join(' ');
  return `<tr><td>${roll}</td><td>${round.results.label}</td><td>${round.response.create}</td><td>${round.response.destroy}</td><td>${round.resources.before} => ${round.resources.after}</td></tr>` 
}

const displayResults = ( results )  => {
  const bars = document.querySelector(".js-bars");

  bars.innerHTML = "";

  for (const round of results) {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.setProperty("--value", round.resources.before);
    bar.setAttribute("data-value", round.resources.before);

    bars.appendChild(bar);
  }

  const maxResources = results.reduce((acc, cur) => Math.max(acc, cur.resources.before), 0);
  bars.style.setProperty("--max", maxResources);

  const log = document.querySelector(".js-log");
  log.innerHTML = `
    <th>Roll</th><th>Result</th><th>Created</th><th>Destroyed</th><th>Change</th>
    ${ results.map(printRound).join("\n") }
    `;
}

const displayDistribution = (games) => {
  const bell = document.querySelector(".js-bell");

  bell.innerHTML = "";
  const histogram = games.reduce( (acc, cur) => {
    const end = cur.at(-1);
    const create = cur.reduce( (acc, cur) => acc + cur.response.create, 0);
    const destroy = cur.reduce((acc, cur) => acc + cur.response.destroy, 0);

    acc.total[end.resources.after] = acc.total[end.resources.after] + 1 || 1;
    acc.created[create] = acc.created[create] + 1 || 1;
    acc.destroyed[destroy] = acc.destroyed[destroy] + 1 || 1;

    return acc;
  }, {
    total: {},
    created: {},
    destroyed: {}
  })

  const ranges = {};

  for( var key in histogram ) {

    const min = Math.min(...Object.keys(histogram[key]));
    const max = Math.max(...Object.keys(histogram[key]));
    const range = Math.max(...Object.values(histogram[key]));
  
    bell.style.setProperty(`--max-${key}`, range);

    ranges[key] = { min, max, range };
  }

  for( var key in histogram ) {
    const data = histogram[key];
    const {min, max} = ranges[key];

    for (let i = min; i <= max; i++) {
      const bar = document.createElement("div");
      bar.classList.add("bar");
      bar.classList.add(`bar-${key}`);
      bar.style.setProperty("--value", data[i]);
      bar.setAttribute("data-value", i);

      bell.appendChild(bar);
    } 
  }

}

window.addEventListener("DOMContentLoaded", () => {
  loadParameters();

  document.querySelectorAll("input").forEach(input => {
    const output = input.closest("li").querySelector("output");
    const update = () => {
      updateParameter(input.name, input.value);
      if (output) output.value = input.value;
    }

    input.addEventListener("input", () => { 
      update();
      updatePopulation();
    });

    update();
  });

  document.querySelectorAll(".js-view").forEach(link => 
    link.addEventListener("click", () => {
      const bell = document.querySelector(".js-bell");
      bell.classList.remove("total", "created", "destroyed");
      bell.classList.add(link.dataset.type);
    })
  )


  const run = () => {
    const games = [];
    for (let i = 0; i < parameters.games; i++) {
      games.push(simulate());
    }

    displayResults(games.at(-1));
    displayDistribution(games);
          
  }

  updatePopulation();

  document.querySelector("button").addEventListener("click", run);
  run();
  
})

