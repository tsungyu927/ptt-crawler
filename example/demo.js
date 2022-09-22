const crawler = require('../index');

async function runCrawler() {
  // *** Initialize ***
  await crawler.init();

  // *** Get Result ***
  await crawler.getList();

  // ***   Close   ***
  // await crawler.close();
}

runCrawler();
