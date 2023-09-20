const router = require('express').Router();
const{
    addProductForManager,
    getAllProductForManager,
    getProductByIdFoeManage,
    updateProductByIdForManager,
    deleteProductForManager,
    getAllProductsForCustomer,
    getProductByIdForCustomer,
    


    }= require('../controllers/product_controller')

const auth_manager = require('../middlewares/auth_manager')

// manager request
router.post('/product/add-product-manager',auth_manager, addProductForManager )
router.get('/product/get-product-manager', auth_manager,getAllProductForManager )
router.get('/product/get-product-by-id-manager/:id',auth_manager,getProductByIdFoeManage )
router.put('/product/update-product-by-id-manager/:id',auth_manager,updateProductByIdForManager )
router.delete('/product/delete-product-by-id-manager/:id',auth_manager, deleteProductForManager )


//customer request

router.get('/customer/getAll', getAllProductsForCustomer),
router.get('/customer/getProduct/:id', getProductByIdForCustomer),




module.exports = router;