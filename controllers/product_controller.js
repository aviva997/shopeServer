const mongoose= require('mongoose');
const Product_model = require('../models/Product');

module.exports= {
    // manager request
    addProductForManager:async(req, res)=>{
        try{
            const{
                product_name,
                product_description='',
                product_price,
                product_size,
                product_color,
                product_image,
                categories
            }=req.body;


            
            const new_model = new Product_model({
                product_name,
                product_description,
                product_price,
                product_size,
                product_color,
                product_image,
                categories
            });
            await new_model.save();
            return res.status(200).json({
                success:true,
                message:'success to add product - from manager',
            })
        }catch(error){
            return res.status(500).json({
                success:false,
                message:'error in add product from manager',
                error: error.message
            })
        }
   
    },
    getAllProductForManager:async(req,res)=>{
        console.log('product requiest ')
        try{
            const all_product = await Product_model.find().populate('categories.category');
            return res.status(200).json({
                success:true,
                message:'success to get all product - for manager',
                all_product
            })

        }catch(error){
            return res.status(200).json({
                success:false,
                message:'error in  get all product - for manager',
                error: error.message
            })

        }
    },
    getProductByIdFoeManage:async(req,res)=>{
        try{
            const id = req.params.id;
            const product = await Product_model.findById(id).populate('categories.category');
            return res.status(200).json({
                success:true,
                message:'success to get product by id - from manager',
                product
            })

        }catch(error){
            return res.status(500).json({
                success:false,
                message:'error in get product by id - from manager'
            })

        }     
    },
    updateProductByIdForManager:async(req,res)=>{
        try{
            const id = req.params.id;
            await Product_model.findByIdAndUpdate(id, req.body);
            return res.status(200).json({
                success:true,
                message:'success to update product by id - from manager',
    
            })

        }catch(error){
            return res.status(500).json({
                success:false,
                message:'error in update product by id - from manager'
            })

        }

    },
    deleteProductForManager: async(req, res)=>{
        try{
            const id = req.params.id;
            await Product_model.findByIdAndDelete(id);
            return res.status(200).json({
                success:true,
                message:'success to delete product by id - from manager',

            })

        }catch(error){
            return res.status(200).json({
                success:false,
                message:'error in delete product by id - from manager',

            })

        }
    },
//     uploadNewProductImageForManager: async (req, res) => {

//     try {

//       console.log(req.file);

//       const product_image = `http://localhost:4000/uploads/${req.file.filename}`;

//       return res.status(200).json({
//         success: true,
//         message: `success to upload new product image - for managers`,
//         product_image
//       })

//     } catch (error) {
//       return res.status(500).json({
//         message: `error in upload new product image - for managers`,
//         error: error.message,
//       })

//     }

//   },


    // customer request
    getAllProductsForCustomer:async(req,res)=>{
        try{
            const all_product = await Product_model.find();
            return res.status(200).json({
                success:true,
                message:'success to get all product - for customer',
                all_product
            })

        }catch(error){
            return res.status(200).json({
                success:false,
                message:'error in  get all product - for cutomer',
                error: error.message
            })

        }

    },
    getProductByIdForCustomer:async(req,res)=>{
        try{
            const id = req.params.id;
            const product = await Product_model.findById(id);
            return res.status(200).json({
                success:true,
                message:'success to get product by id - from customer',
                product
            })

        }catch(error){
            return res.status(500).json({
                success:false,
                message:'error in get product by id - from customer'
            })

        }     

    }
}