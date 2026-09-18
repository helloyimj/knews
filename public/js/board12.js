
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
    // 요약박스 여닫기

    $('.sumBoxArea .btn_moreView').click(function () {
        if ($('.sumBox').hasClass('on')) {
            $('.sumBox').removeClass('on');
        } else {
            $('.sumBox').addClass('on');
        }
    })

    $(document).on('click', '.btn_sym', function(){
        var val = $(this).val();

        fn_comm_ajax({
            url : "/ajaxf/frIndReport/updateIndReportLikeInfo.do",
            data : "pRptNo=" + $("#listForm input:hidden[name=pRptNo]").val() + "&pLikesGbnCd=" + val,
            dataType : "json",
            success : function(data) {
                if(data != null ){
                    //alert(data.MSG);
                    if(data.RESULT == "SUCCESS"){
                        fn_getLikeInfo();
                    }
                }else{
                    alert('저장에 실패했습니다.');
                }
            }
        });
    });

    if("false" == "true"){
// 		$(".writeIp").text(ip());

        var dt = new Date();
        var month = dt.getMonth()+1;
        var day = dt.getDate();
        var year = dt.getFullYear();

        if( Number(month) < 10) {
            month = "0" + month;
        }
        if( Number(day) < 10) {
            day = "0" + day;
        }
        var hour = dt.getHours();
        var min = dt.getMinutes();
        if( Number(hour) < 10) {
            hour = "0" + hour;
        }
        if( Number(min) < 10) {
            min = "0" + min;
        }
        var nowDate = String(year) + "-" + String(month) + "-" + String(day) + " " + String(hour) + ":" + String(min) ;
        $(".writeDate").text(nowDate);
    }

    fn_getLikeInfo();
    fn_linkPage('1');
    fn_commentLinkPage('1');
	
});

/************************************************************************
 * 함수명 : fn_prev
 * 설 명 : 이전보고서로 이동
 * 인 자 :
 * 작성자 : bvs
 * 수정일 수정자 수정내용
 * ------ ------ -------------------
 * 2021.04.22 bvs 최초생성
 ************************************************************************/
function fn_prev() {
    $("#listForm input:hidden[name=pRptNo]").val($("#listForm input:hidden[name=PREV_RPT_NO]").val());
    location.href = "/kotranews/cms/indReport/actionIndReportDetail.do?" + $("#listForm").serialize();
}

/************************************************************************
 * 함수명 : fn_next
 * 설 명 : 게시물 삭제
 * 인 자 : 다음보고서로 이동
 * 작성자 : bvs
 * 수정일 수정자 수정내용
 * ------ ------ -------------------
 * 2021.04.22 bvs 최초생성
 ************************************************************************/
function fn_next() {
    $("#listForm input:hidden[name=pRptNo]").val($("#listForm input:hidden[name=NEXT_RPT_NO]").val());
    location.href = "/kotranews/cms/indReport/actionIndReportDetail.do?" + $("#listForm").serialize();
}

/************************************************************************
 * 함수명 : fn_fileDown
 * 설 명 : 첨부파일 다운로드
 * 인 자 : obj
 * 작성자 : bvs
 * 수정일 수정자 수정내용
 * ------ ------ -------------------
 * 2021.03.15 bvs 최초생성
 ************************************************************************/
