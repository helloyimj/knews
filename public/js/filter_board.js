
var chkNatCd = "N";
var chkKbcCd = "N";

$().ready(function (){
		
	// 게시일 수정 (2023-11-28)
    $(document).on('focus', '[name=pStartDt]', function(){
        var startDt = $('#pStartDt').val().split('/').join('');
        datePickerController.setRangeLow('pEndDt', startDt)
    })
    
    $(document).on('focus', '[name=pEndDt]', function(){
        var endDt = $('#pEndDt').val().split('/').join('');
        datePickerController.setRangeHigh('pStartDt', endDt)
    })    

//	$(document).on('focus', '[name=pEndDt]', function(){
//		var pStartDt = $("#pStartDt").val();
//		var pEndDt = $("#pEndDt").val();
//		if(pStartDt != '' && pEndDt != ''){
//			if(pStartDt > pEndDt){
//				alert('시작일은 종료일보다 클 수 없습니다.');
//				$("#pEndDt").val('');
//				return;
//			}
//		}
//	})
	
	//뒤로가기시 ready시점 fn_list() #sendForm 파라미터 셋팅 초기화를 위한 부분
	if(window.performance && window.performance.navigation.type == 2){
		fn_searchReset();
	}
	
	//뒤로가기시 pageshow시점 검색 파라미터 셋팅 초기화를 위한 부분
	$(window).bind("pageshow",function(event){
		if(event.originalEvent.persisted || (window.performance && window.performance.navigation.type == 2)){
			fn_searchReset();
			if($('[name=pNatCd]:checked').length < 1) $('#natAll').prop('checked',true);
		}
	})
	
	if("" != '') chkNatCd = "Y";
	if("" != '') chkKbcCd = "Y";
	if("" != '') $("#sendForm [name=sSearchVal]").val(decodeURI(""));
	
	
	$(document).on('change', '.check_all', function() {
        $('.'+$(this).data('check')).not(":disabled").prop('checked', $(this).prop('checked'));
        if($('[name=downChk]:checked').length > 10){
			alert("선택은 최대 10개까지만 가능합니다. \n리스트 조회 기준을 변경해 주세요");
			$('[name=downChk]:checked').attr('checked', false);
			$(this).attr('checked', false);
		}
    });
	
	$(document).on('click', '.listViewType button', function(){
		var viewType = $(this).data('viewtype');
		location.href = "/kotranews/cms/com/index.do?MENU_ID=140&CONTENTS_NO=1&viewType=" + viewType + "&"+$("#sendForm").serialize();
	});
	
	$(document).on('click', '.hscdPop', function(){
		frameBtnObj = $(this);
		$(document).find('body').css("overflow-y","hidden");
		$('<iframe id="iframePop" src="/cms/frCom/actionHsSearchPop.do" class="pop_iframe on" height="100%" scrolling="no" frameborder="0" title="HSCODE 검색 팝업"/>').appendTo($("body #container"));
	});
	
	$(document).on('change', '[name=viewCnt]', function(){
    	var cntVal = $(this).val();
    	if(cntVal != ''){
    		$("#sendForm [name=pageNo]").val('1');
        	$("#sendForm [name=recordCountPerPage]").val(cntVal);
        	fn_list();    		
    	}
    });
	
	//체크박스 10개이상 제한
	$(document).on('click', '[name=downChk]', function(){
		if($('[name=downChk]:checked').length > 10){
			alert("선택은 최대 10개까지만 가능합니다.");
			$(this).attr('checked', false);
		}
	});
	
	//대륙 선택
	$(document).on('click', '[name=pRegnCd]', function(){
		var ck = "";
       	if("true" == "true") ck = "checked";
		$("#natArea").html('<li><span class="inp_r"><input type="radio" name="pNatCd" id="natAll" value="" '+ck+'><label for="natAll">전체</label></span></li>');
		
		var val =$(this).val();
		
		if(val == ''){
			$("[name=pKbcCd]").html('<option value="" selected="selected">전체</option>');
			return;
		}
		//20240614 데이터가 있는 지역 및 대륙만 표시되도록 변경
		var bbsSnVal = $("[name=bbsSn]").val();
	    fn_comm_ajax({
	       url: "/ajaxf/frNews/getInNewsNationList.do",
	       data: {"cd" : val, "bbsSn" :	bbsSnVal},
	       dataType: "json",
	       async: false,
	       success: function (data) {
               if(null != data){
                   var html = '';
                  	
                   for(var idx=0; idx<data.length; idx++){
	                   	var ck = "";
	                   	
	                   	if("" == data[idx].UN_NAT_CD && chkNatCd == "Y"){
	                   		ck = "checked";
	                   	}
	                   	html += '<li>';
	                   	html += '<span class="inp_r">';
	                   	html += '<input type="radio" name="pNatCd" id="nat'+data[idx].UN_NAT_CD+'" value="'+data[idx].UN_NAT_CD+'" '+ck+'>';
	                   	html += '<label for="nat'+data[idx].UN_NAT_CD+'">' + data[idx].UNTY_NAT_NAME + '</label>';
	                   	html += '</span>';
	                   	html += '</li>';
                   }
                   
                   $(html).appendTo($("#natArea"));
               	   
                   if($("[name=pNatCd]:checked").length < 1){
                	   $("[name=pNatCd]").eq(0).prop('checked', 'checked');
                   }
                   
                   if($("[name=pNatCd]:checked").val() == ''){
                	   $("[name=pKbcCd]").html('<option value="" selected="selected">전체</option>');
                   }else{
                	   $("[name=pKbcCd]").html('<option value="" selected="selected">선택</option>');
                   }
                   
                   if("" != ''){
                       $("[name=pNatCd]:checked").trigger('click');
                       chkNatCd = "N";
                   	   chkKbcCd = "N";
                   }
               }
	       }
	    });
	});
	
    //국가변경
    $(document).on('click', '[name=pNatCd]', function(){
        //하위코드 초기화
        $("[name=pKbcCd]").html('<option value="" selected="selected">선택</option>');

        var val =$(this).val();
        
        if(val == ''){
        	$("[name=pKbcCd]").html('<option value="" selected="selected">전체</option>');
        	return;
        }
        
        if(val != ''){
            fn_comm_ajax({
                url : "/ajaxf/frNews/getKotraBoardTradeList.do",
                data : {"cd" : val},
                dataType : "json",
                async: false,
                success : function(data) {
                    if(null != data){
                        var html = '';
                        for(var idx=0; idx<data.length; idx++){
                        	var ck = "";
                        	if("" == data[idx].CMMN_CD && chkKbcCd == "Y"){
                        		ck = "selected";
                        	}
                            html += '<option value="' + data[idx].CMMN_CD + '" '+ck+'>' + data[idx].CD_NAME + '</option>';
                        }
                        $(html).appendTo("[name=pKbcCd]");
                        chkNatCd = "N";
                        chkKbcCd = "N";
//                         if("" != ''){
//                         	$("[name=pKbcCd]").trigger('change');
//                         }
                    }
                }
            });
        }
    });
    
    //대분류변경
    $(document).on('change', '[name=LCLSF_CD]', function(){
        //하위코드 초기화
        $("[name=CLSF_CD]").html('<option value="" selected="selected">선택</option>');

        var val =$(this).val();
        var pBbsSn = $("#sendForm [name=bbsSn]").val();
        
        if(val == ''){
        	$("[name=CLSF_CD]").html('<option value="" selected="selected">전체</option>');
        	return;
        }
        
        if(val != ''){
            fn_comm_ajax({
                url : "/ajaxf/frNews/getKotraBoardClsfCdList.do",
                data : {"cd" : val, "pBbsSn" : pBbsSn},
                dataType : "json",
                async: false,
                success : function(data) {
                    if(null != data){
                        var html = '';
                        for(var idx=0; idx<data.length; idx++){
                            html += '<option value="' + data[idx].CLSF_CD + '">' + data[idx].CLSF_NAME + '</option>';
                        }
                        $(html).appendTo("[name=CLSF_CD]");
                    }
                }
            });
        }
    });
	$("[name=pRegnCd]:checked").trigger('click');
	
	
	// 상단공지글 목록
	

	fn_list();
	
});

