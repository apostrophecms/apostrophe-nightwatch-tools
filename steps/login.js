let counter = 0;

module.exports = (username = 'admin', password = 'demo') => {
  counter++;

  return {
    [`[${counter}] login step`]: function(client) {
      const loginBtnSelector = '.demo-login-button a';
      const usernameInputSelector = '.apos-login-username input';
      const passInputSelector = '.apos-login-password input';
      const submitBtnSelector = '.apos-login-submit input';

      client.clickWhenReady(loginBtnSelector);
      client.waitForElementReady(usernameInputSelector);
      client.pause(250);
      client.setValue(usernameInputSelector, username);
      client.setValue(passInputSelector, password);
      client.clickWhenReady(submitBtnSelector);

      const loggedInPageSelector = 'body.apos-workflow-draft-page';

      client.expect.element(loggedInPageSelector).to.be.present;
    }
  };
};
