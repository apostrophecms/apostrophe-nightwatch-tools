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
      const richTextBtnSelector = `${selector} [data-apos-add-item="apostrophe-rich-text"]`;

      client.waitForElementNotPresent(blackoutSelector);
      client.getLocationInView(selector);
      // Do all the clicking in jQuery land. These menus and buttons are
      // positioned and overlapped in complex ways, so it is not possible
      // to test them reliably with Nightwatch's standards of what is
      // visible and what is clickable
      client.executeAsync(function (addContentBtnSelector, richTextBtnSelector, content, selector, done) {
        setTimeout(clickAddContent, 1000);
        function clickAddContent() {
          $(addContentBtnSelector).trigger('click');
          setTimeout(clickAddRich, 1000);
        }
        function clickAddRich() {
          $(richTextBtnSelector).trigger('click');
          setTimeout(edit, 1000);
        }
        function edit() {
          // Pick out the CKEditor instance we actually
          // care about, avoiding updating all of them
          const id = $(selector).attr('id');
          const chosenCkeditor = _.pick(CKEDITOR.instances, id);
          const ckeditorInstance = _.find(chosenCkeditor);

          ckeditorInstance.setData(content);
          done();
        }
      }, [addContentBtnSelector, richTextBtnSelector, text, richTextSelector]);

      client.expect.element(richTextSelector).text.to.contain(text);
    }
  };
};
