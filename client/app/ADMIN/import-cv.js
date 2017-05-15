/*
 * @module importCV
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

import { Companies }    from '../../../both/collections/api/companies.js';
import { Students }     from '../../../both/collections/api/students.js';

import '../../templates/admin/import-cv.html';



/*=======================================
 * CREATED
 *=======================================*/
Template.importCV.onCreated( function() {

  this.res = new ReactiveVar();

  $( "#csv-cover" ).show();

  Tracker.autorun( () => {
    Meteor.subscribe('companies');
    Meteor.subscribe('students');
  });

  /********************************************************
   * BOOTSTRAP-SELECT
   *******************************************************/
  $.getScript( '/bower_components/bootstrap-select/dist/js/bootstrap-select.min.js', function() {
    $( '.selectpicker' ).selectpicker({ style: "btn-new", title:"Choose One" });
    //console.log('importCSV:: bootstrap.min.js loaded...');
  }).fail( function(jqxhr, settings, exception ) {
    console.log( 'importCSV:: load bootstrap-select.min.js fail' );
//---------------------------------------------------------
  });


  /********************************************************
   * PAPA PARSE
   *******************************************************/
  $.getScript( '/js/papaparse.min.js', function() {
      //console.log('insertCSV:: papaparse.js loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'importCSV:: load papaparse.min.js fail' );
//---------------------------------------------------------
  });

});



/*=========================================================
 * RENDERED
 *=======================================================*/
Template.importCV.onRendered(function(){
  $( '#csv-cover' ).delay( 100 ).fadeOut( 'slow', function() {
    $( "#csv-cover" ).hide();
    $( ".import-body" ).fadeIn( 'slow' );
  });
//---------------------------------------------------------
});



/*=========================================================
 * DESTROYED
 *=======================================================*/
Template.importCV.onDestroyed(function(){
  console.log( 'in csv destroyed');//DEBUG

  results        = null;
//---------------------------------------------------------
});



/*=========================================================
 * HELPERS
 *=======================================================*/
Template.importCV.helpers({

  names: () => {
    try {
        let len, headers, obj = {};
        let foo = Template.instance().res.get();
        headers = foo[0];
        len     = headers.length;
        for ( let i = 0; i < len; i++ ) {
          obj[ 'col' + i ] = {};
          obj[ 'col' + i ] = headers[i];
        }
        return obj;
    } catch (e) {
      return;
    }
//---------------------------------------------------------
  },

  getRole: role => {
    const roles = ['admin', 'teacher', 'student'];
    if (roles.indexOf(role) === -1) {
      return 'student';
    }
    return role;
  },

  td: () => {

    try {
      let len, num, headers, records, obj = {};
      let foo = Template.instance().res.get();
      headers = foo[0];
      records = foo.slice(1);

      len = headers.length;
      num = records.length;
      for( let i = 0; i < num; i++ ) {
        obj[ 'row' + i ] = {};
        for( let j = 0; j < len; j++ ) {
          console.log(records[i][j]);
         obj[ 'row' + i ][ 'col' + j ] =  records[i][j];
        }
      }
    return obj;

    } catch (e) {
      return;
    }
//---------------------------------------------------------
  },


});


let tog = true;
/*=========================================================
 * EVENTS
 *=======================================================*/
