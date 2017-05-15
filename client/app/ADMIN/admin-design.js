/*
 * @module adminDesign
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import '../../../public/css/bootstrap-colorpicker.min.css';


import { Template }     from 'meteor/templating';
import { Companies  }   from '../../../both/collections/api/companies.js';

import '../../templates/admin/admin-design.html';

let co_id = '';

/*
 * CREATED
 */
Template.adminDesign.onCreated(function(){

  Tracker.autorun( () => {
    Meteor.subscribe('companies');
  });
	
  //$("#cover").show();

  
  //this.autorun(() => {
  //this.subscribe("company_id", Meteor.userId());
  //});


  /*
   * BOOTSTRAP-COLORPICKER
   */
  $.getScript( '/js/bootstrap-colorpicker.min.js', function() {
    let co_id, tmp, col;
    try {
      co_id   = Meteor.user().profile.company_id
      , tmp     = Companies.findOne({ _id: co_id })
      , col     = tmp && tmp.backgroundColor;
    } catch(e) {
      ;
    }
    
	  //color picker
	  $( ".color-picker" ).colorpicker({ color: col });
    //console.log('DESIGN:: bootstrap-colorpicker.min.js loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'DESIGN:: load bootstrap-colorpicker.min.js fail' );
  });
//-------------------------------------------------------------------
});


/*
 * RENDERED
 */
Template.adminDesign.onRendered(function(){
/*
  $( '#cover' ).delay( 500 ).fadeOut( 'slow', function() {
    $("#cover").hide();
    $( ".dashboard-header-area" ).fadeIn( 'slow' );
  });
*/
});


Template.adminDesign.helpers({
  companies: () => {
    try {
      let id = Meteor.user().profile.company_id;
      return Companies.findOne({ _id: id });
    } catch(e) {
      ;
    }
  },
  
  insert_code: () => {
    try {
      let cid = Meteor.user().profile.company_id;
      return Companies.findOne({ _id: cid }).insert_code;
    } catch(e) {
      ;
    }
  }
});



let ig  = ''
  , ext = ''
  , foo = '';

/*
 * EVENTS
 */
Template.adminDesign.events({

  /*
   * #LOGO-UPLOAD  ::(CHANGE)::
   */
  'change #logo-upload'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    if ( e.currentTarget.files === 'undefined' ) {
      console.log( 'aborted' );
      return;
    }

    let mark = ( e.currentTarget.files[0].name ).lastIndexOf( '.' ) + 1;

    ext   = ( e.currentTarget.files[0].name ).slice( mark );
    ext   = ( ext == ( 'jpg' || 'jpeg' ) ) ? 'image/jpeg' : 'image/png';

    let fil = t.$( '#logo-upload' ).get(0).files[0];
    let fr  = new FileReader();

    let myimage = new Image();
    fr.onload   = function() {
      ig        = this.result;

      //orig
      myimage.src = ig;
      console.log( 'img.width   = ' + myimage.width );
      console.log( 'img.height  = ' + myimage.height );
      let b = new Buffer( ig, 'base64' ).length
      console.log( 'img.size ' + b );
/*
      //resized
      foo = resizedataURL( myimage, ext, 150, 150 );
      myimage.src = foo;
      console.log( 'img.width   = ' + myimage.width );
      console.log( 'img.height  = ' + myimage.height );
      b = new Buffer( foo, 'base64' ).length
      console.log( 'img.size ' + b );
*/
    };

    // reads in image, calls back fr.onload
    fr.readAsDataURL( fil );
    Meteor.setTimeout( function() {
      if ( ig ) {
        let co_id = Meteor.user().profile.company_id;
        t.$( '#logo-preview' ).attr( "src", ig ); // foo
        t.$( '#logo-preview' ).css({width:'150px', height:'150px'});
        Meteor.call( 'saveCompanyLogo', co_id, ig );
      } else {
          img = null;
      }
    }, 200);
    return;
//-------------------------------------------------------------------
  },


  /*
   * #DESIGN-SUBMIT  ::(CLICK)::
   */
  'click #design-submit'( e, t ) {
    e.preventDefault();

    let ic = $('#ic').val();
    
    if (ic.length > 0 ) {
      let co_id = Meteor.user() && 
                  Meteor.user().profile && 
                  Meteor.user().profile.company_id;
      Companies.update({ _id: co_id }, {$set:{insert_code: ic }});
    }
    
    Bert.alert( 'Your information has been saved.', 'success' );
  },


  /*
   * HIDEPICKER .COLOR-PICKER

  'hidePicker .color-picker'( e, t ){
    let colorValue = t.$('.color-picker > input').val();

    Meteor.setTimeout(function(){
      if ( colorValue ) {
        let co_id = Meteor.user().profile.company_id;
        Meteor.call( 'saveCompanyColor', co_id, colorValue );
      }
    }, 200);
//-------------------------------------------------------------------
  },
  */

});


/*
 * Takes a data URI and returns the Data URI corresponding to
 * the resized image at the wanted size.
 */
function resizedataURL(img, ext, wantedWidth, wantedHeight) {

    let iw        = img.width;
    let ih        = img.height;
    let scale     = Math.min((wantedWidth/iw),(wantedHeight/ih));
    let iwScaled  = iw*scale;
    let ihScaled  = ih*scale;
    let canvas    = document.createElement("canvas");
    let ctx       = canvas.getContext("2d");
    canvas.width  = iwScaled;
    canvas.height = ihScaled;

    ctx.drawImage( img,0,0,iwScaled,ihScaled );
    return canvas.toDataURL( '"' + ext + '"' );
}