function fn_fileDown(obj){
	 
	/* 로그인전환 확정후 개발 - hdg
	var fileExt = $(obj).data("fileext"); // 파일확장명
	 var memberYn = "N"; // 로그인 여부 
	 if(fileExt == 'pdf' && memberYn == 'N'){
		 if(confirm("해당 서비스는 로그인이 필요합니다.\n로그인 페이지로 이동하시겠습니까?")) {
			// location.href = "/kotranews/login/topUtilLink.do?pRetUrl=" + encodeURIComponent(window.location.pathname + window.location.search);
			 location.href = "https://www.kotra.or.kr/membership/membershipLoginForm.do?siteName=kn"
			return;
		 }else{
			 return;
		 }
	 } 
	 */
	 
    fn_comm_ajax({
        url: "/ajaxf/frIndReport/updateReportDownloadInfo.do",
        data: $("#sendForm").serialize(),
        dataType: "json",
        success: function (data) {
            //location.href="/ajaxa/fileCpnt/fileDown.do?gbn=e02&pAtFileSn="+$(obj).data("atfilesn")+ "&pRptNo=" + $("#sendForm [name=pRptNo]").val() + "&pFrontYn=Y";
        	var pUrl = "/ajaxa/fileCpnt/fileDown.do?gbn=e02&pAtFileSn="+$(obj).data("atfilesn")+ "&pRptNo=" + $("#sendForm [name=pRptNo]").val() + "&pFrontYn=Y";
        	var pFilename = $(obj).data('filename');
        	var pAtFileSn = $(obj).data("atfilesn");
        	
        	$('#colctForm input[name="pRptAtfileNm"]').val(pFilename);
        	$('#colctForm input[name="pRptAtfileSn"]').val(pAtFileSn);
        	$('#colctForm input[name="pRptColctGbn"]').val('다운로드');
        	
        	// fn_rptAtfileHistory(); 로그인전환 확정후 개발 - hdg
        	
        	fn_filedown_progress_privacy(pUrl, pFilename);
        	
        	//fn_filedown_progress(pUrl, pFilename);
        
        }
    })
}

/************************************************************************
 * 함수명 : fn_getLikeInfo
 * 설 명 : 공감정보 조회
 * 인 자 :
 * 작성자 : bvs
 * 수정일 수정자 수정내용
 * ------ ------ -------------------
 * 2021.03.15 bvs 최초생성
 ************************************************************************/
function fn_getLikeInfo(){
    fn_comm_ajax({
        url : "/ajaxf/frIndReport/getIndReportLikeInfo.do",
        data : $("#sendForm").serialize(),
        dataType : "json",
        success : function(data) {
        	if(data != null ){
				$(".util_l").empty();
				var obj = '<button type="button" class="btn_sym"><span class="txtHidden">공감하기</span><em>' + data.AGREE_CNT + '</em></button>';
				$(obj).appendTo($(".util_l"));
			}
        }
    });
}

/************************************************************************
 * 함수명 : fn_listPage
 * 설 명 : 목록이동
 * 인 자 :
 * 작성자 : bvs
 * 수정일 수정자 수정내용
 * ------ ------ -------------------
 * 2021.03.15 bvs 최초생성
 ************************************************************************/
function fn_listPage(){
    location.href = "/kotranews/cms/com/index.do?"+$("#listForm").serialize();
}

/************************************************************************
 * 함수명 : fn_reltdList
 * 설 명 : 관련지역 보고서이동
 * 인 자 :
 * 작성자 : bvs
 * 수정일 수정자 수정내용
 * ------ ------ -------------------
 * 2021.03.15 bvs 최초생성
 ************************************************************************/
