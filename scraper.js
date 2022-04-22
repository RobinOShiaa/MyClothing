const puppeteer = require('puppeteer');

(async (url) =>  {
  const browser = await puppeteer.launch({headless : false});
  const page = await browser.newPage();
  await page.goto(url);
  
  const result = await page.evaluate(() => {
    const box = document.querySelectorAll('.title')
    const b = [...box];
    return b.map(h => h.textContent);
  })

  console.log(result)

  await browser.close();
})('https://wearetvc.com/collections/all');