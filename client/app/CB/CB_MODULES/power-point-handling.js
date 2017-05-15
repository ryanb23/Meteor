/*
 * @module powerPointHandling
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovations
 */


let pp    = ''
  , ppt_id = '';

  /**
   *
   * #COURSE-BUILDER-POWERPOINT  ::(CHANGE)::
   *
   */
   export function cbPowerPointChange( e, 
                            t, 
                            page_no,
                            Ppts,
                            P,
                            master_num ) {

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
				        console.log( r );
				        //delete r._id;
				        pp    = r.secure_url;

                ppt_id = Meteor.call('addFileData', 'powerpoint',
                                result.loaded,
                                result.percent_uploaded,
                                result.relative_url,
                                result.secure_url,
                                result.status,
                                result.total,
                                result.uploader,
                                result.url,
                                result.file,
                                moment().format()
                         );
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
  export function cbPowerPointSave( e, t, page_no, tbo, P, master_num) {
    e.preventDefault();

    //------------------------------------------------------------
    // NEED TO SHOW LOADING DIALOG -- MODAL
    // THEN NEED TO SET IFRAME INSIDE #fb-template WITH SOURCE LOADED
    // FROM RETURN OF PLAYER URL FOR UPLOADED COURSE
    // USE "MASTER" STUDENT FOR THIS
    //------------------------------------------------------------


    let ct = Session.get('contentTracker');
    // ct.page_no[page_no].ppts++;
    // Session.set('contentTracker', ct );


    if ( pp ) {
      Bert.alert('Please stand-by. Processing', 'success' );
      // console.log( pp_id );

      $( '#cb-video-toolbar' ).show();
      t.$( '#cb-current' ).val( `ppt-${master_num}` );
      let obj =
      `<iframe id="ppt-${master_num}" src="http://docs.google.com/gview?url=${pp}&embedded=true" style="width:100%; height:600px;" frameborder="0"></iframe>`;
      // `<embed width="100%" height="600" src="${pp}" type="application/pdf"></embed>`;
      t.$( '#fb-template' ).empty();
      t.$( '#fb-template' ).append( obj );

      P.append({
                    page_no:  page_no,
                    id:       `ppt-${master_num}`,
                    type:     'ppt',
                    url:      obj,
                    s3:       pp,
                    file_lnk:  ppt_id
              });

      console.log( "pp");
      ppt = null;

    }
    // console.log( tbo );
    S3.collection.remove({});
    t.$('#add-powerpoint').modal('hide');
//-----------------------------------------------------------------------------
  }