function fn_reltdList(){

    if("Y" == ""){
        return false;
    }

    if($("#sendForm input:hidden[name=pageNo]").val() == "" || $("#sendForm input:hidden[name=pageNo]").val() == null){
        $("#sendForm input:hidden[name=pageNo]").val('1');
    }

    fn_comm_ajax({
        url : '/ajaxf/frIndReport/getIndReportReltdList.do',
        data : $("#sendForm").serialize(),
        dataType : "json",
        success : function(data) {
             fn_comm_setList("#tbody", data, "#listTemplate", "#noListTemplate", "#rowCount", ".pagination");
            if("Y" == "Y") {
                if(data.list.length >0){
                    fn_setAttachList(data.list);
                    $(".moreVideoArea").show();
                } else {
                    $(".moreVideoArea").hide();
                }
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
function fn_setAttachList(data) {
    if (null != data && '' != data) {
        for (var idx = 0; idx < data.length; idx++) {
            var attachList = data[idx].attachList;
            var rptNo = data[idx].RPT_NO;
            var obj = '';
            
            if (null != attachList && '' != attachList) {
                for (var idx2 = 0; idx2 < attachList.length; idx2++) {
                	if(attachList[idx2].NTT_ATFILE_IMG_MVP_DC_CN == null || attachList[idx2].NTT_ATFILE_IMG_MVP_DC_CN == '' || attachList[idx2].NTT_ATFILE_IMG_MVP_DC_CN == 'undefined') attachList[idx2].NTT_ATFILE_IMG_MVP_DC_CN = '';
                    obj += '<a href="#;" class="file-download" title="' + attachList[idx2].NTT_ATFILE_IMG_MVP_DC_CN + '"data-atfilesn="'+attachList[idx2].ATFILE_SN+'"data-filename="'+ attachList[idx2].REAL_ATFILE_NAME +'" onclick="fn_fileDown(this);">';
                    obj += '<img src="../img/common/file_' + attachList[idx2].ATFILE_EXT_NAME + '.png" class="ico_file' + attachList[idx2].ATFILE_EXT_NAME + '" alt="'+attachList[idx2].NTT_ATFILE_IMG_MVP_DC_CN+'" onError="this.src=\'/type/common/img/common/file_etc.png\'"/>';
                    obj += '</a>&nbsp;';
                }
            } else {
            	obj += '<span>-</span>'
            }
            
            $(obj).appendTo($("#tbody tr td[data-idno=" + rptNo + "]"));
        }
    }
}

/************************************************************************
 함수명 : fn_linkPage
 설 명 : 샤용자관리 검색목록 셋팅
 인 자 : pageNo(페이지 번호)
 작성자 : [대외경제정보 통합 플랫폼] 포털파트
 수정일              수정자                                   수정내용
 ----------  ---------------------   ------------------
 2021-03-12  [대외경제정보 통합 플랫폼]      최초 생성
 ************************************************************************/
function fn_linkPage(pageNo){
    $("#sendForm [name='pageNo']").val(pageNo);
    fn_reltdList();
}

/************************************************************************
 함수명 : fn_viewPage
 설 명 : 상세보고서로 이동
 인 자 : pageNo(페이지 번호)
 작성자 : [대외경제정보 통합 플랫폼] 포털파트
 수정일              수정자                                   수정내용
 ----------  ---------------------   ------------------
 2021-03-12  [대외경제정보 통합 플랫폼]      최초 생성
 ************************************************************************/
function fn_viewPage(RPT_NO){
    $("#sendForm input:hidden[name=pRptNo]").val(RPT_NO);
    location.href="https://dream.kotra.or.kr/kotranews/cms/indReport/actionIndReportDetail.do?"+$("#sendForm").serialize();
}

/************************************************************************
 * 함수명 : fn_modiComment
 * 설 명 : 댓글 수정할 수 있는 영역으로 변경
 * 인 자 : obj(댓글수정버튼)
 * 작성자 : bvs
 * 수정일 수정자 수정내용
 * ------ ------ -------------------
 * 2021.03.15 bvs 최초생성
 ************************************************************************/
function fn_modiComment(obj){
    $("#commentList .reCommentArea").remove();

    var cmmntSn = $(obj).closest('li').data('cmmntsn');
    var comText = $(obj).closest("li").find(".cmmntCn").html();
    if(comText != null){
        if(/<[a-z][\s\S]*>/i.test(comText)){
            comText = comText.replace("<br>","\n");
        }
    }

    $(".orgBtnArea").show();
    $("#commentList li fieldset").remove();
    $("#commentList li .cmmntCn").show();

    $(obj).closest("li").find(".cmmntCn").hide();
    $(obj).closest('li').find('.orgBtnArea').hide();

    var html = '<fieldset><legend>댓글 수정</legend>';
    html += '<textarea class="inp_area" name="cmmntCn" title="댓글 수정창" onkeydown="fn_areaLengthSet(this);">'+comText+'</textarea>';
    html += '<div class="calByte">';
    html += '<span><b class="commentCurByte">'+comText.length+'</b> / 300</span>';
    html += '</div>';
    html += '<div class="btn">';
    html += '<button class="btn_replyS" type="button" onclick="fn_cancel(this);">취소</button>';
    html += '<button class="btn_replyS" type="button" onclick="fn_CommentUpdate(this);">수정</button>';
    html += '</div>';
    html += '</fieldset>';

    $(html).appendTo($(obj).closest('li'));
}

/************************************************************************
 * 함수명 : fn_cancel
 * 설 명 : 댓글 수정 취소
 * 인 자 :
 * 작성자 : bvs
 * 수정일 수정자 수정내용
 * ------ ------ -------------------
 * 2021.03.15 bvs 최초생성
 ************************************************************************/
function fn_cancel(obj) {
    $(obj).closest("li").find(".cmmntCn").show();
    $(obj).closest('li').find('.orgBtnArea').show();
    $(obj).closest('fieldset').remove();
}

/************************************************************************
 * 함수명 : fn_CommentUpdate
 * 설 명 : 댓글 수정
 * 인 자 :
 * 작성자 : bvs
 * 수정일 수정자 수정내용
 * ------ ------ -------------------
 * 2021.03.15 bvs 최초생성
 ************************************************************************/
function fn_CommentUpdate(obj) {
    var cmmntSn = $(obj).closest("li").data("cmmntsn");
    var comText = $(obj).closest("li").find('[name=cmmntCn]').val().trim();

    if(comText == ""){
        alert('댓글을 입력하세요.');
        return;
    }

    var minLen = "0";
    var maxLen = "300";
    if("" != minLen){
        if(comText.length < minLen){
            alert('댓글 최소 글자수 ' + minLen + ' 보다 많이 입력 해주셔야 합니다.');
            return;
        }
    }
    if("" != maxLen){
        if(comText.length > maxLen){
            alert('댓글 최대 글자수 ' + maxLen + ' 보다 많이 입력 할 수 없습니다.');
            return;
        }
    }

    if(!confirm("저장하시겠습니까?")) {
        return;
    }

    fn_comm_ajax({
        url : "/ajaxf/frIndReport/updateIndReportCommentInfo.do",
        data : "pRptNo=" + $("#commentForm input:hidden[name=pRptNo]").val() + "&pCmmntSn=" + cmmntSn + "&pCmmntCn=" + encodeURIComponent(comText),
        dataType : "json",
        success : function(data) {
            if(data != null ){
                alert(data.MSG);
                if(data.RESULT == "SUCCESS"){
                    $(obj).closest('li').find('.cmmntCn').show();
                    $(obj).closest('li').find('.orgBtnArea').show();
                    $(obj).closest('li').find('fieldset').remove();
                    $("#commentList").empty();
                    fn_commentLinkPage('1');
                }
            }else{
                alert('저장에 실패했습니다.');
            }
        }
    });
}

/************************************************************************
 * 함수명 : fn_newReCommentView
 * 설 명 :  대댓글 입력폼 생성
 * 인 자 :  obj(댓글버튼)
 * 작성자 : bvs
 * 수정일 수정자 수정내용
 * ------ ------ -------------------
 * 2021.03.15 bvs 최초생성
 ************************************************************************/
function fn_newReCommentView(obj){
    var parent = $(obj).closest("li").data("cmmntsn");
    var topsn = $(obj).closest("li").data("topsn");
    if(topsn == '0'){
        topsn = parent;
    }
    var parent_lvl = $(obj).closest("li").data("lvl");

    $(".orgBtnArea").show();
    $("#commentList li fieldset").remove();
    $("#commentList li .cmmntCn").show();

    $(obj).closest('li').find('.orgBtnArea').hide();
    $("#commentList .reCommentArea").remove();

    var html = '<li class="reCommentArea">';
    html += '<fieldset>';
    html += '<legend>답글 등록</legend>';
    html += '<input type="hidden" name="pCmmntTopSntncVal" value="' + topsn + '"/>';
    html += '<input type="hidden" name="pUpperCmmntSn" value="' + parent + '"/>';
    html += '<input type="hidden" name="pCmmntDp" value="' + (parent_lvl+1) + '"/>';
    html += '<textarea name="pReCmmntCn" class="inp_area" title="답글 등록창" onkeydown="fn_areaLengthSet(this);"></textarea>';
    html += '<div class="calByte">';
    html += '<span><b class="commentCurByte">0</b> / 300</span>';
    html += '</div>';
    html += '<div class="btn">';
    html += '<button type="button" class="btn_replyS" onclick="fn_reCommentCancel(this);">취소</button>';
    html += '<button type="button" class="btn_reply" onclick="fn_newReCommentSave(this);">등록</button>';
    html += '</div>';
    html += '</fieldset>';
    html += '</li>';


    $(html).insertAfter($(obj).closest('li'));
}

/************************************************************************
 * 함수명 : fn_reCommentCancel
 * 설 명 : 대댓글 작성 취소
 * 인 자 :
 * 작성자 : bvs
 * 수정일 수정자 수정내용
 * ------ ------ -------------------
 * 2021.03.15 bvs 최초생성
 ************************************************************************/
function fn_reCommentCancel(obj){
    var parentSn = $(obj).closest('li').find('[name=pUpperCmmntSn]').val();
    $("#commentList li[data-cmmntsn="+parentSn+"]").find('.orgBtnArea').show();
    $(obj).closest('.reCommentArea').remove();
}

/************************************************************************
 * 함수명 : fn_newReCommentSave
 * 설 명 : 대댓글 저장
 * 인 자 :
 * 작성자 : bvs
 * 수정일 수정자 수정내용
 * ------ ------ -------------------
 * 2021.03.15 bvs 최초생성
 ************************************************************************/
function fn_newReCommentSave(obj){
    var val = $("[name=pReCmmntCn]").val();
    if('' == val.trim()){
        alert('내용을 입력 해주세요.');
        return
    }

    var minLen = "0";
    var maxLen = "300";
    if("" != minLen){
        if(val.length < minLen){
            alert('댓글 최소 글자수 ' + minLen + ' 보다 많이 입력 해주셔야 합니다.');
            return;
        }
    }
    if("" != maxLen){
        if(val.length > maxLen){
            alert('댓글 최대 글자수 ' + maxLen + ' 보다 많이 입력 할 수 없습니다.');
            return;
        }
    }

    if(!confirm('저장하시겠습니까?')){
        return;
    }

    fn_comm_ajax({
        url : "/ajaxf/frIndReport/insertIndReportReCommentInfo.do",
        data : $("#commentForm").serialize(),
        dataType : "json",
        success : function(data) {
            if(data != null ){
                alert(data.MSG);
                if(data.RESULT == "SUCCESS"){
                    var parentSn = $(obj).closest('li').find('[name=pUpperCmmntSn]').val();
                    $("#commentList li[data-cmmntsn="+parentSn+"]").find('.orgBtnArea').show();
                    $(".reCommentArea").remove();
                    $("#commentList").empty();
                    fn_commentLinkPage('1');
                }
            }else{
                alert('저장에 실패했습니다.');
            }
        }
    });
}

/************************************************************************
 * 함수명 : fn_delComment
 * 설 명 :  댓글 삭제
 * 인 자 :  comment_seq(댓글번호)
 * 작성자 : bvs
 * 수정일 수정자 수정내용
 * ------ ------ -------------------
 * 2021.03.15 bvs 최초생성
 ************************************************************************/
function fn_delComment(obj){
    if(!confirm('삭제하시겠습니까?')) {
        return;
    }

    var cmmntSn = $(obj).closest('li').data('cmmntsn');

    fn_comm_ajax({
        url : "/ajaxf/frIndReport/deleteReportCommentInfo.do",
        data : $("#commentForm").serialize()+"&pCmmntSn="+cmmntSn,
        dataType : "json",
        success : function(data) {
            if(null != data){
                alert(data.MSG);
                $("#commentList").empty();
                fn_commentLinkPage('1');
            }else{
                alert('삭제에 실패했습니다.');
            }
        }
    });
}

/************************************************************************
 * 함수명 : fn_comment_list
 * 설 명 :  댓글 리스트
 * 인 자 :
 * 작성자 : bvs
 * 수정일 수정자 수정내용
 * ------ ------ -------------------
 * 2021.03.15 bvs 최초생성
 ************************************************************************/
function fn_comment_list(){

    fn_comm_ajax({
        url : "/ajaxf/frIndReport/getReportCommentList.do",
        data : $("#commentForm").serialize(),
        dataType : "json",
        success : function(data) {
            $("#commentList").show();
            if(null != data){
                if(data != null){
                    data.jsFunction = 'fn_commentLinkPage';
                }
                fn_comm_moreList("#commentList", data, "#commentListTemplate", "#commentNoListTemplate", "#comment_count", "#p_moreF");
            }

            if($("#commentList>li").length < 1){
                $("#commentList").hide();
            }
        }
    });
}

/************************************************************************
 * 함수명 : fn_comment_save
 * 설 명 :  댓글 저장
 * 인 자 :
 * 작성자 : bvs
 * 수정일 수정자 수정내용
 * ------ ------ -------------------
 * 2021.03.15 bvs 최초생성
 ************************************************************************/
function fn_comment_save(){

	if("true" == "true"){
		alert('로그인 후 의견을 남겨주세요.');
		return;
	}
	 
    if($("#commentForm textarea[name=pCmmntCn]").val().trim() == ""){
        alert('댓글을 입력하세요.');
        return;
    }

    if($("#commentForm textarea[name=pCmmntCn]").val().length <= "0"){
        alert('댓글 최소 글자수 ' + 0 + ' 보다 많이 입력 해주셔야 합니다.');
        return;
    }

    if($("#commentForm textarea[name=pCmmntCn]").val().length >= "300"){
        alert('댓글 최대 글자수 ' + 300 + ' 보다 많이 입력 할 수 없습니다.');
        return;
    }
    if(!confirm('저장하시겠습니까?')) {
        return;
    }

    var refUrl = window.location.href;

    fn_comm_ajax({
        url : "/ajaxf/frIndReport/insertReportCommentInfo.do",
        data : $("#commentForm").serialize() + "&refUrl=" + encodeURIComponent(refUrl),
        dataType : "json",
        success : function(data) {
            if(null != data){
                alert(data.MSG);

                if(data.RESULT == "SUCCESS"){
                    $("#commentForm textarea[name=pCmmntCn]").val("");
                    $("#commentList").empty();
                    fn_commentLinkPage('1');
                }
            }else{
                alert('저장에 실패했습니다. 관리자에 문의하세요.');
            }
        }
    });
}

/************************************************************************
 * 함수명 : fn_commentLinkPage
 * 설 명 :  댓글 페이징
 * 인 자 :  pageNo(페이지번호)
 * 작성자 : bvs
 * 수정일 수정자 수정내용
 * ------ ------ -------------------
 * 2021.03.15 bvs 최초생성
 ************************************************************************/
function fn_commentLinkPage(pageNo){
    $("#commentForm [name='pageNo']").val(pageNo);
    fn_comment_list();
}

/************************************************************************
 * 함수명 : fn_areaLengthSet
 * 설 명 : 댓글 입력 영역 카운트
 * 인 자 :
 * 작성자 : bvs
 * 수정일 수정자 수정내용
 * ------ ------ -------------------
 * 2021.03.15 bvs 최초생성
 ************************************************************************/
function fn_areaLengthSet(obj){
    var len = $(obj).val().length;
    $(obj).parent().find('.commentCurByte').text(len);
}

/************************************************************************
 * 함수명 : fn_saveScrap
 * 설 명 : 게시물 스크랩
 * 인 자 :
 * 작성자 : bvs
 * 수정일 수정자 수정내용
 * ------ ------ -------------------
 * 2021.03.15 이승현 최초생성
 ************************************************************************/
function fn_saveScrap(){

    var msg = "";
    if($(".btn_scrap").hasClass('on')){
        msg = "스크랩을 취소하시겠습니까?";
    } else {
        msg = "게시물을 스크랩하시겠습니까?";
    }
    if (confirm(msg)) {
        fn_comm_ajax({
            url : "/ajaxf/frCom/saveScrap.do",
            data : $("#scrapForm").serialize(),
            dataType : "json",
            success: function(data) {
                if(data != null ){
                	alert(data.MSG);
                    if(data.RESULT == "SUCCESS"){
                        if($(".btn_scrap").hasClass('on')){
                            $(".btn_scrap").removeClass('on');
                        }else{
                            $(".btn_scrap").addClass('on');
                        }
                    }
                }
            }
        });
    }
    return false;
}

/************************************************************************
 * 함수명 : fn_goKeywordSearch
 * 설 명 : 키워드 통합검색 이동
 * 인 자 :
 * 작성자 : bvs
 * 수정일 수정자 수정내용
 * ------ ------ -------------------
 * 2021.03.15 최초생성
 ************************************************************************/
function fn_goKeywordSearch(str){
	 $("#searchForm [name=searchTxt]").val(str);
	 $("#searchForm [name=pRetUrl]").val('');
	 $("#searchForm").attr('target', '_blank');
	 $("#searchForm").submit();
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
함수명 : fn_filePreview
설 명 : PDF미리보기 팝업 열기
인 자 : obj
작성자 : [대외경제정보 통합 플랫폼] 포털파트
 수정일              수정자                                   수정내용
----------  ---------------------   ------------------
2021-03-15  [대외경제정보 통합 플랫폼]      최초 생성
************************************************************************/
function  fn_filePreview(obj){	
	
	/* 로그인전환 확정후 개발 - hdg
	var fileExt = $(obj).data("fileext"); // 파일확장명
	  var memberYn = "N"; // 로그인 여부 
	 if(fileExt == 'pdf' && memberYn == 'N'){
		 if(confirm("해당 서비스는 로그인이 필요합니다.\n로그인 페이지로 이동하시겠습니까?")) {
			// location.href = "/kotranews/login/topUtilLink.do?pRetUrl=" + encodeURIComponent(window.location.pathname + window.location.search);
			 location.href = "https://www.kotra.or.kr/membership/membershipLoginForm.do?siteName=kn"
			 return;
		 }else{
			 return;
		 }
	 } 
	  */
	 fn_comm_ajax({
	        url: "/ajaxf/frIndReport/updateReportPreviewInfo.do",
	        data: $("#sendForm").serialize(),
	        dataType: "json",
	        success: function (data) {
	        	var dataObj = new Object();
	        	if(data != null ){
	                if(data.RESULT == "SUCCESS"){
	                	dataObj.pGbn = 'e02';
	    	        	dataObj.pAtFileSn = $(obj).data('atfilesn');
	    	        	
	    	        	$(document).find('body').css("overflow-y","hidden");
	    	        	$('<iframe id="iframePop" src="/cms/frCom/actionPdfViewerPop.do?pGbn='+ dataObj.pGbn +'&pAtFileSn='+ dataObj.pAtFileSn +'" class="pop_iframe on" height="100%" scrolling="no" frameborder="0" title="PDF 미리보기 팝업"/>').appendTo($(document).find("body #container"));
	    	        	
	    	        	var pFilename = $(obj).data('filename');
	    	        	var pAtFileSn = $(obj).data("atfilesn");
	    	        	$('#colctForm input[name="pRptAtfileNm"]').val(pFilename);
	    	        	$('#colctForm input[name="pRptAtfileSn"]').val(dataObj.pAtFileSn);
	    	        	$('#colctForm input[name="pRptColctGbn"]').val('전문보기');
	    	        	
	    	        	// fn_rptAtfileHistory(); 로그인전환 확정후 개발 - hdg
	                }
	            }else{
	                alert('전문보기 실패했습니다.');
	            }
	        	
	        }
	    })
}

/************************************************************************
 * 함수명 : fn_fileDown
 * 설 명 : 첨부파일 다운로드
 * 인 자 : obj
 * 작성자 : bvs
 * 수정일 수정자 수정내용
 * ------ ------ -------------------
 * 2021.03.15 bvs 최초생성
 ************************************************************************/
function fn_rptAtfileHistory(){
	  
    fn_comm_ajax({
        url: "/ajaxf/frIndReport/insertReportAtfileColct.do",
        data: $("#colctForm").serialize(),
        dataType: "json",
        success: function (data) {
        	if(data != null ){
                if(data.RESULT != "SUCCESS"){
                	alert('수집에 실패했습니다');	                    
                }
            }else{
                alert('수집에 실패했습니다.');
            }
        }
    })
}
