const Joi = require ('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location : Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null)// empty ans null string are allowed
    }).required()
});


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),// note that this min and max are required here for server side validation and the one which we have defined in review.js is for client side validation
        comment: Joi.string().required(),// required ensures that it must be filled with a data
    }).required()
})