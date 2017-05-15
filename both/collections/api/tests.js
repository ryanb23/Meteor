/**
 * ©2016-2017 Collective Innovation, Inc.
 */


import { Mongo } from 'meteor/mongo';


/*
 * company_id
 * test_name
 * questions: [ 
 *  {question, answers[] }
 * ]
*/

export const Tests = new Mongo.Collection("tests");

Tests.allow({
  insert: () => true,
  update: () => true,
  //remove: () => false
});

Tests.deny({
  //insert: () => true,
  //update: () => true,
  remove: () => true
});


let TestsSchema = new SimpleSchema({
  'company_id': {
    type: String
  },
  'test_name': {
    type: String
  },
  'total_questions': {
    type: Number
  },
  'questions.$.question_num': {
    type: Number,
    optional: true
  },
  'questions.$.question': {
    type: String,
    optional: true
  },
  'questions.$.answers': {
    type: [String],
    optional: true
  },
  'questions.$.num_answers': {
    type: Number,
    optional: true
  },
  'questions.$.correct_answer': {
    type: String,
    optional: true
  },
  'questions.$.question_type': {
    type: String,
    optional: true
  }
  
});

Tests.attachSchema( TestsSchema );