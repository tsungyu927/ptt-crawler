const puppeteer = require('puppeteer');

// const PRACTICE_LINK = 'https://learnwebcode.github.io/practice-requests/';
const PTT_LINK = 'https://www.ptt.cc/bbs/Beauty/index.html';

/*
* just the browser
*/
let browser;
/*
* just the page inside the browser
*/
let page;

async function initialize() {
  browser = await puppeteer.launch();

  page = await browser.newPage();

  page.setRequestInterception(true);
  page.on('request', (request) => {
    if (['image', 'stylesheet', 'font', 'script'].indexOf(request.resourceType()) !== -1) {
      request.abort();
    } else {
      request.continue();
    }
  });

  await page.goto(PTT_LINK);

  // set cookie to cross over the limit
  await page.setCookie({ name: 'over18', value: '1' });
}

async function close() {
  if (browser) {
    await browser.close();
  }
}

module.exports = {
  init: initialize,
  close,
};
