import Record from "./record.js";
import Resource from "./resource.js";
import { getName, range } from "./utils.js";

export default class Community {
  resources = [];

  state = {
    gained: 0,
    destroyed: 0,
    total: 0,
    endangered: false,
  };

  constructor() {
    this.name = getName("community");
  }

  initResources() {
    const numResources = range(1, 2);
    for (let i = 0; i < numResources; i++) {
      const resource = new Resource();
      this.resources.push(resource);
    }
  }

  addResource(resource) {
    this.resources.push(resource);
    this.state.gained++;
  }

  update() {
    const resourcesDestroyed = this.resources.filter(
      (resource) => resource.isDestroyed
    );

    this.resources = this.resources.filter((resource) => !resource.isDestroyed);

    this.state.destroyed = resourcesDestroyed.length;
    this.state.total = this.resources.length;
    this.state.endangered = this.resources.length == 0;

    return this.state;
  }

  get intactResources() {
    return this.resources.filter((x) => !x.isDestroyed);
  }

  get availableResources() {
    return this.resources.filter((x) => x.isAvailable);
  }

  get isEndangered() {
    return this.resources.length == 0;
  }
}


