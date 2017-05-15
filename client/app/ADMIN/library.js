/*
 * @module library
 *
 * @programmer Nick Sardo <nsardo@oal.com>
 * @copyright  2016-2017 Collective Innovation
 */
import { Courses }    from '../../../both/collections/api/courses.js';
import { Newsfeeds }  from '../../../both/collections/api/newsfeeds.js';
import { Students }   from '../../../both/collections/api/students.js';

import '../../templates/admin/library.html';

//import '../../../public/bower_components/bootstrap3-dialog/dist/css/bootstrap-dialog.min.css';


/*
 * CREATED
 */
Template.library.onCreated(function() {

  $( "#library-cover" ).show();
  
  Tracker.autorun( () => { 
    Meteor.subscribe('courses');
    Meteor.subscribe('newsfeeds');
    Meteor.subscribe('students');
  });

  /*
   * BOOTSTRAP3-DIALOG
   */
  $.getScript( '/bower_components/bootstrap3-dialog/dist/js/bootstrap-dialog.min.js', function() {
      //console.log('Library:: bootstrap-dialog loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'Library:: load bootstrap-dialog.min.js fail' );
//-------------------------------------------------------------------
  });


/*
 * SELECT2
 * multi-select combo box
 */
  $.getScript( '/js/select2.min.js', function() {
    $( document ).ready(function(){
      $( '#search-courses' ).select2({
        allowClear: true,
        placeholder: 'Search Courses...'
      });
    });
    //console.log('library:: chosen,jquery.min.js loaded...');
  }).fail( function(jqxhr, settings, exception ) {
    console.log( 'library:: load select2.js fail' );
//-------------------------------------------------------------------
  });

});


/**********************************************************
 * RENDERED
 *********************************************************/
Template.library.onRendered(function(){

  $( '#library-cover' ).delay( 100 ).fadeOut( 'slow', function() {
    $( "#library-cover" ).hide();
    $( ".filter-buttons" ).fadeIn( 'slow' );
  });
});


/**********************************************************
 * DESTROYED
 *********************************************************/
Template.library.onDestroyed(function(){
  Session.set( 'searchTerm', null );
});


/**********************************************************
 * HELPERS
 *********************************************************/
Template.library.helpers({
   courses: () => {
     try {
        let discard = []
          , c       = []
          , cids    = [];

        let own = Courses.find({ company_id: Meteor.user().profile.company_id }).fetch();
        own.forEach(function(el){
          cids.push(el._id); //( el.cid );
        });

        let pub = Courses.find( {$and: [ { public:true },{ company_id:{ $ne: Meteor.user().profile.company_id }}]}, { _id:1, name:1, credits:1, icon:1 }).fetch(); //cid:1

        /* Cycle through pub, and cherry pick out where pub[i].cid == own.cid */
        for( let ii = 0, ilen = pub.length; ii < ilen; ii++ ) {
          for( let i = 0, len = cids.length; i < len; i++ ) {
            if( pub[ii]._id == cids[i] ) discard.push( ii ); //place matches in discard pile
          }
        }

        let ought = 0; // need ought to keep delivery array 0 indexed
        for( let i = 0, len = pub.length; i < len; i++ ) {
          if ( discard.includes(i) ) continue; //if in discard pile, move on to next
          c[ ought++ ] = pub[i];  //not in discard pile, add it to delivery array
        }
        return c;
     } catch(e) {
       return;
     }
   },

   uid: () =>
    Meteor.userId(),

});


/**********************************************************
 * EVENTS
 *********************************************************/
Template.library.events({

  /*
   * #COURSES-PAGE  ::(CLICK)::
   */
  'click #courses-page'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-courses', { _id: Meteor.userId() });
//-------------------------------------------------------------------
  },


  /*
   * #DASHBOARD-PAGE  ::(CLICK)::
   */
  'click #dashboard-page'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
//-------------------------------------------------------------------
  },


  /*
   * #SEARCH-COURSES  ::(CHANGE)::
   */
  'change #search-courses'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    let idx = $( e.currentTarget ).val();

    if ( idx ) {
      $( 'tr' ).css( 'border', '' );
      $( 'tr#' + idx ).css( 'border', '1px solid' );
      $( 'html, body' ).animate({
        scrollTop: $( 'tr#' + $( e.currentTarget ).val() ).offset().top + 'px'
      }, 'fast');
    }
//-------------------------------------------------------------------
  },


   /*
    * #ADD  ::(CLICK)::
    */
   'click #add'( e, t ) {
     e.preventDefault();
     e.stopImmediatePropagation();

    /* prolly use reactive var to pass along to dialog */

     let idx = String( t.$( e.currentTarget ).data( 'id' ) );
     let nm  = t.$( e.currentTarget ).data( 'name' );

     let c = Courses.findOne({ _id: idx });

     Session.set( 'add-course-data', { id: idx, name: c.name, credits: c.credits } );

      t.$( '.js-add-course-text' ).text( `${nm}` );
      t.$( '#lib-add-course-modal' ).modal();

    // modal("show") modal("hide") modal("toggle")
//-------------------------------------------------------------------
  },


  /*
   * MODAL ADD COURSE CONFRIM ADD BUTTON
   */
  'click .js-lib-add'( e, t ) {
    e.preventDefault();

    let s = Students.find({ _id: Meteor.userId() }).fetch();

    //ASSIGN PUBLIC COURSE TO THIS CUSTOMER'S LIBRARY
    Courses.update( { _id: Session.get( 'add-course-data').id },
                    { $push: {company_id: Meteor.user().profile.company_id }
    });

    Newsfeeds.insert({
                        owner_id:       Meteor.userId(),
                        poster:         s.fullName,
                        poster_avatar:  Meteor.user().profile.avatar,
                        type:           "new-course",
                        private:        false,
                        news:           `A New Course was just added: ${Session.get( 'add-course-data' ).name}!`,
                        comment_limit:  3,
                        company_id:     Meteor.user().profile.company_id,
                        likes:          0,
                        date:           new Date()
    });

    Bert.alert( 'Class added to your courses', 'success', 'growl-top-right' );
    Session.set( 'add-course-data', {} );
    $( '#lib-add-course-modal' ).modal( "hide" );
  },


  /*
   * MODAL ADD COURSE CANCEL BUTTON
   */
  'click .js-lib-cancel'( e, t ) {
    e.preventDefault();
    $( '#lib-add-course-modal' ).modal("hide");
  },

  'click .js-library-course-builder'( e, t ) {
    e.preventDefault();

    if (
        Meteor.user() &&
        Meteor.user().roles &&
        Meteor.user().roles.SuperAdmin
      )
    {
      FlowRouter.go( `/super-admin/dashboard/course-builder/${Meteor.userId()}/?rtn=library`);

    } else if (
                Meteor.user() &&
                Meteor.user().roles &&
                Meteor.user().roles.admin ||
                Meteor.user() &&
                Meteor.user().roles &&
                Meteor.user().roles.teacher
              )
    {

      FlowRouter.go( `/admin/dashboard/course-builder/${Meteor.userId()}/?rtn=library`);

    }
  },


});
