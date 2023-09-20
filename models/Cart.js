const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cart_schema = new Schema({

    customer:{
        type:mongoose.Types.ObjectId,
        ref:'customers',
        required:true
    },
    products:[
        {
            product:{
                type:mongoose.Types.ObjectId,
                ref:'products',
                required:true
            },
            quantity:{
                type:Number,
                required:true,
                min:1,
                max:10
            }

        }
    ]
});

module.exports = mongoose.model('cart', cart_schema)