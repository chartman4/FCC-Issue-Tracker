/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';
require('dotenv').config();  // load environment variables

var expect = require('chai').expect;
// var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var { Project, Issue } = require('../models');
module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(function (req, res) {
      var project = req.params.project;

    })

    .post(function (req, res) {
      try {
        var project = req.params.project;
        var issue = req.body;
        var projectDoc;
        console.log(project);
        console.log(issue);
        Project.find({ projectName: project }, function (err, docs) {
          console.log(docs);
          // if project doesn't exist, create it
          if (docs.length === 0) {
            Project.save({ projectName: project });
            projectDoc = new Project({ projectName: project, issues: [] });
            projectDoc.save(function (err, project) {
              if (err) return console.error(err);
            });
          }
          else projectDoc = docs[0];
          console.log(projectDoc);
          //         user = new User({ name: username, exercise: [] });
          //         user.save(function (err, user) {
          //             if (err) return console.error(err);
          //         });
          //         //return user
          //         res.send({ "username": user.name, "_id": user._id });

          //     } else {
          //         // return message
          //         res.send('username already taken');
          //     }
          // });

        });
        // var results = {
        //   issue_title: 'Title',
        //   issue_text: 'text',
        //   created_by: 'Functional Test - Every field filled in',
        //   assigned_to: 'Chai and Mocha',
        //   status_text: 'In QA'
        // }
        // createIssue(project, results);
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
