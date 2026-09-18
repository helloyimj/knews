var frameBtnObj;

function setHref(obj, org){
	if($(obj).find("> div").length > 0){
		if($(obj).find("> div> ul > li:not('.emptyArea')").length > 0){
			if($(obj).find(">a").data("sub")=="Y"){
				$(org).find(">a").attr("href",$(obj).find("> div> ul > li:not('.emptyArea'):eq(0) > a").attr("href"));
				$(org).find(">a").attr("target",$(obj).find("> div> ul > li:not('.emptyArea'):eq(0) > a").attr("target"));
				
				setHref($(obj).find("> div> ul > li:not('.emptyArea'):eq(0)"),org);
			}else{
				$(org).find(">a").attr("href",$(org).find(">a").attr("href"));
			}
		}
	}else{
		if($(obj).find("> ul > li:not('.emptyArea')").length > 0){
			if($(obj).find(">a").data("sub")=="Y"){
				$(org).find(">a").attr("href",$(obj).find("> ul > li:not('.emptyArea'):eq(0) > a").attr("href"));
				$(org).find(">a").attr("target",$(obj).find("> ul > li:not('.emptyArea'):eq(0) > a").attr("target"));
				
				setHref($(obj).find("> ul > li:not('.emptyArea'):eq(0)"),org);
			}else{
				$(org).find(">a").attr("href",$(org).find(">a").attr("href"));
			}
		}
	}
	
}

$(function(){
	$(document).on("click", "ul#gnb li, ul#snb li", function(){
		setHref($(this),$(this));
	});
	 
	$(document).on("click", ".navList>.menu>ul>li>a", function(){
		var val = $(this).data('menuno');
		$("ul#gnb li").find('.'+val).closest('li').trigger('click');
		if($("ul#gnb li").find('.'+val).attr('target') == "_blank"){
			window.open($("ul#gnb li").find('.'+val).attr('href'));
		}else{
			location.href = $("ul#gnb li").find('.'+val).attr('href'); 			
		} 
	});
	
	$(document).on("click", ".pnbList>.menu>ul>li>a", function(){
		var val = $(this).data('menuno');
		$("ul#gnb li").find('.'+val).closest('li').trigger('click');
		if($("ul#gnb li").find('.'+val).attr('target') == "_blank"){
			window.open($("ul#gnb li").find('.'+val).attr('href'));
		}else{
			location.href = $("ul#gnb li").find('.'+val).attr('href'); 			
		}
// 		$("ul#gnb li").find('.'+val).get(0).click();
	});
		
	if($('#gnb li.on').parents('ul').hasClass('menuS')){
		gnbDep1 = $('#gnb > li').index($('#gnb li.on').parents('ul.menuM').parent())+1;
		gnbDep2 = $('#gnb li.on').parents('ul.menuM').find('>li').index($('#gnb li.on').parents('ul.menuS').parent())+1;
		gnbDep3 = $('#gnb li.on').parents('ul.menuS').find('>li').index($('#gnb li.on'))+1;
	}else if($('#gnb li.on').parents('ul').hasClass('menuM')){
		gnbDep1 = $('#gnb > li').index($('#gnb li.on').parents('ul.menuM').parent())+1;
		gnbDep2 = $('#gnb li.on').parents('ul.menuM').find('>li').index($('#gnb li.on'))+1;
	}else{
		gnbDep1 = $('#gnb > li').index($('#gnb li.on'))+1;
	}
	$('.sVisual strong').text($('#gnb li.on > a').text());
	
	$(document).on('click', '.btn_logout, .btn_topLogout', function(){
		frameBtnObj = $(this);
		$("body").css("overflow-y","hidden");
		$('<iframe id="iframeLogoutPop" src="/kotranews/cms/frCom/actionLogoutPop.do" class="pop_iframe on" height="100%" scrolling="no" frameborder="0" title="로그아웃 팝업"/>').appendTo($("body #container"));
	});
	
	$(document).on('click', '.btn_login, .btn_topLogin', function(){
		//뉴스
		//location.href = "/kotranews/login/topUtilLink.do?pRetUrl=" + encodeURIComponent(window.location.pathname + window.location.search);
		sessionStorage.setItem('newsLogin', 'newsLogin');
		location.href = "https://www.kotra.or.kr/membership/membershipLoginForm.do?siteName=kn"
	});
	
	$(document).on('click', '.btn_mypage', function(){
		location.href = "/dream/mypage/topUtilLink.do";
	});
	
	$(document).on('click', '.gnb_util .btn_search', function(){
		var pSearchTxt = $('.search_inp').val()
		
		fn_comm_ajax({
			url : "/ajaxf/totalSearch/getStopWordList.do",
			data : {},
			dataType : "json",
			async : false,
			success : function(data) {
				if (null != data && '' != data) {
					for(var i=0; i < data.length; i++){
						if(pSearchTxt == data[i].BAN_WORD){
							alert('\''+data[i].BAN_WORD+'\''+'은(는)'+' 검색할 수 없는 단어입니다.');
							return false;
						}
					}
				}
				
				$("#searchForm").find('[name=searchTxt]').val($('.search_inp').val());
				$("#searchForm").find('[name=tDiv]').val($('.search_opt .btn_searchOpt').val());
				$("#searchForm").find('[name=pRetUrl]').val((window.location.pathname + window.location.search));
				$("#searchForm").submit();
			}
		});
	});
	
	$(document).on('click', '.search_opt > ul > li > button', function(){
		var sVal = $(this).val();
		var sText = $(this).text();
		$('.search_opt .btn_searchOpt').val(sVal);
		$('.search_opt .btn_searchOpt').text(sText);
	});
	
	$("header .mBtn_topMenu").click(function(){
		if(window.innerWidth < 1041){
			if(!$("nav>#gnb>li>a").hasClass('on')){
				$("nav>#gnb>li>a").eq(0).trigger('click');
			}
		}
	});
	
	//접근성 팝업 포커스 변경
	$(document).on('DOMNodeInserted', '.pop_iframe', function(){
		$(this).focus();
	});
	$(document).on('DOMNodeRemoved', '.pop_iframe', function(){
		$(frameBtnObj).focus();
	});
});

