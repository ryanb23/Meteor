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
      // Meteor.subscribe('students');
      // Meteor.subscribe('companies');
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
  'submit': event => {
    event.preventDefault();
    const fname = $('#fname').val().trim();
    const lname = $('#lname').val().trim();
    const email = $('#email').val().trim();
    const cemail = $('#cemail').val().trim();
    const password = $('#password').val().trim();
    const cpassword = $('#cpassword').val().trim();
    const company = $('#company').val().trim();
    // const university = $('#university').val().trim();

    if (!company) {
      Bert.alert("You need to enter company name", 'danger' );
      return;
    }

    if (email !== cemail) {
      Bert.alert("Your email's do not match!", 'danger' );
      return;
    }
    if (password !== cpassword) {
      Bert.alert('Your passwords do not match!', 'danger');
      return;
    }
    if (!testPassword(password)) {
      Bert.alert('Password must be a min of 8 characters, and include at least one each of: numbers, lowercase letters, uppercase letters, and one of the characters: ! # $ % & * + ? ~', 'danger');
      return;
    }
    try {
      const existingCompany = Companies.findOne({ name: company });  //don't allow duplicate companies
      const existingUser = Students.findOne({ email: email });    //don't allow duplicate emails
      if (existingUser) {
        Bert.alert('That email address already exists in the system', 'danger' );
        return;
      }
      if (existingCompany) {
        Bert.alert('That company already exists in the system', 'danger' );
        return;
      }
      console.log('Will create company');
      Meteor.call('insertCompanyReturnId', company, '#37ACE9', (error, result) => {
        if (error) {
          console.log('Err: ', error);
          Bert.alert('Failed to create a company', 'danger' );
        } else {
          console.log('company created');
          const newCompany = Companies.findOne(result);
          Meteor.call('users.add', {
            fname,
            lname,
            email,
            departmentId: 'admin',
            role: 'admin',
            company: newCompany,
            trial: true,
          }, (err, userId) => {
            if (err) {
              console.log('Err: ', err);
              Bert.alert('Failed to create a company', 'danger');
            } else {
              console.log('User added');
              // Send Verification email
              Meteor.call('users.sendSignupVerificationEmail', userId, err => {
                if (err) {
                  console.log('Err: ', err);
                  Bert.alert('Failed to create a company', 'danger');
                } else {
                  console.log('Verification sent');
                  FlowRouter.go('/post-signup');
                }
              })
            }
          });
        }
      });
    } catch (e) {
      console.log('Err: ', err);
    }


    // FlowRouter.go( '/post-signup' );
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
