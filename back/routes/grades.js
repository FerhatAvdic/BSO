const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const mongoose = require('mongoose');
const Grades = require('../models/grades');
const Project = require('../models/project');
const Criteria = require('../models/criteria');

router.route('/activegrades')
    .get(passport.authenticate('adminJWT', {session:false}),function(req, res) {
        //console.log("req.query.competitionId", req.query.competitionId);
        Grades.aggregate([
          {$match: {competitionId: mongoose.Types.ObjectId(req.query.competitionId)}},
          {$lookup: {from:'projects',localField:'projectId', foreignField:'_id', as: 'project'}},
          {$lookup: {from:'judges',localField:'judgeId', foreignField:'_id', as: 'judge'}},
          { $project: {
                _id: "$_id",
                competitionId: "$competitionId",
                categoryId: "$categoryId",
                projectId:"$projectId",
                judgeId: "$judgeId",
                project: {"$arrayElemAt": [ "$project", 0 ]},
                judge: {"$arrayElemAt": [ "$judge", 0 ]},
                evaluation: '$evaluation'
        }}
        ],function(err, grades) {
            if(err) res.send(err);
            res.json(grades);
        });
    });

router.route('/grades')
    .get(passport.authenticate('adminJWT', {session:false}),function(req, res) {
        Grades.find(function(err, grades) {
            if(err) res.send(err);
            res.json(grades);
        });
    });
router.route('/grades')
    .post(function(req, res) {
        Grades.find({competitionId: req.body.competitionId, categoryId: req.body.categoryId, projectId: req.body.projectId, judgeId: req.body.judgeId}, function(err, grade){
            if (err) res.send(err);
            if(grade.evaluation){
                grade.evaluation=req.body.evaluation;
                grade.save(function(err){
                    if(err) res.send(err);
                    res.json({message: 'Grade updated successfully'});
                });
            }else{
                var newGrades = new Grades({
                    competitionId: req.body.competitionId,
                    categoryId: req.body.categoryId,
                    projectId: req.body.projectId,
                    judgeId: req.body.judgeId,
                    evaluation: req.body.evaluation
                  });

                  newGrades.save(function(err) {
                      if (err) res.send(err);
                       res.json({ message: 'Grades created successfully!'});
                  });
                  Project.findById(req.body.projectId, function(err, project){
                      if (err) res.send(err);
                      project.isGraded = true;
                      project.save(function(err){
                          if (err) res.send(err);
                      });
                  });
            }
        });
    });
router.route('/grades/:grades_id')
    .get(passport.authenticate('adminJWT', {session:false}),function(req, res) {
        Grades.findById(req.params.grades_id, function(err, c) {
            if (err)
                res.send(err);
            res.json(c);
        });
    })
    .put(passport.authenticate('adminJWT', {session:false}),function(req, res) {
        Grades.findById(req.params.grades_id, function(err, c) {
            if (err)
                res.send(err);
                grades.competitionId= req.body.competitionId;
                grades.judgeId= req.body.competitionId,
                grades.grades= req.body.grades
            grades.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'grades successfully updated!' });
            });

        });
    })
    .delete(passport.authenticate('adminJWT', {session:false}),function(req, res) {
        Grades.remove({_id: req.params.grades_id}, function(err, message) {
            if (err)
                res.send(err);
            res.json({ message: 'Successfully deleted grades!' });
        });
    });

    router.route('/gradesbyquery')
    .get(function(req, res) {
        Grades.findOne({competitionId: req.query.competitionId, categoryId: req.query.categoryId, projectId: req.query.projectId, judgeId: req.query.judgeId}, function(err, grade){
            if (err)
                res.send(err);
            res.json(grade);
        });
    });

    module.exports = router;
