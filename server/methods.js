/*
 * @module methods
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import { Meteor } from 'meteor/meteor';

const fs      = require('fs');
const path    = require('path');

import { Students }     from '../both/collections/api/students.js';
import { Newsfeeds }    from '../both/collections/api/newsfeeds.js';
import { Comments }     from '../both/collections/api/comments.js';
import { Companies }    from '../both/collections/api/companies.js';
import { BuiltCourses } from '../both/collections/api/built-courses.js';
import { Events }       from '../both/collections/api/events.js';
import { Scorms }       from '../both/collections/api/scorms.js';
import { Courses }      from '../both/collections/api/courses.js';


Meteor.methods({
  
   /*
   * CREATE USER
   * POST http://scorm.academy-smart.org.ua/users/createUser
   * {"user":"<username>","pass":"<password>","comapny_id"":"numeric comapny id"}
   *                                                                      XXX
   */
  'scormCreateUser': function( user, pass, company_id ) {
    HTTP.post( 'http://scorm.academy-smart.org.ua/users/createUser',
                {
                  data: {
                    "user": `${user}`, "pass": `${pass}`, "company_id": `${company_id}`
                  }
                },
                function( error, response ) {
                  if( error ) {
                   console.log( error );
                  } else {
                    console.log('-------------------------------------------------------------------');
                    console.log( 'RESPONSE:');
                    console.log( response );
                    console.log('-------------------------------------------------------------------');
                    console.log( 'RESPONSE.DATA:');
                    console.log( response.data );
                    console.log('-------------------------------------------------------------------');
                  }
    });
  },
  
  
  /*
   * UPLOAD COURSE
   *    POST http://scorm.academy-smart.org.ua/player/uploadCourse
   *      {"comapny_id"":"numeric comapny id"}
   * AND set multipart/mixed content
   * AND attach files
   */
  'scormUploadCourse': function( company_id ) {
    
   //200413
      let stats = fs.statSync("/home/ubuntu/workspace/NewQuizScorm.zip")
        , fileSizeInBytes = stats["size"];
        
      console.log( fileSizeInBytes );
      /*
      rest.post('http://scorm.academy-smart.org.ua/player/uploadCourse', {
        multipart: true,
        data: {
          'company_id': `${company_id}`,
          'file': rest.file( '/home/ubuntu/workspace/NewQuizScorm.zip',
                              null,
                              fileSizeInBytes,
                              null,
                              'application/zip') 
        }
      }).on('complete', function(data){
        console.log( data );
      })
      */
          //fs.createReadStream( '/home/ubuntu/workspace/NewQuizScorm.zip' );
      
      //'http://scorm.academy-smart.org.ua/player/uploadCourse'
      
      /*
      .end( ( response ) => {
  
          console.log( '-------------------------------------------');
          //fs.writeFile('/home/ubuntu/workspace/log.txt', JSON.stringify(res), (err) => {
            //if (err) throw err;
            //console.log('saved.');
          //})
        
          console.dir( response.headers );
          console.dir( response.body    );
          console.log( '--------------------------------------------');
      });
      */
  },
  
 
   /*
   * DELETE COURSE
   * DELETE http://scorm.academy-smart.org.ua/player/deleteCourse
   * body
   * {"company_id":"<your_company>"  "course_id":"<existing course>"}
   */
   'scormDeleteCourse': function( company_id, course ) {
     HTTP.delete( 'http://scorm.academy-smart.org.ua/player/deleteCourse',
                  {
                    data: {
                      "company_id": `${company_id}`, "course_id": `${course}k`
                    }
                  },
                  function( error, response ){
                    if( error ){
                      console.log( error );
                    } else {
                     console.log('-------------------------------------------------------------------');
                     console.log( 'RESPONSE:');
                     console.log( response );
                     console.log('-------------------------------------------------------------------');
                     console.log( 'RESPONSE.DATA:');
                     console.log( response.data );
                     console.log('-------------------------------------------------------------------');
                    }
    });
   },
 
  
  /*
   * get URL of  course for student (requires username pass  and course_id)
   *    http://scorm.academy-smart.org.ua/player/get
   *      POST BODY
   *        { “user”: "demo_user", “pass”: "1", “course”: "1" } 
   *      RETURNS full url to play a course
   *
   * RESPONSE.DATA:
   *                { action: 'success',
   *                  url: 'http://scorm.academy-smart.org.ua/player/play/4f3b1479e562886f2cdc361faeebe399' }
   * RESPONSE.DATA:
   *                { action: 'success',
   *                  url: 'http://scorm.academy-smart.org.ua/player/play/77f5f5f7fa13850ad5bf36aab77a3a83' }
   *                  
   *  USER: *NAME*, PASS: 'unencrypted', COURSE: NUMERIC                  XXX
   */
   'scormGetCoursePlayURL': function( user, pass, course ) {
     try{
      let resp = HTTP.post( 'http://scorm.academy-smart.org.ua/player/get',
                  {
                    data: {
                      "user": `${user}`, "pass": `${pass}`, "course": `${course}`
                    }
                  });
      return resp.data.url;      
     } catch(e) {
       
       return e.reason;
       
     }
     
                /* ASYNC
                ,function( error, response ){
                  if( error ){
                    console.log( error );
                  } else {
                   console.log( '------------------------------------------------------------------')
                   console.log( 'RESPONSE.HEADERS');
                   console.log( response.headers );
                   console.log('-------------------------------------------------------------------');
                   console.log( 'RESPONSE.CODE:');
                   console.log( response.code );
                   console.log('-------------------------------------------------------------------');
                   console.log( 'RESPONSE.CONTENT');
                   console.log( response.content );
                   console.log( '------------------------------------------------------------------')
                   console.log( 'RESPONSE.DATA:');
                   console.log( response.data );
                   console.log('-------------------------------------------------------------------');
                   console.log( 'RESPONSE.DATA.URL');
                   console.log( response.data.url );
                   console.log( '------------------------------------------------------------------');
                   //return response.data.url;
                  }
                  
    });
    */
   },
   
   
   
  /*
   * GET STATUS OF COURSE
   * GET http://scorm.academy-smart.org.ua/player/courseStatus/<company_id>/<user_id>   xxx
   */
   'scormStudentCourseStatus': function( company_id, user_id, course_id ) {
     HTTP.get( `http://scorm.academy-smart.org.ua/player/courseStatus/${company_id}/${user_id}/${course_id}`,
                {},
                function( error, response ){
                  if( error ){
                    console.log( error );
                  } else {
                   console.log('-------------------------------------------------------------------');
                   console.log( 'RESPONSE:');
                   console.log( response );
                   console.log('-------------------------------------------------------------------');
                   console.log( 'RESPONSE.DATA:');
                   console.log( response.data );
                   console.log('-------------------------------------------------------------------');
                  }
    });
   },
   
   
  /*
   * NO INPUTS OUTPUT - ALL LOADED COURSES
   * GET http://scorm.academy-smart.org.ua/player/listAllCourses          xxx
   */
   'scormListAllCourses': function() {
     HTTP.get( 'http://scorm.academy-smart.org.ua/player/listAllCourses',
                {},
                function( error, response ){
                  if( error ) {
                    console.log(error);
                  } else {
                   console.log('-------------------------------------------------------------------');
                   console.log( 'RESPONSE:');
                   console.log( response );
                   console.log('-------------------------------------------------------------------');
                   console.log( 'RESPONSE.DATA:');
                   console.log( response.data );
                   console.log('-------------------------------------------------------------------');
                  }
    });
   },
   
   

  /*
   * - LIST ALL STARTED COURSES BY USER
   * GET http://scorm.academy-smart.org.ua/player/coursesStarted/<company_id>/<user_id>
   *                                                                              XXX
   */
   'scormListStudentStartedCourses': function( company_id, user_id ) {
     HTTP.get( `http://scorm.academy-smart.org.ua/player/coursesStarted/${company_id}/${user_id}`,
                {},
                function( error, response ){
                  if( error ){
                    console.log( error );
                  } else {
                   console.log('-------------------------------------------------------------------');
                   console.log( 'RESPONSE:');
                   console.log( response );
                   console.log('-------------------------------------------------------------------');
                   console.log( 'RESPONSE.STATUS CODE');
                   console.log( response.statusCode );
                   console.log( '------------------------------------------------------------------');
                   console.log( 'RESPONSE.CONTENT');
                   console.log( response.content );
                   console.log( '------------------------------------------------------------------');
                   console.log( 'RESPONSE.DATA:');
                   console.log( response.data );
                   console.log('-------------------------------------------------------------------');
                  }
    });
   },
   
   
  /*
   * LIST ALL COMPLETED COURSES BY USER
   * GET http://scorm.academy-smart.org.ua/player/coursesCompleted/<company_id>/<user_id>
   *                                                                              XXX
   */
   'scormListStudentCompletedCourses': function( company_id, user_id ) {
     HTTP.get( `http://scorm.academy-smart.org.ua/player/coursesCompleted/${company_id}/${user_id}`,
                {},
                function( error, response ){
                  if( error ) {
                    console.log( error );
                  } else {
                   console.log('-------------------------------------------------------------------');
                   console.log( 'RESPONSE:');
                   console.log( response );
                   console.log('-------------------------------------------------------------------');
                   console.log( 'RESPONSE.DATA:');
                   console.log( response.data );
                   console.log('-------------------------------------------------------------------');
                  }
    });
   },
   
   
  /*
   * LIST ALL COURSES BY COMPANY
   * GET http://scorm.academy-smart.org.ua/player/listCompanyCourses/<company_id>
   *                                                                        XXX
   */
   'scormListCompanyCourses': function( company_id ) {
     HTTP.get( `http://scorm.academy-smart.org.ua/player/listCompanyCourses/${company_id}`,
                {},
                function( error, response ){
                  if( error ) {
                    console.log(error);
                  } else {
                   console.log('-------------------------------------------------------------------');
                   console.log( 'RESPONSE:');
                   console.log( response );
                   console.log('-------------------------------------------------------------------');
                   console.log( 'RESPONSE.DATA:');
                   console.log( response.data );
                   console.log('-------------------------------------------------------------------');
                  }
    });
   },
   
   
  /*
   * LIST ALL COURSES BY USER (COMPLETED/CURRENT)
   * GET http://scorm.academy-smart.org.ua/player/listStudentCourses/<company_id>/<user_id>
   *                                                                          XXX
   */
   'scormListUserCourses': function( company_id, user_id ) {
     HTTP.get( `http://scorm.academy-smart.org.ua/player/listStudentCourses/${company_id}/${user_id}`,
                {},
                function( error, response ){
                  if( error ){
                    console.log( error );
                  } else {
                    console.log('-------------------------------------------------------------------');
                    console.log( 'RESPONSE:');
                    console.log( response );
                    console.log('-------------------------------------------------------------------');
                    console.log( 'RESPONSE.DATA:');
                    console.log( response.data );
                    console.log('-------------------------------------------------------------------');
                  }
      });
   },
   
   
  /*
   * SCORM METRIC OF STUDENT OF SPECIFIED COURSE
   * GET http://scorm.academy-smart.org.ua/player/courseMetric/<company_id>/<user_id>/<course_id>/<scorm metric>
   * 
   */
   'scormStudentMetric': function( company_id, user_id, course_id, scorm_metric ) {
     HTTP.get( `http://scorm.academy-smart.org.ua/player/courseMetric/${company_id}/${user_id}/${course_id}/${scorm_metric}`,
                {},
                function( error, response ){
                  if ( error ){
                    console.log( error );
                  } else {
                    console.log('-------------------------------------------------------------------');
                    console.log( 'RESPONSE:');
                    console.log( response );
                    console.log('-------------------------------------------------------------------');
                    console.log( 'RESPONSE.DATA:');
                    console.log( response.data );
                    console.log('-------------------------------------------------------------------');
                  }
    });
   },
   
  
  
  'upsertCompany': function( company_id, freq, req_cred ) {

    return Companies.update(  { _id: company_id }, 
                              { $set:
                                { 
                                  required_credits: req_cred, 
                                  frequency: freq 
                                } 
                              }
                           );    
  },
