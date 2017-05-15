/*
 * @module newsfeed
 * 
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
 
/*
  Upon login:
    Check for viewable newsfeeds, and display
*/
import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

import { Newsfeeds }    from '../../../both/collections/api/newsfeeds.js';
import { Comments  }    from '../../../both/collections/api/comments.js';
import { Students  }    from '../../../both/collections/api/students.js';

import './newsfeed.html';


/*
 * ON CREATED
 */
Template.newsfeed.onCreated(function(){

  Session.setDefault( 'active_click_id', '' );
  
  Tracker.autorun(() => {
    Meteor.subscribe('students');
    Meteor.subscribe('newsfeeds');
    Meteor.subscribe('comments');
  });

});



/*
 * ON DESTROYED
 */
Template.newsfeed.onDestroyed( function() {
  //re-set comment display limit(s)
  let nf = Newsfeeds.find( {}, { comment_limit: {$ne: 3} }).fetch();
  for ( let n = 0, len = nf.length; n < len; n++ ) {
    Newsfeeds.update({ _id: nf[n]._id }, {$set:{ comment_limit: 3 }});
  };
});



/*
 * HELPERS
 */
Template.newsfeed.helpers({
  newsfeeds() {
    

    let owner = Meteor.userId(); //reactivevariable

    //var feed  = Newsfeeds.find({ owner_id: owner}, { sort: { date: -1 } }).fetch();
    
    try {
      //ALL RECORDS FOR THIS COMPANY, OR ALL FROM SUPERADMIN
     // let feed = Newsfeeds.find({ $or:[  { private: false, company_id: Meteor.user().profile.company_id}, {poster:"SuperAdmin"}] }, 
     //                             { sort: { date: -1 } }).fetch();           //most recent at top
     
      //ALL RECORDS FOR THIS COMPANY, NEWEST FIRST 
      let feed = Newsfeeds.find({ private: false, company_id: Meteor.user().profile.company_id},
                                { sort: {date: -1}}).fetch();
      for( let i = 0; i < feed.length; i++ ) {
        var com = Comments.find(  { owner_id: feed[i]._id }, 
                                  { sort: { date: -1 } }).fetch(); //most recent at top
        if( com.length > 0 ) {
          feed[i].comments = [];
  
            if ( feed[i]._id == Session.get( 'active_click_id' ) ) {  //selected js-more button
              var lim = feed[i].comment_limit;                      //get number of comments to display
              for( let l = 0; l < lim; l++ ) {
                if ( l < com.length  ) {                            //if there is a comment
                  feed[i].comments[l] = com[l];                     //add it
                }
              }
              if ( com.length > feed[i].comment_limit ) feed[i].com_length = true;  //more comments left?
            } else if ( feed[i]._id != Session.get( 'active_click_id' ) ) {
              for ( let k = 0; k < feed[i].comment_limit; k++ ) {
                if ( k < com.length )
                  feed[i].comments[k] = com[k];
              }
              if ( com.length > feed[i].comment_limit ) feed[i].com_length = true;
            }
          }
        }
      return feed;
    } catch (e) {
      //console.log(e);
      return;
    }
  },

  cur_user_avatar() {
    try {
      //return Students.findOne({_id: Meteor.userId()}).avatar;
      return Meteor.user().profile.avatar;
    } catch(e) {
      return;
    }
  },

});


/*
 * EVENTS
 */
