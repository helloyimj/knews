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
	
	// 게시일 수정 (2023-12-05)
    $(document).on('focus', '[name=START_DT]', function(){
        var startDt = $('#START_DT').val().split('/').join('');
        datePickerController.setRangeLow('END_DT', startDt)
    })
    
    $(document).on('focus', '[name=END_DT]', function(){
        var endDt = $('#END_DT').val().split('/').join('');
        datePickerController.setRangeHigh('START_DT', endDt)
    })
    
	 datePickerController.createDatePicker({
         formElements:{
             "START_DT":"%Y/%m/%d"
         }
     });
     datePickerController.createDatePicker({
         formElements:{
             "END_DT":"%Y/%m/%d"
         }
     });
	
	$("#sendForm [name=SEARCH_FLD]").val("");
	$("#sendForm [name=SEARCH]").val(decodeURI(""));
	
	//뒤로가기시 ready시점 fn_list() #sendForm 파라미터 셋팅 초기화를 위한 부분
	if(window.performance && window.performance.navigation.type == 2){
	    fn_searchReset();
	    if($('[name=pNatCd]:checked').length < 1) $('#natAll').prop('checked',true);
	}
	 

	//뒤로가기시 pageshow시점 검색 파라미터 셋팅 초기화를 위한 부분
	$(window).bind("pageshow",function(event){
	    if(event.originalEvent.persisted || (window.performance && window.performance.navigation.type == 2)){
	        fn_searchReset();
	        if($('[name=pNatCd]:checked').length < 1) $('#natAll').prop('checked',true);
	    }
	}) 
	
    $(document).on("click",".btn_search",function(){
    	$("#sendForm input:hidden[name=pageNo]").val("1");
    	fn_list();
    });
    
    $(document).on("click",".listViewType button",function(){
    	
    	var listType = $("ul.listViewType").find('.on').attr('class') ;
		
        if(listType == 'typeTit on'){
        	$(".thumbnailList").addClass('none');
        	$(".bookCoverList").addClass('none');
        	$(".normalList").removeClass('none');
        }else if($("ul.listViewType").find('.on').attr('class') == 'typeThumb on'){
        	$(".normalList").addClass('none');
        	$(".bookCoverList").addClass('none');
        	$(".thumbnailList").removeClass('none');
        }else{
        	$(".thumbnailList").addClass('none');
        	$(".normalList").addClass('none');
        	$(".bookCoverList").removeClass('none');
        }
        $(window).trigger('resize');
    });
    
    $(document).on("click","div.photo > a, div.txtL > a, td.txtL > a",function(){
    	var bbs_seq = $(this).data("idno");
    	
    	$(this).attr("href","#;");
    	$("#sendForm input:hidden[name=BBS_SEQ]").val(bbs_seq);
        fn_comm_ajax({
            url : "/ajaxf/frBoard/bbsChecking.do",
            data : $("#sendForm").serialize(),
            dataType : "json",
            success : function(data) {
                if(data == 0){
                    alert('비밀글입니다.');
                }else if(data == 1){
					location.href = "/kotranews/cms/board/boardView.do?"+encodeURI($("#sendForm").serialize());
                }else if(data == 2){
                	alert('권한이 없습니다.');
                }else {
                	alert('잘못된 접근입니다.');
                    return;
                }
            }
        });
    });
    
    $(document).on('click', '.hscdPop', function(){
		$(document).find('body').css("overflow-y","hidden");
		frameBtnObj = $(this);
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
    
  //지역 선택
    $(document).on('click', '[name=pRegnCd]', function(){
    	var ck = "";
       	if($('[name=sNatCd]').val() == "") ck = "checked";
    	$("#natArea").html('<li><span class="inp_r"><input type="radio" name="pNatCd" id="natAll" value="" '+ck+'><label for="natAll">전체</label></span></li>');
    	
    	var val =$(this).val();
    	
    	if(val == ''){
    		$("[name=pKbcCd]").html('<option value="" selected="selected">전체</option>');
    		return;
    	}
    	
        fn_comm_ajax({
           url: "/ajaxf/frNews/getKotraBoardNationList.do",
           data: {"cd" : val},
           async: false,
           dataType: "json",
           success: function (data) {
               if(null != data){
                   var html = '';
                  	
                   for(var idx=0; idx<data.length; idx++){
                       	var ck = "";
                       	
                       	if($('[name=sNatCd]').val() == data[idx].UN_NAT_CD){
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
                   
                   if($("[name=pNatCd]:checked").val() == ''){
                	   $("[name=pKbcCd]").html('<option value="" selected="selected">전체</option>');
                   }else{
                	   $("[name=pKbcCd]").html('<option value="" selected="selected">선택</option>');
                   }
                   
                   if("" != ''){
                   		$("[name=pNatCd]:checked").trigger('click');
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
                        	if($('[name=sKbcCd]').val() == data[idx].CMMN_CD){
                        		ck = "selected";
                        	}
                            html += '<option value="' + data[idx].CMMN_CD + '" '+ck+'>' + data[idx].CD_NAME + '</option>';
                        }
                        $(html).appendTo("[name=pKbcCd]");
                    }
                }
            });
        }
    });
    
	$("[name=pRegnCd]:checked").trigger('click');
    
    fn_setDefaultShowType();
    fn_list();
    
});

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
	
	if($("#sendForm input:hidden[name=pageNo]").val() == ""){
		$("#sendForm input:hidden[name=pageNo]").val("1");
	}
	
    if($("#sendForm input:hidden[name=recordCountPerPage]").val() == ""){
    	if($("#sendForm input:hidden[name=pagePerCnt]").val() != ""){
    		$("#sendForm input:hidden[name=recordCountPerPage]").val($("#sendForm input:hidden[name=pagePerCnt]").val());
    	} else {
    		$("#sendForm input:hidden[name=recordCountPerPage]").val("10");	
    	}
    }
	
	var st = new Date($('#START_DT').val());
	var et = new Date($('#END_DT').val());
	
	if((st != null || st == '') && (et != null || et == '')){
		if(st > et){
			alert('시작일은 종료일보다 이전이어야 합니다');
			return;
		}
	}
	
	var ajaxUrl = '/ajaxf/frBoard/bbsViewList.do';
	
    fn_comm_ajax({
        url : ajaxUrl,
        data : $("#sendForm").serialize(),
        async: false,
        dataType : "json",
        success : function(data) {
        	
           	fn_comm_setList("#tbody", data, "#listTemplate", "#noListTemplate", "#rowCount", ".pagination");
           	fn_comm_setList("#galley_list", data, "#galleyListTemplate", "#noGalleyListTemplate", "#rowCount", ".pagination");
			if($("#tbody .typeNoArticle").length > 0){
         		$("#tbody #noData td").prop("colspan", $("#listTable > thead th").length);
            }
			
			var listType = $("ul.listViewType").find('.on').attr('class') ;
			
            if(listType == 'typeTit on'){
            	$(".thumbnailList").addClass('none');
            	$(".bookCoverList").addClass('none');
            	$(".normalList").removeClass('none');
            }else if($("ul.listViewType").find('.on').attr('class') == 'typeThumb on'){
            	$(".normalList").addClass('none');
            	$(".bookCoverList").addClass('none');
            	$(".thumbnailList").removeClass('none');
            }else{
            	$(".thumbnailList").addClass('none');
            	$(".normalList").addClass('none');
            	$(".bookCoverList").removeClass('none');
            }
            if('Y' == 'Y'){
	            fn_makeAttachFileIcon(data);
            }
            fn_replaceContents(data);
            galleryRate();
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
function fn_linkPage(pageNo){
    $("#sendForm [name='pageNo']").val(pageNo);
    fn_list();
}

/************************************************************************
* 함수명 : searchEnterKey
* 설 명 : 엔터키 trigger - 리스트 조회 펑션 동작 
* 인 자 : 
* 작성자 : bvs
* 수정일 수정자 수정내용
* ------ ------ -------------------
* 2021.03.15 bvs 최초생성
************************************************************************/
function fn_searchEnterkey() {
   	$(".btn_search").trigger("click");
}

/************************************************************************
 * 함수명 : fn_boardItemModi
 * 설 명 : 수정페이지 이동
 * 인 자 : 
 * 작성자 : bvs
 * 수정일 수정자 수정내용
 * ------ ------ -------------------
 * 2021.03.15 bvs 최초생성
 ************************************************************************/
 function fn_boardItemModi(){
	 $("#sendForm input:hidden[name=BBS_SEQ]").val("");
 	 location.href="https://dream.kotra.or.kr/kotranews/cms/board/boardWrite.do?"+$("#sendForm").serialize(); 
 }
 
 /************************************************************************
  * 함수명 : fn_replaceContents
  * 설 명 : Contents(내용)에 html 태그제거
  * 인 자 : 
  * 작성자 : bvs
  * 수정일 수정자 수정내용
  * ------ ------ -------------------
  * 2021.03.15 bvs 최초생성
  ************************************************************************/
 function fn_replaceContents(data){
	 
	 for(var idx in data.list){
		 var contents = data.list[idx].CONTENTS;
		 var replaceCt = "";
		 if(contents != null){
			if(/<[a-z][\s\S]*>/i.test(contents)){
				replaceCt += contents;
			}else{
				replaceCt += contents.replace(/\n/g,"<br/>");
			}
	 	}
		$("#txt_s"+data.list[idx].BBS_SEQ).html(replaceCt);
	 }
	 
 }

 
 /************************************************************************
 * 함수명 : fn_makeAttachFileIcon
 * 설 명 :  첨부파일이 존재하면 첨부파일 컬럼에 아이콘 생성
 * 인 자 :  data(boardFileList)
 * 작성자 : dygo
 * 수정일 수정자 수정내용
 * ------ ------ -------------------
 * 2021.07.28 dygo 최초생성
 * 2021.08.08 dygo 아이콘 디자인 추가(첨부파일,이미지 아이콘 추가 작업 필요)
 ************************************************************************/
 function fn_makeAttachFileIcon(data){
	 
 	if(data.list.length > 0){
 	    $(".openY").each(function(i){
 	    	var extIcon = "";
 	    	
			if(data.list[i].EXISTFILE.EXIST_FILE_YN == 'Y'){
				extIcon = "<em class='mSort'>첨부파일</em><span class='hasFile'><em>첨부파일 존재</em></span>";
			}else{
				extIcon = "<em class='mSort'>첨부파일</em>-";
			}
			
			$(this).find(".attachFile").append(extIcon);
 	    });
 	}
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
 	$("[name=START_DT]").val('');
 	$("[name=END_DT]").val('');
 	$("[name=SEARCH_FLD] option").eq(0).prop('selected', 'selected');
 	$("[name=SEARCH]").val('');
 	$("[name=pRegnCd]").eq(0).prop('checked', 'checked');
 	$("[name=sNatCd]").val('');
 	$("[name=sKbcCd]").val('');
 	$("[name=pRegnCd]:checked").trigger('click');
 	$("[name=pIndustCd] option").eq(0).prop('selected', 'selected');
 	$("[name=pHsCode]").val('');
 	$("[name=pHsCodeNm]").val('');
 	$("[name=CATE_SEQ]").val('');
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
 함수명 : fn_setDefaultShowType
 설 명 : iframe 비활성화
 인 자 : -
 작성자 : [대외경제정보 통합 플랫폼] 포털파트
  수정일              수정자                                   수정내용
 ----------  ---------------------   ------------------
 2021-03-15  [대외경제정보 통합 플랫폼]      최초 생성
 ************************************************************************/
 function fn_setDefaultShowType(){
 	var showType = 'B0302';
 	
 	if(showType == "B0301"){
 		$("ul.listViewType > li").find('.typeTit').addClass('on') ;
 		$("ul.listViewType > li").find('.typeTit').attr('title', '선택됨');
 	}else{
 		$("ul.listViewType").show();
	 	$("ul.listViewType > li").find('.typeThumb').addClass('on') ;
	 	$("ul.listViewType > li").find('.typeThumb').attr('title', '선택됨');
 	}
 }
 