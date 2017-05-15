/*
 * @module home
 * 
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

//import { Blaze } from 'meteor/blaze'
import { Students }     from '../../../both/collections/api/students.js';
/*
import "../../../public/js/source/jquery.fancybox.pack.js";
import "../../../public/js/source/jquery.fancybox.css";
import "../../../public/js/source/helpers/jquery.fancybox-buttons.css";
import "../../../public/js/source/helpers/jquery.fancybox-buttons.js";
import "../../../public/js/source/helpers/jquery.fancybox-thumbs.css";
import "../../../public/js/source/helpers/jquery.fancybox-thumbs.js";
import "../../../public/js/source/helpers/jquery.fancybox-media.js";
*/
import "../../../public/bower_components/ekko-lightbox/dist/ekko-lightbox.min.css";
import "../../../public/bower_components/ekko-lightbox/dist/ekko-lightbox.min.js";
import './home.html';

/*
 * CREATED
 */
Template.home.onCreated(function homeOnCreated() {

  $( "#cover" ).show();

  Tracker.autorun( () => {
    Meteor.subscribe('students');
  });
  
  $(document).on('click', '[data-toggle="lightbox"]', function(event) {
    event.preventDefault();
    $(this).ekkoLightbox({
      type: "vimeo",
      width: "700"
    });
  });

    
    /*
     * OWL.CAROUSEL
     */
    $.getScript( '/js/owl.carousel.min.js', function(){
      //console.log( 'home:: owl.carousel.min.js loaded' );
      // Slider
      $( ".slider-area" ).owlCarousel({
        items: 1,
        loop: true,
        autoplay: true,
        dots: false,
        nav: true,
        navText: [ '<img src="img/slider-arrow-1.png" alt="" />','<img src="img/slider-arrow-2.png" alt="" />' ],
        navSpeed: 500,
        autoplaySpeed: 500,
        autoplayTimeout: 7000
      });

      //Sponsor
      $( ".sponsor-list ul" ).owlCarousel({
        responsive: {
          0: {
            items: 2
          },
          480: {
            items: 3
          },
          768: {
            items: 4
          },
          991: {
            items: 6
          }
        },
        dots: false,
        nav: true,
        navText: [ '<img src="img/arrow-left.png" alt="" />','<img src="img/arrow-right.png" alt="" />' ],
        loop: true,
        autoplay: true
      });
    }).fail( function(jqxhr, settings, exception ) {
    console.log( 'home:: owl.carousel.min.js failed' );
  });
//-------------------------------------------------------------------


    /*
     * SELECT2
     */
    $.getScript( '/js/select2.min.js', function(){
      //console.log( 'home:: select2.min.js loaded' );
    }).fail( function(jqxhr, settings, exception ) {
    console.log( 'home:: select2.min.js failed' );
    //console.log( 'jqxhr ' + jqxhr );
    //console.log( 'settings ' + settings );
    //console.log( 'exception: ' + exception );
  });
//-------------------------------------------------------------------


    /*
     * SCRIPTS
     */
    $.getScript( '/js/scripts.js', function() {
      //Session.set('connectReady', true);
      //console.log('home:: scripts.js loaded');
    }).fail( function(jqxhr, settings, exception ) {
    console.log( 'home:: load scripts.js failed' );
    //console.log( 'jqxhr ' + jqxhr );
    //console.log( 'settings ' + settings );
    //console.log( 'exception: ' + exception );
  });
//-------------------------------------------------------------------

});


/*
 * RENDERED
 */
Template.home.onRendered(function() {
  
      $( '#cover' ).delay( 500 ).fadeOut( 'slow', function() {
        $( "#cover" ).hide();
        $( ".slider-area" ).fadeIn( 'slow' );
      });
  
});


Template.home.events({
  
  'click #home-request-tour-btn'( e, t ) {
    let email = $( '#home-email-info' ).val().trim();
    Meteor.call('sendEmail',  'molly@collectiveuniversity.com', 
                              'mrroboto@cuwebsite.com',
                              'Request Tour',
                              `Autognerated Email from collectiveuniversity.com the following contact is requesting a tour: ${email}`);
  },
  
});
