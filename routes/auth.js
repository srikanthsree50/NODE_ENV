const express = require('express');
const router = express.Router();
const { register,login , forgotPassword, getCurrentLoggedInUser} = require('../controllers/auth')
const {protect} = require('../middlewares/auth')

router.post('/register',register);
router.post('/login',login);
router.get('/loggedinuser',protect,getCurrentLoggedInUser)
router.post('/forgotpassword', forgotPassword)

module.exports = router;