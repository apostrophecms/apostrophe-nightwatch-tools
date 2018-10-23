exports.command = function waitForElementReady(selector) {  
  return this
  .waitForElementNotPresent('.apos-busy,.apos-global-busy')
  .waitForElementVisible(selector)
  // I have observed click still not being possible right away
  // even when busy is not present and selector is clearly visible. -Tom
  .pause(250);
};