const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const customer_schema = new Schema({
    customer_name:{
        type:String,
        required:true,
        unique:true
    },

    customer_email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/

    },

    customer_password:{
        type:String,
        required:true,
        match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/


    },
    customer_phone:{
        type:String,
        match: /^([0]\d{1,3}[-])?\d{7,10}$/
    },
    customer_address:{
        city:{
            type:String,
            trim:true
        },
        street:{
            type:String,
            trim:true

        },
        building:{
            type:String,
            trim:true
        },
        aparment:{
            type:String,
            trim:true
        }
    },

    customer_order:[
        {
            order:{
                type:mongoose.Types.ObjectId,
                ref:'orders'
            }

        }
    ],
    tokens:[{type:Object}],
    verify_token:{
        type:String,
    }
},{timestamps:true})


customer_schema.pre('save', async function(next){
    const hash_password = await bcrypt.hash(this.customer_password, 15);
    this.customer_password = hash_password;
    next();
})

module.exports = mongoose.model('customers', customer_schema);

