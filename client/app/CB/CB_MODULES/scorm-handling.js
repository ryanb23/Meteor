/*
 * @module scormHandling
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */


/*
-------------------------------------------------------------------------------
id  username   password                                                role   created               modified              user_code                         company_id
1   demo_user  $2y$10$MNzBYyPiAgX80IR.lVXRvOU2mPlVNaxf18TTO3XZW0E...   user   2015-12-14 13:32:29   2015-12-14 13:32:29   68ac728a3a9686020674a6e614e2d7e3   1
2   test1      $2y$10$GEPVbK5xdT8dH63sE0TSjuyMlvKqhJW/9WfkTc6XVY0...   user   2016-11-08 09:01:55   2016-11-08 09:01:55   27602a628fee319bb0e76048632e3829   1
3   test2      $2y$10$Tt0Av0CzcBzG2LSoY1SxDuAXa5AwGQwmMEj3ZQOSPee...   user   2016-11-08 12:08:53   2016-11-08 12:08:53   71a642224b43ea9dead9eec3041c0254   1
4   12345      $2y$10$idG9ll2uwS08MCrVQmUSIOoc6Tpbro/6V.oqf47FFFv...   user   2016-11-10 17:21:56   2016-11-10 17:21:56   6933c96e2cbb2050352b6e85292c80c9   0

so you can use  68ac728a3a9686020674a6e614e2d7e3 as user for every call except user creation and get url to course
demo_user has pasword 1

GET http://scorm.academy-smart.org.ua/player/courseStatus/<company_id>/<user_id>/course_id
so you need call something like this

http://scorm.academy-smart.org.ua/player/courseStatus/1/68ac728a3a9686020674a6e614e2d7e3/1
would be status of course 1 of demo_user

most of courses have company_id:1 some of them 123 and 99

http://scorm.academy-smart.org.ua/player/courseStatus/company_id/user_id/course_id

it should be
http://scorm.academy-smart.org.ua/player/listStudentCourses/company_id/user_id
--------------------------------------------------------------------------------------------------------------------------------
*/

  /**
   *
   * #CB-SCORM-SAVE  ::(CLICK)::
   *
   * id = add-scorm
   * scorm dialog
   */
  export function cbScormSave( e, t, tbo, contentTracker ) {
    e.preventDefault();

    return;
    
//-----------------------------------------------------------------------------
  }
  
  /*
   *
   * CB-SCORM-CHANGE
   *
   */
  export function cbScormChange( e, t, contentTracker ) {
    e.preventDefault();
    
    if ( e.currentTarget.files === 'undefined' ) {
      console.log('aborted');
      return;
    }

    let itype = e.currentTarget.files[0].type
      , name  = e.currentTarget.files[0].name
      , ext   = name.slice(name.lastIndexOf('.'));
    
    if ( itype != 'application/zip' || ext != '.zip' ) {
      Bert.alert( 'Incompatible File Format: must be a zipped SCORM file', 'danger' );

      e.currentTarget.files         = undefined;
      e.currentTarget.files[0]      = undefined;
      e.currentTarget.files[0].name = undefined;
      itype = '';
      name  = '';
      ext   = '';
      $('#course-builder-scorm').val('')
      return;
    }
  }