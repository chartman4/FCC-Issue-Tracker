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
var moment = require('moment');
var expect = require('chai').expect;
var ObjectId = require('mongodb').ObjectID;

function updateIssue(issue, updates) {
  issue.issue_title = updates.issue_title || issue.issue_title;
  issue.issue_text = updates.issue_text || issue.issue_text;
  issue.created_by = updates.created_by || issue.created_by;
  issue.assigned_to = updates.assigned_to || issue.assigned_to;
  issue.status_text = updates.status_text || issue.status_text;
  issue.open = updates.open || issue.open;
  return issue;
};

function sameDay(d1, d2) {
  console.log(d2.setHours(0, 0, 0, 0));
  return (moment(d1).isSame(moment(d2.toUTCString())));

}

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(function (req, res) {
      try {
        var projectName = req.params.project;
        var query = req.query;
        console.log(query);
        db.Project.findOne(
          { id: projectName },
          function (error, project) {
            if (error) {
              res.status(400).send(error);
            } else {
              var returnIssues = project.issues.filter(elem => {
                if (
                  (!query.hasOwnProperty('_id') ||
                    ((query.hasOwnProperty('_id') && (query._id === elem._id.toString()))))
                  &&
                  (!query.hasOwnProperty('open') ||
                    ((query.hasOwnProperty('open') && elem.open === (query.open.toLowerCase() === 'true'))))
                  &&
                  ((!query.hasOwnProperty('assigned_to')) ||
                    (query.hasOwnProperty('assigned_to') && (query.assigned_to === elem.assigned_to)))
                  &&
                  ((!query.hasOwnProperty('created_by')) ||
                    (query.hasOwnProperty('created_by') && (query.created_by === elem.created_by)))
                  &&
                  ((!query.hasOwnProperty('created_on')) ||
                    ((query.hasOwnProperty('created_on')) && (sameDay(query.created_on, elem.created_on))))
                  &&
                  ((!query.hasOwnProperty('updated_on')) ||
                    ((query.hasOwnProperty('updated_on')) && (sameDay(query.updated_on, elem.updated_on))))
                  &&
                  ((!query.hasOwnProperty('status_text')) ||
                    (query.hasOwnProperty('status_text') && (query.status_text === elem.status_text)))
                  &&
                  ((!query.hasOwnProperty('issue_title')) ||
                    (query.hasOwnProperty('issue_title') && (query.issue_title === elem.issue_title)))
                  &&
                  ((!query.hasOwnProperty('issue_text')) ||
                    (query.hasOwnProperty('issue_text') && (query.issue_text === elem.issue_text)))
                ) {
                  return true;
                }
              });
              res.status(200).send(returnIssues);
            }
          }
        )
      }
      catch (err) {
        console.log(err);
      }
    })

    // {"issue_title":"Cheryl","issue_text":"Cheryl's text","created_on":"2019-01-19T20:29:07.374Z","updated_on":"2019-01-19T20:29:07.374Z","created_by":"Cheryl","assigned_to":"","open":true,"status_text":"","_id":"5c4388933727b300708b9e69"}
    .post(function (req, res) {
      try {
        var projectName = req.params.project;
        var issuePassed = req.body;

        if (!issuePassed.hasOwnProperty('issue_title') ||
          !issuePassed.hasOwnProperty('issue_text') ||
          !issuePassed.hasOwnProperty('created_by')) {
          res.status(200).send("missing inputs")
        } else {
          let issue = {
            issue_title: issuePassed.issue_title,
            issue_text: issuePassed.issue_text,
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
                res.status(400).send(error);
              } else {
                res.status(200).send(project.issues[project.issues.length - 1]);
              }
            }
          );
        }
      } catch (err) {
        console.log(err);
      }
    })


    .put(function (req, res) {
      try {
        var projectName = req.params.project;
        var issuePassed = req.body;

        //if all fields are empty or there are no fields
        if (issuePassed === undefined) {
          res.status(200).send("no issue id sent")
        }
        else if (
          (Object.keys(issuePassed).length === 0) ||
          (
            (issuePassed.issue_title === '') &&
            (issuePassed.issue_text === '') &&
            (issuePassed.created_by === '') &&
            (issuePassed.assigned_to === '') &&
            (issuePassed.status_text === '')
          )
        ) {
          res.status(200).send("no updated field sent")
        }
        else {
          db.Project.findOne(
            { id: projectName },
            function (error, project) {
              if (error) {
                res.status(500).send(error);
              } else {
                let i = project.issues.findIndex((elem) => {
                  return elem._id.toString() === issuePassed._id;
                });
                if (i === -1) res.status(200).send("invalid issue id")
                else {
                  project.issues[i] = updateIssue(project.issues[i], issuePassed);
                  project.save();
                  res.status(200).send("successfully updated");
                }

              }
            });
        }
      } catch (err) {
        console.log(err);
      }
    })

    .delete(function (req, res) {
      var projectName = req.params.project;
      var issueIdPassed = req.body;
      try {
        db.Project.findOne(
          { id: projectName },
          function (err, project) {
            // As always, handle any potential errors:

            if (err) { return res.status(500).send(err); }
            else {
              if (Object.keys(issueIdPassed).length === 0) {
                console.log("no issueId");
                res.status(200).send("_id error")
              } else {
                let v = project.issues.findIndex((elem) => {
                  return elem._id.toString() === issueIdPassed._id;
                });
                var newIssues = project.issues.filter(function (value, index, arr) {
                  return v !== index;
                });
                project.issues = newIssues;
                project.save();
                return res.status(200).send("deleted " + issueIdPassed._id);
              }

            }
          });
      } catch (err) {
        return res.status(200).send("could not delete " + issueIdPassed._id);
      }
    });



};
