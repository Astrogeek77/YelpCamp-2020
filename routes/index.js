var express = require("express"),
    router = express.Router({ mergeParams: true }),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
	passport = require('passport'),
	User = require("../models/user"),
	Feedback = require("../models/feedback"),
	middleware = require("../middleware");

var	async = require("async");
var	nodemailer = require("nodemailer");
var crypto = require("crypto");

// Root route
router.get("/", function(req, res){
	res.render("landing"); 
}); 

// // Feedback route
// router.get("/feedback",isLoggedIn, function(req, res){
// 	User.findById(req.params._id, function(err, user){
// 		if(err){
// 			console.log(err);
// 		} else {
// 			res.render("feedback", { user: user })
// 		}
// 	})
// });

// router.post("/feedback",isLoggedIn, function(req, res){
// 	User.findById(req.params._id, function(err, user){
// 		if(err){
// 			console.log(err);
// 		} else {
// 	        console.log(req.body.feedback);
// 			Feedback.create(req.body.feedback, function(err, feedback){
// 				if(err){
// 					console.log(err);
// 				} else {
// // 					associate id and username with the feedback...
// 					feedback.author.id = req.user._id;
// 					feedback.author.username = req.user.username;
// 					feedback.save();
// 					user.feedback.push(feedback);
// 					user.save();
// 					res.redirect("/feedback");
// 				}
// 			});
// 		}

	
		


// ================
// Sign up routes
// ================
router.get("/register", function(req, res){
	res.render("register");
});

router.post("/register", function(req, res){
	var newUser = new User({
		username: req.body.username,
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		avatar: req.body.avatar,
		email: req.body.email
	});
	if(req.body.adminCode === process.env.ADMIN_CODE){
		newUser.isAdmin = true;
	}
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("info", "Successfully Registered!, welcome " + req.body.username);
			console.log(user);
			res.redirect("/campgrounds");
		});
	});
});

// ================
// Login Form
// ================
router.get("/login", function(req, res){
	res.render("login");
})


router.post("/login",passport.authenticate("local", {
	// successRedirect: ("/campgrounds", ("success", "Welcome to YelpCamp!")),
	failureRedirect: "/login", 
	failureFlash: true
}), function(req, res){
	req.flash("success", "WelcomeBack to YelpCamp, " + req.body.username);
	res.redirect("/campgrounds");
});

// to end a login session
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged You out!");
	res.redirect("/campgrounds");
});

// user profile
router.get("/user/:id", function(req, res){
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			req.flash("error", "Something went wrong..")
			res.redirect("/");
		} else if (!foundUser){
			req.flash("error", "user not found.");
			res.redirect("/");
		} 
		else {
			Campground.find().where("author.id").equals(foundUser._id).exec(function(err, campgrounds){
			 if(err){
				req.flash("error", "Something went wrong..")
				res.redirect("/");
			 }
			res.render("user/show", { user: foundUser, campgrounds:campgrounds });
			})
			
		}
	})
})
// =====================
// password reset routes
// =====================

// forgot password
router.get('/forgot', function(req, res) {
  res.render('forgot');
});

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'webdevgeek777@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'webdevgeek777@gmail.com',
        subject: 'YelpCamp Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'webdevgeek777@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'webdevgeek777@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/campgrounds');
  });
});

module.exports = router;