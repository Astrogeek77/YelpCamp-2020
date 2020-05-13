// var mongoose = require("mongoose");
// var Campground = require("./models/campground");
// var Comment   = require("./models/comment");
 
// var seeds = [
//     {
//         name: "Cloud's Rest", 
//         image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
//         description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
//     },
//     {
//         name: "Desert Mesa", 
//         image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
//         description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
//     },
//     {
//         name: "Canyon Floor", 
//         image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
//         description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
//     }
// ]
 
// // function seedDB(){
// //    //Remove all campgrounds
// //    Campground.remove({}, function(err){
// //         if(err){
// //             console.log(err);
// //         }
// //         console.log("removed campgrounds!");
// //         Comment.remove({}, function(err) {
// //             if(err){
// //                 console.log(err);
// //             }
// //             console.log("removed comments!");
// //              //add a few campgrounds
// //             data.forEach(function(seed){
// //                 Campground.create(seed, function(err, campground){
// //                     if(err){
// //                         console.log(err)
// //                     } else {
// //                         console.log("added a campground");
// //                         //create a comment
// //                         Comment.create(
// //                             {
// //                                 text: "This place is great, but I wish there was 									internet",
// //                                 author: "Homer"
// //                             }, function(err, comment){
// //                                 if(err){
// //                                     console.log(err);
// //                                 } else {
// // 									//add a few comments
// //                                     campground.comments.push(comment);
// //                                     campground.save();
// //                                     console.log("Created new comment");
// //                                 }
// //                             });
// //                     }
// //                 });
// //             });
// //         });
// //     }); 
    
// // }

// async function seedDB(){
// 	// await Campground.remove({})
// 	// console.log("Campgrounds removed!");
// 	// await Comment.remove({})
// 	// console.log("Comments removed!");
	
// 		for(const seed of seeds){
// 			let campground = await Campground.create(seed);
// 			console.log("Campground Created!");
// 			let comment = await Comment.create({
// 				text: "This place is great, but I wish there was 									internet",
// 				author: "Homie"
// 			});
// 			console.log("Comment Created!");
// 		}
// 		campground.comments.push(comment);
// 		campground.save();
// 		console.log("Data saved!")
// }
 
// module.exports = seedDB;


var mongoose = require("mongoose"); 
var Campground = require("./models/campground"); 
var Comment = require("./models/comment"); 

var data = [
    {
        name: "Beach",
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",  
        description: "Beach picture"     
    },
    
    {
        name: "Mountain",
        image: "https://www.filmhousecinema.com/sites/filmhousecinema.com/files/shows/2017/Mountain-3.jpg", 
        description: "Mountain picture"     
    },
      
    {
        name: "Plains",
        image: "https://www.climatehubs.oce.usda.gov/sites/default/files/styles/featured_image/public/NP-about.jpeg?itok=fT4055LK", 
        description: "Plains picture"     
    }
]; 


function seedDB(){
    Campground.remove({}, function(err){
        if(err){
            console.log(err); 
        } else {
            console.log("Removed Database"); 
        }

        //Add some campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err); 
                } else {
                    console.log("New campground added successfully"); 
                    Comment.create(
                        {
                            text: "This place is great, but I wish there was internet", 
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err); 
                            } else {
                                campground.comments.push(comment); 
                                campground.save(); 
                                console.log("Created new comment"); 
                            }
                        }); 

                } 
            }); 
        }); 
    }); 
} 

module.exports = seedDB; 