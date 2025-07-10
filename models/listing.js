const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reviewSchema = require("./review.js");
const Review = require("./review.js");
const { required } = require("joi");
const listingSchema = new Schema({
    title:{
        type: String,
        required: true, 
    } ,
    description: String,
    image: {
        url: String,
        filename: String,
         },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type : {
            type : String,
            enum : ['Point'],
            required: true
        },
        coordinates: {
            type : [Number],
            required: true,
        }
    }
});
// this ensure that if delete any listing then all the reviews related to that review gets deleted from database
listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
         await Review.deleteMany({_id: {$in: listing.reviews} });
    }
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;