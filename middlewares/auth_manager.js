const jwt = require('jsonwebtoken');
const Manager_modle= require('../models/Manager');
require('dotenv').config();

module.exports = async (req, res, next)=>{


    if(req.headers && req.headers.authorization){
        const token = req.headers.authorization.split(' ')[1];

        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            const manager = await Manager_modle.findById(decode.manager);

            if(!manager){
                return res.status(401).json({
                    success:false,
                    massage:'unauthorizes access!'
                });
            }
            if(manager.permission !== 1 && manager.permission !==2){
                return res.status(401).json({
                    success:false,
                    massage:'unauthorizes access!'
                });

            }

            req.manager = manager;
            req.token = token;
            next();

        }catch(error){

            if(error.name == 'JsonWebTokenError'){
                return res.status(401).json({
                    success:false,
                    massage:'unauthorizes access!'

                })
            }
            if(error.name == 'JsonExpiredError'){
                return res.status(401).json({
                    success:false,
                    massage:'session expired try sign in'

                })
            }

            res.status(401).json({
                success:false,
                massage:'internal server error'
            });

        }
    }

    else{
        res.status(401).json({
            success:false,
            massage:'unauthorizes access!'
        })
    }


};