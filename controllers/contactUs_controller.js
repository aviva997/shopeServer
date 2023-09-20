const Contact_model = require('../models/ContactUs');
module.exports = {
    addMessage:async(req,res)=>{
        try{
            const{
                name,
                email,
                subject,
                message
            }= req.body;

         

            const new_model = new Contact_model({
                name,
                email,
                subject,
                message
            });

            await new_model.save();
            return res.status(200).json({
                success:true,
                message:'success to add message',
            
            })


            
        }catch(error){
            return res.status(500).json({
                success:true,
                message:'error in add message',
                error: error.message
            })

        }

    },

    getMessage:async(req, res)=>{
        try{

            const contact = await Contact_model.find();
            if(contact === null){
                throw new Error('not exsist');
            }
            return res.status(200).json({
                success:true,
                message:'success to get all the contact',
                contact
            })
        }catch(error){
            return res.status(500).json({
                success:false,
                message:'error in get all the contact ',
                error:error.message
            })
        }
    },

    deleteMessage: async(req,res)=>{
        try{
            const id = req.params.id;
            await Contact_model.findByIdAndDelete(id);
            return res.status(200).json({
                success:true,
                message:'success to delete Message'
            })

        }catch(error){
            return res.status(500).json({
                success:false,
                message:'error in delete Message ',
                error: error.message
            })

        }
    }
    
}