const server = require('../server');
let counter = 0;

module.exports = () => {
  counter++;

  return {
    [`[${counter}] navigate to home page`]: function(client) {
      const URL = `http://${client.globals.apos_address}:${client.globals.apos_port}`;
      client.url(URL);
      client.waitForElementReady('body');
    }
  };
};
