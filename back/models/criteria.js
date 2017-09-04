var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var criteriaSchema   = new Schema({
   nameBs: String,
   nameEn: String,
   max: Number,
   value: Number,
   competitionIds: [Schema.Types.ObjectId]
});

const Criteria = module.exports = mongoose.model('Criteria', criteriaSchema);
