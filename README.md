# apostrophe-nightwatch-tools

This module supplies Nightwatch custom commands and executable test steps which are useful when working with [apostrophecms](https://apostrophecms.org).

Without these tools it is very difficult to achieve truly stable Nightwatch tests for an Apostrophe site. With them, it's pretty easy.

These tools are used by the [apostrophe-enterprise-testbed](https://github.com/apostrophecms/apostrophe-enterprise-testbed) project, an Apostrophe testbed site that confirms new changes in the major Apostrophe modules have not caused any regressions. You can use them to create tests for your own site by using that project as a model.

Again, reviewing the code of that project is strongly recommended before proceeding.

## Installation

These instructions assume you have created nightwatch tests in the past, and that your project already depends on nightwatch. For a complete, working example see the [apostrophe-enterprise-testbed](https://github.com/apostrophecms/apostrophe-enterprise-testbed) project.

Install the module:

```
npm install --dev apostrophe-nightwatch-tools
```

Now, in your `nightwatch.js` configuration file, set `custom_commands_path` to an array containing the `commands` folder of this module, plus any custom command folders of your own:

```javascript
  custom_commands_path: [   
    "node_modules/apostrophe-nightwatch-tools/commands",
    "tests/commands"
  ],
```

Then structure your actual test scenario `.js` files like this. Note the use of `require` to bring in files that live in a subdirectory of the module.

```javascript
// tests/scenarios/article.spec.js

const server = require('apostrophe-nightwatch-tools/server');
const steps = require('apostrophe-nightwatch-tools/steps');

module.exports = Object.assign(
  {
    before: (client, done) => {
      console.log(process.argv);
      console.log('IN START');
      client.resizeWindow(1200, 800);
      if (!this._server) {
        this._server = server.create('localhost', 3111);
        this._server.start(done);
      }
    },
    after: (client, done) => {
      console.log('IN AFTER');
      client.end(() => {
        console.log('STOPPING FROM AFTER');
        this._server.stop(done);
      });
    },
  },
  // Execute various steps found in the module
  steps.main(),
  steps.login(),
  steps.switchLocale('en'),
  steps.switchToDraftMode(),
  steps.createArticle('New Article Title'),
  // Execute a custom step
  {
    'submit the article, via the "Workflow" menu in the dialog box': (client) => {
      const manageTableRowSelector = 'table[data-items] tr[data-piece]:first-child';
      const editArticleBtnSelector = `${manageTableRowSelector} .apos-manage-apostrophe-blog-title a`;
      const workflowModalBtnSelector =
        `[data-apos-dropdown-name="workflow"]`;
      const submitWorkflowBtnSelector = `[data-apos-workflow-submit]`;

      // Wait until a modal of the specified type is
      // the current modal, then click the button to edit the first article
      client.clickInModal('apostrophe-blog-manager-modal', editArticleBtnSelector);
      client.clickInModal('apostrophe-blog-editor-modal', workflowModalBtnSelector);
      client.clickInModal('apostrophe-blog-editor-modal', submitWorkflowBtnSelector);
      // Wait until a modal of the specified type is the current modal
      client.waitForModal('apostrophe-blog-manager-modal');
    }
  }
);
```

## Commands

The commands in the `commands/` folder cover very frequent operations like clicking an element in a specific modal, after first waiting to ensure Apostrophe is not in a busy state and that modal is actually the current modal. Here is a reference guide:

### waitForModal

`waitForModal('apostrophe-blog-editor-modal')` will wait until a modal of that type (a blog article editor modal) is the current modal. For pieces, the type name you are looking for is usually the `name` option of your pieces module, followed by `-editor-modal` (editing one), `-manager-modal` (managing many), or `-widget-editor` (editing the widget corresponding to that piece type). You can inspect the browser to discover the right type name; it will be in the `data-apos-modal-current` attribute.

This command also waits until Apostrophe is not busy, i.e. `.apos-global-busy` and `.apos-busy` do not appear in the DOM. This prevents tests from failing due to a variable amount of time spent carrying out an action.

### clickInModal

`clickInModal('apostrophe-blog-editor-modal', '[data-apos-save])` will wait until a modal of that type (a blog article editor modal) is the current modal, then click the save button. See `waitForModal` for details on the modal type name. The selector can be any CSS selector. Note that CSS does not include all jQuery selectors, for instance `:first` is not valid CSS, only valid jQuery.

This command also waits until Apostrophe is not busy, i.e. `.apos-global-busy` and `.apos-busy` do not appear in the DOM. This prevents tests from failing due to a variable amount of time spent carrying out an action.

### clickWhenReady

`clickWhenReady('.my-custom-button')` will click on the matching element after first ensuring that it is ready (it is visible and Apostrophe is not in a busy state).

### waitForElementReady

`waitForElementReady('.my-custom-button')` will wait until the specified element is ready (it is visible and Apostrophe is not in a busy state).

### openAdminBarItem

`openAdminBarItem('apostrophe-blog')` will trigger the admin bar button for the `apostrophe-blog` module, opening the "manage" modal for that type of content. This method can open both grouped and ungrouped admin bar items.

### resetValueInModal

`resetValueInModal('apostrophe-blog-editor-modal', '[name="title"]', 'New Title')` will wait until the appropriate modal is active (see `waitForModal`), select the title field within that context, and **replace** its current text with `New Title`.

### waitForNoModals

`waitForNoModals()` will wait until no Apostrophe modals are active. It is appropriate when returning to the page context after working with modals in your tests.

### categoryScreenshot

`categoryScreenshot('article.png')` will take a screenshot and store it to `screenshots/latest/article.png`, relative to the current working directory. The word "latest" may be replaced by setting the environment variable VISUAL_CATEGORY. Creates missing folders if needed. Used by the `apostrophe-enterprise-testbed` project to set up `previous` with snapshots based on the latest npm releases, and `latest` with snapshots of the latest git masters.

## Standalone test steps

The steps in the `steps/` folder cover standalone tasks like logging in or committing modified content. These can be included in a Nightwatch test scenario as shown above.

These steps include appropriate assertions and will fail if they do not carry out the expected action successfully.

### addTextWidgetTo

`steps.addTextWidgetTo({selector: '.footer', text: 'Rich Text Widget line global'})` will add a rich text widget to the first area located inside the first element matching the given selector. The rich text widget will have the HTML text specified by `text`.

### changePageTypeTo

`steps.changePageTypeTo(type)` will open the page settings modal, change the page type to the specified type, and save page settings.

### checkNotification

`steps.checkNotification('message')` will check for a notification div containing exactly the specified text.

### checkSubmitted

`steps.checkSubmitted([ 'Title 1', 'Title 2' ])` will open the workflow modal and verify that all of the specified titles have been submitted via the "Submit" button.

### commit

`steps.commit()` will click the commit button on the page, commit one document, and skip exporting it. `steps.commit(2)` will commit two documents. The step will fail if this does not return the browser to a state with no modals (the commit sequence is finished).

### commitAndExport

See `steps.commit()` above. However this method also exports the content to all locales by clicking the checkbox for the locale with the name attribute `master`. There must be a locale with the name `master` for this to work.

### confirm200ByRelativeUrl

`steps.confirm200ByRelativeUrl('/test')` will fetch the given URL, relative to the active page, and succeed only if the status code is 200. This does not navigate the browser away from the current page. The active session and cookies are **not** included. For advanced cases, fully navigate the test browser.

### confirm404ByRelativeUrl

`steps.confirm4094ByRelativeUrl('/test')` will fetch the given URL, relative to the active page, and succeed only if the status code is 404. This does not navigate the browser away from the current page. The active session and cookies are **not** included. For advanced cases, fully navigate the test browser.

### createArticle

`steps.createArticle('My Article')` creates a new blog post (`apostrophe-blog`) with the given title. The article is published, with a publication date of today, but is not committed or exported at this stage. **At the end of the step, the "manage blog posts" modal is still open.**

### login

`steps.login()` attempts to log in with the username `admin` and the password `demo`.

### main

`steps.main()` navigates to the home page and verifies it has done so. It is frequently the first step. **This step will fail if the home page does not have the `home-page` body class,** however see also `navigateToHome`.

### makeIncognitoRequestByRelativeUrl

An example is easiest for this step:

```javascript
steps.makeIncognitoRequestByRelativeUrl('/', (client, $) => {
    const richTextSelector = '.demo-main [data-rich-text]';

    client.assert.equal($(richTextSelector).length, 0);
  })
```

This step fetches the specified URL, without the session and cookies of the current user, and returns a `cheerio` object (a `jQuery`-like object) which can be used to check the contents of the reply. The test browser does not navigate to a new location. If you need more complete access to the logged-out experience, you should actually log the test user out.

### makeSubPage

`steps.makeSubPage('Regression test')` creates a page with the specified `title` and the type `default`, using the context menu and the page settings modal. Note that this constitutes a good test of the basic operation of that modal.

### navigateToHome

`steps.navigateToHome()` navigates to the homepage. Unlike `main()` it does not look for a `home-page` body class.

### navigateToRelativeUrl

`steps.navigateToRelativeUrl('/')` navigates to the given URL and pauses until the browser is ready.

### navigateToRelativeUrlAndconfirm200

`steps.navigateToRelativeURlAndconfirm200('/')` navigates to the given URL and confirms a `200` status code. There is no pause.

### navigateToRelativeUrlAndconfirm404

`steps.navigateToRelativeURlAndconfirm200('/')` navigates to the given URL and confirms a `404` status code. There is no pause.

### openContextMenu

`steps.openContextMenu('Page Settings')` opens the context menu (the one in the lower left corner), clicks a button with the specified text in its label, and waits for a modal to open.

### submitChanges

`steps.submitChanges()` clicks the `Submit` button on the page, waits for the notification to appear and disappear, and then waits for the label to change to `Submitted`.

### switchLocale

`steps.switchLocale('es')` switches to the specified locale.

### switchToDraftMode

`steps.switchToDraftMode()` switches to draft mode.

### switchToLiveMode

`steps.switchToLiveMode()` switches to draft mode.

### workflowCommitArticle

**Assumes that the apostrophe-blog manager modal is already open.** `steps.workflowCommitArticle()` commits the first article listed in the apostrophe-blog manager modal. The article is not exported.

### workflowSubmitArticle

**Assumes that the apostrophe-blog manager modal is already open.** `steps.workflowSubmitArticle()` submits the first article listed in the apostrophe-blog manager modal, via the workflow dropdown in the blog article editor modal.

## `server.js`

`server.js` is a utility file that exports conveniences for creating an Apostrophe object that listens on the appropriate port, starting up Nightwatch with the chrome driver, and making sure that any previous Apostrophe objects bound to the same port are definitely gone before launching the next one for a new scenario. Its use is entirely optional. See the example above, as well as the [apostrophe-enterprise-testbed](https://github.com/apostrophecms/apostrophe-enterprise-testbed) project, for a good guide to its use.

## Changelog

2.0.7: do not print unnecessary echo of server output.

2.0.6: return result of synchronous `task` method.

2.0.5: more race condition elimination relating to the admin bar.

2.0.4: fixed issue where the `switchLocales` task failed since the introduction of `button` tags for the locale switcher in the context area. Chose to use the one in the admin bar, but launch it properly.

2.0.3: added missing dependencies to `package.json`. Removed `node_modules` from git.

2.0.2: introduced `categoryScreenshot` command.
