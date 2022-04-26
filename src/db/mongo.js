
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
})

const insertToDb = async (data) => {
  for (const dat of data) {
    try {
      await Apparel(dat).save();
      const result = await Apparel.find({});
      console.log('success');
    } catch(e) {
      console.log('Err');
    }
  }
    
}

const apparelSchema = new mongoose.Schema({
  category : {
    type : String,
    required : true,
    trim : true,
    lowercase : true
  },

  name : {
    type : String,
    required : true,
    trim : true,
  },

  price : {
    type : Number,
    required : true,
    trim : true
  },
  imgs : [{
    img : {
      type : String,
      required : true
    }
  }],

  link : {
    type : String,
    required : true
  }
})

const Apparel = mongoose.model('Apparel', apparelSchema)

module.exports = {
  insertToDb
}