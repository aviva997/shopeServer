const jwt = require('jsonwebtoken');
const Customer_model = require('../models/Customer')
module.exports = async(req,res, next)=>{

    if(req.headers && req.headers.authorization){
        const customer_token = req.headers.authorization.split(' ')[1];
        try{
            const decode = jwt.verify(customer_token, process.env.JWT_SECRET);
            const customer = await Customer_model.findById(decode.customer);

            if(!customer){
                return res.json({
                    success:false,
                    message:'uauthorized access !'
                })

            }

            req.customer = customer;
            console.log(req.customer)

            next();


        }catch(error){
            if(error.name === 'JsonWebTokenError') {
                return res.json({success: false, message:'unauthorized access !'})
            }
            if(error.name= 'TokenExpriredError'){
                return res.json({
                    success:false,
                    message:'session  expried try sign in '
                })
            }

            return res.json({ success: false, message:'Internal server error'})

        }
    }else{
        return res.json({success:false, message:'unauthorized access!'})
    }


}