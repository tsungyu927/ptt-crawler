const crawler = require('../index');

async function runCrawler() {
  // *** Initialize ***
  await crawler.init();

  // ***   Close   ***
  await crawler.close();
}

runCrawler();
