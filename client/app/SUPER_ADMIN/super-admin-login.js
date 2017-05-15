// import { Companies }    from '../../../both/collections/api/companies.js';

// Template.superAdminLogin.onCreated(function(){
// });

Template.superAdminLogin.onRendered(function() {
  this.autorun(() => {
    if(Meteor.userId()) {
      const user = Meteor.user();
      if(user && user.roles && user.roles.superadmin) {
        FlowRouter.go(`/super-admin/dashboard/${user._id}`);
      }
    }
  });
});

Template.superAdminLogin.events({
  'submit .form-signin'(event) {
    event.preventDefault();
    const email = $('#inputEmail').val().trim();
    const password = $('#inputPassword').val().trim();
    Meteor.call('users.getSUperAdminByEmail', (err, admin) => {
      if (err) {
        Bert.alert('Incorrect email or password', 'danger');
        console.log('Error: ', err);
      } else if (!admin) {
        Bert.alert('Incorrect email or password', 'danger');
      } else {
        Meteor.loginWithPassword(email, password, (err, res) => {
          if (err) {
            Bert.alert('Incorrect email or password', 'danger');
          } else {
            const user = Meteor.user();
            if (user.roles.superadmin) {
              FlowRouter.go(`/super-admin/dashboard/${user._id}`);
            }
          }
        });
      }
    })
  },
});
