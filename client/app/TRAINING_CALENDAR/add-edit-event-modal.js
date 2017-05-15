/*
 * @module addEditEventModel
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import { Events }      from '../../../both/collections/api/events.js';
import { Students }    from '../../../both/collections/api/students.js';
import { TimeZones }   from '../../../both/collections/api/timezones.js';

import './add-edit-event-modal.html';



let closeModal = () => {
  $( '#add-edit-event-modal' ).modal( 'hide' );
  $( '[name="timezone"]' ).trigger("change");
  $( '.modal-backdrop' ).fadeOut();
};


/*=========================================================
 * ON CREATED
 *=======================================================*/
Template.addEditEventModal.onCreated( () => {

  Tracker.autorun( () => {
    Meteor.subscribe('events');
    Meteor.subscribe('students');
    Meteor.subscribe('timezones');
  });

  //let template = Template.instance();
  //template.subscribe( 'students' );
  //-------------------------------------------------------
  
  
  /********************************************************
   * SELECT2 INSTANTIATE
   *******************************************************/
  $.getScript( '/js/select2.min.js', function() {
    $(document).ready(function(){
      $( '[name="type"]' ).select2({
        allowClear:               true,
        tags:                     true,
        placeholder:              'Add Attendees...',
        minimumResultsForSearch:  Infinity
      });
      
      $( '[name="timezone"]' ).select2({
        allowClear:             true,
        tags:                   false,
        placeholder:            'TimeZone',
        minimumResultsForSearch: Infinity
      });
      
    });
    
    //console.log('addEditEventModal:: select2.min.js loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'addEditEventModal:: load select2.js fail' );
  });
  
  
  $( '[name="timezone"]' ).trigger("change");

});


/*=========================================================
 * HELPERS
 *=======================================================*/
Template.addEditEventModal.helpers({
  
  start() {
    try {
      let e = Events.findOne( Session.get('eventModal').event ).start;
      return moment(e).format('Y-MM-DD');
    } catch(e) {
      return;
    }
//---------------------------------------------------------
  },
  
  
  end() {
    try {
      let e = Events.findOne( Session.get('eventModal').event ).end;
      return moment(e).format('Y-MM-DD');
    } catch(e) {
      return;
    }
//---------------------------------------------------------
  },
  
  
  timezones() {
    try {
      let tz    = TimeZones.find().fetch()[0].timezones
        , e     = Events.findOne( Session.get('eventModal').event ) && Events.findOne( Session.get('eventModal').event ).timezone
        , match = false;

      tz = _.chain(tz)
        .sortBy('group')
        .reverse()
        .sortBy('zone')
        .reverse()
        .value();
    
      //dt[0].zones[1].name

      for( let i = 0, len = tz.length; i < len; i++ ) { //number of objects
        for ( let j = 0, jlen = tz[i].zones.length; j < jlen; j++ ) { //number of zones
          //console.log( dt[i].zones[j].name );
          if ( tz[i].zones[j].name == e ) {
            match = true;
          }
        }
      }
      
      if (match ) $( '[name="timezone"]' ).val(`${e}`).trigger("change");
      return tz;
    } catch (e) {
      //console.log( e );
    }
//---------------------------------------------------------
  },
  
  cntx() {
    try {
      let s   = Students.find({ company_id: Meteor.user().profile.company_id, 
                              $where: function(){ return this._id != Meteor.userId() } }).fetch()
        , evt = Events.findOne( Session.get( 'eventModal' ).event ) && Events.findOne( Session.get('eventModal').event ).students;
        
        if ( Session.get('eventModal').type !== 'edit' ) {
          return s;
        } else {
          for( let i = 0, len = s.length; i < len; i++ ) {
            if ( _.contains( evt, s[i]._id ) ) {
              s[i].match = true;
            }
          }

        return s;
      } 
    } catch (e) {
      //console.log( e );
      return;
    }
//---------------------------------------------------------
  },
  
  modalType( type ) {
    let eventModal = Session.get( 'eventModal' );
    if ( eventModal ) {
      return eventModal.type === type;
    }
//---------------------------------------------------------
  },
  
  
  modalLabel() {
    let eventModal = Session.get( 'eventModal' );

    if ( eventModal ) {
      return {
        button: eventModal.type  === 'edit' ? 'Edit' : 'Add',
        label:  eventModal.type  === 'edit' ? 'Edit' : 'Add an'
      };
    }
//---------------------------------------------------------
  },
  
  
  /*
   * TO HELP SET THE CURRENTLY SELECTED EVENT TYPE IN THE 
   * “EVENT TYPE” SELECT BOX WHEN EDITING AN EXISTING EVENT 
   * (THIS WILL ENSURE THAT THE SELECTED OPTION IS THE CURRENT VALUE IN THE DATABASE).
   */
  selected( v1, v2 ) {
    return v1 === v2;
  },
  
  
  /* 
   * ONCE IT HAS OUR SESSION VARIABLE, IT DECIDES WHAT DATA TO RETURN THE MODAL
   * VIA THE {{EVENT}} HELPER.
   *
   * (1) IF WE’RE EDITING, WE WANT TO RETURN THE ACTUAL 
   *     EVENT ITEM IN THE DATABASE THAT’S BEING EDITED (REMEMBER, FOR THE EDIT 
   *     EVENT WE PASS THE EVENT’S _ID VALUE). 
   * (2) IF WE’RE ADDING A NEW EVENT, WE WANT TO TAKE THE CLICKED DATE AND SET
   *     IT IN BOTH THE “EVENT STARTS” AND “EVENT ENDS” FIELDS 
   *     (THESE ARE DISABLED, BUT CONFIRM THE DATE THAT WAS CLICKED). 
   *     WE SET THE SAME DATE FOR BOTH AS WE’RE ONLY SUPPORTING SINGLE-DATE 
   *     ITEMS IN THIS SNIPPET.
   */
  event() {
    let eventModal = Session.get( 'eventModal' );
    if ( eventModal ) {
      return eventModal.type === 'edit'       ? 
          Events.findOne( eventModal.event )  : 
          {
            start:  eventModal.date,
            end:    eventModal.date
          };
    }//if
//---------------------------------------------------------
  }// event
  
});


