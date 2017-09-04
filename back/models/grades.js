var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var criterion = new Schema({
    nameBs: String,
    nameEn: String,
    max: Number,
    value: Number
});

var gradesSchema   = new Schema({
   competitionId: Schema.Types.ObjectId,
   judgeId: Schema.Types.ObjectId,
   categoryId: Schema.Types.ObjectId,
   projectId: Schema.Types.ObjectId,
   evaluation: [criterion]
});

const Grades = module.exports = mongoose.model('Grades', gradesSchema);
