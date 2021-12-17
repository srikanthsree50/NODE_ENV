const express = require('express');
const router = express.Router();
const Bootcamp = require('../models/bootcamp');
const advancedSearchResults = require('../middlewares/advancedSearchResults');
const { protect } = require('../middlewares/auth')
const {getBootcamps,getBootcamp,createBootcamp,updateBootcamp,deleteBootcamp,getBootcampInRadius, bootcampPhotoUpload} = require('../controllers/bootcamps')

const courseRouter = require('./courses')
router.use('/:bootcampId/courses',courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampInRadius);
router.route('/:id/photo').put(protect,bootcampPhotoUpload);
router.route('/').get(advancedSearchResults(Bootcamp,'courses'),getBootcamps).post( protect,createBootcamp);
router.route('/:id').get(getBootcamp).put(protect,updateBootcamp).delete(protect,deleteBootcamp);

module.exports = router;
