$(document).ready(function(){

	// Menu Button For Tab
	$('.sidebar-menu-area button#open').on('click',function(){
		$(this).hide();
		$('.sidebar-menu-area button#close').show();
		$('.sidebar-menu-area').animate({'left': '0'},500);
		return false;
	});
	$('.sidebar-menu-area button#close').on('click',function(){
		$(this).hide();
		$('.sidebar-menu-area button#open').show();
		$('.sidebar-menu-area').animate({'left': '-235px'},500);
		return false;
	});


/*
	//Video
 	$("a[rel^='prettyPhoto']").prettyPhoto({
 		deeplinking: false,
 		social_tools: false,
		allow_resize: true,
		default_width: 700,
        default_height: 444,
        horizontal_padding: 20
 	});


	// Slider
	$(".slider-area").owlCarousel({
		items: 1,
		loop: true,
		autoplay: true,
		dots: false,
		nav: true,
		navText: ['<img src="/img/slider-arrow-1.png" alt="" />','<img src="/img/slider-arrow-2.png" alt="" />'],
		navSpeed: 500,
		autoplaySpeed: 500,
		autoplayTimeout: 7000
	});

	//Sponsor
	$(".sponsor-list ul").owlCarousel({
		responsive: {
			0: {
				items: 2
			},
			480: {
				items: 3
			},
			768: {
				items: 4
			},
			991: {
				items: 6
			}
		},
		dots: false,
		nav: true,
		navText: ['<img src="/img/arrow-left.png" alt="" />','<img src="/img/arrow-right.png" alt="" />'],
		loop: true,
		autoplay: true
	});


	// Credit Cancel Request
	$('button#cancel').on('click',function(){
		$('.credit-request').slideUp();
		return false;
	});

	$('input#fileup').change(function(){
	    var fileName = $(this).val();
	    $('#filename').text(fileName);
	});

    $( "#datepicker" ).datepicker({
        showAnim: "slideDown"
    }).datepicker("setDate", new Date());;

	$(".js-multiple-select-1").select2({
		placeholder: "Type Student Name"
	});

	$(".js-multiple-select-2").select2({
		placeholder: "Type Department Name"
	});

	$('button#assign').attr('data-target', function(i){
		return '#myModal-'+(i++);
	});

	$('.modal').attr('id', function(i){
		return 'myModal-'+(i++);
	});

	$('.assign-title input').attr('id', function(i){
		return 'radio-'+(i++);
	});

	$('.assign-title label').attr('for', function(i){
		return 'radio-'+(i++);
	});


	$('.ui-datepicker').hover(function(){
		$('.ui-datepicker table').slideDown();
	}, function() {
		$('.ui-datepicker table').delay(900).slideUp;
	});

*/


});


function readURL(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#logo-preview').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

$("#logo-upload").change(function(){
    readURL(this);
});
