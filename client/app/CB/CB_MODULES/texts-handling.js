/*
 * @module textsHandling
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */



  /********************************************************
   * RESET
   *******************************************************/
  export function cbTextReset() {

  }



  /********************************************************
   * #ADDED-TEXT  ::(BLUR)::
   *******************************************************/
  export function cbAddedTextBlur(  e,
                                    t,
                                    txt,
                                    page_no,
                                    master_num,
                                    P
                                  )
  {
    e.preventDefault();

    t.$( '#fb-template' ).append( `<span  style="cursor:move;
                                                 z-index:0;
                                                 top:10px 
                                                 left:80px
                                                 background-color:white;
                                                 position:absolute;"
                                          id="txt-${master_num}"
                                          data-pid="0"
                                          data-page="${page_no}"
                                          data-editing="false">
                                      ${txt}
                                  </span>`);
                                  
    t.$( `#txt-${master_num}` ).css({ 'margin-top': '10px', 'margin-bottom': '10px' });
    t.$( `#txt-${master_num}` ).css({ left: '10px', top: '80px' });
    t.$( `#txt-${master_num}` ).draggable({ containment: "#fb-template", scroll: false });

    P.append({
      page_no:        page_no,
      type:           'text',
      id:             `txt-${master_num}`,
      text:           txt,
      zIndex:         $( `#txt-${master_num}` ).css('z-index')          || 0,
      top:            $( `#txt-${master_num}` ).css('top'),
      left:           $( `#txt-${master_num}` ).css('left'),
      fontSize:       $( `#txt-${master_num}` ).css('font-size')        || 16,
      border:         $( `#txt-${master_num}` ).css('border')           || '',
      fontWeight:     $( `#txt-${master_num}` ).css('font-weight')      || '',
      fontStyle:      $( `#txt-${master_num}` ).css('font-style')       || 'normal',
      textDecoration: $( `#txt-${master_num}` ).css('text-decoration')  || 'none',
      opacity:        $( `#txt-${master_num}` ).css('opacity')          || 1
    });
P.print();

    Meteor.setTimeout(function(){
      $( `#txt-${master_num}` ).attr( 'data-pid', `${Session.get('my_id')}` );
    }, 500);

  //--------------------------
  // TEXT OBJECT CLICK EVENT
  //--------------------------
  (function( master_num ) {

    //document.getElementById( `span_text-${txt_id}` ).onmouseup =  (e) => {

    t.$( `#txt-${master_num}` ).on("mouseup", function(){
      e.preventDefault();

      //SHOW RELATED EDITING TOOLBAR
      $( '.js-cb-text-edit' ).show();
      $( '.js-cb-text-delete' ).show();
      $( '#cb-text-toolbar' ).show();
      $( '#cb-editor-save-text' ).hide();
      $( '#cb-title-toolbar' ).hide();
      $( '#cb-media-toolbar' ).hide();

      //INSERT CURRENT ELEMENT IN HIDDEN INPUT
     t.$( '#cb-current' ).val( `txt-${master_num}` );

      let id  = `txt-${master_num}`
        , str = $( `#txt-${master_num}` ).html()
        , idx = P.indexOf( `txt-${master_num}` );

      
      //pos.left = Math.abs(pos.left);
      //pos.top = Math.abs(pos.top);



      P.removeAt( idx );

      P.insert( idx, {
      page_no:        page_no,
      id:             id,
      type:           'text',
      text:           str,
      top:            t.$( `#txt-${master_num}` ).css('top'),
      left:           t.$( `#txt-${master_num}` ).css('left'),
      zIndex:         t.$( `#txt-${master_num}` ).css('z-index')        || 0,
      fontSize:       t.$( `#txt-${master_num}` ).css('font-size')      || 16,
      border:         t.$( `#txt-${master_num}` ).css('border')         || '',
      fontWeight:     t.$( `#txt-${master_num}` ).css('font-weight')    || '',
      fontStyle:      t.$( `#txt-${master_num}` ).css('font-style')     || 'normal',
      textDecoration: t.$( `#txt-${master_num}` ).css('text-decoration') || 'none',
      opacity:        t.$( `#txt-${master_num}` ).css('opacity')         || 1 
    });
    
P.print();
    });//mouseup
  })( master_num );//anon func
//---------------------------------------------------------
};


function escapeHtml(str) {
    return str
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}