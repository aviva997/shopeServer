const router = require('express').Router();

const {addMessage, getMessage, deleteMessage}= require('../controllers/contactUs_controller');


router.post('/add', addMessage);
router.get('/get', getMessage);
router.delete('/delete/:id', deleteMessage);


module.exports = router;