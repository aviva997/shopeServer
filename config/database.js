const mongoose = require('mongoose');
require('dotenv').config();

const connection = async ()=>{

    const url = process.env.DATABASE ;
    console.log(url)
    try{
        await mongoose.connect(url,{
    

        });
        console.log('Mongoose connected to DB');

    }catch(error){
        console.log(`faild to connected to DB ${error}`)

    }

}

module.exports = connection;