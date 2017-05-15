/**
 * ©2016-2017 Collective Innovation, Inc.
 */


import { Mongo } from 'meteor/mongo';

export const TimeZones = new Mongo.Collection( 'timezones' );

TimeZones.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

TimeZones.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});


let TimeZonesSchema = new SimpleSchema({
  'group': {
    type: String,
    label: 'Geographical Grouping'
  },
  'zones.$.value': {
    type: String,
    label: 'the utc string'
  },
  'zones.$.name': {
    type: String,
    label: 'the short string'
  }
  
});

TimeZones.attachSchema( TimeZonesSchema );
