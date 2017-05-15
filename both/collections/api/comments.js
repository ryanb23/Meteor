
/*
 * ©2016-2017 Collective Innovation, Inc.
 */
 
import { Mongo } from 'meteor/mongo';

export const Comments = new Mongo.Collection("comments");

Comments.allow({
  insert: function(){
    return true;
  },
  update: function(){
    return true;
  },
  remove: function(o_id){
    return true;
  }
});

/*
Comments.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Comments.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});
*/

let CommentsSchema = new SimpleSchema({
  'owner_id': {
    type: String
  },
  'poster_id': {
    type: String
  },
  'poster_name': {
    type: String
  },
  'poster_avatar': {
    type: String
  },
  'comment': {
    type: String
  },
  'date': {
    type: Date
  }
  
});

Comments.attachSchema( CommentsSchema );