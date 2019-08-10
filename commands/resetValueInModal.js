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

  // clearValue appears broken for select elements in nightwatch 1.x,
  // and setValue is really appendValue, so we need to take matters
  // into our own hands

  this.executeAsync(function(selector, value, done) {
    let tries = 0;
    return attempt();
    
    function attempt() { 
      $el = $(selector);
      if (!$el[0]) {
        return retry();
      }
      var $group = $el.closest('[data-apos-group]');
      var group = $group.attr('data-apos-group');
      var $modal = $el.closest('[data-modal]');
      var $tab = $modal.find('[data-apos-open-group="' + group + '"]');
      $tab.click();
      if (!$el.is(':visible')) {
        return retry();
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
      return done($('<div></div>').append($el.clone()).html() + ': ' + selector + ',' + value + ':' + $el.val() + ':' + values.join(','));
    }
    function retry() {
      tries++;
      if (tries === 10) {
        throw new Error('Failed in resetValueInModal for ' + selector + ':' + value);
      }
      return setTimeout(attempt, 200);
    }
  }, [ selector, value ], function(result) {
    // console.log('****', result);
  });
};
