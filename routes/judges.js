const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const rand = require('random-key');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Judge = require('../models/judge');
const Grades = require('../models/grades');


router.route('/judges')
    .get(passport.authenticate('adminJWT', {session:false}),function(req, res) {
        Judge.find(function(err, judges) {
            if (err) res.send(err);
            res.json(judges);
        });
    })
    .post(passport.authenticate('adminJWT', {session:false}),function(req, res) {
      var newJudge = new Judge({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        phone: req.body.phone
      });

      newJudge.save(function(err) {
          if (err) res.send(err);
          res.json({ message: 'Judge created successfully!'});
      });
});

router.route('/judges/:judge_id')
    .get(passport.authenticate('adminJWT', {session:false}),function(req, res) {
        Judge.findById(req.params.judge_id, function(err, judge) {
            if (err) res.send(err);
            res.json(judge);
        });
    })
    .put(passport.authenticate('adminJWT', {session:false}),function(req, res) {
        Judge.findById(req.params.judge_id, function(err, judge) {
            if (err) res.send(err);
            judge.name = req.body.name;
            judge.surname = req.body.surname;
            judge.email = req.body.email;
            judge.phone = req.body.phone;
            judge.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'Judge successfully updated!' });
            });

        });
    })
    .delete(passport.authenticate('adminJWT', {session:false}),function(req, res) {
        Judge.remove({_id: req.params.judge_id}, function(err, message) {
            if (err) res.send(err);
            res.json({ message: 'Successfully deleted judge!' });
        });
    });

// Authenticate
router.route('/judges/authenticate')
  .post((req, res, next) => {
    console.log("body", req.body.code);
  const code = req.body.code;
// find the judge by code
  Judge.findOne({code: code}, (err, judge) => {
    if(err) throw err;
    if(!judge){
      return res.json({success: false, msg: 'judge not found'});
    }
// compare the passwords and give ready token on success

      if(code === judge.code){
        res.json({
          success: true,
          token: 'JWT '+ judge.token,
          judge: {
            id:       judge._id,
            name:     judge.name,
            surname:  judge.surname
          }
        });
      } else {
        return res.json({success: false, msg: 'Wrong code'});
      }
  });
});


router.route('/judges/tokens')
.post(passport.authenticate('adminJWT', {session:false}), (req, res, next) => {
  const judges = req.body;
  judges.forEach(function(id){
    Judge.findById(id, function(err, judge) {
      if (err) res.send(err);
      //Generate code
      var code = rand.generateDigits(4);
      //Create token
      var payload = {_id: judge._id,isJudge: true,isAdmin: false};
      var options = { expiresIn: '1d'};
      const token = jwt.sign(payload, config.secret, options);
      //save code and token to database for later use
      judge.code = code;
      judge.token = token;
      judge.save(function(err) {
          if (err) res.send(err);
      });
    });
  });
  res.json({ message: 'Judges successfully updated!' });
});

router.route('/judges/categories')
 .post(passport.authenticate('adminJWT', {session:false}), (req, res, next) => {
     /*var judge = req.body;
     Judge.findById(judge._id,function(err, j){
       if (err) res.send(err);
       j.categories = judge.categories;
       console.log("judge categories",j.categories);
       j.save(function(err){
         if (err) {
           errorExists=true;
           res.send(err);
         }
       });
     });*/
      var judges = req.body;
      console.log("judges",judges);
      var errorExists = false;
      Judge.find({},'_id', function(err, allJudges){
        if (err) res.send(err);
        allJudges.forEach(function(_id){
          Judge.update({_id:_id}, { $set: { categories: [] }}, function(err, affected){
            if (err) res.send(err);
            console.log('affected: ', affected);
          });
        });
        judges.forEach(function(judge){
            Judge.findById(judge._id,function(err, j){
              if (err) res.send(err);
              j.categories = judge.categories
              j.save(function(err){
                if (err) {
                  errorExists=true;
                  res.send(err);
                }
              });
            });
        });
      });


      if (!errorExists)
      res.json({ message: 'Judge categories successfully updated!' });

});
router.route('/judgepersonal/:judge_id')
.get(passport.authenticate('judgeJWT', {session:false}), (req, res, next) => {
  console.log(req.params.judge_id);
  Judge.findById(req.params.judge_id, '_id name surname phone email company categories',function(err, categories){
    if(err) res.send(err);
    res.json(categories);
  });
});


module.exports = router;
