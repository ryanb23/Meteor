/*
 * @module studentRequestCredit
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

//import { Blaze } from 'meteor/blaze'

import { Newsfeeds }    from '../../../both/collections/api/newsfeeds.js';
import { Students }     from '../../../both/collections/api/students.js';

import './student-request-credit.html';


/*
 * ON CREATED
 */
Template.studentRequestCredit.onCreated(function() {
	
  Tracker.autorun( () => {
    Meteor.subscribe('newsfeeds');
    Meteor.subscribe('students');
  });

  //$("#cover").show();


  /*
   * BOOTSTRAP-SELECT
   */
  $.getScript( '/bower_components/bootstrap-select/dist/js/bootstrap-select.min.js', function(){

    $( '.selectpicker' ).selectpicker({
      title:  'Choose One',
      size:   'auto',
      //width:  'auto',
      showTick: true
    });
    //console.log('studentRequestCredit:: bootstrap.min.js loaded...');
  }).fail( function(jqxhr, settings, exception ) {
    console.log( 'studentRequestCredit:: load bootstrap-select.min.js fail' );
  });
//-------------------------------------------------------------------
});



/*
 * ON RENDERED
 */
Template.studentRequestCredit.onRendered(function(){
  /*
  $('#cover').delay( 500 ).fadeOut( 'slow', function() {
    $('#cover').hide();
    $('.dashboard-header-area').fadeIn( 'slow' );
  });
  */
});



var ig = ''
  , ext
  , option
  , content
  , fname
  , itype;

/*
 * EVENTS
 */
Template.studentRequestCredit.events({

  /*
   * .JS-CREDIT-ATTACHMENT  ::(CHANGE)::
   */
  'change .js-credit-attachment'( e, t ) {
    //1 get file from element
    //mime type application/pdf
    e.preventDefault();
    e.stopPropagation();

   option   = $( '.js-credit-select' ).val().trim();
   content  = $( '#details' ).val().trim();
   fname    = e.currentTarget.files[0].name;
   ext      = name.slice(name.lastIndexOf('.'));
   itype    = e.currentTarget.files[0].type;
   
    if ( e.currentTarget.files === undefined ) {
      console.log('aborted');
      return;
    }
    
    console.log( 'itype = ' + itype );
    console.log( 'ext   = ' + ext   );
    
    if (  itype != 'application/pdf'  && itype  != 'image/jpeg'       &&
          itype != 'image/png'        && ext    != '.jpg'             &&
          ext   != '.pdf'             && ext    != '.png'             && 
          ext   != '.jpeg'              
        ) 
    {
      Bert.alert('Only Images, and PDF files may be submitted', 'danger');
      e.currentTarget.files         = undefined;
      e.currentTarget.files[0]      = undefined;
      e.currentTarget.files[0].name = undefined;
      return;
    }   
    
    

    let fil = $( '.js-credit-attachment' ).get(0).files[0];
     //2 read file using file reader
    let fr  = new FileReader();

    fr.onload = function() {
      ig  = this.result;
    };

    fr.readAsDataURL( fil );
    
    $( '.js-credit-attachment' ).css('color', 'blue');
    return;
//-------------------------------------------------------------------
  },


  /*
   * #CANCEL  ::(CLICK)::
   */
  'click #cancel'( e, t ) {
    FlowRouter.go( 'student-dashboard', { _id: Meteor.userId() });
//-------------------------------------------------------------------
  },


  /*
   * #SEND  ::(CLICK)::
   */
  'click #send'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    details = $( '#details').val().trim();
    option  = $( '.js-credit-select option:selected' ).text();

    if ( details == '' ) {
      Bert.alert('You must enter a description of the training!', 'danger');
      return;
    } else
        if ( option == "Choose One" ) {
          Bert.alert('You must select the type of training received in the dropdown', 'danger');
          return;
    }

    //t.view.parentView.parentView.parentView._templateInstance.
    $( '.credit-request' ).hide();

    let name = Students.findOne({ _id: Meteor.userId() }, { fullName:1 }).fullName;

    Bert.alert('Credit Request successfully sent', 'success' );
    Newsfeeds.insert({
      owner_id: Meteor.userId(),
      poster:   name,
      type:     'CR',
      file:     ig,
      filename: fname,
      option:   option,
      content:  details,
      private:  true,
      company_id: Meteor.user().profile.company_id,
      date:     new Date() });

    Meteor.setTimeout(function() {
      //Template.instance().parentview.message = "sent";
      $( '#details' ).val('');
      $( '.js-credit-select' ).prop('selectedIndex', 0);
      FlowRouter.go( 'student-dashboard', {_id: Meteor.userId() });
    }, 200);
    
    ig = fname = option = ext = itype = content = null;
//-------------------------------------------------------------------
  },
});

