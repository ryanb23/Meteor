/*
 * @module main
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovations
 */
import { Meteor     }   from 'meteor/meteor';
import { Mongo      }   from 'meteor/mongo';
import { Email }        from 'meteor/email'
import { Webapp     }   from 'meteor/webapp';

// mail.collectiveuniversity.com:587
// ded1341.inmotionhosting.com:465

// 'postmaster@sandbox22227.mailgun.org',
// '9ch9504qu240'
// 'smtp.mailgun.org'

Meteor.startup(() => {
  smtp = {
    username: 'postmaster@mg.collectiveuniversity.com', 
    password: '6f3408650d397dd3755999acb3f7c833',
    server:   'smtp.mailgun.org',
    port:     2525
  };

/*
Meteor.startup(() => {
  
  smtp = {
    username: 'gcc.programmer@gmail.com',
    password: 'xxx',
    server:   'smtp.gmail.com',
    port:     587
  };
*/
  process.env.MAIL_URL = 'smtp://' +
    encodeURIComponent( smtp.username ) + ':' +
    encodeURIComponent( smtp.password ) + '@' +
    encodeURIComponent( smtp.server )   + ':' + smtp.port;

  
  process.env.ROOT_URL = 'http://collectiveuniversity.com';
/*  
  let exec = require('child_process').exec;
  let cmd = 'ls';

  exec(cmd, function(error, stdout, stderr) {
    // command output is in stdout
    console.log( stdout );
  });
*/

/*
  WebApp.addHtmlAttributeHook(function() {
    return { 'class': "no-js" }
  });
  */
});

/*
// Listen to incoming HTTP requests, can only be used on the server
WebApp.rawConnectHandlers.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  return next();
});
*/