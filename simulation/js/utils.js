import names from "./names.js";

const getName = (type) => {
  const words = names[type];
  return words
    ? words
        .map((list) => list.at(Math.floor(Math.random() * list.length)))
        .join(" ")
    : "Default";
};

const transformName = (name, type) => {
  const names = name.split(' ');
  let newName = "";
  do {
    newName = getName(type);
  } while (!names.some((x) => newName.includes(x))); 

  return newName;
}

const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const printNames = (array) => {
  const names = array.map((x) => x.name);
  if (names.length > 1)
    names[names.length - 1] = "and " + names[names.length - 1];

  return names.length == 2 ? names.join(" ") : names.join(", ");
};

const range = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const mapValue = (value, fromMin, fromMax, toMin, toMax) => {
  const t = (value - fromMin) / (fromMax - fromMin)
  const v = t * (toMax - toMin) + toMin;
  return v;
}

export {
  getName,
  transformName,
  shuffle,
  printNames,
  range,
  mapValue
}