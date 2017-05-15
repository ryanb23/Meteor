/*
 * (c)2016 Collective Innovations, Inc.
 */
import { BuiltCourses }   from '../both/collections/api/built-courses.js';
import { Comments }       from '../both/collections/api/comments.js';
import { Newsfeeds }      from '../both/collections/api/newsfeeds.js';
import { Students }       from '../both/collections/api/students.js';
import { Events   }       from '../both/collections/api/events.js';
import { Courses }        from '../both/collections/api/courses.js';
import { Companies }      from '../both/collections/api/companies.js';
import { Certifications } from '../both/collections/api/certifications.js';
import { Diplomas }       from '../both/collections/api/diplomas.js';
import { Departments }    from '../both/collections/api/departments.js';
import { Images }         from '../both/collections/api/images.js';
import { Pdfs }           from '../both/collections/api/pdfs.js';
import { Tests }          from '../both/collections/api/tests.js';
import { Scorms }         from '../both/collections/api/scorms.js';

Meteor.publish("userRoles", function() {
  if ( this.userId ) {
    return Meteor.users.find({ _id: this.userId}, {fields: {roles: 1}});
  } else {
    this.ready();
  }
});

Meteor.publish("userEmail", function() {
  return Meteor.users.findOne({_id: id}, {fields:{emails: 1}});
});

Meteor.publish("deleteComments", function(o_id){
  return Comments.remove({ owner_id: o_id });
});

Meteor.publish("company_id", function( id ){
  new SimpleSchema({
    id: {type: String}
  }).validate({ id });
  return Students.find({ _id: id},{fields:{company_id:1}} );
});

Meteor.publish( 'builtCourses', function() { 
  return BuiltCourses.find({});  
});

Meteor.publish( 'events', function() { 
  return Events.find({}); 
});

Meteor.publish( 'certifications', function(){
  return Certifications.find({});
});

Meteor.publish( 'comments', function(){
  return Comments.find({});
});

Meteor.publish( 'companies', function(){
  return Companies.find({});
});

Meteor.publish( 'courses', function(){
  return Courses.find({});
});

Meteor.publish( 'departments', function(){
  return Departments.find({});
});

Meteor.publish( 'diplomas', function(){
  return Diplomas.find({});
});

Meteor.publish( 'images', function(){
  return Images.find({});
});

Meteor.publish( 'newsfeeds', function(){
  return Newsfeeds.find({});
});

Meteor.publish( 'pdfs', function(){
  return Pdfs.find({});
});

Meteor.publish( 'powerpoints', function(){
  return Powerpoints.find({});
});

Meteor.publish( 'scorms', function(){
  return Scorms.find({});
});

Meteor.publish( 'students', function(){
  return Students.find({});
});

Meteor.publish( 'tests', function(){
  return Tests.find({});
});