Template.newsfeed.events({

  /*
   * .JS-LIKE-BUTTON ::(MOUSEOVER)::
   */
   'mouseover .js-like-button'( e, t ) {
   
   },
   
   
  /*
   * .JS-LIKE-BUTTON  ::(CLICK)::
   */
  'click .js-like-button': _.debounce( function( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    var id = $( e.currentTarget ).data( 'id' );

    //get this posts array of likers
    var res = Newsfeeds.find({ _id: id }, { likers: 1 }).fetch()[0].likers;

    //see if the current user is one of them
    var cur_user = _.find( res, (x) => x == Meteor.userId() );

    //need to disallow same user that liked to like again
    if ( cur_user == Meteor.userId() ) {
      return;
    }
    
    //otherwise, allow like and save it
    Newsfeeds.update({ _id: id },  { $inc: { likes: 1 } ,  $push: { likers:  Meteor.userId() }  });

    Bert.alert( 'Your "Like" has been posted!', 'success', 'growl-top-right' );
  }, 1000 ),
//-------------------------------------------------------------------



  /*
   * .JS-MORE  ::(CLICK)::
   */
  'click .js-more':  _.debounce( function( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    //let my = e.currentTarget.parentNode.parentNode.parentNode
    //let myid = my.getAttribute('id')
    //console.log( e.currentTarget.parentElement );
    //console.log( e.currentTarget.parentElement.nodeName );


    Session.set( 'active_click_id', '' );                 //clear actively clicked js-more
    
    // data-id is id of POST
    var master_id = $( e.currentTarget ).data( 'id' );    //get currently selected js-more
    Session.set( 'active_click_id', master_id );         //set selected js-more

    let myid = $( e.currentTarget ).parent().prev().attr( 'id' );   // get id of closest sibling comment

    let tempScrollTop = $('div#' + myid ).offset().top;                   // scroll top of that comment
    Newsfeeds.update({ _id: master_id }, { $inc: {comment_limit: 3} });  // add next 3 comments
    $( window ).scrollTop( tempScrollTop );                             // reposition scroll top

  }, 1000),
//-------------------------------------------------------------------



  /*
   * #NEWS-ITEM-DELETE  ::(CLICK)::
   */
  'click #news-item-delete':  _.debounce( function( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    // NOTIFICATION
    Bert.alert( 'Your post has been deleted', 'success' );
    var i_d = $( e.currentTarget ).data( 'id' );

    $( '#news-item-' + i_d ).hide();

    var owner = $( '#news-item-' + i_d ).data( 'id' );

    if ( Meteor.userId() !== owner ) return;

    Tracker.autorun( () => {
      Meteor.subscribe( 'deleteComments', i_d );
    });

    var d = Comments.find({ owner_id: i_d }).fetch();

    if ( d.length > 0 ) {
      for( let i = 0; i < d.length; i++ ) {
        Comments.remove({ _id: d[i]._id });
      }
    }
    
    Meteor.setTimeout(function() {
      Newsfeeds.remove( { _id: i_d  } );
    }, 250);
  }, 500),
//-------------------------------------------------------------------



  /*
   * ::(KEYPRESS)::
   */
  'keypress':  _.throttle( function( e, t ) {
    if ( e.keyCode === 13 ) {
      e.preventDefault();
      e.stopImmediatePropagation();
      
      let uname = Students.findOne({ _id: FlowRouter.getParam("_id") }, { fullName:1 }).fullName;

      var id = $( e.target ).data( 'id' );
      $( e.target ).css( "outline", "#0000FF solid thick" );

      var commentary = $( `#ta-${id}` ).val().trim();

      if (  commentary === null         || 
            commentary === 'undefined'  || 
            commentary === "" ) 
      {
        return;
      }

      //var rec = Newsfeeds.findOne({ _id: id }); //.fetch()[0];
      //console.log( Meteor.user().profile.avatar );
      Meteor.setTimeout(function() {
        Comments.insert({ 
                          owner_id:       id,
                          poster_id:      Meteor.userId(),
                          poster_name:    uname,
                          poster_avatar:  Meteor.user().profile.avatar,
                          comment:        commentary,
                          date:           new Date() 
                        });
                        
        $( `#ta-${id}` ).val('');
      }, 100);

      $( e.target ).fadeOut( "slow", function() {
        // Animation complete.
        $( e.target ).css( "outline", "" );
      }).fadeIn( 'slow' );
      Bert.alert( 'Your comment has been posted', 'success', 'growl-top-right' );
    }

  }, 1000),
//-------------------------------------------------------------------



  /*
   * .JS-COMMENT-BUTTON  ::(CLICK)::
   */
  'click .js-comment-button':  _.debounce( function ( e, t ) {
    e.preventDefault();
    
    let uname = Students.findOne({ _id: FlowRouter.getParam("_id") }, { fullName:1 }).fullName;

    var id = $( e.currentTarget ).data( 'id' );
    var commentary = $( `#ta-${id}` ).val().trim();

    if ( commentary === null || commentary === 'undefined' || commentary === "" ) {
      return;
    }

    Meteor.setTimeout(function() {
      Comments.insert({ 
                        owner_id:       id,
                        poster_id:      Meteor.userId(),
                        poster_name:    uname,
                        poster_avatar:  Meteor.user().profile.avatar,
                        comment:        commentary,
                        date:           new Date() 
                      });
                      
      $( `#ta-${id}` ).val('');
    }, 250);
    Bert.alert( 'Your Comment has been submitted', 'success', 'gowl-top-right' );
  }, 1000),
//-------------------------------------------------------------------

});
