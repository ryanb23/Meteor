/*
 * ©2016-2017 Collective Innovation, Inc.
 */

import { Mongo } from 'meteor/mongo';

export const Pdfs = new Mongo.Collection("pdfs");
/*
Pdfs.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Pdfs.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});
*/

let FileSchema = new SimpleSchema({
  'name': {
    type: String
  },
  'type': {
    type: String
  },
  'size': {
    type: Number
  },
  'original_name': {
    type: String
  }, 
});


let PdfsSchema = new SimpleSchema({
  'loaded': {
    type: Number,
  },
  'percent_uploaded': {
    type: Number
  },
  'relative_url': {
    type: String
  },
  'secure_url': {
    type: String
  },
  'status': {
    type: String
  },
  'total': {
    type: Number
  },
  'uploader': {
    type: String
  },
  'url': {
    type: String
  },
  'file': {
    type: FileSchema
  },
  'created_at': {
    type: Date
  }
  
});

Pdfs.attachSchema( PdfsSchema );
