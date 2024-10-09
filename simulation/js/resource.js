import Record from "./record.js";
import { getName, transformName } from "./utils.js";

export default class Resource {
  name = "";
  isUsed = false;
  isExhausted = false;
  isDestroyed = false;
  transformCount = 0;

  constructor() {
    this.name = getName("resource");
    Record.increase("resources_created");
  }

  use() {
    this.isUsed = true;
  }

  exhaust() {
    this.isExhausted = true;
  }

  destroy() {
    this.isDestroyed = true;
    Record.increase("resources_destroyed");
  }

  cycle() {
    if( this.isExhausted )
      this.isExhausted = false;

    if( this.isUsed ) {
      this.isExhausted = true;
      this.isUsed = false;
    }
    
  }

  transform() {
    this.transformCount++;
    const newName = transformName(this.name, "resource");
    Record.log(`${this.name} is now ${newName}`);
    this.name = newName;

    Record.increase("resources_transformed");
  }

  get isAvailable() {
    return !(this.isExhausted || this.isDestroyed || this.isUsed);
  }
}
