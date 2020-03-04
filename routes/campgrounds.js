var express = require("express"),
  router = express.Router(),
  Campground = require("../models/campground"),
  middleware = require("../middleware");

//INDEX - Show all campgrounds
router.get('/', function (req, res) {
  //Get all campgroud from db
  Campground.find({}, function (err, allCampgrounds) {
    if (err) {
      console.log("ERROR");
      console.log(err)
    } else {
      res.render('campgrounds/index', { campgrounds: allCampgrounds, currentUser: req.user });
    }
  });

  //res.render('campgrounds', { campgrounds: campgrounds });
});


//CREATE - add new campground to DB

router.post('/', middleware.isLoggedIn, function (req, res) {
  //get data from form and add to campgrounds array
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampground = { name: name, price: price, image: image, description: desc, author: author }

  //Create a ne campgounds and save to DB
  Campground.create(newCampground, function (err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      //redirect back to campgroudns page
      res.redirect('/campgrounds')
    }
  });
});

router.get('/new', middleware.isLoggedIn, function (req, res) {
  res.render('campgrounds/new.ejs');
});


//SHOW - Show more info about one campground
router.get("/:id", function (req, res) {
  //Find teh CG with the provided ID
  Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
    if (err || !foundCampground) {
      req.flash('error', 'Campground not found');
      res.redirect('back');
      console.log(err);
    } else {
      console.log(foundCampground);
      //render the show template with that campground
      res.render("campgrounds/show", { campground: foundCampground });
    }
  });

})
//Edit Campgounds routes

router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
          res.render("campgrounds/edit", { campground: foundCampground });
    });
});

//Update campgrounds routes

router.put("/:id",middleware.checkCampgroundOwnership, function (req, res) {
  //Find and update the correct campgroud
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampgrounds) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      //Redirect to show page
      res.redirect("/campgrounds/" + req.params.id);
    }
  })
})

//Destroy campground route

router.delete("/:id",middleware.checkCampgroundOwnership, function (req, res) {
  Campground.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  })
})


module.exports = router;