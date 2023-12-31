

const router = require('express').Router();
const Stripe = require('stripe');
require('dotenv').config();

const stripe = Stripe(process.env.STRIPE_KEY);

router.post('/create-checkout-session', async (req, res) => {
    const line_items  = req.body.cartItem.map((item)=>{
        return{
            price_data: {
                currency: 'usd',
                product_data: {
                  name: item.product_name,
                  description: item.product_description,
                  metadata:{
                      id:item._id
                    },
                },
                unit_amount: item.product_price * 100,
              },
              quantity: item.quantity,
        }

    });
  const session = await stripe.checkout.sessions.create({
    
    line_items,
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/checkout-success`,
    cancel_url: `${process.env.CLIENT_URL}/`,
  });

  res.send({url :session.url});
});

module.exports = router;