function closeSearchPop(){
	$('#iframeSearchPop').remove();
}

function closeTotalSearchPop(){
	$("body").css("overflow","");
	$("body").css("overflow-y","");
	$("#iframeSearchPop").remove();
}
function closeLogoutPop(){
	$("body").css("overflow","");
	$("body").css("overflow-y","");
	$("#iframeLogoutPop").remove();
}

/************************************************************************
* 함수명 : fn_logout
* 설 명 :  로그아웃
* 인 자 :
* 작성자 : bvs
* 수정일 수정자 수정내용
* ------ ------ -------------------
* 2021.03.15 bvs 최초생성
************************************************************************/
function fn_logout(){
	location.href = "/kotranews/action/actionLogout.do";
}

/************************************************************************
* 함수명 : fn_enterkey
* 설 명 :  엔터키 클릭 이벤트 호출
* 인 자 :
* 작성자 : bvs
* 수정일 수정자 수정내용
* ------ ------ -------------------
* 2021.03.15 bvs 최초생성
************************************************************************/
function fn_enterkey() {
    if (window.event.keyCode == 13) {
         $('.btn_search').trigger('click');
    }
}
var frameBtnObj;

function setHref(obj, org){
	if($(obj).find("> div").length > 0){
		if($(obj).find("> div> ul > li:not('.emptyArea')").length > 0){
			if($(obj).find(">a").data("sub")=="Y"){
				$(org).find(">a").attr("href",$(obj).find("> div> ul > li:not('.emptyArea'):eq(0) > a").attr("href"));
				$(org).find(">a").attr("target",$(obj).find("> div> ul > li:not('.emptyArea'):eq(0) > a").attr("target"));
				
				setHref($(obj).find("> div> ul > li:not('.emptyArea'):eq(0)"),org);
			}else{
				$(org).find(">a").attr("href",$(org).find(">a").attr("href"));
			}
		}
	}else{
		if($(obj).find("> ul > li:not('.emptyArea')").length > 0){
			if($(obj).find(">a").data("sub")=="Y"){
				$(org).find(">a").attr("href",$(obj).find("> ul > li:not('.emptyArea'):eq(0) > a").attr("href"));
				$(org).find(">a").attr("target",$(obj).find("> ul > li:not('.emptyArea'):eq(0) > a").attr("target"));
				
				setHref($(obj).find("> ul > li:not('.emptyArea'):eq(0)"),org);
			}else{
				$(org).find(">a").attr("href",$(org).find(">a").attr("href"));
			}
		}
	}
	
}

