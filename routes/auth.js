const express = require('express');
const router = express.Router();
const { register,login , forgotPassword,resetPassword , changePassword, updateUser, getCurrentLoggedInUser} = require('../controllers/auth')
const {protect} = require('../middlewares/auth')

router.post('/register',register);
router.post('/login',login);
router.get('/loggedinuser',protect,getCurrentLoggedInUser)
router.post('/forgotpassword', forgotPassword)
router.put('/resetpassword/:resettoken', resetPassword)
router.put('/updateuser',protect,updateUser)
router.put('/changepassword',protect,changePassword)
module.exports = router;