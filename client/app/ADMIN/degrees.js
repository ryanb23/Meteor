/*
 * @module degrees
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */

import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

import { Courses }      from '../../../both/collections/api/courses.js';
import { Diplomas }     from '../../../both/collections/api/diplomas.js';
import { Newsfeeds }    from '../../../both/collections/api/newsfeeds.js';

import '../../templates/admin/degrees.html';



let course_list = []
  , d;

/*
 * CREATED
 */
Template.degrees.onCreated(function() {


  $( "#degree-cover" ).show();

  Tracker.autorun( () => { 
    Meteor.subscribe('courses');
    Meteor.subscribe('diplomas');
    Meteor.subscribe('newsfeeds');
  });
  
  /*
   * JQUERY-UI SORTABLE
   */
  $.getScript( '/jquery-ui-1.12.0.custom/jquery-ui.min.js', function(){

      $( '#degree-drop-zone' ).sortable({
        connectWith: "#dojo",
        receive( event, ui ) {

          let nm = $( '#enter-degree-name' ).val();
          if ( nm != '' ) $('#dName').text( nm );

          course_list.push( $( `#${ui.item[0].id}` ).data('di') );
        },
      });

      $( '#dojo' ).sortable({
        connectWith: "#degree-drop-zone",
        receive( event, ui ) {

          let nm = $( '#enter-degree-name' ).val();
          if (nm!='') $('#dName').text( nm );

          course_list = _.reject(course_list, function(item){
            return item === $( `#${ui.item[0].id}` ).data('di');
          });
        },
      });

  //console.log('degree:: jquery-ui.min.js loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'degree:: load jquery-ui.min.js fail' );
  });
//-------------------------------------------------------------------

});


/*
 * RENDERED
 */
Template.degrees.onRendered(function(){

  $( '#degree-cover' ).delay( 100 ).fadeOut( 'slow', function() {
    $( "#degree-cover" ).hide();
    $( ".certificate-area" ).fadeIn( 'slow' );
  });

  /*
   * SEARCH
   */
    Tracker.autorun(function(){

      d = document.getElementById( 'dojo' );

      try {
        //CLEAR OUT THE LIST
        while ( d.hasChildNodes() ) {

     	    d.removeChild( d.lastChild );
        }

        let c   = Courses.find( { company_id: Meteor.user().profile.company_id },
                                {limit: 7}).fetch();
        return initC( d, c );
      } catch (e) {
        return;
      }
    });
});



/*
 * DESTROYED
 */
Template.degrees.onDestroyed(function(){
  degree = null;
  $( '#degree-search' ).val('');
});
//-----------------------------------------------------------------------------



/*
 * HELPERS
 */
Template.degrees.helpers({

});
//-----------------------------------------------------------------------------


/*
 * EVENTS
 */
