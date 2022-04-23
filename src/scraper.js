import puppeteer from "puppeteer"
import {Apparel} from './apparel'

class TvcVintage {
  constructor() {
    this.url = 'https://wearetvc.com/collections/all'
  }

  async getPages () {
    const browser = await puppeteer.launch({headless : false});
    const page = await browser.newPage();
    await page.goto(this.url);
    const result = await page.evaluate(() => {
      let links = [];
      const $categories = document.querySelectorAll('[data-group=product] a');
      [...$categories].forEach((link => links.push([link.getAttribute('href'),link.innerText])))
      return links
    })
    console.log(result)
  }

   async scrapePage () {
    const browser = await puppeteer.launch({headless : false});
    const page = await browser.newPage();
    await page.goto(this.url);
    
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
      return data;
    })
  
    console.log(result);
  
    
    await browser.close();
  };
  
}

// nextButton = [title=layout.pagination.next_html]
