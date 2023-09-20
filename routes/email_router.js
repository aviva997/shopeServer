const router = require("express").Router();
const bcrypt = require("bcrypt");
const mailer = require("nodemailer");
const jwt  = require("jsonwebtoken");
const Customer = require('../models/Customer');

// email config

const transporter = mailer.createTransport({
    service: "gmail",
    auth: {
        user: "avivamalako996@gmail.com",
        pass: "vmucsetnaosxufeg"
    }
}); 

// send email Link For reset Password
router.post("/send-password-link",async(req,res)=>{

    const {customer_email} = req.body;

    if(!customer_email){
        res.status(401).json({status:401,message:"Enter Your Email"})
    }

    try {
        const user = await Customer.findOne({customer_email:customer_email});

        // token generate for reset password
        const token = jwt.sign({_id:user._id},process.env.JWT_SECRET,{
            expiresIn:"240s"
        });
        
        const set_user_token = await Customer.findByIdAndUpdate({_id:user._id},{verify_token:token},{new:true});


        if(set_user_token){
            const mailOptions = {
                to:customer_email,
                subject:"Sending Email For password Reset",
                html:`This Link Valid For 4 MINUTES <a href="${process.env.CLIENT_URL}/forget-password/${user._id}?token=${set_user_token.verify_token}" target="_blank">
                click here</a>`
            }

            transporter.sendMail(mailOptions,(error,info)=>{
                if(error){
                    console.log("error",error);
                    res.status(401).json({status:401,message:"email not send"})
                }else{
                    console.log("Email sent",info.response);
                    res.status(201).json({status:201,message:"Email sent Succsfully"})
                }
            })

        }

    } catch (error) {
        res.status(401).json({status:401,message:"invalid user"})
    }

});


// verify user for forgot password time
router.get("/forget-password/:id/",async(req,res)=>{
    const {id} = req.params;
    const {customer_token} = req.headers;

    try {
        const valid_user = await Customer.findOne({_id:id,verify_token:customer_token});
        
        const verify_token = jwt.verify(customer_token,process.env.JWT_SECRET);

        if(valid_user && verify_token._id){
            res.status(201).json({status:201,valid_user})
        }else{
            res.status(401).json({status:401,message:"user not exist"})
        }

    } catch (error) {
        res.status(401).json({status:401,error})
    }
});


// change password

router.post("/:id",async(req,res)=>{
    const {id} = req.params;

    const {password,customer_token} = req.body;

    try {
        const valid_user = await Customer.findOne({_id:id,verify_token:customer_token});
        
        const verify_token = jwt.verify(customer_token,process.env.JWT_SECRET);

        if(valid_user && verify_token._id){
            const new_password = await bcrypt.hash(password,15);

            const set_new_user_pass = await Customer.findByIdAndUpdate({_id:id},{customer_password:new_password},{new:true});

            res.status(201).json({status:201,set_new_user_pass})

        }else{
            res.status(401).json({status:401,message:"user not exist"})
        }
    } catch (error) {
        res.status(401).json({status:401,error})
    }
})




module.exports = router;
