/*
 * @module adminStudents
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

import '../../../public/css/select2.min.css';

import { Students }     from '../../../both/collections/api/students.js';
import { Newsfeeds }    from '../../../both/collections/api/newsfeeds.js';
import { Comments }     from '../../../both/collections/api/comments.js';
import { Departments }  from '../../../both/collections/api/departments.js';
import { Companies }    from '../../../both/collections/api/companies.js';

import '../../templates/admin/admin-students.html';


/*=========================================================
 * CREATED
 *=======================================================*/
Template.adminStudents.onCreated( function() {

  //$("#students-cover").show();

  Tracker.autorun( () => { 
    Meteor.subscribe('students');
    Meteor.subscribe('newsfeeds');
    Meteor.subscribe('comments');
    Meteor.subscribe('departments');
    Meteor.subscribe('companies');
  });
  
  /********************
   * BOOTSTRAP3-DIALOG
   *******************/
  $.getScript( '/bower_components/bootstrap3-dialog/dist/js/bootstrap-dialog.min.js', function() {
      //console.log('student:: bootstrap-dialog loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'student:: load bootstrap-dialog.min.js fail' );
    //console.log( 'jqxhr ' + jqxhr );
    //console.log( 'settings ' + settings );
    //console.log( 'exception: ' + exception );
  });
//---------------------------------------------------------


  /********************************************************
   * SELECT2
  ********************************************************/
  $.getScript( '/js/select2.min.js', function() {
    $( document ).ready(function(){
      
      $( '#search-students' ).select2({
        placeholder: "Search students",
        allowClear: true,
        multiple: false,
        tags:false
      });
      
      $( '.js-dept' ).select2({
        placeholder: "Department",
        allowClear: true,
        multiple: false,
        tags:true,
        //maximumSelectionLength: 2,

      });

      $( '.js-role' ).select2({
        placeholder: "User class",
        allowClear: true,
        multiple: false,
        tags:false
      });

    });
    //console.log('students:: chosen,jquery.min.js loaded...');
  }).fail( function(jqxhr, settings, exception ) {
    console.log( 'students:: load select2.js fail' );
    //console.log( 'jqxhr ' + jqxhr );
    //console.log( 'settings ' + settings );
    //console.log( 'exception: ' + exception );
  });
//--------------------------------------------------------- 
});



/**********************************************************
 * RENDERED
 *********************************************************/
Template.adminStudents.onRendered( function() {
/*
  $( '#students-cover' ).delay( 100 ).fadeOut( 'slow', function() {
    $("#students-cover").hide();
    $( ".filter-buttons" ).fadeIn( 'slow' );
  });
*/
//---------------------------------------------------------
});



/*=========================================================
 * HELPERS
 *=======================================================*/
Template.adminStudents.helpers({

  students() {
    try {
      let s   = Students.find({ company_id: Meteor.user().profile.company_id }).fetch();
      let len = s.length;
      for( let i=0; i<len; i++ ) {
        s[i].created_at = moment( s[i].created_at ).format( 'M-D-Y' ) //modify array in place
      }
  
      return s;
    } catch(e) {
      return;
    }
  },
//---------------------------------------------------------

  departments() {
    try {
      return Departments.find({ company_id: Meteor.user().profile.company_id }).fetch();
    } catch(e) {
      return;
    }
  },
//---------------------------------------------------------
});



/*=========================================================
 * EVENTS
 *=======================================================*/
Template.adminStudents.events({

  /********************************************************
   * #SEARCH-STUDENTS  ::(CHANGE)::
   *******************************************************/
  'change #search-students'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    let idx = $( e.currentTarget ).val();
    if ( idx ) {
      $( 'tr' ).css( 'border', '' );
      $( 'tr#' + idx ).css( 'border', '1px solid' );
      $( 'html, body' ).animate({
        scrollTop: $( 'tr#' + $( e.currentTarget ).val() ).offset().top + 'px'
      }, 'fast' );
    }
//-------------------------------------------------------------------
  },


  /********************************************************
   * #CLOSE-SEARCH  ::(CLICK)::
   *******************************************************/
  'click #close-search'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    $( '#search-students' ).val('');
//-------------------------------------------------------------------
  },



  /********************************************************
   * .JS-STUDENT  ::(CLICK)::
   *******************************************************/
  'click .js-student'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    if ( Meteor.userId() == $( e.currentTarget ).data( 'id' ) ) return;

    FlowRouter.go( 'student-record', { _id: $(e.currentTarget).data('id') });

    //$(e.currentTarget).data('id'));
    //console.log( Template.instance().view.parentView );
    //console.log( Template.adminStudentsBase );
