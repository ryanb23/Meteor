/*
 * @module adminAdvanced
 * 
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import { Students }   from '../../../both/collections/api/students.js';
import { Template }   from 'meteor/templating';

import { Newsfeeds }     from '../../../both/collections/api/newsfeeds.js';

import '../../templates/admin/admin-advanced.html';


Template.adminAdvanced.onCreated(function(){
  //$("#cover").show();

  Tracker.autorun( () => { 
    Meteor.subscribe('newsfeeds');
    Meteor.subscribe('students');
  });
  
  //this.isInternalTraining = new ReactiveVar(false);

});


Template.adminAdvanced.onRendered(function(){
/*
  $( '#cover' ).delay( 500 ).fadeOut( 'slow', function() {
    $("#cover").hide();
    $( ".dashboard-header-area" ).fadeIn( 'slow' );
  });
*/
});


/*
 * HELPERS
 */
Template.adminAdvanced.helpers({
  //isInternalTraining: () =>
    //Template.instance().isInternalTraining
});



/*
 * EVENTS
 */
Template.adminAdvanced.events({

  /*
   * INTERNAL TRAINING BUTTON
   
  'click #internal-training'( e, t ) {
    e.preventDefault();
    t.isInternalTraining.set(true);
    FlowRouter.go( 'internal-training-calendar', { _id: Meteor.userId() });
  },
  */
  

  
  
  /*
   * #CREDIT-ON  ::(CLICK)::
   */
  'click #credit-on'( e, t ){
    e.preventDefault();
    e.stopImmediatePropagation();
    
    console.log('yes clicked');

//-------------------------------------------------------------------
  },
  
  /*
   * CREDIT OFF  ::(CLICK)::
   */
  'click #credit-off'( e, t ) {
    e.preventDefault();
    
    console.log('clicked off');
  },


  /*
   * .ADVANCE-TIME-BUTTON BUTTON  ::(CLICK)::
   */
  'click .advance-time-button button'( e, t ){
    e.preventDefault();
    e.stopImmediatePropagation();

    //console.log( t.$(e.currentTarget).data('value'))
		t.$( ".advance-time-button button:first-child" ).removeClass( 'active' );
		t.$( ".advance-time-button button:last-child" ).removeClass( 'active' );
		t.$( e.currentTarget ).toggleClass( 'active' );
//-------------------------------------------------------------------
  },


  /*
   * #RESET-IMAGE  ::(CLICK)::
   */
  'click .js-priv-url'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    let purl = t.$( '.js-priv-url' ).val();
//-------------------------------------------------------------------
  },


  /*
   * .JS-ADVANCED-SAVE  ::(CLICK)::
   */
  'click .js-advanced-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    let tog = $( '#cr-on' ).prop( 'checked' );

		if ( tog ) {

		  let req_creds = t.$( '.js-credits-required' ).val()
		    , freq;

		  if ( t.$( ".advance-time-button button:first-child" ).hasClass( 'active' ) ) {
		    freq = t.$( ".advance-time-button button:first-child" ).data( 'value' );
		  } else if ( t.$( ".advance-time-button button:last-child" ).hasClass( 'active' ) ) {
		    freq = t.$( ".advance-time-button button:last-child" ).data( 'value' );
		  } else {
		    Bert.alert( 'Please select frequency:  Quarterly or Yearly.', 'danger' );
		    return;
		  }

		  Meteor.call( 'upsertCompany', Meteor.user().profile.company_id, freq, req_creds )
		  Meteor.call( 'upsertCredits', Meteor.user().profile.company_id, req_creds );
		}
    Bert.alert( 'Your information has been saved', 'success' );
  },

});
