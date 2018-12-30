/*
author: wingkwong
*/


var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	local: {
		_id: Number,
		username: {type: String, required: true, unique: true},
		password: {type: String, required: true},
		email:    {type:String, require: true, unique:true},
		resetToken: {type: String},
		mySchedule: [],
		//myFriends: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
		myFriends: [],
		requestFriendTo:  [],
		requestFriendFrom: [],
		profileImagePath: [],
		createdAt: Date,
		modifiedAt: Date,
		rating:  {type: Number, default: 0},
		countvote: {type: Number, default: 0},
		voted: [],
		myFav: [],
		invitefrom: []
	}
});

userSchema.methods.generateHash=  function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validatePassword = function(password){
	return bcrypt.compareSync(password, this.local.password);
};

//pending
/*
userSchema.methods.findByConditions = function(condition){
	var o = condition || {};
	var me = this;
	var query = me.find();

	//id
	if(o._id != null && o._id != ''){
		query.where("_id").equals(o._id);
	}

	//password
	if(o.password != null && o.password != ''){
		query.where("password").equals(o.password);
	}

	//email
	if(o.email != null && o.email != ''){
		query.where("email").equals(o.email);
	}

	query.exec();
};
*/

userSchema.methods.generateRandomCode =  function(size){
    var res = "";
    var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for ( var i=0; i < size; i++ ) {
        res += str.charAt(Math.floor(Math.random() * str.length));
	}
    return res;
};

module.exports = mongoose.model('User', userSchema);