/************************************************************************
함수명 : fn_list
설 명 : KOTRA 게시물 목록 조회
인 자 : -
작성자 : [대외경제정보 통합 플랫폼] 포털파트
수정일              수정자                                   수정내용
----------  ---------------------   ------------------
2021-03-12  [대외경제정보 통합 플랫폼]      최초 생성
************************************************************************/
function fn_list(){
	var pStartDt = $("#pStartDt").val();
	var pEndDt = $("#pEndDt").val();
	if(pStartDt != '' && pEndDt != ''){
		if(pStartDt > pEndDt){
			alert('시작일은 종료일보다 클 수 없습니다.');
			return;
		}
	}
	
	if($("#sendForm [name=pageNo]").val() == ''){
		$("#sendForm [name=pageNo]").val('1');
	}
	
	if($("#sendForm input:hidden[name=recordCountPerPage]").val() == ""){
        
        $("#sendForm input:hidden[name=recordCountPerPage]").val("10");
   	 	
    	
    }
	
	
	
	fn_comm_ajax({
	    url: "/ajaxf/frNews/getKotraBoardList.do",
	    data: $("#sendForm").serialize(),
	    dataType: "json",
	    success: function (data) {
	        
	    		fn_comm_setList("#tbody", data, "#listTemplate", "#noListTemplate", "#rowCount", ".pagination");
	    		
		     	// a태그 href 추가
		        
		        
		        $('#tbody tr a').each(function(idx){
		        	var nttSn = $(this).attr('data-source');
					fn_setDetailUrl($(this), nttSn);
		        })
		        
	    	
	        
	        
	        //첨부파일리스트출력
	        if("N" == "Y"){
	        	fn_setAttachList(data.list);
	        }
	        
	        
	        

	    }
	});
}