Template.degrees.events({

 /*
   * #ENTER-CERTIFICATE-NAME ::(KEYDOWN)::
   */
  'keydown #enter-degree-name'( e, t ) {

    // keyCode 65-90 lowercase,
    $('#deg-taken-name-error').text('');
    let ec = $( '#enter-degree-name' )
      , cn = $( '#dName')
      , str = ec.val();

    if ( e.originalEvent.altKey || e.originalEvent.ctrlKey || e.originalEvent.shiftKey ||e.originalEvent.metaKey ) {
      return;
    }

    //console.log( e.originalEvent.code );

    if ( e.key == 'Backspace' ) {
      str = str.slice(0,str.length-1);
    } else if ( e.keyCode >= 65 && e.keyCode <= 90 ) {
      str += e.key;
    } else {
      ;
    }

    ec.css({'color':'blue','text-decoration':''});
    cn.css({'color':'blue','text-decoration':''});

    cn.text(str);
  },
//-------------------------------------------------------------------


  /*
   * #ENTER-DEGREE-NAME  ::(BLUR)::
   */
  'blur #enter-degree-name'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    $( '#deg-taken-name-error' ).text('');
    $( '#enter-degree-name' ).css({'color':'blue','text-decoration':''});
    $( '#dName' ).css({'color':'blue', 'text-decoration':''});

    let dname = $( '#enter-degree-name' ).val()
      , d_id;

    $( '#dName' ).text( dname );

    d_id = Diplomas.findOne({ name: dname });

    if ( d_id && d_id._id ) {
      $('#deg-taken-name-error').text('That name is already being used');

      $( '#enter-degree-name' ).css({'color':'red','text-decoration':'line-through'});
      $( '#dName' ).css({'color':'red','text-decoration':'line-through'});
      Bert.alert('Sorry, but there is already a Degree with that name', 'danger');
      return;
    }

//-------------------------------------------------------------------
  },



  /*
   * #DEGREE-SEARCH  ::(KEYUP)::
   *
   */
  'keyup #degree-search'( e, t ) {

    // SEARCH TERM
    let nm = $( '#enter-degree-name' ).val();
    if (nm != '') $('#dName').text(nm);

    let tf 	= document.getElementById( 'degree-search' ).value;
    //let d		= document.getElementById( 'dojo' );
     while ( d.hasChildNodes() ) {

     	d.removeChild( d.lastChild );

     }

    let patt1 = `/^${tf}/i`;

    let items = Courses.find({
                              company_id: Meteor.user().profile.company_id,
                              name: { $regex: eval(patt1) },
                              _id: { $nin: course_list }
                              },
                              { limit: 7 }).fetch();

     for( let i = 0, len = items.length; i < len; i++ ) {

     	let child 			= document.createElement( 'div' );
     	//let sp          = document.createElement( 'span' );
     	//let im          = document.createElement( 'img' );
     	/*
     	im.src        = "/img/icon-7.png";
     	im.className  = '';
     	im.id         = `deg-img-${i}`;
     	im.dataset.dc = `${items[i].credits}`;
     	im.dataset.di = `${items[i]._id}`;

     	sp.appendChild( im );
     	*/
      child.className   = "sortable d-cur ui-widget-content degree-drop";
      child.id          = `deg-holder-${i}`;
      child.innerHTML   = `${items[i].name}`;
      child.dataset.dc  = `${items[i].credits}`;
      child.dataset.di  = `${items[i]._id}`;

      //child.appendChild( sp );
      d.appendChild( child );

      $( `#deg-holder-${i}` ).css({'width':'260px','min-height':'49px','font-size':'20px','text-align':'center','border':'1px dotted #767676','margin-bottom':'10px','padding':'5px','border-radius':'4px'});

     }

  },


  /*
   * .JS-DEGREE-SAVE ::(CLICK)::
   */
  'click .js-degree-save'( e, t ) {
    e.preventDefault();

    let credits_total = 0
      , ids           = []
      , c_id          = undefined
      , course_name   = $( '#enter-degree-name' ).val()
      , d_id          = undefined
      , order;

    //REDUNDANT CHECK
    d_id = Diplomas.findOne({ name: course_name });
    if ( d_id && d_id._id ) {
      $( '#deg-taken-name-error' ).text('That name is already being used');
      $( '#enter-degree-name' ).css({'color':'red','text-decoration':'line-through'});
      $( '#dName' ).css({'color':'red','text-decoration':'line-through'});
      Bert.alert('Sorry, but a Dergree with that name already exists', 'danger');
      return;
    }

    try {
      c_id = Meteor.user().profile.company_id;
    } catch(e) {
      return;
    }

    if ( !course_list || course_list.length <= 0) {
      Bert.alert( 'No Courses have been added!', 'danger' );
      return;
    }

    if ( course_name == "" ) {
      Bert.alert( 'You Must Give the Degree a Name!', 'danger' );
      return;
    }

    //END SANITY CHECKS
    order = $( '#degree-drop-zone' ).sortable('toArray');

    for ( let i = 0, len = order.length; i < len; i++ ){
      if ( order[i] ) {
        let cur = $( `#${order[i]}` );
        credits_total += Number( cur.data('dc') );
        ids.push( cur.data('di') );
      }
    }
//console.log( credits_total )
//console.log( ids );

    Diplomas.insert({
      name:             course_name,
      courses:          ids,
      credits:          credits_total,
      num:              ids.length,
      icon:             "/img/icon-5.png",
      company_id:       c_id,
      type:             "Diplomas",
      times_completed:  0,
      created_at:       new Date()
    });

    Bert.alert( 'Degree Created!', 'success', 'growl-top-right' );

      Newsfeeds.insert({
                 owner_id:       Meteor.userId(),
                  poster:         Meteor.user().username,
                  poster_avatar:  Meteor.user().profile.avatar,
                  type:           "Diplomas",
                  private:        false,
                  news:           `A New Degree has been added: ${course_name}`,
                  comment_limit:  3,
                  company_id:     c_id,
                  likes:          0,
                  date:           new Date()
    });

    Meteor.setTimeout(function(){
      if   (
            Meteor.user() &&
            Meteor.user().roles &&
            Meteor.user().roles.admin
           )
      {
        FlowRouter.go(  'admin-degrees-and-certifications',
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
    }, 500);
//-------------------------------------------------------------------
  },



  /*
   * #FC  ::(CLICK)::
   */
  'click #fc'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
//-------------------------------------------------------------------
  },


  /*
   * #DEGREE-CERTIFICATE-PAGE  ::(CLICK)::
   */
  'click #degree-certificate-page'( e, t ) {
    e.preventDefault();

    if (
        Meteor.user() &&
        Meteor.user().roles &&
        Meteor.user().roles.admin
       )
    {
      FlowRouter.go( 'admin-degrees-and-certifications', { _id: Meteor.userId() });
      return;
    } else
        if (
            Meteor.user() &&
            Meteor.user().roles &&
            Meteor.user().roles.SuperAdmin
           )
    {
      FlowRouter.go( 'super-admin-degrees-and-certs', { _id: Meteor.userId() });
      return;
    }
//-------------------------------------------------------------------
  },


  /*
   * #DASHBOARD-PAGE  ::(CLICK)::
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
//-------------------------------------------------------------------
  },
});
//------------------------------------------------------------------------------

function touchHandler(event) {
    var touch = event.changedTouches[0];

    var simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent({
        touchstart: "mousedown",
        touchmove: "mousemove",
        touchend: "mouseup"
    }[event.type], true, true, window, 1,
        touch.screenX, touch.screenY,
        touch.clientX, touch.clientY, false,
        false, false, false, 0, null);

    touch.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}

function initC( d, c ) {

  for( let i = 0, len = c.length; i < len; i++ ) {

     	let child 			= document.createElement( 'div' );
     	//let sp          = document.createElement( 'span' );
     	//let im          = document.createElement( 'img' );
     	/*
     	im.src        = "/img/icon-7.png";
     	im.className  = '';
     	im.id         = `deg-img-${i}`;
     	im.dataset.dc = `${c[i].credits}`;
     	im.dataset.di = `${c[i]._id}`;

     	sp.appendChild( im );
     	*/
      child.id          = `deg-holder-${i}`;
      child.className   = "sortable d-cur ui-widget-content degree-drop";
      child.innerHTML   = c[i].name;
      child.dataset.dc  = c[i].credits;
      child.dataset.di  = c[i]._id;

      //child.appendChild( sp );
      d.appendChild( child );

      $( `#deg-holder-${i}` ).css({'width':'260px','min-height':'49px','font-size':'20px','text-align':'center','border':'1px dotted #767676','margin-bottom':'10px','padding':'5px','border-radius':'4px'});

      $( '#degree-search' ).prop( 'selectionStart', 0 )
                           .prop( 'selectionEnd', 0 );

  }
document.addEventListener("touchstart", touchHandler, true);
document.addEventListener("touchmove", touchHandler, true);
document.addEventListener("touchend", touchHandler, true);
document.addEventListener("touchcancel", touchHandler, true);
}
