let counter = 0;

module.exports = ({selector, text} = {}) => {
  if (!selector) {
    throw new Error('"selector" is required parameter');
  }

  counter++;

  return {
    [`[${counter}] add text widget "${text}" to the "${selector}" block`]: function(client) {
      const blackoutSelector = '.apos-modal-blackout';
      const richTextSelector = `${selector} [data-rich-text]`;
      const addContentBtnSelector = `${selector} [data-apos-add-content]`;
      const richTextBtnSelector = `${selector} [data-apos-add-item=apostrophe-rich-text]`;

      client.waitForElementNotPresent(blackoutSelector);
      client.getLocationInView(selector);
      client.waitForElementReady(addContentBtnSelector);
      client.clickWhenReady(addContentBtnSelector);
      client.waitForElementReady(richTextBtnSelector);
      // TODO kill the pauses, probably by enhancing the
      // execute call below to wait for whatever is required
      // and then set an attribute we can wait on
      client.pause(500);
      client.clickWhenReady(richTextBtnSelector);
      client.pause(2000);
      client.execute(function (content, selector) {
          // Pick out the CKEditor instance we actually
          // care about, avoiding updating all of them
          const id = $(selector).attr('id');
          const chosenCkeditor = _.pick(CKEDITOR.instances, id);
          const ckeditorInstance = _.find(chosenCkeditor);

          ckeditorInstance.setData(content);
        },
        [text, richTextSelector]
      );

      client.expect.element(richTextSelector).text.to.contain(text);
    }
  };
};
