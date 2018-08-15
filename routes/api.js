
/*
*
*       Complete the API routing below
*
*
*/

'use strict';
const options = {
  useNewUrlParser: true,
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
};
var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose');
const CONNECTION_STRING = process.env.DB;
mongoose.connect(CONNECTION_STRING,options);
module.exports = function (app) {
  var Schema = mongoose.Schema;
  //,{ timestamps: {} }
  var blogSchema = new Schema({
    issue_title: String,
    issue_text: String,
    created_by: String,
    assigned_to: String,
    status_text: String,
    open: Boolean
  }, {
    timestamps: {
      createdAt: 'created_on',
      updatedAt: 'updated_on'
    }
  });
  var DataDBinfo = mongoose.model('Blog15', blogSchema);
  app.route('/api/issues/:project')

    .get(function (req, res) {
      var project = req.params.project;
     // console.log('get:' + project+ (req.query.assigned_to));
    
     DataDBinfo.find(req.query, function (err, doc) {
        if (err) {          res.send(err);        } // handle error

  res.json(doc);
         
      });
    })

    .post(function (req, res) {

      var project = req.params.project;
    // console.log('pos t: ' + project + 'body:' + JSON.stringify(req.body));

      DataDBinfo.findOne({
          issue_title: req.body.issue_title
        },

        function (err, docs) {
          if (err) errorHandler(err);
         // console.log("title: " + docs);
          if (docs) {
       //console.log("title: " + docs + 'username already taken');
            res.send('username already taken');
          } else {

            var infos = new DataDBinfo({
              issue_title: req.body.issue_title,
              issue_text: req.body.issue_text,
              created_by: req.body.created_by,
              assigned_to: req.body.assigned_to,
              status_text: req.body.status_text,
              open: true
            });
           // console.log("title: " + infos);

            infos.save(function (err, docs) {
              if (err) errorHandler(err);
              //if (project=='test') res.send(docs);
               //  console.log("titlesave: " + docs);
              res.json(docs);
              return docs;


            });
          }
        });

    })

    .put(function (req, res) {
      var project = req.params.project;
     // console.log('put: ' + project + 'body:' + JSON.stringify(req.body));
      var an_obj = req.body;
      var _id = req.body._id;
    var arr= Object.values(an_obj);
arr.shift();

  if ( arr.every(g=>!Boolean(g)))  {res.json( 'no updated field sent');  return 'no updated field sent';}
      DataDBinfo.findById(_id,
        function (err, docs) {
          if (!docs) {
            res.json( 'no updated field sent');
          } //res.send('First add new user');
          else {
           // console.log(docs);
         
            for (const key in an_obj) {
              if (an_obj.hasOwnProperty(key)) {
                const element = an_obj[key];
           //    console.log('>:ele'+element);
                docs.set({
                  [key]: element
                });
              }
            }
            docs.save(function (err, docs) {
              if (err) return res.json('could not update ' + _id+err);
              res.json('successfully updated');
                return docs;
            });
            /*   docs.set({ size: 'large' });*/

          }
        });

    })

    .delete(function (req, res) {
    
      var project = req.params.project;
     // console.log('del: ' + project + 'body:' + JSON.stringify(req.body));
      var _id = req.body._id;
    
    if (!Boolean(_id))  {
      // console.log('del: ' + Boolean(_id));
      res.send( '_id error'); 
      return'_id error';}
      DataDBinfo.findById(_id, function (err, doc) {
        if (err) {          res.send('_id error');        } // handle error
      //  console.log("titledel: " + doc);
        doc.remove(function (err) {
          if (err) return res.send('could not delete '+_id);
          res.send('success: deleted '+_id);
        }); //Removes the document
      });
    });
  //Tank.find({ size: 'small' }).where('createdDate').gt(oneYearAgo).exec(callback); 
  
  function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.render('error', {
    error: err
  });
}

};
