const express = require('express');
const {getCourses, getCourse,addCourse,updateCourse,deleteCourse} = require('../controllers/courses');
const Course = require('../models/Course')
const advancedSearchResults = require('../middlewares/advancedSearchResults')
const router = express.Router({ mergeParams:true});


router.route('/').get(advancedSearchResults(Course,{
    path:'bootcamp',
    select:'name description'
  }),getCourses).post(addCourse);
router.route('/:id')
.get(getCourse)
.put(updateCourse)
.delete(deleteCourse);

module.exports = router;
