const isRedundant = (sequence, sequences) => {
  const hasExisting = sequences.some((s) => {
    for (let i = 0; i < 6; i += 2) {
      if (s.substr(i, 2) === sequence.substr(i, 2)) return true;
    }
    return false;
  });

  return hasExisting;
};


export default class Generator {

  sequences = [];

  constructor( colors, length ) {
    this.colors = colors;
    this.length = length;
  }

  generateSequence() {
    let sequence = "";
    for (let i = 0; i < length; i++)
      sequence += this.colors[Math.floor(Math.random() * this.colors.length)];

    return sequence;
  }

  *generate() {
    while( true ) {
      const sequence = this.generateSequence();
      console.log( sequence )
      if( !isRedundant(sequence, this.sequences) ) {
        this.sequences.push( sequence );
        yield sequence;
      }      
    }
  }

  reset() {
    this.sequences = [];
  }
}
