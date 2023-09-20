const router = require('express').Router();

const {getAllOrdersForManager,updateStatusFromManager,getOrderByIdForManager, deleteOrderFromManager,Income}= require('../controllers/order_controller');

const {addNewOrderForGuess,addOrderForCustomer,getOrdersForCustomer}= require('../controllers/order_controller');
// manager request 

router.get('/order/get-all-orders', getAllOrdersForManager);
router.put('/order/update-status-order/:id', updateStatusFromManager)
router.get('/order/get-order-for-manager/:id', getOrderByIdForManager)
router.delete('/order/delete-order-for-manager/:id', deleteOrderFromManager)
router.get('/income', Income)



//customers request
router.post('/order/add-order-guest',addNewOrderForGuess)
router.post('/order/add-order-customer',addOrderForCustomer)
router.get('/order/get-order-customer/:id',getOrdersForCustomer)

module.exports = router;