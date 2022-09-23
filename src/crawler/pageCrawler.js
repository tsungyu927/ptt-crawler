function scrapingPrev() {
  const prevResult = document.querySelector('#action-bar-container > div > div.btn-group.btn-group-paging > a:nth-child(2)');
  return prevResult.href;
}

function scrapingPage() {
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

module.exports = {
  scrapingPrev,
  scrapingPage,
};
