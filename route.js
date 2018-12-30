/*
author: wingkwong
*/
module.exports = function(app, passport, User, Event, Mail, fs) {

    //HOME
    app.get('/', isAuthNav, authHome, function(req, res) {
        res.render('index.ejs', {
            nav: req.nav,
            user: req.user
        });
    });

    //FAQs
    app.get('/faqs', isAuthNav, function(req, res) {
        res.render('faqs.ejs', {
            nav: req.nav,
            user: req.user
        });
    });

    //ABOUT US
    app.get('/about', isAuthNav, function(req, res) {
        res.render('about_us.ejs', {
            nav: req.nav,
            user: req.user
        });
    });

    //TERMS OF USE
    app.get('/termsOfUse', isAuthNav, function(req, res) {
        res.render('term_of_use.ejs', {
            nav: req.nav,
            user: req.user
        });
    });

    //PRIVACY POLICY
    app.get('/privacypolicy', isAuthNav, function(req, res) {
        res.render('privacy_policy.ejs', {
            nav: req.nav,
            user: req.user
        });
    });

    // LOGIN
    app.get('/login', function(req, res) {
        res.render('login.ejs', {
            message: req.flash('loginMessage')
        });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/schedule',
        failureRedirect: '/login',
        failureFlash: true
    }));

    //LOGOUT
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // REGISTER
    app.get('/register', function(req, res) {
        res.render('register.ejs', {
            message: req.flash('registerMessage')
        });
    });

    app.post('/register', passport.authenticate('local-register', {
        successRedirect: '/',
        failureRedirect: '/register',
        failureFlash: true
    }));

    //PROFILE
    app.get('/user/:id', isLoggedIn, function(req, res) {
        var me = req.user.id;
        var notificationFriendRequest = null;
        var notificationActivityFrom = null;

        User.findById(req.params.id, function(err, target) {
            console.log("--------------------");
            //console.log(JSON.stringify(target));
            if (err) {
                response = {
                    "error": true,
                    "message": "Error fetching data"
                };
            } else {

                if (target._id == me) {
                    //fetch notification
                    //console.log("target.requestFriendFrom.length=" + target.local.requestFriendFrom.length);
                    //console.log("target.local.invitefrom=" + target.local.invitefrom.length);
                    //console.log(me.local.myFriends.length);
                    if (target.local.requestFriendFrom.length > 0) {
                        /*var temp = temp || [];
                        temp.push(target.local.requestFriendFrom);
                        temp.push(target.local.invitefrom); */
                        //notification.friendrequest= target.local.requestFriendFrom;
                        //notification.friendinvite= target.local.invitefrom;
                        //notification.push(target.local.requestFriendFrom);
                        //notification.push(target.local.invitefrom);
                        //console.log(target.local.invitefrom);
                        notificationFriendRequest = target.local.requestFriendFrom;
                        console.log(notificationFriendRequest);

                        //console.log(notification.From);
                    }
                    if (target.local.invitefrom.length > 0) {
                        notificationActivityFrom = target.local.invitefrom;
                        console.log(notificationActivityFrom);
                    }
                }



                res.render('profile.ejs', {

                    user: req.user, //self
                    target: target,
                    notificationFriendRequest: notificationFriendRequest,
                    notificationActivityFrom: notificationActivityFrom
                });
            }
        });



    });
    //EDIT
    app.get('/user/:id/edit', isLoggedIn, function(req, res) {
        res.render('edit.ejs', {
            user: req.user,
            message: req.flash('editMessage')
        });
    });



    //RESET
    app.get('/user/resetPassword/:token', function(req, res) {
        res.render('reset.ejs', {
            message: req.flash('resetMessage')

        });
    });

    /*app.get('/user/:id/friends', isLoggedIn, function(req, res) {
        res.render('friends.ejs', {
                    nav: req.nav,
                    user: req.user,
                    //friendlist:friendlist
                    
                    //friendlistArray: friendlistArray, 
                        });
    });*/




    app.get('/user/:id/friends', isLoggedIn, function(req, res) {
        var me = req.user.id;
        var perPage = 9,
            CurrentPage = 1,
            sorts = 0,
            page = req.query.page - 1;

        currentPage = +req.query.page;

        User.findById(req.params.id, function(err, target) {
            console.log("--------------------");

            if (err) {
                response = {
                    "error": true,
                    "message": "Error fetching data"
                };
            } else {

                if (target._id == me) {
                    //fetch notification

                    if (target.local.myFriends.length > 0) {

                        var Friends = Friends || [];

                        Friends = target.local.myFriends;


                        User
                            .find({
                                '_id': {
                                    $in: Friends
                                }
                            })
                            .limit(perPage)
                            .skip(perPage * page)
                            .exec(function(err, friend) {
                                User.count().exec(function(err, count) {
                                    if (err) {
                                        response = {
                                            "error": true,
                                            "myFriends": null
                                        };
                                        res.json(response);

                                    } else {

                                        response = {
                                            "error": false,
                                            "myFriends": JSON.stringify(friend)
                                        };



                                    }
                                    res.render('friends.ejs', {
                                        nav: req.nav,
                                        user: req.user,
                                        friend: friend,
                                        page: page,
                                        pages: (count - 1) / perPage,
                                        count: count,
                                        currentPage: currentPage,

                                    });
                                })
                            })

                    }
                }
            }

        });

    });

    //PROFILE - EDIT INFO - CHANGE PASSWORD
    //TODO: revamp resposne msg
    app.post('/updatePassword', isLoggedIn, function(req, res) {
        var response = {};
        User.findById(req.user.id, function(err, user) {
            if (err) {
                response = {
                    "error": true,
                    "message": "Error fetching data"
                };
            } else {
                var oldPwd = req.body.oldPwd;
                var newPwd = req.body.newPwd;
                var rePwd = req.body.rePwd;

                if ((newPwd == rePwd) && user.validatePassword(oldPwd) && (oldPwd != newPwd)) {
                    user.local.password = user.generateHash(newPwd);
                    user.local.modifiedAt = new Date();


                    req.flash('editMessage', 'password is changed successfully.');

                    user.save(function(err) {
                        if (err) {

                            response = {
                                "error": true,
                                "message": "Error updating data"
                            };
                        } else {
                            response = {
                                "error": false,
                                "message": "Data is updated for " + req.user.id + "old: " + oldPwd + "new: " + newPwd
                            };
                        }
                        res.json(response);
                    })
                } else {
                    req.flash('editMessage', 'fail to change password');
                }
            }
        });
    });

    app.post('/updateProfilePic/:id', isLoggedIn, function(req, res) {
        var response = {};
        User.findById(req.user.id, function(err, user) {
            if (err) {
                response = {
                    "error": true,
                    "message": "Error fetching data"
                };
            } else {
				var newImage=[];
				

                //Recieve ajax POST base64
                var imgData = req.body.data;

                //Check if imgData is null or not
                if (imgData != null) {
                    //Filter data:URL
                    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
                    var buffer = new Buffer(base64Data, 'base64');

                    //Using the upload-time to name the image
                    var imgName = new Date().getTime();

                   // user.local.profileImagePath = imgName;
                    //Declare a new path for storing image
					newImage.push(imgName);
					user.local.profileImagePath=newImage;
                    var newPath = __dirname + "/profileImg/" + imgName + ".png";
                    fs.writeFile(newPath, buffer, function(err) {
                        if (err) {
                            // res.send(err);
                        } else {
                            console.log(err);
                            //res.send("Image Saved");
                        }
                    });
                }

                //Put data attributes to Event




                //Saving
                user.save(function(err) {
                    if (err) {
                        response = {
                            "error": true,
                            "message": "Error updating data"
                        };
                    } else {
                        response = {
                            "error": false,
                            "message": "A profile picture updated"
                        };
                    }
                    res.json(response);
                });

            }
        });
    });


    app.post('/updateScore/:id', function(req, res) {
        var response = {};
        var me = req.user._id;
        var userId = req.params.id;
        User.findById(userId, function(err, targetUser) {

            //console.log(JSON.stringify(user));
            if (err) {

                response = {
                    "error": true,
                    "message": "Error fetching data"
                };
            } else {
                User.findById(me, function(err, user) {
                    console.log(req.body);
                    console.log(user.local.rating);
                    console.log(req.body.newScore);
                    console.log(user.local.countvote);
                    user.local.rating = user.local.rating + parseInt(req.body.newScore);
                    user.local.countvote = user.local.countvote + 1;

                    var vote = vote || {};

                    vote.FromId = me;

                    var voteFrom = targetUser.local.voted;

                    voteFrom.push(vote);

                    targetUser.local.voted = voteFrom;
                    user.save(function(err) {
                        if (err) {
                            response = {
                                "error": true,
                                "message": "Error updating data"
                            };
                        } else {
                            response = {
                                "error": false,
                                "message": "Data is updated for " + req.params.id + 'data ' + user
                            };
                        }
                        res.json(response);
                        targetUser.save(function(err) {
                            if (err) {} //TODO: flash msg
                            else {

                            }
                        });
                    })
                });
            }
        });



    });

    //PROFILE - EDIT INFO - CHANGE EMAIL
    //TODO: revamp resposne msg
    app.put('/updateEmail', isLoggedIn, function(req, res) {
        var response = {};

        User.findById(req.user.id, function(err, user) {
            if (err) {
                response = {
                    "error": true,
                    "message": "Error fetching data"
                };
            } else {
                var oldemailaddress = req.body.oldemailaddress;
                var newemailaddress = req.body.newemailaddress;

                if (user.local.email == oldemailaddress) {
                    user.local.email = newemailaddress;
                    user.local.modifiedAt = new Date();

                    req.flash('editMessage', 'email changed successfully.');

                    user.save(function(err) {
                        if (err) {
                            response = {
                                "error": true,
                                "message": "Error updating data"
                            };
                        } else {

                            response = {
                                "error": false,
                                "message": "Data is updated for " + req.user.id + 'user ' + user
                            };
                        }
                        res.json(response);
                    })
                } else {
                    req.flash('editMessage', 'email not found.');
                }


            }
        });

    });
    //reset
    app.put('/resetPassword/:token', function(req, res) {
        var response = {};
        User.findOne({
            'local.resetToken': req.params.token
        }, function(err, user) {
            if (err) {
                response = {
                    "error": true,
                    "message": "Error fetching data"
                };
            } else {
                var newPwd = req.body.newPwd;
                var rePwd = req.body.rePwd;



                if (newPwd == rePwd && user.local.password != newPwd) {
                    user.local.password = user.generateHash(newPwd);
                    user.local.modifiedAt = new Date();
                    user.save(function(err) {
                        if (err) {
                            response = {
                                "error": true,
                                "message": "Error updating data"
                            };
                        } else {
                            response = {
                                "error": false,
                                "message": "Updated the data"
                            };
                        }
                        res.json(response);
                    })
                }



            }
        });
    });
    app.put('/addFriend/:token', isLoggedIn, function(req, res) {

        var response = {};
        var me = req.user._id;
        var userId = req.params.token;


        User.findById(userId, function(err, targetUser) {
            if (err) {
                //TODO: flash msg
            } else {
                User.findById(me, function(err, user) {
                    if (err) {
                        //TODO: flash msg
                    } else {
                        var from = from || {};

                        from.requestFromId = me;
                        from.requestFrom = user.local.username;
                        from.requestDate = new Date().getTime();

                        //Jay: for Steve

                        var reqFrom = targetUser.local.requestFriendFrom;
                        //add new record
                        var index = reqFrom.indexOf(from.toString());


                        reqFrom.push(from);
                        //obj -> string
                        //reqFrom = JSON.stringify(reqFrom);
                        //update db

                        targetUser.local.requestFriendFrom = reqFrom;

                        //............................................

                        var to = to || {};
                        to.requestToId = targetUser.id;
                        to.requestTo = targetUser.local.username;
                        to.requestDate = new Date().getTime();

                        var reqTo = user.local.requestFriendTo;

                        //add new record
                        reqTo.push(to);
                        //obj -> string
                        //reqTo = JSON.stringify(reqTo);
                        //update db
                        user.local.requestFriendTo = reqTo;


                        //............................................

                        user.save(function(err) {
                            if (err) {} //TODO: flash msg
                            else {
                                targetUser.save(function(err) {
                                    if (err) {} //TODO: flash msg
                                    else {

                                    }
                                });
                            }
                        });
                    }
                });


            }
        });
    });


    app.put('/removeFriend/:token', isLoggedIn, function(req, res) {

        var response = {};
        //console.log(JSON.stringify(req.user));
        var me = req.user._id;
        //var me =JSON.stringify(req.user._id);
        var userId = req.params.token;
        //console.log("addFriend: me="+ me);

        User.findById(userId, function(err, targetUser) {
            if (err) {
                //TODO: flash msg
            } else {
                User.findById(me, function(err, user) {
                    if (err) {
                        //TODO: flash msg
                    } else {
                        var from = from || {};

                        from.requestFromId = me;
                        from.requestFrom = user.local.username;




                        var reqFrom = targetUser.local.requestFriendFrom;


                        var index = reqFrom.indexOf(from.toString());

                        if (index != -1)
                            reqFrom.splice(index, 1);
                        targetUser.local.requestFriendFrom = reqFrom;

                        //............................................

                        var to = to || {};
                        to.requestToId = targetUser.id;
                        to.requestTo = targetUser.local.username;


                        var reqTo = user.local.requestFriendTo;

                        //add new record

                        var index = reqTo.indexOf(to.toString());

                        if (index != -1)
                            reqTo.splice(index, 1);
                        user.local.requestFriendTo = reqTo;


                        //............................................

                        user.save(function(err) {
                            if (err) {} //TODO: flash msg
                            else {
                                targetUser.save(function(err) {
                                    if (err) {} //TODO: flash msg
                                    else {

                                    }
                                });
                            }
                        });
                    }
                });


            }
        });
    });


    app.put('/acceptFriend/:id', isLoggedIn, function(req, res) {
        var response = {};
        var me = req.user._id;
        var userId = req.params.id;
        User.findById(userId, function(err, targetUser) {
            if (err) {
                //TODO: flash msg

            } else {
                User.findById(me, function(err, user) {
                    if (err) {
                        //TODO: flash msg
                    } else {

                        // jay---------------

                        var userFrd = user.local.myFriends;
                        var targetFrd = targetUser.local.myFriends;
                        var requestFrdFrom = user.local.requestFriendFrom;
                        var requestFrdTo = targetUser.local.requestFriendTo;
                        // -- update myFriend column
                        if (userFrd.indexOf(targetUser._id) == -1) {
                            userFrd.push(targetUser._id);
                            console.log(userFrd);
                            console.log(user.local.myFriends);
                            targetFrd.push(me);
                        }
                        // -- remove requestFriendFrom
                        for (var i = 0; i < requestFrdFrom.length; i++) {
                            if (requestFrdFrom[i].requestFromId == userId) {
                                // hit -> remove this obj
                                requestFrdFrom.splice(i, 1);
                            }
                        }
                        // -- remove requestTo
                        for (var i = 0; i < requestFrdTo.length; i++) {
                            if (requestFrdTo[i].requestToId == me) {
                                // hit -> remove this obj
                                requestFrdTo.splice(i, 1);
                            }
                        }


                        // jay---------------


                        user.save(function(err) {
                            if (err) {} //TODO: flash msg
                            else {
                                targetUser.save(function(err) {
                                    if (err) {} //TODO: flash msg
                                    else {
                                        res.redirect('profile.ejs');
                                    }
                                });
                            }
                        });
                    }
                });


            }
        });
    });
    app.put('/rejectAddFriend/:id', isLoggedIn, function(req, res) {

        var response = {};
        var me = req.user._id;
        var userId = req.params.id;


        User.findById(userId, function(err, targetUser) {
            if (err) {
                //TODO: flash msg
            } else {
                User.findById(me, function(err, user) {
                    if (err) {
                        //TODO: flash msg
                    } else {

                        var rejectto = rejectto || {};

                        rejectto.requestToId = me;
                        rejectto.requestTo = user.local.username;




                        var reqTo = targetUser.local.requestFriendTo;


                        var index = reqTo.indexOf(rejectto.toString());
                        console.log(index);
                        if (index != -1) {
                            reqTo.splice(index, 1);
                        }
                        targetUser.local.requestFriendTo = reqTo;

                        console.log(targetUser.local.requestFriendFrom);
                        //............................................

                        var rejectfrom = rejectfrom || {};
                        rejectfrom.requestToId = targetUser.id;
                        rejectfrom.requestTo = targetUser.local.username;


                        var reqFrom = user.local.requestFriendFrom;

                        //add new record

                        var index = reqFrom.indexOf(rejectfrom.toString());

                        if (index != -1) {
                            reqFrom.splice(index, 1);

                            user.local.requestFriendFrom = reqFrom;
                        }


                        //............................................

                        user.save(function(err) {
                            if (err) {} //TODO: flash msg
                            else {
                                targetUser.save(function(err) {
                                    if (err) {} //TODO: flash msg
                                    else {
                                        res.redirect('profile.ejs');
                                    }
                                });
                            }
                        });
                    }
                });


            }
        });
    });

    //rejectInvite
    app.put('/rejectInvite/:uuid', isLoggedIn, function(req, res) {

        var response = {};
        var actId = req.body.id;
        var userId = req.params.uuid;


        User.findById(userId, function(err, targetUser) {
            if (err) {
                //TODO: flash msg
            } else {



                var rejectinvite = rejectinvite || {};

                rejectinvite.From = targetUser.local.username;
                rejectinvite.FromActivity = actId;




                var inviteFrom = targetUser.local.invitefrom;
                var index = inviteFrom.indexOf(rejectinvite.toString());
                console.log(index);
                if (index != -1) {
                    inviteFrom.splice(index, 1);
                }
                targetUser.local.invitefrom = inviteFrom;
                console.log(targetUser.local.invitefrom);

                targetUser.save(function(err) {
                    if (err) {} //TODO: flash msg
                    else {

                    }
                });
            }
        });
    });
    //RESET PASSWORD BY EMAIL

    app.get('/users/resetPassword/:token', function(req, res) {
        var token = req.params.token;
        User.findOne({
            'local.resetToken': token
        }, function(err, user) {
            if (err) {
                response = {
                    "error": true,
                    "message": "Error fetching data"
                };
            } else {
                if (!user) res.redirect('/');
            }
            res.render('reset.ejs');
        });
        res.json(response);
    });

    app.put('/resetPasswordByEmail', function(req, res) {
        var user = new User();
        var mail = Mail;
        var response = {};
        var email = req.body.email;
        var token = user.generateRandomCode(16);
        var o = o || {};
        o.email = email;
        o.token = token;
        User.findOne({
            'local.email': email
        }, function(err, user) {
            if (err) {
                response = {
                    "error": true,
                    "message": "Error fetching data"
                };
            } else {
                if (user != null) {
                    user.local.resetToken = token;
                    user.save(function(err) {
                        if (err) {
                            response = {
                                "error": true,
                                "message": "Error updating data"
                            };
                        } else {
                            response = {
                                "error": false,
                                "message": "Data is updated for " + req.params.id + 'user ' + user
                            };



                            mail.resetsend(o, function(err, res) {

                                if (err) {
                                    //callback(err);
                                } else {
                                    //TODO:...

                                }
                            });
                        }
                        res.json(response);
                    })
                } else {
                    //TODO: prompt error msg...
                }

            }
        });
    });
    //remindemail
    /*app.put('/remindEmail', function(req, res) {
        var user = new User();
        var mail = Mail;
        var response = {};
        var o = o || {};
        o.email = email;


        User.findOne({'local.email': email}, function(err,user){
            if(err) {
                
                response = {"error" : true,"message" : "Error fetching data"};
            } else{


                user.save(function(err){
                    if(err) {
                        response = {"error" : true,"message" : "Error updating data"};
                    } else {
                        response = {"error" : false,"message" : "Data is updated for "+req.params.id + 'user ' + user};
                        
                
                    
                        mail.remindersend(o, function(err, res){
                            
                            if (err){
                                //callback(err);
                            } else {
                                //TODO:...
                                
                            }
                        });
                    }
                    res.json(response);
                })
            }
        });
    });*/

    //ACTIVITY LIST

    app.get('/activities', isLoggedIn, function(req, res) {
        var perPage = 9,
            CurrentPage = 1,
            sorts = 0,
            page = req.query.page - 1,
            type = "" + req.query.type;

        console.log("type = " + type);



        currentPage = +req.query.page;

        if (req.query.sorts == 1) {
            Event
                .find({})
                .limit(perPage)
                .skip(perPage * page)
                .sort({
                    'local.date': -1
                })
                .exec(function(err, event) {
                    Event.count().exec(function(err, count) {
                        res.render('activities.ejs', {
                            event: event,
                            nav: req.nav,
                            user: req.user,
                            page: page,
                            pages: (count - 1) / perPage,
                            count: count,
                            currentPage: currentPage,
                            type: type,
							sorts:req.query.sorts


                        })
                    })
                })
        } else if (req.query.sorts == 2) {
            Event
                .find({})
                .limit(perPage)
                .skip(perPage * page)
                .sort({
                    'local.time': -1
                })
                .exec(function(err, event) {
                    Event.count().exec(function(err, count) {
                        res.render('activities.ejs', {
                            event: event,
                            nav: req.nav,
                            user: req.user,
                            page: page,
                            pages: (count - 1) / perPage,
                            count: count,
                            currentPage: currentPage,
                            type: type,
							sorts:req.query.sorts


                        })
                    })
                })
        } else if (req.query.sorts == 3) {
            Event
                .find({})
                .limit(perPage)
                .skip(perPage * page)
                .sort({
                    'local.location': -1
                })
                .exec(function(err, event) {
                    Event.count().exec(function(err, count) {
                        res.render('activities.ejs', {
                            event: event,
                            nav: req.nav,
                            user: req.user,
                            page: page,
                            pages: (count - 1) / perPage,
                            count: count,
                            currentPage: currentPage,
                            type: type,
							sorts:req.query.sorts


                        })
                    })
                })
        } else {
            Event
                .find({})
                .limit(perPage)
                .skip(perPage * page)
                .sort({
                    'local.lastModifiedAt': -1
                })
                .exec(function(err, event) {
                    Event.count().exec(function(err, count) {
                        res.render('activities.ejs', {
                            event: event,
                            nav: req.nav,
                            user: req.user,
                            page: page,
                            pages: (count - 1) / perPage,
                            count: count,
                            currentPage: currentPage,
                            type: type,
							sorts:req.query.sorts


                        })
                    })
                })
        }



    });
    //working
    app.get('/activities/details/:id', isLoggedIn, function(req, res) {
        //var ip = req.headers['x-forwarded-for'] ||req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

        var count = 0;
        var idArray = [];
        var id = req.params.id;
        var me = req.user.id;
		var page = 1;
		
		
		console.log("Page" + req.query.page);
		
		if(req.query.page!=null){
			page = req.query.page ;
		}
		
		console.log("Page" + page);
		
        Event.findById(id, function(err, event) {
            if (err) {
                console.log(err);
            } else {
                User.findById(req.user.id, function(err, target) {

                    idArray = event.local.view;

                    if (idArray.indexOf(me) == -1) {
                        idArray.push(me);
                        event.local.view = idArray;
                        event.save(function(err) {
                            if (err) {
                                response = {
                                    "error": true,
                                    "message": "Error updating data"
                                };
                            } else {
                                response = {
                                    "error": false,
                                    "message": "An event's view is updated"
                                };
                            }

                        });
                    }

                    count = idArray.length;
                    console.log(event.local.view);

                    if (target.local.myFriends.length > 0) {

                        var Friends = Friends || [];

                        Friends = target.local.myFriends;


                        User.find({
                            '_id': {
                                $in: Friends
                            }
                        }, function(err, friend) {

                            if (err) {

                                response = {
                                    "error": true,
                                    "myFriends": null
                                };
                                res.json(response);
                            } else {

                                response = {
                                    "error": false,
                                    "myFriends": JSON.stringify(friend)
                                };
                            }

                            
                            res.render('detail.ejs', {
                                nav: req.nav,
                                user: req.user,
                                friend: friend,
                                event: event,
                                count: count,
								page : page
								
                            });

                        });


                    }else{
                           res.render('detail.ejs', {
                                nav: req.nav,
                                user: req.user,
                                friend: [],
                                event: event,
                                count: count,
								page : page
                            });
                    }


                    
                });
            }
        });

    });


    app.post('/inviteFriend/:id', function(req, res) {
        var response = {};
        var me = req.user._id;
        var checkBoxArray = req.body.checkboxArray;
        var checkBox;




        User.findById(me, function(err, user) {
            for (var i = 0; i < checkBoxArray.length; i++) {
                checkBox = checkBoxArray[i];
                console.log(checkBox);
                User.findOne({
                    'local.username': checkBox
                }, function(err, targetUser) {
                    if (err) {
                        response = {
                            "error": true,
                            "message": "Error fetching data"
                        };
                    } else {



                        var invite = invite || {};
                        invite.From = user.local.username;
                        invite.FromActivities = req.body.id;


                        var inviteFrom = targetUser.local.invitefrom;
                        console.log(inviteFrom.indexOf(JSON.stringify(invite)));
                        if (inviteFrom.indexOf(JSON.stringify(invite)) < 0) {
                            inviteFrom.push(invite);
                            targetUser.local.invitefrom = inviteFrom;
                            console.log(JSON.stringify(invite));
                            console.log(targetUser.local.invitefrom);

                        }

                        targetUser.save(function(err) {
                            if (err) {
                                response = {
                                    "error": true,
                                    "message": "Error updating data"
                                };
                            } else {
                                response = {
                                    "error": false,
                                    "message": "Updated the data"
                                };
                            }
                            //res.json(response);
                        })
                    }


                });
            }
        });
    });
    //wingkwong
    app.get('/activities/edit/:id', isLoggedIn, function(req, res) {
        var id = req.params.id; //event id


        Event.findById(id, function(err, event) {
            if (err) {
                console.log(err);
            } else {
                console.log(event);
                if (event.local.createdBy == req.user.local.username) {
                    res.render('edit_activity.ejs', {
                        event: event,
                        nav: req.nav,
                        user: req.user
                    });
                } else {
                    //user is not authorizated.
                    //TODO: redirect 
                }



            }
        });


    });

    //activity detail -> join activity
    app.post('/joinActivity/:id', isLoggedIn, function(req, res) {
        var response = {};
        var activityId = req.params.id;
        console.log("activityId=" + activityId);
        User.findById(req.user.id, function(err, user) {
            if (err) {
                response = {
                    "error": true,
                    "message": "Error fetching user"
                };
            } else {

                Event.findById(activityId, function(err, event) {
                    if (err) {
                        response = {
                            "error": true,
                            "message": "Error fetching event"
                        };
                    } else {
                        console.log(event);

                        var o = o || {};

                        o.id = activityId;
                        /*
                        o.title = event.local.title;
                        o.organizer = event.local.organizer;
                        o.start = event.local.startTime;
                        o.end = event.local.finishTime;
                        o.location = event.local.location;
                        o.description = event.local.description;
                        o.radio = event.local.radio;
                        o.code = event.local.code;
                        o.filename = event.local.filename;  
                        */
                        o.createdAt = new Date().getTime();

                        var mySchedule = user.local.mySchedule;
                        mySchedule.push(o);
                        user.local.mySchedule = mySchedule;

                        user.save(function(err) {
                            if (err) {} //TODO: flash msg
                            else {
                                user.save(function(err) {
                                    if (err) {} //TODO: flash msg
                                    else {

                                    }
                                });
                            }
                        });
                        res.json(response);
                    }
                });



            }
        });
    });

    app.get('/search', isLoggedIn, function(req, res) {
        var perPage = 9,
            CurrentPage = 1,
            sorts = 0,
            type = "" + req.query.type,
            page = req.query.page - 1,
            keyword = req.params.keyword;
        number = req.query.number;
        tag = req.query.tag;
        dstart = req.query.dstart;
        dend = req.query.dend;
		tFrom = req.query.tFrom;
        tTo = req.query.tTo;
		url = req.url;
		paging = req.query.page;

        console.log("number=" + req.query.sorts);
        console.log("number=" + number);
        console.log("tag=" + tag);
        console.log("keyword=" + keyword);
        console.log("destart=" + dstart);
        console.log("dend=" + dend);
        console.log("destart=" + tFrom);
        console.log("dend=" + tTo);
		console.log(url);


        currentPage = +req.query.page;


        if (req.query.sorts == 1) {
            Event
                .find({})
                .limit()
                .skip()
                .sort({
                    'local.date': -1
                })
                .exec(function(err, event) {
                    Event.count().exec(function(err, count) {
                        res.render('search.ejs', {
                            event: event,
                            nav: req.nav,
                            user: req.user,
                            page: page,
                            pages: (count - 1) / perPage,
                            count: count,
                            currentPage: currentPage,
                            type: type,
                            keyword: keyword,
                            number: number,
                            tag: tag,
							sorts:req.query.sorts,
							tFrom:tFrom,
							tTo:tTo,
							url:url,
							paging:paging


                        })
                    })
                })
        } else if (req.query.sorts == 2) {
            Event
                .find({})
                .limit()
                .skip()
                .sort({
                    'local.startTime': -1
                })
                .exec(function(err, event) {
                    Event.count().exec(function(err, count) {
                        res.render('search.ejs', {
                            event: event,
                            nav: req.nav,
                            user: req.user,
                            page: page,
                            pages: (count - 1) / perPage,
                            count: count,
                            currentPage: currentPage,
                            type: type,
                            keyword: keyword,
                            number: number,
                            tag: tag,
							sorts:req.query.sorts,
							tFrom:tFrom,
							tTo:tTo,
							url:url,
							paging:paging


                        })
                    })
                })
        } else if (req.query.sorts == 3) {
            Event
                .find({})
                .limit()
                .skip()
                .sort({
                    'local.location': -1
                })
                .exec(function(err, event) {
                    Event.count().exec(function(err, count) {
                        res.render('search.ejs', {
                            event: event,
                            nav: req.nav,
                            user: req.user,
                            page: page,
                            pages: (count - 1) / perPage,
                            count: count,
                            currentPage: currentPage,
                            type: type,
                            keyword: keyword,
                            number: number,
                            tag: tag,
							sorts:req.query.sorts,
							tFrom:tFrom,
							tTo:tTo,
							url:url,
							paging:paging

                        })
                    })
                })
        } else {
            Event
                .find({})
                .limit()
                .skip()
                .sort({
                    'local.lastModifiedAt': -1
                })
                .exec(function(err, event) {
                    Event.count().exec(function(err, count) {
                        res.render('search.ejs', {
                            event: event,
                            nav: req.nav,
                            user: req.user,
                            page: page,
                            pages: (count - 1) / perPage,
                            count: count,
                            currentPage: currentPage,
                            type: type,
                            keyword: keyword,
                            number: number,
                            tag: tag,
							sorts:req.query.sorts,
							tFrom:tFrom,
							tTo:tTo,
							url:url,
							paging:paging

                        })
                    })
                })
        }
    });

    app.get('/search/:keyword', isLoggedIn, function(req, res) {
        var perPage = 9,
            CurrentPage = 1,
            sorts = 0,
            type = "" + req.query.type,
            page = req.query.page - 1,
            keyword = req.params.keyword;
        number = req.query.number;
        tag = req.query.tag;
        dstart = req.query.dstart;
        dend = req.query.dend;
		tFrom = req.query.tFrom;
        tTo = req.query.tTo;
		url = req.url;
        paging = req.query.page;

        console.log("number=" + req.query.sorts);
        console.log("number=" + number);
        console.log("tag=" + tag);
        console.log("keyword=" + keyword);
        console.log("destart=" + dstart);
        console.log("dend=" + dend);
        console.log("destart=" + tFrom);
        console.log("dend=" + tTo);
		console.log(url);


        currentPage = +req.query.page;


        if (req.query.sorts == 1) {
            Event
                .find({})
                .limit()
                .skip()
                .sort({
                    'local.date': -1
                })
                .exec(function(err, event) {
                    Event.count().exec(function(err, count) {
                        res.render('search.ejs', {
                            event: event,
                            nav: req.nav,
                            user: req.user,
                            page: page,
                            pages: (count - 1) / perPage,
                            count: count,
                            currentPage: currentPage,
                            type: type,
                            keyword: keyword,
                            number: number,
                            tag: tag,
							sorts:req.query.sorts,
							tFrom:tFrom,
							tTo:tTo,
							url:url,
							paging:paging
							


                        })
                    })
                })
        } else if (req.query.sorts == 2) {
            Event
                .find({})
                .limit()
                .skip()
                .sort({
                    'local.startTime': -1
                })
                .exec(function(err, event) {
                    Event.count().exec(function(err, count) {
                        res.render('search.ejs', {
                            event: event,
                            nav: req.nav,
                            user: req.user,
                            page: page,
                            pages: (count - 1) / perPage,
                            count: count,
                            currentPage: currentPage,
                            type: type,
                            keyword: keyword,
                            number: number,
                            tag: tag,
							sorts:req.query.sorts,
							tFrom:tFrom,
							tTo:tTo,
							url:url,
							paging:paging
							


                        })
                    })
                })
        } else if (req.query.sorts == 3) {
            Event
                .find({})
                .limit()
                .skip()
                .sort({
                    'local.location': -1
                })
                .exec(function(err, event) {
                    Event.count().exec(function(err, count) {
                        res.render('search.ejs', {
                            event: event,
                            nav: req.nav,
                            user: req.user,
                            page: page,
                            pages: (count - 1) / perPage,
                            count: count,
                            currentPage: currentPage,
                            type: type,
                            keyword: keyword,
                            number: number,
                            tag: tag,
							sorts:req.query.sorts,
							tFrom:tFrom,
							tTo:tTo,
							url:url,
							paging:paging
							


                        })
                    })
                })
        } else {
            Event
                .find({})
                .limit()
                .skip()
                .sort({
                    'local.lastModifiedAt': -1
                })
                .exec(function(err, event) {
                    Event.count().exec(function(err, count) {
                        res.render('search.ejs', {
                            event: event,
                            nav: req.nav,
                            user: req.user,
                            page: page,
                            pages: (count - 1) / perPage,
                            count: count,
                            currentPage: currentPage,
                            type: type,
                            keyword: keyword,
                            number: number,
                            tag: tag,
							sorts:req.query.sorts,
							tFrom:tFrom,
							tTo:tTo,
							url:url,
							paging:paging


                        })
                    })
                })
        }
    });

    app.get('/advance', isLoggedIn, function(req, res) {
        var perPage = 9,
            CurrentPage = 1,
            page = req.query.page
        keyword = req.params.keyword;


        currentPage = +req.query.page;


        Event
            .find({})
            .limit(perPage)
            .skip(perPage * page)
            .sort({
                name: 'asc'
            }).exec(function(err, event) {
                Event.count().exec(function(err, count) {
                    res.render('advance.ejs', {
                        event: event,
                        nav: req.nav,
                        user: req.user,
                        page: page,
                        pages: count / perPage,
                        count: count,
                        currentPage: currentPage,
                        keyword: keyword

                    })
                })
            })
    });



    app.post('/commentForm/:id', isLoggedIn, function(req, res) {
        var response = {};
        console.log("activityId=" + req.params.id);
        var id = req.params.id;

        Event.findById(id, function(err, event) {

            var objToday = new Date(),
                weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
                dayOfWeek = weekday[objToday.getDay()],
                domEnder = function() {
                    var a = objToday;
                    if (/1/.test(parseInt((a + "").charAt(0)))) return "th";
                    a = parseInt((a + "").charAt(1));
                    return 1 == a ? "st" : 2 == a ? "nd" : 3 == a ? "rd" : "th"
                }(),
                dayOfMonth = today + (objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder : objToday.getDate() + domEnder,
                months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
                curMonth = months[objToday.getMonth()],
                curYear = objToday.getFullYear(),
                curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
                curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
                curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds(),
                curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";

            var today = curHour + ":" + curMinute + " " + curMeridiem + " " + dayOfWeek + " " + dayOfMonth + " of " + curMonth + ", " + curYear;
            var o = o || {};

            o.content = req.body.comment;
            o.commentAt = today;
            o.commentBy = req.user.local.username;

            console.log(o);


            event.local.comment.push(o);

              

            console.log("Comment" + req.user.local.username);


            console.log("Comment" + req.body.comment);
            console.log("Comment" + event.local.comment);

            event.save(function(err) {
                if (err) {
                    response = {
                        "error": true,
                        "message": "Error updating data"
                    };
                } else {
                    response = {
                        "error": false,
                        "message": "An activity is updated"
                    };
                }
                res.json(response);
            });
        });

    });

    app.post('/search', isLoggedIn, function(req, res) {
        var keyword = req.params.keyword;



    });

    app.get('/detail', isLoggedIn, function(req, res) {

        res.render('detail.ejs', {
            user: req.user
        });
    });




    //MY SCHEDULE
    app.get('/schedule', isLoggedIn, function(req, res) {
        res.render('schedule.ejs', {
            user: req.user
        });
    });


    /*
     * wingkwong: TEST - START
     */

    app.get('/users', function(req, res) {
        var response = {};
        User.find({}, function(err, data) {
            if (err) {
                response = {
                    "error": true,
                    "message": "Error fetching data"
                };
            } else {
                response = {
                    "error": false,
                    "message": data
                };
            }
            res.json(response);
        });
    });

    app.get('/users/:id', function(req, res) {
        var response = {};
        User.findById(req.params.id, function(err, data) {
            // test case _id : 57fe3f8004a6a60d14012798
            if (err) {
                response = {
                    "error": true,
                    "message": "Error fetching data"
                };
            } else {
                response = {
                    "error": false,
                    "message": data
                };
            }
            res.json(response);
        });
    });

    app.delete('/users/deleteAll', function(req, res) {
        var response = {};

        User.remove({}, function(err, data) {
            if (err) {
                response = {
                    "error": true,
                    "message": "Error fetching data"
                };
            } else {
                response = {
                    "error": false,
                    "message": data
                };
            }
            res.json(response);
        });

    });

    app.delete('/events/deleteAll', function(req, res) {
        var response = {};
        Event.remove({}, function(err, data) {
            if (err) {
                response = {
                    "error": true,
                    "message": "Error fetching data"
                };
            } else {
                response = {
                    "error": false,
                    "message": data
                };
            }
            res.json(response);
        });
    });

    app.delete('/events/deleteById', function(req, res) {
        var response = {};
        var id = "58f86f370c406b0231cd104c";
        Event.remove({_id: id}, function(err, data) {
            if (err) {
                response = {
                    "error": true,
                    "message": "Error fetching data"
                };
            } else {
                response = {
                    "error": false,
                    "message": data
                };
            }
            res.json(response);
        });
    });

    app.put('/users/:id/updatePassword', function(req, res) {
        var response = {};
        User.findById(req.params.id, function(err, data) {
            if (err) {
                response = {
                    "error": true,
                    "message": "Error fetching data"
                };
            } else {
                if (req.body.userEmail !== undefined) {
                    data.username = req.body.userEmail;
                }
                if (req.body.userPassword !== undefined) {
                    data.userPassword = req.body.userPassword;
                }
                var test = new User();
                data.local.username = 'admin';
                data.local.password = test.generateHash('admin');

                data.save(function(err) {
                    if (err) {
                        response = {
                            "error": true,
                            "message": "Error updating data"
                        };
                    } else {
                        response = {
                            "error": false,
                            "message": "Data is updated for " + req.params.id + 'data ' + data
                        };
                    }
                    res.json(response);
                })
            }
        });
    });

    /*
     * wingkwong: TEST - END
     */
    /*  
    //Dick version
    app.put('/create' ,isLoggedIn, function(req, res) {   //add the new data created from create.ejs to their schedule
    var response = {};
    User.findById(req.params.id,function(err,data){
                if(err) {
                    response = {"error" : true,"message" : "Error fetching data"};
                }
                else{
                var event = {
                  userId : req.user.id, 
                  inputName: req.body.inputName,
                  inputDate: req.body.inputDate,
                  inputStartTime: req.body.inputFinishTime,
                  inputLocation: req.body.inputLocation,
                  inputDescription: req.body.inputDescription,
                  optionsPublic: req.body.optionsPublic,
                  optionsPrivate: req.body.optionsPrivate,
                  inputCode:req.body.optionsPrivate     // not sure suitable variable like Object item should be added in the  user.js/ other js or even no need?
                 }
                }
                
                 User.save(function(err){
                        if(err) {
                            response = {"error" : true,"message" : "Error loading into schedule"};
                        } else {
                            User.insert(event);             
                            response = {"error" : false,"message" : "Updated into schedule"};
                        }
                        res.json(response);
                    })  
      });
    });
    /*

    /*
    Dummy Set function for schedule page
    */
    app.put('/setSchedule', function(req, res) {
        //var id = req.user.id;
        var id = '5883896f1b86c23360da2c80';
        var dummySchedule = '[{"title":"Activity 1","id":"1","start":"2017-02-13 09:00:00","end":"2017-02-13 10:30:00"},{"title":"Activity 2","id":"2","start":"2017-02-25 10:00:00","end":"2017-02-28 11:30:00"},{"title":"Activity 3","id":"2","start":"2017-02-28 10:00:00","end":"2017-02-28 11:30:00"}]';
        // test case _id : 580980d18dd5ed29d4e8215b
        User.findById(id, function(err, user) {
            if (err) {
                response = {
                    "error": true,
                    "message": "Error fetching data"
                };
            } else {

                user.local.mySchedule = dummySchedule;

                user.save(function(err) {
                    if (err) {
                        response = {
                            "error": true,
                            "message": "Error updating data"
                        };
                    } else {
                        response = {
                            "error": false,
                            "message": "Data is updated for " + req.params.id + 'user ' + user
                        };
                    }
                    res.json(response);
                });
            }
        });
    });


    app.get('/getSchedule', isLoggedIn, function(req, res) {
        var id = req.user.id;
        //var id = '580980d18dd5ed29d4e8215b';
        console.log("getSchedule id=" + id);
        User.findById(id, function(err, user) {
            console.log("user=" + user);
            if (err) {
                response = {
                    "error": true,
                    "mySchedule": null
                };
                res.json(response);
            } else {
                var arrIds = [];
                for (var i = 0; i < user.local.mySchedule.length; i++) {
                    console.log(user.local.mySchedule[i]);
                    console.log("user.local.mySchedule[i].id=" + user.local.mySchedule[i].id);
                    arrIds.push(user.local.mySchedule[i].id);
                }

                Event.find({
                    '_id': {
                        $in: arrIds
                    }
                }, function(err, event) {
                    if (err) {
                        response = {
                            "error": true,
                            "mySchedule": null
                        };
                        res.json(response);
                    } else {
                        console.log(event);
                        response = {
                            "error": false,
                            "mySchedule": JSON.stringify(event)
                        };
                        res.json(response);
                    }
                });

            }

        });
    });

    //CREATE - create activity
    app.post('/createActivityForm', isLoggedIn, function(req, res) {
        var response = {};
        User.findById(req.user.id, function(err, user) {
            if (err) {
                response = {
                    "error": true,
                    "message": "Error fetching data"
                };
            } else {
                console.log("req" + JSON.stringify(req.body));
                //Create a new Event object
                var event = new Event();

                //Recieve ajax POST base64
                var imgData = req.body.data;

                //Check if imgData is null or not
                if (imgData != null) {
                    //Filter data:URL
                    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
                    var buffer = new Buffer(base64Data, 'base64');

                    //Using the upload-time to name the image
                    var imgName = new Date().getTime();

                    event.local.filename = imgName;
                    //Declare a new path for storing image
                    var newPath = __dirname + "/img/" + imgName + ".png";
                    fs.writeFile(newPath, buffer, function(err) {
                        if (err) {
                            // res.send(err);
                        } else {
                            console.log(err);
                            //res.send("Image Saved");
                        }
                    });
                }

                //Put data attributes to Event
                event.local.title = req.body.title;
                event.local.organizer = req.body.organizer;
                event.local.date = req.body.date;				
                event.local.startTime = req.body.startTime;
                event.local.finishTime = req.body.finishTime;


				//working2
				//Format time
			    var str1 = new Date(event.local.startTime).getHours()<10? '0' + new Date(event.local.startTime).getHours(): new Date(event.local.startTime).getHours();
                var str2 = new Date(event.local.startTime).getMinutes()<10? '0' + new Date(event.local.startTime).getMinutes() : new Date(event.local.startTime).getMinutes(); 
		        var str3 = str1+":"+str2;
		
		        var str4 = new Date(event.local.finishTime).getHours()<10? '0' + new Date(event.local.finishTime).getHours(): new Date(event.local.finishTime).getHours();
                var str5 = new Date(event.local.finishTime).getMinutes()<10? '0' + new Date(event.local.finishTime).getMinutes(): new Date(event.local.finishTime).getMinutes(); 
		        var str6 = str4+":"+str5;
				
                event.local.startTime = str3;
                event.local.finishTime = str6;				
				
                event.local.location = req.body.location;
                event.local.description = req.body.description;
                event.local.code = req.body.code;
                event.local.number = req.body.number;
                event.local.createdBy = user.local.username;
				event.local.createdByID = req.user.id;
                event.local.createdAt = req.body.createdAt;
                event.local.lastModifiedAt = req.body.lastModifiedAt;
				

                console.log("title= " + req.body.title);
                console.log("organizer= " + req.body.organizer);
                console.log("date= " + req.body.date);
                console.log("startTime= " + req.body.startTime);
                console.log("finishTime= " + req.body.finishTime);
                console.log("location= " + req.body.location);
                console.log("description= " + req.body.description);
                console.log("code= " + req.body.code);
                console.log("number= " + req.body.number);
                console.log("filename= " + imgName);
                console.log("createdBy " + user.local.username);
                console.log("createdAt " + req.body.createdAt);
                console.log("lastModifiedAt " + req.body.lastModifiedAt);
                console.log("times= " + str3);
                console.log("times2 " + str6);
  


                //Saving
                event.save(function(err) {
                    if (err) {
                        response = {
                            "error": true,
                            "message": "Error updating data = " + err
                        };
                    } else {
                        response = {
                            "error": false,
                            "message": "An event is created"
                        };
                    }
                    res.json(response);
                });
                /*
                    Dear Nick
                    1. after finding the user, you needa create a new Event object
                        e.g var event = new Event();
                    2. then put those data attributes to event
                        - you can reference the code in passport.js (line 84)
                    3. then save it, use response obj for logging (like the above codes)

                    Happy Coding,
                    Jay
                */
            }
        });
    });

    app.get('/createActivity', isLoggedIn, function(req, res) {
        res.render('create.ejs', {
            user: req.user
        });
    });

    //Edit - Activity

    app.post('/updateActivity/:id', isLoggedIn, function(req, res) {
        var response = {};
        var id = req.params.id; //activity id

        Event.findById(id, function(err, event) {
            if (err) {
                response = {
                    "error": true
                };
            } else {
                //Recieve ajax POST base64
                var imgData = req.body.data;

                //Check if imgData is null or not
                if (imgData != null) {
                    //Filter data:URL
                    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
                    var buffer = new Buffer(base64Data, 'base64');

                    //Using the upload-time to name the image
                    var imgName = new Date().getTime();

                    event.local.filename = imgName;
                    //Declare a new path for storing image
                    var newPath = __dirname + "/img/" + imgName + ".png";
                    fs.writeFile(newPath, buffer, function(err) {
                        if (err) {
                            // res.send(err);
                        } else {
                            console.log(err);
                            //res.send("Image Saved");
                        }
                    });
                }

                //Put data attributes to Event
                event.local.title = req.body.title;
                event.local.organizer = req.body.organizer;
                event.local.date = req.body.date;
                event.local.startTime = req.body.startTime;
                event.local.finishTime = req.body.finishTime;
                event.local.location = req.body.location;
                event.local.description = req.body.description;
                event.local.code = req.body.code;
                event.local.number = req.body.number;
                event.local.createdAt = req.body.createdAt;
                event.local.lastModifiedAt = req.body.lastModifiedAt;
                
                //Format time
                var str1 = new Date(event.local.startTime).getHours()<10? '0' + new Date(event.local.startTime).getHours(): new Date(event.local.startTime).getHours();
                var str2 = new Date(event.local.startTime).getMinutes()<10? '0' + new Date(event.local.startTime).getMinutes() : new Date(event.local.startTime).getMinutes(); 
                var str3 = str1+":"+str2;
        
                var str4 = new Date(event.local.finishTime).getHours()<10? '0' + new Date(event.local.finishTime).getHours(): new Date(event.local.finishTime).getHours();
                var str5 = new Date(event.local.finishTime).getMinutes()<10? '0' + new Date(event.local.finishTime).getMinutes(): new Date(event.local.finishTime).getMinutes(); 
                var str6 = str4+":"+str5;
                
                event.local.startTime = str3;
                event.local.finishTime = str6;  

                console.log("title= " + req.body.title);
                console.log("organizer= " + req.body.organizer);
                console.log("date= " + req.body.date);
                console.log("startTime= " + req.body.startTime);
                console.log("finishTime= " + req.body.finishTime);
                console.log("location= " + req.body.location);
                console.log("description= " + req.body.description);
                console.log("code= " + req.body.code);
                console.log("number= " + req.body.number);
                console.log("filename= " + imgName);
                console.log("createdAt " + req.body.createdAt);
                console.log("lastModifiedAt " + req.body.lastModifiedAt);



                //Saving
                event.save(function(err) {
                    if (err) {
                        response = {
                            "error": true,
                            "message": "Error updating data"
                        };
                    } else {
                        response = {
                            "error": false,
                            "message": "An activity is updated"
                        };
                    }
                });
            }
            res.json(response);
        });

    });

    //TEST EVENT
    app.get('/events', function(req, res) {
        var response = {};
        Event.find({}, function(err, data) {
            if (err) {
                response = {
                    "error": true,
                    "message": "Error fetching data"
                };
            } else {
                response = {
                    "error": false,
                    "message": data
                };
            }
            res.json(response);
        });
    });

    //Remove Favourites
    app.post('/removeFromFav/:id', isLoggedIn, function(req, res) {
        var response = {};
        var activityId = req.params.id;
        console.log("activityId=" + activityId);
        User.findById(req.user.id, function(err, user) {
            if (err) {
                response = {
                    "error": true,
                    "message": "Error fetching user"
                };
            } else {
                if (user.local.myFav != null) {
                    console.log("Running");
                    var arrayLength = user.local.myFav.length;
                    var index;
                    for (var i = 0; i < arrayLength; i++) {
                        if (user.local.myFav[i] == activityId) {
                            index = i;
                            console.log("Activity id found in index: " + index);
                        }
                    }
                    console.log(user.local.myFav);
                    user.local.myFav.splice(index, 1);
                    console.log(user.local.myFav);
                }

                user.save(function(err) {
                    if (err) {} else {
                        response = {
                            "error": false,
                            "message": "My Fav updated"
                        };
                    }
                    res.json(response);
                });
            }

        });
    });

    //Add to Favourites
    app.post('/addToFav/:id', isLoggedIn, function(req, res) {
        var response = {};
        var activityId = req.params.id;
        console.log("activityId=" + activityId);
        User.findById(req.user.id, function(err, user) {
            if (err) {
                response = {
                    "error": true,
                    "message": "Error fetching user"
                };
            } else {
                if (user.local.myFav != null) {
                    console.log("Running");
                    var arrayLength = user.local.myFav.length;
                    for (var i = 0; i < arrayLength; i++) {
                        if (user.local.myFav[i] == activityId) {
                            console.log("Already exists in myFav array");
                            return;
                        }
                    }
                    user.local.myFav.push(activityId);
                } else {
                    user.local.myFav.push(activityId);
                }

                user.save(function(err) {
                    if (err) {} else {
                        response = {
                            "error": false,
                            "message": "My Fav updated"
                        };
                    }
                    res.json(response);
                });
            }

        });
    });

    //Favourites - my favourites page
    app.get('/user/:id/favourites', isLoggedIn, function(req, res) {
        var perPage = 9,
            CurrentPage = 1,
            sorts = 0,
            page = req.query.page - 1,
            type = "" + req.query.type;

        console.log("type = " + type);



        currentPage = +req.query.page;

        if (req.query.sorts == 1) {
            Event
                .find({})
                .limit()
                .skip()
                .sort({
                    'local.date': -1
                })
                .exec(function(err, event) {
                    Event.count().exec(function(err, count) {
                        res.render('favourites.ejs', {
                            event: event,
                            nav: req.nav,
                            user: req.user,
                            page: page,
                            pages: (count - 1) / perPage,
                            count: count,
                            currentPage: currentPage,
                            type: type,
							sorts:req.query.sorts


                        })
                    })
                })
        } else if (req.query.sorts == 2) {
            Event
                .find({})
                .limit()
                .skip()
                .sort({
                    'local.time': -1
                })
                .exec(function(err, event) {
                    Event.count().exec(function(err, count) {
                        res.render('favourites.ejs', {
                            event: event,
                            nav: req.nav,
                            user: req.user,
                            page: page,
                            pages: (count - 1) / perPage,
                            count: count,
                            currentPage: currentPage,
                            type: type,
							sorts:req.query.sorts


                        })
                    })
                })
        } else if (req.query.sorts == 3) {
            Event
                .find({})
                .limit()
                .skip()
                .sort({
                    'local.location': -1
                })
                .exec(function(err, event) {
                    Event.count().exec(function(err, count) {
                        res.render('favourites.ejs', {
                            event: event,
                            nav: req.nav,
                            user: req.user,
                            page: page,
                            pages: (count - 1) / perPage,
                            count: count,
                            currentPage: currentPage,
                            type: type,
							sorts:req.query.sorts


                        })
                    })
                })
        } else {
            Event
                .find({})
                .limit()
                .skip()
                .sort({
                    'local.lastModifiedAt': -1
                })
                .exec(function(err, event) {
                    Event.count().exec(function(err, count) {
                        res.render('favourites.ejs', {
                            event: event,
                            nav: req.nav,
                            user: req.user,
                            page: page,
                            pages: (count - 1) / perPage,
                            count: count,
                            currentPage: currentPage,
                            type: type,
							sorts:req.query.sorts


                        })
                    })
                })
        }



    });


};


/*
    ROUTE MIDDLEWARE 
*/
function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

function authHome(req, res, next) {
    if (req.isAuthenticated())
        res.redirect('/schedule');

    return next();

}

/*
    NAVBAR MIDDLEWARE 
*/
function isAuthNav(req, res, next) {

    if (req.isAuthenticated()) {
        req.nav = 'auth';
        next();
    }
    req.nav = null;
    next();
}