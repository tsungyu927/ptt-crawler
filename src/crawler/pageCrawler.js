function scrapingPrev() {
  const prevResult = document.querySelector('#action-bar-container > div > div.btn-group.btn-group-paging > a:nth-child(2)');
  return prevResult.href;
}

function scrapingPage(options) {
  // 判斷是否要命令上層func停止爬取
  let stopFetch = false;
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

  /**
   * 過濾 已刪除文章(author === '-') & 公告(mark !== '')，並整理成一個array
   * filter deleted and announcement articles, and clean up as an array
   *
   * 過濾 帥哥or正妹 (如果使用者有選擇的話)
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
    .filter((val) => {
      if (val.author === '-') {
        return false;
      }
      if (val.mark !== '') {
        return false;
      }
      if (options.onlyGirls && /\[帥哥\]/.test(val.title)) {
        return false;
      }
      if (options.onlyBoys && /\[正妹\]/.test(val.title)) {
        return false;
      }
      if (options.date && options.date !== val.date) {
        stopFetch = true;
        return false;
      }
      return true;
    });

  return {
    stopFetch,
    result,
  };
}

module.exports = {
  scrapingPrev,
  scrapingPage,
};
