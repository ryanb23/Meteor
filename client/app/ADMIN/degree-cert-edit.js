/*
 * @module degreeCertEdit
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import { Template }       from 'meteor/templating';
import { ReactiveVar }    from 'meteor/reactive-var';

import { Certifications } from '../../../both/collections/api/certifications.js';
import { Diplomas }       from '../../../both/collections/api/diplomas.js';
import { Courses }        from '../../../both/collections/api/courses.js'


import '../../templates/admin/degree-cert-edit.html';

let //certificate       = {}
  count               = 0
  , current_num       = 1
  , type
  , rec_id
  , current_courses   = []
  , db;

//certificate.courses   = [];



Template.degreeCertEdit.onCreated(function(){
  
  Tracker.autorun( () => { 
    Meteor.subscribe('certifications');
    Meteor.subscribe('diplomas');
    Meteor.subscribe('courses');
  });

  /*
   * JQUERY-UI DRAG & DROP
   */
  $.getScript( '/jquery-ui-1.12.0.custom/jquery-ui.min.js', function(){

    $( "#dc-course-list" ).sortable({
      connectWith: "#dc-current-courses",
      receive( event, ui ) {
        current_courses = _.reject(current_courses, function(item) {
          return item === $(`#${ui.item[0].id}`).data('di')
        });
      },
    });

    $( "#dc-current-courses" ).sortable({
      connectWith: "#dc-course-list",
      receive( event, ui ) {
        current_courses.push( $(`#${ui.item[0].id}`).data('di') );
      },
    });

    //$( ".sortable" ).disableSelection();

  //console.log('certificate:: jquery-ui.min.js loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'certificate:: load jquery-ui.min.js fail' );
  });
//-------------------------------------------------------------------

});

Template.degreeCertEdit.onRendered(function(){

  Tracker.autorun(function(){
    type    = FlowRouter.getQueryParam( "dorc" ) //Certifications | Diplomas
    rec_id  = FlowRouter.getQueryParam( "id" )

    try {
      type.charAt(0).toUpperCase() + type.slice(1);

      //CLEANSE INPUT: WHITELIST
      if ( type != 'Certifications' && type != 'Diplomas' ) {
        throw new Error( 'invalid input' );
        return;
      }
    } catch(e) {
      return;
    }

    let d	= document.getElementById( 'dc-course-list' );

    try {

      db = eval( `${type}.find({ _id: rec_id }).fetch()[0]` );
      current_courses = db.courses;

      while ( d.hasChildNodes() ) {
   	    d.removeChild( d.lastChild );
      }

      let c = Courses.find(
                            { company_id: Meteor.user().profile.company_id,  _id: {$nin: current_courses } },
                            { limit: 7 }
                          ).fetch();

      return initC( d, c );
    } catch (e) {
      return;
    }
  });

});



Template.degreeCertEdit.helpers({

  vitals: () => {
    type    = FlowRouter.getQueryParam( "dorc" ) //Certifications | Diplomas
    rec_id  = FlowRouter.getQueryParam( "id" )
    let v   = {};

    try {
      type.charAt(0).toUpperCase() + type.slice(1);

      //CLEANSE INPUT: WHITELIST
      if ( type != 'Certifications' && type != 'Diplomas' ) {
        throw new Error( 'invalid input' );
        return;
      }
    } catch(e) {
      return;
    }

    try {

      let dc  = eval( `${type}.find({ _id: rec_id }).fetch()[0]` );

      //ADD PROPERTY
      v.title = dc.name;
      let len = dc.courses.length;

      //ADD PROPERTY
      v.count = len;

      return v;
    } catch(e) {
      return;
    }
  },

  data: () => {
    /* SERVICES CURRENT COURSES */

    let type  = FlowRouter.getQueryParam( "dorc" ) //Certifications | Diplomas
      , id    = FlowRouter.getQueryParam( "id" )
      , col
      , ary   = [];

    try {
      switch( type ) {

        case 'Diplomas':

          col   = Diplomas.find({ _id: id }).fetch()[0];
          title = `Degree ${col.name}`;

          for ( let i = 0, len = col.courses.length; i < len; i++ ) {
            ary[i]    = Courses.find({ _id: col.courses[i] }).fetch()[0];
            ary[i].id = i;  //add property
          }
          return ary;
          break;

        case 'Certifications':
          col   = Certifications.find({ _id: id }).fetch()[0];
          title = `Certificate ${col.name}`;

          for ( let i = 0, len = col.courses.length; i < len; i++ ) {
            ary[i]    = Courses.find({ _id: col.courses[i] }).fetch()[0];
            ary[i].id = i;
          }
          return ary;
          break;
      }
    } catch( e ) {
      return;
    }
  },

});


