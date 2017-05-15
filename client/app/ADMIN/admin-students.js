/*
 * @module adminStudents
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import { Template }     from 'meteor/templating';
import { Students }     from '../../../both/collections/api/students.js';
import { Departments }  from '../../../both/collections/api/departments.js';
import { Companies }    from '../../../both/collections/api/companies.js';

Template.adminStudents.onCreated(() => {
  Tracker.autorun( () => {
    const admin = Meteor.user();
    if (admin) {
      Meteor.subscribe('singleCompany', admin.profile.company_id);
      const company = Companies.findOne(admin.profile.company_id);
      if (company) {
        const departmentSubscription = Meteor.subscribe('companyStudents', company._id);
        const companySubscription = Meteor.subscribe('companyDepartments', company._id);
        if(departmentSubscription && companySubscription) {
          $.getScript( '/js/select2.min.js', () => {
            $(document).ready(() => {
				
              $('#search-students').select2({
                placeholder: 'Search students',
                allowClear: true,
                multiple: false,
                tags: false,
              });
			  
			  $( '#search-students+.select2-container' ).css("width","100%");
			  $( '.search-box' ).css("width","100%");
			  $( '#search-students+.select2-container' ).css("height","auto");
			  
			 
              $( '#addStudentModal .js-dept' ).select2({
                placeholder: 'Department',
                allowClear: true,
                multiple: false,
                tags: true,
              });		 
			  
              $('#editStudentModal .js-dept' ).select2({
                placeholder: 'Department',
                allowClear: true,
                multiple: false,
                tags: true,
              });
			  
			  
			  $( '.js-dept+.select2-container .select2-selection--single' ).css("height","46px");			  
			  $( '#addStudentModal #js-dept-add+.select2-container' ).css("margin-top","15px");
			 $( '#editStudentModal #js-dept-edit+.select2-container' ).css("margin-top","0px");
			 $( '.js-dept+.select2-container' ).css("margin-top","15px");
			  $( '.js-dept+.select2-container--default .select2-selection--single .select2-selection__arrow' ).css("height","46px");
			  $( '.js-dept+.select2-container--default .select2-selection--single .select2-selection__rendered' ).css("line-height","46px");			  
			  $( '.select2-container--default.select2-container--focus .select2-selection--multiple' ).css("height","46px");
			  
			  
            });
          });
        }
      }
    }
  });
});

Template.adminStudents.helpers({
  students() {
    const admin = Meteor.user();
    if (admin) {
      return Students.find({
        company_id: admin.profile.company_id,
      }).fetch().map(student => ({...student, created_at: moment(student.created_at).format( 'M-D-Y')}));
    }
    return [];
  },

  departments() {
    const admin = Meteor.user();
    if (admin) {
      return Departments.find({ company_id: admin.profile.company_id }).fetch();
    }
    return [];
  },

  departmentsReady() {
    const admin = Meteor.user();
    if (admin) {
      return Departments.find({ company_id: admin.profile.company_id }).count() > 0;
    }
    return false;
  },

  roles() {
    return ['student', 'teacher', 'admin'];
  },
});

Template.adminStudents.events({
  'change #search-students'( e ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    let idx = $( e.currentTarget ).val();
    if ( idx ) {
      $( 'tr' ).css( 'border', '' );
      $( 'tr#' + idx ).css( 'border', '1px solid' );
      $( 'html, body' ).animate({
        scrollTop: $( 'tr#' + $( e.currentTarget ).val() ).offset().top + 'px',
      }, 'fast' );
    }
  },

  'click #close-search'( e ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    $( '#search-students' ).val('');
  },

  'click .js-student'( e ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    if ( Meteor.userId() === $( e.currentTarget ).data( 'id' ) ) return;
    FlowRouter.go( 'student-record', { _id: $(e.currentTarget).data('id') });
  },

  'click .js-import-students-csv'( e ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    FlowRouter.go( 'admin-import-csv', { _id: Meteor.userId() });
  },

  'click .js-add-student-submit'(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const admin = Meteor.user();
    if (admin) {
      const company = Companies.findOne({ _id: admin.profile.company_id });
      const fname = $('#addStudentModal .js-fn').val().trim();
      const lname = $('#addStudentModal .js-ln').val().trim();
      const email = $('#addStudentModal .js-email').val().trim();
      const departmentId = $('#addStudentModal .form-control.input-lg.mob-margin-btm').val(); //not used for now
      const role = $('#sel1' ).val();
	  $('#addStudentModal .js-dept').css("height","46px");
      if (fname === '' || _.isNull(fname) || _.isUndefined(fname)) {
        Bert.alert('First Name is a required field', 'danger');
        return;
      }
      if ( lname === '' || _.isNull(lname) || _.isUndefined(lname) ) {
        Bert.alert('Last Name is a required field', 'danger');
        return;
      }
      if ( email === '' || _.isNull(email) || _.isUndefined(email) ) {
        Bert.alert('Email is a required field', 'danger');
        return;
      }
      if ( role === '' || _.isNull(role)   || _.isUndefined(role) ) {
        Bert.alert('Role is a required field', 'danger');
        return;
      }
      if ( departmentId === '' || _.isNull(departmentId)   || _.isUndefined(departmentId) ) {
        Bert.alert('Department is a required field', 'danger');
        return;
      }

      Meteor.call('users.add', { fname, lname, email, role, company, departmentId }, (err, studentId) => {
        if (err) {
          let errorMessage = 'Failed to add a user';
          if (err.reason === 'Username already exists.') {
            errorMessage += ` :user with ${email} email already exists`;
          }
          Bert.alert(errorMessage, 'danger', 'growl-top-right');
        } else {
          const { password } = Students.findOne(studentId);
          const adminEmail = admin.emails[0].address;
          const videoLink = '';
          if (role === 'teacher' || role === 'student') {
            const text = `Hello ${fname},\n\nThis organization has set up its own Collective University to help provide training and more sharing of internal knowledge.  Your plan administrator will be providing more details in the coming days.\n\nTo login to your account and enroll in classes, please visit: ${Meteor.absoluteUrl()}login.\n\nUsername: ${email}\nPassword: ${password}\n\nFrom here you'll be able to enroll in courses, to request credit for off-site training and conferences, and keep track of all internal training meetings.\nIn Student Records, you'll see all the classes and certifications you have completed.${videoLink ? `For a more complete overview, please see this video: ${videoLink}` : ''}\n\nIf you have any questions, please contact: ${adminEmail}`;
            Meteor.call('sendEmail', email, adminEmail, 'New Account', text, err => {
              if (err) {
                Bert.alert('Failed to send an email to new user', 'danger');
              } else {
                Bert.alert('User seccessfully added', 'success');
                $('#addStudentModal').modal('hide');
              }
            });
          } else if (role === 'admin') {
            Meteor.call('users.sendSignupVerificationEmail', studentId, err => {
              if (err) {
                Bert.alert('Failed to send an email to new user', 'danger');
              } else {
                Bert.alert('User seccessfully added', 'success');
                $('#addStudentModal').modal('hide');
              }
            });
          } else {
            Bert.alert('Failed to send an email to new user', 'danger');
          }
        }
      });
    }
  },

  'click .js-edit-student'( event) {
    event.preventDefault();
    const id = $(event.currentTarget ).data('id');
    const { fname, lname, email, department, role } = Students.findOne({ _id: id });
    $('#editStudentModal .js-fn').val(fname);
    $('#editStudentModal .js-ln').val(lname);
    $('#editStudentModal .js-email').val(email);
    $('#editStudentModal .js-role').val(role);
    $('#editStudentModal .js-dept').val(department).trigger('change');
    $('#edit-student-modal-id').data('id', id);
  },

  'click .js-edit-student-submit'(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const studentId = $('#edit-student-modal-id').data('id');
    const role = $('#editStudentModal .js-role :selected').val();
    const fname = $('#editStudentModal .js-fn').val();
    const email = $('#editStudentModal .js-email').val();
    const departmentId = $('#editStudentModal .js-dept').val(); //not used for now
    if (email === '' || _.isNull(email) || _.isUndefined(email)) {
      Bert.alert('Email must not be blank', 'danger');
      return;
    }
    if (!validateEmail(email)) {
      Bert.alert('Please enter a valid email', 'danger');
      return;
    }
    if ( departmentId === '' || _.isNull(departmentId) || _.isUndefined(departmentId) ) {
      Bert.alert('Department must not be blank', 'danger');
      return;
    } else if ( role === '' || _.isNull(role) || _.isUndefined(role) ) {
      Bert.alert('User Role must not be blank', 'danger');
      return;
    }
    const student = Students.findOne(studentId);
    if (email !== student.email || role !== student.role || departmentId !== student.department) {
      Meteor.call('users.update', { studentId, email, role, departmentId }, err => {
        if (err) {
          console.log('Error: ', err);
          Bert.alert('Failed to update user', 'danger');
        } else {
          if (role === 'teacher') {
            const text = `Hello ${fname},\n\nThe administrator of Collective University has upgraded your account to teacher level so that you may now create courses and schedule training sessions within our Corporate University.  As an expert within the organization, it's important to provide you the opportunity to share your knowledge with others so you will get credit for every class you teach and course you build.\n\nYou can login here: ${Meteor.absoluteUrl()}login\n\nUser: ${email}\n`;
            Meteor.call('sendEmail', student.email, 'admin@collectiveuniversity.com', 'Upgraded Account', text, err => {
              if (err) {
                Bert.alert('Failed to send email to user', 'danger');
              }
            });
          }
          Bert.alert( 'Edits to student record are saved', 'success', 'growl-top-right' );
          $('#editStudentModal').modal('hide');
        }
      });
    }
  },

  /********************************************************
   * #POPUP-CLOSE  ::(CLICK)::
   *******************************************************/
  'click #popup-close'(event) {
    event.preventDefault();
    $('.js-fn').val('');
    $('.js-ln').val('');
    $('.js-email').val('');
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

    Meteor.call('users.remove', id, (err) => {
      if (err) {
        Bert.alert('Failed to delete student record', 'danger');
        console.log('Error: ', err);
      } else {
        Bert.alert('Student record deleted', 'success');
        t.$( '#fnln' ).html( "" );
        t.$( '.name' ).data( 'id', "" );
        t.$( '#stdimg' ).attr( 'src', "" );
        $( '#deleteStudentModal' ).modal( 'hide' );
      }
    });
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

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