//-----------------------------------------------------------------------------


  'upsertCredits': function( company_id, cr ) {
    
    return Students.upsert( { company_id: company_id }, 
                            { $set:
                              { 
                                required_credits: cr
                              }
                            }, 
                            { multi: true }
                          );
  },
//-----------------------------------------------------------------------------


  'insertCompanyReturnId': function( name, backgroundColor ) {
    
    return Companies.insert( { 
                                name:             name, 
                                backgroundColor:  backgroundColor, 
                                logo:   "data:image/png;base64,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"           
                              } 
                           );
  },
 //-----------------------------------------------------------------------------


  'saveBuiltCourse': function( 
                               cname, /* course name    */
                               c_id,  /* company_id     */
                               role,  /* role of author */
                               credits,
                               keywords,
                               passing_percent,
                               icon,
                               pages, /* object containing course */
                               uname
                              ) 
  {
    check( cname,           String );
    check( c_id,            String );
    check( role,            String );
    check( credits,         Number );
    check( keywords,        [String] );
    check( passing_percent, Number );
    check( icon,            String );
    check( pages,           [Object] );
    check( uname,           String );
    
     Newsfeeds.insert({
                 owner_id:        Meteor.userId(),
                  poster:         uname,
                  poster_avatar:  Meteor.user().profile.avatar,
                  type:           "new-course",
                  private:        false,
                  news:           `A New Course has been added: ${cname}`,
                  comment_limit:  3,
                  company_id:     c_id,
                  likes:          0,
                  date:           new Date()       
    });   
    
    return BuiltCourses.insert({
                  cname:            cname,
                  company_id:       c_id,
                  creator_type:     role,
                  credits:          credits,
                  keywords:         keywords,
                  passing_percent:  passing_percent,
                  icon:             icon,
                  pages:            pages,
                  created_at:       new Date()
    });
  },
