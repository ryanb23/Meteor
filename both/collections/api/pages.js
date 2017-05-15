/**
 * ©2016-2017 Collective Innovation, Inc.
 */

import { Mongo } from 'meteor/mongo';

export const Pages = new Mongo.Collection("pages");

Pages.allow({
  insert: function(id, q){
    return true;
  },
  update: function(id, q){
    return true;
  },
  remove: function(id){
    return true;
  }
  
});