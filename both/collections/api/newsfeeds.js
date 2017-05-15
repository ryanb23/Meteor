/*
 * ©2016-2017 Collective Innovation, Inc.
 */

import { Mongo } from 'meteor/mongo';

export const Newsfeeds = new Mongo.Collection("newsfeeds");


Newsfeeds.allow({
  insert: () => true,
  update: () => true,
  remove: () => true
});
/*
Newsfeeds.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});
*/

/*
let NewsfeedsSchema = new SimpleSchema({
  'owner_id': {
    type: String
  },
  'poster': {
    type: String
  },
  'poster_avatar': {
    type: String,
    optional: true
  },
  'type': {
    type: String
  },
  'private': {
    type: Boolean
  },
  'news': {
    type: String,
    optional: true
  },
  'comment_limit': {
    type: Number
  },
  'company_id': {
    type: String
  },
  'likes': {
    type: Number
  },
  'date': {
    type: Date
  },
  'likers': {
    type: [String],
    optional: true
  },
  'file': {
    type: String,
    optional: true
  },
  'filename': {
    type: String,
    optional: true
  },
  'content': {
    type: String,
    optional: true
  },
  'image_type': {
    type: String,
    optional: true
  }
  
});

Newsfeeds.attachSchema( NewsfeedsSchema );
*/