const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
const Competition = require('../models/competition');
var Schema = mongoose.Schema;


var Member = new Schema({
    name: {
      type: String,
      required: true
    },
		surname: {
      type: String,
      required: true
    },
		email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
		gender: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
});

var ProjectInfo = new Schema({
		title: {
      type: String,
      required: true
    },
		categoryId: {
      type: Schema.Types.ObjectId,
      required: true
    },
		abstract: {
      type: String,
      required: true
    },
    school: {
      type: String,
      required: true
    },
    year: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
		researchPaper: {
      type: String,
      required: true
    },
    video: {
      type: String,
      required: false
    },
});


var ProjectSchema   = new Schema({
  username: String,
  password: String,
  members: [ Member ],
	projectInfo: ProjectInfo,
  competitionId: Schema.Types.ObjectId,
  isGraded: {
    type: Boolean,
    default: false
  }
});

const Project = module.exports = mongoose.model('Project', ProjectSchema);
module.exports.getProjectSchema = function(){
  return ProjectSchema;
};
module.exports.getProjectById = function(id, callback){
  Project.findById(id, callback);
}

module.exports.getProjectByQuery = function(q, callback){
  const query = q;
  Project.findOne(query, callback);
}

module.exports.addProject = function(newProject, callback){
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newProject.password, salt, (err, hash) => {
      if(err) throw err;
      newProject.password = hash;
      newProject.save(callback);
    });
  });
}

/*module.exports.addProjectToCompetition = function(newProject, competitionId, callback){
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newProject.password, salt, (err, hash) => {
      if(err) throw err;
      newProject.password = hash;
    });
  });
  Competition.findById(competitionId, function(err, competition) {
      if (err) res.send(err);
      competition.projects.push(newProject);
      competition.save(callback);
  });
}*/

module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
}
