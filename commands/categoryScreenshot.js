// Take a screenshot and store it to screenshots/latest/filename.
// The word "latest" may be replaced by setting the environment
// variable VISUAL_CATEGORY.

exports.command = function categoryScreenshot(filename) {
  return this.saveScreenshot('screenshots/' + (process.env.VISUAL_CATEGORY || 'latest') + '/' + filename);
  selector = '[data-apos-modal-current="' + modal + '"] ' + selector;
  return this
    .waitForElementReady(selector)
    .click(selector);
};
