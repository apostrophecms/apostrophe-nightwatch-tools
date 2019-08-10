exports.command = function openAdminBarItem(name) {  

  // Due to animations etc. it may take a moment before a click on
  // the admin bar succeeds in opening it

  return this.waitForNoModals()
    .execute(function() {
      $('body').attr('opening-admin-bar-item', "1");
    })
    .waitForElementPresent('body[opening-admin-bar-item="1"]')
    .execute(function(name) {
      $('body').attr('opening-admin-bar-item', "1");
      function attempt() {
        console.log('in attempt');
        if ($(".apos-admin-bar.apos-active").length === 0) {
          $("[data-apos-actionable=data-apos-admin-bar]").click();
          return dropdownAttempt();
        } else {
          dropdownAttempt();
        }
      }
      attempt();
      function dropdownAttempt() {
        console.log('in dropdownAttempt');
        // Might be grouped in a dropdown, if it is toggle that dropdown once its
        // trigger button is visible
        var $target = $('.apos-admin-bar [data-apos-admin-bar-item="' + name + '"]');
        console.log('target length is ' + $target.length);
        var $dropdown = $target.closest('[data-apos-dropdown]');
        if (!$dropdown.length) {
          console.log('I believe there is no dropdown');
          $('body').attr('opening-admin-bar-item', "0");
          return;
        }
        var $trigger = $dropdown.find('.apos-admin-bar-item-inner:visible');
        if ($trigger.length) {
          console.log('clicking trigger');
          $trigger.click();
          $('body').attr('opening-admin-bar-item', "0");
          return;
        } else {
          console.log('no visible trigger in:', $dropdown[0]);
        }
        setTimeout(dropdownAttempt, 50);
      }
    }, [ name ]).waitForElementNotPresent('body[opening-admin-bar-item="1"]').pause(500).clickWhenReady('.apos-admin-bar [data-apos-admin-bar-item="' + name + '"]');
};
