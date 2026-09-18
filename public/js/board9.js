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

$()
			.ready(
					function() {

						//대륙 선택
						$(document)
								.on(
										'click',
										'[name=pRegnCd]',
										function() {
											var ck = "";
											if ("true" == "true")
												ck = "checked";
											$("#natArea").html('');

											$("#kbcArea").html('');
											$(".kbcArea")
													.css("display", "none");

											var val = $(this).val();

											if (val == '') {
												$(".natArea").css("display",
														"none");
												return;
											}

											fn_comm_ajax({
												url : "/ajaxf/frNation/getNationCodeList.do",
												data : {
													"cd" : val
												},
												dataType : "json",
												async : false,
												success : function(data) {
													if (null != data) {
														$(".natArea").css(
																"display",
																"flex");

														var html = '';
														for (var idx = 0; idx < data.length; idx++) {
															var ck = "";

															if ("" == data[idx].UN_NAT_CD) {
																ck = "checked";
															}

															html += '<input type="radio" name="pNatCd" id="nat'+data[idx].UN_NAT_CD+'" value="'+data[idx].UN_NAT_CD+'" '+ck+'>';
															html += '<label style="cursor: pointer;" for="nat'+data[idx].UN_NAT_CD+'">'
															html += '<img src="https://dream.kotra.or.kr/ajaxa/fileCpnt/fileView.do?gbn=c02&natSn='
																	+ data[idx].UN_NAT_CD
																	+ '" style="width: 28px; margin-right: 14px; vertical-align: middle; border-radius: 20px; height: 28px; border: 1px #fff solid;" alt="'
																	+ data[idx].UNTY_NAT_NAME
																	+ ' 국기">'
																	+ data[idx].UNTY_NAT_NAME;
															html += '</label>';
														}

														$(html).appendTo(
																$("#natArea"));
													}

													$("#sendForm [name=pageNo]")
															.val('1');
													fn_list();
												}
											});
										});

						//국가 선택
						$(document)
								.on(
										'click',
										'[name=pNatCd]',
										function() {
											var ck = "";
											if ("true" == "true")
												ck = "checked";
											$("#kbcArea").html('');

											var val = $(this).val();

											if (val == '') {
												$(".kbcArea").css("display",
														"none");
												return;
											}

											fn_comm_ajax({
												url : "/ajaxf/frInvestment/getKbcCodeList.do",
												data : {
													"cd" : val
												},
												dataType : "json",
												async : false,
												success : function(data) {
													if (null != data) {
														$(".kbcArea").css(
																"display",
																"flex");

														var html = '';
														for (var idx = 0; idx < data.length; idx++) {
															var ck = "";

															if ("" == data[idx].UN_NAT_CD) {
																ck = "checked";
															}

															html += '<input type="radio" name="pKbcCd" id="kbc'+data[idx].CMMN_CD+'" value="'+data[idx].CMMN_CD+'" '+ck+'>';
															html += '<label style="cursor: pointer; margin-right: 10px;" for="kbc'+data[idx].CMMN_CD+'">'
																	+ data[idx].CD_NAME
																	+ '</label>'
														}

														$(html).appendTo(
																$("#kbcArea"));
													}

													$("#sendForm [name=pageNo]")
															.val('1');
													fn_list();
												}
											});
										});

						//무역관 선택
						$(document).on('click', '[name=pKbcCd]', function() {
							$("#sendForm [name=pageNo]").val('1');
							fn_list();
						});

						//페이지 출력개수 
						$(document)
								.on(
										'change',
										'[name=viewCnt]',
										function() {
											var cntVal = $(this).val();
											if (cntVal != '') {
												$("#sendForm [name=pageNo]")
														.val('1');
												$(
														"#sendForm [name=recordCountPerPage]")
														.val(cntVal);
												fn_list();
											}
										});

						fn_list();
						//페이지 출력개수 
						$(document)
								.on(
										'click',
										'.btnC_s',
										function() {
											var searchVal = $(
													'[name=sSearchVal]').val();

											if ($(
													"#sendForm input:hidden[name=pageNo]")
													.val() == "") {
												$(
														"#sendForm input:hidden[name=pageNo]")
														.val("1");
											}

											if ($(
													"#sendForm input:hidden[name=recordCountPerPage]")
													.val() == "") {
												$(
														"#sendForm input:hidden[name=recordCountPerPage]")
														.val("10");
											}

											fn_list();
										});

					})

	/************************************************************************
	 * 함수명 : fn_list
	 * 설 명 : 게시물 리스트 조회
	 * 인 자 :
	 * 작성자 : bvs
	 * 수정일 수정자 수정내용
	 * ------ ------ -------------------
	 * 2021.03.15 bvs 최초생성
	 ************************************************************************/
	function fn_list() {
		if ($("#sendForm input:hidden[name=pageNo]").val() == "") {
			$("#sendForm input:hidden[name=pageNo]").val("1");
		}

		if ($("#sendForm input:hidden[name=recordCountPerPage]").val() == "") {
			$("#sendForm input:hidden[name=recordCountPerPage]").val("10");
		}

		fn_comm_ajax({
			url : '/ajaxf/frInvestment/getAdvncEntpList.do',
			data : $("#sendForm").serialize(),
			dataType : "json",
			success : function(data) {
				if (data != null) {
					fn_comm_setList("#tbody", data, "#listTemplate",
							"#noListTemplate", "#rowCount", ".pagination");
					if ($("#tbody .typeNoArticle").length > 0) {
						$("#tbody .typeNoArticle > td").prop("colspan",
								$("#listTable > thead th").length);
					}
				}
			}
		});
	}

	/************************************************************************
	 * 함수명 : fn_linkPage
	 * 설 명 :  페이징
	 * 인 자 :  pageNo(페이지번호)
	 * 작성자 : bvs
	 * 수정일 수정자 수정내용
	 * ------ ------ -------------------
	 * 2021.03.15 bvs 최초생성
	 ************************************************************************/
	function fn_linkPage(pageNo) {
		$("#sendForm [name='pageNo']").val(pageNo);
		fn_list();
	}

	/************************************************************************
	 * 함수명 : fn_fileDown
	 * 설 명 :  첨부파일 다운로드
	 * 인 자 :  obj(파일다운 컨트롤러)
	 * 작성자 : bvs
	 * 수정일 수정자 수정내용
	 * ------ ------ -------------------
	 * 2022.08.29 bvs 최초생성
	 ************************************************************************/
	function fn_fileDown(obj) {
		var pGbnCd = $(obj).data("gbncd");
		if ($(obj).data('filenm') == null) {
			alert("파일이 등록되어 있지 않습니다.");
			return;
		}
		var pUrl = "/ajaxa/fileCpnt/fileDown.do?gbn=i02" + "&pGbnCd=" + pGbnCd;
		var pFilename = $(obj).data('filenm');
		fn_filedown_progress(pUrl, pFilename);
	}

	/************************************************************************
	 함수명 : fn_searchReset
	 설 명 : 검색조건 초기화
	 인 자 :
	 작성자 : [대외경제정보 통합 플랫폼] 포털파트
	 수정일              수정자                                   수정내용
	 ----------  ---------------------   ------------------
	 2021-03-12  [대외경제정보 통합 플랫폼]      최초 생성
	 ************************************************************************/
	function fn_searchReset() {
		$("#sendForm .searchOpt input:text").val("");
	}