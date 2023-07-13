import { colors, order, subjects, verbs, objects } from "./modules/data.js";


let game;

const resetGame = () => {
  game = {
    state: "setup",
    sequences: [],
    factions: [],
    secrets: {},
    cycles: [],
    cycle: 0,
  }
  save();
}

const save = () => {
  localStorage.setItem("game", JSON.stringify(game));
  states.global.save?.();
}

const load = () => {

  try {
    game = JSON.parse( localStorage.getItem("game") )
  } catch(e) {
    resetGame();
  }

  states.global.load?.();
  
}

const generateSequence = () => {
  let sequence = ""
  for (let i = 0; i < 6; i++)
    sequence += colors[Math.floor(Math.random() * colors.length)];

  return sequence;
}

const generateName = (sequence) => {
  const banks = [subjects, verbs, objects];
  const result = [];
  for (let i = 0; i < 3; i++) {
    const bank = banks[i];
    const fragment = sequence.substring(i * 2, i * 2 + 2);
    const index = order.indexOf(fragment);
    result.push(bank[index] || "░░░░░░");
  }

  return result.join(" ");
}

const generateSequenceDisplay = (sequence, status) => {
  const template = document.getElementById("dom-sequence")
  const container = template.content.cloneNode(true);
  const display = container.querySelector(".bio-sequence");

  if( status == "lost" )
    sequence = "WWWWWW";

  display.classList.add(`bio-sequence__${status}`);

  display.innerHTML = "";
  for (const color of sequence) {
    const chit = document.createElement("div");
    chit.classList.add("bio-sequence__chit", `bio-sequence__chit--${color}`);
    display.appendChild(chit);
  }

  const name = generateName(sequence);
  container.querySelector(".bio-name").innerText = name;
  return container;
}

const isRedundant = (sequence, sequences) => {
  
  const hasExisting = sequences.some( s => {
    for( let i = 0; i < 6; i += 2 ) {
    if( s.substr(i, 2) === sequence.substr(i, 2))
      return true;
    }
    return false;
  })

  return hasExisting;
}

const generateCycle = ( name, count ) => {
  const cycle = {
    name,
    sequences: []
  };

  for (let i = 0; i < count; i++) {
    let sequence;
    while( true ) {
      sequence = generateSequence();
      if( !isRedundant(sequence, game.sequences) )
        break;
    }

    game.sequences.push( sequence );

    cycle.sequences.push({
      sequence,
      status: "Pending"
    })

  }

  return cycle;
}


const action = (id, value) => {
  const f = states[game.state]?.on?.[id] || states.global?.on?.[id];
  f?.(value);
}

const transition = (id) => {
  if (game.state) states[game.state]?.exit?.();
  const lastState = game.state;
  game.state = id;

  navigate(id);

  const saveState = states[game.state]?.enter?.( lastState ) !== false;
  
  if( saveState )
    save();
}


const navigate = (id) => {
  const pages = document.querySelectorAll(".js-page");
  for (const page of pages) {
    page.classList.add("hidden");
  }

  document.getElementById(`page-${id}`)?.classList.remove("hidden");
};


let lastState;

