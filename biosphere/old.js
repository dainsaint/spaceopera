

/*
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
    result.push(bank[index])
  }

  return result.join(" ");
}

const generateSequenceDisplay = (sequence) => {
  const template = document.getElementById("dom-sequence")
  const container = template.content.cloneNode(true);
  const display = container.querySelector(".bio-sequence");

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

const regenerate = () => {
  const main = document.querySelector(".bio-main")
  const sequences = [];
  main.innerHTML = "";

  for (let i = 0; i < 4; i++) {
    let sequence;
    while( true ) {
      sequence = generateSequence();
      if( !isRedundant(sequence, sequences) )
        break;
    }
    sequences.push( sequence );
    const display = generateSequenceDisplay(sequence);
    main.appendChild(display);
  }

  const allSequences = sequences.join("");
//   console.log( allSequences.replace(/[^R]*/g, "").length, allSequences.replace(/[^G]*/g, "").length, allSequences.replace(/[^B]*/g, "").length, allSequences.replace(/[^Y]*/g, "").length );
  
//   const synth = window.speechSynthesis;
//   const utterance = new SpeechSynthesisUtterance( generateName(sequences[0]) )

//   // synth.speak(utterance);
// }

// window.addEventListener("keydown", regenerate)
// regenerate();

