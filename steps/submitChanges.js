let counter = 0;

module.exports = () => {
  counter++;

  return {
    [`[${counter}] submit changes`]: function(client) {
      const submitBtnSelector = '[data-apos-workflow-submit]';
      const submittedLabelSelector = '[data-apos-workflow-submitted]';
      // Allow page to save asynchronously first
      client.pause(500);
      client.clickWhenReady(submitBtnSelector);
      client.waitForElementReady(submittedLabelSelector);
    }
  };
};
