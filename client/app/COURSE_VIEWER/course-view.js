/*
 * @module courseView
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import { Template }       from 'meteor/templating';
import { ReactiveVar }    from 'meteor/reactive-var';

import { BuiltCourses }   from '../../../both/collections/api/built-courses.js';
import { Students }       from '../../../both/collections/api/students.js';

import * as CBCreateDOM   from '../CB/CB_MODULES/createDOM.js';
//import * as Render        from '../CB/CB_MODULES/render.js';

import './course-view.html';

let b, c, len, page, total;
/*=========================================================
 * CREATED
 *=======================================================*/
Template.courseView.onCreated( function() {
  //$( '#cover' ).show();
  this.page       = new ReactiveVar(1);
  this.total      = new ReactiveVar(1);
  this.render;
  
  Tracker.autorun( () => {
    Meteor.subscribe('builtCourses');
    Meteor.subscribe('students');
  });

  Session.set('taken', false);
//-------------------------------------------------------------------
});
/*=========================================================
 * RENDERED
 *=======================================================*/
Template.courseView.onRendered( function() {
  //$('#yosco').hide();
/*
  $( '#cover' ).delay( 1000 ).fadeOut( 'slow',
                                      function() {
                                        $( "#cover" ).hide();
                                        $( ".dashboard-header-area" )
                                            .fadeIn( 'slow' );
                                      }
  );
*/
    //let self = this;
    //self.subscribe("name", function() {
    
    Session.set('taken', {} );
    
    this.autorun(function() { //self
      try {
        let bc = BuiltCourses.find({ _id: FlowRouter.getQueryParam( "course" )}).fetch()
          , pg_num  = Template.instance().page.get()
          , bcp;
       
        bcp = bc && bc[0] && bc[0].pages;
        
        Template.instance().total.set( bcp.length );
                                      
        //IS THE DATABASE PRESENT?
        if ( bcp ) {
          render( bc );
        }
      } catch(e) {
        ;
        return;
      }
    }); //autorun
//-----------------------ON RENDERED------------AUTORUN----------------------

  /*****************
   * RENDER FUNCTION
   ****************/
  render =
    (function( bc ){
      let rtn_arr
        , o       = []
        , bcp;
        
      bcp = bc && bc[0] && bc[0].pages;
      
      try {
       if ( (bcp.length) != undefined ) {
          for( let i = 0, ilen = bcp.length; i < ilen; i++ ) {
            if ( bcp[i].page_no == Template.instance().page.get() ){
              
              $( '#test_v' ).hide();
              $( '#fb-template' ).show();
              
              if ( bcp[i].type == 'test' ) {
                
                Session.set('test', bcp[i].id );
                
                $( '#fb-template' ).empty().hide();
                
                $( '#test_v' ).show();
                break;
              } else
                  if ( bcp[i].type == 'pdf') {
                    Bert.alert({
                        title:    'Loading PDF',
                        message:  'Give it a few seconds to load...',
                        type:     'success',
                        style:    'growl-top-right',
                        icon:     'fa-youtube'
                  });
              } else
                  if ( bcp[i].type == 'video' ) {
                    Bert.alert({
                        title:    'Loading Video',
                        message:  'Give it a few seconds to load...',
                        type:     'success',
                        style:    'growl-top-right',
                        icon:     'fa-youtube'
                    });
              } else
                  if ( bcp[i].type == 'scorm' ) {
                    Bert.alert({
                        title:    'Loading SCORM',
                        message:  'Give it a few seconds of load...',
                        type:     'success',
                        style:    'growl-top-right',
                    });
              }
              o.push( bcp[i] );
            }
          }
        } else {
            o.push( bcp );
        }
        
        $('#fb-template').empty();
        
        rtn_arr   = handlePrevious( o );
        let funcs = rtn_arr[1];
        
        //ATTACH ELEMENTS RETURNED FROM CLASS TO DOM
        $('#fb-template').html( rtn_arr[0] ); //append
        
        //ACTIVATE POSITIONING JQUERY FUNCTIONS RETURNED FROM CLASS
        for ( let i = 0, ilen = funcs.length; i < ilen; i++ ) {
          eval( funcs[i] );
        }
     } catch(ReferenceError) {
        ;
      }
  });
//------------------------------------------------------ON RENDERED-------------
});
/*=========================================================
 * HELPERS
 *=======================================================*/
