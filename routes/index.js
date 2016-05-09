var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Houseprice = mongoose.model('Houseprice');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated()){
		return next();
	}
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(passport) {

	/* GET index page. */
	router.get('/', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('index', { message: req.flash('message') });
	});

	/* GET login page. */
	router.get('/login', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('login', { message: req.flash('message') });
	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash : true  
	}));

	/* GET Registration Page */
	router.get('/signup', function(req, res){
		res.render('signup',{message: req.flash('message')});
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup',
		failureFlash : true  
	}));

	/* GET Profile Page */
	router.get('/profile', isAuthenticated, function(req, res){
		res.render('profile', { user: req.user });
	});

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	// route for facebook authentication and login
	// different scopes while logging in
	router.get('/login/facebook', 
		passport.authenticate('facebook', { scope : 'email' }
	));

	// handle the callback after facebook has authenticated the user
	router.get('/login/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/profile',
			failureRedirect : '/'
		})
	);
	
	// route for linkedin authentication and login
	// different scopes while logging in
	router.get('/login/linkedin', 
		passport.authenticate('linkedin'));

	// handle the callback after facebook has authenticated the user
	router.get('/login/linkedin/callback',
		passport.authenticate('linkedin', {
			successRedirect : '/profile',
			failureRedirect : '/'
		})
	);
	
	/* GET the monthly_house_price_indexes */
	router.get('/houseprice', isAuthenticated, function(req, res, next) {
	  Houseprice.find({}, {_id: 0}, function(err, data){
	  if(err){ return next(err); }
	  	res.json(data);
	  });
	});

	return router;
}