$(function(){
	$(document).on("click", "ul#gnb li, ul#snb li", function(){
		setHref($(this),$(this));
	});
	 
	$(document).on("click", ".navList>.menu>ul>li>a", function(){
		var val = $(this).data('menuno');
		$("ul#gnb li").find('.'+val).closest('li').trigger('click');
		if($("ul#gnb li").find('.'+val).attr('target') == "_blank"){
			window.open($("ul#gnb li").find('.'+val).attr('href'));
		}else{
			location.href = $("ul#gnb li").find('.'+val).attr('href'); 			
		} 
	});
	
	$(document).on("click", ".pnbList>.menu>ul>li>a", function(){
		var val = $(this).data('menuno');
		$("ul#gnb li").find('.'+val).closest('li').trigger('click');
		if($("ul#gnb li").find('.'+val).attr('target') == "_blank"){
			window.open($("ul#gnb li").find('.'+val).attr('href'));
		}else{
			location.href = $("ul#gnb li").find('.'+val).attr('href'); 			
		}
// 		$("ul#gnb li").find('.'+val).get(0).click();
	});
		
	if($('#gnb li.on').parents('ul').hasClass('menuS')){
		gnbDep1 = $('#gnb > li').index($('#gnb li.on').parents('ul.menuM').parent())+1;
		gnbDep2 = $('#gnb li.on').parents('ul.menuM').find('>li').index($('#gnb li.on').parents('ul.menuS').parent())+1;
		gnbDep3 = $('#gnb li.on').parents('ul.menuS').find('>li').index($('#gnb li.on'))+1;
	}else if($('#gnb li.on').parents('ul').hasClass('menuM')){
		gnbDep1 = $('#gnb > li').index($('#gnb li.on').parents('ul.menuM').parent())+1;
		gnbDep2 = $('#gnb li.on').parents('ul.menuM').find('>li').index($('#gnb li.on'))+1;
	}else{
		gnbDep1 = $('#gnb > li').index($('#gnb li.on'))+1;
	}
	$('.sVisual strong').text($('#gnb li.on > a').text());
	
	$(document).on('click', '.btn_logout, .btn_topLogout', function(){
		frameBtnObj = $(this);
		$("body").css("overflow-y","hidden");
		$('<iframe id="iframeLogoutPop" src="/kotranews/cms/frCom/actionLogoutPop.do" class="pop_iframe on" height="100%" scrolling="no" frameborder="0" title="로그아웃 팝업"/>').appendTo($("body #container"));
	});
	
	$(document).on('click', '.btn_login, .btn_topLogin', function(){
		//뉴스
		//location.href = "/kotranews/login/topUtilLink.do?pRetUrl=" + encodeURIComponent(window.location.pathname + window.location.search);
		sessionStorage.setItem('newsLogin', 'newsLogin');
		location.href = "https://www.kotra.or.kr/membership/membershipLoginForm.do?siteName=kn"
	});
	
	$(document).on('click', '.btn_mypage', function(){
		location.href = "/dream/mypage/topUtilLink.do";
	});
	
	$(document).on('click', '.gnb_util .btn_search', function(){
		var pSearchTxt = $('.search_inp').val()
		
		fn_comm_ajax({
			url : "/ajaxf/totalSearch/getStopWordList.do",
			data : {},
			dataType : "json",
			async : false,
			success : function(data) {
				if (null != data && '' != data) {
					for(var i=0; i < data.length; i++){
						if(pSearchTxt == data[i].BAN_WORD){
							alert('\''+data[i].BAN_WORD+'\''+'은(는)'+' 검색할 수 없는 단어입니다.');
							return false;
						}
					}
				}
				
				$("#searchForm").find('[name=searchTxt]').val($('.search_inp').val());
				$("#searchForm").find('[name=tDiv]').val($('.search_opt .btn_searchOpt').val());
				$("#searchForm").find('[name=pRetUrl]').val((window.location.pathname + window.location.search));
				$("#searchForm").submit();
			}
		});
	});
	
	$(document).on('click', '.search_opt > ul > li > button', function(){
		var sVal = $(this).val();
		var sText = $(this).text();
		$('.search_opt .btn_searchOpt').val(sVal);
		$('.search_opt .btn_searchOpt').text(sText);
	});
	
	$("header .mBtn_topMenu").click(function(){
		if(window.innerWidth < 1041){
			if(!$("nav>#gnb>li>a").hasClass('on')){
				$("nav>#gnb>li>a").eq(0).trigger('click');
			}
		}
	});
	
	//접근성 팝업 포커스 변경
	$(document).on('DOMNodeInserted', '.pop_iframe', function(){
		$(this).focus();
	});
	$(document).on('DOMNodeRemoved', '.pop_iframe', function(){
		$(frameBtnObj).focus();
	});
});

function closeSearchPop(){
	$('#iframeSearchPop').remove();
}

function closeTotalSearchPop(){
	$("body").css("overflow","");
	$("body").css("overflow-y","");
	$("#iframeSearchPop").remove();
}
function closeLogoutPop(){
	$("body").css("overflow","");
	$("body").css("overflow-y","");
	$("#iframeLogoutPop").remove();
}

/************************************************************************
* 함수명 : fn_logout
* 설 명 :  로그아웃
* 인 자 :
* 작성자 : bvs
* 수정일 수정자 수정내용
* ------ ------ -------------------
* 2021.03.15 bvs 최초생성
************************************************************************/
function fn_logout(){
	location.href = "/kotranews/action/actionLogout.do";
}

/************************************************************************
* 함수명 : fn_enterkey
* 설 명 :  엔터키 클릭 이벤트 호출
* 인 자 :
* 작성자 : bvs
* 수정일 수정자 수정내용
* ------ ------ -------------------
* 2021.03.15 bvs 최초생성
************************************************************************/
function fn_enterkey() {
    if (window.event.keyCode == 13) {
         $('.btn_search').trigger('click');
    }
}