/*
 * @module imageHandling
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovations
 */

   /********************************************************
   * #CB-IMAGE-SAVE  ::(CLICK)::
   *******************************************************/
  export function cbImageSave( e, t, page_no, master_num, P, Images ) {
    e.preventDefault();

    if ( e.currentTarget.files === 'undefined' ) {
      console.log('aborted');
      return;
    }

    let ext   = t.$( '#course-builder-image' )[0].files[0].name
      , itype = t.$( '#course-builder-image' )[0].files[0].type;
      
    ext = String(ext);
    
    try {
      ext = ext.slice(ext.lastIndexOf('.'));
    } catch (e) {
      ;
    }
    
    if  (  
          itype != 'image/png'  && 
          itype != 'image/jpeg' && 
          itype != 'image/gif'  &&
          ext   != '.gif'       &&
          ext   != '.jpg'       &&
          ext   != '.jpeg'      &&
          ext   != '.png'
        ) 
    {
      Bert.alert( 'Incompatible Image Format: must be either a jpg, png, or gif file', 'danger' );

      e.currentTarget.files         = undefined;
      e.currentTarget.files[0]      = undefined;
      e.currentTarget.files[0].name = undefined;
      itype = '';
      t.$( '#course-builder-image' ).val('');
      return;
    }

    let fil   = t.$( '#course-builder-image' )[0].files
	    , sf    = t.$( '#course-builder-image' ).data('subfolder')
	    , obj
      , img_id
			, ref_img = document.getElementById('ref_img')
      , id
      , idx
      , src
      , pos
      , files
      , path;

  	if ( fil.length == 0 ) {
  	  Bert.alert('You must upload an image before you can save', 'danger');
  	  return;
  	}

	  Bert.alert( 'Please standby...', 'success' );	  

	  
		S3.upload(
		          {
        				files:  fil,      //files,
        				path:   sf        //"subfolder"
			        },
			        
			        function( error, result ){

                if ( error ) throw error;

                a_img_id =  Meteor.call('addFileData', 'img',
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

                img_id = result.secure_url;
                //style="width:400px;height:400px;"

                  $('#fb-template').append( `
                      
                        <div id="ig-${master_num}" 
                             style="position:absolute;
                                    background-image:url(${img_id});
                                    width:200px;
                                    height:200px;
                                    background-size:cover;">
                        </div>
                  ` );

$(`#ig-${master_num}`).draggable({
    containment: "#fb-template",
	scroll: false
});
$(`#ig-${master_num}`).resizable({ containment: "#fb-template",
                                    resize: function(event, ui){
                                      src = t.$( `#ig-${master_num}` ).css('background-image')
                                      , id  = `ig-${master_num}`
                                      , idx = P.indexOf( `ig-${master_num}` );
                                        
                                      //P.remove( `ig-${master_num}` );
                                      P.removeAt( idx );
                                      P.insert( idx, {
                                                    page_no:         page_no,
                                                    type:            'image',
                                                    id:              `ig-${master_num}`,
                                                    img_lnk:         a_img_id,
                                                    top:             $(`#ig-${master_num}`).css('top'),
                                                    left:            $(`#ig-${master_num}`).css('left'),
                                                    opacity:         $(`#ig-${master_num}`).css('opacity'),
                                                    width:           $(`#ig-${master_num}`).width(),
                                                    height:          $(`#ig-${master_num}`).height(),
                                                    zIndex:          $( `#ig-${master_num}` ).css('z-index'),
                                                    src:             rmvQuotes( src )
                                      });
                                    }
                                  });

                  if(img_id.indexOf('url')===-1) img_id = 'url(' + img_id + ')';
                  P.append({
                            page_no:         page_no,
                            type:            'image',
                            id:              `ig-${master_num}`,
                            file_lnk:         a_img_id,
                            top:             $( `#ig-${master_num}` ).css('top'),
                            left:            $( `#ig-${master_num}` ).css('left'),
                            width:           $( `#ig-${master_num}` ).width(),
                            height:          $( `#ig-${master_num}` ).height(),
                            opacity:         $( `#ig-${master_num}` ).css('opacity'),
                            zIndex:          $( `#ig-${master_num}` ).css('z-index'),
                            src:             img_id         
                  });

                  //$( '#ref_img' ).attr('src', null );
                 
                  (function( master_num ){
            
                    $( `#ig-${master_num}` ).on("mouseup", function(){
                      e.preventDefault();
                  
                    //SHOW MEDIA TOOLBAR
                    $( '#cb-video-toolbar').hide();
                    $( '#cb-title-toolbar' ).hide();
                    $( '#cb-text-toolbar' ).hide();
                    $( '#cb-media-toolbar' ).show();
                    
                    t.$( '#cb-current' ).val( `ig-${master_num}` );
                    
                  }); //onmouseup


                    $( `#ig-${master_num}` ).on("dragstop", function(){
                      e.preventDefault();
                  
                    
                      src = t.$( `#ig-${master_num}` ).css('background-image')
                    , id  = `ig-${master_num}`
                    , idx = P.indexOf( `ig-${master_num}` );
                      
                    //P.remove( `ig-${master_num}` );
                    P.removeAt( idx );
                    P.insert( idx, {
                                  page_no:         page_no,
                                  type:            'image',
                                  id:              `ig-${master_num}`,
                                  img_lnk:         a_img_id,
                                  top:             $(`#ig-${master_num}`).css('top'),
                                  left:            $(`#ig-${master_num}`).css('left'),
                                  opacity:         $(`#ig-${master_num}`).css('opacity'),
                                  width:           $(`#ig-${master_num}`).width(),
                                  height:          $(`#ig-${master_num}`).height(),
                                  zIndex:          $( `#ig-${master_num}` ).css('z-index'),
                                  src:             rmvQuotes( src )
                    });
                  });
                })( master_num );//anon func
            
                  itype = null;
                  ext = null;

                  S3.collection.remove({});
                  $( '#preview-image' ).attr( 'src', null );
                  t.$( '#add-image' ).modal( 'hide' );
                  t.$( '#course-builder-image' ).val('');

		});//s3
//---------------------------------------------------------
}

function rmvQuotes( str ) {
  return str
      .replace(/"/g, '');
}