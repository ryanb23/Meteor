/*
import '../../../public/css/bootstrap-select.min.css';
import '../../../public/css/normalize.css';
import '../../../public/css/common.css';
import '../../../public/css/style.css';
import '../../../public/css/responsive.css';
*/
import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

import { Newsfeeds }    from '../../../both/collections/api/newsfeeds.js';
import { Students  }    from '../../../both/collections/api/students.js';
import { Companies }    from '../../../both/collections/api/companies.js';

import './admin-dashboard-layout.html';


/*
 * CREATED
 */
Template.adminDashboardLayout.onCreated(function(){

  $( "#cover" ).show();

  Tracker.autorun( () => { 
    Meteor.subscribe('newsfeeds');
    Meteor.subscribe('students');
    Meteor.subscribe('companies');
  });
  
});


/*
 * RENDERED
 */
Template.adminDashboardLayout.onRendered(function(){

  $( '#cover' ).delay( 500 ).fadeOut( 'slow', function() {
    $( "#cover" ).hide();
    $( ".dashboard-header-area" ).fadeIn( 'slow' );
  });

});



/*
 * HELPERS
 */
Template.adminDashboardLayout.helpers({

  company() {
    try {
      let id = Students.findOne({_id: Meteor.userId() }).company_id;
      return Companies.findOne({ _id: id });
    } catch(e) {
      return;
    }
  },

  students() {
    try {
     return Students.find().fetch();
    } catch(e) {
      return;
    }
  },

  avatar() {
    try {
      return Students.findOne({_id: Meteor.userId()}).avatar;
    } catch(e) {
      return;
    }
  },

  fname() {
    try {
      return Students.findOne({_id: Meteor.userId()}).fname;
    } catch(e){
      return;
    }
  },

  role() {
    return Meteor.user().roles[0];
  },

});


/*
 * EVENTS
 */
Template.adminDashboardLayout.events({

  /*
   * #ACCOUNT-SETTINGS  ::(CLICK)::
   */
  'click #account-settings'( e, t ){
//-------------------------------------------------------------------
  },


  /*
   * #ACCOUNT-UPLOAD-PHOTO  ::(CLICK)::
   */
  'click #account-upload-photo'( e, t ){

    console.log( 'account-layout account-upload-photo' );

    $( '#profile-modal' ).modal( 'show' );
//-------------------------------------------------------------------
  },


  /*
   * #LOGOUT  ::(CLICK)::
   */
  'click #logout': function( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    Meteor.logout();
    FlowRouter.go( '/login' );
//-------------------------------------------------------------------
  },


  /*
   * #LOGO-CLICK  ::(CLICK)::
   */
  'click #logo-click': function( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    console.log( 'account-layout logo-click' );

    FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() } );
//-------------------------------------------------------------------
  },


  /*
   * #ADMIN-COURSES  ::(CLICK)::
   */
  'click #admin-courses': function ( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-courses', { _id: Meteor.userId() } );
//-------------------------------------------------------------------
  },


  /*
   * #ADMIN-STUDENTS  ::(CLICK)::
   */
  'click #admin-students': function ( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-students', { _id: Meteor.userId() } );
//-------------------------------------------------------------------
  },


  /*
   * #ADMIN-DEGREES  ::(CLICK)::
   */
  'click #admin-degrees': function ( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-degrees-and-certifications', { _id: Meteor.userId() } );
//-------------------------------------------------------------------
  },


  /*
   * #ADMIN-ASSIGN COURSES  ::(CLICK)::
   */
  'click #admin-assignCourses': function( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-assign-courses', { _id: Meteor.userId() } );
//-------------------------------------------------------------------
  },


  /*
   * #ADMIN-ANALYTICS  ::(CLICK)::
   */
  'click #admin-analytics': function( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-analytics', { _id: Meteor.userId() } );
//-------------------------------------------------------------------
  },


  /*
   * #ADMIN-DESIGN  ::(CLICK)::
   */
  'click #admin-design': function( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-design', { _id: Meteor.userId() } );
//-------------------------------------------------------------------
  },


  /*
   * #ADMIN-ADVANCED  ::(CLICK)::
   */
  'click #admin-advanced': function( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-advanced', { _id: Meteor.userId() } );
//-------------------------------------------------------------------
  },
  
  
  /*
   * #SUPER-ADMIN
   */
  'click #super-admin'( e, t ) {
    e.preventDefault();
    console.log('clickaroo')
    FlowRouter.go( 'super-admin', {_id: Meteor.userId()} );
  },
  
});


