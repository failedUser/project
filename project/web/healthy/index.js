	
	function animateSlide_1(){
		$('.slide_2 .intro-title').removeClass('hidden');
		$('.slide_2 .intro').removeClass('hidden');
		$('.slide_2 .intro-title').addClass('animated fadeInLeft');
		$('.slide_2 .intro_1').addClass('animated fadeInUp');
		setTimeout(function() {
			$('.slide_2 .intro_2').addClass('animated fadeInUp');
		}, 300);
	}
	function animateSlide_2(){
		$('.slide-hope .row').removeClass('hidden');
		$('.slide-hope .intro-title').addClass('animated fadeInLeft');
		$('.slide-hope .hope-slogan').addClass('animated flipInX');
		var list = $('.we-will span');
		list.each(function(index, el) {
			setTimeout(function() {
				$(el).addClass('animated fadeInRight');
			}, Math.round(Math.random()*500));
		
		});

	}
	function animateSlide_remove(index){
		$('.slide_2 .intro-title').addClass('hidden');
		$('.slide_2 .intro').addClass('hidden');
		$('.slide_2 .intro-title').remove('animated fadeInLeft');
	}

    var swiperH = new Swiper('.swiper-container-h', {
        paginationClickable: true,
         direction: 'vertical',
         mousewheelControl: true,
         initialSlide :0,
          onSlideChangeEnd: function(swiper){
	      console.log();
	      if(swiper.activeIndex==1)animateSlide_1();
	      if(swiper.activeIndex==2)animateSlide_2();
	    },

    });
    var swiperV = new Swiper('.swiper-container-v', {
        pagination: '.swiper-pagination-v',
        paginationClickable: true,
        onInit:function(swiper){
        	$('.swiper-icon').removeClass('hidden');
        	$('.swiper-icon').addClass('animated fadeInDown')
        },
        onSlideChangeStart: function(swiper){
        	$('.swiper-icon').addClass('hidden');
	     	 $('.swiper-icon').removeClass('animated fadeInDown')
	    },
         onSlideChangeEnd: function(swiper){
         	$('.swiper-icon').removeClass('hidden');
	     	$('.swiper-icon').addClass('animated fadeInDown')
	    },

    });
    
    var swiperCity = new Swiper('.swiper-container-city', {
        effect: 'flip',
        grabCursor: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev'
    });
     $('.tab-item').on('click',function(event){
     	$('.tab-item').removeClass('click');
     	$(this).addClass('click');
     	swiperCity.slideTo($(this).attr('data-index'), 500)
     })
     $('li').on('click',function(event){
     	$('li').removeClass('active');
     	$(this).addClass('active');
     	console.log(mySwiper)
     	swiperH.slideTo($('li').index($(this)), 500);
     })