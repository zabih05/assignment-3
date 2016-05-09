var LinkedInStrategy = require('passport-linkedin').Strategy;
var User = require('../models/User');
var lnConfig = require('../linkedin.js');

module.exports = function(passport) {

    passport.use('linkedin', new LinkedInStrategy({
        consumerKey     : lnConfig.appID,
        consumerSecret  : lnConfig.appSecret,
        callbackURL     : lnConfig.callbackUrl,
        profileFields	: ['id', 'first-name', 'last-name', 'email-address', 'headline']
    },

    // linkedin will send back the tokens and profile
    function(token, tokenSecret, profile, done) {
		
		// asynchronous
		process.nextTick(function() {
			
			// find the user in the database based on their id from the auth source
	        User.findOne({ 'email' : profile._json.emailAddress }, function(err, user) {

	        	// if there is an error, stop everything and return that
	        	// ie an error connecting to the database
	            if (err)
	                return done(err);

				// if the user is found, update their record, then log them in
	            if (user) {
	            	
	            	User.findById(user.id, function (err, user) {
					  if (err) 
					  	done(err);
					    
					  user.linkedin.id = profile.id; // set the users linkedin id	                
	                  user.linkedin.displayName = profile.displayName; // we will save the token that linkedin provides to the user	                
					  
					  user.save(function (err) {
					    if (err) return done(err);
					      return done(null, user); 
					  });
					});
					
	            } else {
	                // if there is no user found with that linkedin id, create them
	                var newUser = new User();

					// set all of the linkedin information in our user model
					newUser.email = (profile._json.emailAddress || '').toLowerCase(); // linkedin can return multiple emails so we'll take the first
	                newUser.linkedin.id = profile.id; // set the users linkedin id              
	                newUser.linkedin.displayName  = profile.displayName
	           
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