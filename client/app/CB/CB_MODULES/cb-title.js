


 /**********************************************************
 * TITLE-EDIT
 *********************************************************/
 export function titleEditText( e, t, P ) {

    //GET THE CURRENTLY SELECTED ELEMENT
    let cur = t.$( '#cb-current' ).val();

    //PULL OUT IT'S ACTUAL TEXT
    let text = t.$( `#${cur}` ).text().trim()
      , txt;

    //HIDE THE CURRENT ELEMENT
    t.$( `#${cur}` ).hide();

    //let pos = $( `${currentItem}` ).position();

    //CREATE A NEW ELEMENT, ATTACH IT TO THE CANVAS, INJECT IT WITH THE TEXT
    t.$( '#fb-template' ).append( `<input  id="toolb-added-title"
                                            type="text"
                                            style="font-size:18px;
                                            width:95%;
                                            font-weight:bold;z-index:2;
                                            border-radius:5px;
                                            background-color:white;
                                            cursor:move;
                                            border:1px dashed !important;"
                                            value="${text}">`
                              ).css({ 'color': 'grey',
                                      'position': `element(${cur})`,
                                      'right': 0, 'bottom': 0
                                    });

    t.$( '#toolb-added-title' ).effect( "highlight", {}, 2000 ).focus();


    t.$( '#toolb-added-title' ).blur(function(){
      let txt = t.$( '#toolb-added-title' ).val().trim();
      t.$( '#toolb-added-title' ).remove();

      t.$( `#${cur}` ).show();
      t.$( `#${cur}` ).text( txt );

      let idx = P.indexOf( `${cur}` );

      P.removeAt( idx );
      P.insert( idx, {
                        page_no:  t.page.get(),
                        id:       cur,
                        type:     'title',
                        text:             t.$(`#${cur}`).text().trim(),
                        top:              t.$(`#${cur}`).css('top'),
                        left:             t.$(`#${cur}`).css('left'), 
                        zIndex:           t.$( `#${cur}` ).css('z-index'),
                        fontSize:         t.$( `#${cur}` ).css('font-size'),
                        border:           t.$( `#${cur}` ).css('border'),
                        fontWeight:       t.$( `#${cur}` ).css('font-weight'),
                        fontStyle:        t.$( `#${cur}` ).css('font-style'),
                        textDecoration:   t.$( `#${cur}` ).css('text-decoration'),
                        opacity:          t.$( `#${cur}` ).css('opacity')
                    });

      P.print();
    });
//---------------------------------------------------------
 }


   /********************************************************
   * TITLE-DELETE
   *******************************************************/
  export function titleDelete( e, t, P, pp ) {
    e.preventDefault();

    let cur = t.$( '#cb-current' ).val()
      , idx = P.indexOf(`${cur}`);

    P.removeAt( idx );

    t.$( `#${cur}` ).remove();
    t.$( '#cb-current' ).val('');

    t.$( '#cb-title-toolbar' ).hide();

    pp.update( { _id: Session.get('my_id') },
          { $pull: { objects:{ id:{$eq: cur} } }});
          
    P.print();
    console.log( pp.find({}).fetch() );
//----------------------------------------------------------
  }