/*=========================================================
 * EVENT HANDLERS
 *=======================================================*/
Template.addEditEventModal.events({
  
  /********************************************************
   * .CLOSE  ::(CLICK)::
   *******************************************************/
  'click .close'( e, t ) {
    e.preventDefault();
    
  },
  
  
  /********************************************************
   * .JS-EVENT-MODAL-BUTTON  ::(CLICK)::
   *******************************************************/
  'click .js-event-modal-button' ( event, template ) {
    event.preventDefault();

    let eventModal = Session.get( 'eventModal' ),
        submitType = eventModal.type === 'edit' ? 'editEvent' : 'addEvent';
      
    let names   = template.$( '[name="type"]'   ).val()
      , nlen    = 0
      , s       = []
      , iid
      , teacher_name;

    try {
      teacher_name = Students.findOne({ _id: Meteor.userId() }).fullName;
    } catch (e) {
      //console.log(e);
    }
    
    if ( (names && names.length) && names != null ) {
      nlen = names.length;
    } else {
      Bert.alert( 'You must select a Student!', 'danger' );
      return;
    }
  
  
    let start_string      = template.find( '[name="start"]' ).value
      , end_string        = template.find( '[name="end"]'   ).value
      , start_time_string = template.find( '[name="start-time"]' ).value
      , end_time_string   = template.find( '[name="end-time"]' ).value
      
      , start_time_hours
      , end_time_hours
      , start_time_minutes
      , end_time_minutes
      
      , start_month
      , start_day
      , start_year
      , end_month
      , end_day
      , end_year
      
      , start_time_array
      , end_time_array
      , start_array
      , end_array;
  
    if ( start_string == '' ) {
      Bert.alert( "Please ensure you've selected a Start Date.", 'danger' );
      return;
    }
    
    if ( end_string == '' ) {
      Bert.alert( "Please ensure you've selected an End Date", 'danger' );
      return;
    }
    
    if ( start_time_string == '' ) {
      Bert.alert( "Please ensure you've filled in all three fields of Start Time: i.e 10:00AM", 'danger' );
      return;
    }
    
    if ( end_time_string == '' ) {
      Bert.alert( "Please ensure you've filled in all three fields of End Time: i.e 10:00AM", 'danger' );
      return;
    }
    
    start_array       = start_string.split('-');
    end_array         = end_string.split('-');
    start_time_array  = start_time_string.split(':');
    end_time_array    = end_time_string.split(':');
  
    start_month = start_array[1];
    start_day   = start_array[2];
    start_year  = start_array[0];
    
    end_month = end_array[1];
    end_day   = end_array[2];
    end_year  = end_array[0];
    
    start_time_hours    = start_time_array[0];
    start_time_minutes  = start_time_array[1];
    
    end_time_hours    = end_time_array[0];
    end_time_minutes  = end_time_array[1];
  
    start_array = end_array = start_time_array = end_time_array = null;
  
    //time_hours = time_hours > 12 ? time_hours - 12 : time_hours;
  
    eventItem  = {
      title:        template.find( '[name="title"]' ).value,
      start:        moment( start_year  + "-" + start_month + "-" + start_day + " " + start_time_hours  + ":" + start_time_minutes  + ":00" ).format('YYYYMMDDTHHmm00'),
      end:          moment( end_year    + "-" + end_month + "-"   + end_day   + " " + end_time_hours    + ":" + end_time_minutes    + ":00" ).format('YYYYMMDDTHHmm00'),
      students:     template.$(    '[name="type"]'  ).val(),
      location:     template.find( '[name="location"]' ).value,
      description:  template.find( '[name="description"]' ).value,
      summary:      template.find( '[name="summary"]' ).value,
      startTime:    template.find( '[name="start-time"]' ).value,
      endTime:      template.find( '[name="end-time"]' ).value,
      timezone:     template.find( '[name="timezone"]' ).value || "Los Angeles (Pacific)",
      teacher:      Meteor.userId()
    };
    
    start_time_hours = start_time_minutes = end_time_hours = end_time_minutes = null;
    start_day = start_month = start_year  = null;
    end_day   = end_month   = end_year    = null;
      
    // CLEAR OUT THE FIELDS
    template.$( '[name="type"]' ).val(null).trigger("change");
    template.$( '[name="title"]').val('');
    template.$( '[name="timezone"]' ).val( null ).trigger( 'change' );
    template.$( '[name="startTime"]' ).val('');
    template.$( '[name="endTime"]' ).val('');
    template.$( '[name="location"]' ).val('');
    template.$( '[name="description"]' ).val('');
    template.$( '[name="summary"]' ).val('');
    template.$( '[name="start"]' ).val('');
    template.$( '[name="end"]' ).val('');
    template.$( '[name="start-time"]' ).val('');
    template.$( '[name="end-time"]' ).val('');
  
    //template.$( '#t-courses' ).val(null).trigger("change");
  
    /* ADD DATE/EVENT TO STUDENT CALENDAR */
    if ( submitType === 'editEvent' ) {
      eventItem._id   = eventModal.event;
    }
    
    /* submitType is a variable, so no quote */
    Meteor.call( submitType, eventItem, ( error, rslt ) => {
      
      if ( error ) {
        Bert.alert( error.reason + ' line: 323', 'danger' );
        
      } else {
        
        iid = rslt;
        Bert.alert( `Event ${ eventModal.type }ed!`, 'success' );
        
        // GET THE STUDENTS ASSIGNED
        //o.record_id = iid;
        for( let i = 0; i < nlen; i++ ) {
          
          s[i] = Students.find({ _id: names[i] }).fetch()[0];
      
          Students.update({ _id: s[i]._id },{ $push:{ current_trainings: {link_id: iid}  } });
          
          let icsMSG = createICS( s[i].fullName, s[i].email, 
                                  "Training Event: " + eventItem.description,
                                  eventItem.start, eventItem.end, 
                                  eventItem.location, eventItem.summary );
                    
          //window.open( "data:text/calendar;charset=utf8," + escape( icsMSG ) );
          let calmsg = `"Hello ${s[i].fullName},
          
  You've been invited to attend ${eventItem.title} by ${teacher_name}. 
  
  This training shall take place on ${moment(eventItem.start).format('M-D-Y')} at ${moment(eventItem.start).format('hh:mm a')} ${eventItem.timezone} and located at ${eventItem.location}.`;
  
          Meteor.call(  'sendEmailWithAttachment', 
                        s[i].email, 
                        "admin@collectiveuniversity.com",
                        "Training Event!", 
                        calmsg,
                        {fileName: 'training.ics', contents: icsMSG, contentType: 'text/calendar'} );
          }//for
          closeModal();
        }//else
      });
//---------------------------------------------------------
  },
  
  
  /********************************************************
   * .DELETE-EVENT
   *******************************************************/
  'click .delete-event' ( event, template ) {
    let eventModal = Session.get( 'eventModal' );
    
    if ( confirm( 'Are you sure? This is permanent.' ) ) {
      
      Meteor.call( 'removeEvent', eventModal.event, ( error ) => {
        if ( error ) {
          Bert.alert( error.reason + ' line: 369', 'danger' );
        } else {
          Bert.alert( 'Event deleted!', 'success' );
          closeModal();
        }
      });
    }
//---------------------------------------------------------
  }
});


function createICS( invitee, email, description, startDate,
                    endDate, location, summary, confirmNum = '' ) {
  let today	= moment().format('YYYYMMDDT000000')
  startDate = moment(startDate).format('YYYYMMDDTHHmm00');
  endDate   = moment(endDate).format('YYYYMMDDTHHmm00');
  
  let icsMSG = 
`BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
PRODID:-//CollectiveUniversity//EN
BEGIN:VEVENT
DTSTAMP:${today}
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${summary}
DESCRIPTION:${description}
LOCATION:${location}
URL:http://collectiveuniversity.com
STATUS:CONFIRMED
ORGANIZER;CN=admin@collectiveuniversity.com:mailto:unknownorganizer@calendar.google.com
ATTENDEE;CN=${invitee}:mailto:${email}
CLASS:PRIVATE
LAST-MODIFIED:${today}
END:VEVENT
END:VCALENDAR`;
  return icsMSG;
}
