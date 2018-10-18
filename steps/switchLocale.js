let counter = 0;

module.exports = (locale, doExport) => {
  counter++;

  return {
    [`[${counter}] switch locale to "${locale}"`]: function(client) {
      const localeSwitcherBtnSelector = '[data-apos-admin-bar-item=apostrophe-workflow-locale-picker-modal]';
      client.openAdminBarItem('apostrophe-workflow-locale-picker-modal');
      const requiredLocaleBtnSelector = `[data-apos-locale=${locale}]`;
      client.waitForElementReady(requiredLocaleBtnSelector);
      client.clickWhenReady(requiredLocaleBtnSelector);

      // sometimes we need to export the article before we can switch locale
      if (doExport) {
        client.waitForElementReady('[data-apos-save]');
        client.clickWhenReady('[data-apos-save]');
      } else {
        const labelSelector = `${localeSwitcherBtnSelector} .apos-button-label`;
        client.expect.element(labelSelector).text.to.contain(locale).before(60000);
        client.assert.urlContains(locale);
      }
    }
  };
};