/************************************************************************
함수명 : fn_setAttachList
설 명 : KOTRA 게시물 목록 - 첨부파일 조회
인 자 : data(게시물 리스트)
작성자 : [대외경제정보 통합 플랫폼] 포털파트
수정일              수정자                                   수정내용
----------  ---------------------   ------------------
2021-03-12  [대외경제정보 통합 플랫폼]      최초 생성
************************************************************************/
function fn_setAttachList(data){
	if(null != data && '' != data){
		for(var idx=0; idx<data.length; idx++){
			var attachList = data[idx].attachList;
			var nttSn = data[idx].NTT_SN;
			
			if(null != attachList && '' != attachList && 0 < attachList.length){
				var obj = '';
				for(var idx2=0; idx2<attachList.length; idx2++){
					obj += '<a href="#;" class="file-download" title="'+attachList[idx2].NTT_ATFILE_IMG_MVP_DC_CN+'"data-nttsn="'+attachList[idx2].NTT_SN+'"data-atfilesn="'+attachList[idx2].ATFILE_SN+'"data-filename="'+ attachList[idx2].REAL_ATFILE_NAME +'" onclick="fn_fileDown(this);">';
					obj += '<img src="../type/common/img/common/file_'+attachList[idx2].ATFILE_EXT_NAME+'.png" alt="'+attachList[idx2].NTT_ATFILE_IMG_MVP_DC_CN+'" class="ico_file_'+attachList[idx2].ATFILE_EXT_NAME+'" onError="this.src=\'/type/common/img/common/file_etc.png\'"/>';
					obj += '</a>&nbsp;';
				}
				
				$(obj).appendTo($("#tbody tr[data-idno="+nttSn+"]").find('.fileArea'));
			}else{
				$("#tbody tr[data-idno="+nttSn+"]").find('.fileArea').html('<em class="mSort">첨부파일</em>-');
			}
		}
	}
}



/************************************************************************
* 함수명 : fn_fileDown
* 설 명 :  첨부파일 다운로드
* 인 자 : obj
* 작성자 : bvs
* 수정일 수정자 수정내용
* ------ ------ -------------------
* 2021.03.15 bvs 최초생성
************************************************************************/
function fn_fileDown(obj){
	//location.href="/ajaxa/fileCpnt/fileDown.do?gbn=n01" + "&nttSn=" + nttSn + "&atFileSn=" + atFileSn + "&pFrontYn=Y";
	var pUrl = "/ajaxa/fileCpnt/fileDown.do?gbn=n01" + "&nttSn=" + $(obj).data('nttsn') + "&atFileSn=" + $(obj).data('atfilesn') + "&pFrontYn=Y";
	var pFilename = $(obj).data('filename');
	fn_filedown_progress(pUrl, pFilename);
}

