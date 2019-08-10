// Reset a value in a modal once it becomes available, replacing
// any previous value.
//
// `modal` is the moog type name, i.e. apostrophe-groups-manager-modal,
// apostrophe-users-editor-modal, etc.
//
// This method will wait until the current active modal is of the specified
// type and the element is visible within it, with the default timeout.
//
// `selector` should not and cannot try to detect the modal itself, it is
// a sub-selector within the modal.

exports.command = function resetValueInModal(modal, selector, value) {
  selector = '[data-apos-modal-current="' + modal + '"] ' + selector;
  this.waitForElementVisible(selector);
  console.log('<<<< selector, value coming in:', selector, value);
  // clearValue appears broken for select elements in nightwatch 1.x,
  // and setValue is really appendValue, so we need to take matters
  // into our own hands
  this.execute(function(selector, value) {
    $el = $(selector);
    if (!$el.is(':visible')) {
      var group = $el.closest('[data-apos-group]').attr('data-apos-group');
      $el.closest('[data-modal]').find('[data-apos-open-group="' + group + '"]').click();
    }
    if (!$el[0]) {
      throw new error('Unable to find selector ' + selector + ' in resetValueInModal, value would have been ' + value);
    }
    var values = [];
    $el.find('option').each(function() {
      values.push($(this).text());
    });
    if ($el.is('select')) {
      // Called with label, not value
      value = $el.find('option').filter(function() {
        return $(this).text().trim() == value.toString().trim();
      }).attr('value');
    }
    $el.val(value);
    $el.trigger('change');
    $el.trigger('textchange');
    return $('<div></div>').append($el.clone()).html() + ': ' + selector + ',' + value + ':' + $el.val() + ':' + values.join(',');
  }, [ selector, value ], function(result) {
    console.log('****', result);
  });
};
