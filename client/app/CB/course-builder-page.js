/*
 * @module courseBuilderPage
 *
 * @programmer <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import async              from 'async';
import { Template }       from 'meteor/templating';
import { ReactiveVar }    from 'meteor/reactive-var';

import { Courses }        from '../../../both/collections/api/courses.js';
import { BuiltCourses }   from '../../../both/collections/api/built-courses.js'
import { Students }       from '../../../both/collections/api/students.js';
import { Images }         from '../../../both/collections/api/images.js';
import { Pdfs }           from '../../../both/collections/api/pdfs.js';
import { PowerPoints }    from '../../../both/collections/api/powerpoints.js';
import { Scorms } 	      from '../../../both/collections/api/scorms.js';

import './course-builder-page.html';
import '../../../public/jquery-ui-1.12.0.custom/jquery-ui.css';

/*
 * IMPORT BROKEN-OUT EVENT HANDLERS
 */
import * as CBCreateDOM from './CB_MODULES/createDOM.js';
import * as CBImage     from './CB_MODULES/image-handling.js';
import * as CBTitle     from './CB_MODULES/title-handling.js';
import * as CBTexts     from './CB_MODULES/texts-handling.js';
import * as CBVideo     from './CB_MODULES/video-handling.js';
import * as CBPDF       from './CB_MODULES/pdf-handling.js';
import * as CBPP        from './CB_MODULES/power-point-handling.js';
import * as CBSCORM     from './CB_MODULES/scorm-handling.js';
import * as TTL         from './CB_MODULES/cb-title.js';
import * as Render      from './CB_MODULES/render.js';
import { PageObject }   from './CB_MODULES/cb-page-object.js';

let P           = new PageObject()
  , pp          = new Mongo.Collection(null)
  , master_num  = 0
  , page
  , total
  , rtn
  , return_page
  , editor;

/*=========================================================
 *  CREATED
 *=======================================================*/
