const Order_model = require('../models/Order_model') ;
const mailer = require('nodemailer')

module.exports= {

    // manager request
    getAllOrdersForManager:async(req,res)=>{
        try{
            const orders = await Order_model.find().populate(['customer','products.product']);
            console.log(orders);
            return res.status(200).json({
                success:true,
                message:'success to get all orders - for manager',
                orders
            })
        }catch(error){
            return res.status(500).json({
                success:false,
                message:'error in get all orders - for manager',
                error: error.message
            })

        }

    },
    updateStatusFromManager: async (req, res)=>{
        try{
            const id= req.params.id;
            const order = await Order_model.findByIdAndUpdate(id, {status:req.body.status},{new:true});

            if(req.body.status == 3) {
                try {
                  const mail_template = `
                  <html dir="ltr">
                    <head>
                      <style>
                        body {
                          font-family: Arial, sans-serif;
                        }
                  
                        h1 {
                          color: #333;
                        }
                  
                        .container {
                          max-width: 600px;
                          margin: 0 auto;
                          padding: 20px;
                          background-color: #f8f8f8;
                          border: 1px solid #ccc;
                          border-radius: 5px;
                          direction: ltr
                        }
                  
                        .order-details {
                          margin-bottom: 20px;
                        }
                  
                        .order-details table {
                          width: 100%;
                          border-collapse: collapse;
                        }
                  
                        .order-details th,
                        .order-details td {
                          padding: 10px;
                          border: 1px solid #ccc;
                        }
                      </style>
                    </head>
                    <body>
                      <div class="container">
                        <h1>Dear ${order.customer_details.customer_name},</h1>
                        <p>You order is ready and will ship soon to you.</p>
                  
                        <div class="order-details">
                          <h2>Order Details:</h2>
                          <table>
                            <tr>
                              <th>Order Number:</th>
                              <td>${order.order_number}</td>
                            </tr>
                            <tr>
                              <th>Total Amount:</th>
                              <td>${order.total_price}</td>
                            </tr>
                          </table>
                        </div>
                  
                        <p>Thank you for choosing our service.</p>
                  
                        <p>Best regards,<br>Shoes</p>
                      </div>
                    </body>
                  </html>
                  `;

                const transporter = mailer.createTransport({
                    service:"gmail",
                    auth:{
                        user:"avivamalako996@gmail.com",
                        pass:"dpcvzdbqbdklaglu"
                    }
                });

                const mail = {
                    to:order.customer_details.customer_email,
                    subject: `Order ready : ${order.order_number}`,
                    html: mail_template
                }
                await transporter.sendMail(mail)

                return res.status(200).json({
                    success:true,
                    message:'success to update customer order status'
                })

                }catch(error){
                    throw new Error(error.message)
                }
            }

        }catch(error){
            return res.status(500).json({
                success:false,
                message:'error in update customer order status',
                error: error.message
            })

        }
    },
    getOrderByIdForManager: async (req, res)=>{
        const id = req.params.id;
        try{
            const order = await Order_model.findById(id).populate(["customer","products.product"]);
            if( order === null){
                throw new Error('not exsist');
            }

            return res.status(200).json({
                success:true,
                message:'success to get order by id - from manager',
                order
            })
        }catch(error){
            return res.status(500).json({
                success:false,
                message:'error in get order by id - from manager',
                error: error.message
            })

        }
        
       

    },
    deleteOrderFromManager: async(req, res)=>{
        try{
            const id = req.params.id;
            await Order_model.findByIdAndDelete(id);
            return res.status(200).json({
                success:true,
                message:'success to delete order - from manager'
            })

        }catch(error){
            return res.status(500).json({
                success:false,
                message:'error in delete order - from manager',
                error: error.message
            })

        }
    },
    Income: async(req, res)=>{
      const date = new Date();
      const lastMonth = new Date(date.setMonth(date.getMonth()-1));
      const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth()-1));

      try{
        // const icome = await Order_model.count({products:{$elemMatch: {product:product}}})
          const icome = await Order_model.aggregate([
              {$match: {createdAt: { $gte: previousMonth }} },
              {
                  $project:{
                      month:{$month: "$createdAt"},
                      sales:"$total_price"
                  },
              },{

                  $group:{
                      _id:"$month",
                      total:{$sum: "$sales"},
                  },
              },{
                $sort:{_id:1}
              }

              
          ])
          return res.status(200).json(icome)

      }catch(err){
          return res.status(500).json(err)
      }
  },

     

    //guess request 
    addNewOrderForGuess:async(req,res)=>{
        try{
            const{ customer_address,products}= req.body;

            const new_model = new Order_model({
              customer_address,
              products

            });
            await new_model.save();
            return res.status(200).json({
                success:true,
                message:'success to add  order - for guest',
                order_number: Order_model.order_number
            })

        }catch(error){
            return res.status(500).json({
                success:false,
                message:'error in add order - for guest',
                error: error.message
            })

            
        }
    },

    //register request
    addOrderForCustomer:async(req, res)=>{

        try{
            const{customer,  customer_address,products} = req.body;
            const new_model = new Order_model({
                customer,
                customer_address,
                products
    
            });

            await new_model.save();
            
            try{
                const mail_text = `
                <html dir="ltr">
                <head>
                  <style>
                    body {
                      font-family: Arial, sans-serif;
                    }
              
                    h1 {
                      color: #333;
                    }
              
                    .container {
                      max-width: 600px;
                      margin: 0 auto;
                      padding: 20px;
                      background-color: #f8f8f8;
                      border: 1px solid #ccc;
                      border-radius: 5px;
                      direction: ltr
                    }
              
                    .order-details {
                      margin-bottom: 20px;
                    }
              
                    .order-details table {
                      width: 100%;
                      border-collapse: collapse;
                    }
              
                    .order-details th,
                    .order-details td {
                      padding: 10px;
                      border: 1px solid #ccc;
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <h1>Dear ${new_model.customer.customer_name},</h1>
                    <p>Thank you for your order! We have received your payment and are processing your order.</p>
              
                    <div class="order-details">
                      <h2>Order Details:</h2>
                      <table>
                        <tr>
                          <th>Order Number:</th>
                          <td>${new_model.order_number}</td>
                        </tr>
                        <tr>
                          <th>Total Amount:</th>
                          <td>${new_model.total_price}</td>
                        </tr>
                      </table>
                    </div>
              
                    <p>We will send you another email once your order has been shipped.</p>
              
                    <p>Thank you for choosing our service.</p>
              
                    <p>Best regards,<br>Shoes</p>
                  </div>
                </body>
              </html>
                    
            `;

            const transpoeter = mailer.createTransport({
                service:"gmail",
                auth:{
                    user:"avivamalako996@gmail.com",
                    pass:"dpcvzdbqbdklaglu"
                }
            });

            const mail = {
                to:new_model.customer.customer_email,
                subject:`New order :${new_model.order_number}`,
                html:mail_text
            }
            await transpoeter.sendMail(mail)
            return res.status(200).json({
                success:true,
                message:'success to add all orders - for customer',
                order_number: new_model.order_number
                
            })

            }catch(error){
                throw new Error(error.message)

            }
    

        }catch(error){
            return res.status(500).json({
                success:false,
                message:'error in add all orders - for customer',
                error: error.message
                
            })

        }
     

    },

    getOrdersForCustomer: async(req, res)=>{
        const customer = req.params.id;
       
        try{
            const orders = await Order_model.find({customer:customer}).populate(["customer","products.product"]);
            return res.status(200).json({
                success:true,
                message:'success to get customer orders - for customer',
                orders
                
            })

        }catch(error){
            return res.status(500).json({
                success:false,
                message:'error in get customer orders - for customer',
                error: error.message
                
            })

        }
    }


}