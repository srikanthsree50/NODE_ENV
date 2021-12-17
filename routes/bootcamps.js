const express = require('express');
const router = express.Router();
const Bootcamp = require('../models/bootcamp');
const advancedSearchResults = require('../middlewares/advancedSearchResults');
const { protect , authorize} = require('../middlewares/auth')
const {getBootcamps,getBootcamp,createBootcamp,updateBootcamp,deleteBootcamp,getBootcampInRadius, bootcampPhotoUpload} = require('../controllers/bootcamps')

const courseRouter = require('./courses')
router.use('/:bootcampId/courses',courseRouter);

router
.route('/radius/:zipcode/:distance')
.get(getBootcampInRadius);

router
.route('/:id/photo')
.put(protect,authorize('publisher','admin'),bootcampPhotoUpload);

router
.route('/')
.get(advancedSearchResults(Bootcamp,'courses'),getBootcamps)
.post( protect,authorize('publisher','admin'),createBootcamp);

router
.route('/:id')
.get(getBootcamp)
.put(protect,authorize('publisher','admin'),updateBootcamp)
.delete(protect,authorize('publisher','admin'),deleteBootcamp);

module.exports = router;