Template.courseBuilderPage.onCreated( function() {
  //p  = FlowRouter.current().path;
	
  $( '#prompt' ).hide();
  Blaze._allowJavascriptUrls();

  $( '#cover' ).show();

  this.rtn          = new ReactiveVar( FlowRouter.getQueryParam('rtn') );
  this.return_page  = new ReactiveVar(this.rtn.get());
  this.page         = new ReactiveVar(1)
  this.total        = new ReactiveVar(1);
  this.page.set(1);
  this.total.set(1);
  $('#p').attr('data-p', 1);

  let that = this;

  Tracker.autorun( () => {
    Meteor.subscribe('courses');
    Meteor.subscribe('builtCourses');
    Meteor.subscribe('students');
    Meteor.subscribe('images');
    Meteor.subscribe('pdfs');
    Meteor.subscribe('powerpoints');
    Meteor.subscribe('scorms');
  });

  /**************
   * JQUERY-UI
   *************/
  $.getScript( '/jquery-ui-1.12.0.custom/jquery-ui.min.js', function() {
    //---------------------------
    //        DRAGGABLE
    //---------------------------
    $( ".draggable" ).draggable({
      start: function( event, ui ) {
      },
      cursor: "move",
      helper: "clone",
      snap:   true,
      /*handle: "img"*/
    });
    //-----------------------------
    //        DROPPABLE
    //-----------------------------
    $( '#fb-template' ).droppable({
      accept: '.draggable',
      drop: function( evt, ui ) {
        $( '.notice' ).remove();
        $( '#fb-template' ).css({ 'background-color': 'white', 'border': '1px dashed #d3d3d3' });
        let draggedType = ui.draggable.data( 'type' );
          //, p = $('#p').attr('data-p')
          //, t = $('#p').attr('data-t');
        switch ( draggedType ) {
/*******
 * TITLE
 ******/
          case 'title':
          console.log('title drug');
             try {
              let arr = P.dumpPage( that.page.get() );
          console.log('dumpPage is ', arr );
              if ( arr.length > 0 ) {
                for( let titi = 0, titlen = arr.length; titi < titlen; titi++ ) {
                  if ( arr[titi].type == 'test' ) {
                    Bert.alert(
                              'A Test must be the only item on the page!',
                              'danger',
                              'fixed-top',
                              'fa-frown-o'
                            );
                    return;
                  } else
                      if ( arr[titi].type == 'pdf' ) {
                        Bert.alert(
                              'A PDF must be the only item on the page!',
                              'danger',
                              'fixed-top',
                              'fa-frown-o'
                            );
                        return;
                  } else
                      if ( arr[titi].type == 'video' ) {
                         Bert.alert(
                              'A Video must be the only item on the page!',
                              'danger',
                              'fixed-top',
                              'fa-frown-o'
                            );
                          return;
                  }
                }//for
              }//if
            } catch ( e ) {
                ;
            }
              $( '#cb-media-toolbar' ).hide();
              $( '#cb-video-toolbar' ).hide();
              $( '#cb-text-toolbar'  ).hide();
              addTitle( evt.pageX, evt.pageY );
            break;
          case 'text':
/******
 * TEXT
 *****/
              try {
              let arr = P.dumpPage( that.page.get() );
              if ( arr.length > 0 ) {
                for( let txt = 0, txtlen = arr.length; txt < txtlen; txt++ ) {
                  if ( arr[txt].type == 'test' ) {
                    Bert.alert(
                              'A Test must be the only item on the page!',
                              'danger',
                              'fixed-top',
                              'fa-frown-o'
                            );
                    return;
                  } else
                      if ( arr[txt].type == 'pdf' ) {
                        Bert.alert(
                              'A PDF must be the only item on the page!',
                              'danger',
                              'fixed-top',
                              'fa-frown-o'
                            );
                        return;
                  } else
                      if ( arr[txt].type == 'video' ) {
                         Bert.alert(
                              'A Video must be the only item on the page!',
                              'danger',
                              'fixed-top',
                              'fa-frown-o'
                            );
                          return;
                  }
                }//for
              }//if
            } catch ( e ) {
                ;
            }
              $( '#cb-title-toolbar' ).hide()
              $( '#cb-media-toolbar' ).hide();
              $( '#cb-video-toolbar' ).hide();
              //CREATE A NEW EDITOR INSTANCE INSIDE THE <div id="editor">
              //ELEMENT, SETTING ITS VALUE TO HTML.
			        let config  = {}
			          , html    = "";
			        $( '.js-cb-text-edit' ).hide();
			        $( '.js-cb-text-delete' ).hide();
			        $( '#cb-editor-save-text' ).show();
              $( '#cb-text-toolbar' ).show();
              $( '#fb-template' ).hide();
              $( '#cb-next-btn' ).prop('disabled', true );
              $( '#cb-prev-btn' ).prop('disabled', true );

			       editor = CKEDITOR.appendTo( 'editor1', config, html );
              //addText( evt.pageX, evt.pageY );
              break;
          case 'g-image':
/*******
 * IMAGE
 ******/
               try {
              let arr = P.dumpPage( that.page.get() );
              if ( arr.length > 0 ) {
                for( let img = 0, imglen = arr.length; img < imglen; img++ ) {
                  if ( arr[img].type == 'test' ) {
                    Bert.alert(
                              'A Test must be the only item on the page!',
                              'danger',
                              'fixed-top',
                              'fa-frown-o'
                            );
                    return;
                  } else
                      if ( arr[img].type == 'pdf' ) {
                        Bert.alert(
                              'A PDF must be the only item on the page!',
                              'danger',
                              'fixed-top',
                              'fa-frown-o'
                            );
                        return;
                  } else
                      if ( arr[img].type == 'video' ) {
                         Bert.alert(
                              'A Video must be the only item on the page!',
                              'danger',
                              'fixed-top',
                              'fa-frown-o'
                            );
                          return;
                  }
                }//for
              }//if
            } catch ( e ) {
                ;
            }
            if( S3.collection.findOne() ) {
              let id = S3.collection.findOne()._id;
              S3.collection.remove({ _id: id });
            }
              $( '#cb-title-toolbar' ).hide();
              $( '#cb-media-toolbar' ).hide();
              $( '#cb-video-toolbar' ).hide();
              $( '#cb-text-toolbar'  ).hide();
            $( '#add-image' ).modal( 'show' );
            break;
          case 'video':
/*******
 * VIDEO
 ******/
                try {
              let arr = P.dumpPage( that.page.get() );
              if ( arr.length > 0 ) {
                for( let vid = 0, vidlen = arr.length; vid < vidlen; vid++ ) {
                  if ( arr[vid].type == 'test' ) {
                    Bert.alert(
                              'A Test must be the only item on the page!',
                              'danger',
                              'fixed-top',
                              'fa-frown-o'
                            );
                    return;
                  } else
                      if ( arr[vid].type == 'pdf' ) {
                        Bert.alert(
                              'A PDF must be the only item on the page!',
                              'danger',
                              'fixed-top',
                              'fa-frown-o'
                            );
                        return;
                  } else
                      if ( arr[vid].type == 'video' ) {
                         Bert.alert(
                              'A Video must be the only item on the page!',
                              'danger',
                              'fixed-top',
                              'fa-frown-o'
                            );
                          return;
                  }
                }//for
              }//if
            } catch ( e ) {
                ;
            }
            
            try {
              let arr = P.dumpPage( that.page.get() );
              if ( arr.length > 0 ) {
                Bert.alert('Video must be on a page by itself', 'danger');
                return;
              }
            } catch (e) {
              ;
            }
            
            if ( $('#added-video').length > 0 ) {
              Bert.alert( 'Only ONE video may exist on a page!', 'danger');
              return;
            }
              $( '#cb-title-toolbar' ).hide();
              $( '#cb-media-toolbar' ).hide();
              $( '#cb-video-toolbar' ).hide();
              $( '#cb-text-toolbar'  ).hide();
              
            addVideo();
            break;
          case 'pdf':
/*****
 * PDF
 ****/
                 try {
              let arr = P.dumpPage( that.page.get() );
              if ( arr.length > 0 ) {
                for( let pdf = 0, pdflen = arr.length; pdf < pdflen; pdf++ ) {
                  if ( arr[pdf].type == 'test' ) {
                    Bert.alert(
                              'A Test must be the only item on the page!',
                              'danger',
                              'fixed-top',
                              'fa-frown-o'
                            );
                    return;
                  } else
                      if ( arr[pdf].type == 'pdf' ) {
                        Bert.alert(
                              'A PDF must be the only item on the page!',
                              'danger',
                              'fixed-top',
                              'fa-frown-o'
                            );
                        return;
                  } else
                      if ( arr[pdf].type == 'video' ) {
                         Bert.alert(
                              'A Video must be the only item on the page!',
                              'danger',
                              'fixed-top',
                              'fa-frown-o'
                            );
                          return;
                  }
                }//for
              }//if
            } catch ( e ) {
                ;
            }
            try {
              let arr = P.dumpPage( that.page.get() );
              if ( arr.length > 0 ) {
                Bert.alert('Pdf must be on a page by itself', 'danger' );
                return;
              }
            } catch ( e ) {
              ;
            }
              $( '#cb-title-toolbar' ).hide();
              $( '#cb-media-toolbar' ).hide();
              $( '#cb-video-toolbar' ).hide();
              $( '#cb-text-toolbar'  ).hide();
            $( '#add-pdf' ).modal( 'show' );
            break;
          case 'powerpoint':
/*****
 * PPT
 ****/
                 try {
              let arr = P.dumpPage( that.page.get() );
              if ( arr.length > 0 ) {
                for( let ppt = 0, pptlen = arr.length; ppd < pptlen; ppt++ ) {
                  if ( arr[ppt].type == 'test' ) {
                    Bert.alert(
                              'A Test must be the only item on the page!',
                              'danger',
                              'fixed-top',
                              'fa-frown-o'
                            );
                    return;
                  } else
                      if ( arr[ppt].type == 'pdf' ) {
                        Bert.alert(
                              'A PDF must be the only item on the page!',
                              'danger',
                              'fixed-top',
                              'fa-frown-o'
                            );
                        return;
                  } else
                      if ( arr[ppt].type == 'video' ) {
                         Bert.alert(
                              'A Video must be the only item on the page!',
                              'danger',
                              'fixed-top',
                              'fa-frown-o'
                            );
                          return;
                  }
                }//for
              }//if
            } catch ( e ) {
                ;
            }
            try {
              let arr = P.dumpPage( that.page.get() );
              if ( arr.length > 0 ) {
                Bert.alert(
                              'PowerPoint must be the only item on the page!',
                              'danger',
                              'fixed-top',
                              'fa-frown-o'
                            );
                return;
              }
            } catch ( e ) {
              ;
            }
            $( '#cb-title-toolbar' ).hide();
            $( '#cb-media-toolbar' ).hide();
            $( '#cb-video-toolbar' ).hide();
            $( '#cb-text-toolbar'  ).hide();
            $( '#add-powerpoint' ).modal( 'show' );
            break;
          case 'scorm':
/*******
 * SCORM
 ******/
                 try {
              let arr = P.dumpPage( that.page.get() );
              if ( arr.length > 0 ) {
                for( let scm = 0, scmlen = arr.length; scm < scmlen; scm++ ) {
                  if ( arr[scm].type == 'test' ) {
                    Bert.alert(
                              'A Test must be the only item on the page!',
                              'danger',
                              'fixed-top',
                              'fa-frown-o'
                            );
                    return;
                  } else
                      if ( arr[scm].type == 'pdf' ) {
                        Bert.alert(
                              'A PDF must be the only item on the page!',
                              'danger',
                              'fixed-top',
                              'fa-frown-o'
                            );
                        return;
                  } else
                      if ( arr[scm].type == 'video' ) {
                         Bert.alert(
                              'A Video must be the only item on the page!',
                              'danger',
                              'fixed-top',
                              'fa-frown-o'
                            );
                          return;
                  }
                }//for
              }//if
            } catch ( e ) {
                ;
            }
            try {
              let arr = P.dumpPage( that.page.get() );
              if ( arr.length > 0 ) {
                  Bert.alert(
                              'SCORM must be the only item on the page!',
                              'danger',
                              'fixed-top',
                              'fa-frown-o'
                            );
                  return;
              }
            } catch ( e ) {
                ;
            }
            $( '#cb-title-toolbar' ).hide();
            $( '#cb-media-toolbar' ).hide();
            $( '#cb-video-toolbar' ).hide();
            $( '#cb-text-toolbar'  ).hide();
            $( '#add-scorm' ).modal( 'show' );
            break;
          case 'test':
/******
 * TEST
 *****/
                 try {
              let arr = P.dumpPage( that.page.get() );
              if ( arr.length > 0 ) {
                for( let tst = 0, tstlen = arr.length; tst < tstlen; tst++ ) {
                  if ( arr[tst].type == 'test' ) {
                    Bert.alert(
                              'A Test must be the only item on the page!',
                              'danger',
                              'fixed-top',
                              'fa-frown-o'
                            );
                    return;
                  } else
                      if ( arr[tst].type == 'pdf' ) {
                        Bert.alert(
                              'A PDF must be the only item on the page!',
                              'danger',
                              'fixed-top',
                              'fa-frown-o'
                            );
                        return;
                  } else
                      if ( arr[tst].type == 'video' ) {
                         Bert.alert(
                              'A Video must be the only item on the page!',
                              'danger',
                              'fixed-top',
                              'fa-frown-o'
                            );
                          return;
                  }
                }//for
              }//if
            } catch ( e ) {
                ;
            }
            try {
              let arr = P.dumpPage( that.page.get() );
              if ( arr.length > 0 ) {
                  Bert.alert(
                              'A Test must be the only item on the page!',
                              'danger',
                              'fixed-top',
                              'fa-frown-o'
                            );
                  return;
              }
            } catch ( e ) {
                ;
            }
            
            $( '#cb-title-toolbar'  ).hide();
            $( '#cb-text-toolbar'   ).hide()
            $( '#cb-media-toolbar'  ).hide();
            $( '#cb-video-toolbar'  ).hide();
            
            let test_session_bak      = {};
            test_session_bak.page     = that.page.get();
            test_session_bak.total    = that.total.get();
            test_session_bak.name     = Session.get('cinfo').cname;
            test_session_bak.rtn_page = that.return_page.get();
            
            Session.set( 'obj', test_session_bak );
            
            if ( 
                Meteor.user() && 
                Meteor.user().roles && 
                Meteor.user().roles.teacher 
               ) 
            {
              FlowRouter.go( '/teacher/dashboard/test-maker/'
                + Meteor.userId() + `?${test_session_bak.name}` );
                
            } else 
                if ( 
                    Meteor.user() && 
                    Meteor.user().roles && 
                    Meteor.user().roles.admin 
                   ) 
            {
              FlowRouter.go( '/admin/dashboard/test-maker/' + Meteor.userId()
                + `?${test_session_bak.name}` );
            }
            break;
          default:
            return;
        }
      }
    });
  //console.log('CourseBuilder:: jquery-ui.min.js loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'CourseBuilder:: load jquery-ui.min.js fail' );
  });
//-------------------------------------------------------------------
  /*********************
   * SELECT2 INSTANTIATE
   ********************/
  $.getScript( '/js/select2.min.js', function() {
    $( document ).ready(function(){
      $( '#tags' ).select2({
        allowClear:   true,
        tags:         true,
        placeholder: "Keywords"
      });
    });
    //console.log('CB:: chosen,jquery.min.js loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'CB:: load select2.js fail' );
  });
//-------------------------------------------------------------------
});  //END ONCREATED
/*=========================================================
 * RENDERED
 *========================================================*/
