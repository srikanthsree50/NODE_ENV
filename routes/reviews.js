const express = require('express');
const { getReviews,getReview , addReview } = require('../controllers/reviews');
const Review = require('../models/Review')
const advancedSearchResults = require('../middlewares/advancedSearchResults')
const router = express.Router({ mergeParams:true});
const { protect, authorize } = require('../middlewares/auth')

router
.route('/')
.get(advancedSearchResults(Review,{
    path:'bootcamp',
    select:'name description'
  }),getReviews)
  .post(protect,authorize('user','admin'),addReview)

  router
  .route('/:id')
.get(getReview)

module.exports = router;
