const puppeteer = require('puppeteer');

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

  await page.goto(PTT_LINK);

  // set cookie to cross over the limit
  // await page.setCookie({ name: 'over18', value: '1' });
  // press over18 button
  const over18Button = await page.$('.over18-button-container .btn-big');
  if (over18Button) {
    over18Button.click();
  }

  await page.waitForSelector(stopSelector);
}

function scrapingListPage() {
  /**
   * 抓取title & link
   * fetch the title & link
   */
  const titleSelectorAll = '#main-container > div.r-list-container.action-bar-margin.bbs-screen > div.r-ent > div.title';
  const titleResult = document.querySelectorAll(titleSelectorAll);
  const [titleArr, linkArr] = Array
    .from(titleResult)
    .reduce(([prevTitle, prevLink], val) => {
      const child = val.querySelector('a');
      prevTitle.push(child ? child.innerText.trim() : val.innerText.trim());
      prevLink.push(child ? child.href : '');

      return [prevTitle, prevLink];
    }, [[], []]);

  /**
   * 抓取作者
   * fetch the author
   */
  const authorSelectorAll = '#main-container > div.r-list-container.action-bar-margin.bbs-screen > div.r-ent > div.meta > div.author';
  const authorResult = document.querySelectorAll(authorSelectorAll);
  const authorArr = Array.from(authorResult).map((val) => val.innerText);

  /**
   * 抓取發文日期
   * fetch the post date
   */
  const dateSelectorAll = '#main-container > div.r-list-container.action-bar-margin.bbs-screen > div.r-ent > div.meta > div.date';
  const dateResult = document.querySelectorAll(dateSelectorAll);
  const dateArr = Array.from(dateResult).map((val) => val.innerText.trim());

  /**
   * 抓取mark
   * fetch the mark
   */
  const markSelectorAll = '#main-container > div.r-list-container.action-bar-margin.bbs-screen > div.r-ent > div.meta > div.mark';
  const markResult = document.querySelectorAll(markSelectorAll);
  const markArr = Array.from(markResult).map((val) => val.innerText);

  /**
   * 抓取按讚數
   * fetch the mark
   */
  const likeSelectorAll = '#main-container > div.r-list-container.action-bar-margin.bbs-screen > div.r-ent > div.nrec';
  const likeResult = document.querySelectorAll(likeSelectorAll);
  const likeArr = Array.from(likeResult).map((val) => val.innerText);

  const resultLength = [
    titleArr.length,
    authorArr.length,
    linkArr.length,
    dateArr.length,
    markArr.length,
    likeArr.length,
  ];
  /**
   * 過濾 已刪除文章(author === '-') & 公告(mark !== '')，並整理成一個array
   * filter deleted and announcement articles, and clean up as an array
   */
  const result = titleArr
    .map((_, index) => ({
      title: titleArr[index],
      author: authorArr[index],
      date: dateArr[index],
      link: linkArr[index],
      like: likeArr[index],
      mark: markArr[index],
    }))
    .filter((val) => val.author !== '-' && val.mark === '');

  return result;
}

async function getList(options) {
  try {
    const articles = await page.evaluate(scrapingListPage);
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