Template.courseBuilderPage.onRendered( function() {
  $( '#cover' )
    .delay( 1000 )
    .fadeOut( 'slow',
              function() {
                $( "#cover" ).hide();
                $( ".dashboard-header-area" ).fadeIn( 'slow' );
              }
  );
  
  $('#test_v').hide();
  $('#cb-media-toolbar').hide();
  $('#cb-text-toolbar').hide();
  $('#cb-bar').hide();
  $('#cb-title-toolbar').hide();
  $('#cb-video-toolbar').hide();
  
/*
 * WE'RE HERE TO EDIT?
 */
  if (
      FlowRouter.getQueryParam('rtn')   &&
      FlowRouter.getQueryParam('id')    &&
      FlowRouter.getQueryParam('edit')  &&
      FlowRouter.getQueryParam('name')
     )
  {
    let ed = FlowRouter.getQueryParam('edit')
      , nm = FlowRouter.getQueryParam('name')
      , id = FlowRouter.getQueryParam('id')
      , bc;
      
    Session.set('my_id', id);
    
    if ( Number(ed) == 1 ) { //WE'RE HERE TO EDIT
    
      this.autorun(function() {
        
        try {
            bc = BuiltCourses.find({ _id: id }).fetch()[0];
          console.log( bc );
          console.log( bc.pages );
            Session.set('cinfo', {
                              cname: bc.cname,
                              credits: Number(bc.credits),
                              passing_percent: Number(bc.passing_percent),
                              keywords: bc.keywords,
                              icon: "/img/icon-4.png",
                              company_id: bc.company_id,
                              creator_type: bc.creator_type,
                              creator_id: bc.creator_id
            });
        } catch (e) {
          ;
        }
      });//autorun
    }//if
  } else
/*
 * SUCCESSFUL RETURN FROM TEST CREATION
 */
      if (
          FlowRouter.getQueryParam( "rtn" ) &&
          FlowRouter.getQueryParam( "id"  )
         )
  {
    //RESTORE THE SESSION
    let test_session_bak = Session.get( 'obj' );
    Session.set( 'obj', null );
    Session.set( 'test_id', FlowRouter.getQueryParam("id") );
    Session.set( 'Scratch', FlowRouter.getQueryParam("id") );
    //SAVE THE TEST
    P.append({
      page_no:  test_session_bak.page,
      type:     'test',
      id:       Session.get('test_id'),
    });
    
    //SHOW THE TEST
    $('#fb-template').empty();
    $('#fb-template').hide();
    $('#test_v').show();
    this.page.set( test_session_bak.page );
    this.total.set( test_session_bak.total );
    this.return_page.set(test_session_bak.rtn_page);
    return;
  }
/*
 * CANCELED TEST RETURN
 */
  if (
      FlowRouter.getQueryParam( "rtn" ) &&
      FlowRouter.getQueryParam( "cancel" )
     )
  {
    let test_session_bak = Session.get( 'obj' );
    if ( 
        test_session_bak && 
        test_session_bak.page && 
        test_session_bak.total 
       ) 
    {
      this.page.set( test_session_bak.page );
      this.total.set( test_session_bak.total );
    } else {
      console.log('fail');
    }
    
    if ( 
        test_session_bak && 
        test_session_bak.rtn_page 
       ) 
    {
      this.return_page.set( test_session_bak.rtn_page);
      this.rtn.set( test_session_bak.rtn_page );
    }
    
    Session.set('obj', null);
    test_session_bak = null;
    return;
  }
  
  Meteor.setTimeout(function(){
    let returnFromTest = Session.get('test_id');
    //IF WE'RE RELOADING TO CLEAR URL AFTER RETURNING FROM TEST BUILDING
    if ( _.isNull( returnFromTest ) || _.isUndefined( returnFromTest ) ) {
      $( '#intro-modal' ).modal( 'show' );
    //OTHERWISE, WE'RE HERE FRESH
    } else {
      return;
    }
  }, 0);
/*
  window.addEventListener( "beforeunload", function() {
    console.log( "Close web socket" );
    socket.close();
  });
*/
//-------------------------------------------------------------------
}); //END ONRENDERED

/*=========================================================
 * HELPERS
 *=======================================================*/
