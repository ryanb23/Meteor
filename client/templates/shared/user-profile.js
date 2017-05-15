
import '../../templates/shared/user-profile.html';

import { Students  }    from '../../../both/collections/api/students.js';
import { Newsfeeds }    from '../../../both/collections/api/newsfeeds.js';
import { Comments  }    from '../../../both/collections/api/comments.js';


let ig  = '';


Template.userProfile.onCreated(function() {
  Tracker.autorun( () => {
    Meteor.subscribe('students');
    Meteor.subscribe('newsfeeds');
    Meteor.subscribe('comments');
  });
});



/*
 * EVENTS
 */
Template.userProfile.events({

  /*
   * #USER-AVATAR-UPLOAD  ::(CHANGE)::
   */
  'change #user-avatar-upload'( e, t ) {
    e.preventDefault();

    if ( e.currentTarget.files === 'undefined' ) {
      console.log('aborted');
      return;
    }

    e.currentTarget.files = undefined;
    e.currentTarget.files[0] = undefined;
    e.currentTarget.files[0].name = undefined;
    itype = '';
    
    $( '#acc-image' ).remove();
    
    itype = e.currentTarget.files[0].type;
    
    if ( itype != 'image/png' && itype != 'image/jpeg' ) {
      Bert.alert( 'Incompatible Image Format: must be either a jpg or png file', 'danger' );
    
      //console.log( 'post ' + ext )
      //console.log( e.currentTarget.files );
      //console.log( e.currentTarget.files[0] );
      e.currentTarget.files = undefined;
      e.currentTarget.files[0] = undefined;
      e.currentTarget.files[0].name = undefined;
      itype = '';
      return;
    }

    let fil = t.$( '#user-avatar-upload' ).get(0).files[0];
    let fr  = new FileReader();

    //let myimage = new Image();
    fr.onload   = function() {
      ig  = this.result;

      //orig
      //myimage.src = ig;
      //console.log( 'img.width   = ' + myimage.width );
      //console.log( 'img.height  = ' + myimage.height );
      //let b = new Buffer( ig, 'base64' ).length
      //console.log( 'img.size ' + b );

      //resized
      //foo = resizedataURL( myimage, ext, 150, 150 );
      //myimage.src = foo;
      //console.log( 'img.width   = ' + myimage.width );
      //console.log( 'img.height  = ' + myimage.height );
      //b = new Buffer(foo, 'base64').length
      //console.log( 'img.size ' + b );
    };

    // reads in image, calls back fr.onload
    fr.readAsDataURL( fil );

    let img = $( '<img id="acc-image" height="150" width="150" />' );
    Meteor.setTimeout( function() {
      if ( ig ) { //foo
        img.attr( "src", ig ); // foo
        img.appendTo( '#userthumb' );
      } else {
        img = null;
      }
    }, 200);
    return;
//-------------------------------------------------------------------
  },


  /*
   * .SAVE-PROFILE-PIC  ::(CLICK)::
   */
  'click .save-profile-pic'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    //save image with users id.<file-extension> to user-images/
    //set avatars to that user-images/<filename>
    if ( ig ) {
      Meteor.call( 'updateProfilePic', ig);
    }

    Meteor.setTimeout(function() {
      t.$( '#user-avatar-upload' );
      t.$( '#userthumb img:last-child' ).remove();
      ig  = '';
      }, 100);
      
    t.$( '#profile-modal' ).modal( 'hide' );
//-------------------------------------------------------------------
  },
});


/*
 * Takes a data URI and returns the Data URI corresponding
 * to the resized image at the wanted size.
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
