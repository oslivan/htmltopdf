const puppeteer = require("puppeteer");

let browser;
async function browserInstance() {
  if (browser) return browser;

  const opts = {
    headless: true,
    defaultViewport: { width: 1920, height: 1080 }, // viewport 大小
    args: [
      `--window-size=1920,1080`,
      `--no-sandbox`,
      `--disable-setuid-sandbox`,
      // --auto-open-devtools-for-tabs 打开调试控制台
    ],
    timeout: 0,
  };

  // 这里不加 await 才能实现缓存，否则如果出现并发会导致创建两个浏览器实例
  browser = puppeteer.launch(opts)
  return browser;
}

module.exports.browserInstance = browserInstance;