Template.courseBuilderPage.helpers({
  
  cbNavBack: () => {
    if ( Template.instance().return_page.get() == 'library' ) {
      return 'Back To Library';
    } else if ( Template.instance().return_page.get() == 'courses' ) {
      return 'Back To Courses';
    }
  },
  
  fname: () => {
    try {
      return Students.findOne({ _id: Meteor.userId() }).fname;
    } catch(e) {
      //console.log('ERROR: ' + e.name + ': ' + e.message );
      return;
    }
  },
  
	"files": function(){
		return S3.collection.find();
	},
	
  page: () =>
    Template.instance().page.get(),
    
  total: () =>
    Template.instance().total.get()
});
//-------------------------------------------------------------------

/*=========================================================
 * EVENTS
 *=======================================================*/
 
Template.courseBuilderPage.events({
/********************************************************
 * CB-NEXT  ::(CLICK)::    [NEXT BUTTON CLICK]
 *******************************************************/
  'click #cb-next-btn'( e, t ) {
    e.preventDefault();
    //HIDE EDITING TOOLBARS
    $( '#cb-text-toolbar'  ).hide();
    $( '#cb-media-toolbar' ).hide();
    $( '#cb-title-toolbar' ).hide();
    $( '#cb-video-toolbar' ).hide();
    $('#cb-current').val(null);
    let p   = t.page.get()
      , tt  = t.total.get()
      , chk = P.dumpPage(p);
      
    if ( chk == undefined ) {
      console.log('here');
      return;
    }
    
    $('#fb-template').empty();
    $('#test_v').hide();
    
    if ( p < tt ) {
      p++;
      t.page.set( p );
      let arr = P.dumpPage(p);
      Render.render( e, t, arr, P );
      return;
    } else {
      try {
        let arr = P.dumpPage( p );
        if ( p == tt && arr.length == 0 ){
          return;
        } else {
          $('#fb-template').empty().show();
          t.page.set( p + 1 );
          t.total.set( p + 1 );
            return;
        }
      } catch (e) {
          ;
      }
      return;
    }
  },
//---------------------------------------------------------
/********************************************************
 * CB-PREV  ::(CLICK)::    [PREVIOUS BUTTON CLICK]
 *******************************************************/
  'click #cb-prev-btn'( e, t ) {
    e.preventDefault();
    //HIDE EDITING TOOLBARS
    $( '#cb-text-toolbar'  ).hide();
    $( '#cb-media-toolbar' ).hide();
    $( '#cb-title-toolbar' ).hide();
    $( '#cb-video-toolbar' ).hide();

    $('#cb-current').val(null);
    

    let p = t.page.get()
      , chk = P.dumpPage(p);
      
    if ( p <= 1 ) {
      p = 1;
    } else {
      p -= 1;
    }
    t.page.set( p );
    
    if ( chk == undefined ) {
      return;
    }
    
    let arr = P.dumpPage(p);
    Render.render( e, t, arr, P );
  },
/********************************************************
 * #CB-INITIAL-DIALOG  ::(CLICK)::  [INITIAL DIALOG]
 *******************************************************/
  'click #cb-initial-dialog'( e, t ) {
    e.preventDefault();
      // SET PAGE COUNTS
      t.page.set( 1 );
      t.total.set( 1 );
      let credits = t.$( '#course-builder-credits' ).val()
      , name    = t.$( '#course-builder-name'    ).val()
      , percent = t.$( '#course-builder-percent' ).val()
      , keys    = t.$( '#tags' ).val()
      , role
      , creator_id  = Meteor.userId()
      , cid         = Meteor.user() &&
                      Meteor.user().profile &&
                      Meteor.user().profile.company_id
      , roles       = Meteor.user() &&
                      Meteor.user().roles;
                      
      if ( percent  == '' ) percent = 1001; //completion is passing
      if ( name     == '' || credits == '' ) {
        Bert.alert(
                    'BOTH Course Name AND Credits MUST be filled out!',
                    'danger',
                    'fixed-top',
                    'fa-frown-o'
                  );
        return;
      }
      if ( Courses.findOne({ name: name }) != undefined )
      {
        Bert.alert(
                    'There is already a course with that name!',
                    'danger',
                    'fixed-top',
                    'fa-grown-o'
                  );
        return;
      }
      if ( roles && roles.teacher )    role = 'teacher';
      if ( roles && roles.admin )      role = 'admin';
      if ( roles && roles.SuperAdmin ) role = 'SuperAdmin';
            
      if ( keys == null ) keys = [""];
      
      Session.set('cinfo', {
                            cname: name,
                            credits: Number(credits),
                            passing_percent: Number(percent),
                            keywords: keys,
                            icon: "/img/icon-4.png",
                            company_id: cid,
                            creator_type: role,
                            creator_id: creator_id
      });
      let my_id = pp.insert({ pages: [] });
      Session.set( 'my_id', my_id );
      t.$( '#intro-modal' ).modal( 'hide' );
//-----------------------------------------------/INITIAL DIALOG------
  },
  /********************************************************
   * CB-INTRO-MODAL-CANCEL
   *******************************************************/
   'click #cb-intro-modal-cancel'( e, t ) {
      e.preventDefault();
      let ret_route = FlowRouter.getQueryParam("rtn");
      t.$( '#intro-modal' ).modal( 'hide' );
      Meteor.setTimeout(function() {
        
        let roles = Meteor.user() && Meteor.user().roles;
        
        if ( roles.admin )
        {
          if ( ret_route == 'courses' ) {
              FlowRouter.go( 'admin-courses', { _id: Meteor.userId() });
              return;
          } else if ( ret_route == 'library' ) {
              FlowRouter.go( 'admin-add-from-library', { _id: Meteor.userId() });
          }
        }
        else if ( roles.SuperAdmin )
        {
          FlowRouter.go( 'super-admin-library', { _id: Meteor.userId() });
          return;
        }
        else if ( roles.teacher )
        {
          FlowRouter.go( 'teacher-courses', { _id: Meteor.userId() });
          return;
        }
      }, 500);
   },
 //---------------------------------------------------------
  /********************************************************
   * .JS-BACK-TO-HOME  ::(CLICK)::
   *******************************************************/
  'click #course-builder-page-back'( e, t ) {
    e.preventDefault();
    t.$( '#cb-leave-confirm' ).modal('show');
    return;
//-------------------------------------------------------------------
  },
  /********************************************************
   * CB-LEAVE-NO  ::(CLICK)::
   ********************************************************/
  'click #cb-leave-no'( e, t ) {
    e.preventDefault();
    t.$( '#cb-leave-confirm' ).modal('hide');
  },
  /********************************************************
   * CB-LEAVE-YES  ::(CLICK)::    [LEAVE COURSE BUILDER]
   *******************************************************/
  'click #cb-leave-yes'( e, t ) {
    e.preventDefault();
    // ADVANCE PAGE COUNTS
    t.page.set( 1 );
    t.total.set( 1 );
    Session.set( 'my_id',           null );
    Session.set( 'cinfo',           null );
    Session.set( 'test_id',         null );
    Session.set( 'Scratch',         null );
    t.$( '#cb-leave-confirm' ).modal('hide');
    //NECESSARY DELAY OR DIALOG CAUSES DISPLAY ISSUES ON DESTINATION
    Meteor.setTimeout(function(){
      try {
        
        let roles = Meteor.user() && Meteor.user().roles;
        
        if ( t.return_page.get() == 'courses' )
        {
          if ( roles && roles.teacher )
          {
            FlowRouter.go( 'teacher-courses', { _id: Meteor.userId() });
            return;
          } else if ( roles && roles.admin )
          {
            FlowRouter.go( 'admin-courses', { _id: Meteor.userId() });
            return;
          }
        } else if ( t.return_page.get() == 'library' ) {
          if ( roles && roles.teacher )
          {
            FlowRouter.go( 'teacher-courses', { _id: Meteor.userId() });
            return;
          } else if ( roles && roles.admin )
          {
            FlowRouter.go( 'admin-add-from-library', { _id: Meteor.userId() });
            return;
          } else if ( roles && roles.SuperAdmin )
          {
            FlowRouter.go( 'super-admin-library', { _id: Meteor.userId() });
            return;
          }
        }
      } catch( e ) {
        console.log( e );
        console.log( 'cb lineno: 974' );
      }
    }, 500);
//---------------------------------------------------------
  },
  /********************************************************
   * #EXIT-CB  ::(CLICK)::
   *******************************************************/
  'click #exit-cb'( e, t ) {
    t.$( '#intro-modal' ).modal( 'hide' );
      // ADVANCE PAGE COUNTS
      t.page.set(  1 );
      t.total.set( 1 );
      
      Session.set( 'cinfo',   null );
      Session.set( 'my_id',   null );
      Session.set( 'test_id', null );
      Session.set( 'Scratch', null );
      
    let roles = Meteor.user() && Meteor.user().roles;
    
    if ( roles && roles.teacher )
    {
      FlowRouter.go( 'teacher-dashboard', { _id: Meteor.userId() });
      return;
    } else if ( roles && roles.admin )
    {
      FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
      return;
    } else if ( roles && roles.SuperAdmin )
    {
      FlowRouter.go( 'super-admin-dashboard', { _id: Meteor.userId() });
      return;
    }
  },
/********************************************************
 * #CB-SAVE  ::(CLICK)::  [SAVE COURSE]
 *******************************************************/
  'click #cb-save'( e, t ) {
    e.preventDefault();
    
    t.$( '#intro-modal' ).modal( 'hide' );

    // CHECK THAT THERE'S CONTENT


    let uname = Students.findOne( { _id: Meteor.userId() },
                                  { fullName:1 } ).fullName
      , cinfo = Session.get('cinfo'); 
      
    let pobj = P.dump();
    if ( pobj.length <= 0 ) {
      Bert.alert("You can't save an EMPTY course!!", 'danger');
      return;
    }

    Meteor.setTimeout(function(){
      Meteor.call('saveBuiltCourse',  cinfo.cname,
                                      cinfo.company_id,
                                      cinfo.creator_type,
                                      cinfo.credits,
                                      cinfo.keywords,
                                      cinfo.passing_percent,
                                      cinfo.icon,
                                      pobj,
                                      uname,
                                      function( error, result )
      {
          if( error ) {
            alert( 'Error' );
          } else {
            console.log( 'result is ' + result );
            //Session.set("data", result)
            Courses.insert({
              _id:              result,
              credits:          cinfo.credits,
              name:             cinfo.cname,
              passing_percent:  cinfo.passing_percent,
              company_id:       [cinfo.company_id],
              times_completed:  0,
              icon:             cinfo.icon,
              public:           false,
              creator_type:     cinfo.creator_type,
              creator_id:       cinfo.creator_id,
              created_at:       new Date(),
              approved:         true,
              type:             'course',
              isArchived:       false
            });
          }
    });
    
      //-----------------------------------------------
      /*
       * IF THE COURSE CREATOR IS A TEACHER
       * ASSIGN TEACHER A FIXED 2 CREDITS
       *--------------------------------------------- */
       if ( Meteor.user().roles && Meteor.user().roles.teacher ) {
         Students.update({ _id: Meteor.userId() },
                         {
                           $inc: { current_credits: 2 }
                         });
       }
      //-----------------------------------------------
      // SET PAGE COUNTS
      t.page.set( 1 );
      t.total.set( 1 );
    }, 300);
    
    P = null;
    
    Session.set( 'my_id',           null );
    Session.set( 'cinfo',           null );
    Session.set( 'test_id',         null );
    Session.set( 'Scratch',         null );
    
    Meteor.setTimeout(function(){
      Bert.alert(
                  'Your Course was saved!',
                  'success',
                  'growl-top-right'
                );
    }, 500);
    
    let roles = Meteor.user() && Meteor.user().roles;
    
    if ( roles && roles.admin )
    {
      FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
      return;
    }
    if ( roles && roles.teacher )
    {
      FlowRouter.go( 'teacher-dashboard', { _id: Meteor.userId() });
      return;
    }
    if ( roles && roles.SuperAdmin )
    {
      FlowRouter.go( 'super-admin-dashboard', { _id: Meteor.userId() });
      return;
    }
//---------------------------------------------/SAVE COURSE-------
  },


  /********************************************************
   * #ADDED-TITLE  ::(BLUR)::
   *******************************************************/
  'blur #added-title'( e, t ) {
    CBTitle.cbAddedTitleBlur( e,
                              t,
                              t.page.get(),
                              master_num++,
                              P
                            );
  },
//---------------------------------------------------------


//--------------TOOLBAR HANDLERS-------------------------//


//--BEGIN TITLES TOOLBAR-----------------------------------
 /**********************************************************
 * .JS-TITLE-EDIT-BUTTON
 *********************************************************/
 'click .js-title-edit-button'( e, t ) {
    e.preventDefault();
    TTL.titleEditText( e, t, P );
//---------------------------------------------------------
 },
   /********************************************************
   * .JS-TITLE-DELETE-BUTTON
   *******************************************************/
  'click .js-title-delete-button'( e, t ) {
    e.preventDefault();
    TTL.titleDelete( e, t, P, pp );
//----------------------------------------------------------
  },
/**********************************************************
 * .JS-TITLE-ITALIC-BUTTON  ::(CLICK)::
 *********************************************************/
  'click .js-title-italic-button'( e, t ) {
    e.preventDefault();
    TTL.titleItalic( e, t, P );
//---------------------------------------------------------
  },
 /**********************************************************
 * .JS-TITLE-BOLD-BUTTON ::(CLICK)::
 *********************************************************/
  'click .js-title-bold-button'( e, t ) {
    e.preventDefault();
    TTL.titleBold( e, t, P );
//---------------------------------------------------------
  },
 /**********************************************************
 * .JS-TITLE-UNDERLINE-BUTTON  ::(CLICK)::
 *********************************************************/
  'click .js-title-underline-button'( e, t ) {
    e.preventDefault();
    TTL.titleUnderline( e, t, P );
//---------------------------------------------------------
  },
 /**********************************************************
 * .JS-TITLE-FONT-SIZE  ::(INPUT)::
 *********************************************************/
  'input .js-title-font-size'( e, t ) {
    e.preventDefault();
    TTL.titleFontSizeInput( e, t );
  },
//---------------------------------------------------------
 /**********************************************************
 * .JS-TITLE-FONT-SIZE  ::(MOUSEUP)::
 *********************************************************/
  'mouseup .js-title-font-size'( e, t ) {
    //e.preventDefault();
    TTL.titleFontSizeMU( e, t, P );
    return;
  },
//---------------------------------------------------------
/**********************************************************
 * .JS-TITLE-OPACITY  ::(INPUT)::
 *********************************************************/
  'input .js-title-opacity'( e, t ) {
    e.preventDefault();
    TTL.titleOpacityInput( e, t );
  },
//---------------------------------------------------------
 /**********************************************************
 * .JS-TITLE-OPACITY  ::(MOUSEUP)::
 *********************************************************/
  'mouseup .js-title-opacity'( e, t ) {
    //e.preventDefault();
    TTL.titleOpacityMU( e, t, P );
    return;
  },
 //---------------------------------------------------------
//---------------------------------------END TITLES TOOLBAR-
//---BEGIN TEXT TOOLBAR------------------------------------
/**********************************************
 * KLUDGE TO BRING UP SAVE BUTTON IF FOCUS LOST
**********************************************/
    'click #editor1'( e, t ) {
      e.preventDefault();
      $( '#cb-title-toolbar' ).hide();
      $( '#cb-media-toolbar' ).hide();
      $( '#cb-text-toolbar' ).show();
      $( '.js-cb-text-edit' ).hide();
      $( '.js-cb-text-delete' ).hide();
      $( '#cb-editor-save-text' ).show();
    },
/**********************************************************
 * .JS-CB-TEXT-EDIT  ::(CLICK)::
 *********************************************************/
 'click .js-cb-text-edit'( e, t ) {
    e.preventDefault();
      $( '#cb-editor-save-text' ).show();
      $( '.js-cb-text-edit' ).hide();
      $( '.js-cb-text-delete' ).hide();

      //IE #txt-0
      let currentItem = t.$( '#cb-current' ).val()
        , text        = t.$( `#${currentItem}` ).html()
        , config      = {};

      $( `#${currentItem}` ).hide();

      // Creates a new editor instance
      editor = CKEDITOR.appendTo( 'editor1', config, text );

      //CKEDITOR.instances.editor.setData(text);
      $('#cb-text-toolbar').show()

      $('#cb-next-btn').prop("disabled",true);
      $('#cb-prev-btn').prop("disabled",true);
 },
//---------------------------------------------------------
/**********************************************************
 * #CB-EDITOR-SAVE-TEXT  ::(CLICK)::
 *********************************************************/
 'click #cb-editor-save-text'( e, t ) {
   e.preventDefault();

   let cur  = $('#cb-current').val()
    , txt   = editor && editor.getData(); //CKEDITOR.instances.editor.getData();
console.log(txt);    
    //TEXT COMES FORM CKEDITOR IN HTML FORMAT. CONVERT TO TEXT
    //txt = $(txt).text().trim();
    
	 //DON'T ACCEPT EMPTY INPUT
	 if ( 
	      txt == ''         || 
        txt == undefined  || 
        txt == null       || 
        ( ! txt.replace(/\s/g, '').length ) 
      ) 
   {
	   Bert.alert('You must enter text to be saved', 'danger');
	   return;
	 }

   if ( cur != '' ) { //WE'RE EDITING
      $( `#${cur}` ).show();
      $( `#${cur}` ).html( txt );

      let idx = P.indexOf( `${cur}` );

      P.removeAt( idx );

      P.insert( idx, {
        page_no:        t.page.get(),
        type:           'text',
        id:             cur,
        text:           txt,
        offset:         $( `#${cur}` ).offset(),
        zIndex:         $( `#${cur}` ).css('z-index'),
        fontSize:       $( `#${cur}` ).css('font-size'),
        border:         $( `#${cur}` ).css('border'),
        fontWeidht:     $( `#${cur}` ).css('font-weight'),
        fontStyle:      $( `#${cur}` ).css('font-style'),
        textDecoration: $( `#${cur}` ).css('text-decoration'),
        opacity:        $( `#${cur}` ).css('opacity')
      });
      P.print();

		  $('#cb-text-toolbar').hide();

    
      $('#cb-current').val(null);
      
      editor.focusManager.blur(true);
      editor && editor.destroy();
		  editor = null;
		
		  //ALLOW PAGE ADVANCE / DECREMENT
      $( '#cb-next-btn' ).prop('disabled', false );
      $( '#cb-prev-btn' ).prop('disabled', false );
		
		  return;

   } else {   
      //WE'RE CREATING A NEW TEST ELEMENT
console.log('creating');
      editor.focusManager.blur(true)
      editor && editor.destroy();
		  editor = null;

		  $('#cb-text-toolbar').hide();

      CBTexts.cbAddedTextBlur(  e,
                                t,
                                txt,
                                t.page.get(),
                                master_num++,
                                P
                              );
   }//else

   //SHOW CANVAS AS IT WAS HIDDEN WHEN TEXT EDITOR WAS DISPLAYED
   $( '#fb-template' ).show();

   //ALLOW PAGE ADVANCE / DECREMENT
   $( '#cb-next-btn' ).prop('disabled', false );
   $( '#cb-prev-btn' ).prop('disabled', false );

   $('#cb-current').val(null);
    //CKEDITOR.instances.editor.setData('');
 },


//---------------------------------------------------------
/**********************************************************
 * .JS-CB-TEXT-DELETE  ::(CLICK)::
 *********************************************************/
 'click .js-cb-text-delete'( e, t ) {
    e.preventDefault();
    //I.E. txt-0
    let cur = $( '#cb-current' ).val()
      , idx     = P.indexOf( cur );

 		P.removeAt( idx );
    $( `#${cur}` ).remove();
    $( '#cb-current' ).val('');

    $('#cb-text-toolbar').hide();

     pp.update( { _id: Session.get('my_id') },
              { $pull: { pages:{ id: cur} } });


    P.print();
    console.log( pp.find({}).fetch() );
    //editor.destroy();
		//editor = null;
//---------------------------------------------------------
},
//---------------------------------------END TEXT TOOLBAR-
//------BEGIN VIDEO TOOLBAR--------------------------------
  /********************************************************
   * .JS-VIDEO-DELETE-BUTTON
   *******************************************************/
  'click .js-video-delete-button'( e, t ){
    e.preventDefault();
    let cur = $( '#cb-current' ).val()
      , page_no = t.page.get()
      , idx     = P.indexOf( cur );
 		P.removeAt( idx );
    $( `#${cur}` ).remove();
    $( '#cb-current' ).val('');
     pp.update( { _id: Session.get('my_id') },
              { $pull: { pages:{ id: cur} } });
console.log( pp.find({}).fetch() );
    P.print();
    $('#fb-template').css( 'border', '' );
    $( '#fb-template iframe' ).remove();
    $( '#cb-current' ).val('');
    $( '#cb-video-toolbar' ).hide();
//---------------------------------------------------------
  },
//--------------------------------------END VIDEO TOOLBAR--
//--------BEGIN MEDIA TOOLBAR------------------------------
  /********************************************************
   * .JS-MEDIA-DELETE-BUTTON
   *******************************************************/
  'click .js-media-delete-button'( e, t ) {
    e.preventDefault();

    let cur     = $( '#cb-current' ).val()
      , idx     = P.indexOf( `${cur}` );

 		P.removeAt( idx );
    $( `#${cur}` ).remove();
    $( '#cb-current' ).val('');
    $( '#cb-media-toolbar' ).hide();
    $('#frameBorder').remove();
     pp.update( { _id: Session.get('my_id') },
              { $pull: { pages:{ id: cur} } });

    //console.log( pp.find({}).fetch() );
  },
/**********************************************************
 * .JS-MEDIA-OPACITY  ::(INPUT)::
 *********************************************************/
  'input .js-media-opacity'( e, t ) {
    e.preventDefault();
    let cur = $( '#cb-current' ).val()
      , id  = $( `#${cur}` ).data('pid')
      , opm = $(e.currentTarget).val()
      , pg  = $( `#${cur}` ).data('page');
    $( `#${cur}` ).css( 'opacity', opm );
    $( '#opm' ).val( opm );
    //P.update( { _id: id, "objects.page_no":pg },
    //          {$set:{"objects.$.opacity": op }});
//---------------------------------------------------------
  },
/**********************************************************
 * .JS-MEDIA-OPACITY  ::(MOUSEUP)::
 *********************************************************/
'mouseup .js-media-opacity'( e, t ) {
  let cur = t.$( '#cb-current' ).val()
    , idx = P.indexOf( cur )
    , pos = t.$( `#${cur}` ).offset()
    , obj;
  obj = P.removeAt( idx );
  P.insert( idx, {
          page_no:          t.page.get(),
          type:             'image',
          id:               `${obj.id}`,
          iid:              `${obj.iid}`,
          img_lnk:          `${obj.a_img_id}`,
          offset:           pos,
          iwidth:           `${obj.iwidth}`,
          iheight:          `${obj.iheight}`,
          opacity:          $(`#${cur}`).css('opacity'),
          dwidth:           `${obj.dwidth}`,
          dheight:          `${obj.dheight}`,
          src:              `${obj.src}`
  });
},
//-------------------------------------END MEDIA TOOLBAR---
  /********************************************************
   * #COURSE-BUILDER-IMAGE ::(CHANGE)::
   *******************************************************/
  //'change #course-builder-image'( e, t ) {
    //CBImage.cbImageChange( e, t /*, Images */ );
  //},
//---------------------------------------------------------
  /********************************************************
   * #CB-IMAGE-SAVE  ::(CLICK)::
   *******************************************************/
  'click #cb-image-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    CBImage.cbImageSave(  e,
                          t,
                          t.page.get(),
                          master_num++,
                          P,
                          Images
                        );
  },
