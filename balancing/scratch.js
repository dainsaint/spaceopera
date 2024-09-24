const Voice ={
  Leader: "Leader",
  People: "People"
}

const Willpower = {
  Create: "Create",
  Revolt: "Revolt",
  Seize: "Seize"
}


class Player {
  community;
  willpower;

  agreeableness;

}

class Community  {

  resources = [];
  voice;

}


class Society {

  name;
  players;


  constructor() {
    
  }


}

const com = new Community();
console.log( com.resources );