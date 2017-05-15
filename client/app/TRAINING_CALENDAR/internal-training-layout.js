
import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

import { Students  }    from '../../../both/collections/api/students.js';
import { Companies }    from '../../../both/collections/api/companies.js';


import  './internal-training-layout.html';


Template.internalTrainingLayout.onCreated(function() {
  
  Tracker.autorun( () => {
    Meteor.subscribe('students');
    Meteor.subscribe('companies');
  });
	
});



/*=========================================================
 * HELPERS
 *=======================================================*/
Template.internalTrainingLayout.helpers({

  company() {
    try {
      let id = Students.findOne({_id: Meteor.userId() }).company_id;
      return Companies.findOne({ _id: id });
    } catch(e) {
      return;
    }
//---------------------------------------------------------
  },

  students() {
    try {
     return Students.find().fetch();
    } catch(e) {
      return;
    }
//---------------------------------------------------------
  },

  avatar() {
    try {
      return Students.findOne({_id: Meteor.userId()}).avatar;
    } catch(e) {
      return;
    }
//---------------------------------------------------------
  },

  fname() {
    try {
      return Students.findOne({_id: Meteor.userId()}).fname;
    } catch(e){
      return;
    }
//---------------------------------------------------------
  },

  role() {
    return Meteor.user().roles[0];
//---------------------------------------------------------
  },

});



/*=========================================================
 * EVENTS
 *=======================================================*/
Template.internalTrainingLayout.events({


  /********************************************************
   * #ACCOUNT-SETTINGS  ::(CLICK)::
   *******************************************************/
  'click #account-settings'( e, t ){
    e.preventDefault();
    
//---------------------------------------------------------
  },


  /********************************************************
   * #ACCOUNT-UPLOAD-PHOTO  ::(CLICK)::
   *******************************************************/
  'click #account-upload-photo'( e, t ){

    console.log( 'account-layout account-upload-photo' );

    $( '#profile-modal' ).modal( 'show' );
//---------------------------------------------------------
  },


  /********************************************************
   * #LOGOUT  ::(CLICK)::
   *******************************************************/
  'click #logout': function( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    console.log( 'logout click');
    Meteor.logout();
    FlowRouter.go( '/login' );
//---------------------------------------------------------
  },


  /********************************************************
   * #LOGO-CLICK  ::(CLICK)::
   *******************************************************/
  'click #logo-click': function( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    console.log( 'account-layout logo-click' );

    FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() } );
//---------------------------------------------------------
  },


  /********************************************************
   * #ADMIN-COURSES  ::(CLICK)::
   *******************************************************/
  'click #admin-courses': function ( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-courses', { _id: Meteor.userId() } );
//---------------------------------------------------------
  },


  /********************************************************
   * #ADMIN-STUDENTS  ::(CLICK)::
   *******************************************************/
  'click #admin-students': function ( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-students', { _id: Meteor.userId() } );
//---------------------------------------------------------
  },


  /********************************************************
   * #ADMIN-DEGREES  ::(CLICK)::
   *******************************************************/
  'click #admin-degrees': function ( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-degrees-and-certifications', { _id: Meteor.userId() } );
//---------------------------------------------------------
  },


  /********************************************************
   * #ADMIN-ASSIGN COURSES  ::(CLICK)::
   *******************************************************/
  'click #admin-assignCourses': function( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-assign-courses', { _id: Meteor.userId() } );
//---------------------------------------------------------
  },


  /********************************************************
   * #ADMIN-ANALYTICS  ::(CLICK)::
   *******************************************************/
  'click #admin-analytics': function( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-analytics', { _id: Meteor.userId() } );
//---------------------------------------------------------
  },


  /********************************************************
   * #ADMIN-DESIGN  ::(CLICK)::
   *******************************************************/
  'click #admin-design': function( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-design', { _id: Meteor.userId() } );
//---------------------------------------------------------
  },


  /********************************************************
   * #ADMIN-ADVANCED  ::(CLICK)::
   *******************************************************/
  'click #admin-advanced': function( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-advanced', { _id: Meteor.userId() } );
//---------------------------------------------------------
  },
});


