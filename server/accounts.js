/*
 * @module accounts
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */

Accounts.onCreateUser( ( options, user ) => {
    user.roles    = options.roles;
    user.profile  = options.profile;
    if ( user.roles.student || user.roles.teacher ) {
      user.emails[0].verified = true;
    }
    // else {
    //   console.log( user._id );
    //   console.log( user.emails[0].address );
    //
    //   Meteor.setTimeout(function(){
    //     Accounts.sendVerificationEmail( user._id, user.emails[0].address );
    //   }, 2000);
    // }
    return user;
  });


  if ( Meteor.isServer ) {
      Accounts.validateLoginAttempt(function( attemptInfo ) {
          if ( attemptInfo.type == 'resume' ) return true;

          if ( attemptInfo.methodName == 'createUser' ) return false;

          if ( attemptInfo.methodName == 'login' && attemptInfo.allowed ) {
              var verified = false;
              var email = attemptInfo.methodArguments[0].user.email;
              attemptInfo.user.emails.forEach(function( value, index ) {
                  if ( email == value.address && value.verified ) verified = true;
              });
              if ( !verified ) throw new Meteor.Error( 403, 'Verify Email first!' );
          }

          return true;
      });
  }


  Meteor.users.allow({
      remove: function( userId ) {
          return true;
      },
      update: function( userId ) {
        return true;
      }

  });
