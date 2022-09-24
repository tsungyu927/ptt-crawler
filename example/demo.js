const crawler = require('../index');

(async () => {
  // *** Initialize ***
  await crawler.init();

  // *** Get Result ***
  const lists = await crawler.getList({
    pages: 1,
    board: 'Beauty',
    onlyGirls: true,
  });

  // *** Get Content ***
  const listWithContent = await crawler.getContent(lists, {
    getComment: false,
    getPicture: true,
  });

  console.log(listWithContent);

  // ***   Close   ***
  // await crawler.close();
})();
