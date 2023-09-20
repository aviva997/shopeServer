const Category_model = require('../models/Category')
module.exports= {
    addCategoriesForManager:async(req, res)=>{
        try{
            const{
                category_name,
            }=req.body;
        
            const new_model = new Category_model({
                category_name
            });
            await new_model.save();

            return res.status(200).json({
                success:true,
                message:'success to add new category - from manager',
            })
        }catch(error){
            return res.status(500).json({
                success:false,
                message:'error in add new category from manager',
                error: error.message
            })
        }
   
    },
    getAllCategoriesForManager:async(req,res)=>{
        try{
            const all_categories = await Category_model.find();
         
            return res.status(200).json({
                success:true,
                message:'success to get all categories - for manager',
                all_categories
            })

        }catch(error){
            return res.status(200).json({
                success:false,
                message:'error in  get all categories - for manager',
                error: error.message
            })

        }
    },
    getCategoriesByIdFoeManage:async(req,res)=>{
        try{
            const id = req.params.id;

            const category = await Category_model.findById(id);
            if(category=== null){
                throw new Error('not exsits')
            }
            return res.status(200).json({
                success:true,
                message:'success to get category by id - from manager',
                category
            })

        }catch(error){
            return res.status(500).json({
                success:false,
                message:'error in get category by id - from manager',
                error:error.message
            })

        }     
    },
    updateCategoriesByIdForManager:async(req,res)=>{
        try{
            const id = req.params.id;
            const update_category = await Category_model.findByIdAndUpdate(id, req.body);
            if(update_category=== null){
                throw new Error('not exsist')
            }
            return res.status(200).json({
                success:true,
                message:'success to update category by id - from manager',
    
            })

        }catch(error){
            return res.status(500).json({
                success:false,
                message:'error in update category by id - from manager',
                error: error.message
            })

        }
    },
    deleteCategoriesForManager: async(req, res)=>{
        try{
            const id = req.params.id;
            const delete_category = await Category_model.findByIdAndDelete(id);
            if(delete_category === null){
                throw new Error('not exsist')
            }
            return res.status(200).json({
                success:true,
                message:'success to delete category by id - from manager',

            })

        }catch(error){
            return res.status(200).json({
                success:false,
                message:'error in delete category by id - from manager',
                error: error.message

            })

        }
    },


    // customer 

    getAllCategoriesForCustomer:async(req,res)=>{
        try{
            const all_categories = await Category_model.find();
         
            return res.status(200).json({
                success:true,
                message:'success to get all categories - for manager',
                all_categories
            })

        }catch(error){
            return res.status(200).json({
                success:false,
                message:'error in  get all categories - for manager',
                error: error.message
            })

        }
    },
}