/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';
require('dotenv').config();  // load environment variables
const db = require("../models/");

var expect = require('chai').expect;
// var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(function (req, res) {
      var project = req.params.project;

    })

    .post(function (req, res) {
      try {
        var projectName = req.params.project;
        var issuePassed = req.body;
        console.log(projectName);
        console.log(issuePassed);

        let issue = {
          title: issuePassed.issue_title,
          text: issuePassed.issue_text,
          created_by: issuePassed.created_by,
          assigned_to: issuePassed.assigned_to,
          status_text: issuePassed.status_text
        };

        db.Project.findOneAndUpdate(
          { id: projectName },
          { $push: { issues: issue } },
          { safe: true, upsert: true, new: true },
          function (error, project) {
            if (error) {
              res.send(error);
            } else {
              console.log(project);
              res.send(project);
            }
          }
        );
      } catch (err) {
        console.log(err);
      }
    })

    .put(function (req, res) {
      var project = req.params.project;

    })

    .delete(function (req, res) {
      var project = req.params.project;

    });



};
