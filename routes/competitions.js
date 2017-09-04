const express = require('express');
const router = express.Router();
const Competition = require('../models/competition');

const passport = require('passport');
const jwt = require('jsonwebtoken');

// Register

router.route('/competitions')
    .get(passport.authenticate('adminJWT', {session:false}), function(req, res) {
        Competition.find(function(err, competitions) {
            if (err) res.send(err);
            res.json(competitions);
        });
    });
    router.route('/competitionsLight')
        .get(passport.authenticate('adminJWT', {session:false}), function(req, res) {
            Competition.find({},'_id detailsEn.title',function(err, competitions) {
                if (err) res.send(err);
                res.json(competitions);
            });
        });

router.route('/competitions')
    .post(passport.authenticate('adminJWT', {session:false}), function(req, res) {
    var competition = new Competition();
    competition.detailsEn = req.body.detailsEn;
    competition.detailsBs= req.body.detailsBs;
    // Save message and check for errors
    competition.save(function(err) {
        if (err) res.send(err);
        res.json({ message: 'competition created successfully!'});
    });
    });
router.route('/competitions/:competition_id')
    .get(passport.authenticate('adminJWT', {session:false}), function(req, res) {
        Competition.findById(req.params.competition_id, function(err, competition) {
        if (err) res.send(err);
        res.json(competition);
        });
    })
    .put(passport.authenticate('adminJWT', {session:false}), function(req, res) {
        Competition.findById(req.params.competition_id, function(err, competition) {
            if (err) res.send(err);
            //Check in which language the update is done
            competition.detailsEn = req.body.detailsEn;
            competition.detailsBs = req.body.detailsBs;
            console.log(competition.detailsBs);
            console.log(req.body.detailsBs);
            competition.save(function(err) {
                if (err) res.send(err);
                res.json({ message: 'competition successfully updated!' });
            });
        });
    })
    .delete(passport.authenticate('adminJWT', {session:false}), function(req, res) {
        Competition.remove({ _id: req.params.competition_id }, function(err, message) {
        if (err) res.send(err);
        res.json({ message: 'Successfully deleted competition!' });
    });
});


//Get active competition
router.route('/activecompetition')
    .get(function(req, res) {
        Competition.findOne({ active: true }, function(err, competition) {
            if (err)res.send(err);
            res.json(competition);
        });
    });

    //Set competition as active
router.route('/activecompetition/:competition_id')
.put(passport.authenticate('adminJWT', {session:false}), function(req, res) {
    //Set all previous active competitions to inactive {active:false}
    Competition.find({ active: true }, function(err, active){
      active.forEach(function (item) {
        item.active=false;
        item.save(function (err) {
          if (err) res.send(err);
        });
      });
    });
    //Set current competition to active
    Competition.findById(req.params.competition_id, function(err, competition) {
        if (err) res.send(err);
        competition.active = true;
        competition.save(function(err) {
            if (err) res.send(err);
            res.json({ message: 'Competition successfully set as active!' });
        });
    });
})



module.exports = router;
