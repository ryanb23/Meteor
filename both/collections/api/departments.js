/*
 * ©2016-2017 Collective Innovation, Inc.
 */


import { Mongo } from 'meteor/mongo';

export const Departments = new Mongo.Collection("departments");

/*
Departments.allow({
  insert: function(){
    return true;
  },
  update: function(){
    return true;
  },
  remove: function(){
    return true;
  }
});
*/
