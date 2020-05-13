var express = require("express"),
    router = express.Router({ mergeParams: true }),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
	middleware = require("../middleware");

// ================
// Comment routes
// ================

// Form to enter new comment
router.get("/new",middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			req.flash("error", err.message);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

// Post request to save the comment to respective campground!
router.post("/",middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			req.flash("error", err.message);
			res.redirect("/campgrounds");
		} else {
				Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", err.message);
				} else {
// 					associate id and username with the comment...
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("info", "Successfully Added Comment!");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});	
});

// Edit a Comment, route
router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, comment){
		if(err){
			req.flash("error", err.message);
		} else {
			res.render("comments/edit", { campground_id: req.params.id, comment: comment});
		}
	});
});

// Update comment route
router.put("/:comment_id",middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, UpdatedComment){
		if(err){
			req.flash("error", err.message);
		} else {
			req.flash("success", "Successfully Edited Comment");
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});

// Delete a comment 
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err, comment){
		if(err){
			req.flash("error", err.message);
		} else {
			req.flash("success", "Successfully deleted Comment");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


module.exports = router;