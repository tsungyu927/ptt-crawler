const puppeteer = require('puppeteer');
const { scrapingPrev, scrapingPage } = require('./pageCrawler');
const { scrapingContent } = require('./articleCrawler');

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

/* eslint-disable no-await-in-loop */

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

async function close() {
  if (browser) {
    await browser.close();
  }
}

async function navigateToPage(targetPage, wait = true) {
  await page.goto(targetPage);

  // press over18 button
  const over18Button = await page.$('.over18-button-container .btn-big');
  if (over18Button) {
    over18Button.click();
  }

  if (wait) {
    await page.waitForSelector(stopSelector);
  }
}

async function getList(options) {
  const {
    pages = 1,
    board = 'Beauty',
    onlyGirls = false,
    onlyBoys = false,
  } = options;

  const articles = [];

  try {
    // navigate to target page
    await navigateToPage(`https://www.ptt.cc/bbs/${board}/index.html`);

    // fetch first page
    articles.push(...await page.evaluate(scrapingPage, { onlyGirls, onlyBoys }));

    for (let i = 1; i < pages; i += 1) {
      // fetch rest pages the user want
      const prev = await page.evaluate(scrapingPrev);
      await navigateToPage(prev);
      articles.push(...await page.evaluate(scrapingPage, { onlyGirls, onlyBoys }));
    }
  } catch (err) {
    console.log(err);
    close();
  }

  return articles;
}

async function getContent(lists, options) {
  const listWithContent = [];

  try {
    for (let i = 0; i < lists.length; i += 1) {
      await navigateToPage(lists[i].link, false);
      const content = await page.evaluate(scrapingContent, options);
      listWithContent.push({
        ...lists[i],
        ...content,
      });
    }
  } catch (err) {
    console.log(err);
    close();
  }

  return listWithContent;
}

module.exports = {
  init: initialize,
  getList,
  getContent,
  close,
};