//-------------------------------------------------------------------
  },


  /********************************************************
   * .JS-IMPORT-STUDENTS-CSV  ::(CLICK)::
   *******************************************************/
  'click .js-import-students-csv'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-import-csv', { _id: Meteor.userId() });
//-------------------------------------------------------------------
  },


  /********************************************************
   * .JS-ADD-STUDENT  ::(CLICK)::
   *******************************************************/
  'click .js-add-student'( e, t ) {
    e.preventDefault();

    //DEPT MUST HAVE A VALUE
/*
    let dpt = Departments.find({}).fetch();

    //clear created by code options
    $( '.js-dept option' ).each(function(){
      $(this).remove();
    });

    Meteor.setTimeout(function(){

      $( '.js-dept' ).append( '<option></option>' );
      
      for( let i = 0, l = dpt.length; i < l; i++ ){
        if ( dpt[i].name != '')
          $( '.js-dept' ).append( `<option value="${dpt[i]._id}">` +
                                  `${dpt[i].name}</option>` 
                              );
      }
    }, 500);
*/
//---------------------------------------------------------
  },


  /********************************************************
   * .JS-STUDENT-ADD-SUBMIT  ::(CLICK)::
   *******************************************************/
  'click .js-add-student-submit'( e, t ) {
      e.preventDefault();
      e.stopImmediatePropagation();

      //DEPT MUST HAVE A VALUE
      //option value
      //console.log( t.$('.js-dept').val() );

      //INSERT ADDED DEPT TO DEPT DB if it doesn't exist
/*
      let foo
        , opt_dpt_id = t.$('.js-dept option:selected').val()
        , opt_dpt_nm = t.$('.js-dept option:selected').text().toLowerCase();

      try {
        if ( opt_dpt_id != null && opt_dpt_id != '' )
          foo = Departments.findOne({ _id: opt_dpt_id })._id;
      } catch( e ) {
        if ( opt_dpt_id != null && opt_dpt_id != '' )
          foo = Departments.insert({ company_id: Meteor.user().profile.company_id, name: opt_dpt_nm });
      }
*/

      let co = Companies.findOne({ _id: Meteor.user().profile.company_id });

      let fname     = $( '.js-fn' ).val().trim();
      let lname     = $( '.js-ln' ).val().trim();
      let email     = $( '.js-email' ).val().trim();
      let dept      = "" //$( '.js-dept :selected' ).text().trim();
      let opt       = $( '#sel1' ).val().trim();
      
      if ( fname == '' || _.isNull(fname) || _.isUndefined(fname) ) {
        Bert.alert('First Name is a required field', 'danger');
        return;
      }
      if ( lname == '' || _.isNull(lname) || _.isUndefined(lname) ) {
        Bert.alert('Last Name is a required field', 'danger');
        return;
      }
      if ( email == '' || _.isNull(email) || _.isUndefined(email) ) {
        Bert.alert('Email is a required field', 'danger');
        return;
      }
  /*
      if ( dept == '' || _.isNull(dept)   || _.isUndefined(dept) ) {
        Bert.alert('Department is a required field', 'danger');
        return;
      }
  */
      $( '#addStudentModal' ).modal( "hide" );
      
      //let password    = 'afdsjkl83212'
      
      /* ASSIGN random password */
      let password = generateRandomPassword()
        , adminEmail  = 'admin@collectiveuniversity.com'
        , videoLink   = 'TO BE ADDED';  //BE SURE TO MAKE IT: http:// xxx
      
      opt           = opt.toLowerCase();
      
      
      /* 
       *  CHANGE THIS FOR PRODUCTION
       */
      let url = 'http://collectiveuniversity.com/login';
      
      let text      = `Hello ${fname},\n\nThis organization has set up its own Collective University to help provide training and more sharing of internal knowledge.  Your plan administrator will be providing more details in the coming days.\n\nTo login to your account and enroll in classes, please visit: ${url}.\n\nUsername: ${email}\nPass: ${password}\n\nFrom here you'll be able to enroll in courses, to request credit for off-site training and conferences, and keep track of all internal training meetings.\nIn Student Records, you'll see all the classes and certifications you have completed.  For a more complete overview, please see this video: ${videoLink}\n\nIf you have any questions, please contact: ${adminEmail}`;

      //ALL FIELDS MUST BE FILLED OUT OR ERR
      Meteor.call( 'addUser', email, password, fname, lname, opt, dept, co.name, co._id );

      if ( opt == 'student' || opt == 'teacher' ) {
        
        //                        TO      FROM                              SUBJECT       BODY
        Meteor.call( 'sendEmail', email, 'admin@collectiveuniversity.com', 'New Account', text );
      }
      
 /*
  * HANDLE:
  * IF opt == 'admin'
  */

      //clear created by code options
      //$( '.js-dept option').each(function(){
        //$(this).remove();
      //});

      $( '.js-fn' ).val('');
      $( '.js-ln' ).val('');
      $( '.js-email' ).val('');

      Bert.alert( 'Account Created', 'success', 'growl-top-right' );

//---------------------------------------------------------
  },



  /********************************************************
   * .JS-EDIT-STUDENT  ::(CLICK)::
   *******************************************************/
  'click .js-edit-student'( e, t ) {
      e.preventDefault();

      //DEPT MUST HAVE A VALUE

      const sTypes = [ 'student', 'teacher', 'admin' ];

      let id = t.$( e.currentTarget ).data( 'id' );
      let s  = Students.findOne({ _id: id });

      //DISPLAY VALUES CURRENTLY IN THE DATABASE
      t.$( '.js-fn' ).attr( 'placeholder', s.fname );
      t.$( '.js-ln' ).attr( 'placeholder', s.lname );
      t.$( '.js-email' ).attr( 'placeholder', s.email );
      
      //SET EDIT RECORDS ID
      t.$( '#edit-student-modal-id' ).data('id',id);
      
      let dpt = Departments.find( {} ).fetch();

      //clear created by code options
      $( '.js-dept option' ).each(function(){
        $(this).remove();
      });
      
      
      $( '.js-role option' ).each(function(){
        $(this).remove();
      });
      

      Meteor.setTimeout(function(){
        
        for( let i = 0, l = dpt.length; i < l; i++ ){
          
          $( '.js-dept' ).append( '<option value="' + dpt[i]._id + '">' +
                                    dpt[i].name + '</option>' 
                                );
        }
        
        
        for( let i = 0, l = sTypes.length; i < l; i++ ){
          
          $( '.js-role' ).append( '<option value="' + sTypes[i] +  '">'  +
                                  capitalizeFirstLetter( sTypes[i] ) + '</option>' 
                                );
        }
        //$( `select[value*="${s.department}"]` ).attr('selected',true);
        
        $( 'select[name="js-dept"]').find('option:contains("' + s.department + '")').attr('selected',true);
    
        $( 'select[name="js-role"]').find('option:contains("' + capitalizeFirstLetter(s.role) + '")' ).attr( "selected",true );
      }, 500);
//---------------------------------------------------------
  },



  /********************************************************
   * .JS-EDIT-STUDENT-SUBMIT  ::(CLICK)::
   *******************************************************/
  'click .js-edit-student-submit'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    let id = t.$( '#edit-student-modal-id' ).data( 'id' );

    let s  = Students.findOne({ _id: id });

    let r   = $( '.js-role' ).select2( 'data' )[0].text.toLowerCase().trim(),
        fn  = $( '.js-fn' ).attr('placeholder').trim(),
        em  = $( '.js-email' ).attr('placeholder').trim(),
        d   = $( '.js-dept' ).select2( 'data' )[0].text;
        
        /*
         * CHANGE THIS URL FOR PRODUCTION
         */
        url = 'http://collectiveuniversity/login';
  
    //if ( d == '' ) d = 'sales';
    if ( d == '' || _.isNull(d) || _.isUndefined(d) ) {
      Bert.alert('Department must not be blank', 'danger');
      return;
    } else if ( r == '' || _.isNull(r) || _.isUndefined(r) ) {
      Bert.alert('User Role must not be blank', 'danger');
      return;
    }
    
    
    // ALL FIELDS MUST BE FILLED OUT OR ERROR
    Students.update({ _id: id },
                    {$set:{ role: r,
                            email:em,
                            department:d,
                            updated_at: new Date() } });


    // ALL FIELDS MUST BE FILLED OUT OR ERROR
    Meteor.users.update({ _id: id }, {$set:{ roles: { [r] : true } }  });

    if ( r == 'teacher' ) {
      let text = `Hello ${fn},\n\nThe administrator of Collective University has upgraded your account to teacher level so that you may now create courses and schedule training sessions within our Corporate University.  As an expert within the organization, it's important to provide you the opportunity to share your knowledge with others so you will get credit for every class you teach and course you build.\n\nYou can login here: ${url}\n\nUser: ${em}\n`;
      
      Meteor.call('sendEmail', em, 'admin@collectiveuniversity.com', 'Upgraded Account', text );
    }
    
