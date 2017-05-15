/*
 * @module studentRecords
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

//import { Blaze } from 'meteor/blaze'

import { Courses }     from '../../../both/collections/api/courses.js';
import { Students }    from '../../../both/collections/api/students.js';

import './student-records.html';


/*
 * CREATED
 */
Template.studentRecords.onCreated( function() {
  $('#cover').show();

  Tracker.autorun( () => {
    Meteor.subscribe('courses');
    Meteor.subscribe('students');
  });

  //this.cur_cor = new ReactiveArray([]);
  //this.cor_com = new ReactiveArray([]);
});


/*
 * RENDERED
 */
Template.studentRecords.onRendered(function(){
  /*
  $( '#cover' ).delay( 500 ).fadeOut( 'slow', function() {
    $("#cover").hide();
    $( ".dashboard-header-area" ).fadeIn( 'slow' );
  });  
  */
});


/*
 * HELPERS
 */
Template.studentRecords.helpers({
/*
  approved() {
    let a;
    try {
      a = ( Students.find({ _id: Meteor.userId() }, {}).fetch()[0].approved_courses );
    } catch( e ) {
      console.log( e );
      return;
    }
    var lim = a.length;
    if ( lim >= 0 ) {
      for ( let i = 0; i < lim; i++ ) {
        a[i].date_approved = moment( Number(a[i].date_approved) ).format('M-D-Y');
      }
    }
    return a;
  },
*/
/*  
  current_courses() {
    let c;
    try {
      c = ( Students.find({ _id: Meteor.userId() }, {}).fetch()[0].current_courses );
    } catch(e) {
      console.log( e );
      return;
    } 
    var lim = c.length;
    if ( lim >= 0 ) {
      for( let i = 0; i < lim; i++ ) {
        c[i].started_date = moment( Number(c[i].started_date) ).format('M-D-Y');
      }
    }
    return c;
  },
*/ 
  courses_completed() {
    try{
      var c = ( Students.find( {_id: Meteor.userId()}, {}).fetch()[0].courses_completed );
    } catch(e) {
      return;
    }
    var lim = c.length;
    if ( lim > 0 ) {
      for( let i=0; i<lim; i++ ) {
        c[i].date_completed = moment(c[i].date_completed).format('MM/DD/YYYY');
      }
    }
    return c;
  },

  certificates() {
    try{
      var certs = Students.find({ _id: Meteor.userId() }).fetch()[0].certifications;
    } catch(e) {
      return;
    }
    var len = certs.length;
    if ( len > 0 ) {
      for( let i = 0; i < len; i++ ) {
        certs[i].date_completed = moment().format('M-D-Y');
        certs[i].expiry = moment().format('M-D-Y')
      }
    }
    return certs;
  },

  degrees() {
    try{
      return Students.find({ _id: Meteor.userId() }).fetch()[0].degrees;
    } catch(e) {
      return;
    }
  },
  
  required_credits() {
    try {
      let req     = Students.find({ _id: Meteor.userId() }).fetch()[0];
      let current = Students.findOne({ _id: Meteor.userId() }, { current_credits:1 } );
      return req.required_credits - current.current_credits;
    } catch (e) {
      return;
      //console.log( 'err ' + e );
    }
  },
  
  current_credits() {
    try {
      return Students.find({_id: Meteor.userId() } ).fetch()[0].current_credits;
    } catch (e) {
      return;
    }
  },
});