/**********************************************************
 * TITLE-ITALIC  ::(CLICK)::
 *********************************************************/
  export function titleItalic( e, t, P ) {
    e.preventDefault();

    let cur = t.$( '#cb-current' ).val()
      , idx = P.indexOf(`${cur}`);

    if ( $( `#${cur}` ).css('fontStyle') != 'italic' ) {
      t.$( `#${cur}` ).css('fontStyle', 'italic');
      //P.update( { _id: id, "objects.page_no": pg },
      //          {$set:{"objects.$.fontStyle": 'italic' }});
    } else {
      t.$( `#${cur}` ).css('fontStyle', 'normal');
      //P.update( { _id: id, "objects.page_no": pg },
      //          {$set:{ "objects.$.fontStyle": 'normal' }});
    }

    P.removeAt( idx );
    P.insert( idx, {
                      page_no:  t.page.get(),
                      id:       `${cur}`,
                      type:     'title',
                      text:             t.$(`#${cur}`).text().trim(),
                      top:              t.$(`#${cur}`).css('top'),
                      left:             t.$(`#${cur}`).css('left'),
                      zIndex:           t.$( `#${cur}` ).css('z-index'),
                      fontSize:         t.$( `#${cur}` ).css('font-size'),
                      border:           t.$( `#${cur}` ).css('border'),
                      fontWeight:       t.$( `#${cur}` ).css('font-weight'),
                      fontStyle:        t.$( `#${cur}` ).css('font-style'),
                      textDecoration:   t.$( `#${cur}` ).css('text-decoration'),
                      opacity:          t.$( `#${cur}` ).css('opacity')
                  });

    console.log( P.print() );
//---------------------------------------------------------
  }


 /**********************************************************
 * TITLE-BOLD ::(CLICK)::
 *********************************************************/
  export function titleBold( e, t, P ) {
    e.preventDefault();

    let cur = t.$( '#cb-current' ).val()
      , idx = P.indexOf(`${cur}`);

    if ( $( `#${cur}` ).css('fontWeight') != 'bold' ) {
      t.$( `#${cur}` ).css('fontWeight', 'bold');
      //P.update( { _id: id, "objects.page_no": pg },
      //          {$set:{ "objects.$.fontWeidht": 'bold'}});
    } else {
      t.$( `#${cur}` ).css('fontWeight', 'normal' );
      //P.update( { _id: id, "objects.page_no": pg },
      //          {$set:{ "objects.$.fontWeight": '' }});
    }

    P.removeAt( idx );
    P.insert( idx, {
                      page_no:  t.page.get(),
                      id:       `${cur}`,
                      type:     'title',
                      text:             t.$(`#${cur}`).text().trim(),
                      top:              t.$(`#${cur}`).css('top'),
                      left:             t.$(`#${cur}`).css('left'),
                      zIndex:           t.$( `#${cur}` ).css('z-index'),
                      fontSize:         t.$( `#${cur}` ).css('font-size'),
                      border:           t.$( `#${cur}` ).css('border'),
                      fontWeight:       t.$( `#${cur}` ).css('font-weight'),
                      fontStyle:        t.$( `#${cur}` ).css('font-style'),
                      textDecoration:   t.$( `#${cur}` ).css('text-decoration'),
                      opacity:          t.$( `#${cur}` ).css('opacity')
                  });

    console.log( P.print() );
//---------------------------------------------------------
  }


 /**********************************************************
 * TITLE-UNDERLINE  ::(CLICK)::
 *********************************************************/
  export function titleUnderline( e, t, P ) {
    e.preventDefault();

    let cur = t.$( '#cb-current' ).val()
      , idx = P.indexOf(`${cur}`);


    if ( t.$( `#${cur}` ).css( 'textDecoration' ) != 'underline' ) {
      t.$( `#${cur}` ).css( 'textDecoration', 'underline' );
      //P.update( { _id: id, "objects.page_no": pg },
      //          {$set:{ "objects.$.textDecoration": 'underline' }});
    } else {
      t.$( `#${cur}` ).css('textDecoration', '');
      //P.update( { _id: id, "objects.page_no": pg },
      //          {$set:{ "objects.$.textDecoration": ''}});
    }

    P.removeAt( idx );
    P.insert( idx, {
                      page_no:  t.page.get(),
                      id:       `${cur}`,
                      type:     'title',
                      text:             t.$(`#${cur}`).text().trim(),
                      top:              t.$(`#${cur}`).css('top'),
                      left:             t.$(`#${cur}`).css('left'),
                      zIndex:           t.$( `#${cur}` ).css('z-index'),
                      fontSize:         t.$( `#${cur}` ).css('font-size'),
                      border:           t.$( `#${cur}` ).css('border'),
                      fontWeight:       t.$( `#${cur}` ).css('font-weight'),
                      fontStyle:        t.$( `#${cur}` ).css('font-style'),
                      textDecoration:   t.$( `#${cur}` ).css('text-decoration'),
                      opacity:          t.$( `#${cur}` ).css('opacity')
                  });

    console.log( P.print() );
//---------------------------------------------------------
  }



 /**********************************************************
 * TITLE-FONT-SIZE  ::(INPUT)::
 *********************************************************/
  export function titleFontSizeInput( e, t ) {
    e.preventDefault();

    let cur = t.$( '#cb-current' ).val()
      , fsz = t.$(e.currentTarget).val()
      , pg  = t.$( `#${cur}` ).data('page')
      , pos = t.$( `#${cur}` ).offset();


    t.$( `#${cur}` ).css( 'font-size',`${fsz}px` );

    t.$( '#fnt' ).val( fsz );
  }
