let counter = 0;

module.exports = () => {
  counter++;

  return {
    [`[${counter}] submit changes`]: function(client) {
      const submitBtnSelector = '[data-apos-workflow-submit]';
      const submittedLabelSelector = '[data-apos-workflow-submitted]';

      client.clickWhenReady(submitBtnSelector);
      client.waitForElementReady(submittedLabelSelector);
      // Allow page to save asynchronously first
      client.pause(250);
    }
  };
};
