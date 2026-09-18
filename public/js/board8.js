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

$().ready(function() {
	
	$(document).on('change', '.check_all', function() {
        $('.'+$(this).data('check')).not(":disabled").prop('checked', $(this).prop('checked'));
    });
	
 	fn_flagList();
});

/************************************************************************
함수명 : fn_searchReset
설 명 : 검색조건 리셋 
인 자 : 
작성자 : [대외경제정보 통합 플랫폼] 포털파트
 수정일              수정자                                   수정내용
----------  ---------------------   ------------------
2021-03-12  [대외경제정보 통합 플랫폼]      최초 생성
************************************************************************/

function fn_searchReset(){
	$("#sendForm").each(function(){
        this.reset();
    });
	$(".natArea").css("display","none");
}
/************************************************************************
함수명 : fn_flagList
설 명 : 국가 리스트 조회
인 자 : 
작성자 : [대외경제정보 통합 플랫폼] 포털파트
 수정일              수정자                                   수정내용
----------  ---------------------   ------------------
2021-03-12  [대외경제정보 통합 플랫폼]      최초 생성
************************************************************************/
function fn_flagList(){
	
	$(".flagList").html("");
	
	var htmlObj ="";
	var asiaObj ="";
	var mdestObj ="";
	var euObj ="";
	var nthamObj ="";
	var lamrcObj = "";
	var afrcaObj = "";
	var ocniaObj = "";
	
	var asiaCnt =0;
	var mdestCnt = 0;
	var euCnt = 0;
	var nthamCnt = 0;
	var lamrcCnt = 0;
	var afrcaCnt = 0;
	var ocniaCnt = 0;
	
 	fn_comm_ajax({
		url : "/ajaxf/frNation/getNationFlagList.do",
        data : $("#sendForm").serialize(),
        dataType : "json",
        success : function(data) {
        	if(data != null && data != ""){
//         		htmlObj += '<div class="contTit set_S">국가 · 지역정보</div>';
        		if(data.list != null && data.list.length > 0){
        			asiaObj +='<strong class="flagTit"><span class="inp_c only"><input type="checkbox" class="check_all" id="natSn_asia" data-check="nation_asia"><label for="natSn_asia"><span class="txtHidden">아시아 전체선택</span></label></span>아시아</strong><ul>';
        			mdestObj +='<strong class="flagTit"><span class="inp_c only"><input type="checkbox" class="check_all" id="natSn_mdest" data-check="nation_mdest"><label for="natSn_mdest"><span class="txtHidden">중동 전체선택</span></label></span>중동</strong><ul>';
        			euObj +='<strong class="flagTit"><span class="inp_c only"><input type="checkbox" class="check_all" id="natSn_eu" data-check="nation_eu"><label for="natSn_eu"><span class="txtHidden">유럽 전체선택</span></label></span>유럽</strong><ul>';
        			nthamObj +='<strong class="flagTit"><span class="inp_c only"><input type="checkbox" class="check_all" id="natSn_ntham" data-check="nation_ntham"><label for="natSn_ntham"><span class="txtHidden">북미 전체선택</span></label></span>북미</strong><ul>';
        			lamrcObj +='<strong class="flagTit"><span class="inp_c only"><input type="checkbox" class="check_all" id="natSn_lamrc" data-check="nation_lamrc"><label for="natSn_lamrc"><span class="txtHidden">중남미 전체선택</span></label></span>중남미</strong><ul>';
        			afrcaObj +='<strong class="flagTit"><span class="inp_c only"><input type="checkbox" class="check_all" id="natSn_afrca" data-check="nation_afrca"><label for="natSn_afrca"><span class="txtHidden">아프리카 전체선택</span></label></span>아프리카</strong><ul>';
        			ocniaObj +='<strong class="flagTit"><span class="inp_c only"><input type="checkbox" class="check_all" id="natSn_ocnia" data-check="nation_ocnia"><label for="natSn_ocnia"><span class="txtHidden">대양주 전체선택</span></label></span>대양주</strong><ul>';
        			
        			for(var i =0; i < data.list.length; i++){
        				if(data.list[i].UNTY_CNTT_CD =="01"){
        					asiaObj +='<li><span class="inp_c only"><input type="checkbox" class="nation_asia" name="chkNatSn" id="natSn_'+data.list[i].UN_NAT_CD+'" value="'+data.list[i].UN_NAT_CD+'"><label for="natSn_'+data.list[i].UN_NAT_CD+'"><span class="txtHidden">'+data.list[i].UNTY_NAT_NAME+'</span></label></span>';
        					asiaObj +='<a href="#" onclick="fn_actionNatIemList('+data.list[i].UNTY_CNTT_CD+','+data.list[i].UN_NAT_CD+')"><img src="../type/common/img/common/flag/flag_'+data.list[i].ISO_WD2_NAT_CD+'.png" alt=""><span>'+data.list[i].UNTY_NAT_NAME+'</span></a></li>';
        					asiaCnt = asiaCnt + 1;
            			}else if(data.list[i].UNTY_CNTT_CD =="02"){
            				mdestObj +='<li><span class="inp_c only"><input type="checkbox" class="nation_mdest" name="chkNatSn" id="natSn_'+data.list[i].UN_NAT_CD+'" value="'+data.list[i].UN_NAT_CD+'"><label for="natSn_'+data.list[i].UN_NAT_CD+'"><span class="txtHidden">'+data.list[i].UNTY_NAT_NAME+'</span></label></span>';
            				mdestObj +='<a href="#" onclick="fn_actionNatIemList('+data.list[i].UNTY_CNTT_CD+','+data.list[i].UN_NAT_CD+')"><img src="../type/common/img/common/flag/flag_'+data.list[i].ISO_WD2_NAT_CD+'.png" alt=""><span>'+data.list[i].UNTY_NAT_NAME+'</span></a></li>';
            				mdestCnt = mdestCnt + 1;
            			}else if(data.list[i].UNTY_CNTT_CD =="03"){
            				euObj +='<li><span class="inp_c only"><input type="checkbox" class="nation_eu" name="chkNatSn" id="natSn_'+data.list[i].UN_NAT_CD+'" value="'+data.list[i].UN_NAT_CD+'"><label for="natSn_'+data.list[i].UN_NAT_CD+'"><span class="txtHidden">'+data.list[i].UNTY_NAT_NAME+'</span></label></span>';
            				euObj +='<a href="#" onclick="fn_actionNatIemList('+data.list[i].UNTY_CNTT_CD+','+data.list[i].UN_NAT_CD+')"><img src="../type/common/img/common/flag/flag_'+data.list[i].ISO_WD2_NAT_CD+'.png" alt=""><span>'+data.list[i].UNTY_NAT_NAME+'</span></a></li>';
            				euCnt = euCnt + 1;
            			}else if(data.list[i].UNTY_CNTT_CD =="04"){
            				nthamObj +='<li><span class="inp_c only"><input type="checkbox" class="nation_ntham" name="chkNatSn" id="natSn_'+data.list[i].UN_NAT_CD+'" value="'+data.list[i].UN_NAT_CD+'"><label for="natSn_'+data.list[i].UN_NAT_CD+'"><span class="txtHidden">'+data.list[i].UNTY_NAT_NAME+'</span></label></span>';
            				nthamObj +='<a href="#" onclick="fn_actionNatIemList('+data.list[i].UNTY_CNTT_CD+','+data.list[i].UN_NAT_CD+')"><img src="../type/common/img/common/flag/flag_'+data.list[i].ISO_WD2_NAT_CD+'.png" alt=""><span>'+data.list[i].UNTY_NAT_NAME+'</span></a></li>';
            				nthamCnt = nthamCnt + 1;
            			}else if(data.list[i].UNTY_CNTT_CD =="05"){
            				lamrcObj +='<li><span class="inp_c only"><input type="checkbox" class="nation_lamrc" name="chkNatSn" id="natSn_'+data.list[i].UN_NAT_CD+'" value="'+data.list[i].UN_NAT_CD+'"><label for="natSn_'+data.list[i].UN_NAT_CD+'"><span class="txtHidden">'+data.list[i].UNTY_NAT_NAME+'</span></label></span>';
            				lamrcObj +='<a href="#" onclick="fn_actionNatIemList('+data.list[i].UNTY_CNTT_CD+','+data.list[i].UN_NAT_CD+')" value="'+data.list[i].UN_NAT_CD+'"><img src="../type/common/img/common/flag/flag_'+data.list[i].ISO_WD2_NAT_CD+'.png" alt=""><span>'+data.list[i].UNTY_NAT_NAME+'</span></a></li>';
            				lamrcCnt = lamrcCnt + 1;
            			}else if(data.list[i].UNTY_CNTT_CD =="06"){
            				afrcaObj +='<li><span class="inp_c only"><input type="checkbox" class="nation_afrca" name="chkNatSn" id="natSn_'+data.list[i].UN_NAT_CD+'" value="'+data.list[i].UN_NAT_CD+'"><label for="natSn_'+data.list[i].UN_NAT_CD+'"><span class="txtHidden">'+data.list[i].UNTY_NAT_NAME+'</span></label></span>';
            				afrcaObj +='<a href="#" onclick="fn_actionNatIemList('+data.list[i].UNTY_CNTT_CD+','+data.list[i].UN_NAT_CD+')"><img src="../type/common/img/common/flag/flag_'+data.list[i].ISO_WD2_NAT_CD+'.png" alt=""><span>'+data.list[i].UNTY_NAT_NAME+'</span></a></li>';
            				afrcaCnt = afrcaCnt + 1;
            			}else if(data.list[i].UNTY_CNTT_CD =="07"){
            				ocniaObj +='<li><span class="inp_c only"><input type="checkbox" class="nation_ocnia" name="chkNatSn" id="natSn_'+data.list[i].UN_NAT_CD+'" value="'+data.list[i].UN_NAT_CD+'"><label for="natSn_'+data.list[i].UN_NAT_CD+'"><span class="txtHidden">'+data.list[i].UNTY_NAT_NAME+'</span></label></span>';
            				ocniaObj +='<a href="#" onclick="fn_actionNatIemList('+data.list[i].UNTY_CNTT_CD+','+data.list[i].UN_NAT_CD+')"><img src="../type/common/img/common/flag/flag_'+data.list[i].ISO_WD2_NAT_CD+'.png" alt=""><span>'+data.list[i].UNTY_NAT_NAME+'</span></a></li>';
            				ocniaCnt = ocniaCnt + 1;
            			}
        			}
        			if(asiaCnt > 0){
        				asiaObj += '</ul>';
        				htmlObj += asiaObj;
        			}
        			if(mdestCnt > 0){
        				mdestObj += '</ul>';
        				htmlObj += mdestObj;
        			}
        			if(euCnt > 0){
        				euObj += '</ul>';
        				htmlObj += euObj;
        			}
        			if(nthamCnt > 0){
        				nthamObj += '</ul>';
        				htmlObj += nthamObj;
        			}
        			if(lamrcCnt > 0){
        				lamrcObj += '</ul>';
        				htmlObj += lamrcObj;
        			}
        			if(afrcaCnt > 0){
        				afrcaObj += '</ul>';
        				htmlObj += afrcaObj;
        			}
        			if(ocniaCnt > 0){
        				ocniaObj += '</ul>';
        				htmlObj += ocniaObj;
        			}
        			
        			$(htmlObj).appendTo($(".flagList"));
        		}
        	}
        }
        	
   	});
}
/************************************************************************
함수명 : fn_actionNatIemList
설 명 : 상세페이지 이동
인 자 : -
작성자 : [대외경제정보 통합 플랫폼] 포털파트
 수정일              수정자                                   수정내용
----------  ---------------------   ------------------
2021-03-15  [대외경제정보 통합 플랫폼]      최초 생성
************************************************************************/
function fn_actionNatIemList(pRegnCd, pNatCd){
	if(pRegnCd >= 10){
		pRegnCd
	}else{
		pRegnCd = "0" + pRegnCd;	
	}
	$("#sendForm [name=pRegnCd]").val(pRegnCd);	
	$("#sendForm [name=pNatCd]").val(pNatCd);
	
	location.href = "/kotranews/cms/nation/actionNatIemList.do?" + $("#sendForm").serialize();
}


/************************************************************************
함수명 : fn_nationPdfDown
설 명 : 국가정보 PDF 다운로드 
인 자 : -
작성자 : [대외경제정보 통합 플랫폼] 포털파트
 수정일              수정자                                   수정내용
----------  ---------------------   ------------------
2021-03-15  [대외경제정보 통합 플랫폼]      최초 생성
************************************************************************/
function fn_nationPdfDown(){
	
	if($("[name=chkNatSn]:checked").length < 1){
		alert('국가를 선택하세요.');
		return;
	}
	
	//location.href = "/ajaxa/frNation/nationPdfDown.do?"+ $("#sendForm").serialize();
	
	var pUrl = "/ajaxa/frNation/nationPdfDown.do?"+ $("#sendForm").serialize();
	
	var pFilename = "";
	 
	if($("[name=chkNatSn]:checked").length > 1){
		pFilename = "국가정보.zip";
	}else if ($("[name=chkNatSn]:checked").length == 1){
		pFilename = $("label[for='natSn_"+$("[name=chkNatSn]:checked").val()+"']").text() + ".pdf";
	}

	fn_filedown_progress(pUrl, pFilename);
}