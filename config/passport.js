/*
author: wingkwong
*/

var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');


module.exports = function(passport) {
    
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


    passport.use('local-login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, username, password, done) {
        if (username)
            username = username.toLowerCase(); 

        process.nextTick(function() {
            User.findOne({ 'local.username' :  username }, function(err, user) {
                if (err)
                    return done(err);

                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));

                if (!user.validatePassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                else
                    return done(null, user);
            });
        });

    }));

    
    passport.use('local-register', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, username, password, done) {  
        if (username)
            username = username.toLowerCase(); 
        process.nextTick(function() {

            if(!req.user){
	
                User.findOne({ 'local.email' :  req.body.email }, function(err, user) {
                    if (err)
                        return done(err);
                    
                    if (user) {
                        return done(null, false, req.flash('registerMessage', 'That email address is already taken.'));
                    } 
					
                });
            }else {  return done(null, req.user);       }

            if(req.body.password != req.body.confirmPassword){
                 return done(null, false, req.flash('registerMessage', 'Passwords do not match.'));
            }

            if (!req.user) {
                User.findOne({ 'local.username' :  username }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, false, req.flash('registerMessage', 'That username is already taken.'));
                    } else {
                        var newUser = new User();

                        newUser.local.username = username;
                        newUser.local.password = newUser.generateHash(password);
                        newUser.local.email = req.body.email;
                        newUser.local.createdAt = new Date();
                        newUser.local.modifiedAt = new Date();
                        newUser.save(function(err) {
                            if (err)
                                return done(err);

                            return done(null, newUser);
                        });
                    }

                });
            }else {
                return done(null, req.user);
            }

        });

    }));
};