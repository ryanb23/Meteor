/*
 * Template Registered Helpers
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import { Students }   from '../../both/collections/api/students.js';

Template.registerHelper( 'and', ( a, b ) => {
  return a && b;
});


Template.registerHelper( 'or', ( a, b  ) => {
  return a || b;
});


Template.registerHelper( 'orr', ( a, b, c ) => {
  return a || b || c;
});


Template.registerHelper('eq', ( a, b ) => {
  return a === b;
});


Template.registerHelper('ne', ( a, b ) => {
  return a !== b;
});


Template.registerHelper('not', (obj) => {
  return !obj;
});


Template.registerHelper('isCurrentUser', (id) => {
  try {
    return Meteor.userId() == id;
  } catch(e) {
    return new Error(e);
  }
});


Template.registerHelper( 'isStudent', () => {
  try {
    return Meteor.user().roles.student;
  } catch(e) {
    return new Error(e);
  }
});


Template.registerHelper( 'isTeacher', () => {
  try {
    return Meteor.user().roles.teacher;
  } catch(e) {
    return new Error( e );
  }
});

Template.registerHelper( 'isAdmin', () => {
  try {
    return Meteor.user().roles.admin;
  } catch(e) {
    return new Error(e);
  }
});

Template.registerHelper( 'isSuperAdmin', () => {
  try {
    return Meteor.user().roles.SuperAdmin;
  } catch(e) {
    return new Error(e);
  }
});

Template.registerHelper( 'isFrozen', () => {
  try {
    let s = Students.find({ _id: Meteor.userId() }).fetch()[0];
    return s.freeze
  } catch( e ) {
    return new Error(e);
  }
});

Template.registerHelper( 'isExpired', () => {
  try {
    let s = Students.find({ _id: Meteor.userId() }).fetch()[0];
    let d = s.expires;
    // TAKE LOGIC FROM INTERNAL TRAINING
  } catch(e) {
    return new Error(e);
  }
});