/*
 * CHECK FOR ADMIN CREATED USER AND SEND EMAIL
 */

    t.$( '.js-fn' ).attr( 'placeholder',     "" );
    t.$( '.js-ln' ).attr( 'placeholder',     "" );
    t.$( '.js-email' ).attr( 'placeholder',  "" );

    //clear created by code options
   // $( '.js-dept option' ).each(function(){
     // $(this).remove();
    //});
    $( '.js-role option' ).each(function(){
      $(this).remove();
    });

    Bert.alert( 'Edits to student record are saved', 'success', 'growl-top-right' );
    $( '#editStudentModal' ).modal( "hide" );

//---------------------------------------------------------
  },



  /********************************************************
   * #POPUP-CLOSE  ::(CLICK)::
   *******************************************************/
   'click #popup-close'( e, t ){
     e.preventDefault();
      t.$( '.js-fn' ).attr( 'placeholder', "" );
      t.$( '.js-ln' ).attr( 'placeholder', "" );
      t.$( '.js-email' ).attr( 'placeholder', "" );

      //clear created by code options
      //t.$( '.js-dept option' ).each(function(){
        //t.$(this).remove();
      //});

      t.$( '.js-role option' ).each(function(){
        t.$(this).remove();
      });
   },
//---------------------------------------------------------


  /********************************************************
   * .JS-DELETE-STUDENT  ::(CLICK)::
   *******************************************************/
  'click .js-delete-student'( e, t ) {
    e.preventDefault();

    /* ARE YOU SURE YOU WANT TO DELETE... */
    let id = t.$(  e.currentTarget ).data( 'id' );
    let s  = Students.findOne({ _id: id });

    t.$( '#fnln' ).html( s.fname + "&nbsp;" +  s.lname );
    t.$( '.name' ).data( 'id', id );
    t.$( '#stdimg' ).attr( 'src', s.avatar );

//-------------------------------------------------------------------
  },



  /********************************************************
   * .JS-STUDENT-DELETE-SUBMIT  ::(CLICK)::
   *******************************************************/
  'click .js-delete-student-submit'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    let id = t.$( '.name' ).data( 'id' );

    Students.remove( id );
    Meteor.users.remove( id );

    Bert.alert( 'Student record deleted','success' );

    t.$( '#fnln' ).html( "" );
    t.$( '.name' ).data( 'id', "" );
    t.$( '#stdimg' ).attr( 'src', "" );

    $( '#deleteStudentModal' ).modal( 'hide' );

//---------------------------------------------------------
  },


  /********************************************************
   * #DASHBOARD-PAGE  ::(CLICK)::
   *******************************************************/
  'click #dashboard-page'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
//---------------------------------------------------------
  },

});


/**
 * Get the parent template instance
 * @param {Number} [levels] How many levels to go up. Default is 1
 * @returns {Blaze.TemplateInstance}
 *
 * Example usage: someTemplate.parentTemplate() to get the immediate parent
 */
Blaze.TemplateInstance.prototype.parentTemplate = function (levels) {
    var view = this.view;
    if (typeof levels === "undefined") {
        levels = 1;
    }
    while (view) {
        if ( view.name.substring(0, 9) === "Template." && !( levels-- ) ) {
            return view.templateInstance();
        }
        view = view.parentView;
    }
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};


/****************************
 * RANDOME PASSWORD GENERATOR
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
//-----------------END RANDOM PASSWORD GENERATOR-----------