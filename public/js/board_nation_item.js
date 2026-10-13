/*
 * 국별모아드림 항목 상세(__news_page14 투자환경).
 * /ajaxf, /ajaxa, /kotranews/cms/nation 서버 경로는 원본과 같다.
 */
$().ready(function() {

	if ($('.photoSlider').length && !$('.photoSlider').hasClass('slick-initialized')) {
	$('.photoSlider').slick({
		infinite: false,
		slidesToShow: 5,
		slidesToScroll: 1,
		infinite: false,
		arrows: true,
		variableWidth: true,
		adaptiveHeight: true,
		responsive: [
			{
				breakpoint: 1041,
				settings: {
					arrows: false,
					infinite: true
				}
			},
		]	
	});
	}
	
	$(document).on('click', '.imgViewPop', function(){
		var natSn = $(this).data('natsn');
		var atfileSn = $(this).data('atfilesn');
		var ctgysnParam = $(this).data('ctgysn');
		frameBtnObj = $(this);
	 	$(document).find('body').css("overflow-y","hidden");
		$('<iframe id="iframePop" class="pop_iframe iframe_imgView on" src="/cms/nation/actionKotraNationImgFileDetailPop.do?pNatSn='+natSn+'&pAtFileSn='+atfileSn+'&ctgySn=' +ctgysnParam+ '" title="[팝업] 이미지 상세보기" frameborder="0" />').appendTo($(document).find("body #container"));
	});
	
	var ctgySn = $("#sendForm input:hidden[name=ctgySn]").val();
	var lowerCtgySn = $("#sendForm input:hidden[name=lowerCtgySn]").val() == null ? "" : $("#sendForm input:hidden[name=lowerCtgySn]").val(); 
	
	$("#pageTab").find("#"+ ctgySn).addClass("on");
	
	$(document).on("change", "#upperIem", function(){
		var uperCd = $(this).val();
		var ctgySn = $(this).find(":selected").data('idno');
		
		fn_view(uperCd, ctgySn);
	});
	
 	//내용 축소, 확대
 	$(document).on("click", ".dropIcon", function(){
		if($(this).parents(".list_Item").find(".country").hasClass("on")){
			$(this).parents(".list_Item").find(".country").removeClass("on").next(".info_list").slideUp(300);
			$(this).attr("aria-expanded",false).html("내용축소됨");
		}else{
			$(this).parents(".list_Item").find(".country").addClass("on").next(".info_list").slideDown(300);
			$(this).attr("aria-expanded", true).html("내용확장됨");    
		}
	});
 	
 	$(document).on("click", "#contTab_line .lowerCtgy", function(){
 		$('#contTab_line .lowerCtgy').removeClass('on');
 		$(this).addClass('on');
 		var idx =  $(this).data('idno');
		if($(".dropIcon").length > 0){
	 		if(!$('.dropIcon:eq('+idx+')').parents('.country').hasClass('on')){
		 		$('.dropIcon:eq('+idx+')').trigger('click');
	 		}
	 		
	 		var topPos = $(".dropIcon:eq("+idx+")").offset().top;
			
			$("html, body").animate({
				scrollTop: topPos - 150
			}, 400);
		}
		
 	});
 	
 	fn_detail();
 	fn_getNew();
 	if(lowerCtgySn == ""){
		$("#contTab_line").find(".lowerCtgy:eq(0)").addClass("on");
	}else{
 		$("#contTab_line").find("#"+ lowerCtgySn).addClass("on");
 		var idx = $("#contTab_line").find("#"+ lowerCtgySn).data("idno");
 		$(".list_Item .country").removeClass('on');
 		$(".list_Item .info_list").css('display', 'none');
 		$(".dropIcon").attr("aria-expanded",false).html("내용축소됨");
 		
 		$("#contTab_line .lowerCtgy:eq("+idx+")").trigger("click");
	}
 	
 	// update 아이콘 표시 (수정일부터 5일까지)
 	$('.iUpdate').each(function(){
 		var dtStr = $(this).data('updt-dt');
 		if(!dtStr) return;
 	
 		var dateOnly = dtStr.split(' ')[0];
 		var uptDate = new Date(dateOnly.replace(/-/g,'/')); 
 		
 		var now = new Date();
 		
 		var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
 		var updt = new Date(uptDate.getFullYear(), uptDate.getMonth(), uptDate.getDate());
 		
 		var diffDays = (today - updt) / (1000 * 60 * 60 * 24);
 		
 		if(diffDays >=0 && diffDays <=4){
 			$(this).show();
 		}  // 수정후 5일까지 표시
 	}) 
 	
});

/************************************************************************
함수명 : fn_ifmPopClose
설 명 : iframe 비활성화
인 자 : -
작성자 : [대외경제정보 통합 플랫폼] 포털파트
 수정일              수정자                                   수정내용
----------  ---------------------   ------------------
2021-03-15  [대외경제정보 통합 플랫폼]      최초 생성
************************************************************************/
function fn_ifmPopClose(){
	$("body").css("overflow","");
	$("body").css("overflow-y","");
	$("#iframePop").remove();
}

/************************************************************************
함수명 : fn_view
설 명 : 상세페이지 이동
인 자 : uperCd, ctgySn
작성자 : [대외경제정보 통합 플랫폼] 포털파트
수정일              수정자                                   수정내용
----------  ---------------------   ------------------
2021-03-12  [대외경제정보 통합 플랫폼]      최초 생성
************************************************************************/
function fn_view(uperCd, ctgySn){
	$("#sendForm [name=uperCd]").val(uperCd);	
	$("#sendForm [name=ctgySn]").val(ctgySn);
	$("#sendForm [name=lowerCtgySn]").val("");
	
	location.href = "/kotranews/cms/nation/actionNatIemDetail.do?" + $("#sendForm").serialize();
}


/************************************************************************
함수명 : fn_replace
설 명 : 
인 자 : txt
작성자 : [대외경제정보 통합 플랫폼] 포털파트
수정일              수정자                                   수정내용
----------  ---------------------   ------------------
2021-03-12  [대외경제정보 통합 플랫폼]      최초 생성
************************************************************************/
function fn_replace(txt){
	var contents = "";
	if(txt != null){
		if(/<[a-z][\s\S]*>/i.test(txt)){
			contents = txt;
		}else{
			contents = txt.replace(/\n/g,"<br/>");
		}
	}
	
	return contents;
}

