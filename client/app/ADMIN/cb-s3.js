
import { Images }       from '../../../both/collections/api/images.js';

Template.cbS3.onCreated(function() {
  Tracker.autorun( () => { 
    Meteor.subscribe('images');
  });
})

Template.cbS3.events({
  
	"click button.upload": function( e, t ){
	  
		let files = t.$( "input.file_bag" )[0].files
		  , sf    = t.$( 'input.file_bag' ).data('subfolder');
  
		S3.upload(
		          {
        				files:  files,
        				path:   sf //"subfolder"
			        },
			        
			        function( e, r ){
				        //console.log( r );
				        //delete r._id;
				        
				        Images.insert({
				          loaded:           r.loaded,
				          percent_uploaded: r.percent_uploaded,
				          relative_url:     r.relative_url,
				          secure_url:       r.secure_url,
				          status:           r.status,
				          total:            r.total,
				          uploader:         r.uploader,
				          url:              r.url,
				          file:             r.file
				        });
		          }
		);
	},
	
});



Template.cbS3.helpers({
  
	"files": function(){
	  
		return S3.collection.find();
		
	},
});