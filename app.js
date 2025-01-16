if(process.env.NODE_ENV !=="production"){// we have two phases in project namely DEVELOPMENT and PRODUCTION(in which we deploy our project) .. 
// //as .env stores secret credentials so we should emsure that this should not be there in production phase

    require("dotenv").config();
}

// console.log(process.env);// WILL SHOW ALL ENVIRONMENT VARIABLES


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

main()
.then(()=>{
    console.log("Connected to Database");
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(dbUrl);
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}) );
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    } ,
    touchAfter: 24 * 3600,  // this helps to keep user logged in for given interval of time defined in seconds even after refreshing or closing the tab and 
    // default is 14  days
})

store.on("error", ()=>{
    console.log("ERROR in MONGO SESSION STORE");
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days - 24hrs - 60min in 1hr - 60sec in 1min - 1000milisec in 1 sec
        maxAge: 7 * 24 * 60 * 60 * 1000, // expiry date ... go and look in cookies section and look for expiry date it will show 1 week later time as we have set here from now
        httpOnly: true,// for security purpose 
    },
};
// app.get("/",(req,res)=>{
//     console.log("Hi, I am root");
// });


app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrtegy
passport.use(new LocalStrategy(User.authenticate()));//app.use() requires a middleware function, but new LocalStrategy(User.authenticate()) is not a middleware; it's a strategy instance.
// You should pass the strategy instance to passport.use()

passport.serializeUser(User.serializeUser());// serialize user means to store information of user in session
passport.deserializeUser(User.deserializeUser());// deserialize means to remove user info from session

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;// abhi jis bhi user ka session chal raha hai
    next();
}); 

// app.get("/demouser", async(req,res)=>{
//     let fakeUser = new User({
//         email: "hi@yahoo.com",
//         username: "delta"// note that though we had not defined username under UserSchema under models because this ... User.plugin(passportLocalMongoose) ... will automatically create username and password
//     });
//     let registeredUser = await User.register(fakeUser, "helloworld");// helloworld is password here
//     // register(user,password,callback or cb) ...Convenience method to register a new user instance with a given password it also check in database that new user is Unique or nit
//     res.send(registeredUser);
// })


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews",reviewRouter);

app.use("/", userRouter);
// app.get("/testListing", async (req,res)=>{
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved1");
//     res.send("successful testing");

// });
app.all("*", (req,res,next)=>{// for all incoming requests except above all 
    next(new ExpressError(404,"page not found"));
});   
app.use((err,req,res,next)=>{
    let {statuscode = 500,message = "something went wrong!"} = err;//500 and given message will are defaults
    // res.status(statuscode).send(message);
    res.render("error.ejs", {err});  
    
});// like in new listing if you enter a string in price column then database will show error because we have defined price as a number in mongoose listing schema.. also to ensure at time of entering we can add attribute type= "number" in price input column of new.ejs
app.listen(8080,()=>{
    console.log("Server is running on port 8080"); 
}); 