/************************************************************************
함수명 : fn_compareView
설 명 : 비교 상세페이지 이동
인 자 : uperCd, ctgySn
작성자 : [대외경제정보 통합 플랫폼] 포털파트
수정일              수정자                                   수정내용
----------  ---------------------   ------------------
2021-03-12  [대외경제정보 통합 플랫폼]      최초 생성
************************************************************************/
function fn_compareView(){
	location.href = "/kotranews/cms/nation/actionNatIemCompDetail.do?" + $("#sendForm").serialize();
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
function fn_actionNatIemList(){
	location.href = "/kotranews/cms/nation/actionNatIemList.do?" + $("#listForm").serialize();
}


/************************************************************************
함수명 : fn_nationIemPdfDown
설 명 : 국가정보 PDF 다운로드 
인 자 : -
작성자 : [대외경제정보 통합 플랫폼] 포털파트
 수정일              수정자                                   수정내용
----------  ---------------------   ------------------
2021-03-15  [대외경제정보 통합 플랫폼]      최초 생성
************************************************************************/
function fn_nationIemPdfDown(){
	var chkNatSn = $("#sendForm input:hidden[name=pNatCd]").val();
	var iemChk = $("#pageTab .tabList .on").attr('id');
	
	location.href = "/ajaxa/frNation/nationIemPdfDown.do?chkNatSn="+chkNatSn +"&iemChk=" +iemChk;
	/*
	var pUrl = "/ajaxa/frNation/nationIemPdfDown.do?chkNatSn="+chkNatSn +"&iemChk=" +iemChk;
	
	var pFilename = $("label[for='nat"+$("[name=pNatCd]:checked").val()+"']").text() + ".pdf";
	
	fn_filedown_progress(pUrl, pFilename);
	*/
}

/************************************************************************
함수명 : fn_getNew()
설 명 : 국가정보 관련뉴스 조회 
인 자 : -
작성자 : [대외경제정보 통합 플랫폼] 포털파트
 수정일              수정자                                   수정내용
----------  ---------------------   ------------------
2023-08-24  [대외경제정보 통합 플랫폼]      최초 생성
************************************************************************/
function fn_getNew(){
	if (!$("#newsBody").length) return;
	/* 목업에 이미 관련뉴스가 있으면 AJAX 로 비우지 않는다 */
	if ($("#newsBody .nttTr").length) return;
	var htmlObj = "";
	var htmlFooterObj = "";
	var ctgySn = $("#sendForm [name=ctgySn]").val();
	var chkCtgyNm = $("#pageTab").find("#"+ ctgySn).data('name');
	
 	fn_comm_ajax({
		url : "/ajaxf/frNation/getNationNewsList.do",
        data : $("#sendForm").serialize(),
        dataType : "json",
        async : false,
        success : function(data) {
        	if(data != null && data != ""){
        		if(data.natNewsList.length > 0){
	        		for(var idx=0; idx<data.natNewsList.length; idx++){
	        			htmlObj += '<tr data-idno="'+data.natNewsList[idx].NTT_SN+'" class="nttTr ">'
	        			htmlObj += '<td class="no">'+(idx+1)+'</td>';
	        			htmlObj += '<td class="txtL"><a href="'+data.natNewsList[idx].LINK+'" class="subjectTxt" >'+data.natNewsList[idx].NTT_SJ+'</a></td>';
	        			htmlObj += '<td><em class="mSort">국가</em>'+data.natNewsList[idx].UNTY_NAT_NAME+'</td>';
	        			htmlObj += '<td><em class="mSort">무역관</em>'+data.natNewsList[idx].KBC_NAME+'</td>';
	        			htmlObj += '<td><em class="mSort">게시일</em>'+data.natNewsList[idx].OTHBC_DT+'</td></tr>';
	        		}        			
	        	$(htmlObj).appendTo($("#sendForm #newsBody"));
        		} 
        		else {
        			$('.noCateg').css('display', 'none');
        			
//         			htmlObj += '<tr class="typeNoArticle">'
//         			htmlObj += '<td colspan="4">'
//         			htmlObj += '<p class="no_article">관련된 국가정보 뉴스가 없습니다.</p>'	
//         			htmlObj += '</td>'
//         			htmlObj += '</tr>'
        			
//         			$(htmlObj).appendTo($("#sendForm #newsBody"));
        		}
        	}
        	
       		//공공누리 
       		htmlFooterObj += '<div class="board_area" style="display:block"><div class="lineList_v"><dl><dd style="padding:0px; margin-top:30px;">';
       		htmlFooterObj += '<div class="add_openNoti"><img src="/type/common/img/board/img_opentype01.png" alt="공공누리 제 1유형(출처표시) - 공공저작물 자유이용허락" class="copyrightImg">';
       		htmlFooterObj += '<p>국가정보['+chkCtgyNm+'] 항목은 <em class="point_black">"공공누리 1유형 출처표시"</em> 조건에 따라 이용 할 수 있습니다.</p></div></dd></dl></div></div>';
       		
       		$(htmlFooterObj).appendTo($("#sendForm .noCateg"));
       		
        }
 	});	
	
}
/************************************************************************
* 함수명 : fn_numberFormat
* 설 명 :  숫자 포멧 1000단위마다 콤마 추가
* 인 자 : num
* 작성자 : bvs
* 수정일 수정자 수정내용
* ------ ------ -------------------
* 2021.03.15 bvs 최초생성
************************************************************************/
function fn_numberFormat(num){
	var transNum = 0;
	if(num == null || num == "" || num == 0 || num == "-"){
		transNum  = "0";
	}else{
		transNum = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
	return transNum;
}

/************************************************************************
함수명 : fn_detail
설 명 : 상세정보 조회 
인 자 : 
작성자 : [대외경제정보 통합 플랫폼] 포털파트
 수정일              수정자                                   수정내용
----------  ---------------------   ------------------
2021-03-12  [대외경제정보 통합 플랫폼]      최초 생성
************************************************************************/

function fn_detail(){
	
	var htmlObj = "";
	var ctgySn = $("#sendForm input:hidden[name=ctgySn]").val();
	var chkCtgyNm = $("#pageTab").find("#"+ ctgySn).data('name');
	/* 목업 HTML이 있으면 AJAX 전에 비우지 않는다. 서버 응답이 온 뒤에만 교체한다. */
	
 	fn_comm_ajax({
		url : "/ajaxf/frNation/getNationDetailData.do",
        data : $("#sendForm").serialize(),
        dataType : "json",
        async : false,
        success : function(data) {
        	if(data != null && data != ""){
        		if(ctgySn == "404"){
        			//국가개요
        			htmlObj += '<div class="view_country_overview selectOption">';
        			
	       			htmlObj += '<div class="list_Item" style="display:block">';
	       			htmlObj += '<div class="country on"><p class="nation"><span class="tit">개황</span></p>';
	       			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
	       			htmlObj += '</div>';
	       			htmlObj += '<div class="info_list" style="display: block;">';
	       			htmlObj += '<div  class="subTab_Cont on">';
	    			htmlObj += '<div class="lineTop_tbArea" style=1"margin-bottom:30px">';
       				htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>개황</p></caption>';
       				htmlObj += '<colgroup><col style="width:20%"><col style="width:30%"><col style="width:20%"><col style="width:30%"></colgroup>';
       				htmlObj += '<tbody><tr><th scope="col">국가/지역</th><td colspan="3" class="txtL">'+data.NAT_NAME+'</td></tr>';
       				htmlObj += '<tr><th scope="col">수도</th><td colspan="3" class="txtL">'+data.CPTCTY_NAME+'</td></tr>';
       				htmlObj += '<tr><th scope="col">면적</th><td colspan="3" class="txtL">'+data.NAT_AR+'㎢  (자료원 : '+data.NAT_AR_ARCV_CN+')</td></tr>';
       				htmlObj += '<tr><th scope="col">인구</th><td colspan="3" class="txtL">'+data.POPLTN_NMPR_CNT+'명 (자료원 : '+data.POPLTN_NMPR_CNT_ARCV_CN + ')</td></tr>';
       				htmlObj += '<tr><th scope="col">민족</th><td colspan="3" class="txtL alignPre">'+data.ETHNIC_CMPS_CN+'</td></tr>';
       				htmlObj += '<tr><th scope="col">언어</th><td colspan="3" class="txtL">'+data.LANG_NAME+'</td></tr>';
       				htmlObj += '<tr><th scope="col">종교</th><td colspan="3" class="txtL">'+data.RELGN_NAME+'</td></tr>';
       				htmlObj += '<tr><th scope="col">기후</th><td colspan="3" class="txtL alignPre">'+data.CLMT_CN+'</td></tr>';       				
       				htmlObj += '<tr><th scope="col">국가원수</th><td colspan="3" class="txtL alignPre">'+data.NAT_HDSTT_CN+'</td></tr></tbody></table></div>';
	       			htmlObj +='</div>';
	       			htmlObj += '</div>';
	       			htmlObj += '</div>';
	       			
// 					if(data.POLITC_SOCTY_TREND_CN != null  && data.POLITC_SOCTY_TREND_CN != ""){
// 						htmlObj += '<div class="list_Item" style="display:block">'; 
// 		       			htmlObj += '<div class="country on"><p class="nation"><span class="tit">정치ㆍ사회 동향 </span></p>';
// 		       			htmlObj += '<button type="button" class="dropIcon" aria-expanded="false">내용축소됨</button>';
// 		       			htmlObj += '</div>';
// 		       			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
// 		       			htmlObj += '<div class="txtContArea">';
// 		       			htmlObj += '<p class="txtMid">정치ㆍ사회 동향</p>';
// 		       			htmlObj += '<ul class="list_dotBlack"><li>'+data.POLITC_SOCTY_TREND_CN+'</li></ul>';
// 		       			htmlObj += '</div></div></div>';
// 		       			htmlObj += '</div>';
// 					}
	       			
	       			htmlObj += '</div>'; 
	       			
        		}else if(ctgySn == "405"){
        			//한국과의 관계
        			htmlObj += '<div class="view_country_overview selectOption">';
        			htmlObj += '<div class="list_Item" style="display:block">'; 
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">한국과의 국교 수립 및 협정 현황</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="false">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<p class="txtMid">한국과의 국교 수립 및 협정 현황</p>';
        			
        			htmlObj += '<div class="lineTop_tbArea" style="margin-bottom:30px">';
       				htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>국교 수립일, 한국교민수 등에 대한 정보를 알 수 있는 표</p></caption>';
       				htmlObj += '<colgroup><col style="width:20%"><col style="width:80%"></colgroup>';
       				htmlObj += '<tbody><tr><th scope="col">국교수립일(자료원)</th><td class="txtL">'+data.EXNT_FNDNG_DE+'(' +data.EXNT_FNDNG_DE_ARCV_CN +')</td></tr>';
       				htmlObj += '<tr><th scope="col">한국교민 수(자료원)</th><td class="txtL">'+data.KOR_OVKR_NMPR_CNT+'명 ('+ data.KOR_OVKR_NMPR_CNT_ARCV_CN +')</td></tr></tbody></table></div>'; 
       				
       				htmlObj += '<div class="txtContArea">';
       				htmlObj += '<p class="txtMid" style="margin-top:40px">협정 발효 현황</p>';
       				htmlObj += '<div class="lineTop_tbArea" style="margin-bottom:30px">';
       				htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>발효일자, 발효내용, 비고에 대한 정보를 알 수 있는 표</p></caption>';
       				htmlObj += '<colgroup><col style="width:20%"><col style="width:150px"><col><col style="width:20%"></colgroup>';
       				htmlObj += '<tbody><tr><th scope="col">협정명</th><th scope="col">발효일자</th><th scope="col">발효내용</th><th scope="col">비고</th></tr>';
	       			if(data.trtyList != null && data.trtyList.length > 0){
	       				for(var i =0; i < data.trtyList.length; i++){
		       				htmlObj += '<tr><td class="txtL">'+data.trtyList[i].CNCLS_TRTY_NAME + '</td>';
		       				htmlObj += '<td>'+data.trtyList[i].TRTY_CNCLS_DE+'</td>';
		       				htmlObj += '<td class="txtL">'+data.trtyList[i].TRTY_CNCLS_CN+'</td>';
		       				htmlObj += '<td class="txtL">'+ data.trtyList[i].TRTY_CNCLS_ETC_CN +'</td></tr>';
	       				}
	       			}
	       			
	       			htmlObj += '</tbody></table></div>';
	       			htmlObj += '</div>';
	       			htmlObj += '</div></div></div>';
	       			
	       			htmlObj += '<div class="list_Item" style="display:block">'; 
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">최근 양국간 현안이슈</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
	       			htmlObj += '<div class="info_list" style="display:block">';
	       			htmlObj += '<div  class="subTab_Cont on">';
	       			htmlObj += '<div class="txtContArea">';
	       			htmlObj += '<p class="txtMid">정치</p><ul><li class="alignPre">'+data.POLITC_CN+'</li></ul>';
	       			htmlObj += '<p class="txtMid">경제</p><ul><li class="alignPre">'+data.ECNMY_CN+'</li></ul>';
	       			htmlObj += '<p class="txtMid">문화</p><ul><li class="alignPre">'+data.CLTUR_CN+'</li></ul>';
	       			htmlObj += '</div></div></div>';
        			htmlObj += '</div>';
        			
        		}else if(ctgySn == "406"){
        			//경제현황
        			htmlObj += '<div class="view_country_overview selectOption">';
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">주요 경제지표</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="lineTop_tbArea" style="margin-bottom:30px">';
        			htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>최근 5개년 경제성장률, 명목GDP, 1인당 GDP, 1인당 명목 GDP 등 경제지표에 대한 정보를 알 수 있는 표</p></caption>';
        			htmlObj += '<colgroup><col style="width:16%"><col style="width:16%"><col style="width:16%"><col style="width:16%"><col style="width:16%"><col style="width:16%"></colgroup>';
        			htmlObj += '<tbody>'; 
        			htmlObj += '<tr><th scope="col">경제지표</th>';
	       			if(data.ecnmyGrwrtList != null && data.ecnmyGrwrtList.length > 0){
	       				for(var i =0; i < data.ecnmyGrwrtList.length; i++){
	       					htmlObj +='<th scope="col">'+data.ecnmyGrwrtList[i].BASE_YR+'</th>';
	       				}
	       			}
	       			htmlObj += '</tr>';
	       			htmlObj += '<tr><th scope="col">경제성장률(%)</th>';
	       			if(data.ecnmyGrwrtList != null && data.ecnmyGrwrtList.length > 0){
	       				for(var i =0; i < data.ecnmyGrwrtList.length; i++){
	       					htmlObj +='<td class="txtR">'+data.ecnmyGrwrtList[i].ECOIND_VAL_TECH_VAL+'</td>';
	       				}
	       			}
	       			htmlObj += '</tr>';
	       			htmlObj += '<tr><th scope="col">명목 GDP</br>(십억$)</th>';
	       			if(data.nmgdpList != null && data.nmgdpList.length > 0){
	       				for(var i =0; i < data.nmgdpList.length; i++){
	       					htmlObj +='<td class="txtR">'+data.nmgdpList[i].ECOIND_VAL_TECH_VAL+'</td>';
	       				}
	       			}
	       			htmlObj += '</tr>';
	       			htmlObj += '<tr><th scope="col">1인당 GDP(PPP, $)</th>';
	       			if(data.prcapGdpList != null && data.prcapGdpList.length > 0){
	       				for(var i =0; i < data.prcapGdpList.length; i++){
	       					htmlObj +='<td class="txtR">'+data.prcapGdpList[i].ECOIND_VAL_TECH_VAL+'</td>';
	       				}
	       			}
	       			htmlObj += '</tr>';
	       			htmlObj += '<tr><th scope="col">1인당 명목 GDP($)</th>';
	       			if(data.personGdpList != null && data.personGdpList.length > 0){
	       				for(var i =0; i < data.personGdpList.length; i++){
	       					htmlObj +='<td class="txtR">'+data.personGdpList[i].ECOIND_VAL_TECH_VAL+'</td>';
	       				}
	       			}
	       			htmlObj += '</tr>';
	       			htmlObj += '<tr><th scope="col">정부부채</br>(% of GDP)</th>';
	       			if(data.gvRnDebtList != null && data.gvRnDebtList.length > 0){
	       				for(var i =0; i < data.gvRnDebtList.length; i++){
	       					htmlObj +='<td class="txtR">'+data.gvRnDebtList[i].ECOIND_VAL_TECH_VAL+'</td>';
	       				}
	       			}
	       			htmlObj += '</tr>';
	       			htmlObj += '<tr><th scope="col">물가상승률(%)</th>';
	       			if(data.inflRtList != null && data.inflRtList.length > 0){
	       				for(var i =0; i < data.inflRtList.length; i++){
	       					htmlObj +='<td class="txtR">'+data.inflRtList[i].ECOIND_VAL_TECH_VAL+'</td>';
	       				}
	       			}
	       			htmlObj += '</tr>';
	       			htmlObj += '<tr><th scope="col">실업률(%)</th>';
	       			if(data.unempRtList != null && data.unempRtList.length > 0){
	       				for(var i =0; i < data.unempRtList.length; i++){
	       					htmlObj +='<td class="txtR">'+data.unempRtList[i].ECOIND_VAL_TECH_VAL+'</td>';
	       				}
	       			}
	       			htmlObj += '</tr>';
	       			htmlObj += '<tr><th scope="col">수출액</br>(백만$)</th>';
	       			if(data.xportAmtList != null && data.xportAmtList.length > 0){
	       				for(var i =0; i < data.xportAmtList.length; i++){
	       					htmlObj +='<td class="txtR">'+data.xportAmtList[i].ECOIND_VAL_TECH_VAL+'</td>';
	       				}
	       			}
	       			htmlObj += '</tr>';
	       			htmlObj += '<tr><th scope="col">수입액</br>(백만$)</th>';
	       			if(data.imprtAmtList != null && data.imprtAmtList.length > 0){
	       				for(var i =0; i < data.imprtAmtList.length; i++){
	       					htmlObj +='<td class="txtR">'+data.imprtAmtList[i].ECOIND_VAL_TECH_VAL+'</td>';
	       				}
	       			}
	       			htmlObj += '</tr>';
	       			htmlObj += '<tr><th scope="col">무역수지</br>(백만$)	</th>';
	       			if(data.baltrList != null && data.baltrList.length > 0){
	       				for(var i =0; i < data.baltrList.length; i++){
	       					htmlObj +='<td class="txtR">'+data.baltrList[i].ECOIND_VAL_TECH_VAL+'</td>';
	       				}
	       			}
	       			htmlObj += '</tr>';
	       			htmlObj += '<tr><th scope="col">외환 보유고(백만$)	</th>';
	       			if(data.frxrsList != null && data.frxrsList.length > 0){
	       				for(var i =0; i < data.frxrsList.length; i++){
	       					htmlObj +='<td class="txtR">'+data.frxrsList[i].ECOIND_VAL_TECH_VAL+'</td>';
	       				}
	       			}
	       			htmlObj += '</tr>';
	       			htmlObj += '<tr><th scope="col">이자율(%)	</th>';
	       			if(data.intrRtList != null && data.intrRtList.length > 0){
	       				for(var i =0; i < data.intrRtList.length; i++){
	       					htmlObj +='<td class="txtR">'+data.intrRtList[i].ECOIND_VAL_TECH_VAL+'</td>';
	       				}
	       			}
	       			htmlObj += '</tr>';
	       			htmlObj += '<tr><th scope="col">환율</br>(자국통화)	</th>';
	       			if(data.ehgtList != null && data.ehgtList.length > 0){
	       				for(var i =0; i < data.ehgtList.length; i++){
	       					htmlObj +='<td class="txtR">'+data.ehgtList[i].ECOIND_VAL_TECH_VAL+'</td>';
	       				}
	       			}
	       			htmlObj += '</tr>';
	       			htmlObj += '</tbody></table>';
	       			htmlObj += '<p class="exclamS">자료원 : '+data.ECOIND_ARCV_CN+'</p></div>';
	       			htmlObj += '</div></div></div>';
	       			
	       			
	       			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">경제 동향</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="ture">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
	       			htmlObj += '<p class="txtMid">경제 동향</p>';
	       			htmlObj += '<ul><li class="alignPre">'+data.ECNMY_TREND_CN+'</li></ul>';
	       			htmlObj += '</div>';
	       			htmlObj += '</div></div></div>';
	       			
	       			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">경제 전망</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="ture">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
	       			htmlObj += '<p class="txtMid">경제 전망</p>';
	       			htmlObj += '<ul><li class="alignPre">'+data.ECNMY_PRSP_CN+'</li></ul>';
	       			htmlObj += '</div>';
	       			htmlObj += '</div></div></div>';
	       			
        			htmlObj += '</div>';
        		}else if(ctgySn == "486"){
        			//정치
        			htmlObj += '<div class="view_country_overview selectOption">';
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">정치 체계</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="ture">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
	       			htmlObj += '<ul><li class="alignPre">'+data.POLITC_SYSTM_CN+'</li></ul>';
	       			htmlObj += '</div>';
	       			htmlObj += '</div></div></div>';
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">최신 동향</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="ture">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
	       			htmlObj += '<ul><li class="alignPre">'+data.NEWEST_TREND_CN+'</li></ul>';
	       			htmlObj += '</div>';
	       			htmlObj += '</div></div></div>';
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">대외관계 및 사회적특징</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="ture">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
	       			htmlObj += '<ul><li class="alignPre">'+data.EXTRN_REL_SOCTY_SPFTR_CN+'</li></ul>';
	       			htmlObj += '</div>';
	       			htmlObj += '</div></div></div>';
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">정책ㆍ법령</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="ture">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
	       			htmlObj += '<ul><li class="alignPre">'+data.POLICY_LAWORD_CN+'</li></ul>';
	       			htmlObj += '</div>';
	       			htmlObj += '</div></div></div>';
        			htmlObj += '</div>';
        		}else if(ctgySn == "487"){
        			//----2023-06-22 수정
        			//주요산업
        			htmlObj += '<div class="view_country_overview selectOption">';
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">개요</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="ture">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
	       			htmlObj += '<ul><li class="alignPre">'+data.SMMAR_CN+'</li></ul>';
	       			htmlObj += '</div>';
	       			htmlObj += '</div></div></div>';
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">주요 산업별 현황</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="ture">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
	       			htmlObj += '<ul><li class="alignPre">'+data.MAIN_INDUST_STTUS_CN+'</li></ul>';
	       			htmlObj += '</div>';
	       			htmlObj += '</div></div></div>';
        			htmlObj += '</div>';
	       			//----//2023-06-22 수정     			
        		}else if(ctgySn == "408"){
        			//수출입
        			htmlObj += '<div class="view_country_overview selectOption">';
        			//----2023-06-22 수정
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">개요 및 동향</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="ture">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
	       			htmlObj += '<p class="txtMid">개요 및 동향</p>';
	       			htmlObj += '<ul><li class="alignPre">'+data.IMXPRT_SMMAR_TREND_CN+'</li></ul>';
	       			htmlObj += '</div>';
	       			htmlObj += '</div></div></div>';
	       			//----//2023-06-22 수정
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">국가별 수출입</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			//----2023-06-22 수정
	       			htmlObj += '<p class="txtMid">국가별 수출입 현황</p>';
	       			htmlObj += '<ul><li class="alignPre" style="margin-bottom:15px">'+data.BYNAT_IMXPRT_STTUS_CN+'</li></ul>';
	       			//----//2023-06-22 수정
        			if(data.xportTop10NationList != null && data.xportTop10NationList.length > 0){
	        			htmlObj += '<p class="txtMid">수출 상위 10개국</p>';
        				for(var i =0; i < data.xportTop10NationList.length; i++){
            				htmlObj += '<ul class="list_dotBlack"><li>'+data.xportTop10NationList[i].BASE_YR+'년</li></ul>';
							htmlObj += '<div class="lineTop_tbArea">';
		        			htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>NO, 국가명, 금액($) 수출 상위 10개국에 대한 정보를 알 수 있는 표</p></caption>';
		        			htmlObj += '<colgroup><col style="width:10%"><col style="width:45%"><col style="width:45%"></colgroup>';
		        			htmlObj += '<tbody>'; 
		        			htmlObj += '<tr><th scope="col">No</th><th scope="col">국가명</th><th scope="col">금액($)</th><tr>';
		        			for(var j=1; j < 11; j++){
 //           					htmlObj += '<tr><td>'+j+'</td><td>'+eval('data.xportTop10NationList[i].CRSJ_NAT_NAME_'+ j)+'</td><td class="txtR">'+eval('data.xportTop10NationList[i].ECOIND_VAL_TECH_VAL_'+ j)+'</td><tr>';
            					var nationName = data.xportTop10NationList[i]['CRSJ_NAT_NAME_' + j];
            					var ecoindVal = data.xportTop10NationList[i]['ECOIND_VAL_TECH_VAL_' + j];
            					htmlObj += '<tr><td>' + j + '</td><td>' + nationName + '</td><td class="txtR">' + ecoindVal + '</td></tr>';
		        			}
		        			htmlObj += '</tbody></table>';
		        			htmlObj += '</div>';
	       				}
        				if(data.DATA_SRC != '내용 없음'){
        					htmlObj += '<p class="exclamS" style="margin-bottom:15px">자료원 : UN Comtrade, '+data.DATA_SRC+'</p>';
        				}else {
		        			htmlObj += '<p class="exclamS" style="margin-bottom:15px">자료원 : UN Comtrade</p>';
        				}
	       			}
        			if(data.importTop10NationList != null && data.importTop10NationList.length > 0){
	        			htmlObj += '<p class="txtMid">수입 상위 10개국</p>';
        				for(var i =0; i < data.importTop10NationList.length; i++){
            				htmlObj += '<ul class="list_dotBlack"><li>'+data.importTop10NationList[i].BASE_YR+'년</li></ul>';
							htmlObj += '<div class="lineTop_tbArea">';
		        			htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>NO, 국가명, 금액($) 수출 상위 10개국에 대한 정보를 알 수 있는 표</p></caption>';
		        			htmlObj += '<colgroup><col style="width:10%"><col style="width:45%"><col style="width:45%"></colgroup>';
		        			htmlObj += '<tbody>'; 
		        			htmlObj += '<tr><th scope="col">No</th><th scope="col">국가명</th><th scope="col">금액($)</th><tr>';
		        			for(var j=1; j < 11; j++){
//            					htmlObj += '<tr><td>'+j+'</td><td>'+eval('data.importTop10NationList[i].CRSJ_NAT_NAME_'+ j)+'</td><td class="txtR">'+eval('data.importTop10NationList[i].ECOIND_VAL_TECH_VAL_'+ j)+'</td><tr>';
            					var nationName = data.importTop10NationList[i]['CRSJ_NAT_NAME_' + j];
								var ecoindVal = data.importTop10NationList[i]['ECOIND_VAL_TECH_VAL_' + j];
								htmlObj += '<tr><td>' + j + '</td><td>' + nationName + '</td><td class="txtR">' + ecoindVal + '</td></tr>';            				
		        			}
		        			htmlObj += '</tbody></table>';
		        			htmlObj += '</div>';
	       				}
        				if(data.DATA_SRC != '내용 없음'){
        					htmlObj += '<p class="exclamS" style="margin-bottom:15px">자료원 : UN Comtrade, '+data.DATA_SRC+'</p>';
        				}else {
		        			htmlObj += '<p class="exclamS" style="margin-bottom:15px">자료원 : UN Comtrade</p>';
        				}
	       			}
        			htmlObj += '</div></div></div>';
        			
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">품목별 수출입</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			//----2023-06-22 수정
	       			htmlObj += '<p class="txtMid">품목별 수출입 현황</p>';
	       			htmlObj += '<ul><li class="alignPre" style="margin-bottom:15px">'+data.CMDLT_IMXPRT_STTUS_CN+'</li></ul>';
	       			//----//2023-06-22 수정
       				if(data.xportTop10CmdltList != null && data.xportTop10CmdltList.length > 0){
	        			htmlObj += '<p class="txtMid">상위 10개 수출품목</p>';
           				for(var i =0; i < data.xportTop10CmdltList.length; i++){
               				htmlObj += '<ul class="list_dotBlack"><li>'+data.xportTop10CmdltList[i].BASE_YR+'년</li></ul>';
   							htmlObj += '<div class="lineTop_tbArea">';
   		        			htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>NO, 국가명, 금액($) 수출 상위 10개국에 대한 정보를 알 수 있는 표</p></caption>';
   		        			htmlObj += '<colgroup><col style="width:10%"><col style="width:15%"><col style="width:45%"><col style="width:30%"></colgroup>';
   		        			htmlObj += '<tbody>'; 
   		        			htmlObj += '<tr><th scope="col">No</th><th scope="col">HS CODE</th><th scope="col">품목명</th><th scope="col">금액($)</th><tr>';
   		        			for(var j=1; j < 11; j++){
//               					htmlObj += '<tr><td>'+j+'</td><td>'+eval('data.xportTop10CmdltList[i].HSCD_'+ j)+'</td><td class="txtL">'+eval('data.xportTop10CmdltList[i].CMDLT_CN_'+ j)+'</td><td class="txtR">'+eval('data.xportTop10CmdltList[i].ECOIND_VAL_TECH_VAL_'+ j)+'</td><tr>';
               						var hscd = data.xportTop10CmdltList[i]['HSCD_' + j];
            						var cmdltCn = data.xportTop10CmdltList[i]['CMDLT_CN_' + j];
            						var ecoindVal = data.xportTop10CmdltList[i]['ECOIND_VAL_TECH_VAL_' + j];
            						htmlObj += '<tr><td>' + j + '</td><td>' + hscd + '</td><td class="txtL">' + cmdltCn + '</td><td class="txtR">' + ecoindVal + '</td></tr>';                 						
   		        			}
   		        			htmlObj += '</tbody></table>';
		        			htmlObj += '</div>';
   	       				}
        				if(data.DATA_SRC != '내용 없음'){
        					htmlObj += '<p class="exclamS" style="margin-bottom:15px">자료원 : UN Comtrade, '+data.DATA_SRC+'</p>';
        				}else {
		        			htmlObj += '<p class="exclamS" style="margin-bottom:15px">자료원 : UN Comtrade</p>';
        				}
   	       			}
       				if(data.importTop10CmdltList != null && data.importTop10CmdltList.length > 0){
	       				htmlObj += '<p class="txtMid">상위 10개 수입품목</p>';
           				for(var i =0; i < data.importTop10CmdltList.length; i++){
               				htmlObj += '<ul class="list_dotBlack"><li>'+data.importTop10CmdltList[i].BASE_YR+'년</li></ul>';
   							htmlObj += '<div class="lineTop_tbArea">';
   		        			htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>NO, 국가명, 금액($) 수출 상위 10개국에 대한 정보를 알 수 있는 표</p></caption>';
   		        			htmlObj += '<colgroup><col style="width:10%"><col style="width:15%"><col style="width:45%"><col style="width:30%"></colgroup>';
   		        			htmlObj += '<tbody>'; 
   		        			htmlObj += '<tr><th scope="col">No</th><th scope="col">HS CODE</th><th scope="col">품목명</th><th scope="col">금액($)</th><tr>';
   		        			for(var j=1; j < 11; j++){
//               					htmlObj += '<tr><td>'+j+'</td><td>'+eval('data.importTop10CmdltList[i].HSCD_'+ j)+'</td><td class="txtL">'+eval('data.importTop10CmdltList[i].CMDLT_CN_'+ j)+'</td><td class="txtR">'+eval('data.importTop10CmdltList[i].ECOIND_VAL_TECH_VAL_'+ j)+'</td><tr>';
               						var hscd = data.importTop10CmdltList[i]['HSCD_' + j];
            						var cmdltCn = data.importTop10CmdltList[i]['CMDLT_CN_' + j];
            						var ecoindVal = data.importTop10CmdltList[i]['ECOIND_VAL_TECH_VAL_' + j];
            						htmlObj += '<tr><td>' + j + '</td><td>' + hscd + '</td><td class="txtL">' + cmdltCn + '</td><td class="txtR">' + ecoindVal + '</td></tr>';
   		        			}
   		        			htmlObj += '</tbody></table>';
		        			htmlObj += '</div>';
  	       				}
        				if(data.DATA_SRC != '내용 없음'){
        					htmlObj += '<p class="exclamS" style="margin-bottom:15px">자료원 : UN Comtrade, '+data.DATA_SRC+'</p>';
        				}else {
		        			htmlObj += '<p class="exclamS" style="margin-bottom:15px">자료원 : UN Comtrade</p>';
        				}
   	       			}
       				
       				htmlObj += '</div></div></div>';
        			htmlObj += '</div>';
        			
        		}else if(ctgySn == "409"){
        			//한국과의 수출입
        			htmlObj += '<div class="view_country_overview selectOption">';
        			//----2023-06-22 수정
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">개요 및 동향</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="ture">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
	       			htmlObj += '<p class="txtMid">개요 및 동향</p>';
	       			htmlObj += '<ul><li class="alignPre">'+data.KOR_IMXPRT_SMMAR_TREND_CN+'</li></ul>';
	       			htmlObj += '</div>';
	       			htmlObj += '</div></div></div>';
	       			//----//2023-06-22 수정
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">한국의 對주재국 교역 현황</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			//----2023-06-22 수정
	       			htmlObj += '<p class="txtMid">한국의 對주재국 교역 현황</p>';
	       			htmlObj += '<ul><li class="alignPre" style="margin-bottom:15px">'+data.KOR_CRSJ_TRD_STTUS_CN+'</li></ul>';
	       			htmlObj += '<p class="txtMid">한국의 對주재국 교역 현황표</p>';
	       			//----//2023-06-22 수정
        			htmlObj += '<div class="tbInfoArea"><p class="tbInfoR">(금액 : 백만$)</p></div>';
        			htmlObj += '<div class="lineTop_tbArea" style="margin-bottom:30px">';
        			htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>연도, 수출액, 수입액, 무역수지에 대한 정보를 알 수 있는 표</p></caption>';
        			htmlObj += '<colgroup><col style="width:10%"><col style="width:30%"><col style="width:30%"><col style="width:30%"></colgroup>';
        			htmlObj += '<tbody>';
        			htmlObj += '<tr><th scope="col">연도</th><th scope="col">수출액</th><th scope="col">수입액</th><th scope="col">무역수지</th></tr>';
        			if(data.nationKorCrsjCmmrcList != null && data.nationKorCrsjCmmrcList.length > 0){
           				for(var i =0; i < data.nationKorCrsjCmmrcList.length; i++){
           					htmlObj += '<tr><td>'+data.nationKorCrsjCmmrcList[i].CRSJ_BASE_YR+'</td><td class="txtR">'+data.nationKorCrsjCmmrcList[i].CRSJ_EXP_AMT+'</td>';
           					htmlObj += '<td class="txtR">'+data.nationKorCrsjCmmrcList[i].CRSJ_IMP_AMT+'</td><td class="txtR">'+data.nationKorCrsjCmmrcList[i].CRSJ_BALTR_AMT+'</td></tr>';
           				}
        			}	
        			htmlObj += '</tbody></table>';
        			htmlObj += '<p class="exclamS">자료원 : '+data.KOR_CRSJ_TRD_ARCV_CN+'('+data.KOR_CRSJ_TRD_PBLC_ERA_VAL+')</p></div>';
        			htmlObj += '</div></div></div>';
        			
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">주요 수출입 품목</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			//----2023-06-22 수정
	       			htmlObj += '<p class="txtMid">한국의 주요 수출입 품목 현황</p>';
	       			htmlObj += '<ul><li class="alignPre" style="margin-bottom:15px">'+data.KOR_MAIN_IMXPRT_CMDLT_STTUS_CN+'</li></ul>';
	       			//----//2023-06-22 수정
        			htmlObj += '<p class="txtMid">한국의 對주재국 상위 10개 수출품목(최근 2년)</p>';
        			htmlObj += '<div class="tbInfoArea"><p class="tbInfoR">(금액 : 백만$)</p></div>';
        			htmlObj += '<div class="lineTop_tbArea">';
        			htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>최근 2개년도의  No, 코드(MTI 4단위), 품목명, 수출금액, 수출증감률에 대한 정보를 알 수 있는 표</p></caption>';
        			htmlObj += '<colgroup><col style="width:50px"><col style="width:100px"><col style="width:300px"><col style="width:120px"><col style="width:120px"><col style="width:120px"><col style="width:120px"></colgroup>';
        			htmlObj += '<tbody>';
        			htmlObj += '<tr><th scope="row" rowspan="2">No</th><th scope="row" rowspan="2">코드</br>(MTI 4단위)</th><th scope="row" rowspan="2">품목명</th><th scope="col" colspan="2">'+data.pExport1AgYr+'</th><th scope="col" colspan="2">'+data.pExportYr+'</th></tr>';
        			htmlObj += '<tr><th scope="col">수출금액</th><th scope="col">수출증감률</th><th scope="col">수출금액</th><th scope="col">수출증감률</th></tr>';
        			if(data.exportKorCrsjCmdlList != null && data.exportKorCrsjCmdlList.length > 0){
           				for(var i =0; i < data.exportKorCrsjCmdlList.length; i++){
           					htmlObj += '<tr><td style="padding:0">'+data.exportKorCrsjCmdlList[i].CMDLT_SN+'</td><td>'+data.exportKorCrsjCmdlList[i].CMDLT_CD+'</td><td>'+data.exportKorCrsjCmdlList[i].CMDLT_NAME+'</td>'; 
           					htmlObj += '<td class="txtR">'+data.exportKorCrsjCmdlList[i].YR1AG_EXP_AMT+'</td><td class="txtR">'+data.exportKorCrsjCmdlList[i].YR1AG_EXP_VARITN_RATE+'</td>'; 
           					htmlObj += '<td class="txtR">'+data.exportKorCrsjCmdlList[i].EXP_AMT+'</td><td class="txtR">'+data.exportKorCrsjCmdlList[i].EXP_VARITN_RATE+'</td></tr>';
           				}
        			}
        			htmlObj += '</tbody></table>';
        			htmlObj += '<p class="exclamS">자료원 : '+data.KOR_CRSJ_CMDLT_ARCV_CN+'('+data.KOR_CRSJ_CMDLT_PBLC_ERA_VAL+')</p></div>';
        			htmlObj += '<p class="txtMid" style="margin-top:30px">한국의 對주재국 상위 10개 수입품목(최근2년)</p>';
        			htmlObj += '<div class="tbInfoArea"><p class="tbInfoR">(금액 : 백만$)</p></div>';
        			htmlObj += '<div class="lineTop_tbArea">';
        			htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>최근 2개년도의  No, 코드(MTI 4단위), 품목명, 수입금액, 수입증감률에 대한 정보를 알 수 있는 표</p></caption>';
        			htmlObj += '<colgroup><col style="width:50px"><col style="width:100px"><col style="width:300px"><col style="width:120px"><col style="width:120px"><col style="width:120px"><col style="width:120px"></colgroup>';
        			htmlObj += '<tbody>';
        			htmlObj += '<tr><th scope="row" rowspan="2">No</th><th scope="row" rowspan="2">코드</br>(MTI 4단위)</th><th scope="row" rowspan="2">품목명</th><th scope="col" colspan="2">'+data.pImport1AgYr+'</th><th scope="col" colspan="2">'+data.pImportYr+'</th></tr>';
        			htmlObj += '<tr><th scope="col">수입금액</th><th scope="col">수입증감률</th><th scope="col">수입금액</th><th scope="col">수입증감률</th></tr>';
        			if(data.importKorCrsjCmdlList != null && data.importKorCrsjCmdlList.length > 0){
           				for(var i =0; i < data.importKorCrsjCmdlList.length; i++){
           					htmlObj += '<tr><td style="padding:0">'+data.importKorCrsjCmdlList[i].CMDLT_SN+'</td><td>'+data.importKorCrsjCmdlList[i].CMDLT_CD+'</td><td>'+data.importKorCrsjCmdlList[i].CMDLT_NAME+'</td>'; 
           					htmlObj += '<td class="txtR">'+data.importKorCrsjCmdlList[i].YR1AG_IMP_AMT+'</td><td class="txtR">'+data.importKorCrsjCmdlList[i].YR1AG_IMP_VARITN_RATE+'</td>'; 
           					htmlObj += '<td class="txtR">'+data.importKorCrsjCmdlList[i].NOW_YR_FYER_IMP_AMT+'</td><td class="txtR">'+data.importKorCrsjCmdlList[i].IMP_VARITN_RATE+'</td></tr>';
           				}
        			}
        			htmlObj += '</tbody></table>';
        			htmlObj += '<p class="exclamS">자료원 : '+data.KOR_CRSJ_CMDLT_ARCV_CN+'('+data.KOR_CRSJ_CMDLT_PBLC_ERA_VAL+')</p></div>';
        			htmlObj += '</div></div></div>';
        			htmlObj += '</div>';
        		}else if(ctgySn == "485"){
        			//수출 유망품목
        			htmlObj += '<div class="view_country_overview selectOption">';
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">수출유망품목</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
        			htmlObj += '<ul><li>'+data.EXP_BHRC_CMDLT_CN+'</li></ul>'
        			htmlObj += '</div>';
        			htmlObj += '</div></div></div>';
        			htmlObj += '</div>';
        		}else if(ctgySn == "410"){
        			//무역협정
        			htmlObj += '<div class="view_country_overview selectOption">';
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">무역협정 체결현황</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="lineTop_tbArea">';
        			htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>협정명, 체결국가, 체결일자, 발효일자, 비교에 대한 정보를 알 수 있는 표</p></caption>';
        			htmlObj += '<colgroup><col style="width:150px"><col style="width:120px"><col style="width:90px"><col style="width:90px"><col style="width:350px"></colgroup>';
        			htmlObj += '<tbody>'; 
        			htmlObj += '<tr><th scope="col">협정명</th><th scope="col">체결국가</th><th scope="col">체결일자</th><th scope="col">발효일자</th><th scope="col">비고</th></tr>';
        			if(data.eftaList != null && data.eftaList.length > 0){
           				for(var i =0; i < data.eftaList.length; i++){
           					htmlObj += '<tr><td class="txtL">'+data.eftaList[i].CNCLS_TRTY_NAME+'</td><td class="txtL">'+data.eftaList[i].TRTY_CNCLS_NAT_NAME+'</td><td>'+data.eftaList[i].TRTY_CNCLS_DE+'</td>'; 
           					htmlObj += '<td>'+data.eftaList[i].TRTY_EFTA_DE+'</td><td class="txtL">'+data.eftaList[i].TRTY_CNCLS_ETC_CN+'</td></tr>'; 
           				}
        			}else{
        				htmlObj += '<tr><td colspan="5">데이터가 없습니다.</td></tr>'; 
        			}
        			htmlObj += '</tbody></table>';
        			htmlObj += '<p class="exclamS">자료원 : '+data.TRTY_EFTA_ARCV_CN+'</p></div>';
        			htmlObj += '</div></div></div>';
        			
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">논의 중 협정</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="lineTop_tbArea">';
        			htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>협정명, 협상대상국가, 협정진행내용에 대한 정보를 알 수 있는 표</p></caption>';
        			htmlObj += '<colgroup><col style="width:200px"><col style="width:150px"><col style="width:350px"><col style="width:150px"></colgroup>';
        			htmlObj += '<tbody>'; 
        			htmlObj += '<tr><th scope="col">협정명</th><th scope="col">협상대상국가</th><th scope="col">협정진행내용</th><th scope="col">비고</th></tr>';
        			if(data.prgrList != null && data.prgrList.length > 0){
           				for(var i =0; i < data.prgrList.length; i++){
           					htmlObj += '<tr><td class="txtL">'+data.prgrList[i].DSCSS_TRTY_NAME+'</td><td class="txtL">'+data.prgrList[i].DSCSS_TRTY_TGT_NAT_NAME+'</td>'; 
           					htmlObj += '<td class="txtL alignPre">'+data.prgrList[i].TRTY_PRGR_CN+'</td><td class="txtL">'+data.prgrList[i].DSCSS_TRTY_ETC_CN+'</td></tr>'; 
           				}
        			}else{
        				htmlObj += '<tr><td colspan="4">데이터가 없습니다.</td></tr>'; 
        			}
        			htmlObj += '</tbody></table>';
        			htmlObj += '<p class="exclamS">자료원 : '+data.TRTY_PRGR_ARCV_CN+'</p></div>';
        			
        			htmlObj += '</div></div></div>';
        			htmlObj += '</div>';
        			
        		}else if(ctgySn == "489"){
        			htmlObj += '<div class="view_country_overview selectOption">';
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">수출유망품목(상품)</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
        			
        			if(data.bhrcGoodsList != null && data.bhrcGoodsList.length > 0){
        			    for(var i =0; i < data.bhrcGoodsList.length; i++){
        			    	htmlObj += '<div class="lineTop_tbArea" style="margin-bottom:30px">';	
        			    	htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>품목명, HS CODE, 수입액, 수입 관세율, 대한 수입액, 선정사유, 시장동향, 경쟁동향, 진출방안에 대한 정보를 알 수 있는 표</p></caption>';
        					htmlObj += '<colgroup><col style="width:20%"><col style="width:80%"></colgroup>';
        			    	htmlObj += '<tbody>'; 
        					htmlObj += '<tr><th scope="col">품목명</th><td class="txtL">'+data.bhrcGoodsList[i].BHRC_GOODS_NAME+'</td></tr>';
        					htmlObj += '<tr><th scope="col">HS CODE</th><td class="txtL alignPre">'+data.bhrcGoodsList[i].BHRC_GOODS_HSCD_NAME+'</td></tr>';
        					
        					htmlObj += '<tr><th scope="col">수입액 (US$백만)</th><td class="txtL alignPre">'+data.bhrcGoodsList[i].BHRC_GOODS_IMP_AMT_VAL+'</td></tr>';
        					htmlObj += '<tr><th scope="col">수입 관세율(%)</th><td class="txtL alignPre">'+data.bhrcGoodsList[i].BHRC_GOODS_IMP_TARIF_RATE_VAL+' %</td></tr>';
        					htmlObj += '<tr><th scope="col">대한 수입액 (US$백만)</th><td class="txtL">'+data.bhrcGoodsList[i].BHRC_GOODS_IMP_AMT_VAL+'</td></tr>';
        					
        					htmlObj += '<tr><th scope="col">선정사유</th><td class="txtL alignPre">'+data.bhrcGoodsList[i].BHRC_GOODS_SLCTN_RESN_CN+'</td></tr>';
        					htmlObj += '<tr><th scope="col">시장동향</th><td class="txtL">'+data.bhrcGoodsList[i].BHRC_GOODS_MRKT_TREND_CN+'</td></tr>';
        					htmlObj += '<tr><th scope="col">경쟁동향</th><td class="txtL alignPre">'+data.bhrcGoodsList[i].BHRC_GOODS_CMPET_TREND_CN+'</td></tr>';
        					htmlObj += '<tr><th scope="col">진출방안</th><td class="txtL">'+data.bhrcGoodsList[i].BHRC_GOODS_ADVNC_MTH_CN+'</td></tr>';
        					htmlObj += '</tbody>';
        					htmlObj += '</table>';
        					htmlObj += '</div>';
        			    }
        			    
    			        
        			    htmlObj += '</div>';
            			htmlObj += '</div></div></div>';
            			htmlObj += '</div>';
        			}
        			
        			htmlObj += '<div class="view_country_overview selectOption">';
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">수출유망품목(서비스)</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
        			
 					
 					
        			if(data.bhrcSvcList != null && data.bhrcSvcList.length > 0){
        			    for(var i =0; i < data.bhrcSvcList.length; i++){
        			    	htmlObj += '<div class="lineTop_tbArea" style="margin-bottom:30px">';	
        			    	htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>품목명, 선정사유, 시장동향, 경쟁동향, 진출방안에 대한 정보를 알 수 있는 표</p></caption>';
         					htmlObj += '<colgroup><col style="width:20%"><col style="width:80%"></colgroup>';
        			    	htmlObj += '<tbody>'; 
        					htmlObj += '<tr><th scope="col">품목명</th><td class="txtL alignPre">'+data.bhrcSvcList[i].BHRC_SVC_NAME+'</td></tr>';
        					htmlObj += '<tr><th scope="col">선정사유</th><td class="txtL alignPre">'+data.bhrcSvcList[i].BHRC_SVC_SLCTN_RESN_CN+'</td></tr>';
        					htmlObj += '<tr><th scope="col">시장동향</th><td class="txtL">'+data.bhrcSvcList[i].BHRC_SVC_MRKT_TREND_CN+'</td></tr>';
        					htmlObj += '<tr><th scope="col">경쟁동향</th><td class="txtL alignPre">'+data.bhrcSvcList[i].BHRC_SVC_CMPET_TREND_CN+'</td></tr>';
        					htmlObj += '<tr><th scope="col">진출방안</th><td class="txtL">'+data.bhrcSvcList[i].BHRC_SVC_ADVNC_MTH_CN+'</td></tr>';
        				    htmlObj += '</tbody>';
        				    htmlObj += '</table>';
        				    htmlObj += '</div>';
        			    }
        			    
    			        
        			    htmlObj += '</div>';
            			htmlObj += '</div></div></div>';
            			htmlObj += '</div>';
        			}
        		}else if(ctgySn == "411"){
        			//수입규제 및 관세
        			htmlObj += '<div class="view_country_overview selectOption">';
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">수입 규제 현황</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			if(data.korImpReglList != null && data.korImpReglList.length > 0){
	        			htmlObj += '<p class="txtMid">반덤핑/상계관세/세이프가드/수입쿼터</p>';
	        			htmlObj += '<div class="lineTop_tbArea">';
	        			htmlObj += '<table class="lineTop_tb2" style="min-width:740px; word-break:break-all;"><caption><p>No,수입국HS코드, 품목명, 규제형태, 규제대상국, 최종판정결과에 대한 정보를 알 수 있는 표</p></caption>';
	        			htmlObj += '<colgroup><col style="width:80px"><col style="width:200px"><col style="width:250px"><col style="width:110px"><col style="width:100px"><col style="width:230px"><col style="width:230px"></colgroup>';
	        			htmlObj += '<tr><th scope="col">NO</th><th scope="col">수입국HS코드</th><th scope="col">품목명</th><th scope="col">규제<br>형태</th><th scope="col">규제<br>대상국</th><th scope="col">최종판정결과</br>(부과기간)</th><th scope="col">최종판정결과</br>(판정결과)</th></tr>';
           				for(var i =0; i < data.korImpReglList.length; i++){
           					var rownum = i+1;
           					htmlObj += '<tr><td stlye="padding:0">'+rownum+'</td><td>'+data.korImpReglList[i].HSCD_CN+'</td>'; 
           					htmlObj += '<td class="txtL">'+data.korImpReglList[i].CMDLT_NAME+'</td><td>'+data.korImpReglList[i].REGL_CN+'</td>'; 
           					htmlObj += '<td>'+data.korImpReglList[i].PROBE_TGT_NAT_NAME+'</td><td class="txtL">'+fn_replace(data.korImpReglList[i].LAST_RSLT_PD_VAL)+'</td><td class="txtL">'+fn_replace(data.korImpReglList[i].LAST_RSLT_TXRT_VAL)+'</td></tr>';
           				}
	        			htmlObj += '<tbody>' 
	        			htmlObj += '</tbody></table></div>';
        			}
        			
        			htmlObj += '<div class="txtContArea" style="margin-top:30px">';
        			htmlObj += '<p class="txtMid">수입금지품목</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.IMP_PRHIBT_CMDLT_CN+'<li></ul>';
        			htmlObj += '</div>';
        			
        			htmlObj += '</div></div></div>';
        			
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">비관세장벽</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea" style="margin-top:30px">';
        			htmlObj += '<p class="txtMid">인증제도</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.CRTFC_SYST_CN+'<li></ul>';
        			htmlObj += '<p class="txtMid">TBT</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.TBT_CN+'<li></ul>';
        			if(data.ETC_CN != ""){
	        			htmlObj += '<p class="txtMid">기타</p>';
	        			htmlObj += '<ul><li class="alignPre">'+data.ETC_CN+'<li></ul>';
        			}
        			htmlObj += '</div>';
        			htmlObj += '</div></div></div>';
        			
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">관세제도</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea" style="margin-top:30px">';
        			htmlObj += '<p class="txtMid">관세제도 개요	</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.TARIF_SYST_SMMAR_CN+'<li></ul>';
        			htmlObj += '<p class="txtMid">관세율 알아보는법	</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.TARIF_CONF_MTH_CN+'<li></ul>';
        			htmlObj += '</div>';
        			htmlObj += '</div></div></div>';
        			htmlObj += '</div>';
        		}else if(ctgySn == "412"){
        			//통관 물류
        			htmlObj += '<div class="view_country_overview selectOption">';
        			
        			if(data.LGIST_INFO_CN != null && data.LGIST_INFO_CN != ""){
        				htmlObj += '<div class="list_Item" style="display:block">';
            			htmlObj += '<div class="country on"><p class="nation"><span class="tit">물류정보</span></p>';
            			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
            			htmlObj += '</div>';
            			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
            			htmlObj += '<div class="txtContArea">';
            			htmlObj += '<ul><li class="alignPre">'+data.LGIST_INFO_CN+'</li></ul>';
            			htmlObj += '</div>';
            			htmlObj += '</div></div></div>';
        			}
        			
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">통관제도</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
        			htmlObj += '<p class="txtMid">통관 유형별 절차</p>';
        			htmlObj += '<ul><li>'+fn_replace(data.CSCL_PROS_CN)+'</li></ul>';
        			htmlObj += '<p class="txtMid">통관시 유의사항</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.CSCL_ATNOTI_CN+'</li></ul>';
        			htmlObj += '</div>';
        			htmlObj += '</div></div></div>';
        			
        			
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">주요 포워딩업체 및 통관업체</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			
        			if(data.entpList != null && data.entpList.length > 0){
           				for(var i =0; i < data.entpList.length; i++){
           					htmlObj += '<div class="txtContArea">';
        	       			htmlObj += '<ul class="list_dotBlack"><li>'+data.entpList[i].ENTP_NAME+'</li></ul>';
        	       			htmlObj += '</div>';
        	       			
                			htmlObj += '<div class="lineTop_tbArea">';
                			htmlObj += '<table class="lineTop_tb2" style="min-width:540px"><caption><p>업체 주소, 전화번호, 이메일, 홈페이지, 비고에 대한 정보를 알 수 있는 표</p></caption>';
                			htmlObj += '<colgroup><col style="width:150px"><col></colgroup>';
                			htmlObj += '<tbody>'; 
                			htmlObj += '<tr><th scope="col">주소</th><td class="txtL">'+data.entpList[i].ENTP_ADRES_CN+'</td></tr>';
                			htmlObj += '<tr><th scope="col">전화번호</th><td class="txtL">'+data.entpList[i].ENTP_TELNO_ENCPT+'</td></tr>';
                			htmlObj += '<tr><th scope="col">이메일</th><td class="txtL"><a href="mailto:'+data.entpList[i].ENTP_EMAIL_ENCPT+'">'+data.entpList[i].ENTP_EMAIL_ENCPT+'</a></td></tr>';
                			htmlObj += '<tr><th scope="col">홈페이지</th><td class="txtL"><a href="'+data.entpList[i].ENTP_HMPG_URL_CN+'" target="_blank" title="홈페이지 이동">'+data.entpList[i].ENTP_HMPG_URL_CN+'</a></td></tr>';
                			htmlObj += '<tr><th scope="col">비고</th><td class="txtL alignPre">'+data.entpList[i].ENTP_ETC_CN+'</td></tr>';
                			htmlObj += '</tbody></table>';
                			htmlObj += '</div>';
           				}
           				htmlObj += '<p class="exclamS">자료원 : '+data.ENTP_ARCV_CN+'</p></div>';
        			}

        			htmlObj += '</div></div></div>';
        			htmlObj += '</div>';

        		}else if(ctgySn == "414"){
        			//투자환경
        			htmlObj += '<div class="view_country_overview selectOption">';
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">투자유치제도</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			
        			htmlObj += '<div class="txtContArea">';
        			htmlObj += '<p class="txtMid">외국인투자법</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.FRGNR_IVTSTT_PROS_CN+'</li></ul>';
        			htmlObj += '<p class="txtMid">투자인센티브</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.ENCRG_POLICY_CN+'</li></ul>';
        			htmlObj += '<p class="txtMid">제한 및 금지(업종)</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.LMTT_PRHIBT_INDUTY_CN+'</li></ul>';
        			htmlObj += '</div>';
        			
        			htmlObj += '</div></div></div>';
        			
        			
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">투자입지여건</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
        			htmlObj += '<p class="txtMid">특별경제구역 및 자유무역지대</p>';
        			htmlObj += '<ul><li>'+fn_replace(data.SPECL_ECNMY_ZONE_TFTA_CN)+'</li></ul>';
        			htmlObj += '<p class="txtMid">산업단지</p>';
        			htmlObj += '</div>';
        			if(data.industryList != null && data.industryList.length > 0){
           				for(var i =0; i < data.industryList.length; i++){
        	       			htmlObj += '<ul class="list_dotBlack"><li>'+data.industryList[i].INDUST_HSMP_NAME+'</li></ul>';
                			htmlObj += '<div class="lineTop_tbArea">';
                			htmlObj += '<table class="lineTop_tb2" style="min-width:540px"><caption><p>산업단지명, 규모, 위치, 임차료, 관할기관 및 연락처, 비고에 대한 정보를 알 수 있는 표</p></caption>';
                			htmlObj += '<colgroup><col style="width:150px"><col></colgroup>';
                			htmlObj += '<tbody>'; 
                			htmlObj += '<tr><th scope="col">규모</th><td class="txtL">'+data.industryList[i].INDUST_HSMP_AR_CN+'</td></tr>';
                			htmlObj += '<tr><th scope="col">위치</th><td class="txtL">'+data.industryList[i].INDUST_HSMP_ADRES_CN+'</td></tr>';
                			htmlObj += '<tr><th scope="col">임차료</th><td class="txtL alignPre">'+data.industryList[i].INDUST_HSMP_HIRE_FEE_CN+'</td></tr>';
                			htmlObj += '<tr><th scope="col">관할기관 및 연락처</th><td class="txtL alignPre">'+data.industryList[i].INDUST_HSMP_CMPTNC_INSTT_CN+'</td></tr>';
                			htmlObj += '<tr><th scope="col">비고</th><td class="txtL alignPre">'+data.industryList[i].INDUST_HSMP_ETC_CN+'</td></tr>';
                			htmlObj += '</tbody></table>';
                			htmlObj += '</div>';
           				}
        			}
        			htmlObj += '<p class="exclamS" style="margin-bottom:30px">자료원 : '+data.INDUST_HSMP_ARCV_CN+'</p>';
        			
        			htmlObj += '<p class="txtMid">주요 지역별 여건</p>';
        			if(data.etcList != null && data.etcList.length > 0){
           				for(var i =0; i < data.etcList.length; i++){
           					
        	       			htmlObj += '<ul class="list_dotBlack"><li>'+data.etcList[i].ETC_REGN_NAME+'</li></ul>';
        	       			htmlObj += '<ul style="margin-bottom:20px"><li class="alignPre">'+data.etcList[i].ETC_REGN_CN+'</li></ul>';
           				}
        			}
        			htmlObj += '</div></div></div>';
        			htmlObj += '</div>';

        			
        		}else if(ctgySn == "415"){
        			htmlObj += '<div class="view_country_overview selectOption">';
        			//----2023-06-22 수정
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">개요 및 동향</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="ture">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
	       			htmlObj += '<p class="txtMid">개요 및 동향</p>';
	       			htmlObj += '<ul><li class="alignPre">'+data.FRGNR_DRINV_SMMAR_TREND_CN+'</li></ul>';
	       			htmlObj += '</div>';
	       			htmlObj += '</div></div></div>';
	       			//----//2023-06-22 수정
	       			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">대내 외국인직접투자 현황</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			//----2023-06-22 수정
	       			htmlObj += '<p class="txtMid">대내 외국인직접투자 현황</p>';
	       			htmlObj += '<ul><li class="alignPre" style="margin-bottom:15px">'+data.INNER_FRGNR_DRINV_STTUS_CN+'</li></ul>';
	       			htmlObj += '<p class="txtMid">대내 외국인직접투자 현황표</p>';
	       			//----//2023-06-22 수정
        			htmlObj += '<div class="tbInfoArea"><p class="tbInfoR">(금액 : 백만$)</p></div>';
        			htmlObj += '<div class="lineTop_tbArea" style="margin-bottom:30px">';
        			htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>에 대한 정보를 알 수 있는 표</p></caption>';
        			htmlObj += '<colgroup>';
        			if(data.frgnrDrinvList != null && data.frgnrDrinvList.length > 0){
           				for(var i =0; i < data.frgnrDrinvList.length; i++){
           					htmlObj += '<col>';
           				}
        			}
        			htmlObj += '</colgroup>';
        			htmlObj += '<tbody>';
        			htmlObj += '<tr>';
        			if(data.frgnrDrinvList != null && data.frgnrDrinvList.length > 0){
           				for(var i =0; i < data.frgnrDrinvList.length; i++){
           					htmlObj += '<th scope="col">'+data.frgnrDrinvList[i].BASE_YR+'</th>';
           				}
        			}
        			htmlObj += '</tr>';
        			htmlObj += '<tr>';
        			if(data.frgnrDrinvList != null && data.frgnrDrinvList.length > 0){
           				for(var i =0; i < data.frgnrDrinvList.length; i++){
           					htmlObj += '<td class="txtR">'+data.frgnrDrinvList[i].ECOIND_VAL_TECH_VAL+'</td>';
           				}
        			}
        			htmlObj += '</tr>';
        			htmlObj += '</tbody></table>';
        			htmlObj += '<p class="exclamS">자료출처 : '+data.FRGNR_DRINV_AMT_ARCV_CN+'('+data.FGVST_PBLC_ERA_VAL+')</p>';
        			htmlObj += '</div>';
        			htmlObj += '</div></div></div>';
        			
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">대외 직접투자 현황</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			//----2023-06-22 수정
	       			htmlObj += '<p class="txtMid">대외 직접투자 현황</p>';
	       			htmlObj += '<ul><li class="alignPre" style="margin-bottom:15px">'+data.EXTRN_DRINV_STTUS_CN+'</li></ul>';
	       			htmlObj += '<p class="txtMid">대외 직접투자 현황표</p>';
	       			//----//2023-06-22 수정
        			htmlObj += '<div class="tbInfoArea"><p class="tbInfoR">(금액 : 백만$)</p></div>';
        			htmlObj += '<div class="lineTop_tbArea" style="margin-bottom:30px">';
        			htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>에 대한 정보를 알 수 있는 표</p></caption>';
        			htmlObj += '<colgroup>';
        			if(data.ovseaDrinvList != null && data.ovseaDrinvList.length > 0){
           				for(var i =0; i < data.ovseaDrinvList.length; i++){
           					htmlObj += '<col>';
           				}
        			}
        			htmlObj += '</colgroup>';
        			htmlObj += '<tbody>';
        			htmlObj += '<tr>';
        			if(data.ovseaDrinvList != null && data.ovseaDrinvList.length > 0){
           				for(var i =0; i < data.ovseaDrinvList.length; i++){
           					htmlObj += '<th scope="col">'+data.ovseaDrinvList[i].BASE_YR+'</th>';
           				}
        			}
        			htmlObj += '</tr>';
        			htmlObj += '<tr>';
        			if(data.ovseaDrinvList != null && data.ovseaDrinvList.length > 0){
           				for(var i =0; i < data.ovseaDrinvList.length; i++){
           					htmlObj += '<td class="txtR">'+data.ovseaDrinvList[i].ECOIND_VAL_TECH_VAL+'</td>';
           				}
        			}
        			htmlObj += '</tr>';
        			htmlObj += '</tbody></table>';
        			htmlObj += '<p class="exclamS">자료출처 : '+data.OVRSS_DRINV_AMT_ARCV_CN+'('+data.OVSIVT_PBLC_ERA_VAL+')</p>';
        			htmlObj += '</div>';
        			htmlObj += '</div></div></div>';
        			
        			htmlObj += '</div>';

        		}else if(ctgySn == "416"){
        			//한국기업 투자
        			htmlObj += '<div class="view_country_overview selectOption">';
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">한국기업 투자 통계</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			//----2023-06-22 수정
	       			htmlObj += '<p class="txtMid">한국기업 투자 통계</p>';
	       			htmlObj += '<ul><li class="alignPre" style="margin-bottom:15px">'+data.KOR_ENTP_INVT_STTUS_CN+'</li></ul>';
	       			htmlObj += '<p class="txtMid">한국기업 투자 통계표</p>';
	       			//----//2023-06-22 수정
        			htmlObj += '<div class="tbInfoArea"><p class="tbInfoR">(단위 : 건, 개, 천 달러)</p></div>';
        			htmlObj += '<div class="lineTop_tbArea" style="margin-bottom:30px">';
        			htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>연도, 신고건수, 신규법인수, 신고금액, 송금횟수, 투자금액에 대한 정보를 알 수 있는 표</p></caption>';
        			htmlObj += '<colgroup><col style="width:100px"><col style="width:16%"><col style="width:16%"><col style="width:16%"><col style="width:16%"><col style="width:16%"></colgroup>';
        			htmlObj += '<tbody>'; 
        			htmlObj += '<tr><th scope="col">연도</th><th scope="col">신고건수</th><th scope="col">신규법인수</th><th scope="col">신고금액</th><th scope="col">송금횟수</th><th scope="col">투자금액</th></tr>';
        			
        			var baseYr = [];
        			if(data.amtList != null && data.amtList.length > 0){
           				for(var i =0; i < data.amtList.length; i++){
           					baseYr[i] = data.amtList[i].BASE_YR;
           					htmlObj += '<tr><td>'+data.amtList[i].BASE_YR+'</td><td class="txtR">'+data.amtList[i].STTMN_CNT_STR+'</td><td class="txtR">'+data.amtList[i].NEW_CPR_CNT_STR+'</td>';
           					htmlObj += '<td class="txtR">'+data.amtList[i].STTMN_AMT_STR+'</td><td class="txtR">'+data.amtList[i].REMIT_CNT_STR+'</td><td class="txtR">'+data.amtList[i].INVT_AMT_STR+'</td></tr>';
           				}
        			}else{
        				htmlObj += '<tr><td colspan="6">데이터가 없습니다.</td></tr>';
        			}
        			htmlObj += '</tbody></table>';
        			htmlObj += '<p class="exclamS">자료출처 : '+data.BYIND_INVT_AMT_ARCV_CN+'('+data.BYIND_INVT_AMT_PBLC_ERA_VAL+')</p>';
        			htmlObj += '</div>';
        			htmlObj += '</div></div></div>';
        			
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">업종별 투자 동향</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			if(data.industryInvList != null && data.industryInvList.length > 0){
        				for(var y=0; y < baseYr.length; y++){
       	        			//----2023-06-22 수정
        					if(y==0){
        		       			htmlObj += '<p class="txtMid">업종별 투자 현황</p>';
        		       			htmlObj += '<ul><li class="alignPre" style="margin-bottom:15px">'+data.BYIND_INVT_TREND_CN+'</li></ul>';
        					}
       		       			//----//2023-06-22 수정
        					htmlObj += '<ul class="list_dotBlack"><li>'+baseYr[y]+'년 업종별 투자 현황표</li></ul>';
        					htmlObj += '<div class="tbInfoArea"><p class="tbInfoR">(단위 : 건, 개, 천 달러)</p></div>';
                			htmlObj += '<div class="lineTop_tbArea" style="margin-bottom:30px">';
                			htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>연도, 업종대분류, 신고건수, 신규법인수, 신고금액, 송금횟수, 투자금액에 대한 정보를 알 수 있는 표</p></caption>';
                			htmlObj += '<colgroup><col style="width:20%"><col style="width:15%"><col style="width:15%"><col style="width:15%"><col style="width:15%"><col style="width:15%"></colgroup>';
                			htmlObj += '<tbody>'; 
                			htmlObj += '<tr><th scope="col">업종대분류</th><th scope="col">신고건수</th><th scope="col">신규법인수</th><th scope="col">신고금액</th><th scope="col">송금횟수</th><th scope="col">투자금액</th></tr>';
        					for(var i =0; i < data.industryInvList.length; i++){
        						if(data.industryInvList[i].BASE_YR == baseYr[y]){
									htmlObj += '<tr><td>'+data.industryInvList[i].INDUTY_LCLAS_NAME+'</td><td class="txtR">'+data.industryInvList[i].STTMN_CNT_STR+'</td>';
		           					htmlObj += '<td class="txtR">'+data.industryInvList[i].NEW_CPR_CNT_STR+'</td><td class="txtR">'+data.industryInvList[i].STTMN_AMT_STR+'</td><td class="txtR">'+data.industryInvList[i].REMIT_CNT_STR+'</td><td class="txtR">'+data.industryInvList[i].INVT_AMT_STR+'</td></tr>';
        						}
	           				}
        					htmlObj += '</tbody></table>';
                			htmlObj += '</div>';
        				}
               			htmlObj += '<p class="exclamS">자료출처 : '+data.BYIND_INVT_AMT_ARCV_CN+'('+data.BYIND_INVT_AMT_PBLC_ERA_VAL+')</p>';
        			}
        			
        			htmlObj += '</div></div></div>';
        			
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">한국기업 진출현황</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			
        			if(data.advncList != null && data.advncList.length > 0){
        				for(var i =0; i < data.advncList.length; i++){
        					htmlObj += '<ul class="list_dotBlack"><li>'+data.advncList[i].KOR_ENTP_NAME+'</li></ul>';
        					htmlObj += '<div class="lineTop_tbArea" style="margin-bottom:30px">';	
		        			htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>기업명, 진출연도, 진출형태, 업종, 취급분야, 모기업명에 대한 정보를 알 수 있는 표</p></caption>';
		        			htmlObj += '<colgroup><col style="width:20%"><col style="width:80%"></colgroup>';
		        			htmlObj += '<tbody>'; 
		        			htmlObj += '<tr><th scope="col">진출연도</th><td class="txtL">'+data.advncList[i].LC_ADVNC_YR+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">진출형태</th><td class="txtL alignPre">'+data.advncList[i].LC_ADVNC_TY_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">업종</th><td class="txtL alignPre">'+data.advncList[i].INDUTY_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">취급분야</th><td class="txtL alignPre">'+data.advncList[i].TRTMNT_FILD_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">모기업명</th><td class="txtL">'+data.advncList[i].PCOMP_NAME+'</td></tr>';
        					htmlObj += '</tbody></table>';
        					htmlObj += '</div>';
        				}
	        			htmlObj += '<p class="exclamS">자료출처 : '+data.KOR_ENTP_ARCV_CN+'</p>';
        			}
        			htmlObj += '</div></div></div>';
        			
        			htmlObj += '</div>';

        		}else if(ctgySn == "417"){
        			//투자진출 방식
        			htmlObj += '<div class="view_country_overview selectOption">';
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">투자진출 형태</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
        			htmlObj += '<p class="txtMid">법인</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.CPR_CN+'</li></ul>';
        			htmlObj += '<p class="txtMid">지사</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.BRFFC_CN+'</li></ul>';
        			htmlObj += '<p class="txtMid">연락사무소</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.LASOFC_CN+'</li></ul>';
        			htmlObj += '</div>';
        			htmlObj += '</div></div></div>';
        			
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">투자진출시 유의사항</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
        			htmlObj += '<ul><li class="alignPre">'+data.INVT_ADVNC_ATNOTI_CN+'</li></ul>';
        			htmlObj += '</div>';
        			htmlObj += '</div></div></div>';
        			
        			
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">회사유형</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
        			htmlObj += '<p class="txtMid">주식회사</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.STOCK_CO_CN+'</li></ul>';
        			htmlObj += '<p class="txtMid">유한책임회사</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.LDBTY_CO_CN+'</li></ul>';
        			htmlObj += '<p class="txtMid">개인사업자</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.INDVDL_BSNM_CN+'</li></ul>';
        			if(data.coTyList != null && data.coTyList.length > 0){
        				for(var i =0; i < data.coTyList.length; i++){
        					htmlObj += '<p class="txtMid">'+data.coTyList[i].CO_TY_NAME +'</p>';
                			htmlObj += '<ul><li class="alignPre">'+data.coTyList[i].CO_TY_CN+'</li></ul>';
        				}
        			}
        			htmlObj += '</div>';
        			htmlObj += '</div></div></div>';
        			
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">회계/법무법인 안내</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			
        			if(data.cprList != null && data.cprList.length > 0){
        				for(var i =0; i < data.cprList.length; i++){
        					htmlObj += '<ul class="list_dotBlack"><li>'+data.cprList[i].CO_NAME+'</li></ul>';
        					htmlObj += '<div class="lineTop_tbArea" style="margin-bottom:30px">';	
		        			htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>'+data.cprList[i].CO_NAME+'</p></caption>';
		        			htmlObj += '<colgroup><col style="width:20%"><col style="width:80%"></colgroup>';
		        			htmlObj += '<tbody>'; 
		        			htmlObj += '<tr><th scope="col">전화번호</th><td class="txtL">'+data.cprList[i].CO_TELNO_ENCPT+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">주소</th><td class="txtL">'+data.cprList[i].CO_ADRES_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">홈페이지</th><td class="txtL"><a href="'+data.cprList[i].CO_HMPG_URL_CN+'" target="_blank">'+data.cprList[i].CO_HMPG_URL_CN+'</a></td></tr>';
		        			htmlObj += '<tr><th scope="col">이메일</th><td class="txtL"><a href="mailto:'+data.cprList[i].CO_HMPG_URL_CN+'">'+data.cprList[i].CO_EMAIL_ENCPT+'</a></td></tr>';
		        			htmlObj += '<tr><th scope="col">한국인교포 변호사 유무</th><td class="txtL">'+data.cprList[i].KRPP_OVKR_LAWYER_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">비고</th><td class="txtL alignPre">'+data.cprList[i].ETC_CN+'</td></tr>';
        					htmlObj += '</tbody></table>';
        					htmlObj += '</div>';
        				}
        				htmlObj += '<p class="exclamS">자료원 : '+data.ENTP_ARCV_CN+'</p>';
        			}
        			htmlObj += '</div></div></div>';
        			
        			htmlObj += '</div>';

        		}else if(ctgySn == "421"){
        			//외환
        			htmlObj += '<div class="view_country_overview selectOption">';
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">금융ㆍ외환ㆍ자금조달</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
        			htmlObj += '<p class="txtMid">외환 제도 개요	</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.FRXCG_SYST_SMMAR_CN+'</li></ul>';
        			htmlObj += '<p class="txtMid">외환 규제</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.FRXCG_RELTD_REGL_CN+'</li></ul>';
        			htmlObj += '</div>';
        			htmlObj += '</div></div></div>';
        			htmlObj += '</div>';
        		}else if(ctgySn == "419"){
        			//노무
        			htmlObj += '<div class="view_country_overview selectOption">';
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">임금 수준</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<p class="txtUnit">1 USD :'+data.USD_VAL+'</p>';
        			htmlObj += '<div class="lineTop_tbArea" style="margin-bottom:30px">';
        			htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>대졸-사무직 초임, 고졸-생산직 초임, 최저임금, 비고에 대한 정보를 알 수 있는 표</p></caption>';
        			htmlObj += '<colgroup><col><col><col><col><col><col></colgroup>';
        			htmlObj += '<tbody>';
        			htmlObj += '<tr><th scope="col">대졸-사무직 초임</br>(평균임금, 달러)</th><td>'+fn_numberFormat(data.CLGGRD_OFJFP_AVG_WAGE) + '</td><th scope="col">고졸-생산직 초임</br>(평균임금, 달러)</th><td>'+data.HSGRD_MFJFP_AVG_WAGE +'</td><th scope="col">최저임금</br>(시간당, 달러)</th><td>'+data.LWET_WAGE + '</td></tr>';
        			htmlObj += '<tr><th scope="col">비고</th><td colspan="5" class="txtL alignPre">'+data.LBRC_ETC_CN + '</td></tr>';
        			htmlObj += '</tbody></table>';
        			htmlObj += '<p class="exclamS">자료출처 : '+data.WAGE_ARCV_CN+'</p>';
        			htmlObj += '</div>';
        			htmlObj += '</div></div></div>';
        			
        			
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">노무관리</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
        			htmlObj += '<p class="txtMid">고용계약	</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.EMPLM_CNTRCT_CN+'</li></ul>';
        			htmlObj += '<p class="txtMid">근로시간	</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.LABOR_TIME_CN+'</li></ul>';
        			htmlObj += '<p class="txtMid">휴가</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.VCATN_CN+'</li></ul>';
        			htmlObj += '<p class="txtMid">해고</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.DISML_CN+'</li></ul>';
        			htmlObj += '<p class="txtMid">퇴직금	</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.RETRE_AMT_CN+'</li></ul>';
        			if(data.lbrcEtcList != null && data.lbrcEtcList.length > 0){
        				for(var i =0; i < data.lbrcEtcList.length; i++){
        					htmlObj += '<p class="txtMid">'+data.lbrcEtcList[i].LBRC_ETC_NAME +'</p>';
                			htmlObj += '<ul><li class="alignPre">'+data.lbrcEtcList[i].LBRC_ETC_CN+'</li></ul>';
        				}
        			}
        			htmlObj += '</div>';
        			htmlObj += '</div></div></div>';
        			
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">사회보장세</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
        			htmlObj += '<p class="txtMid">건강보험	</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.HLTH_INSR_CN+'</li></ul>';
        			htmlObj += '<p class="txtMid">고용보험	</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.EMPLM_INSR_CN+'</li></ul>';
        			htmlObj += '<p class="txtMid">산재보험	</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.INDACC_INSR_CN+'</li></ul>';
        			htmlObj += '<p class="txtMid">국민연금	</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.NPN_CN+'</li></ul>';
        			if(data.sosecEtcList != null && data.sosecEtcList.length > 0){
        				for(var i =0; i < data.sosecEtcList.length; i++){
        					htmlObj += '<p class="txtMid">'+data.sosecEtcList[i].SOSEC_ETC_NAME +'</p>';
                			htmlObj += '<ul><li class="alignPre">'+data.sosecEtcList[i].SOSEC_ETC_CN+'</li></ul>';
        				}
        			}
        			htmlObj += '</div>';
        			htmlObj += '</div></div></div>';
        			htmlObj += '</div>';
        			
        		}else if(ctgySn == "420"){
        			//세무
        			htmlObj += '<div class="view_country_overview selectOption">';
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">조세제도</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
        			htmlObj += '<p class="txtMid">법인세</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.CRRX_CN+'</li></ul>';
        			htmlObj += '<p class="txtMid">개인소득세</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.INDVDL_INTAX_CN+'</li></ul>';
        			htmlObj += '<p class="txtMid">부가가치세</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.VAT_CN+'</li></ul>';
        			htmlObj += '<p class="txtMid">특별소비세</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.SPECL_CNSTAX_CN+'</li></ul>';
        			if(data.taxEtcList != null && data.taxEtcList.length > 0){
        				for(var i =0; i < data.taxEtcList.length; i++){
        					htmlObj += '<p class="txtMid">'+data.taxEtcList[i].TAX_ETC_NAME +'</p>';
                			htmlObj += '<ul><li class="alignPre">'+data.taxEtcList[i].TAX_ETC_CN+'</li></ul>';
        				}
        			}
        			htmlObj += '</div>';
        			htmlObj += '</div></div></div>';
        			htmlObj += '</div>';

        		}else if(ctgySn == "483"){
        			//지식재산권
        			htmlObj += '<div class="view_country_overview selectOption">';
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">지식재산권</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
        			htmlObj += '<ul><li class="alignPre">'+data.IPR_CN+'</li></ul>';
        			htmlObj += '</div>';
        			htmlObj += '</div></div></div>';
        			htmlObj += '</div>';
        			
        		}else if(ctgySn == "418"){
        			
        			//청산 및 철수
        			htmlObj += '<div class="view_country_overview selectOption">';
        			//----2023-06-22 수정
        			//----2024-09-02 수정 안내문구 삭제 (김민아 요청)
        			/*
        			if(data.GUIDE_TXT_CN != '내용 없음'){
	        			htmlObj += '<div class="list_Item" style="display:block">';
	        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">안내문구</span></p>';
	        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="ture">내용확장됨</button>';
	        			htmlObj += '</div>';
	        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
	        			htmlObj += '<div class="txtContArea">';
		       			htmlObj += '<p class="txtMid">안내문구</p>';
		       			htmlObj += '<ul><li class="alignPre">'+data.GUIDE_TXT_CN+'</li></ul>';
		       			htmlObj += '</div>';
		       			htmlObj += '</div></div></div>';
        			}
        			*/
	       			//----//2023-06-22 수정
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">청산 및 철수</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
        			htmlObj += '<p class="txtMid">관련 법 및 절차</p>';
        			htmlObj += '<ul><li>'+fn_replace(data.RELTD_LAW_PROS_CN)+'</li></ul>';
        			htmlObj += '</div>';
        			htmlObj += '</div></div></div>';
        			htmlObj += '</div>';
        		}else if(ctgySn == "423"){
        			//시장특성
        			htmlObj += '<div class="view_country_overview selectOption">';
        			//----2023-06-22 수정
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">시장특성</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="ture">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
	       			htmlObj += '<p class="txtMid">시장특성</p>';
	       			htmlObj += '<ul><li class="alignPre">'+data.MRKT_CHRTRT_CN+'</li></ul>';
	       			htmlObj += '</div>';
	       			htmlObj += '</div></div></div>';
	       			//----//2023-06-22 수정
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">시장 및 소비자 특성</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
        			htmlObj += '<p class="txtMid">소비인구</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.CNSMP_POPLTN_CN+'&lt;자료원: '+data.CNSMP_POPLTN_ARCV_CN+'&gt;</li></ul>';
        			htmlObj += '<p class="txtMid">소비성향 </p>';
        			htmlObj += '<ul><li class="alignPre">'+data.CNSMP_INCLN_CN+'</li></ul>';
        			htmlObj += '<p class="txtMid">한국상품 이미지 </p>';
        			htmlObj += '<ul><li class="alignPre">'+data.KOR_GOODS_IMG_CN+'</li></ul>';
        			htmlObj += '</div>';
        			htmlObj += '</div></div></div>';
        			htmlObj += '</div>';
        		}else if(ctgySn == "424"){
        			//비즈니스 에티켓
        			htmlObj += '<div class="view_country_overview selectOption">';
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">상거래 유의사항</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
        			htmlObj += '<p class="txtMid">상거래 시 유의사항	</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.BIZDL_ATNOTI_CN+'</li></ul>';
        			htmlObj += '</div>';
        			htmlObj += '</div></div></div>';
        			
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">상담 유의사항</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
        			htmlObj += '<p class="txtMid">상담 및 문화적 유의사항</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.CNSLT_CLTUR_ATNOTI_CN+'</li></ul>';
        			htmlObj += '</div>';
        			htmlObj += '</div></div></div>';
        			htmlObj += '</div>';
        		}else if(ctgySn == "490"){
        			//주요 전자상거래 플랫폼(신)
        			htmlObj += '<div class="view_country_overview selectOption">';
        			//----2023-06-22 수정
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">주요전자상거래 플랫폼</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			if(data.ecPltfmList != null && data.ecPltfmList.length > 0){
        				for(var i =0; i < data.ecPltfmList.length; i++){
		        			htmlObj += '<div class="lineTop_tbArea" style="margin-bottom:30px">';
		        			htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>기관명, 전화번호, 주소, 홈페이지, 비고에 대한 정보를 알 수 있는 표</p></caption>';
		        			htmlObj += '<colgroup><col style="width:20%"><col style="width:80%"></colgroup>';
		        			htmlObj += '<tr><th scope="col">사이트이름</th><td class="txtL">'+data.ecPltfmList[i].EC_PLTFM_NAME+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">사이트주소</th><td class="txtL">'+data.ecPltfmList[i].EC_PLTFM_URL+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">개요</th><td class="txtL">'+data.ecPltfmList[i].EC_PLTFM_SMMAR_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">설립연도 및 매출규모, 고용인원</th><td class="txtL">'+data.ecPltfmList[i].EC_PLTFM_DTL_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">주요 판매 품목</th><td class="txtL">'+data.ecPltfmList[i].EC_PLTFM_MAIN_CMDLT_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">특징</th><td class="txtL">'+data.ecPltfmList[i].EC_PLTFM_SPFTR_CN+'</td></tr>';
		        			htmlObj += '<tbody>'; 
		        			htmlObj += '</tbody></table>';
		        			htmlObj += '</div>';
        				}
        			}
        			htmlObj += '</div></div></div>';
	       			//----//2023-06-22 수정
        			
        		}else if(ctgySn == "484"){
        			//주요 전자상거래 플랫폼
        			htmlObj += '<div class="view_country_overview selectOption">';
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">주요 전자상거래 플랫폼</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
        			htmlObj += '<ul><li>'+data.EC_PLTFM_CN+'</li></ul>';
        			htmlObj += '</div>';
        			htmlObj += '</div></div></div>';
        			htmlObj += '</div>';
        		}else if(ctgySn == "425"){
        			//성공사레
        			htmlObj += '<div class="view_country_overview selectOption">';
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">성공사례</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
        			htmlObj += '<ul><li class="alignPre">'+data.ADVNC_SUCSCS_CN+'</li></ul>';
        			htmlObj += '</div>';
        			htmlObj += '</div></div></div>';
        			//----2023-06-22 수정
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">실패사례</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="ture">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
	       			htmlObj += '<ul><li class="alignPre">'+data.ADVNC_FAILR_CASE_CN+'</li></ul>';
	       			htmlObj += '</div>';
	       			htmlObj += '</div></div></div>';
	       			//----//2023-06-22 수정
        			htmlObj += '</div>';
        		}else if(ctgySn == "426"){
        			//출입국 안내
        			htmlObj += '<div class="view_country_overview selectOption">';
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">비자</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
        			htmlObj += '<p class="txtMid">종류 및 발급 절차	</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.SRTPD_VISA_CN+'</li></ul>';
        			htmlObj += '</div>';
        			htmlObj += '</div></div></div>';
        			
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">휴대품 통관</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
        			htmlObj += '<p class="txtMid">휴대품 면세</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.CRYAL_CMDLT_TAXXPT_LMT_CN+'</li></ul>';
        			htmlObj += '</div>';
        			htmlObj += '</div></div></div>';
        			htmlObj += '</div>';
        		}else if(ctgySn == "427"){
        			//유관기관
        			htmlObj += '<div class="view_country_overview selectOption">';
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">대사관 및 한국기관</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			if(data.korInsttList != null && data.korInsttList.length > 0){
        				for(var i =0; i < data.korInsttList.length; i++){
        					htmlObj += '<ul class="list_dotBlack"><li>'+data.korInsttList[i].INSTT_NAME+'</li></ul>';
		        			htmlObj += '<div class="lineTop_tbArea" style="margin-bottom:30px">';
		        			htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>기관명, 전화번호, 주소, 홈페이지, 비고에 대한 정보를 알 수 있는 표</p></caption>';
		        			htmlObj += '<colgroup><col style="width:20%"><col style="width:80%"></colgroup>';
		        			htmlObj += '<tr><th scope="col">전화번호</th><td class="txtL">'+data.korInsttList[i].INSTT_TELNO_VAL+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">주소</th><td  class="txtL">'+data.korInsttList[i].INSTT_ADRES_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">홈페이지</th><td  class="txtL"><a href="'+data.korInsttList[i].INSTT_HMPG_URL_CN+'" target="_blank" title="홈페이지이동">'+data.korInsttList[i].INSTT_HMPG_URL_CN+'</a></td></tr>';
		        			if(data.korInsttList[i].ETC_CN != ""){
			        			htmlObj += '<tr><th scope="col">비고</th><td  class="txtL alignPre">'+data.korInsttList[i].ETC_CN+'</td></tr>';
		        			}
		        			htmlObj += '<tbody>'; 
		        			htmlObj += '</tbody></table>';
		        			htmlObj += '</div>';
        				}
        			}
        			htmlObj += '<p class="exclamS">자료출처 : '+data.KOR_GVRN_INSTT_ARCV_CN+'</p>';
        			htmlObj += '</div></div></div>';
        			
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">현지정부 및 언론기관</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			if(data.lcInsttList != null && data.lcInsttList.length > 0){
        				for(var i =0; i < data.lcInsttList.length; i++){
        					htmlObj += '<ul class="list_dotBlack"><li>'+data.lcInsttList[i].GVRN_INSTT_NAME+'</li></ul>';
		        			htmlObj += '<div class="lineTop_tbArea" style="margin-bottom:30px">';
		        			htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>기관명, 전화번호, 주소, 홈페이지, 비고에 대한 정보를 알 수 있는 표</p></caption>';
		        			htmlObj += '<colgroup><col style="width:20%"><col style="width:80%"></colgroup>';
		        			htmlObj += '<tr><th scope="col">전화번호</th><td class="txtL">'+data.lcInsttList[i].GVRN_INSTT_TELNO_VAL+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">주소</th><td  class="txtL">'+data.lcInsttList[i].GVRN_INSTT_ADRES_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">홈페이지</th><td  class="txtL"><a href="'+data.lcInsttList[i].GVRN_INSTT_HMPG_URL_CN+'" target="_blank" title="홈페이지이동">'+data.lcInsttList[i].GVRN_INSTT_HMPG_URL_CN+'</a></td></tr>';
		        			if(data.lcInsttList[i].GVRN_INSTT_ETC_CN != ""){
			        			htmlObj += '<tr><th scope="col">비고</th><td  class="txtL alignPre">'+data.lcInsttList[i].GVRN_INSTT_ETC_CN+'</td></tr>';
		        			}
		        			htmlObj += '<tbody>'; 
		        			htmlObj += '</tbody></table>';
		        			htmlObj += '</div>';
        				}
        			}
        			htmlObj += '<p class="exclamS">자료출처 : '+data.LC_GVRN_INSTT_ARCV_CN+'</p>';
        			htmlObj += '</div></div></div>';
        			
        			htmlObj += '</div>';
        		}else if(ctgySn == "428"){
        			//물가정보표 
        			htmlObj += '<div class="view_country_overview selectOption">';
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">물가정보표</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<p class="txtUnit">1 USD :'+data.USD_VAL+'</p>';
        			htmlObj += '<div class="lineTop_tbArea" style="margin-bottom:30px">';
        			htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>에 대한 정보를 알 수 있는 표</p></caption>';
        			htmlObj += '<colgroup><col style="width:80px"><col style="width:150px"><col><col style="width:15%"><col style="width:15%"></colgroup>';
        			htmlObj += '<tbody>'; 
        			htmlObj += '<tr><th scope="col">No</th><th scope="col">구분</th><th scope="col">품목</th><th scope="col">단위</th><th scope="col">금액</th></tr>';
        			if(data.pricesCmdltList != null && data.pricesCmdltList.length > 0){
        				for(var i =0; i < data.pricesCmdltList.length; i++){
        					htmlObj += '<tr><td>'+ ( i + 1 ) + '</td><td>'+data.pricesCmdltList[i].CMDLT_GBN_NAME + '</td>';
        					htmlObj += '<td>'+data.pricesCmdltList[i].CMDLT_NAME + '</td><td>'+data.pricesCmdltList[i].UNIT_NAME + '</td>';
        					htmlObj += '<td class="txtR">'+fn_numberFormat(data.pricesCmdltList[i].CMDLT_AMT) + '</td></tr>';
        				}
        			}
        			htmlObj += '</tbody></table>';
        			htmlObj += '<p class="exclamS">자료원 : '+data.PRICES_INFO_ARCV_CN+'</p>';
        			htmlObj += '</div>';
        			htmlObj += '</div></div></div>';
        			htmlObj += '</div>';

        		}else if(ctgySn == "429"){
        			//출장정보
        			htmlObj += '<div class="view_country_overview selectOption">';
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">환전</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
        			htmlObj += '<p class="txtMid">통화체계</p>';
        			htmlObj += '<ul><li>'+data.CRNCY_SYSTM_CN+'</li></ul>';
        			htmlObj += '<p class="txtMid">환전방법</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.EXCNG_MTH_CN+'</li></ul>';
        			htmlObj += '<p class="txtMid">신용카드 이용</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.CRTCRD_USE_CN+'</li></ul>';
        			htmlObj += '</div>';
        			htmlObj += '</div></div></div>';
        			
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">교통</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
        			htmlObj += '<p class="txtMid">교통상황</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.TRNPT_STTN_CN+'</li></ul>';
        			htmlObj += '<p class="txtMid">버스</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.BYBUS_INFO_CN+'</li></ul>';
        			htmlObj += '<p class="txtMid">택시</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.BYTAXI_INFO_CN+'</li></ul>';
        			if(data.etcTrnspList != null && data.etcTrnspList.length > 0){
        				for(var i =0; i < data.etcTrnspList.length; i++){
        					htmlObj += '<p class="txtMid">'+data.etcTrnspList[i].ETC_TRNPT_NAME+'</p>';
                			htmlObj += '<ul><li class="alignPre">'+data.etcTrnspList[i].ETC_TRNPT_CN+'</li></ul>';
        				}
        			}
        			htmlObj += '</div>';
        			htmlObj += '</div></div></div>';
        			
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">통신</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
        			htmlObj += '<p class="txtMid">핸드폰</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.USIM_RMN_PRCH_CN+'</li></ul>';
        			htmlObj += '<p class="txtMid">인터넷(와이파이)</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.INTNET_WIFI_CN+'</li></ul>';
        			htmlObj += '</div>';
        			htmlObj += '</div></div></div>';
        			
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">주요명소</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			
        			if(data.atrtList != null && data.atrtList.length > 0){
        				for(var i =0; i < data.atrtList.length; i++){
        					htmlObj += '<ul class="list_dotBlack" style="margin-top:15px"><li>'+data.atrtList[i].KRN_ATTRC_NAME+'('+data.atrtList[i].ENG_ATTRC_NAME+')</li></ul>';
        					htmlObj += '<div class="lineTop_tbArea">';	
		        			htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>명소명, 도시명, 주소, 운영시간, 휴무일, 명소소개, 비고에 대한 정보를 알 수 있는 표</p></caption>';
		        			htmlObj += '<colgroup><col style="width:20%"><col style="width:80%"></colgroup>';
		        			htmlObj += '<tbody>'; 
		        			htmlObj += '<tr><th scope="col">도시명</th><td class="txtL">'+data.atrtList[i].ATTRC_CTY_NAME+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">주소</th><td class="txtL">'+data.atrtList[i].ATTRC_ADRES_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">운영시간 </th><td class="txtL alignPre">'+data.atrtList[i].ATTRC_OPRTN_TIME_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">휴무일 </th><td class="txtL alignPre">'+data.atrtList[i].ATTRC_HVOF_INFO_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">명소소개 </th><td class="txtL alignPre">'+data.atrtList[i].ATTRC_INTRCN_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">비고</th><td class="txtL alignPre">'+data.atrtList[i].ATTRC_ETC_CN+'</td></tr>';
        					htmlObj += '</tbody></table>';
        					htmlObj += '</div>';
        				}
        			}
        			htmlObj += '<p class="exclamS">자료원 : '+data.ATTRC_ARCV_CN+'</p>';
        			htmlObj += '</div></div></div>';
        			
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">식당</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<p class="txtMid">현지식당</p>';
        			if(data.acplcRstrtList != null && data.acplcRstrtList.length > 0){
        				for(var i =0; i < data.acplcRstrtList.length; i++){
        					htmlObj += '<ul class="list_dotBlack" style="margin-top:15px"><li>'+data.acplcRstrtList[i].KRN_LC_RSTRNT_NAME+'('+data.acplcRstrtList[i].ENG_LC_RSTRNT_NAME+')</li></ul>';
        					htmlObj += '<div class="lineTop_tbArea">';	
		        			htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>식당명, 도시명, 전화번호, 주소, 영업시간, 휴무일, 소개, 비고에 대한 정보를 알 수 있는 표</p></caption>';
		        			htmlObj += '<colgroup><col style="width:20%"><col style="width:80%"></colgroup>';
		        			htmlObj += '<tbody>'; 
		        			htmlObj += '<tr><th scope="col">도시명</th><td class="txtL">'+data.acplcRstrtList[i].LC_RSTRNT_CTY_NAME+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">전화번호</th><td class="txtL">'+data.acplcRstrtList[i].LC_RSTRNT_TELNO_VAL+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">주소 </th><td class="txtL alignPre">'+data.acplcRstrtList[i].LC_RSTRNT_ADRES_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">가격  </th><td class="txtL alignPre">'+data.acplcRstrtList[i].LC_RSTRNT_PRC_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">영업시간  </th><td class="txtL alignPre">'+data.acplcRstrtList[i].LC_RSTRNT_OPRTN_TIME_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">휴무일  </th><td class="txtL alignPre">'+data.acplcRstrtList[i].LC_RSTRNT_RESTDE_INFO_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">소개   </th><td class="txtL alignPre">'+data.acplcRstrtList[i].LC_RSTRNT_INTRCN_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">비고</th><td class="txtL alignPre">'+data.acplcRstrtList[i].LC_RSTRNT_ETC_CN+'</td></tr>';
        					htmlObj += '</tbody></table>';
        					htmlObj += '</div>';
        				}
        			}
        			htmlObj += '<p class="exclamS">자료원 : '+data.LC_RSTRNT_ARCV_CN+'</p>';
        			
        			htmlObj += '<p class="txtMid" style="margin-top:30px">한국식당</p>';
        			if(data.krppRstrtList != null && data.krppRstrtList.length > 0){
        				for(var i =0; i < data.krppRstrtList.length; i++){
        					htmlObj += '<ul class="list_dotBlack" style="margin-top:15px"><li>'+data.krppRstrtList[i].KRN_KRPP_RSTRNT_NAME+'('+data.krppRstrtList[i].ENG_KRPP_RSTRNT_NAME+')</li></ul>';
        					htmlObj += '<div class="lineTop_tbArea">';	
		        			htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>식당명, 도시명, 전화번호, 주소, 영업시간, 휴무일, 소개, 비고에 대한 정보를 알 수 있는 표</p></caption>';
		        			htmlObj += '<colgroup><col style="width:20%"><col style="width:80%"></colgroup>';
		        			htmlObj += '<tbody>'; 
		        			htmlObj += '<tr><th scope="col">도시명</th><td class="txtL">'+data.krppRstrtList[i].KRPP_RSTRNT_CTY_NAME+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">전화번호</th><td class="txtL">'+data.krppRstrtList[i].KRPP_RSTRNT_TELNO_VAL+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">주소 </th><td class="txtL alignPre">'+data.krppRstrtList[i].KRPP_RSTRNT_ADRES_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">가격  </th><td class="txtL alignPre">'+data.krppRstrtList[i].KRPP_RSTRNT_PRC_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">영업시간  </th><td class="txtL alignPre">'+data.krppRstrtList[i].KRPP_RSTRNT_OPRTN_TIME_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">휴무일  </th><td class="txtL alignPre">'+data.krppRstrtList[i].KRPP_RSTRNT_RESTDE_INFO_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">소개   </th><td class="txtL alignPre">'+data.krppRstrtList[i].KRPP_RSTRNT_INTRCN_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">비고</th><td class="txtL alignPre">'+data.krppRstrtList[i].KRPP_RSTRNT_ETC_CN+'</td></tr>';
        					htmlObj += '</tbody></table>';
        					htmlObj += '</div>';
        				}
        			}
        			htmlObj += '<p class="exclamS">자료원 : '+data.KRPP_RSTRNT_ARCV_CN+'</p>';
        			htmlObj += '</div></div></div>';
        			
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">호텔</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<p class="txtMid">호텔</p>';
        			if(data.bizHotelList != null && data.bizHotelList.length > 0){
        				for(var i =0; i < data.bizHotelList.length; i++){
        					htmlObj += '<ul class="list_dotBlack" style="margin-top:15px"><li>'+data.bizHotelList[i].KRN_BSNS_HOTEL_NAME+'('+data.bizHotelList[i].ENG_BSNS_HOTEL_NAME+')</li></ul>';
        					htmlObj += '<div class="lineTop_tbArea">';	
		        			htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>호텔명, 도시명, 전화번호, 주소, 영업시간, 휴무일, 소개, 비고에 대한 정보를 알 수 있는 표</p></caption>';
		        			htmlObj += '<colgroup><col style="width:20%"><col style="width:80%"></colgroup>';
		        			htmlObj += '<tbody>'; 
		        			htmlObj += '<tr><th scope="col">도시명</th><td class="txtL">'+data.bizHotelList[i].BSNS_HOTEL_CTY_NAME+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">주소 </th><td class="txtL">'+data.bizHotelList[i].BSNS_HOTEL_ADRES_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">전화번호   </th><td class="txtL">'+data.bizHotelList[i].BSNS_HOTEL_TELNO_VAL+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">홈페이지   </th><td class="txtL"><a href="'+data.bizHotelList[i].BSNS_HOTEL_HMPG_URL_CN+'" target="_blank" title="홈페이지 이동">'+data.bizHotelList[i].BSNS_HOTEL_HMPG_URL_CN+'</a></td></tr>';
		        			htmlObj += '<tr><th scope="col">숙박료   </th><td class="txtL alignPre">'+data.bizHotelList[i].BSNS_HOTEL_STAYNG_FEE_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">소개   </th><td class="txtL alignPre">'+data.bizHotelList[i].BSNS_HOTEL_INTRCN_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">비고</th><td class="txtL alignPre">'+data.bizHotelList[i].BSNS_HOTEL_ETC_CN+'</td></tr>';
        					htmlObj += '</tbody></table>';
        					htmlObj += '</div>';
        				}
        			}
        			htmlObj += '<p class="exclamS">자료원 : '+data.BSNS_HOTEL_ARCV_CN+'</p>';
        			
        			htmlObj += '<p class="txtMid" style="margin-top:30px">게스트하우스</p>';
        			if(data.gsthsList != null && data.gsthsList.length > 0){
        				for(var i =0; i < data.gsthsList.length; i++){
        					htmlObj += '<ul class="list_dotBlack" style="margin-top:15px"><li>'+data.gsthsList[i].KRN_GSTHS_NAME+'('+data.gsthsList[i].ENG_GSTHS_NAME+')</li></ul>';
        					htmlObj += '<div class="lineTop_tbArea">';	
		        			htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>게스트하우스명, 도시명, 전화번호, 주소, 영업시간, 휴무일, 소개, 비고에 대한 정보를 알 수 있는 표</p></caption>';
		        			htmlObj += '<colgroup><col style="width:20%"><col style="width:80%"></colgroup>';
		        			htmlObj += '<tbody>'; 
		        			htmlObj += '<tr><th scope="col">도시명</th><td class="txtL">'+data.gsthsList[i].GSTHS_CTY_NAME+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">주소 </th><td class="txtL">'+data.gsthsList[i].GSTHS_ADRES_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">전화번호   </th><td class="txtL">'+data.gsthsList[i].GSTHS_TELNO_VAL+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">홈페이지   </th><td class="txtL"><a href="'+data.gsthsList[i].GSTHS_HMPG_URL_CN+'" target="_blank" title="홈페이지 이동">'+data.gsthsList[i].GSTHS_HMPG_URL_CN+'</a></td></tr>';
		        			htmlObj += '<tr><th scope="col">숙박료   </th><td class="txtL alignPre">'+data.gsthsList[i].GSTHS_STAYNG_FEE_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">소개   </th><td class="txtL alignPre">'+data.gsthsList[i].GSTHS_INTRCN_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">비고</th><td class="txtL alignPre">'+data.gsthsList[i].GSTHS_ETC_CN+'</td></tr>';
        					htmlObj += '</tbody></table>';
        					htmlObj += '</div>';
        				}
        			}
        			htmlObj += '<p class="exclamS">자료원 : '+data.GSTHS_ARCV_CN+'</p>';
        			htmlObj += '</div></div></div>';
        			
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">치안</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
        			htmlObj += '<p class="txtMid">치안상황</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.PBLPIC_STTN_CN+'</li></ul>';
        			htmlObj += '<p class="txtMid">응급상황 대처요령</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.EMGNC_STTN_CNTMS_CHEAT_CN+'</li></ul>';
        			htmlObj += '</div>';
        			htmlObj += '</div></div></div>';

        			htmlObj += '</div>';
        			
        		}else if(ctgySn == "430"){
        			//생활정보
        			htmlObj += '<div class="view_country_overview selectOption">';
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">주택</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
        			htmlObj += '<p class="txtMid">주택 임차 방법 및 유의사항</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.HSRT_MTH_ATNOTI_CN + '</li></ul>';
        			htmlObj += '<p class="txtMid">전화</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.TEL_INSTL_MTH_CN + '</li></ul>';
        			htmlObj += '<p class="txtMid">전압/플러그</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.VLTGE_PLUG_CN + '</li></ul>';
        			htmlObj += '<p class="txtMid">식수</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.DRWT_CN + '</li></ul>';
        			htmlObj += '</div>';
        			htmlObj += '</div></div></div>';
        			
        			
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">차량 구입 및 운전면허</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
        			htmlObj += '<p class="txtMid">구매방법</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.VHCLE_PRCH_MTH_CN + '</li></ul>';
        			htmlObj += '<p class="txtMid">차량가격</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.VHCLE_PRC_CN + '</li></ul>';
        			htmlObj += '<p class="txtMid">운전면허 취득</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.DRVLS_ACQS_MTH_CN + '</li></ul>';
        			htmlObj += '</div>';
        			htmlObj += '</div></div></div>';
        			
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">은행 계좌 개설</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
        			htmlObj += '<p class="txtMid">주요 은행</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.MAIN_BANK_CN + '</li></ul>';
        			htmlObj += '<p class="txtMid">계좌 개설방법</p>';
        			htmlObj += '<ul><li class="alignPre">'+data.BNKACC_ESTBL_MTH_CN + '</li></ul>';
        			htmlObj += '</div>';
        			htmlObj += '</div></div></div>';
        			
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">교육</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<p class="txtMid">주요 국제학교</p>';
        			if(data.intrlSchulList != null && data.intrlSchulList.length > 0){
        				for(var i =0; i < data.intrlSchulList.length; i++){
        					htmlObj += '<ul class="list_dotBlack" style="margin-top:15px"><li>'+data.intrlSchulList[i].INTRL_SCHUL_NAME+'</li></ul>';
        					htmlObj += '<div class="lineTop_tbArea">';	
		        			htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>학교명, 도시명, 커리큘럼, 학비, 홈페이지, 비고에 대한 정보를 알 수 있는 표</p></caption>';
		        			htmlObj += '<colgroup><col style="width:20%"><col style="width:80%"></colgroup>';
		        			htmlObj += '<tbody>'; 
		        			htmlObj += '<tr><th scope="col">도시명</th><td class="txtL">'+data.intrlSchulList[i].INTRL_SCHUL_CTY_NAME+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">커리큘럼</th><td class="txtL alignPre">'+data.intrlSchulList[i].INTRL_SCHUL_EDC_CRSE_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">학비</th><td class="txtL alignPre">'+data.intrlSchulList[i].INTRL_SCHUL_SCHXP_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">홈페이지 </th><td class="txtL"><a href="'+data.intrlSchulList[i].INTRL_SCHUL_HMPG_URL_CN+'" target="_blank" title="홈페이지 이동">'+data.intrlSchulList[i].INTRL_SCHUL_HMPG_URL_CN+'</a></td></tr>';
		        			htmlObj += '<tr><th scope="col">비고</th><td class="txtL alignPre">'+data.intrlSchulList[i].INTRL_SCHUL_ETC_CN+'</td></tr>';
        					htmlObj += '</tbody></table>';
        					htmlObj += '</div>';
        				}
        			}
        			htmlObj += '<p class="exclamS">자료원 : '+data.INTRL_SCHUL_ARCV_CN+'</p>';
        			
        			htmlObj += '<p class="txtMid" style="margin-top:30px">현지학교</p>';
        			if(data.apclcSchulList != null && data.apclcSchulList.length > 0){
        				for(var i =0; i < data.apclcSchulList.length; i++){
        					htmlObj += '<ul class="list_dotBlack" style="margin-top:15px"><li>'+data.apclcSchulList[i].LC_SCHUL_NAME+'</li></ul>';
        					htmlObj += '<div class="lineTop_tbArea">';	
		        			htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>학교명, 도시명, 커리큘럼, 학비, 홈페이지, 비고에 대한 정보를 알 수 있는 표</p></caption>';
		        			htmlObj += '<colgroup><col style="width:20%"><col style="width:80%"></colgroup>';
		        			htmlObj += '<tbody>'; 
		        			htmlObj += '<tr><th scope="col">도시명</th><td class="txtL">'+data.apclcSchulList[i].LC_SCHUL_CTY_NAME+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">커리큘럼</th><td class="txtL alignPre">'+data.apclcSchulList[i].LC_SCHUL_EDC_CRSE_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">학비</th><td class="txtL alignPre">'+data.apclcSchulList[i].LC_SCHUL_SCHXP_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">홈페이지 </th><td class="txtL"><a href="'+data.apclcSchulList[i].LC_SCHUL_HMPG_URL_CN+'" target="_blank" title="홈페이지 이동">'+data.apclcSchulList[i].LC_SCHUL_HMPG_URL_CN+'</a></td></tr>';
		        			htmlObj += '<tr><th scope="col">비고</th><td class="txtL alignPre">'+data.apclcSchulList[i].LC_SCHUL_ETC_CN+'</td></tr>';
        					htmlObj += '</tbody></table>';
        					htmlObj += '</div>';
        				}
        			}
        			htmlObj += '<p class="exclamS">자료원 : '+data.LC_SCHUL_ARCV_CN+'</p>';
        			
        			
        			htmlObj += '</div></div></div>';
        			
        			
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">병원</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			if(data.hsptlList != null && data.hsptlList.length > 0){
        				for(var i =0; i < data.hsptlList.length; i++){
        					htmlObj += '<ul class="list_dotBlack" style="margin-top:15px"><li>'+data.hsptlList[i].HSPTL_NAME+'</li></ul>';
        					htmlObj += '<div class="lineTop_tbArea">';	
		        			htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>병원명, 도시명, 주소, 진료과목, 비고에 대한 정보를 알 수 있는 표</p></caption>';
		        			htmlObj += '<colgroup><col style="width:20%"><col style="width:80%"></colgroup>';
		        			htmlObj += '<tbody>'; 
		        			htmlObj += '<tr><th scope="col">도시명</th><td class="txtL">'+data.hsptlList[i].HSPTL_CTY_NAME+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">주소</th><td class="txtL">'+data.hsptlList[i].HSPTL_ADRES_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">전화번호</th><td class="txtL">'+data.hsptlList[i].HSPTL_TELNO_VAL+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">진료과목 </th><td class="txtL alignPre">'+data.hsptlList[i].MEDSBJ_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">비고</th><td class="txtL alignPre">'+data.hsptlList[i].HSPTL_ETC_CN+'</td></tr>';
        					htmlObj += '</tbody></table>';
        					htmlObj += '</div>';
        				}
        			}
        			htmlObj += '<p class="exclamS">자료원 : '+data.HSPTL_ARCV_CN+'</p>';
        			htmlObj += '</div></div></div>';
        			
        			
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">쇼핑 및 여가생활</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<p class="txtMid">쇼핑센터/몰/백화점</p>';
        			if(data.shpgList != null && data.shpgList.length > 0){
        				for(var i =0; i < data.shpgList.length; i++){
        					htmlObj += '<ul class="list_dotBlack" style="margin-top:15px"><li>'+data.shpgList[i].SHOPNG_BSSH_NAME+'</li></ul>';
        					htmlObj += '<div class="lineTop_tbArea">';	
		        			htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>이름, 도시명, 주소, 홈페이지, 비고에 대한 정보를 알 수 있는 표</p></caption>';
		        			htmlObj += '<colgroup><col style="width:20%"><col style="width:80%"></colgroup>';
		        			htmlObj += '<tbody>'; 
		        			htmlObj += '<tr><th scope="col">도시명</th><td class="txtL">'+data.shpgList[i].SHOPNG_BSSH_CTY_NAME+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">주소</th><td class="txtL">'+data.shpgList[i].SHOPNG_BSSH_ADRES_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">홈페이지 </th><td class="txtL"><a href="'+data.shpgList[i].SHOPNG_BSSH_HMPG_URL_CN+'" target="_blank" title="홈페이지 이동">'+data.shpgList[i].SHOPNG_BSSH_HMPG_URL_CN+'</a></td></tr>';
		        			htmlObj += '<tr><th scope="col">비고</th><td class="txtL alignPre">'+data.shpgList[i].SHOPNG_BSSH_ETC_CN+'</td></tr>';
        					htmlObj += '</tbody></table>';
        					htmlObj += '</div>';
        				}
        			}
        			htmlObj += '<p class="exclamS">자료원 : '+data.SHOPNG_BSSH_ARCV_CN+'</p>';
        			
        			htmlObj += '<p class="txtMid" style="margin-top:30px">식품점</p>';
        			if(data.grstList != null && data.grstList.length > 0){
        				for(var i =0; i < data.grstList.length; i++){
        					htmlObj += '<ul class="list_dotBlack" style="margin-top:15px"><li>'+data.grstList[i].GRST_NAME+'</li></ul>';
        					htmlObj += '<div class="lineTop_tbArea">';	
		        			htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>이름, 도시명, 주소, 취급 식료품	, 비고에 대한 정보를 알 수 있는 표</p></caption>';
		        			htmlObj += '<colgroup><col style="width:20%"><col style="width:80%"></colgroup>';
		        			htmlObj += '<tbody>'; 
		        			htmlObj += '<tr><th scope="col">도시명</th><td class="txtL">'+data.grstList[i].GRST_CTY_NAME+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">주소</th><td class="txtL">'+data.grstList[i].GRST_ADRES_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">취급 식료품	</th><td class="txtL alignPre">'+data.grstList[i].GRST_TRTMNT_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">비고</th><td class="txtL alignPre">'+data.grstList[i].GRST_ETC_CN+'</td></tr>';
        					htmlObj += '</tbody></table>';
        					htmlObj += '</div>';
        				}
        			}
        			htmlObj += '<p class="exclamS">자료원 : '+data.GRST_ARCV_CN+'</p>';
        			
        			htmlObj += '<p class="txtMid" style="margin-top:30px">기타 편의시설</p>';
        			if(data.etcCvntlList != null && data.etcCvntlList.length > 0){
        				for(var i =0; i < data.etcCvntlList.length; i++){
        					htmlObj += '<ul class="list_dotBlack" style="margin-top:15px"><li>'+data.etcCvntlList[i].ETC_CNVNC_FCLTY_NAME+'</li></ul>';
        					htmlObj += '<div class="lineTop_tbArea">';	
		        			htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>이름, 도시명, 주소, 홈페이지, 소개, 비고에 대한 정보를 알 수 있는 표</p></caption>';
		        			htmlObj += '<colgroup><col style="width:20%"><col style="width:80%"></colgroup>';
		        			htmlObj += '<tbody>'; 
		        			htmlObj += '<tr><th scope="col">도시명</th><td class="txtL">'+data.etcCvntlList[i].ETC_CNVNC_FCLTY_CTY_NAME+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">주소</th><td class="txtL">'+data.etcCvntlList[i].ETC_CNVNC_FCLTY_ADRES_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">홈페이지</th><td class="txtL"><a href="'+data.etcCvntlList[i].ETC_CNVNC_FCLTY_HMPG_URL_CN+'" target="_blank" title="홈페이지 이동">'+data.etcCvntlList[i].ETC_CNVNC_FCLTY_HMPG_URL_CN+'</a></td></tr>';
		        			htmlObj += '<tr><th scope="col">소개</th><td class="txtL alignPre">'+data.etcCvntlList[i].ETC_CNVNC_FCLTY_INTRCN_CN+'</td></tr>';
		        			htmlObj += '<tr><th scope="col">비고</th><td class="txtL alignPre">'+data.etcCvntlList[i].ETC_CNVNC_FCLTY_ETC_CN+'</td></tr>';
        					htmlObj += '</tbody></table>';
        					htmlObj += '</div>';
        				}
        			}
        			htmlObj += '<p class="exclamS">자료원 : '+data.ETC_CNVNC_FCLTY_ARCV_CN+'</p>';
        			htmlObj += '</div></div></div>';
        			
        			
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">현지공휴일</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="lineTop_tbArea" style="margin-bottom:30px">';
        			htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>공휴일명, 날짜, 비고 등 현지공휴일에 대한 정보를 알 수 있는 표</p></caption>';
        			htmlObj += '<colgroup></colgroup>';
        			htmlObj += '<tbody>'; 
        			htmlObj += '<tr><th scope="col">공휴일명</th><th scope="col">시작일</th><th scope="col">종료일</th></tr>';
        			if(data.hldyList != null && data.hldyList.length > 0){
        				for(var i =0; i < data.hldyList.length; i++){
        					htmlObj += '<tr><td>'+data.hldyList[i].SCHDNAME + '</td><td>'+data.hldyList[i].SCHDFROMDATE + '</td><td>'+data.hldyList[i].SCHDTODATE  + '</td></tr>';
        				}
        			}else{
        				htmlObj += '<tr><td colspan="3">데이터가 없습니다.</td></tr>';	
        			}
        			htmlObj += '</tbody></table>';
        			htmlObj += '<p class="exclamS">자료원 : '+data.HLDY_ARCV_CN+'</p>';
        			htmlObj += '</div>';
        			htmlObj += '</div></div></div>';
        			
        			htmlObj += '</div>';
        		}else if(ctgySn == "431"){
        			//KOTRA 무역관 안내
        			htmlObj += '<div class="view_country_overview selectOption">';
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">무역관 위치</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="txtContArea">';
        			if(data.kotraKbcList != null && data.kotraKbcList.length > 0){
        				for(var i =0; i < data.kotraKbcList.length; i++){
        					htmlObj += '<p class="txtMid">'+data.kotraKbcList[i].KBC_NAME+'</p>';
        					htmlObj += '<ul class="list_dotBlack" style="margin-bottom:10px; font-weight:bold;"><li>무역관 주소 및 우편배송지	';
        					htmlObj += '<ul><li class="alignPre">'+data.kotraKbcList[i].KBC_ADRES_CN + '</li></ul></li></ul>';
        					htmlObj += '<ul class="list_dotBlack"><li>공항 - 무역관 이동';
        					htmlObj += '<ul><li class="alignPre">'+data.kotraKbcList[i].KBC_ARVL_MTH_CN + '</li></ul></li></ul>';
        				}
        			}
        			htmlObj += '</div>';
        			htmlObj += '</div></div></div>';
        			htmlObj += '</div>';

        		}else if(ctgySn == "488"){
        			//전시회 주최
        			htmlObj += '<div class="view_country_overview selectOption">';
        			htmlObj += '<div class="list_Item" style="display:block">';
        			htmlObj += '<div class="country on"><p class="nation"><span class="tit">전시회 주최</span></p>';
        			htmlObj += '<button type="button" class="dropIcon" aria-expanded="true">내용확장됨</button>';
        			htmlObj += '</div>';
        			htmlObj += '<div class="info_list" style="display: block;"><div  class="subTab_Cont on">';
        			htmlObj += '<div class="lineTop_tbArea" style="margin-bottom:30px">';
        			htmlObj += '<table class="lineTop_tb2" style="min-width:640px"><caption><p>전시회 주최에 대한 정보를 알 수 있는 표</p></caption>';
        			htmlObj += '<colgroup><col style="width:80px"><col style="width:150px"><col style="width:15%"><col style="width:15%"></colgroup>';
        			htmlObj += '<tbody>'; 
        			htmlObj += '<tr><th scope="col">전시회명</th><th scope="col">개최기간(잠정)</th><th scope="col">장소</th><th scope="col">주최</th></tr>';
        			if(data.exbiList != null && data.exbiList.length > 0){
        				for(var i =0; i < data.exbiList.length; i++){
        					htmlObj += '<tr>';
        					htmlObj += '<td>'+data.exbiList[i].EXBI_NAME + '</td>';
        					htmlObj += '<td>'+data.exbiList[i].EXBI_STR_DE + ' ~ '+data.exbiList[i].EXBI_END_DE + '</td>';
        					htmlObj += '<td>'+data.exbiList[i].EXBI_PLACE_NAME + '</td>';
        					htmlObj += '<td>'+data.exbiList[i].EXBI_AUSPC_NAME + '</td>';
        					htmlObj += '</tr>';
        				}
        			}
        			htmlObj += '</tbody></table>';
        			htmlObj += '</div>';
        			htmlObj += '</div></div></div>';
        			htmlObj += '</div>';
        			
        			
        		}
        	
        		if(ctgySn != "408"){
	        		htmlObj += '<p class="dateInfo">최종수정 : '+data.UPDT_DT+'</p>';
        		}
        		
        		htmlObj = fn_nationInfReplaceHTML(htmlObj);
        		
        		/*
        		//공공누리 
	       		htmlObj += '<div class="board_area" style="display:block"><div class="lineList_v"><dl><dd>';
	       		htmlObj += '<div class="add_openNoti"><img src="/type/common/img/board/img_opentype01.png" alt="공공누리 제 1유형(출처표시) - 공공저작물 자유이용허락" class="copyrightImg">';
	       		htmlObj += '<p>국가정보['+chkCtgyNm+'] 항목은 <em class="point_black">"공공누리 1유형 출처표시"</em> 조건에 따라 이용 할 수 있습니다.</p></div></dd></dl></div></div>';
	       		*/
        		$("#sendForm .border_vCustom_contBottom").empty();
        		$(htmlObj).appendTo($("#sendForm .border_vCustom_contBottom"));
	       		
        	
        		
        	}
       	}
   	});
}