//---------------------------------------------------------



 /**********************************************************
 * TITLE-FONT-SIZE  ::(MOUSEUP)::
 *********************************************************/
  export function titleFontSizeMU( e, t, P ) {
    //e.preventDefault();

    let cur = t.$( '#cb-current' ).val()
      , idx = P.indexOf(`${cur}`)
      , pos = t.$( `#${cur}` ).offset();

    P.removeAt( idx );
    P.insert( idx, {
                      page_no:  t.page.get(),
                      id:       `${cur}`,
                      type:     'title',
                      text:             t.$(`#${cur}`).text().trim(),
                      top:              t.$(`#${cur}`).css('top'),
                      left:             t.$(`#${cur}`).css('left'),
                      zIndex:           t.$( `#${cur}` ).css('z-index'),
                      fontSize:         t.$( `#${cur}` ).css('font-size'),
                      border:           t.$( `#${cur}` ).css('border'),
                      fontWeight:       t.$( `#${cur}` ).css('font-weight'),
                      fontStyle:        t.$( `#${cur}` ).css('font-style'),
                      textDecoration:   t.$( `#${cur}` ).css('text-decoration'),
                      opacity:          t.$( `#${cur}` ).css('opacity')
                  });

    console.log( P.print() );
    return;
  }
//---------------------------------------------------------



/**********************************************************
 * TITLE-OPACITY  ::(INPUT)::
 *********************************************************/
  export function titleOpacityInput( e, t ) {
    e.preventDefault();

    let cur = t.$( '#cb-current' ).val()
      , id  = t.$( `#${cur}` ).data('pid')
      , top = t.$(e.currentTarget).val()
      , pg  = t.$( `#${cur}` ).data('page');

    t.$( `#${cur}` ).css( 'opacity', top );

    t.$( '#top' ).val( top );
    //P.update( { _id: id, "objects.page_no":pg },
    //          {$set:{"objects.$.opacity": op }});
  }
//---------------------------------------------------------



 /**********************************************************
 * TITLE-OPACITY  ::(MOUSEUP)::
 *********************************************************/
  export function titleOpacityMU( e, t, P ) {

    let cur = t.$( '#cb-current' ).val()
      , idx = P.indexOf(`${cur}`);

    P.removeAt( idx );
    P.insert( idx, {
                      page_no:  t.page.get(),
                      id:       `${cur}`,
                      type:     'title',
                      text:             t.$(`#${cur}`).text().trim(),
                      top:              t.$(`#${cur}`).css('top'),
                      left:             t.$(`#${cur}`).css('left'),
                      zIndex:           t.$( `#${cur}` ).css('z-index'),
                      fontSize:         t.$( `#${cur}` ).css('font-size'),
                      border:           t.$( `#${cur}` ).css('border'),
                      fontWeight:       t.$( `#${cur}` ).css('font-weight'),
                      fontStyle:        t.$( `#${cur}` ).css('font-style'),
                      textDecoration:   t.$( `#${cur}` ).css('text-decoration'),
                      opacity:          t.$( `#${cur}` ).css('opacity')
                  });

    console.log( P.print() );
    return;
  }
 //---------------------------------------------------------
