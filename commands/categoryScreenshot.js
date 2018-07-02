// Take a screenshot and store it to screenshots/latest/filename.
// The word "latest" may be replaced by setting the environment
// variable VISUAL_CATEGORY. Assumes current working directory
// is a reasonable parent for `screenshots`, and makes a subdir
// for `latest` within that.

exports.command = function categoryScreenshot(filename) {
  const fs = require('fs');
  const category = (process.env.VISUAL_CATEGORY || 'latest');
  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
  }
  if (!fs.existsSync('screenshots/' + category)) {
    fs.mkdirSync('screenshots/' + category);
  }
  return this.saveScreenshot('screenshots/' + category + '/' + filename);
};