//---------------------------------------------------------
  /********************************************************
   * #ADDED-VIDEO  ::(CHANGE)::
   *******************************************************/
  'change #added-video'( e, t ) {
    CBVideo.addedVideoURL(  e,
                            t,
                            t.page.get(),
                            P,
                            master_num++
                          );
  },
//---------------------------------------------------------
  /********************************************************
   * #COURSE-BUILDER-PDF  ::(CHANGE)::
   *******************************************************/
  'change #course-builder-pdf'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    CBPDF.cbPDFChange( e, t );
//---------------------------------------------------------
  },
  /********************************************************
   * #CB-PDF-SAVE  ::(CLICK)::
   *******************************************************/
  'click #cb-pdf-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    CBPDF.cbPDFSave(  e,
                      t,
                      t.page.get(),
                      Pdfs,
                      P,
                      master_num++
                    );
  },
//---------------------------------------------------------
  /********************************************************
   * #COURSE-BUILDER-POWERPOINT  ::(CHANGE)::
   *******************************************************/
   'change #course-builder-powerpoint'( e, t ) {
      e.preventDefault();
      e.stopImmediatePropagation();
      CBPP.cbPowerPointChange( e, t, PowerPoints );
//---------------------------------------------------------
   },
  /********************************************************
   * #CB-POWERPOINT-SAVE  ::(CLICK)::
   *******************************************************/
  'click #cb-powerpoint-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    CBPP.cbPowerPointSave( e, t, Session.get('contentTracker') );
    t.$( '#add-powerpoint' ).modal( 'hide' );
