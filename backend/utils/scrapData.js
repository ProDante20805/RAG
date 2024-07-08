import textract from 'textract';
import Crawler from 'js-crawler';

let final_texts = '';

/**
 * @function_name scrapeDatas
 * @return String
 * @description scrape text and hyperlink data and get all hyperlinks and get all text in there. finally return all text in a URL.
 */
export async function scrapeDatas(url) {
  let domain = new URL(url);
  domain = domain.hostname;
  return new Promise((resolve, reject) => {
    let crawler = new Crawler().configure({
      ignoreRelative: true,
      depth: 2,
      shouldCrawl: function (url) {
        return url.indexOf(domain) >= 0;
      },
    });
    crawler.crawl({
      url: url,
      success: async function (page) {
        if (
          page.url.includes(domain) == true &&
          page.url.includes('.jpg') == false &&
          page.url.includes('.png') == false &&
          page.url.includes('.zip') == false &&
          page.url.includes('.pdf') == false
        ) {
          console.log('passed:', page.url);
          final_texts += await getSingleText(page.url);
        }
      },
      failure: function (page) {
        console.log('Error occured:', page.url, 'status:', page.status);
      },
      finished: function (crawledUrls) {
        console.log('All crawling finished', final_texts, 'crawledURLs:', crawledUrls);
        resolve(final_texts);
      },
    });
  });
}

/**
 * @function_name getSingleText
 * @return String
 * @description return only text data from a URL.
 */

const getSingleText = async (url) => {
  return new Promise((resolve, reject) => {
    textract.fromUrl(url, { preserveLineBreaks: false }, (err, page) => {
      resolve(page);
    });
  });
};
