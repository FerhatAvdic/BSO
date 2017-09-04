var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var assigned = new Schema({
	competitionId: Schema.Types.ObjectId,
	categoryId:Schema.Types.ObjectId
});

var Judge   = new Schema({
	name: String,
	surname: String,
	email: String,
	phone: String,
	company:String,
	code: {
		type: String,
		required: false
	},
	token: {
		type:String,
		required:false
	},
	categories: [assigned]
});

module.exports = mongoose.model('Judge', Judge);

module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
}
