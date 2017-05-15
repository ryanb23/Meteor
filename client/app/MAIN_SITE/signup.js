/*
 * @module signup
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

import { Students }   from '../../../both/collections/api/students.js';
import { Companies }  from '../../../both/collections/api/companies.js';


import './signup.html';

/*
 * ON CREATED
 */
 Template.signup.onCreated(function(){
    $('[data-toggle="tooltip"]').tooltip();

    Tracker.autorun( () => {
      Meteor.subscribe('students');
      Meteor.subscribe('companies');
    });
//-------------------------------------------------------------------
 });
 

/*
 * EVENTS
 */
Template.signup.events({

  /*
   * SUBMIT
   */
  'submit': ( e, t ) => {
    e.preventDefault();
  
    let fname       = $( '#fname' ).val().trim() // OR e.target.fname.value
      , lname       = $( '#lname' ).val().trim()
      , email       = $( '#email' ).val().trim()
      , cemail      = $( '#cemail' ).val().trim()
      , password    = $( '#password' ).val().trim()
      , cpassword   = $( '#cpassword').val().trim()
      , company     = $( '#company' ).val().trim()
      , phone       = $( '#phone' ).val().trim()
      , university  = $( '#university' ).val().trim()
      , opt         = 'admin'
      , dept        = 'admin'
      , email_id
      , company_id;
    

    
    //EMAIL'S AND PASSORDS MUST MATCH 
    if ( email !== cemail ) {
      Bert.alert("Your email's do not match!", 'danger' );
      return;
    }
    if ( password !== cpassword ) {
      Bert.alert('Your passwords do not match!', 'danger');
      return;
    }
    
    if ( ! testPassword( password ) ) {
      Bert.alert('Please refer to tooltip for proper password formation', 'danger');
      return;
    }
    
    try { 
      company_id = Companies.findOne({ name: company });  //don't allow duplicate companies
      email_id   = Students.findOne({ email: email });    //don't allow duplicate emails
      
      if ( email_id && email_id._id ) {
        Bert.alert('That email address already exists in the system', 'danger' );
        return;
      }
      
      if ( company_id && company_id._id ) {
        Bert.alert('That company already exists in the system', 'danger' );
        return;
      }
      
      if ( ! company_id ) {
        Meteor.call( 'insertCompanyReturnId', company, 
                                              '#37ACE9', 
                                              function( error, result ) 
      {
          company_id = result;
          
          Meteor.call( 'addUser', email, 
                                  password, 
                                  fname, 
                                  lname, 
                                  opt, 
                                  dept, 
                                  company, 
                                  company_id, 
                                  true );
        });
      }
    } catch(e) {
      console.log(e);
    }
    

    FlowRouter.go( '/post-signup' );
//-------------------------------------------------------------------
  },
});

function testPassword( pw ) {
  //CAPITOL LETTERS
  let caps = pw.match(/[A-Z]/i);
  //LOWERCASE LETTERS
  let lows = pw.match(/[a-z]/i);
  //NUMBERS
  let nums = /[0-9]/.test(pw);
  //PUNCTUATION
  //ALT: /[\x21\x23-\x26\x2a\x2b\3f\x7e\x40]/.test('~')
  // ! # $ % & * + ? ~ @
  let punc = /[\x21\x23\x24\x25\x26\x2a\x2b\x3f\x7e\x40]/.test(pw);
  
  //LENGTH
  let len = pw.length;
  
  if ( caps && lows && nums && punc && (len >= 8) ) {
    return true;
  } else {
    return false;
  }
    
}
