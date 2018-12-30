/*

//wingkwong: pending

var User = require('../models/user');

var UserController = function() {};

UserController.prototype.updateProfile = function(req, res) {
 	//TODO:  
};

UserController.prototype.updatePassword = function(req, res) {
	var password = req.body.newpassword;
	var confirmedPassword = req.body.newpassconfirm;
	var id = req.params.id;

	User.updatePassword(id, password);
};

UserController.prototype.updateEmail = function(req, res) {
 	//TODO:  
};

UserController.prototype.updateFrdList = function(req, res) {
 	//TODO:  
};


module.exports = new UserController();

*/