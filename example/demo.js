const crawler = require('../index');

(async () => {
  // *** Initialize ***
  await crawler.init();

  // *** Get Result ***
  await crawler.getList({
    pages: 3,
    board: 'Beauty',
  });

  // ***   Close   ***
  // await crawler.close();
})();