Template.courseView.helpers({
  avatar() {
    try {
      return Students.findOne({_id: Meteor.userId()}).avatar;
    } catch(e) {
      return;
    }
  },
  course: () => {
    //
    //  THIS IS JUST HERE TO "CALL" THE ONRENDERED AUTORUN FUNCTION
    return;
  },
  cname: () => {
    let cid = FlowRouter.getQueryParam( "course" );
    try {
      return BuiltCourses.find({ _id: cid }).fetch()[0].cname;
    } catch(e) {
      return;
      //console.log(e);
    }
  },
  fname: () => {
    try {
      return Students.findOne({ _id: Meteor.userId() }).fname;
    } catch(e) {
      return;
      //console.log(e);
    }
  },
  page: () =>
   Template.instance().page.get(),
  total: () =>
   Template.instance().total.get()
//-------------------------------------------------------------------
});

/*=========================================================
 * EVENTS
 *=======================================================*/
 
Template.courseView.events({
  /********************************************************
   * #LOGOUT  ::(CLICK)::
   *******************************************************/
  'click #cv-logout': function( e, t ) {
    e.preventDefault();
    Session.set('Scratch', null);
    Meteor.logout();
    FlowRouter.go( '/login' );
//-------------------------------------------------------------------
  },
  
  /********************************************************
   * .JS-BACK-TO-HOME  ::(CLICK)::
   *******************************************************/
  'click #course-view-page-back'( e, t ) {
    e.preventDefault();
    
    let roles = Meteor.user() && Meteor.user().roles
      , u_id  = Meteor.userId();
    
    Session.set('Scratch', null);
    if ( roles.teacher )
    {
      FlowRouter.go( 'teacher-courses', { _id: u_id });
      return;
    } else if ( roles.admin )
    {
      FlowRouter.go( 'admin-courses', { _id: u_id });
      return;
    } else if ( roles.student )
    {
      FlowRouter.go( 'student-courses', { _id: u_id });
      return;
    }
    return;
//-------------------------------------------------------------------
  },
  /********************************************************
   * CV-DASHBOARD-LINK
   *******************************************************/
  'click #cv-dashboard-link'( e, t ) {
      e.preventDefault();
      
      let roles = Meteor.user() && Meteor.user().roles
        , u_id  = Meteor.userId();
        
      Session.set('Scratch', null);
      
      if ( roles.teacher )
      {
        FlowRouter.go( 'teacher-dashboard', { _id: u_id });
        return;
      } else if ( roles.admin )
      {
        FlowRouter.go( 'admin-dashboard', { _id: u_id });
        return;
      } else if ( roles.student )
      {
        FlowRouter.go( 'student-dashboard', { _id: u_id });
        return;
      }
      //$( '#course-view-page-back' ).click();
      return;
//-------------------------------------------------------------------
  },
   /*******************************************************
    * CV-COURSES-LINK
    ******************************************************/
  'click #cv-courses-link'( e, t ) {
    e.preventDefault();
    
    let roles = Meteor.user() && Meteor.user().roles
      , u_id  = Meteor.userId();
    Session.set('Scratch', null);
    
    if ( roles.teacher )
    {
      FlowRouter.go( 'teacher-courses', { _id: u_id });
      return;
    } else if ( roles.admin )
    {
      FlowRouter.go( 'admin-courses', { _id: u_id });
      return;
    } else if ( roles.student )
    {
      FlowRouter.go( 'student-courses', { _id: u_id });
      return;
    }
//-------------------------------------------------------------------
  },
  /********************************************************
   * CV_PREV_BUTTON ::(CLICK)::
   *******************************************************/
  'click #cv-prev-btn'( e, t ) {
    e.preventDefault();
    if ( t.page.get() > 1 ) {
      t.page.set( t.page.get() -1);
    } else {
      return;
    }
//-------------------------------------------------------------------
  },
  /********************************************************
   * CV-NEXT-BUTTON ::(CLICK)::
   *******************************************************/
  'click #cv-next-btn'( e, t ) {
    e.preventDefault();
    if ( t.page.get() < t.total.get() ) {
      t.page.set( t.page.get() + 1);
    } else {
      return;
    }
//-------------------------------------------------------------------
  }
});

/**********************************************************
 * HANDLE PREVIOUS
 *********************************************************/
 function handlePrevious( o ) {
    let funcs   = ''                    //FUNCS FROM CLASS TO POSITION ELEMENTS
      , content = ''                    //RENDERED MARKUP (AND FUNCS) RETURNED
      , cd                              //RENDERING CLASS INSTANCE
      , mark_up = '';                   //RENDERED MARKUP RETURN VARIABLE
      
    //CREATE INSTANCE OF CBCreateDOM CLASS
    cd        = new CBCreateDOM.CreateDOM( o );
    
    //RETRIEVE RESULT OF PROCESSING RETURNED DATABASE ELEMENTS
    content   = cd.buildDOM();
    
    //PULL OUT THE MARKUP RETURNED FROM CLASS
    mark_up   = content[0];
    
    //PULL OUT THE JQUERY FUNCTIONS RETURNED FROM CLASS
    funcs     = content[1];
    return [ mark_up, funcs ];
 }
