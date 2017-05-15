/**
 * ©2016-2017 Collective Innovation, Inc.
 */

import { Mongo } from 'meteor/mongo';

export const BuiltCourses = new Mongo.Collection("builtCourses");

BuiltCourses.allow({
  insert: () => true, 
  update: () => true,
  remove: function(id){
    return false;
  }
  
});

