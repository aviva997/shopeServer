const Cart_model = require('../models/Cart')
module.exports = {
    addToCart:async(req,res)=>{
        try{
            const{
                customer,
                products
            }= req.body;

            if(!customer || !products){
                throw new Error('Missing required feilds')
            }

            const new_model = new Cart_model({
                customer,
                products
            });

            await new_model.save();
            return res.status(200).json({
                success:true,
                message:'success to add to cart'
            })


            
        }catch(error){
            return res.status(500).json({
                success:true,
                message:'error in add to cart',
                error: error.message
            })

        }

    },
    getCartById:async(req, res)=>{
        try{
            const id= req.params.id;

            const cart = await Cart_model.findById(id).populate(["customer", "products.product"]);
            if(cart === null){
                throw new Error('not exsist');
            }
            return res.status(200).json({
                success:true,
                message:'success to get cart by id',
                cart
            })
        }catch(error){
            return res.status(500).json({
                success:false,
                message:'error in get cart by id',
                error:error.message
            })
        }
    },
    getAllCart:async(req, res)=>{
        try{

            const cart = await Cart_model.find().populate(["customer", "products.product"]);
            if(cart === null){
                throw new Error('not exsist');
            }
            return res.status(200).json({
                success:true,
                message:'success to get all the cart',
                cart
            })
        }catch(error){
            return res.status(500).json({
                success:false,
                message:'error in get all ',
                error:error.message
            })
        }
    },
    updateCartById: async(req,res)=>{
        try{
            const id = req.params.id;

            const{ customer, product,quantity}= req.body;
            
            const updateFields = {
                $set: {
                    'products.$[elem].quantity': quantity,
                    'products.$[elem].product': product,
                    customer: customer
                }
            };
            
            const arrayFilters = [{ 'elem.quantity': { $exists: true } }];
            
            const updated_cart = await Cart_model.findByIdAndUpdate(
                id,
                updateFields,
                { new: true, arrayFilters: arrayFilters }
            );
            
    
        
            return res.status(200).json({
                success:true,
                message:'success to update cart'
            })

        }catch(error){
            return res.status(500).json({
                success:false,
                message:'error in update cart',
                error: error.message
            })

        }
    },
    deleteCartById:async(req,res)=>{
        try{
            const id = req.params.id;
            await Cart_model.findByIdAndDelete(id);
            return res.status(200).json({
                success:true,
                message:'success to delete cart'
            })
        }catch(error){
            return res.status(500).json({
                success:false,
                message:'error in delete cart',
                error: error.message
            })
            
        }
    }

}