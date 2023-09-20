
const Manager_model = require('../models/Manager');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken')

module.exports = {

    addManagerForAdmins: async(req, res)=>{
      try{
        const{
            manager_name,
            manager_email,
            manager_password
        } = req.body;

        const new_manager_model = new Manager_model({
            manager_name,
            manager_email,
            manager_password
        });

        await new_manager_model.save();

        return res.status(200).json({
            success:true,
            message:'Success to add new manager'
        })

      }catch(error){
        res.status(500).json({
            success:false,
            message:'error in add new manager',
            error: error.message
        })
      }
    },

    updateById:async (req, res)=>{

      const id = req.params.id;
      console.log(id)

     try{
      await Manager_model.findByIdAndUpdate(id, req.body);
      return res.status(200).json({
        success:true,
        message:'Success to update Manager by id'
      })

     }catch(error){
      return res.status(500).json({
        success:false,
        message:'error in update manager by id',
        error: error.message
      })
     }
    },

    loginManager:async(req, res)=>{
      try{
        const {
          manager_email,
          manager_password
        }= req.body;

        const manager = await Manager_model.findOne({manager_email});
        if(!manager){
          throw new Error('bad credentials');
      }

        const equal = await bcrypt.compare(manager_password, manager.manager_password);
        //check if the password correct
        if(!equal){
          throw new Error('bad creditians')

        };

        let payload = {
          manager: manager._id
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET,{
          expiresIn:10800,
        });

        let oldTokens = manager.tokens || [];

        if(oldTokens.length){
          oldTokens = oldTokens.filter((t)=>{
            const timeDiff = (Date.now() - parseInt(t.signedAt))/1000;
            console.log(timeDiff);
            if(timeDiff< 10800){
              return t
            }
          })
        }

        await Manager_model.findByIdAndUpdate(manager._id,{
          tokens:[...oldTokens, {token, signedAt:Date.now().toString() }]
        });
        
        return res.status(200).json({
          success:true,
          message:'manager login successflly',
          token,
          manager:{
            _id:manager._id,
            manager_name:manager.manager_name,
            manager_email:manager.manager_email
          }
        });

      }catch(error){
        return res.status(500).json({
          success:false,
          message:'error in login',
          error:error.message
        })

      };


    },
    logoutManager: async(req, res)=>{
     try{

      const tokens = req.manager.tokens;
      const newTokens = tokens.filter((t)=> t.token !== req.token);
      await Manager_model.findByIdAndUpdate(req.manager._id, {
        tokens : newTokens,
      });

      return res.status(200).json({
        success:true,
        message:'success to logout manager'
      })

     }catch(error){
      return res.status(500).json({
        success:false,
        message:'error in logout manager',
        error: error.massage
      })
     }
    },

    authManager: async(req, res)=>{
      try{
          const token = req.headers.authorization.split(" ")[1];
    
          if(!token){
            return res.status(401).json({
              message: 'Token is required for authentication',
            });
          }

          
          const decode = jwt.verify(token, process.env.JWT_SECRET);

          const manager = await Manager_model.findById(decode.manager);

          if(!manager || manager.permission !== 1){
            throw new Error('access denided');
          }
          
    
          return res.status(201).json({
            success:true,
            massage:'manager authoraized',
            token: token,
            manager:{
              _id: manager._id,
              manager_name: manager.manager_name,
              manager_email:manager.manager_email
            },
          });

      }catch(error){
        return res.status(401).json({
          message:'unauthoraized',
          error: error.message
        })
      }



    }
};