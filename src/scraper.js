import puppeteer from "puppeteer"
// import {Apparel} from './apparel'

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
      for(const page of this.pages) {
        await this.page.goto(page);
        await this.scrapePage();
       
      }
      console.log(this.data.length);
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
    });

    this.data = this.data.concat(result);
    console.log(this.data.length);
    let isButton = await this.checkForNextButton();

    if(isButton[1]) {
      await this.page.goto(isButton[0]);
      await this.scrapePage();
    };
  };
  
}

const start = async () => {
  const tvc = new TvcVintage();
  await tvc.intitialize();
  await tvc.getPages();
  await tvc.iiterate();
}

start();
// 
