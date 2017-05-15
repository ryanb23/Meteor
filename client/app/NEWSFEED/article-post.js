/*
 * @module adminAdvanced
 * 
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import { Template }   from 'meteor/templating';

//import { Students }   from '../../../both/collections/api/students.js';

import './article-post.html';


Template.articlePost.events({
  
  /*
   * USER CLICKED CURATED ARTICLE LINK
   */
  'click a'( e, t ) {
    let linkText  = t.$( e.currentTarget ).text()
      , linkId    = t.$( e.currentTarget ).data('id');
    
    Meteor.call( 'curatedArticleStudentUpdate', linkText, linkId );
  },
  
});