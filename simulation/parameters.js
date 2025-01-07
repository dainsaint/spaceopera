let parameters = {
  communities: 8,
  leaderPct: 0.5,
};

const Parameters = {
  set(name, value) {
    parameters[name] = value;
    this.save();
  },

  get(name) {
    return parameters[name];
  },

  glean() {
    document
      .querySelectorAll("input")
      .forEach((input) => (parameters[input.name] = input.value));
  },

  save() {
    localStorage.setItem("parameters", JSON.stringify(parameters));
  },

  load() {
    try {
      const loaded = localStorage.getItem("parameters");
      if (loaded) parameters = JSON.parse(loaded);

      for (var key in parameters) {
        const input = document.querySelector(`input[name="${key}"]`);
        if (input instanceof HTMLInputElement)
          input.value = parameters[key];
      }

      console.log("Loaded parameters from local storage:", parameters);
    } catch (e) {
      console.log("No save found, using default parameters.");
    }

    return false;
  }
}

export default Parameters;
