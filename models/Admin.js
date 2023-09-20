const mongoose = require('mongoose');
const { token } = require('morgan');



const Schema =  mongoose.Schema;

const admin_schema = new Schema({

    admin_name:{
        type:String,
        required:true,
        unique:true
    },
    admin_email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true
    },

    admin_password:{
        type:String,
        required:true,

    },
    tokens:[{type:Object}],

    Permission:{
        type:Number,
        default:true
    }
})


module.exports = mongoose.model('admins', admin_schema)