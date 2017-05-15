/**
 * ©2016-2017 Collective Innovation, Inc.
 */

////////////////////////////////////////////
// Dates stored as milliseconds
///////////////////////////////////////////


import { Mongo } from 'meteor/mongo';

export const Courses = new Mongo.Collection("courses");

Courses.allow({
  insert: () => true,
  update: () => true,
  remove: () => false
});
/*
Courses.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});
*/

let CoursesSchema = new SimpleSchema({
  'name': {
    type: String
  },
  'company_id': {
    type: [String]
  },
  'public': {
    type: Boolean
  },
  'icon': {
    type: String
  },
  'times_completed': {
    type: Number
  },
  'expiry': {
    type: Date,
    optional: true
  },
  'credits': {
    type: Number
  },
  'created_at': {
    type: Date
  },
  'isArchived': {
    type: Boolean,
    optional: true
  },
  'approved': {
    type: Boolean
  },
  'creator_type': {
    type: String
  },
  'creator_id': {
    type: String
  },
  'passing_percent': {
    type: Number
  },
  'type': {
    type: String
  }
  
});

Courses.attachSchema( CoursesSchema );