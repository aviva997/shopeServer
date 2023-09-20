const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const product_schema = new Schema({
    product_name:{
        type:String,
        required:true,
    },
    product_description:{
        type:String,

    },
    product_price:{
        type:Number,
        required:true,
        min:[1,"must be positive"]
    },
    product_size:{
        type:Array,
    },
    product_color:{
        type:Array
    },
    product_image:{
        type:String
    },
    categories:[
        {
            category:{
                type:mongoose.Types.ObjectId,
                ref:'categories'
            }
        }
    ]


});

module.exports = mongoose.model('products', product_schema);