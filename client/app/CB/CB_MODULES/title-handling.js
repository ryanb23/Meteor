/*
 * @module titleHandling
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */


/**********************************************************
 * #ADDED-TITLE  ::(BLUR)::
 *********************************************************/
  export function cbAddedTitleBlur( e, 
                                    t, 
                                    page_no,
                                    master_num,
                                    P
                                  ) {
    e.preventDefault();

    if ( t.$( '#added-title' ).val() == undefined || t.$( '#added-title' ).val() == '' ) {
      try {
        $( '#added-title' ).remove();
      } catch( DOMException ) {
        ;
      }
      return;
    }


    let str   = t.$( '#added-title' ).val().trim()
      , my_id = Session.get('my_id')
      , pos   = t.$( '#added-title' ).offset();

    if ( t.$( '#added-title' ).length ) {
      try {
        $( '#added-title' ).remove();
      } catch( DOMException ) {
        ;
      }
    }

    t.$( '#fb-template' ).append( `<span id="tit-${master_num}" data-pid="0" data-page="${page_no}" style="font-size:18px;font-weight:bold;z-index:0;border-radius:5px;background-color:white;position:absolute;top: 0;cursor:move;border:none !important;">` + escapeHtml( str ) + '</span>');
    t.$( `#tit-${master_num}` ).css({ left: pos.left, top: pos.top });
    t.$( `#tit-${master_num}` ).draggable({ containment: "#fb-template", scroll: false });
    
    P.append({
                    page_no:  page_no,
                    type:     'title',
                    id:       `tit-${master_num}`,
                    text:     escapeHtml(str),
                    top:              $( `#tit-${master_num}` ).css('top'),
                    left:             $( `#tit-${master_num}` ).css('left'),
                    zIndex:           $( `#tit-${master_num}` ).css('z-index') || 0,
                    fontSize:         $( `#tit-${master_num}` ).css('font-size') || 18,
                    border:           $( `#tit-${master_num}` ).css('border') || '',
                    fontWeight:       $( `#tit-${master_num}` ).css('font-weight') || 'bold',
                    fontStyle:        $( `#tit-${master_num}` ).css('font-style') || 'normal',
                    textDecoration:   $( `#tit-${master_num}` ).css('text-decoration') || 'none',
                    opacity:          $( `#tit-${master_num}` ).css('opacity') || 1
              });
/*              
    Meteor.setTimeout(function(){
      
      //$( `#tit-${master_num}` ).attr( 'data-pid', `${my_id}` );

    }, 500);
*/  
    //-------------------------------
    // TITLE OBJECT CLICK EVENT
    //-------------------------------
    (function( master_num, my_id ){

      $( `#tit-${master_num}` ).on( "mouseup", function(){
        e.preventDefault();
        
        // MAKE THIS THE CURRENTLY SELECTED ITEM FOR TOOLBAR R/O HIDDEN FIELD
        t.$( '#cb-current' ).val( `tit-${master_num}` );
        
        let str = $( `#tit-${master_num}` ).text().trim()
          , id  = `tit-${master_num}`
          , idx = P.indexOf( `tit-${master_num}` )
          , sz  = $( `#tit-${master_num}` ).css('fontSize')
          , op  = $( `#tit-${master_num}` ).css('opacity');
        
        //SET TOOLBAR SLIDERS  
        $('#fnt').val( Number( sz.slice( 0, 2 ) ) );
        $('.js-title-font-size').val( Number( sz.slice( 0, 2 ) ) );
        $('#top').val( op );
        $('.js-title-opacity').val( op );

        //SHOW RELATED EDITING TOOLBAR
        $( '#cb-title-toolbar' ).show();
        $( '#cb-text-toolbar' ).hide();
        $( '#cb-media-toolbar').hide();
        $( '#cb-video-toolbar').hide();
        
        //P.remove( `tit-${master_num}` );
        P.removeAt( idx );
        P.insert( idx, { 
                      page_no:  page_no,
                      id:       id,
                      type:     'title',
                      text:     escapeHtml(str),
                      top:              $( `#tit-${master_num}` ).css('top'),
                      left:             $( `#tit-${master_num}` ).css('left'),
                      zIndex:           $( `#tit-${master_num}` ).css('z-index') || 0,
                      fontSize:         $( `#tit-${master_num}` ).css('font-size') || 18,
                      border:           $( `#tit-${master_num}` ).css('border') || '',
                      fontWeight:       $( `#tit-${master_num}` ).css('font-weight') || 'bold',
                      fontStyle:        $( `#tit-${master_num}` ).css('font-style') || 'normal',
                      textDecoration:   $( `#tit-${master_num}` ).css('text-decoration') || 'none',
                      opacity:          $( `#tit-${master_num}` ).css('opacity') || 1
                  });
      });//onmouseup

    })( master_num, my_id );//anon function
//---------------------------------------------------------------------------
  };


function escapeHtml(str) {
    return str
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}  