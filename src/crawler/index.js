const puppeteer = require('puppeteer');
const { scrapingPrev, scrapingPage } = require('./pageCrawler');

const PTT_LINK = 'https://www.ptt.cc/bbs/Beauty/index.html';
const PTT_DOMAIN = 'https://www.ptt.cc/';

/*
* just the browser
*/
let browser;
/*
* just the page inside the browser
*/
let page;
const stopSelector = '#main-container > div.r-list-container.action-bar-margin.bbs-screen';

async function initialize() {
  browser = await puppeteer.launch({ headless: false });

  page = await browser.newPage();

  page.setRequestInterception(true);
  page.on('request', (request) => {
    if (['image', 'stylesheet', 'font', 'script'].indexOf(request.resourceType()) !== -1) {
      request.abort();
    } else {
      request.continue();
    }
  });
}

async function navigateToPage(targetPage) {
  await page.goto(targetPage);

  // press over18 button
  const over18Button = await page.$('.over18-button-container .btn-big');
  if (over18Button) {
    over18Button.click();
  }

  await page.waitForSelector(stopSelector);
}

async function getList(options) {
  const { pages, board } = options;
  const articles = [];
  try {
    // navigate to target page
    await navigateToPage(`https://www.ptt.cc/bbs/${board}/index.html`);

    // fetch first page
    articles.push(await page.evaluate(scrapingPage));

    for (let i = 1; i < pages; i += 1) {
      /* eslint-disable no-await-in-loop */

      // fetch rest pages the user want
      const prev = await page.evaluate(scrapingPrev);
      await navigateToPage(prev);
      articles.push(await page.evaluate(scrapingPage));
    }
    console.log(JSON.stringify(articles));
  } catch (err) {
    console.log(err);
    await browser.close();
  }
}

async function close() {
  if (browser) {
    await browser.close();
  }
}

module.exports = {
  init: initialize,
  getList,
  close,
};
