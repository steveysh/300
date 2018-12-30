var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*
Please align the attributes with the ajax call

Jay
*/

var eventSchema = new Schema({
	local: {		  
        id: Number,
        organizer: {type: String},
		title: {type: String},
		date: {type: Date},
		startTime: {type:String},
		finishTime: {type: String},
		location: {type: String},
		description: {type: String},
		code: {type: String},
		number: {type: String},
		filename: {type: String},
		createdBy: {type: String},
		createdByID: {type: String},
		createdAt: {type: Date},
		lastModifiedAt: {type: Date},
		comment: [],
		view : []
		//file: {type:Buffer}    
	}
});

eventSchema.methods.xx=  function(){



};








module.exports = mongoose.model('Event', eventSchema);