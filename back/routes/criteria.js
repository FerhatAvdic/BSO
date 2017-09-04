const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const mongoose = require('mongoose');
const Criteria = require('../models/criteria');

router.route('/activecriteria')
    .get(function(req, res) {
        Criteria.find({competitionIds: mongoose.Types.ObjectId(req.query.competitionId)},function(err, criteria) {
            if(err) res.send(err);
            res.json(criteria);
        });
    });

router.route('/criteria')
    .get(passport.authenticate('adminJWT', {session:false}),function(req, res) {
        Criteria.find(function(err, criteria) {
            if(err) res.send(err);
            res.json(criteria);
        });
    });
    router.route('/criteria')
            .post(passport.authenticate('adminJWT', {session:false}),function(req, res) {
                var c = new Criteria();
                c.nameBs = req.body.nameBs;
                c.nameEn = req.body.nameEn;
                c.max = req.body.max;
                c.competitionIds = req.body.competitionIds;
                // Save message and check for errors
                c.save(function(err) {
                    if (err)
                        res.send(err);
                    res.json({ message: 'c created successfully!'});
                });
    });
    router.route('/criteria/:c_id')
        .get(passport.authenticate('adminJWT', {session:false}),function(req, res) {
            Criteria.findById(req.params.c_id, function(err, c) {
                if (err)
                    res.send(err);
                res.json(c);
            });
        })
        .put(passport.authenticate('adminJWT', {session:false}),function(req, res) {
            Criteria.findById(req.params.c_id, function(err, c) {
                if (err)
                    res.send(err);
                c.criteria = req.body.criteria;
                c.competitionIds = req.body.competitionIds;
                c.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'c successfully updated!' });
                });

            });
        })
        .delete(passport.authenticate('adminJWT', {session:false}),function(req, res) {
            Criteria.remove({_id: req.params.c_id}, function(err, message) {
                if (err)
                    res.send(err);
                res.json({ message: 'Successfully deleted c!' });
            });
        });

        module.exports = router;
