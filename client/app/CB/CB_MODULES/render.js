/*
 * @module Render
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */

import * as CBCreateDOM from './createDOM.js';



export function render( e, t, arr, P ) {
    for( let z = 0, zlen = arr.length; z < zlen; z++ ) {
      if ( arr[z].type == 'test') {
        $('#fb-template').hide();
        $('#test_v').show();
        Session.set('Scratch', arr[z].id );
        return;
      }  else {
        $('#test_v').hide();
        $('#fb-template').show();
        Session.set('Scratch', null);
      }
    }
    
    $('#fb-template').empty();

    let rtn_arr = handlePrevious(arr);
    let funcs   = rtn_arr[1];

    //ATTACH ELEMENTS RETURNED FROM CLASS TO DOM
    $('#fb-template').append( rtn_arr[0] );
    

    //ACTIVATE POSITIONING JQUERY FUNCTIONS RETURNED FROM CLASS
    for ( let i = 0, ilen = funcs.length; i < ilen; i++ ) {
      eval( funcs[i] );
    }

      /***********************************************************
       * ATTACH MOUSE EVENTS TO NEWLY PLACED TITLE & TEXT ELEMENTS
       **********************************************************/
      for( let i = 0, ilen = arr.length; i < ilen; i++ ) {
  //TITLES
        if (  arr[i].type == 'title' ) {

            eval(
                  $( `#${arr[i].id}` ).on( "mouseup", function(){
                    e.preventDefault();

                    //SHOW RELATED EDITING TOOLBAR
                    $( '.js-title-edit-button' ).show();
                    $( '#cb-title-toolbar' ).show();
                    $( '#cb-text-toolbar' ).hide();
                    $( '#cb-media-toolbar' ).hide();
                    $( '#cb-video-toolbar' ).hide()

                    // MAKE THIS THE CURRENTLY SELECTED ITEM FOR TOOLBAR
                    //R/O HIDDEN FIELD
                    t.$( '#cb-current' ).val( `${arr[i].id}` );

                  })
              );
            eval(
                  $( `#${arr[i].id}` ).on( "dragstop", function( event, ui ) {
                    let idx = P.indexOf( `${arr[i].id}` );
                    P.removeAt( idx );

                    P.insert( idx, {
                                  page_no:  t.page.get(),
                                  id:       `${arr[i].id}`,
                                  type:     'title',
                                  text:             $( `#${arr[i].id}` ).text().trim(),
                                  top:              $( `#${arr[i].id}` ).css('top'),
                                  left:             $( `#${arr[i].id}` ).css('left'),
                                  zIndex:           $( `#${arr[i].id}` ).css('z-index') || 0,
                                  fontSize:         $( `#${arr[i].id}` ).css('font-size') || 16,
                                  border:           $( `#${arr[i].id}` ).css('border') || '',
                                  fontWeight:       $( `#${arr[i].id}` ).css('font-weight') || '',
                                  fontStyle:        $( `#${arr[i].id}` ).css('font-style') || '',
                                  textDecoration:   $( `#${arr[i].id}` ).css('text-decoration') || '',
                                  opacity:          $( `#${arr[i].id}` ).css('opacity') || 1
                              });
                  })
              );
        } else
  //TEXT
            if ( arr[i].type == 'text' ) {

                eval(
                      $( `#${arr[i].id}` ).on( "mouseup", function(){
                        e.preventDefault();

                        //SHOW RELATED EDITING TOOLBAR
                        $( '.js-cb-text-edit' ).show();
                        $( '.js-cb-text-delete' ).show();
                        $( '#cb-text-toolbar' ).show();
                        $( '#cb-editor-save-text' ).hide();
                        $( '#cb-title-toolbar' ).hide();
                        $( '#cb-media-toolbar' ).hide();
                        
                        // MAKE THIS THE CURRENTLY SELECTED ITEM FOR TOOLBAR
                        //R/O HIDDEN FIELD
                        t.$( '#cb-current' ).val( `${arr[i].id}` );

                      })
                  );
                eval(
                      $( `#${arr[i].id}` ).on( "dragstop", function( event, ui ) {
                        let idx = P.indexOf( `${arr[i].id}` );
                        P.removeAt( idx );
                        P.insert( idx, {
                                      page_no:  t.page.get(),
                                      id:       `${arr[i].id}`,
                                      type:     'text',
                                      text:     `${arr[i].text}`,
                                      top:              $( `#${arr[i].id}` ).css('top'),
                                      left:             $( `#${arr[i].id}` ).css('left'),
                                      zIndex:           $( `#${arr[i].id}` ).css('z-index') || 0,
                                      fontSize:         $( `#${arr[i].id}` ).css('font-size') || 16,
                                      border:           $( `#${arr[i].id}` ).css('border') || '',
                                      fontWeight:       $( `#${arr[i].id}` ).css('font-weight') || '',
                                      fontStyle:        $( `#${arr[i].id}` ).css('font-style') || '',
                                      textDecoration:   $( `#${arr[i].id}` ).css('text-decoration') || '',
                                      opacity:          $( `#${arr[i].id}` ).css('opacity') || ''
                                  });
                      })
                  );
        } else
  //IMAGES
            if ( arr[i].type == 'image' ) {
                  if ( arr[i].width == null ) {
                    continue;
                  }
                  eval(
                        $( `#${arr[i].id}` ).on( "mouseup", function(){
                          e.preventDefault();
                          //SHOW RELATED EDITING TOOLBAR
                          $( '#cb-text-toolbar'  ).hide();
                          $( '#cb-title-toolbar' ).hide();
                          $( '#cb-video-toolbar' ).hide();
                          $( '#cb-media-toolbar' ).show();

                          // MAKE THIS THE CURRENTLY SELECTED ITEM FOR TOOLBAR
                          //R/O HIDDEN FIELD
                          t.$( '#cb-current' ).val( `${arr[i].id}` );
                        })
                    );
                  eval(
                        $( `#${arr[i].id}` ).on( "dragstop", function( event, ui ) {
                          let idx = P.indexOf( `${arr[i].id}` )
                            , src = t.$( `#${arr[i].id}` ).css('background-image');
                          P.removeAt( idx );
                          P.insert( idx, {
                                        page_no:  t.page.get(),
                                        id:       `${arr[i].id}`,
                                        type:     'image',
                                        top:      $( `#${arr[i].id}` ).css('top'),
                                        left:     $( `#${arr[i].id}` ).css('left'),
                                        zIndex:   $( `#${arr[i].id}` ).css('z-index'),
                                        width:    $( `#${arr[i].id}` ).width(),
                                        height:   $( `#${arr[i].id}` ).height(),
                                        src:      rmvQuotes( src ),
                                        opacity:  $( `#${arr[i].id}` ).css('opacity')
                                    });
                        })
                    );
        } else
            if ( arr[i].type == 'pdf' ) {
               eval(
                        $( `#${arr[i].id}` ).on( "mouseup", function(){
                          e.preventDefault();
                          //SHOW RELATED EDITING TOOLBAR
                          $( '#cb-text-toolbar'  ).hide();
                          $( '#cb-title-toolbar' ).hide();
                          $( '#cb-media-toolbar' ).hide();
                          $( '#cb-video-toolbar' ).show();

                          // MAKE THIS THE CURRENTLY SELECTED ITEM FOR TOOLBAR
                          //R/O HIDDEN FIELD
                          t.$( '#cb-current' ).val( `${arr[i].id}` );
                        })
                    );
        }//else
      }//outer for
}

/**********************************************************
 * HANDLE PREVIOUS
 *********************************************************/
 function handlePrevious( o ) {


    let funcs   = ''                  //FUNCS FROM CLASS TO POSITION ELEMENTS
      , content = ''                  //RENDERED MARKUP (AND FUNCS) RETURNED
      , cd                            //RENDERING CLASS INSTANCE
      , mark_up = '';                 //RENDERED MARKUP RETURN VARIABLE

    //CREATE INSTANCE OF CBCreateDOM CLASS
    cd        = new CBCreateDOM.CreateDOM( o );

    //RETRIEVE RESULT OF PROCESSING RETURNED DATABASE ELEMENTS
    content   = cd.buildDOM();
    //PULL OUT THE MARKUP RETURNED FROM CLASS
    mark_up   = content[0];
    //PULL OUT THE JQUERY FUNCTIONS RETURNED FROM CLASS
    funcs     = content[1];

    return [ mark_up, funcs ];

 }

function rmvQuotes( str ) {
  return str
      .replace(/"/g, '');
}
