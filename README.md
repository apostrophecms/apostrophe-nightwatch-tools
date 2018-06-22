# apostrophe-nightwatch-tools

This module supplies Nightwatch custom commands and executable test steps which are useful when working with [apostrophecms](https://apostrophecms.org).

Without these tools it is very difficult to achieve truly stable Nightwatch tests for an Apostrophe site. With them, it's pretty easy.

These tools are used by the [apostrophe-enterprise-testbed](https://github.com/apostrophecms/apostrophe-enterprise-testbed) project, an Apostrophe testbed site that confirms new changes in the major Apostrophe modules have not caused any regressions. You can use them to create tests for your own site by using that project as a model.

Again, reviewing the code of that project is strongly recommended before proceeding.

## Standalone test steps

The steps in the `steps/` folder cover standalone tasks like logging in or committing modified content. These can be included in a Nightwatch test scenario.

## Commands

The commands in the `commands/` folder cover very frequent operations like clicking an element in a specific modal, after first waiting to ensure Apostrophe is not in a busy state and that modal is actually the current modal.

## `server.js`

`server.js` is a utility file that exports conveniences for creating an Apostrophe object that listens on the appropriate port, starting up Nightwatch with the chrome driver, and making sure that any previous Apostrophe objects bound to the same port are definitely gone before launching the next one for a new scenario.