//---------------------------------------------------------
  },
  /********************************************************
   * #CB-SCORM-SAVE  ::(CLICK)::
   *******************************************************/
  'click #cb-scorm-save'( e, t ) {
    e.preventDefault();
    //Meteor.call(  'scormStudentCourseStatus', 1,
    //              '68ac728a3a9686020674a6e614e2d7e3', 1 );
    //Meteor.call( 'scormListAllCourses' );
    //Meteor.call(  'scormListStudentCompletedCourses', 1,
    //              '68ac728a3a9686020674a6e614e2d7e3' );
    //Meteor.call( 'scormListCompanyCourses', 1 );
    //Meteor.call(  'scormListUserCourses', 1,
    //              '68ac728a3a9686020674a6e614e2d7e3' );
    //Meteor.call(  'scormListStudentStartedCourses', 1,
    //              '68ac728a3a9686020674a6e614e2d7e3' );
    //Meteor.call( 'scormCreateUser', '123', 'pass', 1 );
    /*
    let r = Meteor.call(  'scormGetCoursePlayURL',
                          'demo_user',
                          1,
                          1,
                          function (error, result) {
                                                if ( !error ) {
                                                  Session.set( "resp", result );
                                                }
                                              });
    */
    /*
    let c_id = 1;
    let r = Meteor.call( 'scormUploadCourse', c_id, ( err, res ) => {
      if ( !err ) {
        Session.set( 'resp', res );
      }  else {
        console.log( 'err = ' + err );
      }
    })
    */
    /*
    let patt = new RegExp( "no url" )
      , rslt = patt.test( r );
    console.log( 'pattern test = ' + rslt );
    Session.set( 'resp', rslt )
    */
    return;
    CBSCORM.cbScormSave( e, t );
    Template.instance().page.set(   Template.instance().page.get()  + 1 );
    Template.instance().total.set(  Template.instance().total.get() + 1 );
    t.$( '#add-scorm' ).modal( 'hide' );
//---------------------------------------------------------
  },
  /********************************************************
   * #COURSE-BUILDER-SCORM  ::(CHANGE)::
   *******************************************************/
  'change #course-builder-scorm'( e, t ) {
    e.preventDefault();
    CBSCORM.cbScormChange( e, t );
//---------------------------------------------------------
  },
  /********************************************************
   * KEEP VALUES CONSTRAINED
   *******************************************************/
  'keyup #course-builder-credits'( e, t ) {
    let v = t.$( '#course-builder-credits' ).val();
    if ( v > 120 )  t.$( '#course-builder-credits' ).val( 120 );
    if ( v < 0   )  t.$( '#course-builder-credits' ).val(  0  );
  },
