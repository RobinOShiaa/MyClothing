const puppeteer = require("puppeteer");
// import './db/mongoose';
const {insertToDb} = require('./db/mongo')
const fs = require('fs');


class TvcVintage {
  constructor() {
    this.url = 'https://wearetvc.com/collections/all'
    this.pages;
    this.data = [];
  }
  // async Constructor for starting the browser once initializing an instance of TvcVintage()
  async intitialize() {
    this.browser = await puppeteer.launch({headless : false});
    this.page = await this.browser.newPage();
    await this.page.goto(this.url);
  }

  async checkForNextButton () {
    const value = await this.page.evaluate(() => {
      try {
        const nextUrl = document.querySelector('[title="layout.pagination.next_html"]').getAttribute('href');
        return [`https://wearetvc.com${nextUrl}`,true]
      } catch (e) {
        if (e instanceof TypeError) {
          return ['',false];
        }
        throw new Error(`${e.message}`)
      }
    })
    return value;
  }

  async iiterate () {
      for (const page of this.pages) {
        await this.page.goto(page);
        const category = await this.page.evaluate(() => {
          return 
        });
        console.log();
        await this.scrapePage();   
      }  
      return this.data; 
  }

  async getPages () {
    const result = await this.page.evaluate(() => {
      let links = [];
      const $categories = document.querySelectorAll('.nav-container [data-category="product"] a');
      console.log([...$categories]);
      [...$categories].forEach(link => links.push(`https://wearetvc.com${link.getAttribute('href')}`))
      return links
    })
    this.pages = Array.from(new Set(result));
    return this.pages;
  }

   async scrapePage () {
    const result = await this.page.evaluate(() => {
      const $box = document.querySelectorAll('.box.product');
      let link,
      category,
      imgs,
      name,
      price,
      data = [];
      [...$box].forEach(item => {
        try {
          category = ((document.querySelector('.breadcrumb span:last-child').innerText).split(' ')[1]).toLowerCase();
          // Link to Product
          link = `https://wearetvc.com${item.querySelector('a').getAttribute('href')}`;
          // Array of image urls
          imgs = item.querySelector('.product_card__image-wrapper').getAttribute('data-bgset').trim().split(" ");
          imgs = imgs.filter(item => item.indexOf('//') === 0)
          // Product name
          name = item.querySelector('.product-title a').innerText
          // Price of product 
          price = item.querySelector('.money').innerText
          
          // Store all relevant information within data
          data.push({ category, name, price, imgs, link })
        } catch(e) {
          console.log(e);
        }        
      }) 
      return data;
    });
    let [buttonUrl, isButton] = await this.checkForNextButton();
    // If next page button of same category of clothes go to next page and scrape again
    this.data = this.data.concat(result);
    if(isButton) {
      await this.page.goto(buttonUrl);
      await this.scrapePage();
    };
  };
  
}
const start = async () => {
  const tvc = new TvcVintage();
  // Initialize browser and page
  await tvc.intitialize();
  // Retrieve all relevant sub categories of clothing
  await tvc.getPages();
  // Navigate through each to scrape products
  await tvc.iiterate();
  console.log(tvc.data);
  fs.writeFileSync('./data.json', JSON.stringify(tvc.data));
  await insertToDb(tvc.data);
  
}
start();