/************************************************************************
함수명 : fn_linkPage
설 명 : 리스트 페이징
인 자 : pageNo(검색시 페이지 넘버)
작성자 : [대외경제정보 통합 플랫폼] 포털파트
수정일              수정자                                   수정내용
----------  ---------------------   ------------------
2021-03-12  [대외경제정보 통합 플랫폼]      최초 생성
************************************************************************/
function fn_linkPage(pageNo) {
   $("#sendForm [name='pageNo']").val(pageNo);
   fn_list();
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
function fn_searchReset(){
	$("[name=pStartDt]").val('');
	$("[name=pEndDt]").val('');
	$("[name=sSearchGbn] option").eq(0).prop('selected', 'selected');
	$("[name=sSearchVal]").val('');
	$("[name=pRegnCd]").eq(0).prop('checked', 'checked');
	$("[name=pRegnCd]:checked").trigger('click');
	$("[name=pIndustCd] option").eq(0).prop('selected', 'selected');
	$("[name=pHsCode]").val('');
	$("[name=pHsCodeNm]").val('');
	$("[name=pHsCdType]").val('');
	$("[name=pReltdRegnCd] option").eq(0).prop('selected', 'selected');
	$("[name=pNttCtgrySn] option").eq(0).prop('selected', 'selected');
	$("[name=LCLSF_CD] option").eq(0).prop('selected', 'selected');
	$("[name=CLSF_CD] option").eq(0).prop('selected', 'selected');
	
}

/************************************************************************
함수명 : fn_hscodeSel
설 명 : HSCODE 선택
인 자 : -
작성자 : [대외경제정보 통합 플랫폼] 포털파트
 수정일              수정자                                   수정내용
----------  ---------------------   ------------------
2021-03-15  [대외경제정보 통합 플랫폼]      최초 생성
************************************************************************/
function fn_hscodeSel(untyCdClCd, hscd, hsnm){
	$('[name=pHsCode]').val(hscd);
	$('[name=pHsCodeNm]').val(hsnm);
	$('[name=pHsCdType]').val(untyCdClCd);
	
	fn_ifmPopClose();
}

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
인 자 : -
작성자 : [대외경제정보 통합 플랫폼] 포털파트
 수정일              수정자                                   수정내용
----------  ---------------------   ------------------
2021-03-15  [대외경제정보 통합 플랫폼]      최초 생성
************************************************************************/
function fn_view(nttSn){
	$("#sendForm [name=pNttSn]").val(nttSn);
	location.href = "/kotranews/cms/news/actionKotraBoardDetail.do?" + $("#sendForm").serialize() + "&sSearchVal=" + encodeURI($("[name=sSearchVal]").val());
}

/************************************************************************
함수명 : fn_downFile
설 명 : 상세화면 html, pdf 다운로드
인 자 : -
작성자 : [대외경제정보 통합 플랫폼] 포털파트
 수정일              수정자                                   수정내용
----------  ---------------------   ------------------
2021-03-15  [대외경제정보 통합 플랫폼]      최초 생성
************************************************************************/
var totalCnt = 0;
var compCnt = 0;
function fn_downFile(type){
	$('#frameDiv').empty();
	if($('[name=downChk]:checked').length < 1){
		alert('선택된 게시글이 없습니다.');
		return;
	}
	
	totalCnt = $('[name=downChk]:checked').length;
	compCnt = 0;
	fn_comm_showProgressbar();
	
	$('[name=downChk]:checked').each(function(){
		var nttSn = $(this).val();
		var bbsSn = $(this).data('bbssn');
		var title = $(this).closest('.nttTr').find('.subjectTxt').text();

// 		window.open("/kotranews/cms/news/actionKotraBoardDownDetail.do?MENU_ID=140&pNttSn=" + nttSn + "&bbsSn=" + bbsSn + "&type=" + type);
		var src = "/kotranews/cms/news/actionKotraBoardDownDetail.do?MENU_ID=140&pNttSn=" + nttSn + "&bbsSn=" + bbsSn;
		$('<iframe class="pdfFrame" id="downloadFrame'+$(this).val()+'" src="'+src+'" data-title="'+title+'" style="width:100%;visibility:hidden; position:absolute;"></iframe>').appendTo($("#frameDiv"));
	});
	
	$('.pdfFrame').load(function(){
		var title 	= $(this).data('title').trim();
		if(title == ''){
			title = '-';
		}
		var cont = this.contentWindow.document.querySelector('#pdfArea');
		$(cont).find('.fileTr').remove();
		
		var serverUrl = 'https://dream.kotra.or.kr/';
		$(cont).find('img').each(function(){
			var src = $(this).attr('src');
			
			if(src.startsWith('/attach/')){
				src = src.replace('/attach/', serverUrl + 'attach/');
				$(this).attr('src', src);
			}
		});
		
		var id = $(this).attr('id');
		
		$(cont).css('width', '100%');
		
		if(type == 'pdf'){
			html2canvas(cont, {
				allowTaint: true,
				useCORS: true,
				scale: 1
			}).then(function(canvas){
				var imgData = canvas.toDataURL('image/png');
				var imgWidth = 210;
				var pageHeight = imgWidth * 1.414;
				var imgHeight = canvas.height * imgWidth / canvas.width;
				var heightLeft = imgHeight;
				var margin = 0;
				var doc = new jsPDF('p', 'mm', 'a4');
				var position = 0;
				
				doc.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
				heightLeft -= pageHeight;
				
				while(heightLeft >= 20){
					position = heightLeft - imgHeight;
					doc.addPage();
					doc.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
					heightLeft -= pageHeight;
				}
				
				doc.save(title + '.pdf');
				$("#"+id).remove();
				
				compCnt++;
				fn_downCallbak(compCnt);
			});
		}else{
			cont = this.contentWindow.document.querySelector('#pdfArea');
			$(cont).find('.fileArea').remove();
			$(cont).find('.photoSliderArea').remove();
			
			var hostName = "http://"+window.location.host;
			var content =	"<!doctype html>" 
						+	"<html lang=\"ko\">"
						+	"<head>"
						+	"<meta charset=\"utf-8\">"
						+	"<link rel='stylesheet' type='text/css' href='"+hostName+"../css/board.css' />"
						+	"<link rel='stylesheet' type='text/css' href='"+hostName+"../css/common.css' />"
						+	"<title>pdf</title>"
						+	"</head>"
						+	"<body class='typeSub'>"
						+	"<div class='board_area'>"
						+	"<div class='lineList_v'>"
						+ 	$(cont).html()
						+	"</div>"
						+	"</div>"
						+	"</body>"
						+	"</html>";

			var agent = navigator.userAgent.toLowerCase();
			if(		(navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1)
				||	(navigator.appName == 'Netscape' && navigator.userAgent.search('Edge') != -1)	
				|| 	(agent.indexOf("msie") != -1)){
				var element = document.createElement('a');
				file = new Blob([content], {type:'text/plain;charset=utf-8'});
				if(window.navigator.msSaveOrOpenBlob){
					window.navigator.msSaveOrOpenBlob(file, title+".html");
				}else{
					var url = URL.createObjectURL(file);
					element.href = url;
					element.download = title+".html";
					document.body.appendChild(element);
					element.click();
					setTimeOut(function(){
						document.body.removeChild(element);
						window.URL.revokeObjectURL(url);
					}, 0);
					
				}
			}else{
				var element = document.createElement('a');
				file = new Blob([content], {type:'text/plain;charset=utf-8'});
				var url = URL.createObjectURL(file);
				element.href = url;
				element.download = title+".html";
				document.body.appendChild(element);
				element.click();
				document.body.removeChild(element);
			}
			
			compCnt++;
			fn_downCallbak(compCnt);
		}
	});
}

/************************************************************************
함수명 : fn_downCallbak
설 명 : 다운로드콜백함수
인 자 : compCnt(다운로드 완료 횟수)
작성자 : [대외경제정보 통합 플랫폼] 포털파트
 수정일              수정자                                   수정내용
----------  ---------------------   ------------------
2021-03-15  [대외경제정보 통합 플랫폼]      최초 생성
************************************************************************/
function fn_downCallbak(compCnt){
	if(totalCnt == compCnt){
		fn_comm_hideProgressbar();
	}
}

/************************************************************************
함수명 : fn_noticeList
설 명 : 공지 목록 조회
인 자 : -
작성자 : [대외경제정보 통합 플랫폼] 포털파트
 수정일           수정자                                수정내용
----------  ---------------------   ------------------
2025-06-25  [대외경제정보 통합 플랫폼]   최초 생성
************************************************************************/
function fn_noticeList(){		
	fn_comm_ajax({
	    url: "/ajaxf/frNews/getKotraBoardNoticeList.do",
	    data: $("#sendForm").serialize(),
	    dataType: "json",
	    success: function (data) {
	    	if(Array.isArray(data) && data.length > 0) {
		    	data.forEach(function(item) {
					var template = document.getElementById('noticeTemplate');
					var clone = template.content.cloneNode(true);
					var $row = $(clone);
										
					$row.find('.subjectTxt').text(item.NTT_SJ);
					$row.find('.noticeOthbcDt').text(item.OTHBC_DT);
					
					var $link = $row.find('a.subjectTxt');
					fn_setDetailUrl($link, item.NTT_SN);
					
					$('#noticeArea').append($row);	    		
		    	})	    		
	    	}
	    }
	});	
}

/************************************************************************
함수명 : fn_setDetailUrl
설 명 : 상세페이지 URL 세팅
인 자 : $item, nttSn
작성자 : [대외경제정보 통합 플랫폼] 포털파트
 수정일           수정자                                수정내용
----------  ---------------------   ------------------
2025-06-25  [대외경제정보 통합 플랫폼]   최초 생성
************************************************************************/
function fn_setDetailUrl($item, nttSn) {
	var setUrl = '';
	$("#sendForm [name=pNttSn]").val(nttSn);
	setUrl = "/kotranews/cms/news/actionKotraBoardDetail.do?" + $("#sendForm").serialize() + "&sSearchVal=" + encodeURI($("[name=sSearchVal]").val());
	$item.attr('href', setUrl);
	$("#sendForm [name=pNttSn]").val('');	
}

