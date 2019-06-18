let counter = 0;

module.exports = ({selector, value} = {}) => {
  if (!selector) {
    throw new Error('"selector" is required parameter');
  }

  counter++;

  return {
    [`[${counter}] update widget to ${value} persona`]: function(client) {
      const personaSelect = `${selector} .apos-area-widget-controls .apos-button[name=personas]`;
      const personaValue = `${personaSelect} option[value=${value}]`;
      client.pause(500);
      client.moveToElement(personaSelect, 0, 0);
      client.clickWhenReady(personaSelect);
      client.clickWhenReady(personaValue);
      client.pause(500);
      client.expect.element(personaSelect).value.to.equal(value);
    }
  };
};
