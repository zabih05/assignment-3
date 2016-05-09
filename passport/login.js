var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/User');
var bCrypt = require('bcrypt-nodejs');

module.exports = function (passport) {
    
    passport.use('login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback : true,
      },
      function(req, email, password, done) { 
        
        if (email)
          email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
        
        // check in mongo if a user with username exists or not
        User.findOne({ 'email' :  email }, 
          function(err, user) {
            // In case of any error, return using the done method
            if (err)
              return done(err);
            // Username does not exist, log error & redirect back
            if (!user){
              console.log('User Not Found with Email '+ email);
              return done(null, false, 
                    req.flash('message', 'User Not found.'));                 
            }
            // User exists but wrong password, log the error 
            if (!isValidPassword(user.local.password, password)){
              console.log('Invalid Password');
              return done(null, false, 
                  req.flash('message', 'Invalid Password'));
            }
            // User and password both match, return user from 
            // done method which will be treated like success
            return done(null, user);
          }
        );
    }));
    
    var isValidPassword = function(cipherPass, password){
        return bCrypt.compareSync(password, cipherPass);
    }
};    
