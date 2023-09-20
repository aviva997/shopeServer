const router = require('express').Router();

const {addCategoriesForManager,getAllCategoriesForManager,getCategoriesByIdFoeManage,updateCategoriesByIdForManager,deleteCategoriesForManager,getAllCategoriesForCustomer}= require('../controllers/category_controller')

// manager request
router.post('/manager/addCategory',addCategoriesForManager);
router.get('/manager/getAllCategory',getAllCategoriesForManager);
router.get('/manager/getCategoryById/:id',getCategoriesByIdFoeManage);
router.put('/manager/updateCategoryById/:id',updateCategoriesByIdForManager);
router.delete('/manager/deleteCategoryById/:id',deleteCategoriesForManager);


//customer request

router.get('/customer/getAllCategory',getAllCategoriesForCustomer);

module.exports = router;