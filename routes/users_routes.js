const router = require('express').Router();

// admin methods
const {addManagerForAdmins, updateById, loginManager, logoutManager,authManager} = require('../controllers/manager_controller');
const {
    addCustomerFromManager,
    getAllCustomersFromManager, 
    getAllCustomerByIdFromManager,
    deleteCustomerFromManager,
    updateCustomerByIdFromManager,
    registerCustomer,
    loginCustomer,
    authCustomer,
    logoutCustomer,
    updateCustomer,
    getUserStatusForManager,
    newCustomersForManager,
    
    }= require('../controllers/customer_controller');

const auth_manager = require('../middlewares/auth_manager');
const auth_customer = require('../middlewares/auth_customer')




// manager methods


//  admin request
router.post('/admins/add-manager', addManagerForAdmins);
router.put('/admins/update-manager/:id', updateById);

// manager request 

router.post('/manager/login', loginManager);
router.post('/manager/logout', auth_manager, logoutManager);
router.get('/manager/auth',authManager);
router.post('/manager/add-user-from-manager', addCustomerFromManager);
router.get('/manager/get-all-customers',getAllCustomersFromManager);
router.get('/manager/get-customer-by-id/:id',getAllCustomerByIdFromManager);
router.delete('/manager/delete-customer-by-id/:id',deleteCustomerFromManager);
router.put('/manager/update-customer-by-id/:id',updateCustomerByIdFromManager);
router.get('/status'/*,verifyTokenAndAdmin*/,getUserStatusForManager)
router.get('/manager/get-new-users'/*,verifyTokenAndAdmin*/,newCustomersForManager)


//customer requesr
router.post('/customer/register', registerCustomer);
router.post('/customer/login', loginCustomer);
router.get("/customers/auth", authCustomer);

router.post('/customer/logout',auth_customer,logoutCustomer);
router.put('/customer/update/:id',auth_customer, updateCustomer);




module.exports = router;