//---------------------------------------------------------
  /********************************************************
   * KEEP VALUES CONSTRAINED
   *******************************************************/
  'keyup #course-builder-percent'( e, t ) {
    let v = t.$( '#course-builder-percent' ).val();
    if ( v > 100 )  t.$( '#course-builder-percent' ).val( 100 );
    if ( v < 0   )  t.$( '#course-builder-percent' ).val(  0  );
  },
 //---------------------------------------------------------
  /* ******************************************************
   *
   * MOUSE OVER'S AND HOVER'S FOR CB DRAG AND DROP
   *
   *******************************************************/
   /*
    * MOUSEOVER TITLE
    */
  'mouseover .cb-img-title'( e, t ) { //hover
    $( '.cb-img-title' ).prop( 'src', '/img/title-dark.png' );
  },
//---------------------------------------------------------
  /********************************************************
   * MOUSEOUT TITLE
   *******************************************************/
  'mouseout .cb-img-title'( e, t ) {
    $( '.cb-img-title' ).prop( 'src', '/img/title.png' );
  },
//---------------------------------------------------------
  /********************************************************
   * MOUSEUP TITLE
   *******************************************************/
  'mouseup .cb-img-title'( e, t ) {
    $( '.cb-img-title' ).prop( 'src', '/img/title.png' );
  },
