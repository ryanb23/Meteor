
import { Students  }    from '../../../both/collections/api/students.js';

import './course-builder-layout.html';

Template.courseBuilderLayout.onCreated(function(){

  Tracker.autorun( () => {
    Meteor.subscribe('students');
  });

});


Template.courseBuilderLayout.helpers({

  avatar() {
    try {
      return Students.findOne({_id: Meteor.userId()}).avatar;
    } catch(e) {
      return;
    }
  },

});



Template.courseBuilderLayout.events({

 /*
   * #ACCOUNT-SETTINGS  ::(CLICK)::
   */
  'click #account-settings'( e, t ){

    console.log( 'cb-layout account-settings')
//-------------------------------------------------------------------
  },


  /*
   * #ACCOUNT-UPLOAD-PHOTO  ::(CLICK)::
   */
  'click #account-upload-photo'( e, t ){

    console.log( 'cb-layout account-upload-photo' );

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
   * #CB-DASHBOARD-PAGE
   *
   */
  'click #cb-dashboard-page'( e, t ) {
    e.preventDefault();

    Session.set( 'cb-leave', 'dashboard' );

    if ( FlowRouter.getRouteName() == 'admin-test-creator' ) {
      $( '#cb-leave-warning-text' ).html(
                                      'By clicking <strong>"LEAVE"</strong>'+
                                      ' <strong><em>neither</em></strong>' +
                                      ' this test, <stong><em>nor</em></strong>'+
                                      ' your course will be saved');
      $( '#cb-page-leave-warning' ).modal();
    }

    if (
          FlowRouter.getRouteName() == 'admin-course-builder' ||
          FlowRouter.getRouteName() == 'super-admin-course-builder'
       )
    {
      $( '#cb-leave-warning-text' ).html(
                                      'By clicking <strong>"LEAVE"</strong> ' +
                                      '<strong><em>neither</em></strong> ' +
                                      'this course, ' +
                                      '<stong><em>nor</em></strong>' +
                                      ' any associated test will be saved');
      $( '#cb-page-leave-warning' ).modal();
    }
  },


  /*
   * #CB-COURSES-PAGE
   *
   */
  'click #cb-courses-page'( e, t ) {
    e.preventDefault();

    Session.set('cb-leave', 'courses');

    if ( FlowRouter.getRouteName() == 'admin-test-creator' ) {

      $( '#cb-leave-warning-text' ).html(
                                      'By clicking <strong>"LEAVE"</strong>' +
                                      ' <strong><em>neither</em></strong>' +
                                      ' this test, ' +
                                      '<stong><em>nor</em></strong>' +
                                      ' your course will be saved');
      $( '#cb-page-leave-warning' ).modal();
    }

    if (
          FlowRouter.getRouteName() == 'admin-course-builder' ||
          FlowRouter.getRouteName() == 'super-admin-course-builder'
       )
    {

      $( '#cb-leave-warning-text' ).html(
                                  'By clicking <strong>"LEAVE"</strong> ' +
                                  '<strong><em>neither</em></strong> ' +
                                  'this course, <stong><em>nor</em></strong>' +
                                  ' any associated test will be saved');
      $( '#cb-page-leave-warning' ).modal();
    }
  },


  'click #cb-stay-btn'( e, t ) {
    e.preventDefault();

    t. $( '#cb-page-leave-warning' ).modal('hide');
  },



  'click #cb-leave-btn'( e, t ) {
    e.preventDefault()

    t. $( '#cb-page-leave-warning' ).modal('hide');

    if (FlowRouter.getRouteName() == 'admin-test-creator' &&
        Session.get('cb-leave')   == 'dashboard')
    {
      Session.set('cb-leave', null );

      if (
            Meteor.user() &&
            Meteor.user().roles &&
            Meteor.user().roles.admin
         )
      {
        Meteor.setTimeout(function(){
          FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
          return;
        }, 500);
      }

      if (
            Meteor.user() &&
            Meteor.user().roles &&
            Meteor.user().roles.SuperAdmin
         )
      {
        Meteor.setTimeout(function() {
          FlowRouter.go( 'super-admin-dashboard', { _id: Meteor.userId() });
          return;
        }, 500);
      }

      if (
            Meteor.user() &&
            Meteor.user().roles &&
            Meteor.user().roles.teacher
         )
      {
        Meteor.setTimeout(function(){

          Session.set('cb-leave', null);

          FlowRouter.go( 'teacher-dashboard', { _id: Meteor.userId() });
        }, 500);
      }
    } else if (
                FlowRouter.getRouteName() == 'admin-test-creator' &&
                Session.get('cb-leave')   == 'courses'
              )
    {
        Session.set('cb-leave', null );

      if (
            Meteor.user() &&
            Meteor.user().roles &&
            Meteor.user().roles.admin
          )
      {
        Meteor.setTimeout(function(){
          FlowRouter.go( 'admin-courses', { _id: Meteor.userId() });
        }, 500);
      }

      if (
            Meteor.user() &&
            Meteor.user().roles &&
            Meteor.user().roles.SuperAdmin
        )
      {
        Meteor.setTimeout(function() {
          FlowRouter.go( 'super-admin-library', { _id: Meteor.userId() });
          return;
        }, 500);
      }

      if (
            Meteor.user() &&
            Meteor.user().roles &&
            Meteor.user().roles.teacher
         )
      {
        Meteor.setTimeout(function(){
          FlowRouter.go( 'teacher-courses', { _id: Meteor.userId() });
        }, 500);
      }
    }

    if (
          FlowRouter.getRouteName() == 'admin-course-builder' &&
          Session.get('cb-leave')   == 'dashboard'
       )
    {
      Session.set('cb-leave', null );

      if (
            Meteor.user() &&
            Meteor.user().roles &&
            Meteor.user().roles.admin
        )
      {
        Meteor.setTimeout(function(){
          FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
        }, 500);
      }

      if (
            Meteor.user() &&
            Meteor.user().roles &&
            Meteor.user().roles.SuperAdmin
         )
      {
        Meteor.setTimeout(function(){
          FlowRouter.go( 'super-admin-dashboard', { _id: Meteor.userId() });
          return;
        }, 500);
      }

      if (
            Meteor.user() &&
            Meteor.user().roles &&
            Meteor.user().roles.teacher
         )
      {
        Meteor.setTimeout(function(){
          FlowRouter.go( 'teacher-dashboard', { _id: Meteor.userId() });
        }, 500);
      }

    } else if (
                FlowRouter.getRouteName() == 'admin-course-builder' &&
                Session.get('cb-leave') == 'courses'
              )
    {
      Session.set('cb-leave', null );

      if (
            Meteor.user() &&
            Meteor.user().roles &&
            Meteor.user().roles.admin
         )
      {
        Meteor.setTimeout(function(){
          FlowRouter.go( 'admin-courses', { _id: Meteor.userId() });
          return;
        }, 500);
      }

      if (
            Meteor.user() &&
            Meteor.user().roles &&
            Meteor.user().roles.SuperAdmin
         )
      {
        Meteor.setTimeout(function(){
          FlowRouter.go( 'super-admin-library', { _id: Meteor.userId() });
          return;
        }, 500);
      }

      if (
            Meteor.user() &&
            Meteor.user().roles &&
            Meteor.user().roles.teacher
         )
      {
        Meteor.setTimeout(function(){
          FlowRouter.go( 'teacher-courses', { _id: Meteor.userId() });
          return;
        }, 500);
      }
    }
  },

});
