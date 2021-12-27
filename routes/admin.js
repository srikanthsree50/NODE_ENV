const express = require('express');
const router = express.Router({mergeParams :true});
const advancedSearchResults = require('../middlewares/advancedSearchResults')
const {protect,authorize} = require('../middlewares/auth')
const User = require('../models/User');
const {getUsers,getUser,createUser,updateUser,deleteUser} = require('../controllers/admin')

router.use(protect);
router.use(authorize('admin'));

router.route('/')
.get(advancedSearchResults(User),getUsers)
.post(createUser)

router.route('/:id')
.get(getUser)
.put(updateUser)
.delete(deleteUser)

module.exports = router;