Template.importCV.events({


  /********************************
   *
   * #DASHBOARD-PAGE  ::(CLICK)::
   *
   ********************************/
  'click #dashboard-page'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
//---------------------------------------------------------
  },



  /********************************************************
   * #STUDENTS-PAGE  ::(CLICK)::
   *******************************************************/
  'click #students-page'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-students', { _id: Meteor.userId() });
//---------------------------------------------------------
  },



  /********************************************************
   * #CSV-HELP-BUTTON ::(CLICK)::
   *******************************************************/
  'click #csv-help-btn'( e, t ) {
    e.preventDefault();

    $("#alerts").slideToggle();
    //$( '#cv-student-import-help' ).modal( 'show' );

//---------------------------------------------------------
  },



  /********************************************************
   * #CV-HELP-CLOSE
   *******************************************************/
   'click #cv-help-close'( e, t ) {

    //$( '#cv-student-import-help' ).modal('hide');
//---------------------------------------------------------
   },



  /********************************************************
   * #CSV  ::(CHANGE)::
   *******************************************************/
  'change #csv'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    let itype = ''
      , fil
      , raw_file;

    if ( e.currentTarget.files === 'undefined' ) {
      console.log('aborted');
      return;
    } else {
      raw_file = e.currentTarget.files[0]
    }

    //itype = raw_file.split(',');
   //console.log( itype );

    //itype = itype.name.slice( itype.name.length - 3);
  /*
    if ( raw_file.type != 'text/csv' || !itype ) {
      Bert.alert('Incompatible File Type: Must be CSV', 'danger');
      e.currentTarget.files = undefined;
      e.currentTarget.files[0] = undefined;
      e.currentTarget.files[0].name = undefined;
      itype = '';
      return;
    }
  */
  // text/plain, text/csv
    fil = $( '#csv' ).get(0).files[0];

    var fr = new FileReader();

    fr.onload = function(e) {
      let s, slen = s1 = m = 0;
      //console.log( e.target.result ); //typeof is String
      raw_file = e.target.result;

      s     = raw_file.split('\n');
      slen  = raw_file.split('\n').length -1;

      if ( slen == 0 ) {
        Bert.alert( "The format of data in the file is incorrect. Please click 'Toggle Help?' button to see the correct format of data.", 'danger');
        return;
      }

      for( let i = 0; i < slen; i++ ) {

        if ( i == 0 ) { //BASE CASE
          m = s[i].split(',').length - 1;
          s1 += m;
        } else {
          if ( s[i].split(',').length - 1 != m ) {
            Bert.alert( "The format of data in the file is incorrect. Please click 'Toggle Help?' button to see the correct format of data.", 'danger');
            s1 = 0;
            return;
          } else {
            s1 += s[i].split(',').length -1;
          }
        }
      }

    };

    fr.readAsText(fil);


    Meteor.setTimeout( function() {
        if ( s1 == 0 ) {
          Bert.alert( "The format of data in the file is incorrect. Please click 'Toggle Help?' button to see the correct format of data.", 'danger');
          return;
        }

        Papa.parse( raw_file, { //fil
          config: { header: true },
	        complete: function( results ) {
	          t.res.set( results.data );
	        },
	        error: function(err, file, inputElem, reason) {
	          console.log( err );
	          console.log( file );
	          console.log( inputElem );
	          console.log( reason );
	        }
        });//papa
    }, 200);
    raw_file = fil = fr = null;
    $( '#csv' ).val('');
    //$( '#csv' ).attr( 'disabled','disabled' );
    return;
