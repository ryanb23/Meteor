
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

import './super-admin-layout.html';


/*
 * CREATED
 */
Template.superAdminLayout.onCreated(function(){

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
Template.superAdminLayout.onRendered(function(){

  $( '#cover' ).delay( 500 ).fadeOut( 'slow', function() {
    $( "#cover" ).hide();
    $( ".dashboard-header-area" ).fadeIn( 'slow' );
  });

});



/*
 * HELPERS
 */
Template.superAdminLayout.helpers({

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
Template.superAdminLayout.events({

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


    $( '#profile-modal' ).modal( 'show' );
//-------------------------------------------------------------------
  },


  /*
   * #LOGOUT  ::(CLICK)::
   */
  'click #logout': function( e, t ) {
    e.preventDefault();

    Meteor.logout();
    FlowRouter.go( '/login' );
//-------------------------------------------------------------------
  },


  /*
   * #LOGO-CLICK  ::(CLICK)::
   */
  'click #logo-click': function( e, t ) {
    e.preventDefault();

    FlowRouter.go( 'super-admin-dashboard', { _id: Meteor.userId() } );
//-------------------------------------------------------------------
  },


  /*
   * #SUPER-ADMIN-LIBRARY  ::(CLICK)::
   */
  'click #super-admin-library': function ( e, t ) {
    e.preventDefault();

    FlowRouter.go( 'super-admin-library', { _id: Meteor.userId() } );
//-------------------------------------------------------------------
  },


  /*
   * #SUPER-ADMIN-CUSTOMERS  ::(CLICK)::
   */
  'click #super-admin-customers': function ( e, t ) {
    e.preventDefault();

    FlowRouter.go( 'super-admin-customers', { _id: Meteor.userId() } );
//-------------------------------------------------------------------
  },


  /*
   * #SUPER-ADMIN-DEGREES-AND-CERTS  ::(CLICK)::
   */
  'click #super-admin-degrees-certs': function ( e, t ) {
    e.preventDefault();

    FlowRouter.go( 'super-admin-degrees-and-certs', { _id: Meteor.userId() } );
//-------------------------------------------------------------------
  },


  /*
   * #SUPER-ADMIN-ANALYTICS  ::(CLICK)::
   */
  'click #super-admin-analytics': function( e, t ) {
    e.preventDefault();

    FlowRouter.go( 'super-admin-analytics', { _id: Meteor.userId() } );
//-------------------------------------------------------------------
  },


  /*
   * #SUPER-ADMIN-MENU
   */
  'click #super-admin-menu'( e, t ) {
    e.preventDefault();

    FlowRouter.go( 'super-admin-menu', {_id: Meteor.userId()} );

  },

});
