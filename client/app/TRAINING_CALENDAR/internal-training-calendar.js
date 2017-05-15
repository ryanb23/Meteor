/*
 * @module internalTrainingCalendar
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

import { Events } from '../../../both/collections/api/events.js';

import './internal-training-calendar.html';


let isPast  = ( date ) => {
  let today = moment().format();
  return moment( today ).isAfter( date );
};



/*=========================================================
 * CREATED
 *=======================================================*/
Template.internalTrainingCalendar.onCreated( () => {
  //$('#cover').show();
  
  Tracker.autorun( () => {
    Meteor.subscribe('events');
  });

  let template = Template.instance();
  
  template.subscribe( 'events' );
  

//---------------------------------------------------------------------------
});



/*=========================================================
 * RENDERED
 *=======================================================*/
Template.internalTrainingCalendar.onRendered(function(){
  /*
  $( '#cover' ).delay( 500 ).fadeOut( 'slow', function() {
    $("#cover").hide();
    $( ".dashboard-header-area" ).fadeIn( 'slow' );
  });
  */
  
 /*********************************************************
  * FULLCALENDAR
  ********************************************************/
  $( '#calendar' ).fullCalendar({


    // OPTIONS AND CALLBACKS HERE
    events( start, end, timezone, callback ) {

      // GET THIS INDIVIDUAL STUDENT'S CALENDAR
      // EXPIRED EVENTS NOT SHOWN
      let data = Events.find({ $and: [ {$where: function(){ return moment(this.end).isSameOrAfter(moment())}},
                                        {teacher: Meteor.userId() } ] 
                              }).fetch().map( ( event ) => {

        //student can't edit
        event.editable = false; // !isPast( event.start );
        return event;
      });
      
      if ( data ) {
        callback( data );
      }
    //---------------------------------------------------------
    },
    
    
  /*
   * EACH ELEMENT RENDERED TO THE CALENDAR WILL PASS THROUGH THIS METHOD
   * AND TAKE ON THE APPROPRIATE FORMATTING
   */
    eventRender(  event   /* ACTUAL EVENT ITEM ON THE CALENDAR, NOT JS EVENT */, 
                  element /* THE ELEMENT WHERE THE ITEM IS BEING RENDERED AS
                             A JQUERY ELEM*/                                ) {
      element.find( '.fc-content' ).html(
        `<h4>${ event.title }</h4>
        <p>${event.startTime}<br>${event.location}</p>
        `
      );
    //---------------------------------------------------------
    },
    
    
    eventDragStart( event ) {},
    
    
    eventDrop( event, delta, revert ) {
      
      let date = event.start.format();
      if ( !isPast( date ) ) {
        let update = {
          _id:    event._id,
          start:  date,
          end:    date
        };
        
        //NON-ADMIN CAN'T CHANGE CALENDAR ITEM
        if ( ! Meteor.user().roles.admin || ! Meteor.user().roles.teacher ) {
          revert();
          return;
        };
        
        Meteor.call( 'editEvent', update, ( error ) => {
          if ( error ) {
            Bert.alert( error.reason, 'danger' );
          }
        });
        
      } else {
        
        revert();
        Bert.alert( 'Sorry, you can\'t move items to the past!', 'danger' );
      }
    //---------------------------------------------------------
    },
    
    
  /*
   * FIRED WHENEVER WE CLICK ON THE ACTUAL DAY SQUARE IN THE CALENDAR
   */
    dayClick( date ) {
    
      Session.set( 'eventModal', { type: 'add', date: date.format() } );
      
      $( '#add-edit-event-modal' ).modal( 'show' );
    //---------------------------------------------------------  
    },
    
    
  /*
   * FIRED WHENEVER WE CLICK DIRECTLY ON AN EVENT
   */
    eventClick( event /* LITERALLY THE RENDERED EVENT’S DATA,
                         RETURNED FROM THE event()            */ ) {
                       
      Session.set( 'eventModal', { type: 'edit', event: event._id } );

      $( '#add-edit-event-modal' ).modal( 'show' );

    }
  //---------------------------------------------------------
  }); //fullcalendar
  
  
  Tracker.autorun( () => {
    
    Events.find().fetch();
    $( '#calendar' ).fullCalendar( 'refetchEvents' );
    
  });

});

Template.internalTrainingCalendar.events({
    'click #create-training-event-button'( e, t ) {
    $( '#add-edit-event-modal' ).modal( 'show' );
  },
})
