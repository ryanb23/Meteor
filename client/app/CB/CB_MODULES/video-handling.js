/*
 * @module videoHandling
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */

import embed from 'embed-video';

  /**
   * RESET
   */
  export function cbVideoReset() {

  }



 /**
   *
   * #ADDED-VIDEO  ::(CHANGE)::
   *
   */
  export function addedVideoURL( e, t, page_no, P, master_num ) {
    e.preventDefault();

    if ( e.currentTarget.id == 'intro-modal' ) return;

    let vid   = t.$( '#added-video' ).val()
      , url;
    
    if ( vid.indexOf('embed') != -1 ) {
      Bert.alert('Please use the actual video URL, NOT an embed url', 'danger');
      return;
    } else
        if ( vid.indexOf('<iframe') != -1 ) {
          Bert.alert('Please use the actual video URL, NOT an embed code', 'danger' );
          return;
    } else
        if ( vid.indexOf('youtube') != -1 ) {
      url = embed( vid );
      if ( url == undefined ) {
        Bert.alert('Please paste in a valid Youtube or Vimeo URL', 'danger');
        return;
      } 
      let u = $(url);
      u.attr('id', `vid-${master_num}`);
      u.attr('width', "854");
      u.attr('height', "480");
      url = u[0].outerHTML;
    } else
        if ( vid.indexOf('vimeo') ) {
      url = embed( vid );
      if ( url == undefined ) {
        Bert.alert('Please paste in a valid Youtube or Vimeo URL', 'danger');
        return;
      }
      let u = $(url);
      u.attr('id', `vid-${master_num}`);
      u.attr('width', "854");
      u.attr('height', "363");
      url = u[0].outerHTML;
    } else {
      Bert.alert('Please enter a Youtube or Vimeo video url', 'danger');
      return;
    }
/*    
    if ( isYoutube ) {
      url = `<iframe  id="vid-${master_num}"
                      width="854"
                      height="480" 
                      src="https://www.youtube.com/embed/${conv}" 
                      frameborder="0" 
                      allowfullscreen>
            </iframe>`;
    } else if ( isVimeo ) {
      url = `<div style="margin:auto;width:50%;display:block;">
                <iframe  id="vid-${master_num}"
                      src="https://player.vimeo.com/video/${conv}?title=0&byline=0&portrait=0&badge=0" 
                      width="854"
                      height="363"
                      frameborder="0" 
                      webkitallowfullscreen 
                      mozallowfullscreen 
                      allowfullscreen>
                </iframe>
              </div>`
    }
*/
    t.$( '#added-video' ).remove();

    Bert.alert('Loading video...', 'success' );
    
    //add to the canvas
    t.$( '#fb-template' ).html( url );
    
    P.append({
              page_no:  page_no,
              type:     'video',
              id:       `vid-${master_num}`,
              url:      url.trim()
    });
    
P.print();
/*   
    P.update( { _id: my_id },
              { $push: 
                {
                  objects: 
                    {
                      page_no:  page_no,
                      id:       `vid-${master_num}`,
                      type:     'video',
                      url:      url
                    }
                }
              });
*/
    $( '#cb-title-toolbar' ).hide();
    $( '#cb-text-toolbar'  ).hide();
    $( '#cb-media-toolbar' ).hide();
    
    $( '#cb-video-toolbar' ).show();
    t.$( '#cb-current' ).val( `vid-${master_num}` );
    


//-----------------------------------------------------------------------------
}
