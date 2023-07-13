const isRedundant = (sequence, sequences) => {
  const hasExisting = sequences.some((s) => {
    for (let i = 0; i < 6; i += 2) {
      if (s.substr(i, 2) === sequence.substr(i, 2)) return true;
    }
    return false;
  });

  return hasExisting;
};



export default class Game {
  sequences;

  *generateSequence() {}
}

