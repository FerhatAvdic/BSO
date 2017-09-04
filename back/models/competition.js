var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var Project = require('../models/project');

var competitionInfo = new Schema({
	title: String,
	description: String,
	logo: String,
	about: String,
	partners: String,
	comittee: String
});

var competitionSchema   = new Schema({
	detailsEn: {
		type: competitionInfo,
		required: false
	},
	detailsBs: {
		type: competitionInfo,
		required: false
	},
	projects: String,
	active: { type: Boolean, default: false }
});

const Competition = module.exports = mongoose.model('Competition', competitionSchema);
