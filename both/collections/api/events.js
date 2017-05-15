/**
 * ©2016-2017 Collective Innovation, Inc.
 */


import { Mongo } from 'meteor/mongo';

export const Events = new Mongo.Collection( 'events' );

Events.allow({
  insert: () => false,
  update: () => false,
  remove: () => true
});

Events.deny({
  insert: () => true,
  update: () => true,
  remove: () => false
});

let EventsSchema = new SimpleSchema({
  'title': {
    type: String,
    label: 'The title of this event.'
  },
  'start': {
    type: String,
    label: 'When this event will start.'
  },
  'end': {
    type: String,
    label: 'When this event will end.'
  },
  'students': {
    type: [String],
    label: 'Participants',
    //allowedValues: [ 'Birthday', 'Corporate', 'Wedding', 'Miscellaneous' ]
  },
  'description': {
    type: String,
    label: 'What this training is about'
  },
  'location': {
    type: String,
    label: 'Where the training will occur'
  },
  'summary': {
    type: String,
    label: 'Summary of Event'
  },
  'timezone': {
    type: String
  },
  'startTime': {
    type: String
  },
  'endTime': {
    type: String
  },
  'teacher': {
    type: String
  }
/*
  'courses': {
    type: [String],
    label: 'The courses of this event.'
  }
*/
});

Events.attachSchema( EventsSchema );