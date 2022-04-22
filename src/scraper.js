const puppeteer = require('puppeteer');
const chalk = require('chalk');

(async (url) =>  {
  const browser = await puppeteer.launch({headless : false});
  const page = await browser.newPage();
  await page.goto(url);
  
  const result = await page.evaluate(() => {
    const $box = document.querySelectorAll('.box.product');
    let link,
    img,
    product,
    price;
    data = [];

    [...$box].forEach(item => {
      try {
        // Link to Product
        link = `https://wearetvc.com${item.querySelector('a').getAttribute('href')}`;
        // Array of image urls
        img = item.querySelector('.product_card__image-wrapper').getAttribute('data-bgset').trim().split(" ");
        img = img.filter(item => item.indexOf('//') === 0)
        // Product name
        product = item.querySelector('.product-title a').innerText
        // Price of product 
        price = item.querySelector('.money').innerText
        // Store all relevant information within data
        data.push({product,price,img,link})
      } catch(e) {
        console.log(e);
      }
      
    })
    // const $links = document.querySelectorAll('.box.product a')
    // const $imgs = document.querySelectorAll('.product_card__image-wrapper');
    // const $product = document.querySelectorAll('.product-title a')
    // const $price = document.querySelectorAll('.price span')

    // const resultLinks = [...$links].map(h => `https://wearetvc.com${h.getAttribute('href')}`);
    // const resultImgs = [...$imgs].map(item => item.getAttribute('data-bgset'));
    // const resultProduct = [...$product].map(item => item.innerText);
    // const resultPrice = [...$price].map(item => item.innerText)
    // return resultPrice;
    return data;
  })

  console.log(result);

  
  await browser.close();
})('https://wearetvc.com/collections/all');