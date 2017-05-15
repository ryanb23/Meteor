
import '../../../public/css/bootstrap-select.min.css';
import '../../../public/css/normalize.css';
import '../../../public/css/common.css';
import '../../../public/css/style.css';
import '../../../public/css/responsive.css';
//import '../../../public/css/select2.min.css';

import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

import { Newsfeeds }    from '../../../both/collections/api/newsfeeds.js';
import { Students }     from '../../../both/collections/api/students.js';
import { Companies }    from '../../../both/collections/api/companies.js';

import './student-dashboard-layout.html';


/*
 * CREATED
 */
Template.studentDashboardLayout.onCreated(function(){

  Tracker.autorun( () => {
    Meteor.subscribe('newsfeeds');
    Meteor.subscribe('students');
    Meteor.subscribe('companies');
  });

  //$("#cover").show();

  /*
   * JQUERY-UI TEACHER DIALOG

  $.getScript('/jquery-ui-1.12.0.custom/jquery-ui.min.js', function() {

    dialog = $( "#dialog-form" ).dialog({
      autoOpen: false,
      height: 300,
      width: 350,
      modal: true
    });
  //console.log('certificate:: jquery-ui.min.js loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'certificate:: load jquery-ui.min.js fail' );
  });
*/

});


/*
 * RENDERED
 */
Template.studentDashboardLayout.onRendered(function(){
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
Template.studentDashboardLayout.helpers({

  backgroundColor() {
    try {
      let id = Students.findOne({ _id: Meteor.userId() }).company_id;
      return Companies.find({ _id: id }).fetch()[0].backgroundColor;
    } catch(e) {
      return;
    }
  },

  logo() {
    try {
      let id = Students.findOne({ _id: Meteor.userId() }).company_id;
      return Companies.find({ _id: id }).fetch()[0].logo;
    } catch(e) {
      return;
    }
  },
/*
  name() {
   return Meteor.user() && Meteor.user().username;
  },
*/
  avatar() {
    try{
      //return Students.findOne({ _id: Meteor.userId() }).avatar;
      return Meteor.user().profile.avatar;
    } catch(e) {
      return;
    }
  },

  fname() {
    try{
      return Students.findOne({ _id: Meteor.userId() }).fname;
    } catch(e) {
      return;
    }
  },


/*
  isFutureAndTimezoneIs: function(timezone){
    return this.future && this.timezone == timezone;
  }
  isFutureAndTimezoneIs: function(timezone){
    return this.future && this.timezone == timezone;
  }

{{#each loadedEvents}}
  {{#if isFutureAndTimezoneIs "Europe/Warsaw"}}
    {{> event}}
  {{/if}}
{{/each}}
*/
});


/*
 * EVENTS
 */
Template.studentDashboardLayout.events({


  /*
   * #ACCOUNT-SETTINGS  ::(CLICK)::
  'click #account-settings'( e, t ) {
    console.log( 'account-settings student' );
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

    if ( Meteor.user() && Meteor.user().roles && Meteor.user().roles.student ) {
      FlowRouter.go( 'student-dashboard', { _id: Meteor.userId() });
    } else if ( Meteor.user().roles.teacher ) {
      FlowRouter.go( 'teacher-dashboard', { _id: Meteor.userId() });
    }
//-------------------------------------------------------------------
  },


  /*
   * #ST-COURSES  ::(CLICK)::
   */
  'click #st-courses': function ( e, t ) {
    e.preventDefault();

    if ( 
        Meteor.user() && 
        Meteor.user().roles && 
        Meteor.user().roles.student 
        ) 
    {
      FlowRouter.go( 'student-courses', { _id: Meteor.userId() });
    } else if ( 
                Meteor.user() && 
                Meteor.user().roles && 
                Meteor.user().roles.teacher 
              ) 
    {
      FlowRouter.go( 'teacher-courses', { _id: Meteor.userId() });
    }
//-------------------------------------------------------------------
  },


  /*
   * #ST-REQUEST-CREDIT  ::(CLICK)::
   */
  'click #st-request-credit': function ( e, t ) {
    e.preventDefault();

    if ( Meteor.user() && Meteor.user().roles && Meteor.user().roles.student ) {
      FlowRouter.go( 'student-request-credit', { _id: Meteor.userId() });
    } else if ( Meteor.user() && Meteor.user().roles && Meteor.user().roles.teacher ) {
      FlowRouter.go( 'teacher-request-credit', { _id: Meteor.userId() });
    }
//-------------------------------------------------------------------
  },


  /*
   * #ST-RECORDS  ::(CLICK)::
   */
  'click #st-records': function ( e, t ) {
    e.preventDefault();

    if ( Meteor.user() && Meteor.user().roles && Meteor.user().roles.student ) {
      FlowRouter.go( 'student-records', { _id: Meteor.userId() });
    } else if ( Meteor.user() && Meteor.user().roles && Meteor.user().roles.teacher ) {
      FlowRouter.go( 'teacher-records', { _id: Meteor.userId() });
    }
//-------------------------------------------------------------------
  },


  /*
   * #ST-TRAINING-CALENDAR  ::(CLICK)::
   */
  'click #st-training-calendar': function( e, t ) {
    e.preventDefault();

    if ( Meteor.user() && Meteor.user().roles && Meteor.user().roles.student ) {
      FlowRouter.go( 'student-training-calendar', { _id: Meteor.userId() });
    } else if ( Meteor.user() && Meteor.user().roles && Meteor.user().roles.teacher ) {
      FlowRouter.go( 'teacher-training-calendar', { _id: Meteor.userId() });
    }
//-------------------------------------------------------------------
  }

});
