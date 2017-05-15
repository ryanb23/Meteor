/*
 * @module adminCreditRequest
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */

import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

import { Students }     from '../../../both/collections/api/students.js';

import '../../templates/admin/admin-dashboard.html';


/*=========================================================
 * CREATED
 *=======================================================*/
Template.adminDashboard.onCreated( function() {

  $( '#cover' ).show();

  Tracker.autorun(() => {
    Meteor.subscribe('students');
  });
});
//---------------------------------------------------------



/**********************************************************
 * RENDERED
 *********************************************************/
Template.adminDashboard.onRendered( function() {

  $( '#cover' ).delay( 500 ).fadeOut( 'slow', function() {
    $( "#cover" ).hide();
    $( ".dashboard-header-area" ).fadeIn( 'slow' );
  });
  
  //console.log( moment().date() ) ; //day number

});
//---------------------------------------------------------



/**********************************************************
 * HELPERS
 *********************************************************/
Template.adminDashboard.helpers({

 foo() {
    let s   = Students.find({ _id: Meteor.userId(), }).fetch()
      , d   = new Date();
    
    if ( moment(s.start_date).add(14, 'days') == moment(d) ) {
      FlowRouter.go( '/trial-ended' );
    }
 },
//---------------------------------------------------------

 /*
 showAdminCreditRequests() {

   let cr = Newsfeeds.find({ type: "CR" }).count();
  
   if ( cr > 0 ) {
     return true;
   } else {
     return false;
   }
   
//-------------------------------------------------------------------
  },
*/

});


/*=========================================================
 * EVENTS
 *=======================================================*/
Template.adminDashboard.events({


  /********************************************************
   * #VIEW-REQUEST-DOC  ::(CLICK)::
   *******************************************************/
  'click #view-request-doc'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    let id          = t.$( e.currentTarget ).data( 'id' );
    let imgsrc      = Newsfeeds.findOne({ _id: id }).file;
    let largeImage  = document.createElement( 'img' );
    largeImage.style.display  = 'block';
    largeImage.style.width    = 200+"px";
    largeImage.style.height   = 200+"px";
    largeImage.src            = imgsrc;
    //let url= imgsrc;
    window.open( imgsrc,'Image','width=500,height=500,resizable=0, location=0' );
//---------------------------------------------------------
  },

});


