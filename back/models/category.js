var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var categoryInfo = new Schema({
    name: String,
    shortDesc: String,
    longDesc: String
});

var categorySchema   = new Schema({
	competitionIds: [Schema.Types.ObjectId],
  detailsBs: categoryInfo,
  detailsEn: categoryInfo,
  icon: String,
});

const Category = module.exports = mongoose.model('Category', categorySchema);
