/*
 * @module adminDesign
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import { Template }     from 'meteor/templating';
import { Companies }   from '../../../both/collections/api/companies.js';
import { ReactiveVar } from 'meteor/reactive-var';

const logo = new ReactiveVar(null);

Template.adminDesign.onCreated(() => {
  Tracker.autorun(() => {
    if(Meteor.user()) {
      Meteor.subscribe('singleCompany', Meteor.user().profile.company_id);
    }
    const company = Companies.findOne();
    if (company && !logo.get()) {
      logo.set(company.logo);
    }
  });
});

Template.adminDesign.helpers({
  logo() {
    return logo.get();
  },

  insert_code() {
    try {
      let cid = Meteor.user().profile.company_id;
      return Companies.findOne({ _id: cid }).insert_code;
    } catch(e) {
      ;
    }
  }
});

/*
 * EVENTS
 */
Template.adminDesign.events({
  'change #logo-upload'(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (event.currentTarget.files && event.currentTarget.files.length) {
      const file = event.currentTarget.files[0];
      const reader = new FileReader();
      reader.onload = ({ target }) => {
        logo.set(target.result);
      };
      reader.readAsDataURL(file);
      // Meteor.setTimeout( function() {
      //   if ( ig ) {
      //     let co_id = Meteor.user().profile.company_id;
      //     t.$( '#logo-preview' ).attr( "src", ig ); // foo
      //     t.$( '#logo-preview' ).css({width:'150px', height:'150px'});
      //     Meteor.call( 'saveCompanyLogo', co_id, ig );
      //   } else {
      //       img = null;
      //   }
      // }, 200);
    }
  },

  'click #design-submit'(event) {
    event.preventDefault();
    const company = Companies.findOne();
    if (company) {
      const ic = $('#ic').val();
      const updateData = { logo: logo.get() };
      if (ic && ic.length > 0) {
        updateData.insert_code = ic;
      }
      Meteor.call('updateDesign', company._id, updateData, err => {
        if (err) {
          Bert.alert( 'Failed to save changes.', 'danger' );
        } else {
          Bert.alert( 'Your information has been saved.', 'success' );
        }
      });
    }
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
*/
