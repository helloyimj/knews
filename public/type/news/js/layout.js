$(function(){
	/*** 상단 버튼 ***/
	$('.top_util .btn_kotraSite').click(function(){
		if($(this).hasClass('on')){
			$(this).removeClass('on');
			$(this).parents('#header').removeClass('kotraSiteOn');
			$(this).attr('title','KOTRA 내부사이트 열기');
		}else{
			$(this).addClass('on');
			$(this).parents('#header').addClass('kotraSiteOn');
			$(this).attr('title','KOTRA 내부사이트 닫기')
		}
	});

	$('.top_util .moreSiteArea .btn_close').click(function(){
		$('.top_util .btn_kotraSite').trigger('click');
	});

	/*** GNB ***/
	/*gnb*/
	var gnbCrt0 = $("#gnb>li:nth-child(" + (gnbDep1) + ")>a");
	var gnbCrt1 = $("#gnb>li:nth-child(" + (gnbDep1) + ")>a");
	var gnbCrt2 = $("#gnb>li:nth-child(" + (gnbDep1) + ")>ul>li:nth-child(" + (gnbDep2) + ")");
	var gnbCrt3 = $("#gnb>li:nth-child(" + (gnbDep1) + ")>ul>li:nth-child(" + (gnbDep2) + ")>ul>li:nth-child(" + (gnbDep3) + ")");
	/*var snbCrt1 = $("#snb>li:nth-child(" + (gnbDep1) + ")>a");
	var snbCrt2 = $("#snb>li:nth-child(" + (gnbDep1) + ")>ul>li:nth-child(" + (gnbDep2) + ")>a");
	var snbCrt3 = $("#snb>li:nth-child(" + (gnbDep1) + ")>ul>li:nth-child(" + (gnbDep2) + ")>ul>li:nth-child(" + (gnbDep3) + ")>a");*/

	if(gnbCrt0) gnbCrt0.addClass("on");
	if(gnbCrt1) gnbCrt1.addClass("on");
	if(gnbCrt2) gnbCrt2.addClass("on");
	if(gnbCrt3) gnbCrt3.addClass("on");

	/*if(snbCrt1) snbCrt1.parent().addClass("on");
	if(snbCrt2) snbCrt2.parent().addClass("on");
	if(snbCrt3) snbCrt3.parent().addClass("on");*/

	/*function gnbW(){
		if(window.innerWidth >= 1041){
			$("header>nav #gnb>li").css({
				"width": (100 / ($("#gnb>li").length - $("#gnb>li:hidden").length)) + "%"
			});
		}
	}*/

	$("#gnb>li>a").mouseover(function(){
		if(window.innerWidth >= 1041){
			//$("#header").removeClass("gnbOn");
			$("#gnb>li>a, #gnb>li>.gnbTit, #gnb>li>.menuM").removeClass('act');

			$("#header").css("height","");
			$(".gnbTit").css("height","");

			$("#header").addClass("gnbOn");
			$("#gnb_dim").addClass("on");
			$(this).addClass('act');
			$(this).siblings().addClass('act');

			if($(this).parent('li').hasClass('child')){
				if($(this).siblings('.menuM').height() > 125){
					$("#header").height($(this).siblings('.menuM').height() + 153);
				}else{
					$("#header").height(230);
				}
				$(this).siblings('.gnbTit').height($(this).siblings('.menuM').height() + 100);
			}else{
				$("#header").removeAttr('style');
			}

			$(this).siblings('.menuStep').children('li').css({
				"width": (100 / $(this).siblings('.menuStep').children('li').not('.emptyArea').length) + "%"
			});
		};
	});

	$("#header").mouseleave(function(){
		if(window.innerWidth >= 1041){
			$("#header").removeClass("gnbOn").removeAttr('style');
			$("#gnb_dim").removeClass("on");
			$("#gnb>li>a").removeClass('act');
			$("#gnb, #gnb .gnbTit, #gnb .menuM").removeClass('act');
			$("#gnb, #gnb .gnbTit, #gnb .menuM>li").removeClass('act').removeAttr('style');
		}
	});

	/*mobile*/
	function menuM(){
		if(window.innerWidth < 1041){
			var depOneLength = $('header>nav #gnb>li:visible').length;

			// $("header>nav #gnb li>ul.menuM").css({
			// 	"top": 54 * (Math.ceil(depOneLength / 4))
			// });

			if($('body').hasClass('typeTopNotice')){
				// 상단배너 있는 경우
				$("header>nav #gnb ul.menuM").css({
					"height": window.innerHeight - 294
				});
			}else{
				$("header>nav #gnb ul.menuM").css({
					"height": window.innerHeight - 209
				});
			}
		}else{
			// $("header>nav #gnb li>ul.menuM").css('top','');
			$("header>nav #gnb li>ul.menuM").css('height','')
		}
	}

	function menuS(){
		if(window.innerWidth < 1041){
			var depOneLength = $('header>nav #gnb>li:visible').length;
			var depOneHeight = 54 * (Math.ceil(depOneLength / 4))

			// $("header>nav #gnb li>ul.menuS").css({
			// 	"top": depOneHeight
			// });

			$("header>nav #gnb li>ul.menuS").css({
				"height": window.innerHeight - depOneHeight - 52 - 80
			});
		}else{
			// $("header>nav #gnb li>ul.menuS").css('top','')
			$("header>nav #gnb li>ul.menuS").css('height','')
		}
	}

	function mbMenuResult(){
		if(window.innerWidth < 1041){
			$(".typeSearchResult .m_searchResult").css({
				"height": window.innerHeight - 220
			});
		}
	}
	
	menuM();
	menuS();

	$("header .mBtn_topMenu").click(function(){
		if(window.innerWidth < 1041){
			$(this).nextAll("nav").show();
			$("header>nav #gnb").removeAttr('style')//reset
			$("header>nav #gnb ul.menuM>li").removeClass('act');//reset
			$("header>nav #gnb .on").addClass('act');//reset
			$("header>nav #gnb li.on>.menuSS").slideDown(0);//reset

			$("#gnb_dim").addClass('on');
			$("#header").addClass('gnbOn');
			$("header>nav #gnb").css({
				"height": window.innerHeight - $("#header").height()
			});

			menuM();

			$('body').css('overflow','hidden');
		}
	});

	$("header>nav #gnb>li>a").click(function(){
		if(window.innerWidth < 1041){
			if($(this).parent('li').hasClass('child')){
				$("header>nav #gnb li").removeClass('act');//reset
				$("header>nav #gnb li.on>.menuSS").slideDown(0);//reset

				/*if(!$(this).hasClass('act') && !$(this).hasClass('on')){
					$("header>nav #gnb ul.menuM>li:first-child").addClass('act');
				}*/

				if($(this).parent('li').hasClass('child')){
					if(!$(this).hasClass('act')){
						$("header>nav #gnb>li>a.act").removeClass('act');
						$(this).addClass('act');
					}
				}

				$("header>nav #gnb li.on").addClass('act');

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
				$(this).parent('li').addClass('act');

				return false;
			}else if($(this).parent('li').attr('class') == 'child act'){
				$(this).parent('li').removeClass('act');

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
				$("header>nav #gnb .menuSS").slideUp(200);
				$(this).parent('li').addClass('act');
				$(this).siblings('.menuSS').slideDown(200);

				return false;
			}else if($(this).parent('li').attr('class') == 'child act' || $(this).parent('li').attr('class') == 'child on act'){
				$(this).parent('li').removeClass('act');
				$(this).siblings('.menuSS').slideUp(200);

				return false;
			}else{
				return true;
			}
		}
	});


	$("header .mBtn_close").click(function(){
		mBtnClose();
	});

	function mBtnClose(){
		$("#gnb_dim").removeClass('on');
		$("#header").removeClass('gnbOn');
		$("header>nav #gnb li").removeClass('act');
		$('body').css('overflow','visible');

		if(window.innerWidth < 1041){
			setTimeout(function(){
				$("#header nav").hide();
			},300);
		}else{
			$("#header nav").show();
		}
	}

	/*** Footer ***/
	// top버튼
	$("#btn_top").click(function(){
		$("html, body").stop().animate({
			scrollTop : 0
		}, 150);
		setTimeout(function(){
			$('header a').eq(0).focus();
		})
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
			$("#footer .familySite").removeClass('on');
		}else{
			$("#footer .familySite").addClass('on');
		}
	});

	// if($(".pop_wrap .popConts").find('.limit').length > 0){
	// 	$(".pop_wrap .popConts .limit").mCustomScrollbar();
	// }

	var conts_loc;
	$(window).scroll(function(){
		conts_loc = $(window).scrollTop();
		
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

	});

	/*** Snb / Pnb / option ***/
	function pnb_btnTit(){
		$("#pnb .pnb_menu .pnbList .menu_txt").css({
			"width": $("#pnb .pnb_menu .pnbList").width() - $("#pnb .pnb_menu .pnbList .menu").width() - 10
		});
	}

	$("#pnb .pnb_menu .pnbList .btnTit").attr('title','열기');
	$("#pnb .pnb_menu .pnbList .btnTit").click(function(){

		if($("#pnb .pnb_nav .navList .menu>ul").hasClass('on')){
			$("#pnb .pnb_nav .navList .menu>ul").removeClass('on');
			$("#pnb .pnb_nav .navList .menu>ul").slideUp(200);
			$('#pnb .pnb_nav .navList .btnTit').attr('title','열기');
		}

		if($("#pnb .pnb_menu .pnbList").hasClass('on')){
			$("#pnb .pnb_menu .pnbList").removeClass('on');
			$("#pnb .pnb_menu .pnbList .menu>ul").slideUp(200);
			$(this).attr('title','열기');
		}else{
			$("#pnb .pnb_menu .pnbList").addClass('on');
			$("#pnb .pnb_menu .pnbList .menu>ul").slideDown(200);
			$(this).attr('title','닫기');
		}
	});
	
	$("#pnb .pnb_nav .navList .btnTit").attr('title','열기');
	$("#pnb .pnb_nav .navList .btnTit").click(function(){
		if($("#pnb .pnb_menu .pnbList").hasClass('on')){
			$("#pnb .pnb_menu .pnbList").removeClass('on');
			$("#pnb .pnb_menu .pnbList .menu>ul").slideUp(200);
			$("#pnb .pnb_menu .pnbList .menu .btnTit").attr('title','열기');
		}
		
		$("#pnb .pnb_nav .navList .btnTit").not(this).siblings('ul').removeClass('on');
		$("#pnb .pnb_nav .navList .btnTit").not(this).siblings('ul').slideUp(200);
		$("#pnb .pnb_nav .navList .btnTit").not(this).attr('title','열기');
		
		if($(this).siblings('ul').hasClass('on')){
			$(this).siblings('ul').removeClass('on');
			$(this).siblings('ul').slideUp(200);
			$(this).attr('title','열기');
		}else{
			$(this).siblings('ul').addClass('on');
			$(this).siblings('ul').slideDown(200);
			$(this).attr('title','닫기');
		}
	});

	$("#pnb .pnb_func .btn_share").click(function(){
		$(this).addClass('on');
		$("#pnb .pnb_func .shareBox").addClass('on');
		$('#pnb .pnb_func .shareBox').attr('tabindex','-1');
		setTimeout(function(){
			$('#pnb .pnb_func .shareBox').focus();
		}, 300)
	});

	$("#pnb .pnb_func .shareBox .btn_close").click(function(){
		$("#pnb .pnb_func .shareBox").removeClass('on');
		$("#pnb .pnb_func .btn_share").removeClass('on');
		setTimeout(function(){
			$('#pnb .pnb_func .btn_share').focus();
		}, 300)
	});

	$("#pnb .pnb_func .btn_bookmark").click(function(){
		if( $(this).hasClass('on')  ){
			$("#pnb .pnb_func .btn_bookmark").removeClass('on');
			$("#pnb .pnb_func .btn_bookmark").attr('title','북마크 선택 안됨')
		}else{
			$("#pnb .pnb_func .btn_bookmark").addClass('on');
			$("#pnb .pnb_func .btn_bookmark").attr('title','북마크 선택됨')
		}
	});

	$(".searchOptBox .boxBtn .btn_optBoxOpen").click(function(){
		$(".searchOptBox").addClass('on');
		$(".searchOptBox .searchOpt").slideDown(200);

		$("#pnb .pnb_menu .pnbList.on .btnTit").trigger('click');
		$("#pnb .pnb_func .shareBox").removeClass('on');
	});

	/* 2024-07-17 상세검색 열기닫기 변경 */
	$(".searchOptBox .boxBtn .btn_optBoxClose").click(function(){
		if($(this).hasClass('seachOptTypeOpen')) {
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

	/*** Contents ***/
	/*top sitemap*/
	var sitemapPrevLoc
	$("header .gnb_util .btn_sitemap").click(function(){
		sitemapPrevLoc = conts_loc;
		var siteMapInnerH= $('.map_nav').height();
		var siteMapLastH= $('.sitemapBox #sitemap>li:last-child .menuM').height();
		
		$("html").css('overflow','hidden');
		$("body").css('overflow','hidden');

		$('.sitemapBox #sitemap>li:last-child').css('height', siteMapInnerH - siteMapLastH)

		$("#dim").addClass('on');
		$(".sitemapBox").addClass('on').removeClass('off');
	});
	
	$(".sitemapBox .btn_close").click(function(){
		$("html").css('overflow','');
		$("body").css('overflow','');
		$("html, body").animate({
			scrollTop: sitemapPrevLoc
		}, 0);

		$(".sitemapBox").addClass('off').removeClass('on');
		$("#dim").removeClass('on');
	});

	function sitemapClose(){
		if(window.innerWidth <= 1041){
			if( $('.sitemapBox').hasClass('on') ){
				$("html").css('overflow','');
				$("html, body").animate({
					scrollTop: sitemapPrevLoc
				}, 0);
				$(".sitemapBox").addClass('off').removeClass('on');
				$("#dim").removeClass('on');
			}
		}
	}

	$("header .gnb_util .totalSearchArea .btn_searchOpt").click(function(){
		if( $('.search_opt').hasClass('on') ){
			$('.search_opt').removeClass('on');
		}else{
			$('.search_opt').addClass('on');
		}
	});

	$("header .gnb_util .totalSearchArea .search_opt ul button").click(function(){
		$('.search_opt').removeClass('on');
	});

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
		if(window.innerWidth <= 1041){
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
					activeClass:  'active',
					startAt: on
				});
				// var frame = new Sly('#pageTab', options).init();

				setTimeout(function(){
					$('#pageTab ul').css('width', function(i){
						return $(this).width() + 80;
					});
				},100)
				
			}
		}else{
			$('#pageTab').sly(false);
			$('#pageTab .tabList').css('width','auto');
		}
	}

	

	function mbSlickTab02(){
		if(window.innerWidth <= 1041){
			var tabNum = $('#contTab_line .tabList>li').length;

			if(tabNum > 1){
				var on = $('#contTab_line .tabList li').find('.on').parent('li').index();
				$('#contTab_line').sly({
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
				// var frame = new Sly('#contTab_line', options).init();

				setTimeout(function(){
					$('#contTab_line ul').css('width', function(i){
						return $(this).width() + 70;
					});
				},300)
			}
		}else{
			$('#contTab_line').sly(false);
			$('#contTab_line .tabList').css('width','100%');
		}
	}

	$(window).bind('load resize', function(){
		pnb_btnTit();
		mbSlickTab();
		mbSlickTab02();
		mbMenuResult();
		// tab_w();

		/** 해제 **/
		mBtnClose();//모바일메뉴
		sitemapClose(); // sitemap
	});

    window.onorientationchange = function() {
        var orientation = window.orientation;
        switch(orientation) {
        case 0:
            //alert('세로모드. 홈버튼이 아래쪽');
            window.location.reload();
            break;
        case 90:
            //alert('가로모드. 홈버튼이 오른쪽.');
            window.location.reload();
            break;
        case -90:
            //alert('가로모드. 홈버튼이 왼쪽.');
            window.location.reload();
            break;
        }
    }

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

	$(".top_util .moreSiteArea .btn_close").keydown(function(event){
		var v_keyCode = event.keyCode || event.which;
	
		if(v_keyCode == 9){
			if(!event.shiftKey){
				$(".top_util .moreSiteArea ul li:first-child").find('a').focus();
				return false;
			}
		}
	});

	/*gnb*/

	//gnbON
	$("#gnb>li>a").focusin(function(){
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
						$(".top_util .btn_goDream").focus();
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
		$(this).trigger('mouseleave');
	});

	$("header>nav #gnb>li").not(TargetState).last().find(".menuM>li").not(TargetState).last().on('focusout', function(e){
		if(!$(this).hasClass("child")){
			$(this).trigger('mouseleave');
		}
	});

	$('header .gnb_util button:last-child').on('focusout', function(e){
		$(this).trigger('mouseleave');
	});

		//사이트맵 팝업
		$(".sitemapBox .btn_close").keydown(function(event){
			var v_keyCode = event.keyCode || event.which;
		
			if(v_keyCode == 13){
				$("header .gnb_util .btn_sitemap").focus();
				$(".sitemapBox .btn_close").trigger('click');
				return false;
			}
	
			if(v_keyCode == 9){
				if(!event.shiftKey){
					$('.sitemapBox .map_gnb li:first-child').find('a').focus();
					return false;
				}
			}
		});
	
		$('.sitemapBox .map_gnb li:first-child a').keydown(function(event){
			var v_keyCode = event.keyCode || event.which;
		
			if(v_keyCode == 9){
				if(event.shiftKey){
					$('.sitemapBox .btn_close').focus()
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
							$('header .top_util a:first-child').focus();
							return false;
						}
					}
				});
	
				$("header .gnb_util .btn_mypage").keydown(function(event){
					var v_keyCode = event.keyCode || event.which;
	
					if(v_keyCode == 9){
						if(!event.shiftKey){
							$('header .mBtn_topMenu').focus();
							return false;
						}
					}
				});
	
				$("header .gnb_util .btn_login").keydown(function(event){
					var v_keyCode = event.keyCode || event.which;
	
					if(v_keyCode == 9){
						if(!event.shiftKey){
							$('header .mBtn_topMenu').focus();
							return false;
						}
					}
				});
	
				//mVisual
				$("header .mBtn_topMenu").keydown(function(event){
					var v_keyCode = event.keyCode || event.which;
	
					if(v_keyCode == 9){
						if(event.shiftKey){
							if($('header .gnb_util .btn_mypage').length > 0){
								$('header .gnb_util .btn_mypage').focus();
								return false;
							}else{
								$('header .gnb_util .btn_search').focus();
								return false;
							}
						}else{
							$('#container').find('a').first().focus();
						}
					}
				});
	
				$("header .gnb_util .btn_search").keydown(function(event){
					var v_keyCode = event.keyCode || event.which;
	
					if(v_keyCode == 9){
						if(event.shiftKey){
							$('header .logo a').focus();
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

	//pnb
	$("#pnb .pnb_func .shareBox .btn_close").keydown(function(event){
		var v_keyCode = event.keyCode || event.which;
		if(v_keyCode == 9){
			if(!event.shiftKey){
				$('.shareBox_wrap ul li:first-child').find('a').focus()
				return false;
			}
		}
	});

	$('.shareBox_wrap ul li:first-child a').keydown(function(event){
		var v_keyCode = event.keyCode || event.which;
		if(v_keyCode == 9){
			if(event.shiftKey){
				$("#pnb .pnb_func .shareBox .btn_close").focus()
				return false;
			}
		}
	});


	// As-is 스크립트 (탑배너)
	$('.new_header_19 .btn_more').click(function(){
		$('div.pop_home').slideDown(200);
	});
										
	$('div.pop_home p').hover(function(){
		$(this).addClass('on');
		$(this).find('.btn_s').hide();
		$(this).find('.btn_o').show();
	});			
	
	$('div.pop_home p').mouseout(function(e){
		$(this).siblings('p').removeClass('on');
		$(this).siblings('p').find('.btn_o').hide();
		$(this).siblings('p').find('.btn_s').show();							
	});		
	
	$('div.home_box').hover(function(){
		var btnOn = $('div.pop_home p.on');
		btnOn.removeClass('on');
		if( btnOn ){
			btnOn.find('.btn_o').hide();
			btnOn.find('.btn_s').show();
		}						
	});			
	
	$('div.home_box .btn_close').click(function(){
		var btnOn = $('div.pop_home p.on');
		btnOn.removeClass('on');
		if( btnOn ){
			btnOn.find('.btn_o').hide();
			btnOn.find('.btn_s').show();
		}				
		
		$('div.pop_home').slideUp(200);
	});	

});
