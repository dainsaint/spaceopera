const GUN = require('gun');
const server = require('http').createServer().listen(8765);
const gun = GUN({web: server});
console.log("Starting gun...")

gun.get('jbez').put({
  name: "cool name",
  email: "mark@gun.eco",
});

gun.get('jbez').on((data, key) => {
  console.log("realtime updates:", data);
});

// setInterval(() => { gun.get('jbez').get('live').put(Math.random()) }, 9);