//-----------------------------------------------------------------------------
  
 
  'saveBuiltCoursePdf': function( id, data, page ) {
    
    BuiltCourses.update(  { _id: id }, 
                          { $addToSet:
                            { pages:
                              { 
                                page:page, 
                                pdf: data 
                              }
                            }
                          }
                       );
  },
//-----------------------------------------------------------------------------


  'saveBuiltCourseImage': function( id, data, page ) {
    
    BuiltCourses.update(  { _id: id }, 
                          { $addToSet:
                            { pages:
                              { 
                                page:   page, 
                                image:  data 
                              }
                            }
                          }
                       );
  },
//-----------------------------------------------------------------------------


  'saveCompanyLogo': function( id, data ) {
    
    Companies.update( { _id: id }, 
                      { $set:
                        { 
                          logo: data 
                        } 
                      }
                    );
  },
//-----------------------------------------------------------------------------


  
  'saveCompanyColor'( id, data ) {
    
    Companies.update( { _id: id }, 
                      { $set:
                        { 
                          backgroundColor: data 
                        } 
                      }
                    );
  },
//-----------------------------------------------------------------------------


  'updateProfilePic': function( data ) {

    Newsfeeds.update( { owner_id: Meteor.userId() },
                      { $set:
                        {
                          poster_avatar: data
                        } 
                      }, 
                      { multi: true }
                    );
                     
    Comments.update(  { poster_id: Meteor.userId() },
                      { $set:
                        {
                          poster_avatar: data 
                        } 
                      }, 
                      { multi: true } 
                   );
                    
    Meteor.users.update(  { _id: Meteor.userId()},
                          { $set:
                            {
                              'profile.avatar': data
                            } 
                          }
                       );
                        
    Students.update(  { _id: Meteor.userId() },
                      { $set:
                        {
                          avatar: data
                        }
                      }
                   );
  },
