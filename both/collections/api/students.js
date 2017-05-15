/*
 * ©2016-2017 Collective Innovation, Inc.
 */

import { Mongo } from 'meteor/mongo';

export const Students = new Mongo.Collection("students");
/*
Students.allow({
  insert: () => true,
  update: () => true,
  remove: () => true
});

Students.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});
*/

/*
let StudentsSchema = new SimpleSchema({
  'avatar': {
    type: String,
    optional: true
  },
  'fname': {
    type: String,
    optional: true
  },
  'lname': {
    type: String,
    optional: true
  },
  'fullName': {
    type: String,
    optional: true
  },
  'email': {
    type: String,
    optional: true
  },
  'created_at': {
    type: Date,
    optional: true
  },
  'role': {
    type: String,
    optional: true
  },
  'department': {
    type: String,
    optional: true
  },
  'current_credits': {
    type: Number,
    optional: true
  },
  'required_credits': {
    type: Number,
    optional: true
  },
  'compl_courses_cnt': {
    type: Number,
    optional: true
  },
  'company': {
    type: String,
    optional: true
  },
  'company_id': {
    type: String,
    optional: true
  },
  'password': {
    type: String,
    optional: true
  },
  'degrees.$.name': {
    type: String,
    optional: true
  },
  'degrees.$.link_id': {
    type: String,
    optional: true
  },
  'certifications.$.name': {
    type: String,
    optional: true
  },
  'certifications.$.expiry': {
    type: Date,
    optional: true
  },
  'certifications.$.link_id': {
    type: Date,
    optional: true
  },
  'courses_completed.$.link_id': {
    type: String,
    optional: true
  },
  'courses_completed.$.name': {
    type: String,
    optional: true
  },
  'courses_completed.$.credits': {
    type: Number,
    optional: true
  },
  'courses_completed.$.date_completed': {
    type: Date,
    optional: true
  },
  'courses_completed.$.passing_percent': {
    type: Number,
    optional: true
  },
  'current_courses.$.link_id': {
    type: String,
    optional: true
  },
  'current_courses.$.date_completed': {
    type: Date,
    optional: true
  },
  'current_courses.$.date_started': {
    type: Date,
    optional: true
  },
  'current_trainings.$.link_id': {
    type: String,
    optional: true
  },
  'completed_trainings.$.title': {
    type: String,
    optional: true
  },
  'completed_trainings.$.credits': {
    type: Number,
    optional: true
  },
  'completed_trainings.$.date_completed': {
    type: Date,
    optional: true
  },
  'articles_read.$.name': {
    type: String,
    optional: true
  },
  'articles_read.$.link_id': {
    type: String,
    optional: true
  },
  'trialStarted': {
    type: String,
    optional:ntrue
  }
  
 
});

Students.attachSchema( StudentsSchema );
*/