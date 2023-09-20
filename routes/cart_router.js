const router = require('express').Router();

const {addToCart,getCartById,getAllCart,updateCartById,deleteCartById}= require('../controllers/cart_controller')


router.post('/cart/add', addToCart);
router.get('/cart/get-by-id/:id', getCartById);
router.get('/cart/get-all', getAllCart);
router.put('/cart/update/:id', updateCartById);
router.delete('/cart/delete/:id', deleteCartById)

module.exports = router;