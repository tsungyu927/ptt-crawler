const crawler = require('../index');
const saver = require('../src/saver');

(async () => {
  // *** Initialize ***
  await crawler.init();

  // *** Get Result ***
  const lists = await crawler.getList({
    pages: 1,
    board: 'Beauty',
    // getSpecificDate: 'today',
    onlyGirls: true, // only for Beauty board
    onlyBoys: false, // only for Beauty board
  });

  // *** Get Content ***
  const listWithContent = await crawler.getContent(lists, {
    getComment: false,
    getPicture: true,
  });

  console.log(listWithContent);

  // *** Save to Google Sheet ***
  await saver.addToGoogleSheet(listWithContent);

  // ***   Close   ***
  await crawler.close();
})();
