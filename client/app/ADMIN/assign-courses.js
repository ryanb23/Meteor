/*
 * @module assignCourses
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import { Students }     from '../../../both/collections/api/students.js';
import { Courses }      from '../../../both/collections/api/courses.js';
import { Departments }  from '../../../both/collections/api/departments';
import { Diplomas }     from '../../../both/collections/api/diplomas.js';
import { Certifications } from '../../../both/collections/api/certifications.js';

import '../../templates/admin/assign-courses.html';



/*=========================================================
 * ON CREATED
 *========================================================*/
Template.assignCourses.onCreated(function() {

  Tracker.autorun( () => { 
    Meteor.subscribe('students');
    Meteor.subscribe('courses');
    Meteor.subscribe('departments');
    Meteor.subscribe('diplomas');
    Meteor.subscribe('certifications');
  });
  
  //$("#assign-courses-cover").show();  //set-up fade-in screen

  Session.set('assign-toggle-cert', false );
  Session.set('assign-toggle-dip', false);
  
  /********************************************************
   * MULTI-SELECT AUTOCOMPLETE COMBOBOX
   *******************************************************/
  $.getScript( '/js/select2.min.js', function() {
    $( document ).ready(function(){
      
      $( '#search-courses' ).select2({
        allowClear: true
      });
      $( '#by-name' ).select2({
        allowClear: true
      });
      $( '#by-dept' ).select2({
        //allowClear: true
      });
    });
    //console.log('Assign Courses:: chosen,jquery.min.js loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'Assign Courses:: load select2.js fail' );
  });

});


/*=========================================================
 * ON RENDERED
 *=======================================================*/
Template.assignCourses.onRendered(function(){
  //complete fade-in screen
/*
  $( '#assign-courses-cover' ).delay( 100 ).fadeOut( 'slow', function() {
    $("#assign-courses-cover").hide();
    $( ".search-list" ).fadeIn( 'slow' );
  });
*/
});


/*=========================================================
 * HELPERS
 *=======================================================*/
Template.assignCourses.helpers({

  courses: () => {
    let cours, certs, dips, ary = [];
    try {
      cours = Courses.find({ company_id: Meteor.user().profile.company_id}).fetch();
      
      certs = Certifications.find({ company_id: Meteor.user().profile.company_id}).fetch();
    
      dips  = Diplomas.find({ company_id: Meteor.user().profile.company_id}).fetch();
      
      if ( cours ) ary.push( cours );
      if ( certs ) ary.push( certs );
      if ( dips )  ary.push( dips  );

      ary = _.flatten( ary );

      return ary;
    } catch( e ) {
      return;
    }
  },
  
  dept: () => {
    try {
      return Departments.find({ company_id: Meteor.user().profile.company_id }).fetch();
    } catch( e ) {
      return;
    }
  },
  
  names: () => {
    try {
      return Students.find({ company_id: Meteor.user().profile.company_id }).fetch();
    } catch( e ) {
      return;
    }
  },
  
});



/*=========================================================
 * EVENTS
 *=======================================================*/
