const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing");
const {isLoggedIn , isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage})// this mentions the destination of uploaded images to be saved...it will automaticallt create upload folder and store uploaded images in that




router
    .route("/")
    .get(wrapAsync(listingController.index))// we have im ported whole file so we need only index part hence needs to be defined like this
    .post(isLoggedIn, upload.single("listing[image]"), validateListing,  wrapAsync(listingController.createListing)
);

//NEW ROUTE
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))

//EDIT ROUTE
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;













////these codes have been modified above using router.route

// //INDEX ROUTE
// router.get("/", wrapAsync(listingController.index));// we have im ported whole file so we need only index part hence needs to be defined like this

// //NEW ROUTE
// router.get("/new", isLoggedIn, isLoggedIn, wrapAsync(listingController.renderNewForm));

// //SHOW ROUTE
// router.get("/:id",  wrapAsync(listingController.showListing));


// //create route
// router.post("/",isLoggedIn,  validateListing, wrapAsync(listingController.createListing));

// //EDIT ROUTE
// router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


// //UPDATE ROUTE

// router.put("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(listingController.updateListing));

// //DELETE ROUTE
// router.delete("/:id", isLoggedIn,isOwner,  wrapAsync(listingController.destroyListing));