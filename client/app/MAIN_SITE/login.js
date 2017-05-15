/*
 * @module login
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */

import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

import { Students }   from '../../../both/collections/api/students.js';

import './login.html';


/*
 * ON CREATED
 */
Template.login.onCreated(function() {

  Tracker.autorun( () => {
    Meteor.subscribe('students');
  });

});



/*
 * EVENTS
 */
Template.login.events({

  'submit form': function( e, t ) {
    e.preventDefault();

    //e.target.email.value
    var email     = $( '#email' ).val().trim();
    //e.target.password.value
    var password  = $( '#password' ).val().trim();

    Meteor.logoutOtherClients();

    Meteor.loginWithPassword( email, password, ( error ) => {
      let s = Students.find({ _id: Meteor.userId() });
      if ( error ) {
        Bert.alert( 'Please provide a valid Account Email and Password!', 'danger', 'fixed-top', 'fa-frown-o' );

      } else {

        if ( s.freeze == true ) {

          Meteor.logout();
          Bert.alert('Your Account has been Frozen', 'danger' );
          return;
          //FlowRouter.go( '/account-frozen' );

        } else if ( s.expires /*LOGIC FROM INTERNAL TRAINING */ ) {

          Meteor.logout();
          Bert.alert('Your Account has Expired', 'danger' );
          return;

        } else if ( Meteor.user() == null ) {

          Bert.alert('No user established', 'danger');
          return;
        } else if ( 
		    Meteor.user() && 
		    Meteor.user().roles && 
		    Meteor.user().roles.SuperAdmin 
	          ) 
	{

          FlowRouter.go( 'super-admin-dashboard', { _id: Meteor.userId() });

        } else if ( 
		    Meteor.user() && 
		    Meteor.user().roles && 
		    Meteor.user().roles.admin 
	          )
        {
          FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });

        } else if ( 
		    Meteor.user() && 
		    Meteor.user().roles && 
		    Meteor.user().roles.student 
	          ) 
	{

            FlowRouter.go( 'student-dashboard', { _id: Meteor.userId() });

        } else if ( 
		    Meteor.user() && 
		    Meteor.user().roles && 
		    Meteor.user().roles.teacher 
	          ) 
	{

          FlowRouter.go( 'teacher-dashboard', { _id: Meteor.userId() });
        }
      }
    });
  },

});
