var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	flash = require('connect-flash'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	methodOverride = require('method-override'),
	Campground = require('./models/campground'),
	Comment = require('./models/comment'),
	User = require('./models/user'),
	seedDB = require('./seeds');

//Requiring Route
var commentRoutes = require('./routes/comments'),
	campgroundRoutes = require('./routes/campgrounds'),
	indexRoutes = require('./routes/index');

//Seed teh database
//seedDB();

//mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });

console.log(process.env.DATABASEURL);

var url = process.env.DATABASEURL || 'mongodb://localhost:27017/yelp_camp';
mongoose
	.connect(url, {
		useNewUrlParser: true,
		useCreateIndex: true
	})
	.then(() => {
		console.log('connected to DB!');
	})
	.catch((err) => {
		console.log('ERROR', err.message);
	});

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

//PASSPORT CONFIG
app.use(
	require('express-session')({
		secret:
			'El Arsenal Football Club es un club de fútbol profesional con sede en Holloway, Londres, Inglaterra' /* Pasar a variable de entorno */,
		resave: false,
		saveUninitialized: false
	})
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');

	next();
});

//Campground.create(
// {
//  name: 'Granite Hill',
//  image: 'https://www.appletonmn.com/vertical/Sites/%7B4405B7C1-A469-4999-9BC5-EC3962355392%7D///uploads/campground_(2).jpg',
//  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor //incididunt ut'
//}, function (err, campground) {
//  if (err) {
//    console.log(err);
//  } else {
//    console.log("campgrounds created");
//    console.log(campground);
//  }
//});

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

/*app.listen(3000, function () {
  console.log('The app server is running');
});*/

app.listen(process.env.PORT || 3000, process.env.IP, function() {
	console.log('server is listening...');
});
