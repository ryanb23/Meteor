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
import { PowerPoints }    from '../both/collections/api/powerpoints.js';
import { Tests }          from '../both/collections/api/tests.js';
import { Scorms }         from '../both/collections/api/scorms.js';
import { TimeZones }         from '../both/collections/api/timezones.js';


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
  console.log('comments');
  return Comments.find({});
});

Meteor.publish( 'companies', function(){
  console.log('companies');
  return Companies.find({});
});

Meteor.publish( 'singleCompany', companyId => {
  return Companies.find({ _id: companyId });
});

Meteor.publish( 'courses', function(){
  return Courses.find({});
});

Meteor.publish( 'departments', function(){
  return Departments.find({});
});

Meteor.publish( 'companyDepartments', companyId => Departments.find({ company_id: companyId }));

Meteor.publish( 'diplomas', function(){
  return Diplomas.find({});
});

Meteor.publish( 'images', function(){
  return Images.find({});
});

Meteor.publish( 'newsfeeds', function(){
  console.log('newsfeed');
  return Newsfeeds.find({});
});

Meteor.publish( 'pdfs', function(){
  return Pdfs.find({});
});

Meteor.publish( 'powerpoints', function(){
  return PowerPoints.find({});
});

Meteor.publish( 'scorms', function(){
  return Scorms.find({});
});

Meteor.publish( 'students', function(){
  console.log('student');
  return Students.find({});
});

Meteor.publish( 'timezones', function(){
  return TimeZones.find({});
});

Meteor.publish( 'companyStudents', companyId => Students.find({ company_id: companyId }));

Meteor.publish( 'tests', function(){
  return Tests.find({});
});
