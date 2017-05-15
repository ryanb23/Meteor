/*
 * @module adminAdvanced
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import { Companies }   from '../../../both/collections/api/companies.js';
import { Students }   from '../../../both/collections/api/students.js';
import { Template }   from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Newsfeeds }     from '../../../both/collections/api/newsfeeds.js';

const creditsRequired =  new ReactiveVar(false);

Template.adminAdvanced.onCreated(() => {
  Tracker.autorun( () => {
    Meteor.subscribe('newsfeeds');
    Meteor.subscribe('students');
    Meteor.subscribe('companies');
    if (Meteor.user() && Meteor.user().profile.company_id) {
      const company = Companies.findOne(Meteor.user().profile.company_id);
      if (company) {
        if (company.creditsRequired) {
          creditsRequired.set(true);
        }
      }
    }
  });
});

Template.adminAdvanced.helpers({
  creditsRequired: () => {
    return creditsRequired.get();
  },
  credits: () => {
    if (Meteor.user() && Meteor.user().profile.company_id) {
      const company = Companies.findOne(Meteor.user().profile.company_id);
      if (company) {
        if (company.required_credits) {
          return company.required_credits;
        }
      }
    }
    return 145;
  },
});

Template.adminAdvanced.events({
  'click #credit-on'(event) {
    event.preventDefault();
    creditsRequired.set(true);
  },

  'click #credit-off'(event) {
    event.preventDefault();
    creditsRequired.set(false);
  },

  'click .advance-time-button button'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
		t.$( ".advance-time-button button:first-child" ).removeClass( 'active' );
		t.$( ".advance-time-button button:last-child" ).removeClass( 'active' );
		t.$( e.currentTarget ).toggleClass( 'active' );
  },

  'click .js-priv-url'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    let purl = t.$( '.js-priv-url' ).val();
  },

  'click .js-advanced-save'(event) {
    event.preventDefault();
  	if (creditsRequired.get()) {
		  const req_creds = $('#js-credits-required').val();
		  let freq;

		  if ($('.advance-time-button button:first-child').hasClass('active')) {
		    freq = $('.advance-time-button button:first-child').data('value');
		  } else if ($('.advance-time-button button:last-child').hasClass('active')) {
		    freq = $('.advance-time-button button:last-child').data('value');
		  } else {
		    Bert.alert('Please select frequency:  Quarterly or Yearly.', 'danger');
		    return;
		  }

		  Meteor.call('upsertCompany', Meteor.user().profile.company_id,  freq, req_creds, err => {
        if (err) {
          Bert.alert( 'Failed to save your information', 'danger' );
        } else {
          Meteor.call( 'upsertCredits', Meteor.user().profile.company_id, req_creds, freq, err => {
            if (err) {
              Bert.alert( 'Failed to save your information', 'danger' );
            } else {
              Bert.alert( 'Your information has been saved', 'success' );
            }
          } );
        }
      });
		} else {
      Meteor.call( 'companies.turnCreditsOff', Meteor.user().profile.company_id, err => {
        if (err) {
          Bert.alert( 'Failed to save your information', 'danger' );
        } else {
          Meteor.call('students.turnCreditsOff', Meteor.user().profile.company_id, err => {
            if (err) {
              Bert.alert( 'Failed to save your information', 'danger' );
            } else {
              Bert.alert( 'Your information has been saved', 'success' );
            }
          });
        }
      });
    }
  },
});
