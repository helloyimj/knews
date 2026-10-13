/*
 * 국가지역정보(__news_page8) 인라인 스크립트 분리.
 * 원본 주석을 유지한다. board_list.js 뒤에 로드한다.
 */
$().ready(function() {
	
	$(document).on('change', '.check_all', function() {
        $('.'+$(this).data('check')).not(":disabled").prop('checked', $(this).prop('checked'));
    });
	
	if ($(".flagList").children().length === 0) {
 		fn_flagList();
	}
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
	$(".natArea").addClass("isHide");
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
		url : "https://dream.kotra.or.kr/ajaxf/frNation/getNationFlagList.do",
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
        					asiaObj +='<a href="#" onclick="fn_actionNatIemList(\''+data.list[i].UNTY_CNTT_CD+'\',\''+data.list[i].UN_NAT_CD+'\')"><img src="https://dream.kotra.or.kr/type/common/img/common/flag/flag_'+data.list[i].ISO_WD2_NAT_CD+'.png" alt=""><span>'+data.list[i].UNTY_NAT_NAME+'</span></a></li>';
        					asiaCnt = asiaCnt + 1;
            			}else if(data.list[i].UNTY_CNTT_CD =="02"){
            				mdestObj +='<li><span class="inp_c only"><input type="checkbox" class="nation_mdest" name="chkNatSn" id="natSn_'+data.list[i].UN_NAT_CD+'" value="'+data.list[i].UN_NAT_CD+'"><label for="natSn_'+data.list[i].UN_NAT_CD+'"><span class="txtHidden">'+data.list[i].UNTY_NAT_NAME+'</span></label></span>';
            				mdestObj +='<a href="#" onclick="fn_actionNatIemList(\''+data.list[i].UNTY_CNTT_CD+'\',\''+data.list[i].UN_NAT_CD+'\')"><img src="https://dream.kotra.or.kr/type/common/img/common/flag/flag_'+data.list[i].ISO_WD2_NAT_CD+'.png" alt=""><span>'+data.list[i].UNTY_NAT_NAME+'</span></a></li>';
            				mdestCnt = mdestCnt + 1;
            			}else if(data.list[i].UNTY_CNTT_CD =="03"){
            				euObj +='<li><span class="inp_c only"><input type="checkbox" class="nation_eu" name="chkNatSn" id="natSn_'+data.list[i].UN_NAT_CD+'" value="'+data.list[i].UN_NAT_CD+'"><label for="natSn_'+data.list[i].UN_NAT_CD+'"><span class="txtHidden">'+data.list[i].UNTY_NAT_NAME+'</span></label></span>';
            				euObj +='<a href="#" onclick="fn_actionNatIemList(\''+data.list[i].UNTY_CNTT_CD+'\',\''+data.list[i].UN_NAT_CD+'\')"><img src="https://dream.kotra.or.kr/type/common/img/common/flag/flag_'+data.list[i].ISO_WD2_NAT_CD+'.png" alt=""><span>'+data.list[i].UNTY_NAT_NAME+'</span></a></li>';
            				euCnt = euCnt + 1;
            			}else if(data.list[i].UNTY_CNTT_CD =="04"){
            				nthamObj +='<li><span class="inp_c only"><input type="checkbox" class="nation_ntham" name="chkNatSn" id="natSn_'+data.list[i].UN_NAT_CD+'" value="'+data.list[i].UN_NAT_CD+'"><label for="natSn_'+data.list[i].UN_NAT_CD+'"><span class="txtHidden">'+data.list[i].UNTY_NAT_NAME+'</span></label></span>';
            				nthamObj +='<a href="#" onclick="fn_actionNatIemList(\''+data.list[i].UNTY_CNTT_CD+'\',\''+data.list[i].UN_NAT_CD+'\')"><img src="https://dream.kotra.or.kr/type/common/img/common/flag/flag_'+data.list[i].ISO_WD2_NAT_CD+'.png" alt=""><span>'+data.list[i].UNTY_NAT_NAME+'</span></a></li>';
            				nthamCnt = nthamCnt + 1;
            			}else if(data.list[i].UNTY_CNTT_CD =="05"){
            				lamrcObj +='<li><span class="inp_c only"><input type="checkbox" class="nation_lamrc" name="chkNatSn" id="natSn_'+data.list[i].UN_NAT_CD+'" value="'+data.list[i].UN_NAT_CD+'"><label for="natSn_'+data.list[i].UN_NAT_CD+'"><span class="txtHidden">'+data.list[i].UNTY_NAT_NAME+'</span></label></span>';
            				lamrcObj +='<a href="#" onclick="fn_actionNatIemList(\''+data.list[i].UNTY_CNTT_CD+'\',\''+data.list[i].UN_NAT_CD+'\')" value="'+data.list[i].UN_NAT_CD+'"><img src="https://dream.kotra.or.kr/type/common/img/common/flag/flag_'+data.list[i].ISO_WD2_NAT_CD+'.png" alt=""><span>'+data.list[i].UNTY_NAT_NAME+'</span></a></li>';
            				lamrcCnt = lamrcCnt + 1;
            			}else if(data.list[i].UNTY_CNTT_CD =="06"){
            				afrcaObj +='<li><span class="inp_c only"><input type="checkbox" class="nation_afrca" name="chkNatSn" id="natSn_'+data.list[i].UN_NAT_CD+'" value="'+data.list[i].UN_NAT_CD+'"><label for="natSn_'+data.list[i].UN_NAT_CD+'"><span class="txtHidden">'+data.list[i].UNTY_NAT_NAME+'</span></label></span>';
            				afrcaObj +='<a href="#" onclick="fn_actionNatIemList(\''+data.list[i].UNTY_CNTT_CD+'\',\''+data.list[i].UN_NAT_CD+'\')"><img src="https://dream.kotra.or.kr/type/common/img/common/flag/flag_'+data.list[i].ISO_WD2_NAT_CD+'.png" alt=""><span>'+data.list[i].UNTY_NAT_NAME+'</span></a></li>';
            				afrcaCnt = afrcaCnt + 1;
            			}else if(data.list[i].UNTY_CNTT_CD =="07"){
            				ocniaObj +='<li><span class="inp_c only"><input type="checkbox" class="nation_ocnia" name="chkNatSn" id="natSn_'+data.list[i].UN_NAT_CD+'" value="'+data.list[i].UN_NAT_CD+'"><label for="natSn_'+data.list[i].UN_NAT_CD+'"><span class="txtHidden">'+data.list[i].UNTY_NAT_NAME+'</span></label></span>';
            				ocniaObj +='<a href="#" onclick="fn_actionNatIemList(\''+data.list[i].UNTY_CNTT_CD+'\',\''+data.list[i].UN_NAT_CD+'\')"><img src="https://dream.kotra.or.kr/type/common/img/common/flag/flag_'+data.list[i].ISO_WD2_NAT_CD+'.png" alt=""><span>'+data.list[i].UNTY_NAT_NAME+'</span></a></li>';
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
        			
        			$(".flagList").html("");
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
	pRegnCd = String(pRegnCd);
	if(pRegnCd.length >= 2){
		pRegnCd
	}else{
		pRegnCd = "0" + pRegnCd;	
	}
	$("#sendForm [name=pRegnCd]").val(pRegnCd);	
	$("#sendForm [name=pNatCd]").val(pNatCd);
	
	location.href = "https://dream.kotra.or.kr/kotranews/cms/nation/actionNatIemList.do?" + $("#sendForm").serialize();
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
	
	//location.href = "https://dream.kotra.or.kr/ajaxa/frNation/nationPdfDown.do?"+ $("#sendForm").serialize();
	
	var pUrl = "https://dream.kotra.or.kr/ajaxa/frNation/nationPdfDown.do?"+ $("#sendForm").serialize();
	
	var pFilename = "";
	 
	if($("[name=chkNatSn]:checked").length > 1){
		pFilename = "국가정보.zip";
	}else if ($("[name=chkNatSn]:checked").length == 1){
		pFilename = $("label[for='natSn_"+$("[name=chkNatSn]:checked").val()+"']").text() + ".pdf";
	}

	fn_filedown_progress(pUrl, pFilename);
}