Template.assignCourses.events({

  /********************************************************
   * #ASN-COURSE
   *******************************************************/
  'click .asn-course'( e, t ) {
    e.preventDefault();
    
    try {
      let id  = $( e.currentTarget ).data('id');
       // , bld = $( e.currentTarget ).data('builder');
      console.log( bld );
      let params = {
        _id: Meteor.userId()
      };
      let queryParams = {course: id};
      var routeName   = "admin-course-viewer";
      var path        = FlowRouter.path(routeName, params, queryParams);
      FlowRouter.go( path );
    } catch (e) {
      console.log(e);
    }

  },
  
  
  
  /********************************************************
   * #ASSIGN-CERT  ::(CLICK)::
   *******************************************************/
  'click #assign-cert'( e, t ) {
    e.preventDefault();
    
    let tog = Session.get( 'assign-toggle-cert' );
    tog = !tog;
    
    if ( tog ) {
      try {
        let cos = [], recs = [];
        let certs = Certifications.find({ company_id: Meteor.user().profile.company_id}).fetch();
        for ( let i = 0, ilen = certs.length; i < ilen; i++ ) {
          cos = (certs[i].courses);
        }
        for ( let j = 0, jlen = cos.length; j < jlen; j++ ) {
          recs[j] = Courses.find({ _id: cos[j] }).fetch()
        }
        
        for ( let k = 0, klen = recs.length; k < klen; k++ ) {
          let li = document.createElement( 'li' );
          let a  = document.createElement( 'a'  );
          
          a.href =  `/admin/dashboard/course-viewer/${Meteor.userId()}?course=${recs[k][0]._id}`;
          a.innerHTML   = recs[k][0].name;
          a.dataset.dc  = recs[k][0].credits;
          a.dataset.di  = recs[k][0]._id
          
          li.appendChild( a );
          document.getElementById('cert-courses').appendChild( li );
          
        }
        Session.set( 'assign-toggle-cert', tog );
      } catch(e) {
        console.log( e );
      }
    } else {
      Session.set('assign-toggle-cert', tog);
      $( '#cert-courses' ).empty();
    }
  },
  
  
  
  /********************************************************
   * #ASSIGN-DIPLOMA  ::(CLICK)::
   *******************************************************/
  'click #assign-diploma'( e, t ) {
    e.preventDefault();
    
    let tog = Session.get('assign-toggle-dip');
    tog = !tog;
    
    if ( tog ) {
      try {
        let cos = [], recs = [];
        
        let dips    = Diplomas.find({ company_id: Meteor.user().profile.company_id}).fetch();
        for ( let i = 0, ilen = dips.length; i < ilen; i++ ) {
          cos = (dips[i].courses);
        }
        for ( let j = 0, jlen = cos.length; j < jlen; j++ ) {
          recs[j] = Courses.find({ _id: cos[j] }).fetch()
        }
        
        for ( let k = 0, klen = recs.length; k < klen; k++ ) {
          let li         = document.createElement( 'li' );
          let a          = document.createElement( 'a'  );
  
          a.href         = `/admin/dashboard/course-viewer/${Meteor.userId()}?&course=${recs[k][0]._id}`;
          a.innerHTML    = recs[k][0].name;
          a.dataset.dc   = recs[k][0].credits;
          a.dataset.di   = recs[k][0]._id;
          
          li.appendChild(a);
          
          document.getElementById('dip-courses').appendChild( li );
        }
        Session.set('assign-toggle-dip', tog);
      } catch(e) {
           console.log( e );
      }
    } else {
      Session.set('assign-toggle-dip', tog);
      $( '#dip-courses' ).empty();
    }
  },
  
  
   
  /*
   * #SEARCH-COURSES  ::(CHANGE)::
   * scroll to selected search result
   */
  'change #search-courses'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    let idx = $( e.currentTarget ).val();
    t.$( 'tr' ).css( 'border', '' );
    t.$( 'tr#' + idx ).css( 'border', '1px solid' );
    t.$( 'html, body' ).animate({
      scrollTop: $( 'tr#' + t.$( e.currentTarget ).val() ).offset().top + 'px'
    }, 'fast' );
//-----------------------------------------------------------------
  },


    /******************************************************
     * #ASSIGN  ::(CLICK)::
     *****************************************************/
   'click #assign'( e, t ) {
     e.preventDefault();
     e.stopImmediatePropagation();

    t.$( '#course-name' ).html( $( e.currentTarget ).data( 'name' ) );
    t.$( '.add-course' ).attr( 'data-id', $( e.currentTarget ).data( 'id' ));
    t.$( '.add-course' ).attr( 'data-credits', $( e.currentTarget ).data( 'credits' ));
    t.$( '.add-course' ).attr( 'data-name', $( e.currentTarget ).data( 'name' ));
    t.$( '.add-course' ).attr( 'data-icon', $( e.currentTarget ).data( 'icon' ));
    
    let typ = $( e.currentTarget ).data('type');
    if ( typ == '' || typ == undefined || ! typ ) {
      t.$( '.add-course' ).attr( 'data-type', 'Courses');
    } else {
      t.$( '.add-course' ).attr( 'data-type', typ );
    }

    //SELECTS
    t.$( '#assign-by-dept-radio' ).val( false ).trigger( 'change' );
    t.$( '#assign-by-dept-radio' ).attr('disabled',false);
    
    t.$( '#all-students-radio' ).val(false).trigger( 'change' );
    t.$( '#all-students-radio' ).attr('disabled',false);
    
    t.$( '#assign-by-dept' ).css("background-position", "0% 0%");
    t.$( '#assign-by-dept' ).attr('disabled',false);
    
    t.$( '#all-students' ).css("background-position", "0% 0%");
    t.$( '#all-students' ).attr('disabled',false);
    
    t.$( "#by-dept" ).val( null ).trigger( "change" );           // department name(s)
    t.$( '#by-dept' ).attr('disabled',false);
    
    t.$( "#by-name" ).val( null ).trigger( "change" );           // student name(s)
    t.$( '#by-name' ).attr('disabled',false);
    
    t.$( '#assign-modal' ).modal( 'show' );
//-------------------------------------------------------------------
  },


  /********************************************************
   * .ADD-COURSE  ::(CLICK)::
   *******************************************************/
  'click .add-course'( e, t ) {
    //todo:  don't allow empty submission
    //todo:  reset all switches to OFF

    e.preventDefault();
    e.stopImmediatePropagation();

    let idx   = $( e.currentTarget)[0].dataset.id          // course id
      , nm    = $( e.currentTarget)[0].dataset.name        // course name
      , cr    = $( e.currentTarget)[0].dataset.credits     // course credits
      , ic    = $( e.currentTarget)[0].dataset.icon        // course icon
      , type  = $( e.currentTarget)[0].dataset.type        // course = '', Diplomas, Certifications
      , abn   = as = abd   = false
      , assignByDept  = $( '#by-dept' ).val()             // department name(s)
      , assignByName  = $( '#by-name' ).val()             // student name(s)
      , as            = $( '#all-students-radio' ).val(); // all-students radio
      
    if ( assignByName != null ) {
      abn = true;
    }

    if ( assignByDept != null ) {
      abd = true;
    }
    
    type    = type.slice( 0 );
 
      let o   = { id: idx, 
                  name: nm, 
                  credits: cr, 
                  num: 1, 
                  icon: ic, 
                  type: type, 
                  date_assigned: new Date() 
                };
    
    /*-----------------------------------------------------
     * ALL STUDENTS
     *---------------------------------------------------*/
    if ( as == true ) {

    //let url = 'https://collective-university-nsardo.c9users.io/login';
    //let text_wo_due_date  = `Hello ${s[i].fname},\n\nYou've been enrolled in ${nm}.\n\nYou can log in here: ${url}\nUser: s[i].email\nYour password remains the same.`;
    //let text_w_due_date   = `Hello ${s[i].fname},\n\nYou've been enrolled in ${nm}.  Please complete this by:  ${assignDueDate}.\n\nYou can log in here: ${url}\nUser: s[i].email\nYour password remains the same.`;

      let s     = Students.find({ company_id: Meteor.user().profile.company_id }).fetch();
      let slen  = s.length;

      for ( let i = 0; i < slen; i++ ) {
        if ( s[i].role == 'admin' ) continue;
        Students.update({ _id: s[i]._id },{ $push:{ assigned_courses: o } });

        //Meteor.call('sendEmail', s[i].email, 'admin@collectiveuniversity.com', 'Assigned Course', text_wo_due_date);
      }
      
      Bert.alert( `${type} has been assigned`, 'success', 'growl-top-right' );

    /*-----------------------------------------------------
     * ASSIGN BY NAME
     *---------------------------------------------------*/
    } else if ( abn == true ) {

      if ( ! Array.isArray( assignByName ) ) {

        Bert.alert( 'You must enter at least one name!', 'danger' );
        return;                                       // toast: must enter at
      }                                               // least one name!

      //ASSIGN THIS/THESE STUDENT(S) TO COURSE
      let s     = Students.find({ company_id: Meteor.user().profile.company_id }).fetch(),
          slen  = s.length,
          alen;

      // DOUBLE CHECK ASYNC TIMING, BEST PRACTICE FOR THIS
      alen = assignByName.length;
      if ( assignByName[alen-1] == '' ) alen = alen - 1; //artifact in input

      for ( let i = 0; i < slen; i++ ) { //number of students
        for ( let j = 0; j < alen; j++ ) { //number of names assigned
          if ( s[i].role == 'admin' ) continue; //don't assign to admin
          if ( (s[i].fullName).indexOf( assignByName[j] ) != -1 ) {

            Students.update({ _id: s[i]._id },{ $push:{ assigned_courses: o } });
          }
        }
      }
      
      Bert.alert( `${type} has been assigned`, 'success', 'growl-top-right' );


    /*----------------------------------------------------
     * ASSIGN BY DEPARTMENT
     *---------------------------------------------------*/
    } else if ( abd == true ) {

      if ( ! Array.isArray( assignByDept ) ) {

        Bert.alert( 'You must enter a department!', 'danger' );
        return;                                       // toast: must enter a dept!
      }

      let s     = Students.find({ company_id: Meteor.user().profile.company_id }).fetch(),
          slen  = s.length,
          dlen;

      // DOUBLE CHECK ASYNC TIMING, BEST PRACTICE FOR THIS
      dlen = assignByDept.length;
      for( let i = 0; i < slen; i++ ) {
        for ( let j = 0; j < dlen; j++ ) {
          if ( s[i].role == 'admin') continue;
          if ( (s[i].department).indexOf( assignByDept[j] ) != -1 ) {
            Students.update( { _id: s[i]._id },{ $push:{ assigned_courses: o } });
          }
        }
      }
      
      Bert.alert( `${type} has been assigned`, 'success', 'growl-top-right' );


    } else {
      
      Bert.alert( "You MUST select one of:\n 'all students', \n'names', or \n'departments'",
                  'danger' );
      return;
    }

    /* EXIT, CLEAR */
    $( "#by-dept" ).val( null ).trigger( "change" );
    $( "#by-dept" ).attr( 'disabled', true );
    $( "#by-name" ).val( null ).trigger( "change" );
    $( '#by-name' ).attr( 'disabled', true );

    t.$( '#all-students-radio' ).val(false).trigger("change");
    $( '#assign-by-dept-radio' ).val(true).trigger("change");

    $( '#assign-modal' ).modal( 'hide' );
//-------------------------------------------------------------------
  },


//-------------------------------------------------------------------
// DIALOG RADIO BUTTON ROUTINES
//-------------------------------------------------------------------


  /********************************************************
   * #ALL-STUDENTS  ::(CLICK)::
   *******************************************************/
  'click #all-students'( e, t ) {
    e.preventDefault();
    console.log('click all');

    t.$( '#all-students-radio' ).attr('disabled',false);
    t.$( '#all-students-radio' ).val(true).trigger("change");
    
    t.$( '#all-students' ).css("background-position", "0% 100%");
    t.$( '#assign-by-dept' ).css("background-position", "0% 0%");
    
    t.$( '#assign-by-dept-radio' ).val(false).trigger('change');
    t.$( '#by-dept' ).val(null).trigger("change"); //empty select2
    t.$( '#by-dept' ).attr( 'disabled', true );
    
    t.$( '#by-name' ).val(null).trigger("change"); //empty select2
    t.$( '#by-name' ).attr('disabled',true);
//-----------------------------------------------------------------
  },


  /********************************************************
   * #ASSIGN-BY-DEPT ::(CLICK)::
   *******************************************************/
  'click #assign-by-dept'( e, t ) {
    e.preventDefault();
    
    $( '#by-dept' ).attr('disabled',false);
    
    if ( $( '#by-dept' ).val() != null ) 
      console.log( 'DEBUG: ' + $( '#by-dept' ).val() );
    
    t.$( '#assign-by-dept' ).css("background-position", "0% 100%");
    t.$( '#all-students' ).css("background-position", "0% 0%");

    $( '#assign-by-dept-radio' ).attr( 'disabled', false );
    $( '#assign-by-dept-radio' ).val(true).trigger("change");
    $( '#by-dept' ).attr('disabled',false);
    
    $( '#all-students-radio' ).val(false).trigger("change");
    $( '#all-students-radio' ).attr('disabled',true);
    
    $( '#by-name' ).val(null).trigger("change");
    $( '#by-name' ).attr('disabled',true);
//-----------------------------------------------------------------
  },
  
  
  /********************************************************
   * #WRAP-BY-NAME  ::(CLICK)::
   *******************************************************/
  'click #wrap-by-name'( e, t ){
    e.preventDefault();
    
    $( '#by-name' ).attr('disabled',false);
    
    t.$( '#all-students' ).css("background-position", "0% 0%");
    t.$( '#assign-by-dept' ).css("background-position", "0% 0%");
    
    $( '#assign-by-dept-radio' ).val( false ).trigger( 'change' );
    $( '#assign-by-dept-radio' ).attr( 'disabled', true );
    $( '#by-dept' ).val(null).trigger("change");
    $( '#by-dept' ).attr('disabled',true);
    
    $( '#all-students-radio').val(false).trigger('change');
    $( '#all-students-radio').attr('disabled', true);
    $( '#all-students').attr('disabled',true);
//-----------------------------------------------------------------
  },
  
  
  /********************************************************
   * #BY-NAME ( ASSIGN-BY-NAME )  ::(click)::
   *******************************************************/
  'change #by-name'( e, t ) {
    e.preventDefault();
    
    if ( $( '#by-name' ).val() == null ) return;
    
    if ( $( '#by-name' ).val() != null ) {
      console.log( 'DEBUG: ' + $( '#by-name' ).val() );
    }
//-----------------------------------------------------------------
  },


/**********************************************************
 * #SEARCH-COURSES  ::(KEYPRESS)::
 *********************************************************/
  'keypress #search-courses': function(event){
    e.preventDefault();
    e.stopImmediatePropagation();

    if ( event.which == 13 ){
      event.preventDefault();

      let idx = t.$( "#search-courses" ).val(),
          item = Courses.find({ _id: idx  }, { limit:1 }).fetch()[0];
      return item;
    }
//-----------------------------------------------------------------
  },


  /********************************************************
   * #DASHBOARD-PAGE  ::(CLICK)::
   *******************************************************/
  'click #dashboard-page'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
//-----------------------------------------------------------------
  },


});