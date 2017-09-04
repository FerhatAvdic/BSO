const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const mongoose = require('mongoose');
const Category = require('../models/category');

router.route('/activecategories')
    .get(function(req, res) {
        Category.find({competitionIds: mongoose.Types.ObjectId(req.query.competitionId)},function(err, categories) {
            if(err) res.send(err);
            res.json(categories);
        });
    });

router.route('/categories')
    .get(passport.authenticate('adminJWT', {session:false}),function(req, res) {
        Category.find(function(err, categories) {
            if(err) res.send(err);
            res.json(categories);
        });
    });
    router.route('/categories')
            .post(passport.authenticate('adminJWT', {session:false}),function(req, res) {
                var category = new Category();
                category.detailsEn = req.body.detailsEn;
                category.detailsBs = req.body.detailsBs;
                category.competitionIds = req.body.competitionIds;
                category.icon = req.body.icon;
                // Save message and check for errors
                category.save(function(err) {
                    if (err)
                        res.send(err);
                    res.json({ message: 'category created successfully!'});
                });
    });
    router.route('/categories/:category_id')
        .get(passport.authenticate('adminJWT', {session:false}),function(req, res) {
            Category.findById(req.params.category_id, function(err, category) {
                if (err)
                    res.send(err);
                res.json(category);
            });
        })
        .put(passport.authenticate('adminJWT', {session:false}),function(req, res) {
            Category.findById(req.params.category_id, function(err, category) {
                if (err)
                    res.send(err);
                    category.detailsEn = req.body.detailsEn;
                    category.detailsBs = req.body.detailsBs;
                    category.competitionIds = req.body.competitionIds;
                    category.icon = req.body.icon;
                category.save(function(err) {
                    if (err)
                        res.send(err);
                    res.json({ message: 'category successfully updated!' });
                });

            });
        })
        .delete(passport.authenticate('adminJWT', {session:false}),function(req, res) {
            Category.remove({_id: req.params.category_id}, function(err, message) {
                if (err)
                    res.send(err);
                res.json({ message: 'Successfully deleted category!' });
            });
        });

        module.exports = router;
