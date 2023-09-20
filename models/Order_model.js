const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const order_schema = new Schema({

    customer:{
        type: mongoose.Types.ObjectId,
        ref:'customers',
        autopopulate: true,
    },
    customer_address:{
        city:{
            type:String,
            trim:true,
            required:true
        },
        street:{
            type:String,
            trim:true,
            required:true
        },
        building:{
            type:String,
            trim:true,
            required:true
        }
    },

    total_price:{
        type:Number,
        min:1
    },
  
    products:[
        {
            product:{
                type: mongoose.Types.ObjectId,
                ref:'products',
                required:true,

            },
            RTP:{
                type:Number,
                required:true,
                min:1
            },
            quantity:{
                type:Number,
                required:true,
                min:1

            }
        }
    ],
    status:{
        type:Number,
        default:1,
        min:[1, "minimum is 1"],
        max:[4, "maximum is 4"]
    },
    order_number:{
        type:Number,
        default: function(){
            return Date.now();
        }
    }

},
{timestamps:true});


order_schema.pre('save', function(next){
    this.total_price = this.products.reduce((total, product)=>{
        return total+ product.RTP * product.quantity;
    }, 0);

    next();
})

order_schema.post('save', (next)=>{
    console.log('order saved')
})

order_schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('orders', order_schema)