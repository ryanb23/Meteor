/*
 * @module powerPointHandling
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovations
 */


let pp    = ''
  , pp_id = '';

  /**
   *
   * #COURSE-BUILDER-POWERPOINT  ::(CHANGE)::
   *
   */
   export function cbPowerPointChange( e, t, tbo, PowerPoints ) {

    if ( e.currentTarget.files === 'undefined' || e.currentTarget.files == '' ) {
      console.log( 'aborted' );
      return;
    }

    /* in #add-powerpoint modal
     *
     * MIME TYPES
     *
     * .ppt	application/vnd.ms-powerpointtd
     * .pptx	application/vnd.openxmlformats-officedocument.presentationml.presentation
     *
    */

    //console.log( t.$('#course-builder-powerpoint')[0].files[0] );
    let nm = t.$('#course-builder-powerpoint')[0].files[0].name;

    if (  t.$('#course-builder-powerpoint')[0].files[0].type  != 'application/vnd.ms-powerpointtd' &&
          t.$('#course-builder-powerpoint')[0].files[0].type  != 'application/vnd.openxmlformats-officedocument.presentationml.presentation' &&
          nm.slice( nm.lastIndexOf('.'), nm.length )           != '.ppt' && nm.slice( nm.lastIndexOf('.'), nm.length ) != '.pptx'   )

    {
      Bert.alert( 'Only PPT or PPTX files please', 'danger' );
      t.$( '#course-builder-powerpoint' )[0].files = undefined;
      t.$( '#course-builder-powerpoint' ).val('');
      return;
    }


    // fil = e.currentTarget.files[0]
    let fil = t.$( '#course-builder-powerpoint' )[0].files
  	  , sf  = t.$( '#course-builder-powerpoint' ).data('subfolder');
/*
console.log( e.currentTarget.files );     //object with array
console.log( e.currentTarget.files[0] );  //first array item in object
console.log( e.currentTarget );           //element
*/

		S3.upload(
		          {
        				files:  fil,  //files,
        				path:   sf    //"subfolder"
			        },

			        function( e, r ){
				        //console.log( r );
				        //delete r._id;
				        pp    = r.secure_url;

				        pp_id = PowerPoints.insert({
				          loaded:           r.loaded,
				          percent_uploaded: r.percent_uploaded,
				          relative_url:     r.relative_url,
				          secure_url:       r.secure_url,
				          status:           r.status,
				          total:            r.total,
				          uploader:         r.uploader,
				          url:              r.url,
				          file:             r.file,
				          created_at:       moment().format()
				        });
		          }
		);//s3.upload()
   };



  /**
   *
   * #CB-POWERPOINT-SAVE  ::(CLICK)::
   *
   * id = add-powerpoint
   * powerpoint dialog
   */
  export function cbPowerPointSave( e, t, tbo, PowerPoints ) {
    e.preventDefault();

    //------------------------------------------------------------
    // NEED TO SHOW LOADING DIALOG -- MODAL
    // THEN NEED TO SET IFRAME INSIDE #fb-template WITH SOURCE LOADED
    // FROM RETURN OF PLAYER URL FOR UPLOADED COURSE
    // USE "MASTER" STUDENT FOR THIS
    //------------------------------------------------------------


    console.log('save');
    console.log( pp_id );

    let ct = Session.get('contentTracker');
    ct.page_no[page_no].ppts++;
    Session.set('contentTracker', ct );

    if ( pp ) {
      Bert.alert('Please stand-by. Processing', 'success' );
      console.log( pp_id );

      $( '#cb-toolbar-video' ).show();
      t.$('#cb-current').val( '#ppp' );

      let obj =
      `<embed width="100%" height="600" src="${ppt}" type="application/pdf"></embed>`;
      t.$( '#fb-template' ).empty();
      t.$( '#fb-template' ).append( obj );

      ppt = null;
    }
    console.log( tbo );
    t.$('#add-powerpoint').modal('hide');
//-----------------------------------------------------------------------------
  }