//-----------------------------------------------------------------------------


  'changeNewsfeedAuthorName': function( id, p ) {
    Newsfeeds.update( { _id: id }, 
                      { $set:
                        { 
                          poster: p 
                        } 
                      },
                      { multi: true }
                    );
  },
//-----------------------------------------------------------------------------


  'changeCommentsAuthorName': function( id, p ) {
    Comments.update(  { _id: id },
                      { $set:
                        { 
                          poster_name: p 
                        } 
                      },
                      { multi: true }
                   );
  },
//-----------------------------------------------------------------------------


  'sendEmail': function (to, from, subject, text) {
    check( [ to, from, subject, text ], [String] );
    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.

    this.unblock();
    Email.send({
      to:       to,
      from:     from,
      subject:  subject,
      text:     text
    });
  },
//-----------------------------------------------------------------------------

  'sendEmailWithAttachment': function ( to, from, subject, text, attachment ) {

    this.unblock();
    
    try {
      Email.send({
        to: to,
        from: from,
        subject: subject,
        text: text,
        attachments: [attachment]
      });
    } catch(e) {
      throw new Meteor.Error( '500', `${ e }` ); 
    }
  },
//-----------------------------------------------------------------------------  
  

  'addUser': function(  email, 
                        password, 
                        fname, 
                        lname, 
                        opt, 
                        dept, 
                        company, 
                        company_id, 
                        trial=false ) 
  {
    let startTrial  = '';
    let uid = Accounts.createUser({
      email:    email,
      password: password,
      roles: {
        [opt]: true
      },
      username: email,
      profile:{
        avatar:     "data:image/png;base64,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",
        company_id: company_id
      }
    });
    
    if ( trial ) {
      startTrial = new Date;
    }
    
    Students.insert({ 
      
      _id:                uid,
      avatar:             "data:image/png;base64,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",
      fname:              fname,
      lname:              lname,
      fullName:           fname + ' ' + lname,
      email:              email,
      uname:              email,
      department:         dept,
      company:            company,
      company_id:         company_id,
      role:               opt,
      current_credits:    0,
      required_credits:   0,
      compl_courses_cnt:  0,
      degrees:            [],
      certifications:     [],
      courses_completed:  [],
      current_courses:    [],
      password:           "",
      current_trainings:  [],
      compl_trainings:    [],
      articles_read:      [],
      trialStarted:       startTrial,
      created_at:         new Date() 
      
    });
  },
