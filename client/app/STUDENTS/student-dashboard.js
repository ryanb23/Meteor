/*
 * @module studentDashboard
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import { Template }   from 'meteor/templating';
//import { ReactiveVar }  from 'meteor/reactive-var';

import { Students }   from '../../../both/collections/api/students.js';
import { Events }     from '../../../both/collections/api/events.js';

import './student-dashboard.html';


/*
 * CREATED
 */
Template.studentDashboard.onCreated( function() {

  Tracker.autorun( () => {
    Meteor.subscribe('students');
    Meteor.subscribe('events');
  });

  //$("#cover").show();

});


/*
 * RENDERED
 */
Template.studentDashboard.onRendered( function(){
/*  
  $( '#cover' ).delay( 500 ).fadeOut( 'slow', function() {
    $( "#cover" ).hide();
    $( ".dashboard-header-area" ).fadeIn( 'slow' );
  });
*/
});

Template.studentDashboard.helpers({
  
  teacherSticky() {
    if ( Meteor.user() && Meteor.user().roles && Meteor.user().roles.teacher ) {
      
      let cnt = Events.find({ $and: [{ $where: function(){ return moment( this.end ).isBefore( moment() ) } },
                                    { teacher: Meteor.userId() }]
                          }).count();
      
      if ( cnt > 0 )
        return true;
    }
  },
  
  

  
});


Template.studentDashboard.events({
  

  
});
