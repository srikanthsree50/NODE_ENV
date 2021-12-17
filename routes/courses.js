const express = require('express');
const {getCourses, getCourse,addCourse,updateCourse,deleteCourse} = require('../controllers/courses');
const Course = require('../models/Course')
const advancedSearchResults = require('../middlewares/advancedSearchResults')
const router = express.Router({ mergeParams:true});
const { protect, authorize } = require('../middlewares/auth')

router
.route('/')
.get(advancedSearchResults(Course,{
    path:'bootcamp',
    select:'name description'
  }),getCourses)
  .post(protect ,authorize('publisher','admin'),addCourse);

  router
  .route('/:id')
.get(getCourse)
.put(protect,authorize('publisher','admin'),updateCourse)
.delete(protect,authorize('publisher','admin'),deleteCourse);

module.exports = router;
