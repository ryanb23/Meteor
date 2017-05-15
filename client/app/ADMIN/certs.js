/*
 * @module certs
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */

import { Template }       from 'meteor/templating';
import { ReactiveVar }    from 'meteor/reactive-var';

import { Courses }        from '../../../both/collections/api/courses.js';
import { Certifications } from '../../../both/collections/api/certifications.js';
import { Newsfeeds }      from '../../../both/collections/api/newsfeeds.js';

import '../../templates/admin/certs.html';


let course_list       = []
  , d;


/*
 * CREATED
 */
Template.certs.onCreated(function(){

  Tracker.autorun( () => { 
    Meteor.subscribe('courses');
    Meteor.subscribe('certifications');
    Meteor.subscribe('newsfeeds');
  });
  
  $( "#certificate-cover" ).show();

  /*
   * JQUERY-UI SORTABLE
   */
  $.getScript( '/jquery-ui-1.12.0.custom/jquery-ui.min.js', function(){

    $( '#certificate-drop-zone' ).sortable({
      connectWith: '#cojo',
      receive( event, ui ) {

        let nm = $( '#enter-certificate-name' ).val();
        if ( nm != '' ) $('#cName').text( nm );

        course_list.push( $( `#${ui.item[0].id}` ).data('di') );
      },
    });

    $( '#cojo' ).sortable({
      connectWith: '#certificate-drop-zone',
      receive( event, ui ) {

        let nm = $( '#enter-certificate-name' ).val();
        if ( nm != '' ) $('#cName').text( nm );

        course_list = _.reject(course_list, function(item){
          return item === $( `#${ui.item[0].id}` ).data('di');
        });
      },
    });

  //console.log('certificate:: jquery-ui.min.js loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'certificate:: load jquery-ui.min.js fail' );
  });
//-------------------------------------------------------------------


});

/*
 * RENDERED
 */
Template.certs.onRendered(function(){

  $( '#certificate-cover' ).delay( 100 ).fadeOut( 'slow', function() {
    $( "#certificate-cover" ).hide();
    $( ".certificate-area" ).fadeIn( 'slow' );
  });

  /*
   * SEARCH
   */
  Tracker.autorun(function(){

      d		= document.getElementById( 'cojo' );

      try {
        //CLEAR OUT THE LIST
        while ( d.hasChildNodes() ) {

     	    d.removeChild( d.lastChild );
        }

        let c = Courses.find( { company_id: Meteor.user().profile.company_id },
                              { limit: 7 }).fetch();
        return initC( d, c );
      } catch (e) {
        return;
      }
  });
});
//-----------------------------------------------------------------------------


/*
 * DESTROYED
 */
Template.certs.onDestroyed(function(){
  certificate = null;
  $( '#cert-search' ).val('');
});
//-----------------------------------------------------------------------------



/*
 * HELPERS
 */
Template.certs.helpers({

});
//-----------------------------------------------------------------------------


/*
 * EVENTS
 */
