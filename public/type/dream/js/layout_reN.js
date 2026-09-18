function setVh(){
	document.documentElement.style.setProperty('--vh', window.innerHeight + 'px');
}

window.addEventListener('resize', setVh);
setVh();

$(function(){
	/*** 상단 버튼 ***/
	$('.top_link .btn_kotraSite').click(function(){
		if($(this).hasClass('on')){
			$(this).removeClass('on');
			$(this).parents('.top_link').removeClass('on');
			$(this).attr('title','KOTRA 내부사이트 열기');
		}else{
			$(this).addClass('on');
			$(this).parents('.top_link').addClass('on');
			$(this).attr('title','KOTRA 내부사이트 닫기')
		}
	}); 

	$('.top_link .moreSiteArea .btn_close').click(function(){
		$('.top_link .btn_kotraSite.on').trigger('click');
	});

	$('.top_link .btn_allianceSite').click(function(){
		if($(this).hasClass('on')){
			$(this).removeClass('on');
			$(this).attr('title','연합기관 바로가기 열기');
		}else{
			$(this).addClass('on');
			$(this).attr('title','연합기관 바로가기 닫기')
		}
	});

	/*** GNB ***/
	/*gnb*/
	var gnbCrt0 = $("#gnb>li:nth-child(" + (gnbDep1) + ")>a");
	var gnbCrt1 = $("#gnb>li:nth-child(" + (gnbDep1) + ")>a");
	var gnbCrt2 = $("#gnb>li:nth-child(" + (gnbDep1) + ")>.group>ul>li:nth-child(" + (gnbDep2) + ")");
	var gnbCrt3 = $("#gnb>li:nth-child(" + (gnbDep1) + ")>.group>ul>li:nth-child(" + (gnbDep2) + ")>.group>ul>li:nth-child(" + (gnbDep3) + ")");
	var gnbCrt4 = $("#gnb>li:nth-child(" + (gnbDep1) + ")>.group>ul>li:nth-child(" + (gnbDep2) + ")>.group>ul>li:nth-child(" + (gnbDep3) + ")>.group>ul>li:nth-child(" + (gnbDep4) + ")");

	var snbCrt0 = $("#snb_menu>li:nth-child(" + (gnbDep1) + ")>a");
	var snbCrt1 = $("#snb_menu>li:nth-child(" + (gnbDep1) + ")>a");
	var snbCrt2 = $("#snb_menu>li:nth-child(" + (gnbDep1) + ")>ul>li:nth-child(" + (gnbDep2) + ")>a");
	var snbCrt3 = $("#snb_menu>li:nth-child(" + (gnbDep1) + ")>ul>li:nth-child(" + (gnbDep2) + ")>ul>li:nth-child(" + (gnbDep3) + ")>a");
	var snbCrt4 = $("#snb_menu>li:nth-child(" + (gnbDep1) + ")>ul>li:nth-child(" + (gnbDep2) + ")>ul>li:nth-child(" + (gnbDep3) + ")>ul>li:nth-child(" + (gnbDep4) + ")>a");

	if(gnbCrt0) gnbCrt0.addClass("on");
	if(gnbCrt1) gnbCrt1.addClass("on");
	if(gnbCrt2) gnbCrt2.addClass("on");
	if(gnbCrt3) gnbCrt3.addClass("on");
	if(gnbCrt4) gnbCrt4.addClass("on");

	if(snbCrt0) snbCrt1.parent().addClass("on");
	if(snbCrt1) snbCrt1.parent().addClass("on");
	if(snbCrt2) snbCrt2.parent().addClass("on");
	if(snbCrt3) snbCrt3.parent().addClass("on");
	if(snbCrt4) snbCrt4.parent().addClass("on");

	// PC
    //gnb dep1

	// gnbEtcWidth
	function gnbEtcWrap(){
		if(window.innerWidth > 1041 && window.innerWidth <= 1630 ){
			var winW = window.innerWidth;
			var etcWrap = (winW - $('.reN header>nav #gnb>li>.group').innerWidth()) / 2

			$('.gnb_infoArea').css('max-width',etcWrap)
			$('#gnb .bnrZone').css('max-width',etcWrap)
		}
	}
	

	$(document).on('mouseover', '#gnb>li>a', function() {
		if(window.innerWidth >= 1041){
            var dep1Obj = $(this).parent();
            var dep2Wrap = dep1Obj.find('.menuM');
            var dep2Obj = dep2Wrap.find('>li');
            var dep2Obj_first = dep2Obj.eq(0);
            var dep3Wrap = dep1Obj.find('.menuS');
            var dep3Obj = dep3Wrap.find('>li');
            var dep3Obj_first = dep3Obj.eq(0);
            var dep4Wrap = dep1Obj.find('.menuSS');
            var dep4Obj = dep4Wrap.find('>li');
            var dep4Obj_first = dep4Obj.eq(0);

			//reset
			$("#header").css("height","");
			$('header>nav #gnb ul.menuM>li').removeClass('active').removeClass('over');;
			$('header>nav #gnb ul.menuS>li').removeClass('active').removeClass('over');;
			$('header>nav #gnb ul.menuSS>li').removeClass('active').removeClass('over');

			// Gnb 열림
			$("#header").addClass("gnbOn");
			$("#dim").addClass("on");

			//Hover 시 클래스 추가/삭제
            dep1Obj.addClass('over').siblings().removeClass('over');


            //첫번째 요소 무조건 Active
            if(!! dep2Wrap.length){
                dep2Obj.removeClass('active');
                dep3Obj.removeClass('active');
                dep4Obj.removeClass('active');

                if( ! dep2Obj_first.hasClass('link') ){
                    dep2Obj_first.addClass('active')
                }

                if( ! dep3Obj_first.hasClass('link') ){
                    dep3Obj_first.addClass('active')
                }

                if( ! dep4Obj_first.hasClass('link') ){
                    dep4Obj_first.addClass('active')
                }
            }

			// gnb Height
			var dep2WrapH = dep2Wrap.height();
			dep2WrapH = dep2WrapH ? dep2WrapH : 0;
			var dep3WrapH = dep3Wrap.height();
			dep3WrapH = dep3WrapH ? dep3WrapH : 0;
			var dep4WrapH = dep4Wrap.height();
			dep4WrapH = dep4WrapH ? dep4WrapH : 0;

			var depMaxH = Math.max(dep2WrapH,dep3WrapH,dep4WrapH);

			$("#header").height(depMaxH + 190);
		};
	});


	//2dep
	$(document).on('mouseover', '.reN header>nav #gnb ul.menuM>li>a', function() {
		if(window.innerWidth >= 1041){
			var dep2Obj = $(this).parent();
			$('header>nav #gnb ul.menuM>li').removeClass('active').removeClass('over');
			$('header>nav #gnb ul.menuS>li').removeClass('active').removeClass('over');
			$('header>nav #gnb ul.menuSS>li').removeClass('active').removeClass('over');

			dep2Obj.addClass('over').siblings().removeClass('over');
			dep2Obj.siblings().removeClass('active');

			if($(this).parent('li').hasClass('child')){
				if( $(this).siblings('.group').find('.menuS>li:nth-child(1)').hasClass('child') ){
					$(this).siblings('.group').find('.menuS>li:nth-child(1)').addClass('over')
				}

			}

			// gnb Height
			var dep2WrapH = $(this).parent('li').parent('.menuM').height();
			dep2WrapH = dep2WrapH ? dep2WrapH : 0;
			var dep3WrapH = $(this).parent('li').find('.menuS').height();
			dep3WrapH = dep3WrapH ? dep3WrapH : 0;
			var dep4WrapH = $(this).parent('li').find('.menuSS').height();
			dep4WrapH = dep4WrapH ? dep4WrapH : 0;

			var depMaxH = Math.max(dep2WrapH,dep3WrapH,dep4WrapH);

			$("#header").height(depMaxH + 190);
		}
	});

	//3dep
	$(document).on('mouseover', '.reN header>nav #gnb ul.menuS>li>a', function() {
		$('.reN header>nav #gnb ul.menuS>li>a').mouseover(function(){
			if(window.innerWidth >= 1041){
				var dep3Obj = $(this).parent();
				dep3Obj.addClass('over').siblings().removeClass('over');
				dep3Obj.siblings().removeClass('active');
			}
		});
	});

	
	
	//4dep
	$(document).on('mouseover', '.reN header>nav #gnb ul.menuSS>a', function() {
		if(window.innerWidth >= 1041){
			var dep4Obj = $(this).parent();
			dep4Obj.siblings().removeClass('active');
		}
	});


	$(document).on('mouseleave', '#header', function() {
		if(window.innerWidth >= 1041){
			$("#header").removeClass("gnbOn").removeAttr('style');
			$("#dim").removeClass("on");
			$("header>nav #gnb>li").removeClass('over');
			$("header>nav #gnb>li").removeClass('active');
			$("header>nav #gnb ul.menuM>li").removeClass('over');
			$("header>nav #gnb ul.menuM>li").removeClass('active');
			$("header>nav #gnb ul.menuS>li").removeClass('over');
			$("header>nav #gnb ul.menuS>li").removeClass('active');
			$("header>nav #gnb ul.menuSS>li").removeClass('over');
			$("header>nav #gnb ul.menuSS>li").removeClass('active');
		}
	});

	/*mobile*/

	$("header .mBtn_topMenu").click(function(){
		$(this).nextAll("nav").show();
		if(window.innerWidth < 1041){
			$("header>nav #gnb").removeAttr('style')//reset
			$("header>nav #gnb ul.menuM>li").removeClass('act');//reset
			//Main reset
			if($('body').hasClass('typeMain')){
				$("header>nav #gnb li:nth-child(1)>a").addClass('act');
			}
			$("header>nav #gnb li .on").addClass('act');
			$('.emptyArea').show();

			$("#gnb_dim").addClass('on');
			$("#header").addClass('gnbOn');
			// menuM();

			$('#gnb').attr('tabindex', -1);
				setTimeout(function () {
				$('#gnb').focus();
			}, 300);


			$('body').css('overflow','hidden');
			$('html').css('overflow','hidden');
		}
	});

	$("header>nav #gnb>li>a").click(function(){
		if(window.innerWidth < 1041){
			if($(this).parent('li').hasClass('child')){
				$("header>nav #gnb li a").removeClass('act');//reset
				$("header>nav #gnb li a").removeClass('on');//reset
				$("header>nav #gnb>li>a").removeClass('act');//reset
				$("header>nav #gnb>li>a").removeClass('on');//reset

				if($(this).parent('li').hasClass('child')){
					if(!$(this).hasClass('act')){
						$("header>nav #gnb>li>a.act").removeClass('act');
						$(this).addClass('act');
					}
				}
				return false;
			}else{
				return true;
			}
		}
	});

	$("header>nav #gnb ul.menuM>li>a").click(function(){
		if(window.innerWidth < 1041){
			if($(this).parent('li').attr('class') == 'child' || $(this).parent('li').attr('class') == 'child on'){
				$("header>nav #gnb li").removeClass('act');
				$("header>nav #gnb li").removeClass('on');
				$("header>nav #gnb .menuM .group").slideUp(200);
				$(this).parent('li').addClass('act');
				$(this).siblings('.group').slideDown(200);
				$(this).attr('title', '접기');
				$(this).parent().siblings('.emptyArea').hide();

				return false;
			}else if($(this).parent('li').attr('class') == 'child act'){
				$(this).parent('li').removeClass('act');
				$(this).siblings('.group').slideUp(200);
				$(this).attr('title', '펼치기');

				return false;
			}else{
				return true;
			}
		}
	});

	$("header>nav #gnb ul.menuS>li>a").click(function(){
		if(window.innerWidth < 1041){
			if($(this).parent('li').attr('class') == 'child' || $(this).parent('li').attr('class') == 'child on'){
				$("header>nav #gnb .menuS>li").removeClass('act');
				$("header>nav #gnb .menuS>li").removeClass('on');
				$("header>nav #gnb .menuS .group").slideUp(200);
				$(this).parent('li').addClass('act');
				$(this).siblings('.group').slideDown(200);
				$(this).attr('title', '접기');

				return false;
			}else if($(this).parent('li').attr('class') == 'child act' || $(this).parent('li').attr('class') == 'child on act'){
				$(this).parent('li').removeClass('act');
				$(this).siblings('.group').slideUp(200);
				$(this).attr('title', '펼치기');

				return false;
			}else{
				return true;
			}
		}
	});


	$("header .mBtn_close").click(function(){
		mBtnClose();
		setTimeout(function () {
			$('.mBtn_topMenu').focus();
		}, 300);
	});

	function mBtnClose(){
		$("#gnb_dim").removeClass('on');
		$("#header").removeClass('gnbOn');
		$("header>nav #gnb li").removeClass('act');
		$("header>nav #gnb>li>a").removeClass('act');
		$('body').css('overflow','visible');
		$('html').css('overflow','visible');
	}

	/*** Contents ***/
	// snb
	//*** snb
	$("#snb_nav").each(function(){
		var snbBtn1 = $('<button type="button" title="1레벨메뉴 축소됨">' + snbCrt1.text() + '</button>');
		var snbBtn2 = $('<button type="button" title="2레벨메뉴 축소됨">' + snbCrt2.text() + '</button>');
		var snbBtn3 = $('<button type="button" title="3레벨메뉴 축소됨">' + snbCrt3.text() + '</button>');
		var snbBtn4 = $('<button type="button" title="4레벨메뉴 축소됨">' + snbCrt4.text() + '</button>');

		snbBtn1.insertAfter($("#snb_nav>div>a"));
		if(gnbDep2 == 0) {
			$("#snb_nav>div>button:nth-of-type(1)").addClass("on");
		}else if(gnbDep3 == 0){
			snbBtn2.insertAfter($("#snb_nav>div>button:nth-of-type(1)"));
			$("#snb_nav>div>button:nth-of-type(2)").addClass("on");
		}else if(gnbDep4 == 0){
			snbBtn2.insertAfter($("#snb_nav>div>button:nth-of-type(1)"));
			snbBtn3.insertAfter($("#snb_nav>div>button:nth-of-type(2)"));
			$("#snb_nav>div>button:nth-of-type(3)").addClass("on");
		}else{
			snbBtn2.insertAfter($("#snb_nav>div>button:nth-of-type(1)"));
			snbBtn3.insertAfter($("#snb_nav>div>button:nth-of-type(2)"));
			snbBtn4.insertAfter($("#snb_nav>div>button:nth-of-type(3)"));
			$("#snb_nav>div>button:nth-of-type(4)").addClass("on");
		}
	});

	$("#snb_nav>div>button").click(function(){
		$("#snb_nav").removeClass();
		if($(this).index() == 1) {
			$("#snb_nav").addClass("active1");
		}else if(($(this).index() == 2)){
			$("#snb_nav").addClass("active2");
		}else if(($(this).index() == 3)){
			$("#snb_nav").addClass("active3");
		}else{
			$("#snb_nav").addClass("active4");
		}

		if($(this).hasClass("active")) {
			$(this).removeClass("active");
			$("#snb_menu").slideUp(50);
		}else{
			$("#snb_nav>div>button").removeClass("active");
			$(this).addClass("active");

			if(window.innerWidth <= 1041){
				$("#snb_menu").slideDown(100).css({"width" : "", "left" : ""});
			}else{
				$("#snb_menu").slideDown(100).css({"width" : $(this).outerWidth(), "left" : $(this).position().left});
			}
		};

		if($("#snb_nav").hasClass("active1")) {
			if($(this).hasClass("active")){
				$(this).attr("title","1레벨메뉴 확장됨");
			}else{
				$(this).attr("title","1레벨메뉴 축소됨");
			}
		}
		if($("#snb_nav").hasClass("active2")) {
			if($(this).hasClass("active")){
				$(this).attr("title","2레벨메뉴 확장됨");
			}else{
				$(this).attr("title","2레벨메뉴 축소됨");
			}
		}
		if($("#snb_nav").hasClass("active3")) {
			if($(this).hasClass("active")){
				$(this).attr("title","3레벨메뉴 확장됨");
			}else{
				$(this).attr("title","3레벨메뉴 축소됨");
			}
		}
		if($("#snb_nav").hasClass("active4")) {
			if($(this).hasClass("active")){
				$(this).attr("title","4레벨메뉴 확장됨");
			}else{
				$(this).attr("title","4레벨메뉴 축소됨");
			}
		}
	});

	$("#snb_nav .snb_util .btn_share").click(function(){
		if($("#snb_nav .snb_util .shareBox").hasClass('on')){
			$("#snb_nav .snb_util .shareBox").removeClass('on');
			$("#snb_nav .snb_util .btn_share").removeClass('on');
			$("#snb_nav .snb_util .btn_share").attr('title', '공유하기 레이어 닫힘')
		}else{
			$("#snb_nav .snb_util .shareBox").addClass('on');
			$("#snb_nav .snb_util .btn_share").addClass('on');
			$("#snb_nav .snb_util .btn_share").attr('title', '공유하기 레이어 열림')
		}
	});

	$("#snb_nav .snb_util .shareBox .btn_close").click(function(){
		$("#snb_nav .snb_util .shareBox").removeClass('on');
		$("#snb_nav .snb_util .btn_share").removeClass('on');
		setTimeout(function(){
			$('#snb_nav .snb_util .btn_share').focus();
		}, 300)
	});

	$("#snb_menu").mouseleave(function(){
		$("#snb_nav>div>button").removeClass("active");
		$("#snb_menu").slideUp(100);
		$("#utilSnbYn").hide();
	});
	
	$("#snb_nav").mouseleave(function(){
		if(window.innerWidth >= 1041){
			$("#snb_nav>div>button").removeClass("active");
			$("#snb_menu").slideUp(100);
		}
	});

	/*** Footer ***/
	// top버튼
	$(".btn_scrollTop").click(function(){
		$("html, body").stop().animate({
			scrollTop : 0
		}, 150);
	});

	$("#snb_nav .snb_util .zoom>button").click(function(){
		$('#contents article').FontSize({
			increaseTimes: 3,
			reduceTimes: 3,
			step: 3,
			increaseBtn:'.btn_zoomIn',
			reduceBtn:'.btn_zoomOut'
		});
	});

	// familySite
	$("#footer .btn_familysite").click(function(){
		if($("#footer .familySite").hasClass('on')){
			$(this).attr('title','Alliance Site 펼치기');
			$("#footer .familySite").removeClass('on');
		}else{
			$(this).attr('title','Alliance Site 접기');
			$("#footer .familySite").addClass('on');
		}
	});

	var conts_loc;
	$(window).scroll(function(){
		conts_loc = $(window).scrollTop();
		//console.log(conts_loc);
		if($("body").hasClass('typeMain')){
			if(conts_loc > 0){
                $("body").addClass('mSticky');
			}else{
                $("body").removeClass('mSticky');
			}
		}

		if($("body").hasClass('typeSub')){
			if(window.innerWidth >= 1041){
				if(conts_loc > 400){
					$("body").addClass('stickyFix');
				}else{
					$("body").removeClass('stickyFix');
				}
			}else{
				if(conts_loc > 181){
					$("body").addClass('stickyFix');
				}else{
					$("body").removeClass('stickyFix');
				}
			}
		}

        if(conts_loc > 100){
            $("#btn_top").addClass('on');
        }else{
			$("#btn_top").removeClass('on');
        }

		// selcet Tab
		if($('.selectTab_wrap').length){
			var selTab_t = $('.selectTab_wrap').offset().top;		
			if(window.innerWidth >= 1041){
				if(conts_loc + 235 > selTab_t){
					$('#selectTab').addClass('fix');
				}else{
					$('#selectTab').removeClass('fix');
				}
			}else{
				if(conts_loc + 175 > selTab_t){
					$('#selectTab').addClass('fix');
				}else{
					$('#selectTab').removeClass('fix');
				}
			}
		}
	});


	/*** Snb / Pnb / option ***/
	$(".searchOptBox .boxBtn .btn_optBoxOpen").click(function(){
		$(".searchOptBox").addClass('on');
		$(".searchOptBox .searchOpt").slideDown(200);
	});

	/* 2024-07-17 상세검색 열기닫기 변경 */
	$(".searchOptBox .boxBtn .btn_optBoxClose").click(function(){
		if ($(this).hasClass('seachOptTypeOpen')) {
	        $(this).removeClass('seachOptTypeOpen');
	        $(this).addClass('seachOptTypeClose');
	        $(this).html('<span>상세 검색 닫기</span>');
	        $('.searchBaseDN').addClass('searchOptShow');			
		} else if ($(this).hasClass('seachOptTypeClose')) {
	        $(this).removeClass('seachOptTypeClose');
	        $(this).addClass('seachOptTypeOpen');
	        $(this).html('<span>상세 검색 열기</span>');
	        $('.searchBaseDN').removeClass('searchOptShow');			
		} else {
			$(".searchOptBox .searchOpt").slideUp(200);
			$(".searchOptBox").removeClass('on');
			setTimeout(function(){
				$('.btn_optBoxOpen').focus();
			})			
		}		
	});

	$(".boardOptBox .optBox .typeView .typeList").click(function(){
		if(!$(this).hasClass('on')){
			$(this).addClass('on');
			$(".boardOptBox .optBox .typeView .typeThumb").removeClass('on')
		}
	});
	$(".boardOptBox .optBox .typeView .typeThumb").click(function(){
		if(!$(this).hasClass('on')){
			$(this).addClass('on');
			$(".boardOptBox .optBox .typeView .typeList").removeClass('on')
		}
	});

	// selectTab Active
	function Page__updateIndicatorActive() {
		var scrollTop = $(window).scrollTop();
		
		$($('.typeSelect').get().reverse()).each(function(index, node) {
			var $node = $(this);
			var offsetTop = parseInt($node.attr('data-offset-top')) - 150;
			
			if ( scrollTop >= offsetTop ) {
				// 기존 녀석에게 활성화 풀고
				$('#selectTab ul>li>a').removeClass('on').attr('title','');
				
				// 해당하는 녀석에게 활성화 넣고
				var currentPageIndex = $('.typeSelect').index(this);
				
				$('#selectTab>ul>li').eq(currentPageIndex).find('a').addClass('on').attr('title','선택됨');
				
				$('html').attr('data-current-page-index', currentPageIndex);
				// $node.attr('title',currentPageIndex);
				
				return false;
			}
		});
	}
	
	// 각 페이지의 offsetTop 속성을 업데이트
	function Page__updateOffsetTop() {
		$('.typeSelect').each(function(index, node) {
			var $page = $(node);
			var offsetTop = $page.position().top;
			
			$page.attr('data-offset-top', offsetTop);
		});
		
	// 계산이 바뀌었으니까, 다시 상태 업데이트
	Page__updateIndicatorActive();
	}
	
	function Page__init() {
		Page__updateOffsetTop();
	}
	
	// 초기화
	Page__init();
	
	// 화면이 리사이즈 할 때 마다, offsetTop을 다시계산
	$(window).resize(Page__updateOffsetTop);
	
	// 스크롤이 될 때 마다, 인디케이터의 상태를 갱신
	$(window).scroll(Page__updateIndicatorActive);


	/*** Contents ***/
	/*top sitemap*/
	$("header .gnb_util .btn_sitemap").click(function(){
		$("html").css('overflow','hidden');
		$("body").css('overflow','hidden');
		$("#gnb_dim").addClass('on');
		$(".sitemapBox_reN").addClass('on').removeClass('off');
		$('.sitemapBox_reN .map_gnb li:first-child a').focus();
		return false;
	});

	$(".sitemapBox_reN .btn_close").click(function(){
		$("html").css('overflow','');
		$("body").css('overflow','');

		$("#gnb_dim").removeClass('on');

		$(".sitemapBox_reN").addClass('off').removeClass('on');
	});

	function sitemapClose(){
		if(window.innerWidth <= 1041){
			if( $('.sitemapBox_reN').hasClass('on') ){
				$("html").css('overflow','');
				$(".sitemapBox_reN").addClass('off').removeClass('on');
				$("#gnb_dim").removeClass('on');
			}
		}
	}

	/* tab */
	function tab_w(){
		if(window.innerWidth >= 1041){
			$("#pageTab li").css({
				"width": (100 / $("#pageTab li").length) + "%"
			});
		}else{
			$("#pageTab li").css({
				"width": ""
			});
		}

		if(window.innerWidth >= 1041){
			$("#pageTab02 li").css({
				"width": (100 / $("#pageTab02 li").length) + "%"
			});
		}else{
			$("#pageTab02 li").css({
				"width": ""
			});
		}

		if(window.innerWidth >= 1041){
			$("#contTab_line li").css({
				"width": (100 / $("#contTab_line li").length) + "%"
			});
		}else{
			$("#contTab_line li").css({
				"width": ""
			});
		}

		$("#contTab_fix li").each(function(){
			if(window.innerWidth >= 1041){
				$(this).css({
					"width": (100 / $("#contTab_fix li").length) + "%"
				});
			}else{
				$(this).css({
					"width": ""
				});
			}
		});
		
	}

	/* 모바일 탭 슬라이드 전환 */
	function mbSlickTab(){
		if(window.innerWidth < 1041){
			var tabNum = $('#pageTab .tabList>li').length;

			if(tabNum > 2){
				var on = $('#pageTab .tabList li').find('.on').parent('li').index();
				$('#pageTab').sly({
					horizontal: 1,
					itemNav: 'centered', 
					speed: 300,
					smart: 1,
					activateOn: 'click',
					mouseDragging: 1,
					touchDragging: 1,
					activateMiddle: 1,
					releaseSwing: 1,
					activeClass: 'active',
					startAt: on
				});

				setTimeout(function(){
					$('#pageTab ul').css('width', function(i){
						return $(this).width() + 80;
					});
				},100)
				
			}
		}else{
			$('#pageTab').sly(false);
			$('#pageTab .tabList').css('width','100%');
		}
	}

	

	function mbSlickTab02(){
		if(window.innerWidth <= 1041){
			var tabNum = $('#contTab_line .tabList>li').length;

			if(tabNum > 1){
				var on = $('#contTab_line .tabList li').find('.on').parent('li').index();
				
				$('#contTab_line:not(.nTab)').sly({
					horizontal: 1,
					itemNav: 'centered', 
					speed: 300,
					smart: 1,
					activateOn: 'click',
					mouseDragging: 1,
					touchDragging: 1,
					activateMiddle: 1,
					releaseSwing: 1,
					activeClass: 'active',
					startAt: on
				});

				setTimeout(function(){
					$('#contTab_line:not(.nTab) ul').css('width', function(i){
						return $(this).width() + 70;
					});
				},300)
			}
		}else{
			$('#contTab_line:not(.nTab)').sly(false);
			$('#contTab_line:not(.nTab) .tabList').css('width','100%');
		}
	}

	function mbSlickTab03(){
		if($('.selectTab_wrap').length){
			$('.selectTab_wrap').css('height', $('#selectTab').height())

			if(window.innerWidth <= 1041){
				var totalTabWidth = 0; 
				var set = $('#selectTab>ul>li');
				set.each(function(){
					totalTabWidth = totalTabWidth + $(this).width();
				})
				var tabNum = $('#selectTab>ul>li').length;
	
				if(window.innerWidth < totalTabWidth){
					var on = $('#selectTab>ul>li').find('.on').parent('li').index();
					$('#selectTab').sly({
						horizontal: 1,
						itemNav: 'centered', 
						speed: 300,
						smart: 1,
						activateOn: 'click',
						mouseDragging: 1,
						touchDragging: 1,
						activateMiddle: 1,
						releaseSwing: 1,
						activeClass:  'active',
						startAt: on
					});
					
				}
			}else{
				$('#selectTab').sly(false);
				$('#selectTab ul').css('width','100%');
			}
		}
	}

	mbSlickTab();
	mbSlickTab02();
	mbSlickTab03();

	// Select tab
	// $('.lineList_v.typeSelect').attr('tabindex','0');

	$(document).on("click", "#selectTab>ul>li>a", function () {
		if($('.typeSelect').length > 0){
			var selectIndex = $(this).parent('li').index();
			var selctCont_t = $('.typeSelect').eq(selectIndex).offset().top;
			
			$('#selectTab>ul>li>a').removeClass('on').attr('tabindex','');
			$(this).addClass('on').attr('title','선택됨')

			if(window.innerWidth >= 1041){
				$("html, body").stop().animate({
					scrollTop : selctCont_t - 290
				}, 150);
			}else{
				$("html, body").stop().animate({
					scrollTop : selctCont_t - 224
				}, 150);
			}
		}
	});

	/* Footer*/
	// top버튼
	$("#btn_top").click(function(){
		$("html, body").stop().animate({
			scrollTop : 0
		}, 300);
//		console.log('####');
		
		setTimeout(function(){
			$('#skip_menu').attr('tabindex', '1');
			$('#skip_menu').eq(0).focus();
			$('#skip_menu').eq(0).blur();
			$('#skip_menu').attr('tabindex', '-1');
			return false;
		})
//		$(this).blur();
	});
	
	$(window).on('load resize', function () {
		// your code
		mbSlickTab();
		mbSlickTab02();
		mbSlickTab03();
		gnbEtcWrap()

		/** 해제 **/
		mBtnClose();//모바일메뉴
		sitemapClose(); // sitemap
	});

	/*** 접근성 ***/
	$("#skip_menu a").focusin(function(){
		$("#contents").attr('tabindex','0');
		$("#gnb").attr('tabindex','0');
		$("#footer").attr('tabindex','0');
		typeKeyNav = 1;
	});

	$("#skip_menu").focusout(function(){
		$("#contents").removeAttr('tabindex');
		$("#gnb").removeAttr('tabindex');
		$("#footer").removeAttr('tabindex');
	});

	//20241129접근성 수정
	$('#skip_menu a').click(function (){
		if($(this).index() == 0) {
//			$('#header').css('position', 'static');
//			$('#container').css('padding-top', '0');
		}
	});

	$(".top_link .moreSiteArea .btn_close").keydown(function(event){
		var v_keyCode = event.keyCode || event.which;
	
		if(v_keyCode == 9){
			if(!event.shiftKey){
				$(".top_link .moreSiteArea ul li:first-child").find('a').focus();
				return false;
			}
		}
	});

	/*gnb*/

	//gnbON
	$("#gnb>li>a").focusin(function(){
		$(this).trigger('mouseover');
	});
	
	$("#gnb .menuM>li>a").focusin(function(){
		$(this).trigger('mouseover');
	});
	
	$("#gnb .menuS>li>a").focusin(function(){
		$(this).trigger('mouseover');
	});

	$("#gnb .menuSS>li>a").focusin(function(){
		$(this).trigger('mouseover');
	});
	
	$("#gnb>li>a").keydown(function(event){
		var gnb_loc = $(this).parent('li').index();
		var v_keyCode = event.keyCode || event.which;
		if(v_keyCode == 9){
			if(event.shiftKey){
				if(gnb_loc > 0){
					$(this).parent('li').prev('li').find('a').first().trigger('mouseover');
					if($(this).prev('li').hasClass('child')){
						if($("header>nav #gnb>li:nth-child(" + gnb_loc + ") .menuM>li:last-child").hasClass('child')){
							$("header>nav #gnb>li:nth-child(" + gnb_loc + ") .menuM>li:last-child .menuS>li:last-child").find('a').first().focus();
							return false;
						}else{
							$("header>nav #gnb>li:nth-child(" + gnb_loc + ") .menuM>li:last-child").find('a').first().focus();
							return false;
						}
					}
				}else{
					$(this).trigger('mouseleave');
					$("header .logo>a").focus();
					return false;
				}
			}
		}
	});

	//gnb Off
	$("header .logo>a").on('focusout', function(e){
		$(this).trigger('mouseleave');
	});

	/*
	*GBN 하위 메뉴중 display:none 을 제외한 마지막 객체 제어
	*/
	//Show, hide 상태 검증 변수 브라우저별 display:none 띄워쓰기 달라서 경우의 수에 따라 검증 범위 확장
	var TargetState = "[style*='display:none'], [style*='display: none'], [style*='display :none'], [style*='display : none']";

	$("header>nav #gnb>li").not(TargetState).last().find(".menuM>li").not(TargetState).last().find(".menuS>li").not(TargetState).last().on('focusout', function(e){
		// $(this).trigger('mouseleave');
	});

	$("header>nav #gnb>li").not(TargetState).last().find(".menuM>li").not(TargetState).last().on('focusout', function(e){
		if(!$(this).hasClass("child")){
			// $(this).trigger('mouseleave');
		}
	});

	$(".gnb_infoArea .siteZone>ul>li:last-child>a").on('focusout', function(e){
		if(!$(this).hasClass("child")){
			$(this).trigger('mouseleave');
		}
	});


	//사이트맵 팝업
	$(".sitemapBox_reN .btn_close").keydown(function(event){
		var v_keyCode = event.keyCode || event.which;
	
		if(v_keyCode == 13){
			$("header .gnb_util .btn_sitemap").focus();
			$(".sitemapBox_reN .btn_close").trigger('click');
			return false;
		}

		if(v_keyCode == 9){
			if(!event.shiftKey){
				$('.sitemapBox_reN .map_gnb li:first-child').find('a').focus();
				return false;
			}
		}
	});

	$('.sitemapBox_reN .map_gnb li:first-child a').keydown(function(event){
		var v_keyCode = event.keyCode || event.which;
	
		if(v_keyCode == 9){
			if(event.shiftKey){
				$('.sitemapBox_reN .btn_close').focus()
				return false;
			}
		}
	});
	
	// 모바일 접근성
	$(window).bind('load resize', function(){
		if($(window).innerWidth() <= 1041){
			
			//gnb
			$("header .logo a").keydown(function(event){
				var v_keyCode = event.keyCode || event.which;
				if(v_keyCode == 9){
					if(!event.shiftKey){
						$('header .gnb_util .btn_search').focus();
						return false;
					}
				}
			});

			// bookmark
			$('.snb_bookmark .list .unit').attr('aria-hidden','false');
			$('.snb_bookmark .list .unit a').attr('tabindex','0');

			// tab
			$('#pageTab .slick-slide').attr('aria-hidden','false');
			$('#pageTab .slick-slide a').attr('tabindex','0');
			$('#contTab_line .slick-slide').attr('aria-hidden','false');
			$('#contTab_line .slick-slide a').attr('tabindex','0');
		}else{
			$("#header nav").show();
		}
	});
});

