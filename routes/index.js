var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");


//Route Route
router.get('/', function (req, res) {
    res.render('landing');
  });

//==============================
//AUTH ROUTE

//Register Route
router.get("/register", function (req, res) {
    res.render("register");
  })
  
  //handling user sign up
  router.post("/register", function (req, res) { 
    //req.body.username
    //req.body.passport
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err) {
            //req.flash("error", err.message)
            console.log(err);
            //return res.render("register");
            res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req,res, function () {
          req.flash("success", "Welcome to YelpCamp " + user.username)
            res.redirect("/campgrounds");
          });
    })
  });
  
  //=============
  // Login Routes
  //=============
  
  //Rendering login form
  router.get("/login", function (req, res) {
    res.render("login");
  })
  
  //Login logic
  
  router.post("/login", passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }),function (req, res) {
  
  });
  
  //Logout Route
  router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Loged you out")
    res.redirect("/")
  })
  
  //middleware
  //function isLoggedIn(req, res, next) {
  //  if (req.isAuthenticated()) {
  //      return next();
  //  }
  //  res.redirect("/login");
  //}

module.exports = router;