const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
// When you use const { validateReview } = require("../middleware.js");, you're pulling out just the validateReview property (a function or variable) from an object exported by middleware.js.
const reviewController = require("../controllers/review.js");

//reviews route
//post review route
router.post("/",validateReview,isLoggedIn,  wrapAsync(reviewController.createReview));

//DELETE REVIEW ROUTE
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;