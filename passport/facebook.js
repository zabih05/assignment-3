var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/User');
var fbConfig = require('../fb.js');

module.exports = function(passport) {

    passport.use('facebook', new FacebookStrategy({
        clientID        : '1711109495816918',
        clientSecret    : '8dfe4ed71c47653ef84e57d3b781769f',
        callbackURL     : 'https://assignment-1-zabih.c9users.io/login/facebook/callback',
        profileFields	: ['emails', 'first_name', 'last_name']
    },

    // facebook will send back the tokens and profile
    function(access_token, refresh_token, profile, done) {
		
    	console.log('profile', profile);

		// asynchronous
		process.nextTick(function() {

			console.log("THE PROFILE EMAIL:" + profile.emails[0].value);
			
			// find the user in the database based on their id from the auth source
	        User.findOne({ 'email' : profile.emails[0].value }, function(err, user) {

				console.log("THE RETURNED USER:" + user.id);

	        	// if there is an error, stop everything and return that
	        	// ie an error connecting to the database
	            if (err)
	                return done(err);

				// if the user is found, update their record, then log them in
	            if (user) {
	            	
	            	User.findById(user.id, function (err, user) {
					  if (err) 
					  	done(err);
					    
					  
					  user.facebook.id = profile.id; // set the users facebook id	                
	                  user.facebook.token = access_token; // we will save the token that facebook provides to the user	                
	                  user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
					  
					  user.save(function (err) {
					    if (err) return done(err);
					      return done(null, user); 
					  });
					});
					
	            } else {
	                // if there is no user found with that facebook id, create them
	                var newUser = new User();

					// set all of the facebook information in our user model
					newUser.email = (profile.emails[0].value || '').toLowerCase(); // facebook can return multiple emails so we'll take the first
	                newUser.facebook.id = profile.id; // set the users facebook id	                
	                newUser.facebook.token = access_token; // we will save the token that facebook provides to the user	                
	                newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
	           
					// save our user to the database
	                newUser.save(function(err) {
	                    if (err)
	                        throw err;

	                    // if successful, return the new user
	                    return done(null, newUser);
	                });
	            }
	        });
        });
    }));
};