//---------------------------------------------------------
  /********************************************************
   * MOUSEOVER TEXT
   *******************************************************/
  'mouseover .cb-img-text'( e, t ) {
    $( '.cb-img-text' ).prop( 'src', '/img/text-dark.png' );
  },
//----------------------------------------------------------
  /********************************************************
   * MOUSEOUT TEXT
   *******************************************************/
  'mouseout .cb-img-text'( e, t ) {
    $( '.cb-img-text' ).prop( 'src', '/img/text.png' );
  },
//-----------------------------------------------------------
  /********************************************************
   * MOUSEUP TEXT
   *******************************************************/
  'mouseup .cb-img-text'( e, t ) {
    $( '.cb-img-text' ).prop( 'src', '/img/text.png' );
  },
//---------------------------------------------------------
  /********************************************************
   * MOUSEOVER IMAGE
   *******************************************************/
  'mouseover .cb-img-image'( e, t ) {
     $( '.cb-img-image' ).prop( 'src', '/img/images-dark.png' );
   },
//------------------------------------------------------------
   /*******************************************************
    * MOUSEOUT IMAGE
    ******************************************************/
  'mouseout .cb-img-image'( e, t ) {
    $( '.cb-img-image' ).prop( 'src', '/img/images.png' );
  },
//-------------------------------------------------------------
  /********************************************************
   * MOUSEUP IMAGE
   *******************************************************/
  'mouseup .cb-img-image'( e, t ) {
    $( '.cb-img-image' ).prop( 'src', '/img/images.png' );
  },
//---------------------------------------------------------
  /********************************************************
   * MOUSEOVER PDF
   *******************************************************/
  'mouseover .cb-img-pdf'( e, t ) {
    $( '.cb-img-pdf' ).prop( 'src', '/img/pdf-dark.png' );
  },
//-------------------------------------------------------------
  /********************************************************
   * MOUSEOUT PDF
   *******************************************************/
  'mouseout .cb-img-pdf'( e, t ) {
    $( '.cb-img-pdf' ).prop( 'src', '/img/pdf.png' );
  },
//--------------------------------------------------------------
  /*
   * MOUSEUP PDF
   */
  'mouseup .cb-img-pdf'( e, t ) {
    $( '.cb-img-pdf' ).prop( 'src', '/img/pdf.png' );
  },
//---------------------------------------------------------
  /********************************************************
   * MOUSEOVER PPT
   *******************************************************/
  'mouseover .cb-img-ppt'( e, t ) {
    $( '.cb-img-ppt' ).prop( 'src', '/img/ppt-dark.png' );
  },
//--------------------------------------------------------------
  /********************************************************
   * MOUSEOUT PPT
   *******************************************************/
  'mouseout .cb-img-ppt'( e, t ) {
    $( '.cb-img-ppt' ).prop( 'src', '/img/ppt.png' );
  },
//--------------------------------------------------------------
  /********************************************************
   * MOUSEUP PPT
   *******************************************************/
  'mouseup .cb-img-ppt'( e, t ) {
    $( '.cb-img-ppt' ).prop( 'src', '/img/ppt.png' );
  },
//---------------------------------------------------------
  /********************************************************
   * MOUSEOVER SCORM
   *******************************************************/
  'mouseover .cb-img-scorm'( e, t ) {
    $( '.cb-img-scorm' ).prop( 'src', '/img/scorm-dark.png' );
  },
//---------------------------------------------------------------
  /********************************************************
  * MOUSEOUT SCORM
  ********************************************************/
  'mouseout .cb-img-scorm'( e, t ) {
    $( '.cb-img-scorm' ).prop( 'src', '/img/scorm.png' );
  },
//----------------------------------------------------------------
  /********************************************************
   * MOUSEUP SCORM
   *******************************************************/
  'mouseup .cb-img-scorm'( e, t ) {
    $( '.cb-img-scorm' ).prop( 'src', '/img/scorm.png' );
  },
//---------------------------------------------------------
  /********************************************************
   * MOUSEOVER TEST
   *******************************************************/
  'mouseover .cb-img-test'( e, t ) {
    $( '.cb-img-test' ).prop( 'src', '/img/test-dark.png' );
  },
//-----------------------------------------------------------------
  /********************************************************
   * MOUSEOUT TEST
   *******************************************************/
  'mouseout .cb-img-test'( e, t ) {
    $( '.cb-img-test' ).prop( 'src', '/img/test.png' );
  },
//-----------------------------------------------------------------
  /********************************************************
   * MOUSEUP TEST
   *******************************************************/
  'mouseup .cb-img-test'( e, t ) {
    $( '.cb-img-test' ).prop( 'src', '/img/test.png' );
  },
//---------------------------------------------------------
  /********************************************************
   * MOUSEOVER VIDEO
   *******************************************************/
  'mouseover .cb-img-video'( e, t ) {
    $( '.cb-img-video' ).prop( 'src', '/img/videos-dark.png' );
  },
//------------------------------------------------------------------
  /********************************************************
   * MOUSEOUT VIDEO
   *******************************************************/
  'mouseout .cb-img-video'( e, t ) {
    $( '.cb-img-video' ).prop( 'src', '/img/videos.png' );
  },
//------------------------------------------------------------------
  /********************************************************
   * MOUSEUP VIDEO
   *******************************************************/
  'mouseup .cb-img-video'( e, t ) {
    $( '.cb-img-video' ).prop( 'src', '/img/videos.png' );
  },
//---------------------------------------------------------
});
//---------------------------------------------------------
/**********************************************************
 * ADD TITLE
 *********************************************************/
function addTitle( x, y ) {
  let holder = $( `<input id="added-title"
                          type="text"
                          style="fdborder-radius:5px;z-index:2;
                                 position:absolute;width:65%;margin-left:12%;
                                 margin-right:12%" autofocus/>`
                ).css( 'color', 'grey' );
  $( '#fb-template' ).append(holder);
  let pos = $('#added-title').position();
  let x1  = pos.left;
  let y1  = pos.top;
  $( '#added-title').offset({ left: x - x1, top: y - y1 });
  $(holder).effect( "highlight", {}, 2000 );
}
/**********************************************************
 * ADD TEXT
 *********************************************************/
function addText( x, y ) {
  $( '#cb-text-toolbar' ).show();
/*
  $( '#fb-template' ).append(
                              '<textarea  id="added-text" ' +
                              'rows="3" ' +
                              'style="z-index:2;border-radius:5px;'+
                              'position:absolute;margin-left:10%;' +
                              'margin-right:10%;' +
                                'width:73%;" autofocus></textarea>'
                            ).css( 'color', 'grey' );
  let pos = $('#added-text').position();
  let x1  = pos.left;
  let y1  = pos.top;
  $( '#added-text' ).offset({ left: x - x1, top:  y - y1 });
  $( '#added-text' ).effect( "highlight", {}, 2000 );
*/
}
 /**********************************************************
 * ADD VIDEO
 *********************************************************/
function addVideo() {
  $( '#fb-template' ).append( '<input id="added-video" ' +
                                      'type="text" ' +
                                      'style="border-radius:5px;width:75%;' +
                                      'margin-left:12%;margin-right:12%;" ' +
                                      'placeholder="Add YouTube OR Vimeo URL here" ' +
                                      'autofocus>'
                    );
                    //.effect( "highlight", {}, 2000 );
                    //.css( 'border', '1px dashed grey' );
}
function escapeHtml(str) {
    return str
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}
