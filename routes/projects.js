const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Project = require('../models/project');
var multer = require('multer');

// Register
router.post('/register', (req, res, next) => {
  var newProject = new Project({
    username: req.body.username,
    password: req.body.password,
    members: req.body.members,
    projectInfo: req.body.projectInfo,
    competitionId: req.body.competitionId
  });

  Project.addProject(newProject, (err, user) => {
    if(err){
      res.json({success: false, msg:'Failed to register user'});
    } else {
      res.json({success: true, msg:'User registered'});
    }
  });
});

//Report - number of graded projects
router.route('/projects/graded')
.get(passport.authenticate('adminJWT', {session:false}),function(req, res) {

    Project.aggregate([
      {$match: {competitionId: mongoose.Types.ObjectId(req.query.competitionId)}},
      {$count: 'projects'}
    ],function(err, projects) {
        if (err) res.send(err);

        Project.aggregate([
          {$match: {competitionId: mongoose.Types.ObjectId(req.query.competitionId), isGraded: true}},
          {$count: 'gradedProjects'}
        ],function(err, gradedProjects) {
            if (err) res.send(err);
            if (gradedProjects.length>0 && projects.length>0){
              res.json({
                graded: gradedProjects[0].gradedProjects,
                total: projects[0].projects
              });
            }
            else{
              console.log(gradedProjects, projects);
              res.json({
                graded: null,
                total: null
              });
            }

        });

    });
});

//Projects assigned to a judge
router.route('/projects/judge')
    .get(passport.authenticate('judgeJWT', {session:false}),function(req, res) {
        Project.find( { "projectInfo.categoryId": {$in: req.query.categoryIds}, "competitionId": req.query.competitionId },'_id projectInfo competitionId',function(err, projects) {
            if (err) res.send(err);
            res.json(projects);
        });
    });
//Project by Id assigned to a judge
router.route('/projects/judge/:project_id')
    .get(passport.authenticate('judgeJWT', {session:false}), function(req, res) {
        Project.findById(req.params.project_id, function(err, project) {
            if (err)
                res.send(err);
            res.json(project);
        });
    });


// Authenticate
router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const competitionId = req.body.competitionId;

  Project.getProjectByQuery({username: username, competitionId: competitionId}, (err, project) => {
    if(err) throw err;
    if(!project){
      return res.json({success: false, msg: 'project not found'});
    }

    Project.comparePassword(password, project.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch){
        var payload = {
          _id: project._id,
          isProject: true,
          isAdmin: false
        };
        var options = {
          expiresIn: 604800
        };
        const token = jwt.sign(payload, config.secret, options);

        res.json({
          success: true,
          token: 'JWT '+token,
          project: {
            id: project._id,
            username: project.username
          }
        });
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});

//All projects by competitionId
router.route('/projects')
    .get(passport.authenticate('adminJWT', {session:false}), function(req, res) {
        Project.find( { competitionId: mongoose.Types.ObjectId(req.query.competitionId) },function(err, projects) {
            if (err) res.send(err);
            res.json(projects);
        });
    });

//Get project by ID
router.route('/projects/:projectId')
    .get(passport.authenticate(['projectJWT', 'adminJWT'], {session:false}), function(req, res) {
        Project.findById(req.params.projectId, function(err, project) {
            if (err)
                res.send(err);
            res.json(project);
        });
    }) //Update project
    .put(passport.authenticate(['projectJWT', 'adminJWT'], {session:false}), function(req, res) {
        Project.findById(req.params.projectId, function(err, project) {
            if (err)
                res.send(err);
                project.username= req.body.username,
                project.members= req.body.members,
              	project.projectInfo= req.body.projectInfo,
                project.competitionId= req.body.competitionId
            project.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'Project successfully updated!' });
            });

        });
    }) // Devare project
    .delete(passport.authenticate('adminJWT', {session:false}), function(req, res) {
        Project.remove({
            _id: req.params.projectId
        }, function(err, message) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted project!' });
        });
    });

//FILE UPLOAD
var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, '/uploads/');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
        }
    });
var upload = multer({ //multer settings
                storage: storage
            }).single('file');
/** API path that will upload the files */
router.route('/upload')
.post(function(req, res) {
    upload(req,res,function(err){
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }
         res.json({error_code:0,err_desc:null});
    })
});


module.exports = router;