//-----------------------------------------------------------------------------


  /*
   * ADD AN EVENT
   *
   * @method  addEvent( e )
   *
   * CALENDARING
   */
  addEvent( event ) {
    check( event, {
      title:        String,
      start:        String,
      end:          String,
      students:     [String],
      location:     String,
      description:  String,
      summary:      String,
      startTime:    String,
      endTime:      String,
      timezone:     String,
      teacher:      String
    });

    try {
      
      /* USE METEOR.defer || applicable to send notification email */
      return Events.insert( event );
    } catch ( exception ) {
      throw new Meteor.Error( '500', `${ exception }` );
    }
  },
//-----------------------------------------------------------------------------


  /*
   * EDIT AN EVENT
   *
   * @method  editEvent( e )
   *
   * CALENDARING
   */
  editEvent( event ) {
    check( event, {
      _id:          String,
      title:        Match.Optional( String ),
      start:        String,
      end:          String,
      students:     Match.Optional( [String] ),
      location:     String,
      description:  String,
      summary:      String,
      startTime:    String,
      endTime:      String,
      timezone:     String,
      teacher:      String
      //courses: Match.Optional( [String] )
    });
    
    try {
      return Events.update( event._id, {
        $set: event
      });
      
    } catch ( exception ) {
      
      throw new Meteor.Error( '500', `${ exception }` );
    }
  },
//-----------------------------------------------------------------------------


  /*
   * DELETE AN EVENT
   *
   * @method  removeEvent( e )
   *
   * CALENDARING
   */
  removeEvent( event ) {
    check( event, String );

    try {
      // GET ALL STUDENTS ADDED TO THIS EVENT
      let s  = Students.find( { current_trainings:{ $elemMatch: {link_id: event }}} ).fetch();

      // DELETE EACH
      for( let i=0, len = s.length; i < len; i++ ) {

        Students.update({ _id: s[i]._id }, { $pull: {current_trainings:{link_id: event }} });
      }
      
      // DELETE THE EVENT
      return Events.remove( event );
      
    } catch ( exception ) {
      
      throw new Meteor.Error( '500', `${ exception }` );
    }
  },
  
  
  /*
   * CURATED ARTICLE STUDENT UPDATE
   */
  curatedArticleStudentUpdate( linkText, linkId ) {
    
    Students.update({ _id: Meteor.userId() }, 
                    { 
                      $inc:{ current_credits: 1 }, 
                      $addToSet:{ articles_read: { name: linkText, link_id: linkId } }
                    });
  },
  
  
  /*
   * UPDATE (STUDENT) CURRENT COURSES
   */
  updateCurrentCourses( cid ) {

    Students.update({ _id: Meteor.userId() },
                    { 
                      $push:{current_courses: {link_id: cid } }
                    });
  },
  
  
  /*
   * COURSE COMPLETION (STUDENT) UPDATE
   */
  courseCompletionUpdate( name, cid, percent, credits ) {
  
    Students.update({ _id: Meteor.userId() },
                    { 
                      $pull:{ current_courses:{ link_id: cid }},
                      $push:{ courses_completed: { name: name, link_id: cid, passing_percent: percent, credits: credits, date_completed: new Date() }},
                      $inc:{ current_credits: Number(credits), compl_courses_cnt: 1 }
                    });
                    
    Courses.update( { _id: cid },
                    {
                      $inc:{ times_completed: 1 }
                    });
  },

  /*
   * CONVERT PPT/PPTX TO PDF
   */
  convertPPToPdf( fil ) {
    console.log( 'in mm' );
    const fs        = require('fs');
    const { spawn } = require('child_process');
    
    try {
      fs.writeFile('/home/ubuntu/workspace/public/fil.pptx', fil, function(err) {
        if ( err ) {
          return console.log( err );
        } else {
          //console.time('unoconv');
          const uno = spawn('./unoconv', [ '-f','pdf','/home/ubuntu/workspace/public/fil.pptx' ], {
            cwd: process.env.HOME + '/workspace',
            //env: Object.assign({}, process.env, { PATH: process.env.PATH + ':/usr/local/bin' })
          });
        
          uno.on( 'close', (code) => {
            console.log('----------------------------------------------------');
            console.log( `child process exited with code ${code}` );
            console.log('----------------------------------------------------');
          });
          //console.timeEnd('unoconv');
        }//else
      });
    } catch( e ) {
      throw new Meteor.Error( '500', `${ exception }` );
    }
  },
  
});