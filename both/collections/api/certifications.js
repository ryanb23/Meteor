/**
 * ©2016-2017 Collective Innovation, Inc.
 */

////////////////////////////////////////////
// Dates stored as milliseconds
///////////////////////////////////////////


import { Mongo } from 'meteor/mongo';

export const Certifications = new Mongo.Collection("certifications");

/*
Certifications.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Certifications.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});
*/
/*
let CertificationsSchema = new SimpleSchema({

  'name': {
    type: String
  },
  'credits': {
    type: Number
  },
  'times_completed': {
    type: Number
  },
  'icon': {
    type: String
  },
  'company_id': {
    type: String
  },
  'type': {
    type: String
  },
  'courses': {
    type: [String]
  },
  'num': {
    type: Number
  },
  'edited_at': {
    type: Date,
    optional: true
  }
  
});

Certifications.attachSchema( CertificationsSchema );
*/