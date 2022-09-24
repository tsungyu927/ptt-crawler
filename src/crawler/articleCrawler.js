function scrapingContent(options) {
  const { getComment = false, getPicture = true } = options;
  const el = document.querySelector('#main-content');
  let child = el.firstChild;

  // each arr
  const linkArr = []; // include links and images
  const imgArr = []; // only images

  while (child) {
    if (child.tagName === 'A') {
      // fetch content link
      linkArr.push(child.innerText);

      if (/\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(child.innerText) && getPicture) {
        // fetch images if 【getPicture】is true
        imgArr.push(child.innerText);
      }
    }

    child = child.nextSibling;
  }

  return {
    contentLinks: linkArr,
    contentImages: imgArr,
  };
}

module.exports = {
  scrapingContent,
};
