/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
var idtest;
var title='Title1'+ new Date()
chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: title,
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
         if(err)   console.log( err);
          assert.equal(res.status, 200);
      //   console.log(  res.body.issue_text);
        // console.log( "re"+JSON.stringify( res));
          assert.equal(res.body.issue_title,title);
         assert.equal(res.body.issue_text,'text');
            assert.equal(res.body.created_by,'Functional Test - Every field filled in');
           assert.equal(res.body.assigned_to,'Chai and Mocha');
           assert.equal(res.body.status_text,'In QA');
           idtest=res.body._id
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
           chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: title+2,
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
        
        })
        .end(function(err, res){
         if(err)   console.log( err);
          assert.equal(res.status, 200);
       //  console.log(  res.body.issue_text);
          assert.equal(res.body.issue_title,title+2);
         assert.equal(res.body.issue_text,'text');
            assert.equal(res.body.created_by,'Functional Test - Every field filled in');
         
           
          done();
        });
      });
      
      test('Missing required fields', function(done) {
               chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: "",
          issue_text: "",
          created_by: "",
        
        })
        .end(function(err, res){
         if(err)   console.log( err);
          assert.equal(res.status, 200);
        // console.log(  res.body.issue_text);
          assert.equal(res.body.issue_title,undefined);
         assert.equal(res.body.issue_text,undefined);
            assert.equal(res.body.created_by,undefined);
         
           
          done();
        });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
     // "_id":"5b72ef55a630e0225847b28a","issue_title":"jnn1","issue_text":"nnn2","created_by":"nnn3","assigned_to":"nnn4","status_text":"nnnn5","open":"false"}
      test('No body', function(done) {
           chai.request(server)
        .put('/api/issues/test')
        .send({
              _id:idtest,
          issue_title: "",
          issue_text: "",
          created_by: "",
        assigned_to: "",
             status_text: ""
           
        })
        .end(function(err, res){
         if(err)   console.log( err);
          assert.equal(res.status, 200);
     //  console.log('res.req.data'+ res.body);
         /* assert.equal(res.body.issue_title,undefined);
         assert.equal(res.body.issue_text,undefined);
            assert.equal(res.body.created_by,undefined);
          assert.equal(res.body.assigned_to,undefined);
            assert.equal(res.body.status_text,undefined);
             assert.equal(res.body.open,true);*/
               assert.equal(res.body, 'no updated field sent');
          done();
        });
      });
      
      test('One field to update', function(done) {
         chai.request(server)
        .put('/api/issues/test')
        .send({
           _id:idtest,
          issue_title: 'title1',
      issue_text: "",
          created_by: "",
        assigned_to: "",
             status_text: "",
             open: true,
        })
        .end(function(err, res){
         if(err)   console.log( err);
          assert.equal(res.status, 200);
        // console.log( "reo"+JSON.stringify( res));
         
                          assert.equal(res.body, 'successfully updated');
                  done();
        });
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
           _id:idtest,
          issue_title: 'title1',
      issue_text: "changetext",
          created_by: "",
        assigned_to: "",
             status_text: "",
             open: true,
        })
        .end(function(err, res){
         if(err)   console.log( err);
          assert.equal(res.status, 200);
      //   console.log( "reo"+JSON.stringify( res));
         
                          assert.equal(res.body, 'successfully updated');
                  done();
        });
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({ issue_title: 'Title1'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({ issue_title: 'Title1',open:true})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
       chai.request(server)
        .delete('/api/issues/test')
        .send({_id:''})
        .end(function(err, res){
          assert.equal(res.status, 200);
     // console.log( "reo"+JSON.stringify( res.text));
            assert.equal(res.text ,'_id error');
          done();
        });
      });
      
      test('Valid _id', function(done) {
            chai.request(server)
        .delete('/api/issues/test')
        .send({_id:idtest})
        .end(function(err, res){
          assert.equal(res.status, 200);
       // console.log( "reo"+res);
            assert.equal(res.text,'success: deleted '+idtest );
          done();
        });
      });
      
    });

});
