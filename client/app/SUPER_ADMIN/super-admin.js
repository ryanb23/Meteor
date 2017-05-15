/*
 * @module superAdmin
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import { Students }   from '../../../both/collections/api/students.js';
import { Newsfeeds }  from '../../../both/collections/api/newsfeeds.js';

import './super-admin.html';


Template.superAdmin.onCreated(function() {
  
  Tracker.autorun( () => {
    Meteor.subscribe('students');
    Meteor.subscribe('newsfeeds');
  });

});



Template.superAdmin.helpers({
  
  users: () => {
    return Students.find({ role:"admin" }).fetch();
  },
  
});


Template.superAdmin.events({
  
  'change #freeze-account'( e, t ) {
    e.preventDefault();
    
    console.log( 'fc');
  },
  
  'change #number-users-allowed'( e, t ) {
    e.preventDefault();
    
    console.log( $(e.currentTarget).val() );
  },
  
  'change #account-expiration'( e, t ) {
    e.preventDefault();
    
    console.log( $(e.currentTarget).val() );
  },
  
  
  'click #sa-save'( e, t ) {
    e.preventDefault();
    
    console.log( 'sa-save');
  },
  
  
  /*
   * CURATE ARTICLE
   */
  'click #curate-article'( e, t ) {
    e.preventDefault();
    
    let link    = t.find( '[name="curated-link"]' ).value;
    t.find( '[name="curated-link"]' ).value  = '';
    
    Newsfeeds.insert({  
                        owner_id:       Meteor.userId(),
                        poster:         "SuperAdmin",
                        poster_avatar:  "",
                        type:           "article",
                        private:        false,
                        news:           link,
                        comment_limit:  3,
                        likes:          0,
                        likers:         [],
                        date:           new Date() 
                      });
    
    Bert.alert( 'The article has been added to the system', 'success' );
  },
  
});
