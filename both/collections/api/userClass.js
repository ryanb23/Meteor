/**
 * ©2016-2017 Collective Innovation, Inc.
 */

////////////////////////////////////////////
// Dates stored as milliseconds
///////////////////////////////////////////


import { Mongo } from 'meteor/mongo';

/**
* UserClass Schema
* type 				     : Array of String
*   [ 'SuperAdmin', 'Admin', 'Teacher', 'Student' ]
*/

export const UserClass = new Mongo.Collection("userClass");

/*
UserClass.allow({
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
