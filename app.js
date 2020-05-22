require('dotenv').config();
// Dependencies...
var express = require("express"), 
	app = express(), 
	bodyParser = require("body-parser"), 
	mongoose = require("mongoose"),
    Campground = require("./models/campground"),
	Comment = require("./models/comment"),
    seedDB = require("./seeds"),
	LocalStrategy = require("passport-local"),
	passport = require('passport'),
	flash = require("connect-flash"),
	back = require("express-back"),
	User = require("./models/user"),
	methodOverride = require("method-override"),
	commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index");

// ================
// Mongoose config
// ================
mongoose.connect("mongodb+srv://admin:admin@cluster0-kzg9b.mongodb.net/test?retryWrites=true&w=majority");

app.use(bodyParser.urlencoded({extended: true})); 
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
// flash config
app.use(flash());
// moment config
app.locals.moment = require('moment');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);


// ================
// Passport Config
// ================
app.use(require("express-session")({
	secret: "Science is the only way for humanity to know themselves, Science makes us Alive!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(back());
// middleware to get username
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	res.locals.info = req.flash("info");
	next();
});

// Configuirng routes and shortening url...
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// error 404
app.get("/*", function(req, res){
	res.render("index");
});

// Port Settings...
app.listen(process.env.PORT || 3000, ()=> console.log("The Yelpcamp server has started.")); 
