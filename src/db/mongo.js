
const mongoose = require('mongoose');
const validator = require('validator')
mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
})

const insertToDb = async (data) => {
  for (const dat of data) {
    try {
      await Apparel(dat).save();
    } catch(e) {
      console.log(e);
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
    unique : true
  },

  price : {
    type : String,
    required : true,
    trim : true,
  },
  imgs : [{
  
      type : String,
      required : true
  
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