Template.degreeCertEdit.events({

  /*
   *
   * SAVE EDIT
   *
   */
  'click #degree-cert-save-edit'( e, t ) {
    e.preventDefault();
    let //count         = $( '#num' ).data('num')
      counter         = 0
      , cname         = t.$('#edit-degree-cert-name').val()
      , credits_total = 0
      , ary           = []
      , order;

    if ( cname == '' ) {
      Bert.alert('Degree name is required!', 'danger');
      return;
    }
    order = $( '#dc-current-courses' ).sortable('toArray');

    if ( order == '' ) {
      console.log('DOH');
      Bert.alert('You must have atleast ONE course added!', 'danger');
      return;
    }

    for( let i = 0, len = order.length; i < len; i++ ) {
      if ( order[i] ) {
        counter++;
        let cur = $( `#${order[i]}` );
        credits_total += cur.data('dc')
        ary.push( cur.data('di') );
      }
    }

    switch( type ) {
      case 'Certifications':
        Certifications.update({ _id: rec_id },
                              {
                                $set:
                                {
                                  courses:         ary,
                                  name:            cname,
                                  credits:         Number(credits_total),
                                  num:             Number(counter),
                                  edited_at:       new Date()
                                }
                              }
        );
        break;
      case 'Diplomas':
        Diplomas.update({ _id: rec_id },
                              {
                                $set:
                                {
                                  courses:         ary,
                                  name:            cname,
                                  credits:         Number(credits_total),
                                  num:             Number(counter),
                                  edited_at:       new Date()
                                }
                              }
        );
        break;
    }

    Bert.alert( 'Record successfully edited', 'success', 'growl-top-right' );

    if (
        Meteor.user() &&
        Meteor.user().roles &&
        Meteor.user().roles.admin
       )
    {
      FlowRouter.go( 'admin-degrees-and-certifications',
                    { _id: Meteor.userId() });
      return;
    } else
        if (
            Meteor.user() &&
            Meteor.user().roles &&
            Meteor.user().roles.SuperAdmin
           )
    {
      FlowRouter.go( 'super-admin-degrees-and-certs',
                    { _id: Meteor.userId() });
      return;
    }
  },


  /*
   *
   * BACK TO DEGREES AND CERTS PAGE
   *
   */
  'click #degree-certificate-page'( e, t ) {
    e.preventDefault();

    if (
        Meteor.user() &&
        Meteor.user().roles &&
        Meteor.user().roles.admin
       )
    {
      FlowRouter.go( 'admin-degrees-and-certifications',
                    { _id: Meteor.userId() });
      return;
    } else
        if (
            Meteor.user() &&
            Meteor.user().roles &&
            Meteor.user().roles.SuperAdmin
           )
    {
      FlowRouter.go( 'super-admin-degrees-and-certs',
                    { _id: Meteor.userId() });
      return;
    }
  },


  /*
   *
   * BACK TO DASHBOARD
   *
   */
  'click #dashboard-page'( e, t ) {
    e.preventDefault();

    if (
        Meteor.user() &&
        Meteor.user().roles &&
        Meteor.user().roles.admin
       )
    {
      FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
      return;
    } else
        if (
            Meteor.user() &&
            Meteor.user().roles &&
            Meteor.user().roles.SuperAdmin
           )
    {
      FlowRouter.go( 'super-admin-dashboard', { _id: Meteor.userId() });
      return;
    }
  },



  /*
   * #CERT-SEARCH  ::(KEYUP)::
   *
   */
  'keyup #cert-search'( e, t ) {
    /* HANDLES SEARCH AND SEARCH DRAGGABLES */

    // SEARCH TERM
    let tf 	= document.getElementById( 'cert-search' ).value;
    let d		= document.getElementById( 'dc-course-list' );

     while ( d.hasChildNodes() ) {

     	d.removeChild( d.lastChild );

     }

     let patt1 = `/^${tf}/i`;

     let items = Courses.find({ company_id: Meteor.user().profile.company_id,
                                name: { $regex: eval(patt1) },
                                _id:  { $nin: current_courses }
                              },
                              { limit: 7 }).fetch();

     for( let i = 0, len = items.length; i < len; i++ ) {

     	let child 			  = document.createElement( 'div' );

      child.className   = "sortable d-cur ui-widget-content degree-drop";
      child.id          = `cert-holder-${i}`;
      child.innerHTML   = `${items[i].name}`;
      child.dataset.dc  = `${items[i].credits}`;
     	child.dataset.di  = `${items[i]._id}`;

      d.appendChild( child );
      $( `#cert-holder-${i}` ).css('width','260px');

     }

//-------------------------------------------------------------------
  },

});


/********************************************************************
 * HELPER FUNCTIONS
 ********************************************************************/

function initC( d, c ) {
  /* HANDLES INITIAL SEEDING OF SEARCH DRAGGABLES */

  let len = c.length;

  for( let i = 0; i < len; i++ ) {

     	let child 			  = document.createElement( 'div' );

      child.className   = "sortable d-cur ui-widget-content degree-drop";
      child.id          = `cert-holder-${i}`;
      child.innerHTML   = c[i].name;
      child.dataset.dc  = `${c[i].credits}`;
     	child.dataset.di  = `${c[i]._id}`;


      d.appendChild( child );
      $( `#cert-holder-${i}` ).css('width','260px');

      $( '#cert-search' ).prop('selectionStart', 0)
                         .prop('selectionEnd', 0);
  }

}