function fn_nationInfReplaceHTML(str){

	var changeStr = '';
	
	changeStr = str.replaceAll("&lt;","<");
	changeStr = changeStr.replaceAll("lt;","<");
	changeStr = changeStr.replaceAll("&gt;", ">");
	changeStr = changeStr.replaceAll("gt;", ">");
	changeStr = changeStr.replaceAll("&apos;", "'");
	changeStr = changeStr.replaceAll("apos;", "'");
	changeStr = changeStr.replaceAll("&quot;", "\"");
	changeStr = changeStr.replaceAll("quot;", "\"");
	changeStr = changeStr.replaceAll("&#39;", "'");
	changeStr = changeStr.replaceAll("#39;", "'");
	changeStr = changeStr.replaceAll("&#34;", "\"");
	changeStr = changeStr.replaceAll("#34;", "\"");
	changeStr = changeStr.replaceAll("&amp;", "");
	changeStr = changeStr.replaceAll("amp;", "");
	changeStr = changeStr.replaceAll("&ouml;","O");
	changeStr = changeStr.replaceAll("ouml;","O");
	changeStr = changeStr.replaceAll("&lsquo;","'");
	changeStr = changeStr.replaceAll("lsquo;","'");
	changeStr = changeStr.replaceAll("&Uuml;","U");
	changeStr = changeStr.replaceAll("Uuml;","U");
	changeStr = changeStr.replaceAll("&middot;","·");
	changeStr = changeStr.replaceAll("middot;","·");
	changeStr = changeStr.replaceAll("&auml;","A");
	changeStr = changeStr.replaceAll("auml;","A");
	changeStr = changeStr.replaceAll("&rsquo;","'");
	changeStr = changeStr.replaceAll("rsquo;","'");
	changeStr = changeStr.replaceAll("&ldquo;","“");
	changeStr = changeStr.replaceAll("ldquo;","“");
	changeStr = changeStr.replaceAll("&rdquo;","”");
	changeStr = changeStr.replaceAll("rdquo;","”");
	changeStr = changeStr.replaceAll("&lsaquo;","‹");
	changeStr = changeStr.replaceAll("lsaquo;","‹");
	changeStr = changeStr.replaceAll("&rsaquo;","›");
	changeStr = changeStr.replaceAll("rsaquo;","›");
	
	return changeStr;
}

