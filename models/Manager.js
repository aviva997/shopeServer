const mongoose = require('mongoose');
const bcrypct = require('bcrypt');


const Schema =  mongoose.Schema;

const manager_schema = new Schema({

    manager_name:{
        type:String,
        required:true,
        unique:true
    },
    manager_email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true
    },

    manager_password:{
        type:String,
        required:true,

    },
    tokens:[{type:Object}],

    permission:{
        type:Number,
        default:1
    }
})

manager_schema.pre('save', async function(next){
    const hash_password = await bcrypct.hash(this.manager_password, 15);
    this.manager_password = hash_password;
    next();
})

module.exports = mongoose.model('managers', manager_schema)