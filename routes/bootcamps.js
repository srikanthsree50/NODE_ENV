const express = require('express');
const router = express.Router();
const {getBootcamps,getBootcamp,createBootcamp,updateBootcamp,deleteBootcamp,getBootcampInRadius, bootcampPhotoUpload} = require('../controllers/bootcamps')

const courseRouter = require('./courses')
router.use('/:bootcampId/courses',courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampInRadius);
router.route('/:id/photo').put(bootcampPhotoUpload);
router.route('/').get(getBootcamps).post(createBootcamp);
router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);

module.exports = router;
