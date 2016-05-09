//MLL - imported from assignment 1
var mongoose = require('mongoose');

var HousePriceSchema = new mongoose.Schema({
  Year: String,
  Quarter: Number,
  index: Number,
},
{
    collection: 'monthly_house_price_indexes_collection'
});

mongoose.model('Houseprice', HousePriceSchema);