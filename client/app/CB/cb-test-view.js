/*
 * @module testView
 *
 * @programmer Nicholas Sardo <nsardo@aol.com>
 * @copyright 2016-2017 Collective Innovations
 */
 
import { Template }       from 'meteor/templating';

import { Tests    }       from '../../../both/collections/api/tests.js';


import './cb-test-view.html';

let id;

Template.cbTestView.onCreated(function() {
  Tracker.autorun( () => {
    Meteor.subscribe('tests');
  });
});



Template.cbTestView.helpers({
  
  test() {
    id = Session.get('Scratch');
    try{
      return Tests.findOne({ _id: id });
    } catch(e) {
      return;
    }
  },
/* 
  page: () =>
    Template.instance().page.get(),

  total: () =>
    Template.instance().total.get()
*/
});