Template.certs.events({

  /*
   * #ENTER-CERTIFICATE-NAME ::(KEYDOWN)::
   */
  'keydown #enter-certificate-name'( e, t ) {

    // keyCode 65-90 lowercase,
    $('#cert-taken-name-error').text('');
    let ec = $( '#enter-certificate-name' )
      , cn = $( '#cName')
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
//-------------------------------------------------------------------
  },



  /*
   * #ENTER-CERTIFICATE-NAME  ::(BLUR)::
   */
  'change #enter-certificate-name'( e, t ) {
    e.preventDefault()
    e.stopImmediatePropagation();

    $('#cert-taken-name-error').text('');
    $( '#enter-certificate-name' ).css({'color':'blue','text-decoration':''});
    $( '#cName' ).css({'color':'blue','text-decoration':''});

    let cert_id = undefined
      , cert_nm = $( '#enter-certificate-name' ).val();

    $( '#cName' ).text( cert_nm );

    cert_id = Certifications.findOne({ name: cert_nm });
    if ( cert_id && cert_id._id ) {
      $('#cert-taken-name-error').text('That name is already being used');

      $( '#enter-certificate-name' ).css({'color':'red','text-decoration':'line-through'});
      $( '#cName' ).css({'color':'red','text-decoration':'line-through'});
      Bert.alert('Sorry, but there is already a Certification by that name', 'danger');
      return;
    }
//-------------------------------------------------------------------
  },



  /*
   * #CERT-SEARCH  ::(KEYUP)::
   *
   */
  'keyup #cert-search'( e, t ) {

    // SEARCH TERM
    let tf 	= document.getElementById( 'cert-search' ).value;

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

     	//im.src        = "/img/icon-7.png";
     	//im.className  = '';
     	//im.id         = `cert-img-${i}`;
     	//im.dataset.dc = `${items[i].credits}`;
     	//im.dataset.di = `${items[i]._id}`;

     	//sp.appendChild( im );

      child.className = "sortable d-cur ui-widget-content degree-drop";
      child.id        = `cert-holder-${i}`;
      child.innerHTML = `${items[i].name}`;
      child.dataset.dc = `${items[i].credits}`;
      child.dataset.di = `${items[i]._id}`;

      //child.appendChild( sp );
      d.appendChild( child );

     	$( `#cert-holder-${i}` ).css({'width':'260px','min-height':'49px','font-size':'20px','text-align':'center','border':'1px dotted #767676','margin-bottom':'10px','padding':'5px','border-radius':'4px'});
    }
//-------------------------------------------------------------------
  },



  /*
   * .JS-CERTIFICATE-SAVE  ::(CLICK)::
   */
  'click .js-certificate-save'( e, t ) {
    e.preventDefault();

    let credits_total = 0
      , ids           = []
      , c_id          = undefined
      , course_name   = $( '#enter-certificate-name' ).val()
      , exp_date      = $( '#enter-expiration-date' ).val()
      , cert_id       = undefined
      , order;

    //REDUNDANT CHECK
    cert_id = Certifications.findOne({ name: course_name });
    if ( cert_id && cert_id._id ) {
      $('#cert-taken-name-error').text('That name is already being used');
      $( '#enter-certificate-name' ).css({'color':'red','text-decoration':'line-through'});
      $( '#cName' ).css({'color':'red','text-decoration':'line-through'});
      Bert.alert('Sorry, but there is already a Certification by that name', 'danger');
      return;
    }

    try {
      c_id = Meteor.user().profile.company_id;
    } catch( e ) {
      return;
    }

    if ( ! course_list || course_list.length <= 0) {
      Bert.alert( 'No Courses have been added!', 'danger');
      return;
    }

    if ( course_name == "" ) {
      Bert.alert( 'You Must Give the Certificate a Name!', 'danger' );
      return;
    }

    //END SANITY CHECKS
    order = $( '#certificate-drop-zone' ).sortable('toArray');

    for ( let i = 0, len = order.length; i < len; i++ ){
      if ( order[i] ) {
        let cur = $( `#${order[i]}` );
        credits_total += Number( cur.data('dc') );
        ids.push(cur.data('di') );
      }
    }
//console.log( credits_total );
//console.log( ids );

    Certifications.insert({
      name:             course_name,
      courses:          ids,
      credits:          credits_total,
      num:              ids.length,
      icon:             "/img/icon-6.png",
      company_id:       c_id,
      type:             "Certifications",
      times_completed:  0,
      expiry_date:      exp_date || "",
      created_at:       new Date()
    });

    Bert.alert( 'Certificate Created!', 'success', 'growl-top-right' );

     Newsfeeds.insert({
                 owner_id:       Meteor.userId(),
                  poster:        Meteor.user().username,
                  poster_avatar:  Meteor.user().profile.avatar,
                  type:           "Certificate",
                  private:        false,
                  news:           `A New Certification has been added: ${course_name}`,
                  comment_limit:  3,
                  company_id:     c_id,
                  likes:          0,
                  date:           new Date()
    });

    Meteor.setTimeout(function(){
      if (
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
   * #DEGREE-CERTIFICATE-PAGE ::(CLICK)::
   */
  'click #degree-certificate-page'( e, t ) {
    e.preventDefault();

    if (
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
      FlowRouter.go( 'super-admin-degrees-and-certs', { _id: Meteor.userId() });
      return;
    }
//-------------------------------------------------------------------
  },


  /*
   * #DASHBOARD-PAGE ::(CLICK)::
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
//-----------------------------------------------------------------------------

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
  let len = c.length;

  for( let i = 0; i < len; i++ ) {

     	let child 			= document.createElement( 'div' );
     	//let sp          = document.createElement( 'span' );
     	//let im          = document.createElement( 'img' );

     	//im.src        = "/img/icon-7.png";
     	//im.className  = '';
     	//im.id         = `cert-img-${i}`;
     	//im.dataset.dc = `${c[i].credits}`;
     	//im.dataset.di = `${c[i]._id}`;

     	//sp.appendChild( im );

      child.id        = `cert-holder-${i}`;
      child.className = "d-cur sortable ui-widget-content degree-drop";
      child.innerHTML = c[i].name;
      child.dataset.dc = c[i].credits;
      child.dataset.di = c[i]._id;

      //child.appendChild( sp );
      d.appendChild( child );

      $( `#cert-holder-${i}` ).css({'width':'260px','min-height':'49px','font-size':'20px','text-align':'center','border':'1px dotted #767676','margin-bottom':'10px','padding':'5px','border-radius':'4px'});

      $( '#cert-search' ).prop('selectionStart', 0)
                         .prop('selectionEnd', 0);

  }
  
document.addEventListener("touchstart", touchHandler, true);
document.addEventListener("touchmove", touchHandler, true);
document.addEventListener("touchend", touchHandler, true);
document.addEventListener("touchcancel", touchHandler, true);
  
  
}

/*
 * REPLACE TEXT NODE()
 */
function replaceTextNode( t, item ) {

  let textNode    = t.contents().first();
  let replaceWith = `${item.name}`;
  textNode.replaceWith( replaceWith );

}