const states = {
  setup: {
    enter: () => {
      load();
      for (let i = 0; i < game.factions.length; i++) {
        document.querySelector(`input.js-faction-${i}`).name = game.factions[i];
      }
    },

    on: {
      factions: () => {
        game.factions[0] = document.querySelector(`input.js-faction-0`).value;
        game.factions[1] = document.querySelector(`input.js-faction-1`).value;
        game.factions[2] = document.querySelector(`input.js-faction-2`).value;

        game.cycles.push(generateCycle("Cycle I", 4));
        game.cycles.push(generateCycle("Cycle II", 4));
        game.cycles.push(generateCycle("Cycle III", 4));

        game.secrets = generateCycle("Secrets", 3);
        game.secrets.sequences.forEach( sequence => sequence.status = "lost" );

        save();
        transition("apex");
      },
    },
  },

  apex: {
    enter: () => {
      
      if( game.cycle >= game.cycles.length ) {
        transition("epilogue");
        return;
      }

      const cycle = game.cycles[game.cycle];
      document.querySelector(
        ".js-apex-title"
      ).innerHTML = `Apex (${cycle.name})`;

      const main = document.querySelector(".js-apex-sequences");

      main.innerHTML = "";

      for (const sequence of cycle.sequences) {
        const display = generateSequenceDisplay(sequence.sequence);
        main.appendChild(display);
      }
    },
    on: {
      generate: () => {},
      retrograde: () => {
        transition("retrograde");
      },
    },
  },

  retrograde: {
    enter: () => {
      if (game.cycle >= game.cycles.length) {
        transition("epilogue");
        return;
      }
      
      const cycle = game.cycles[game.cycle];
      document.querySelector(
        ".js-retrograde-title"
      ).innerHTML = `Retrograde (${cycle.name})`;

      const main = document.querySelector(".js-retrograde-sequences");

      main.innerHTML = "";

      for (const sequence of cycle.sequences) {
        const row = document.createElement("div");
        row.classList.add("bio-retrograde-row");

        const display = generateSequenceDisplay(
          sequence.sequence,
          sequence.status
        );
        row.appendChild(display);

        const buttons = document.createElement("div");
        buttons.classList.add("bio-retrograde-buttons");

        const good = document.createElement("button");
        good.innerText = "GOOD";
        good.name = "good";
        good.value = sequence.sequence;

        const lost = document.createElement("button");
        lost.innerText = "LOST";
        lost.name = "lost";
        lost.value = sequence.sequence;

        initButton(good);
        initButton(lost);

        buttons.append(good, lost);
        row.appendChild(buttons);

        main?.appendChild(row);
      }
    },
    on: {
      apex: () => {
        transition("apex");
      },
      cycle: () => {
        game.cycle++;
        save();
        if( game.cycle < game.cycles.length)
          transition("apex");
        else
          transition("epilogue");
      },
      good: (seq) => {
        const cycle = game.cycles[game.cycle];
        const sequence = cycle.sequences.find((x) => x.sequence == seq);
        sequence.status = "good";
        save();
        transition("retrograde");
      },

      lost: (seq) => {
        const cycle = game.cycles[game.cycle];
        const sequence = cycle.sequences.find((x) => x.sequence == seq);
        sequence.status = "lost";
        save();
        transition("retrograde");
      },
    },
  },

  epilogue: {
    enter: () => {
      const main = document.querySelector(".js-epilogue-sequences");
      main.innerHTML = "";

      for( const cycle of game.cycles ) {
        for( const sequence of cycle.sequences ) {
          const display = generateSequenceDisplay(sequence.sequence, sequence.status);
          main?.append(display);
        }
      }
    }
  },

  gm: {
    enter: (s) => {
      (lastState = s)
      return false;
    },
    on: {
      reset: () => {
        resetGame();
        transition(game.state);
      },
      secrets: () => {
        transition("secrets");
      },
      back: () => transition(lastState),
    },
  },

  secrets: {
    enter: (s) => {
      if (lastState != "gm") lastState = s;

      const main = document.querySelector(".js-secret-sequences");

      main.innerHTML = "";
      game.secrets.sequences.forEach((secret, i) => {
        const faction = document.createElement("h2");
        faction.innerHTML = game.factions[i];

        const row = document.createElement("div");
        row.classList.add("bio-retrograde-row");

        const display = generateSequenceDisplay(secret.sequence, secret.status);
        row.appendChild(display);

        const buttons = document.createElement("div");
        buttons.classList.add("bio-retrograde-buttons");

        const show = document.createElement("button");
        show.innerText = "SHOW";
        show.name = "show";
        show.value = secret.sequence;

        const hide = document.createElement("button");
        hide.innerText = "HIDE";
        hide.name = "hide";
        hide.value = secret.sequence;

        initButton(show);
        initButton(hide);

        buttons.append(show, hide);
        row.appendChild(buttons);

        main?.append(faction);
        main?.append(row);
      });

      return false;
    },
    on: {
      back: () => transition("apex"),
      show: (seq) => {
        
        const sequence = game.secrets.sequences.find((x) => x.sequence == seq);
        sequence.status = "good";
        save();
        transition("secrets");
      },

      hide: (seq) => {
        const sequence = game.secrets.sequences.find((x) => x.sequence == seq);
        sequence.status = "lost";
        save();
        transition("secrets");
      },
    },
  },

  global: {
    on: {
      gm: () => {
        transition("gm");
      },
    },

    save: () => {
      const progress = document.querySelector(".js-progress");
    },
  },
};


const initButton = button => {
  button.addEventListener("click", () => action(button.name, button.value));
}

const setup = () => {
  const buttons = document.getElementsByTagName("button");
  for (const button of buttons) {
    initButton( button)
  }

  load();
  transition( game.state );
}

// resetGame();
setup();
