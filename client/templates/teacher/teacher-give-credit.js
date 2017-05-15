/*
 * @module teacherGiveCredit
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import { Students }   from '../../../both/collections/api/students.js';
import { Events }     from '../../../both/collections/api/events.js';

import './teacher-give-credit.html';


/*==============================================
 * CREATED
 *============================================*/
Template.teacherGiveCredit.onCreated(function(){

  Tracker.autorun( () => {
    Meteor.subscribe('students');
    Meteor.subscribe('events');
  });

  $.getScript( '/js/select2.min.js', function() {
    $(document).ready(function(){			
		  $( ".js-teacher-add-students" ).select2({
			  placeholder: ""
	    });	
    });
    //console.log('teacherGiveCredit:: select2.min.js loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'teacherGiveCredit:: load select2.js fail' );
  });  
//---------------------------------------------------------  
});



let evt = [], cnt;

/*=========================================================
 * HELPERS
 *=======================================================*/
Template.teacherGiveCredit.helpers({

  tsData() {
      evt     = Events.find({ $and: [ {$where: function(){ return moment(this.end).isBefore(moment())} },
                                      {teacher: Meteor.userId()} ] }).fetch();
      
      cnt = evt.length;
      
      for( let i = 0; i < cnt; i++ ) {   //each event
        evt[i].ary = []; 

        for( let j = 0, jlen = evt[i].students.length; j < jlen; j++ ) {  //students in this event
          evt[i].ary[j] = {};

          let s = Students.findOne({ _id: evt[i].students[j] }).fullName  //get name from student id

          evt[i].ary[j].studentName = s;  // assign values to that object
          evt[i].ary[j].num         = j;
          evt[i].ary[j].id          = evt[i].students[j];
          
        }//for
      }//for
  
    return evt;
  },
  
});


/*=========================================================
 * EVENTS
 *=======================================================*/
Template.teacherGiveCredit.events({

/**********************************************************
 * #TEACHER-CREDIT-SUBMIT
 *********************************************************/
  'click #teacher-credit-submit'( e, t ) {
    e.preventDefault();
    
    let credits = 2;
    
    for ( let i = 0; i < cnt; i++ ) {
      let ii = $( `.js-teacher-add-students` ).val();

      for( let j = 0, jlen=ii.length; j < jlen; j++ ) {

        Students.update({ _id: ii[j] }, 
                        { 
                          $pull: { current_trainings:{ link_id: evt[i]._id } },
                          $push: { completed_trainings:{ title: evt[i].title, credits: credits, date_completed: new Date() }}, 
                          $inc:  { current_credits: credits }
                        });
      
      }//for

      Events.remove({ _id: evt[i]._id });
    }//for
    
    //ASSIGN TEACHER A FIXED 2 CREDITS
    Students.update({ _id: Meteor.userId() },
                    {
                      $inc: { current_credits: 2 }
                    });
//--------------------------------------------------------- 
  },
  
  
/**********************************************************
 * #TEACHER-CREDIT-CANCEL
 *********************************************************/
  'click #teacher-credit-cancel'( e, t ) {
    e.preventDefault();
    
    let id = t.$( '#teacher-credit-cancel' ).data( 'id' );
    
    Meteor.call( 'removeEvent', id );
//--------------------------------------------------------- 
  },
  
});