//---------------------------------------------------------
  },



  /********************************************************
   * .JS-IMPORT-STUDENTS-FROM-CSV  ::(CLICK)::
   *******************************************************/
  'click .js-import-students-from-csv'(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    let
      num_props, num_recs, records, temp, pa, headers,
      studentObj = [],
      errStr = 'You must assign a mapping to all your fields.',
      p0 = $( '.selectpicker.p0 option:selected' ).val().trim(),
      p1 = $( '.selectpicker.p1 option:selected' ).val().trim(),
      p2 = $( '.selectpicker.p2 option:selected' ).val().trim(),
      p3 = $( '.selectpicker.p3 option:selected' ).val().trim(),
      p4 = $( '.selectpicker.p4 option:selected' ).val().trim(),
      c_id    = Meteor.user().profile.company_id
      company = Companies.findOne(c_id);

      const adminEmail = Meteor.user().emails[0].address;

    temp      = Template.instance().res.get();
    headers   = temp[0];
    num_props = headers.length;
    records   = temp.slice(1);
    num_recs  = records.length;

    if ( p0 == '' && num_props == 1 ) {
      Bert.alert( errStr, 'danger' );
      return;
    }
    if ( p1 == '' && num_props == 2 ) {
      Bert.alert( errStr, 'danger' );
      return;
    }
    if ( p2 == '' && num_props == 3 ) {
      Bert.alert( errStr, 'danger' );
      return;
    }
    if ( p3 == '' && num_props == 4 ) {
      Bert.alert( errStr, 'danger' );
      return;
    }
    if ( p4 == '' && num_props == 5 ) {
      Bert.alert( errStr, 'danger' );
      return;
    }

    pa = [ p0, p1, p2, p3, p4 ];

    // Making sure that no keys are duplicated
    if ((new Set(pa)).size !== pa.length) {
      Bert.alert( 'You can map each key to only one row.', 'danger' );
      return;
    }

    const emailIndex = pa.indexOf('e');
    let emailValid = true;

    records.forEach(record => {
      if (record[emailIndex] && !isValidEmail(record[emailIndex])) {
        emailValid = false;
      }
    });

    if (!emailValid) {
      Bert.alert('Email should be mapped to row which contains valid email addresses', 'danger');
      return;
    }

    for ( let i = 0; i < num_recs; i++ ) {
      studentObj[i] = {};
      for ( let j = 0; j < num_props; j++ ) {

        switch( pa[j] ) {
          case 'f':
            studentObj[i].fname = records[i][j];
            //console.log( records[i][j]);
            break;
          case 'l':
            studentObj[i].lname = records[i][j];
            //console.log( records[i][j]);
            break;
          case 'e':
            studentObj[i].email = records[i][j];
            //console.log( records[i][j]);
            break;
          case 'd':
            studentObj[i].departmentId = records[i][j];
            //console.log( records[i][j]);
            break;
          case 'c':
            studentObj[i].role = records[i][j] || 'student';
            //console.log( records[i][j]);
            break;
        }
      }
      const { fname, lname, email, role, departmentId } = studentObj[i];
      if (!fname || !lname || !email || !role || !departmentId) {
        // Bert.alert(`Failed to add ${(fname && lname) ? `${fname} ${lname}` : 'user'}`, 'danger', 'growl-top-right');
        continue;
      }

      Meteor.call('users.add', { ...studentObj[i], company }, (err, studentId) => {
        const admin = Meteor.user();
        if (err) {
          let errorMessage = 'Failed to add a user';
          if (err.reason === 'Username already exists.') {
            errorMessage += ` :user with ${email} email already exists`;
          }
          Bert.alert(errorMessage, 'danger', 'growl-top-right');
        } else {
          const { password } = Students.findOne(studentId);
          const videoLink = '';
          if (role === 'teacher' || role === 'student') {
            const text = `Hello ${fname},\n\nThis organization has set up its own Collective University to help provide training and more sharing of internal knowledge.  Your plan administrator will be providing more details in the coming days.\n\nTo login to your account and enroll in classes, please visit: ${Meteor.absoluteUrl()}login.\n\nUsername: ${email}\nPassword: ${password}\n\nFrom here you'll be able to enroll in courses, to request credit for off-site training and conferences, and keep track of all internal training meetings.\nIn Student Records, you'll see all the classes and certifications you have completed.${videoLink ? `For a more complete overview, please see this video: ${videoLink}` : ''}\n\nIf you have any questions, please contact: ${adminEmail}`;
            Meteor.call('sendEmail', email, admin.emails[0].address.adminEmail, 'New Account', text, err => {
              if (err) {
                Bert.alert(`Failed to send an email to ${fname} ${lname}`, 'danger');
              } else {
                Bert.alert('User seccessfully added', 'success');
                $('#addStudentModal').modal('hide');
              }
            });
            $('#cv-student-import-confirm').modal('show');
          } else if (role === 'admin') {
            Meteor.call('users.sendSignupVerificationEmail', studentId, err => {
              if (err) {
                Bert.alert(`Failed to send an email to ${fname} ${lname}`, 'danger');
              } else {
                Bert.alert('User seccessfully added', 'success');
                $('#addStudentModal').modal('hide');
              }
            });
            $('#cv-student-import-confirm').modal('show');
          } else {
            Bert.alert('Failed to send an email to new user', 'danger');
          }
        }
      });
    }
    // Meteor.setTimeout(() => $('#cv-student-import-confirm').modal('show'), 100);
  },


  /********************************************************
   * #CV-LEAVE-YES  ::(CLICK)::
   *******************************************************/
  'click #cv-leave-yes'( e, t ) {
    e.preventDefault();

    $( '#csv' ).attr( 'disabled', '' );
    t.res.set( null );

    $( "#cv-student-import-confirm" ).modal('hide');

        //NECESSARY DELAY OR DIALOG CAUSES DISPLAY ISSUES ON DESTINATION
    Meteor.setTimeout(function(){
      FlowRouter.go( 'admin-students', { _id: Meteor.userId() });
    }, 500);
//---------------------------------------------------------
  },

});

/****************************
 * RANDOM PASSWORD GENERATOR
 ***************************/
function generateRandomPassword() {
  let pw    = ''

      // ! # $ % & * + ? ~ @
    , punc  =  [33,35,36,37,38,42,43,63,64,126];


  do {
    //RETURN PUNC CHARACTER 20% OF THE TIME
    if (  Math.floor( (Math.random() * 100) + 1) <= 20  ) {
      let pran = Math.floor( (Math.random() * 9));		//0 - 9
      pw += String.fromCharCode(punc[pran]);
    } else {
      //80% OF THE TIME RETURN EITHER UPPER OR LOWER CASE LETTER
	    pw += returnRandomLetterAndCase();
    }
  } while ( pw.length != 8 ); //8 CHARACTER PASSWORDS RETURNED

  return pw;                  //RETURN CREATED PASSWORD
}

function returnRandomLetterAndCase() {
	let lran = Math.floor( (Math.random() * 25) ) + 97 	//LOWERCASE LETTER
	  , uran = Math.floor( (Math.random() * 25) ) + 65	//UPPERCASE LETTER
	  , l = '';

	if ( Math.floor( (Math.random() * 100) + 1) <= 51  ) {
		l = String.fromCharCode(lran);
	} else if ( Math.floor(  (Math.random() * 100) + 1) > 52 ) {
		l = String.fromCharCode(uran);
	}
	return l;
}

function isValidEmail(email) {
  if (typeof email === 'string') {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  return false;
}
//-----------------END RANDOM PASSWORD GENERATOR-----------
