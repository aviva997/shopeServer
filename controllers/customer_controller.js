const Customer_model = require('../models/Customer');
const Order_model = require('../models/Order_model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
module.exports = {

    //customer request 

    registerCustomer:async(req, res)=>{
      try{
        const{
            customer_name,
            customer_email,
            customer_password,
            customer_phone

        }= req.body;
        if (!customer_name) {
            return res.status(400).json({ message: 'Customer name is required.' });
          }
      
          // Example validation for customer_email (using a regular expression):
          const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
          if (!emailRegex.test(customer_email)) {
            return res.status(400).json({ message: 'Invalid email address.' });
          }
      
          // Example validation for customer_password (must be at least 8 characters):
          if (customer_password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters.' });
          }
     
      
        const new_model = new Customer_model({
            customer_name,
            customer_email,
            customer_password,
            customer_phone:customer_phone||'',

        });

        await new_model.save();
        return res.status(200).json({
            success:true,
            message:'success to register coustmor'
        })

      }catch(erro){
        return res.status(500).json({
            success:false,
            message:'erro in register coustmor',
            erro:erro.message
        })

      }


    },
    loginCustomer: async(req,res)=>{
       try{
        const{
            customer_email,
            customer_password
        }= req.body;

        const customer = await Customer_model.findOne({customer_email});
        if(!customer){
            throw new Error('bad credentials');
        }

        const equal = await bcrypt.compare(customer_password, customer.customer_password);

        if(!equal){
            throw new Error('bad credentials')
        }

        const payload = {
            customer: customer._id
        };

        const customer_token  = jwt.sign(payload, process.env.JWT_SECRET,{
            expiresIn:3600 ,
        });

        let oldToken = customer.tokens || [];
        if(oldToken.length){
            oldToken = oldToken.filter((t)=>{
                const timeDiff = (Date.now()- parseInt(t.signedAt))/1000;
                if(timeDiff < 3600 ){
                    return t;
                }
            })
        };

        await Customer_model.findByIdAndUpdate(customer._id,{
            tokens: [...oldToken,{customer_token, signedAt: Date.now().toString()}]
        })

        return res.status(200).json({
            success:true,
            message:'success customer login',
            customer_token,
            customer:{
                customer_name:customer.customer_name
            }
        })


       }catch(error){
            return res.status(500).json({
                success:false,
                message:'error in  customer login',
                error: error.message,
            })

       }


    },
    logoutCustomer: async(req,res)=>{
        if(req.headers && req.headers.authorization){
            try{
                const customer_token = req.headers.authorization.split(' ')[1];
                if(!customer_token){
                    return res.status(401).json({
                        success:false,
                        message:'Authorization failed'
                    })
                }

                const tokens= req.customer.tokens;

                const new_tokens = tokens.filter((t)=> t.customer_token!== customer_token);

                await Customer_model.findByIdAndUpdate(req.customer._id,{
                    tokens:new_tokens
                })
                res.clearCookie('token');

                return res.status(200).json({
                    success:true,
                    message:'success to logout customer'
                });

            }catch(error){
                return res.status(500).json({
                    success:false,
                    message:'error in logout customer',
                    error: error.message
                });

            }

        }

    },
    updateCustomer:async(req, res)=>{
        try{
            const id = req.params.id;

            const update_customer = await Customer_model.findByIdAndUpdate(id,req.body);
            return res.status(200).json({
                success:true,
                message:'success to update customer',
                update_customer
            })

        }catch(error){
            return res.status(200).json({
                success:false,
                message:'error in update customer',
                error:error.message
            })
        }

    },
    authCustomer: async(req,res)=>{
        try {
            const customer_token = req.headers.authorization;
      
            if (!customer_token) {
              throw new Error("no token provided");
            }
      
            const bearer = customer_token.split(" ")[1];
      
            const decode = jwt.verify(bearer, process.env.JWT_SECRET);
      
            const Customer = await Customer_model.findById(
              decode.customer,
              "-user_password -tokens"
            );
      
            if (!Customer) {
              throw new Error("access denied");
            }
      
            return res.status(201).json({
              success: true,
              message: "user authorized",
              customer_token,
              Customer,
            });
          } catch (error) {
            return res.status(401).json({
              message: "unauthorized",
              error: error.message,
            });
          }

    },




    // manager request 
    getUserStatusForManager:async(req,res)=>{
        const date = new Date();

        const lastYear = new Date(date.setFullYear(date.getFullYear()-1));
        try{
            const data = await Customer_model.aggregate([
                {$match:{createdAt:{$gte: lastYear}}},
                {
                    $project:{
                        month:{$month: "$createdAt"}
                    },
                },
                {
                    $group:{
                    _id:"$month",
                    total:{$sum:1}
                }}

            ])

            return res.status(200).json(data)

        }catch(err){
            return res.status(500).json({
                message:'Error in stats',
                error: err.message
            })
        }

    },
    newCustomersForManager: async(req, res)=>{
        try {
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1; // Adding 1 to match MongoDB's month format
        
            const newCustomers = await Customer_model.find({
              createdAt: {
                $gte: new Date(currentDate.getFullYear(), currentMonth - 1, 1), // Start of current month
                $lt: new Date(currentDate.getFullYear(), currentMonth, 1), // Start of next month
              },
            }).select('customer_name customer_email customer_phone');
        
            return res.status(200).json(newCustomers);
          } catch (err) {
            return res.status(500).json(err);
          }
        
    },
  



    addCustomerFromManager : async(req, res)=>{
        console.log(',f,f')
        try{
            const{
                customer_name,
                customer_email,
                customer_password,
                customer_phone,
                customer_address,
            }= req.body;
    
            const new_model = new Customer_model({
                customer_name,
                customer_email,
                customer_password,
                customer_phone: customer_phone || '',
                customer_address: customer_address || '',
    
            });
            await new_model.save();
            return res.status(200).json({
                success:true,
                message:'success to add new customer'
            })


        }catch(error){
            return res.status(500).json({
                success:false,
                message:'error in add new customer'
            })
        
        }

    },

    getAllCustomersFromManager: async(req,res)=>{
        try{

            const all_customers = await Customer_model.find();
            return res.status(200).json({
                success:true,
                message:'success to get all customers from manager',
                customers: all_customers
            })

        }catch(error){
            return res.status(200).json({
                success:false,
                message:'error in  get all customers from manager',
                error: error.message
            })

        }
    },
    getAllCustomerByIdFromManager: async(req, res)=>{

       try{
        const id = req.params.id;
        const customer =  await Customer_model.findById(id);

        return res.status(200).json({
            success:true,
            message:'success to get customer by id - for manager',
            customer: customer
        })


       }catch(error){
        return res.status(200).json({
            success:false,
            message:'erro in get customer by id - for manager',
        })

       }

        

    },

    deleteCustomerFromManager : async(req,res)=>{
        try{
            const id = req.params.id;

            const exists = await Order_model.findOne({ customer: id });

            if (exists) {
                throw new Error(
                "cannot delete this user because have orders related to this user"
                );
            }
            await Customer_model.findByIdAndDelete(id);
            return res.status(200).json({
                success:true,
                message:'success to delete customer - from manage',
            })

        }catch(error){
            return res.status(500).json({
                success:false,
                message:'error in delete customer - from manage',
                error: error.message
            })

        }

    
    },
    updateCustomerByIdFromManager: async(req,res)=>{

        try{
            console.log('hi')
            const id = req.params.id;
            await Customer_model.findByIdAndUpdate(id,req.body);
            return res.status(200).json({
                success:true,
                message:'success to upade customer - from manager'
            })
        }catch(erro){
            return res.status(500).json({
                success:false,
                message:'error in update customer - from mananger',
                error: erro.message
            })
        }

    }


}