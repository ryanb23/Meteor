/*
 * ©2016-2017 Collective Innovation, Inc.
 */

import { Mongo } from 'meteor/mongo';

export const Diplomas = new Mongo.Collection("diplomas");

/*
Diplomas.allow({
  insert: () => true,
  update: () => true,
  remove: () => false
});

Diplomas.deny({
  insert: () => false,
  update: () => false,
  remove: () => true
});
*/
/*
let DiplomasSchema = new SimpleSchema({
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
  }
  
});

Diplomas.attachSchema( DiplomasSchema );
*/