let counter = 0;

function castTwoDigits(val) {
  return ('0' + val).slice(-2);
}

module.exports = (articleName) => {
  counter++;

  return {
    [`[${counter}] create an article`]: function(client) {
      const blackoutSelector = '.apos-modal-blackout:first-child';
      const articleSelector = '[data-apos-admin-bar-item="apostrophe-blog"]';
      const addArticleBtnSelector = '[data-apos-create-apostrophe-blog]';
      const basicsTabSelector = '[data-apos-open-group=basic]';
      const inputTitleSelector = '.apos-field-title input';
      const selectPublishedSelector = '.apos-field-published select';
      const inputPublicationDateSelector = '.apos-field-date input';
      const metaTabSelector = '[data-apos-open-group=meta]';
      const saveBtnSelector = '[data-apos-save]';
      const manageTableRowSelector = '.apos-manage-table tr[data-piece]';

      client.openAdminBarItem('apostrophe-blog');
      client.clickInModal('apostrophe-blog-manager-modal', addArticleBtnSelector);
      client.clickInModal('apostrophe-blog-editor-modal', basicsTabSelector);
      client.resetValueInModal('apostrophe-blog-editor-modal', inputTitleSelector, articleName);
      client.clickInModal('apostrophe-blog-editor-modal', metaTabSelector);
      client.resetValueInModal('apostrophe-blog-editor-modal', selectPublishedSelector, 'Yes');

      const currentDate = new Date();
      const day = castTwoDigits(currentDate.getDate());
      const month = castTwoDigits(currentDate.getMonth()+1);
      const year = currentDate.getFullYear();
      const publicationDate = `${year}-${month}-${day}`;

      client.resetValueInModal('apostrophe-blog-editor-modal', inputPublicationDateSelector, publicationDate);
      client.clickInModal('apostrophe-blog-editor-modal', saveBtnSelector);
      client.clickInModal('apostrophe-blog-manager-modal', '[data-apos-cancel]');
      client.waitForNoModals();
      client.openAdminBarItem('apostrophe-blog');
      client.waitForElementReady(manageTableRowSelector);
      client.expect.element(manageTableRowSelector).text.to.contain(articleName);
      client.expect.element(manageTableRowSelector).text.to.contain('Published');
      client.expect.element(manageTableRowSelector).text.to.contain(publicationDate);
      client.screenshot();
    }
  };
};
