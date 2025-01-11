const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema  } = require("./schema.js");


module.exports.isLoggedIn = (req, res, next) => {
   
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create a new listing");
        return res.redirect("/login");
    }
    next();

};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    try {
        const id = req.params.id.trim(); // Trim leading/trailing spaces
        const listing = await Listing.findById(id);

        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        if (!listing.owner.equals(res.locals.currentUser._id)) {
            req.flash("error", "You don't have permission to edit this listing");
            return res.redirect(`/listings/${id}`);
        }

        next();
    } catch (err) {
        console.error("Middleware Error:", err);
        req.flash("error", "someting went wrong!");
        res.redirect(`/listings`);
    }
};



module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body); 
        if (error){
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(404, errMsg);
        }else {
            next();
        }
        
};

module.exports.validateReview = (req, res, next) => {
        let {error} = reviewSchema.validate(req.body); 
            if (error){
                let errMsg = error.details.map((el) => el.message).join(",");
                throw new ExpressError(404, errMsg);
            }else {
                next();
            }
            
    };
    
