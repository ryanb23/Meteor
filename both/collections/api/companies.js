/**
 * ©2016-2017 Collective Innovation, Inc.
 */

////////////////////////////////////////////
// Dates stored as milliseconds
///////////////////////////////////////////


import { Mongo } from 'meteor/mongo';

export const Companies = new Mongo.Collection('companies');

/*
Companies.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Companies.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});
*/

let CompaniesSchema = new SimpleSchema({
  'name': {
    type: String
  },
  'logo': {
    type: String
  },
  'insert_code': {
    type: String,
    optional: true
  }
  
});

Companies.attachSchema( CompaniesSchema );