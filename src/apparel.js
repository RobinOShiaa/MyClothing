export class Apparel {
  constructor(category,name,price,imgs,link) {
    this.category = category;
    this.name = name;
    this.price = price;
    this.imgs = imgs;
    this.link = link;
  }

  getDetails () {
    return {
      category : this.category,
      name : this.name,
      price : this.price,
      imgs : this.imgs,
      link : this.link
    }
  }

  setPrice (price) {
    this.price = price;
  }

  setLink (link) {
    this.link = link;
  }


}