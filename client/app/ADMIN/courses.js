/*
 * @module courses
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import { Courses }      from '../../../both/collections/api/courses.js';
import { BuiltCourses } from '../../../both/collections/api/built-courses.js';
import { Tests }        from '../../../both/collections/api/tests.js';
import '../../templates/admin/courses.html';
/*=========================================================
 * CREATED
 *========================================================*/
Template.courses.onCreated(function(){
  //$("#courses-cover").show();
  
  Tracker.autorun( () => { 
    Meteor.subscribe('courses');
    Meteor.subscribe('builtCourses');
    Meteor.subscribe('tests');
  });
  
  /********************************************************
   * BOOTSTRAP3-DIALOG
   *******************************************************/
  $.getScript( '/bower_components/bootstrap3-dialog/dist/js/bootstrap-dialog.min.js', function(){
      //console.log('Course:: bootstrap-dialog loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'Courses:: load bootstrap-dialog.min.js fail' );
  });
//-------------------------------------------------------------------
/**********************************************************
 * SELECT2
 * multi-select combo box
 *********************************************************/
  $.getScript( '/js/select2.min.js', function(){
    $( document ).ready(function(){
      $('#search-courses').select2({
        allowClear: true,
        placeholder: 'Search Courses...'
      });
    });
    //console.log('Courses:: chosen,jquery.min.js loaded...');
  }).fail( function(jqxhr, settings, exception ) {
    console.log( 'Courses:: load select2.js fail' );
  });
//-------------------------------------------------------------------
});
/**********************************************************
 * RENDERED
 *********************************************************/
Template.courses.onRendered(function(){
/*
  $( '#courses-cover' ).delay( 100 ).fadeOut( 'slow', function() {
    $("#courses-cover").hide();
    $( ".filter-buttons" ).fadeIn( 'slow' );
  });
*/
});
/**********************************************************
 * DESTROYED
 *********************************************************/
Template.courses.onDestroyed(function(){
  Session.set( 'searchTerm', null );
});
//Courses.find({ $or: [ {company_id:Meteor.user().profile.company_id}, {public:true}] }).fetch()
/**********************************************************
 * HELPERS
 *********************************************************/
Template.courses.helpers({
  courses: () => {
    try {
      return Courses.find({ company_id: Meteor.user().profile.company_id }).fetch();
    } catch(e) {
      return;
    }
  },
  uid: () =>
    Meteor.userId()
});
/*=========================================================
 * EVENTS
 *=======================================================*/
Template.courses.events({
  /********************************************************
   * .JS-ADD-COURSE-FROM-LIBRARY  ::(CLICK)::
   *******************************************************/
  'click .js-add-course-from-library'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    FlowRouter.go( 'admin-add-from-library', { _id: Meteor.userId() });
//-------------------------------------------------------------------
  },
  /********************************************************
   * #SEARCH-COURSES  ::(CHANGE)::
   * scroll to selected course
   *******************************************************/
  'change #search-courses'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    let idx = $( e.currentTarget ).val();
    $( 'tr').css( 'border', '' );
    $( 'tr' ).css( 'background-color', '' );
    $( 'tr#' + idx ).css( 'border','1px solid' ).css(  'background-color','PaleTurquoise' );
						  
	  var domToScroll= $( e.currentTarget ).val();
	  var currentOffset=$("#"+domToScroll).offset();
	  var scrolltotop=currentOffset.top;
	  //console.log(currentOffset.top);
	  
	  $( 'html, body' ).animate({
      scrollTop: scrolltotop + 'px'
      }, 'fast');
	  $(".name").css({'background-color':'transparent','border':'0px solid'} );
	  $("#"+domToScroll).css({'background-color':'PaleTurquoise','border':'1px solid'} );
	  
        /*                                      
    $( 'html, body' ).animate({
      scrollTop: $( 'tr#' + $( e.currentTarget ).val() ).offset().top + 'px'
      }, 'fast');
	  */
	  
	 // var offset= $( 'tr#' + $( e.currentTarget ).val() ).offset();
	  //console.log("offset:"+offset.top);
//-------------------------------------------------------------------
  },
  /********************************************************
   * .JS-CLICK-COURSE  ::(CLICK)::
   *******************************************************/
  'click .js-click-course'( e, t ) {
    e.preventDefault();
      let href = $( e.currentTarget ).data( 'href' );
      href = String( href );
      window.location = href;
  },
  /********************************************************
   * .JS-EDIT-COURSE  ::(CLICK)::
   *******************************************************/
  'click .js-edit-course'( e, t ) {
    e.preventDefault();
      let idx = $( e.currentTarget ).data( 'id' )
        , nm  = $( e.currentTarget ).data( 'name' )
        , href;

      //idx = String( idx );
      //let c = Courses.findOne({ _id:idx },{ "name":1, "credits":1 } );
      href = `/admin/dashboard/course-builder/${Meteor.userId()}/?id=${idx}&name=${nm}&edit=1`;
      window.location = href;
      //navigate to course builder for editing.
//-------------------------------------------------------------------
  },
/********************************************************
   * .JS-UN ARCHIVE-COURSE  ::(CLICK)::
   *******************************************************/
  'click .js-unarchive-course'( e, t ) {
    e.preventDefault();
    let idx = $( e.currentTarget ).data( 'id' );
    let nm  = $( e.currentTarget ).data( 'name' );
    Bert.alert(`Course ${nm} has been un-archived`, 'success');
    Courses.update({ _id: idx },
                    { $set: { isArchived: false }});
  },
  /********************************************************
   * .JS-ARCHIVE-COURSE  ::(CLICK)::
   *******************************************************/
  'click .js-archive-course'( e, t ) {
    e.preventDefault();
    let idx = $( e.currentTarget ).data( 'id' );
    let nm  = $( e.currentTarget ).data( 'name' );
    Bert.alert(`Course ${nm} has been archived`, 'success');
    Courses.update({ _id: idx },
                    { $set: { isArchived: true }});
//-------------------------------------------------------------------
  },
  /********************************************************
   * #SEARCH-COURSES  ::(KEYPRESS)::
   *******************************************************/
  'keypress #search-courses': function(event){
    if ( event.which == 13){
      event.preventDefault();
      event.stopImmediatePropagation();
      let idx   = $ ("#search-courses" ).val(),
          item  = Courses.find({ _id: idx  }, { limit:1 }).fetch()[0];
      return item;
    }
//-------------------------------------------------------------------
  },
  /********************************************************
   * #DASHBOARD-PAGE  ::(CLICK)::
   *******************************************************/
  'click #dashboard-page'( e, t ) {
    e.preventDefault();
    FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
//-------------------------------------------------------------------
  },
  /********************************************************
   * .JS-COURSE-BUILDER  ::(CLICK)::
   ******************************************************/
  'click .js-course-builder'( e, t ) {
    e.preventDefault();
    //t.currentScreen.set('courseBuilder');
    FlowRouter.go( `/admin/dashboard/course-builder/${Meteor.userId()}/?rtn=courses` );
  }
//-------------------------------------------------------------------
});
