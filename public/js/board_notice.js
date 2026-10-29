/*
 * CMS 게시물 상세(__news_page15 공지사항, 키워드, 첨부파일).
 * /ajaxf/frBoard, /kotranews/cms/board 경로는 원본과 같다.
 * board_detail.js(뉴스 상세)와 같이 로드하지 않는다.
 */
var gbn = '';

$().ready(function() {
	
	$(function(){
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
					breakpoint: 1024,
					settings: {
					arrows: false
					}
				},
			]	
		})
		}
	});
	
	$(function(){
		$(".photoSlider .unit a").click(function(){
			$(".iframe_imgView").addClass('on');
		});
	});
	
	
 	if (!$('.viewDataWrap').children().length) {
		fn_detail();
	}
 	
	
	
	if("false" == "true"){
		fn_setCommentWriteDt();
	}
	
	$(document).on('click', '.imgViewPop', function(){
		var siteNo = $(this).data('siteno');
		var boardSeq = $(this).data('boardseq');
		var bbsSeq = $(this).data('bbsseq');
		var fileSeq = $(this).data('fileseq');
		
		frameBtnObj = $(this);
	 	$(document).find('body').css("overflow-y","hidden");
	 	$('<iframe id="iframePop" class="pop_iframe iframe_imgView on" height="100%" scrolling="no" frameborder="0"  style="position: absolute; z-index: 999999;" "title="[팝업] 이미지 상세보기" src="/kotranews/cms/board/boardImgFileDetailPop.do?SITE_NO='+siteNo+'&BOARD_SEQ='+boardSeq+'&BBS_SEQ='+bbsSeq+'&FILE_SEQ='+fileSeq+'"/>').appendTo($(top.document).find("body #container"));
	});
	
	$(document).on('click', '.boardReportPop', function(){
		if($("input:hidden[name=REPORT_YN]").val() == 'Y'){
			alert("이미 신고된 게시물 입니다.");
			return false;
		} 
		  
		var siteno = $("#sendForm [name='SITE_NO']").val();
		var boardseq = $("#sendForm [name='BOARD_SEQ']").val();
		var bbsseq = $("#sendForm [name='BBS_SEQ']").val();
		 
		frameBtnObj = $(this);
		$("body").css("overflow-y","hidden");
		$('<iframe id="iframeReportPop" class="pop_iframe on" src="/kotranews/cms/board/boardReportPop.do?SITE_NO='+siteno+'&BOARD_SEQ='+boardseq+'&BBS_SEQ='+bbsseq+'" height="100%" scrolling="no" frameborder="0" title="신고팝업"/> ').appendTo($(top.document).find("body #container"));
	});	

	$(document).on('click', '.commentReportPop', function(){
		if($(this).hasClass('on')){
			alert("이미 신고된 댓글 입니다.");
			return false;
		}
		  
		var siteno = $("#commentForm [name='SITE_NO']").val();
		var boardseq = $("#commentForm [name='BOARD_SEQ']").val();
		var bbsseq = $("#commentForm [name='BBS_SEQ']").val();
		var commentseq = $(this).closest("li").data("cmmntseq");

		frameBtnObj = $(this);
		$("body").css("overflow-y","hidden");
		$('<iframe id="iframeReportPop" class="pop_iframe on" src="/kotranews/cms/board/commentReportPop.do?SITE_NO='+siteno+'&BOARD_SEQ='+boardseq+'&BBS_SEQ='+bbsseq+'&COMMENT_SEQ='+commentseq+'" height="100%" scrolling="no" frameborder="0" title="신고팝업"/>').appendTo($(top.document).find("body #container"));	
	});
});



/************************************************************************
* 함수명 : fn_comment_upt
* 설 명 :  댓글 수정 영역 
* 인 자 :  comment_seq(댓글번호)
* 작성자 : bvs
* 수정일 수정자 수정내용
* ------ ------ -------------------
* 2021.03.15 bvs 최초생성
************************************************************************/
function fn_comment_upt(comment_seq){
	$("#commentForm [data-idno="+comment_seq+"]").find(".txt_v").hide();
	$("#commentForm [data-idno="+comment_seq+"]").find(".btn").hide();

	var modiTag = '<div class="write"><textarea class="inp_area" name="COMMENT_CONT" title="댓글 내용 수정창" rows="5"></textarea>';
	modiTag += '<div class="btnAreaR"><button type="button" class="btnC_s btnBlack btn_save"><span>댓글 수정</span></button></div></div>';
	modiTag += '<button type="button" class="commentBtn btn_cancel">취소</button>';
	
	$(modiTag).appendTo($("#commentForm [data-idno="+comment_seq+"]"));
	$("#commentForm [data-idno="+comment_seq+"]").find("textarea[name=COMMENT_CONT]").val($("#commentForm [data-idno="+comment_seq+"]").find(".view_txt").data("conts"));
}

/************************************************************************
* 함수명 : fn_comment_del
* 설 명 :  댓글 삭제
* 인 자 :  comment_seq(댓글번호)
* 작성자 : bvs
* 수정일 수정자 수정내용
* ------ ------ -------------------
* 2021.03.15 bvs 최초생성
************************************************************************/
function fn_comment_del(comment_seq){
	if(!confirm('삭제하시겠습니까?')) {
        return;
    }
    
    fn_comm_ajax({
        url : "/ajaxf/frBoard/boardCommentDel.do",
        data : $("#commentForm").serialize()+"&COMMENT_SEQ="+comment_seq,
        dataType : "json",
        success : function(data) {
        	if(data == 1){
        		$("#commentForm [name=pageNo]").val("1");
                fn_comment_list();
            }else if(data == 2){
                alert('세션이 만료되었습니다.');
            }else{
                alert('삭제에 실패했습니다. 관리자에 문의하세요.');
            }
        }
    });
}

/************************************************************************
* 함수명 : fn_detail
* 설 명 :  게시물 상세정보 세팅
* 인 자 :
* 작성자 : bvs
* 수정일 수정자 수정내용
* ------ ------ -------------------
* 2021.03.15 bvs 최초생성
************************************************************************/
function fn_detail(){
    if($("#sendForm input:hidden[name=BBS_SEQ]").val() == ''){
        return;
    }
    
    fn_comm_ajax({
        url : "/ajaxf/frBoard/boardViewData.do",
        data : $("#sendForm").serialize()+"&CONTENTS_NO=1",
        dataType : "json",
        success : function(data) {
        	
        	if(data.RESULT == "ERROR"){
        		alert(data.MSG);
        		history.back();
        	}else{
        		var cateNm = data.CATE_NM == null ? "없음" : data.CATE_NM ;
            	var cmmnNm = data.CMMN_NAME == null ? "" : data.CMMN_NAME ;
            	var natNm = data.NAT_NAME == null ? "없음" : data.NAT_NAME ;
            	$("#subject").html(data.SUBJECT);
            	var openGbn = data.OPEN_GBN;
            	if(openGbn == 'N'){
    	        	$("#subject").prepend('<em class="txtOpt Red">[미게시]</em>');
            	}
            	$(".subjectSp").html(data.SUBJECT);
            	if(data.CATE_NM == null){
    	        	$(".categ").remove();
            	}else{
            		$(".categ").append('<span class="txt">'+cateNm+'</span>');
            	}
            	if(data.NAT_NAME == null){
            		$("#NAT_NM").remove();
            	}else{
    	        	$("#NAT_NM").text(natNm);
            	}
            	if(data.WRITER_NM == null){
	            	$("#WRITER_NM").remove();
            	}else{
            		$("#WRITER_NM").text(cmmnNm+" "+data.WRITER_NM);
            	}
            	if(data.WRITE_DT == null){
            		$("#boardWriteDt").remove();
            	}else{
            		$("#boardWriteDt").text(data.WRITE_DT);
            	}
            	if(data.INDUSTRY_NM == null){
            		$("#INDUSTRY_NM").remove();
            	}else{
    	        	$("#INDUSTRY_NM").text(data.INDUSTRY_NM);
            	}
            	
    			var contents = '';
            	
            	if(data.CONTENTS != null){
                	if(/<[a-z][\s\S]*>/i.test(data.CONTENTS)){
                    	contents += data.CONTENTS;
                    }else{
                    	contents += data.CONTENTS.replace(/\n/g,"<br/>");
                   	}
            	}
            	
            	/*
            	contents = contents.replaceAll("&amp;", "&");
            	contents = contents.replaceAll("&lt;", "<");
            	contents = contents.replaceAll("&gt;", ">");
            	contents = contents.replaceAll("&quot;", "\"");
            	contents = contents.replaceAll("&apos;", "'");
            	*/

         		if(($('#sendForm [name=MENU_ID]').val() == '2710' && $('#sendForm [name=CONTENTS_NO]').val() == '1')
         				|| ($('#sendForm [name=MENU_ID]').val() == '2810' && $('#sendForm [name=CONTENTS_NO]').val() == '1')){
	            	contents = contents.replaceAll("&", "&amp;");
	            	contents = contents.replaceAll("<", "&lt;");
	            	contents = contents.replaceAll(">", "&gt;");
	            	contents = contents.replaceAll("\"", "&quot;");
	            	contents = contents.replaceAll("'", "&apos;");               			
         		}
            	
            	$(".viewDataWrap").html(contents);
            	
            	fn_makeKwrdSpan(data);
            	if(data.GONGGONGNURI_TYPE != '5'){
    		        fn_setGongGongNuriVal();
    		        
    		        var altTxt = '';
    		        if(data.GONGGONGNURI_TYPE == "1") altTxt = '공공누리 제 1유형(출처표시) - 공공저작물 자유이용허락';
    		        else if(data.GONGGONGNURI_TYPE == "2") altTxt = '공공누리 제 2유형(출처표시, 상업적 이용금지) - 공공저작물 자유이용허락';
    		        else if(data.GONGGONGNURI_TYPE == "3") altTxt = '공공누리 제 3유형(출처표시, 변경금지) - 공공저작물 자유이용허락';
    		        else if(data.GONGGONGNURI_TYPE == "4") altTxt = '공공누리 제 4유형(출처표시, 상업적 이용금지, 변경금지) - 공공저작물 자유이용허락';
    		        
    		        var nuriIcon = '<img src="/type/common/img/board/img_opentype0'+data.GONGGONGNURI_TYPE+'.png" alt="'+altTxt+'" class="copyrightImg">'
    		        $(".add_openNoti").append(nuriIcon);
            	}else{
            		$(".add_openNoti").css('display','none');
            	}
        	}
        }
    });
}

/************************************************************************
* 함수명 : fn_boardItemDel
* 설 명 :  게시물 삭제
* 인 자 :
* 작성자 : bvs
* 수정일 수정자 수정내용
* ------ ------ -------------------
* 2021.03.15 bvs 최초생성
************************************************************************/
function fn_boardItemDel(){
	
	if (confirm('게시물을 삭제하시겠습니까?')) {
		fn_comm_ajax({
			url : "/ajaxf/frBoard/boardContentsDel.do",
	        data : $("#sendForm").serialize(),
	        dataType : "json",
			success: function(data) {
				if(data != null ){
					alert(data.MSG);
		            if(data.RESULT == "SUCCESS"){
		            	fn_listPage();
		            }
				}
			}
		});
	}
	return false;
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
        url : "/ajaxf/frBoard/boardCommentListData.do",
        data : $("#commentForm").serialize(),
        dataType : "json",
        success : function(data) {
        	
        	$("#commentList").show();
            //fn_comm_setList("#tbody", data, "#listTemplate", "#noListTemplate", ".num", ".pagination");
            fn_comm_moreList("#commentList", data, "#listTemplate", "#noListTemplate", "#replyCnt", "#p_moreF");
            var obj = data.list;
            for(var idx=0; idx<obj.length; idx++){	
    			var cmmntSeq = obj[idx].COMMENT_SEQ;
    			var contents = obj[idx].CONTENTS;
    			
    			$("#commentList [data-cmmntseq="+cmmntSeq+"]").find('.comment-contents').html(contents);
    		}
            
            if($("#commentList>li").length < 1){
        		$("#commentList").hide();
        	}
            if("false" == "true"){
	            fn_setCommentWriteDt();
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
	
	$("#commentForm textarea[name=COMMENT_CONT_NEW]").trigger('onkeydown');
    
    if($("#commentForm textarea[name=COMMENT_CONT_NEW]").val().trim() == ""){
        alert('댓글을 입력하세요.');
        return;
    }
    if(!confirm('저장하시겠습니까?')) {
        return;
    }
    
    var rsaPublicKeyModulus = document.getElementById("rsaPublicKeyModulus").value;
    var rsaPublicKeyExponent = document.getElementById("rsaPublicKeyExponent").value;
    
    var rsa = new RSAKey();
    rsa.setPublic(rsaPublicKeyModulus, rsaPublicKeyExponent);

    //RSA로 암호화한다.
    var securedNttSn = rsa.encrypt($("#commentForm input[name=BBS_SEQ]").val());
    $("#commentForm input[name=rsaValue]").val(securedNttSn);
    
    fn_comm_ajax({
        url : "/ajaxf/frBoard/boardCommentSave.do",
        data : $("#commentForm").serialize(),
        dataType : "json",
        success : function(data) {
        	alert(data.MSG);
    		
    		if(data.RESULT == "SUCCESS"){
    			/* $("#commentForm textarea[name=COMMENT_CONT_NEW]").val("");
    			$(".commentCurByte").text("0");
    			$("#commentList").empty();
    			fn_linkPage('1'); */
    			location.reload();
    		}
        }
    });
}

/************************************************************************
* 함수명 : fn_linkPage
* 설 명 :  댓글 페이징
* 인 자 :  pageNo(페이지번호)
* 작성자 : bvs
* 수정일 수정자 수정내용
* ------ ------ -------------------
* 2021.03.15 bvs 최초생성
************************************************************************/
function fn_linkPage(pageNo){
    $("#commentForm [name='pageNo']").val(pageNo);
    fn_comment_list();
}

/************************************************************************
* 함수명 : fn_fileDown
* 설 명 :  첨부파일 다운로드
* 인 자 : obj(파일다운 컨트롤러)
* 작성자 : bvs
* 수정일 수정자 수정내용
* ------ ------ -------------------
* 2021.03.15 bvs 최초생성
************************************************************************/
function fn_fileDown(obj){
    //location.href="/ajaxa/fileCpnt/fileDown.do?gbn=b03&BOARD_SEQ="+$(obj).data("boardseq")+"&SITE_NO="+$(obj).data("siteno")+"&BBS_SEQ="+$(obj).data("bbsseq")+"&FILE_SEQ="+$(obj).data("fileseq");
	var pUrl = "/ajaxa/fileCpnt/fileDown.do?gbn=b03&BOARD_SEQ="+$(obj).data("boardseq")+"&SITE_NO="+$(obj).data("siteno")+"&BBS_SEQ="+$(obj).data("bbsseq")+"&FILE_SEQ="+$(obj).data("fileseq");
	var pFilename = $(obj).data('filename');
	fn_filedown_progress(pUrl, pFilename);
}

/************************************************************************
* 함수명 : fn_prev
* 설 명 :  이전글로 이동
* 인 자 :
* 작성자 : bvs
* 수정일 수정자 수정내용
* ------ ------ -------------------
* 2021.03.15 bvs 최초생성
************************************************************************/
function fn_prev(){
	$("#listForm input:hidden[name=BBS_SEQ]").val($("#sendForm input:hidden[name=PREV_IDX]").val());
    location.href = "boardView.do?"+$("#listForm").serialize();
}

/************************************************************************
* 함수명 : fn_next
* 설 명 : 다음글로 이동 
* 인 자 :
* 작성자 : bvs
* 수정일 수정자 수정내용
* ------ ------ -------------------
* 2021.03.15 bvs 최초생성
************************************************************************/
function fn_next(){
	$("#listForm input:hidden[name=BBS_SEQ]").val($("#sendForm input:hidden[name=NEXT_IDX]").val());
    location.href = "boardView.do?"+$("#listForm").serialize();
}

/************************************************************************
 * 함수명 : fn_makeKwrdTd
 * 설 명 :  게시물 키워드 td 생성
 * 인 자 :  data(keywordList)
 * 작성자 : dygo
 * 수정일 수정자 수정내용
 * ------ ------ -------------------
 * 2021.07.28 dygo 최초생성
 ************************************************************************/
function fn_makeKwrdSpan(data){
	if(data.keywordList != null && data.keywordList.length > 0){
   		var keywordSpan = "";
   		for(i in data.keywordList){
       		var kwrd = '<a href="#;" onclick="fn_goKeywordSearch(\'' + data.keywordList[i].META_KWRD_NAME + '\');">#'+data.keywordList[i].META_KWRD_NAME+'</a>';
       		keywordSpan += kwrd; 
   		}
   		$(".keywordArea").append(keywordSpan);
   	}
}
 
 /************************************************************************
 * 함수명 : fn_setGongGongNuriVal
 * 설 명 :  공공누리 값 세팅
 * 인 자 : 
 * 작성자 : bvs
 * 수정일 수정자 수정내용
 * ------ ------ -------------------
 * 2021.07.14 dygo 최초작성
 ************************************************************************/
 function fn_setGongGongNuriVal(){
 	fn_comm_ajax({
 	       url : "/ajaxf/frBoard/getGongGongNuriTypeValue.do",
 	       data : "SITE_NO=" + $("#sendForm input:hidden[name=SITE_NO]").val() + "&BOARD_SEQ=" + $("#sendForm input:hidden[name=BOARD_SEQ]").val() + "&BBS_SEQ=" + $("#sendForm input:hidden[name=BBS_SEQ]").val(),
 	       dataType : "json",
 	       success : function(data) {
 	    	   
 	    	   if(data != null && data.gongGongNuriVal != null){
 	    		   $("#gongGongNuriVal").text(data.gongGongNuriVal.CMN_VALUE);
 			   }  
 	       }
 	    });
 }
 
 /************************************************************************
 * 함수명 : fn_boardLikeUpdate
 * 설 명 : 게시물 공감 구분값 변경
 * 인 자 : 
 * 작성자 : bvs
 * 수정일 수정자 수정내용
 * ------ ------ -------------------
 * 2021.07.14 dygo 최초작성
 ************************************************************************/
 function fn_boardSympathyUpdate(POINT_GBN){

 	fn_comm_ajax({
		url : "/ajaxf/frBoard/boardSympathyUpdate.do",
		data : "SITE_NO=" + $("#sendForm input:hidden[name=SITE_NO]").val() + "&BOARD_SEQ=" + $("#sendForm input:hidden[name=BOARD_SEQ]").val() + "&BBS_SEQ=" + $("#sendForm input:hidden[name=BBS_SEQ]").val() + "&POINT_GBN=" + POINT_GBN,
		dataType : "json",
		success : function(data) {
			if(data != null ){
				fn_boardSympathyCnt();
			}
		}
	});
 }
 
 /************************************************************************
 * 함수명 : fn_boardSympathyCnt
 * 설 명 : 게시물 공감 별 카운트 
 * 인 자 : 
 * 작성자 : bvs
 * 수정일 수정자 수정내용
 * ------ ------ -------------------
 * 2021.07.14 dygo 최초작성
 ************************************************************************/
function fn_boardSympathyCnt(){
	fn_comm_ajax({
		url : "/ajaxf/frBoard/boardSympathyCnt.do",
		data : "SITE_NO=" + $("#sendForm input:hidden[name=SITE_NO]").val() + "&BOARD_SEQ=" + $("#sendForm input:hidden[name=BOARD_SEQ]").val() + "&BBS_SEQ=" + $("#sendForm input:hidden[name=BBS_SEQ]").val(),
		dataType : "json",
		success : function(data) {
			if(data != null ){
				var sympathyCnt = 0;
				if (data.boardSympathyCnt.CNT != null) {
					sympathyCnt = data.boardSympathyCnt.CNT;
				}
				$('#boardSympathyCnt').text(sympathyCnt);
			}
		}
	});
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
 	 location.href="/kotranews/cms/board/boardWrite.do?"+$("#sendForm").serialize();
 }

 /************************************************************************
 * 함수명 : fn_listPage
 * 설 명 :  게시물 목록으로 이동
 * 인 자 :
 * 작성자 : bvs
 * 수정일 수정자 수정내용
 * ------ ------ -------------------
 * 2021.03.15 bvs 최초생성
 ************************************************************************/
 function fn_listPage(){
 	location.href ="/kotranews/cms/com/index.do?"+decodeURI($("#listForm").serialize());
 }
 
 /************************************************************************
 * 함수명 : fn_ifmPopClose
 * 설 명 : iframe 비활성화
 * 인 자 : 
 * 작성자 : bvs
 * 수정일 수정자 수정내용
 * ------ ------ -------------------
 * 2021.03.15 bvs 최초생성
 ************************************************************************/
 function fn_ifmPopClose(){
	$("body").css("overflow","");
	$("body").css("overflow-y","");
 	$("#iframePop").remove();
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
  	var parent = $(obj).closest("li").data("cmmntseq");
  	var parent_lvl = $(obj).closest("li").data("lvl");
  	
  	$(".orgBtnArea").show();
  	$("#commentList li fieldset").remove();
  	//$("#commentList li .cmmntCn").show();
  	
  	$(obj).closest('li').find('.orgBtnArea').hide();
  	$("#commentList .reCommentArea").remove();
  	
  	var html = '<li class="reCommentArea">';
  		html += '<fieldset>';
  		html += '<legend>답글 등록</legend>';
  		html += '<input type="hidden" name="COMMENT_UPPER_SEQ" value="' + parent + '"/>';
  		html += '<input type="hidden" name="COMMENT_LVL" value="' + parent_lvl+1 + '"/>';
  		html += '<textarea name="RECOMMENT_CONT_NEW" class="inp_area" title="답글 등록창" onkeydown="fn_areaLengthSet(this);"></textarea>';
  		html += '<div class="calByte">';
  		html += '<span><b class="commentCurByte">0</b> / 2000</span>';
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
 * 함수명 : fn_newReCommentSave
 * 설 명 : 대댓글 저장
 * 인 자 : 
 * 작성자 : bvs
 * 수정일 수정자 수정내용
 * ------ ------ -------------------
 * 2021.03.15 bvs 최초생성
 ************************************************************************/
 function fn_newReCommentSave(obj){
	$(obj).trigger('onkeydown');
	 
 	var val = $("[name=RECOMMENT_CONT_NEW]").val();
 	if('' == val.trim()){
 		alert('내용을 입력 해주세요.');
 		return
 	}
 	
     //var minLen = "";
     var maxLen = "";
     /* if("" != minLen){
     	if(val.length < minLen){
     		alert('댓글 최소 글자수 ' + minLen + ' 보다 많이 입력 해주셔야 합니다.');
     		return;
     	}
     } */
     if("" != maxLen){
     	if(val.length > maxLen){
     		alert('댓글 최대 글자수 ' + maxLen + ' 보다 많이 입력 할 수 없습니다.');
     		return;
     	}
     }
 	
     if(!confirm('저장하시겠습니까?')){
     	return;
     }
     
     var rsaPublicKeyModulus = document.getElementById("rsaPublicKeyModulus").value;
     var rsaPublicKeyExponent = document.getElementById("rsaPublicKeyExponent").value;
     
     var rsa = new RSAKey();
     rsa.setPublic(rsaPublicKeyModulus, rsaPublicKeyExponent);

     //RSA로 암호화한다.
     var securedNttSn = rsa.encrypt($("#commentForm input[name=BBS_SEQ]").val());
     $("#commentForm input[name=rsaValue]").val(securedNttSn);
     
 	fn_comm_ajax({
         url : "/ajaxf/frBoard/boardReCommentSave.do",
         data : $("#commentForm").serialize(),
         dataType : "json",
         success : function(data) {
         	if(data != null ){
 				alert(data.MSG);
 	            if(data.RESULT == "SUCCESS"){
 	            	/* $(".reCommentArea").remove();
 	            	$("#commentList").empty();
 	            	fn_linkPage('1'); */
 	            	location.reload();
 	            }
 			}else{
 				alert('저장에 실패했습니다.');
 			}
         }
     });
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
 	
 	var cmmntSn = $(obj).closest('li').data('cmmntseq');
 	var comText = $(obj).closest("li").find(".comment-contents").text();
 	
 	$(".orgBtnArea").show();
 	$("#commentList li fieldset").remove();
 	$("#commentList li .comment-contents").show();
 	
 	$(obj).closest("li").find(".comment-contents").hide();
 	$(obj).closest('li').find('.orgBtnArea').hide();
 	
 	var html = '<fieldset><legend>댓글 수정</legend>';
 		html += '<textarea class="inp_area" name="COMMENT_CONT" title="댓글 수정창" onkeydown="fn_areaLengthSet(this);">'+comText+'</textarea>';
 		html += '<div class="calByte">';
 		html += '<span><b class="commentCurByte">'+comText.length+'</b> / 2000</span>';
 		html += '</div>';
 		html += '<div class="btn">';
 		html += '<button class="btn_replyS" type="button" onclick="fn_cancel(this);">취소</button>';
 		html += '<button class="btn_replyS" type="button" onclick="fn_CommentUpdate(this);">수정</button>';
 		html += '</div>';
 		html += '</fieldset>';
 	
 	$(html).appendTo($(obj).closest('li'));
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
 	var cmmntSeq = $(obj).closest("li").data("cmmntseq");
 	var COMMENT_CONT = $(obj).closest("li").find('[name=COMMENT_CONT]').val().trim();
 	
 	if(COMMENT_CONT == ""){
         alert('댓글을 입력하세요.');
         return;
     }
     
     //var minLen = "";
     var maxLen = 2000;
    /*  if("" != minLen){
     	if(comText.length < minLen){
     		alert('댓글 최소 글자수 ' + minLen + ' 보다 많이 입력 해주셔야 합니다.');
     		return;
     	}
     } */
     if("" != maxLen){
     	if(COMMENT_CONT.length > maxLen){
     		alert('댓글 최대 글자수 ' + maxLen + ' 보다 많이 입력 할 수 없습니다.');
     		return;
     	}
     }
 	
     if(!confirm("저장하시겠습니까?")) {
         return;
     }
     
     var rsaPublicKeyModulus = document.getElementById("rsaPublicKeyModulus").value;
     var rsaPublicKeyExponent = document.getElementById("rsaPublicKeyExponent").value;
     
     var rsa = new RSAKey();
     rsa.setPublic(rsaPublicKeyModulus, rsaPublicKeyExponent);

     //RSA로 암호화한다.
     var securedNttSn = rsa.encrypt($("#commentForm input[name=BBS_SEQ]").val());
     $("#commentForm input[name=rsaValue]").val(securedNttSn);
     
     fn_comm_ajax({
         url : "/ajaxf/frBoard/boardCommentModi.do",
         data : "SITE_NO=" + $("#commentForm input:hidden[name=SITE_NO]").val() + "&BOARD_SEQ=" + $("#commentForm input:hidden[name=BOARD_SEQ]").val() + "&BBS_SEQ=" + $("#commentForm input:hidden[name=BBS_SEQ]").val() + "&COMMENT_SEQ=" + cmmntSeq + "&COMMENT_CONT=" + encodeURIComponent(COMMENT_CONT) + "&rsaValue=" + securedNttSn,
         dataType : "json",
         success : function(data) {
         	if(data != null ){
 				alert(data.MSG);
 	            if(data.RESULT == "SUCCESS"){
 	            	/* $(obj).closest('li').find('.comment-contents').show();
 	            	$(obj).closest('li').find('.orgBtnArea').show();
 	            	$(obj).closest('li').find('fieldset').remove();
 	            	$("#commentList").empty();
 	            	fn_linkPage('1'); */
 	            	location.reload();
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
 	
 	var cmmntSeq = $(obj).closest('li').data('cmmntseq');
     
     fn_comm_ajax({
         url : "/ajaxf/frBoard/boardCommentDel.do",
         data : $("#commentForm").serialize()+"&COMMENT_SEQ="+cmmntSeq,
         dataType : "json",
         success : function(data) {
         	if(null != data){
         		alert(data.MSG);
         		$("#commentList").empty();
         		fn_linkPage('1');
         	}else{
         		alert('삭제에 실패했습니다.');
         	}
         }
     });
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
 	var parentSeq = $(obj).closest('li').find('[name=COMMENT_UPPER_SEQ]').val();
 	$("#commentList li[data-cmmntseq="+parentSeq+"]").find('.orgBtnArea').show();
 	$(obj).closest('.reCommentArea').remove();
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
 	$(obj).closest("li").find(".comment-contents").show();
 	$(obj).closest('li').find('.orgBtnArea').show();
 	$(obj).closest('fieldset').remove();
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
 	
 	if(len > 2000){
 		$(obj).val($(obj).val().substring(0,2000));
 		$(obj).parent().find('.commentCurByte').text($(obj).val().length);
 	}
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
  * 함수명 : fn_reportPopClose
  * 설 명 : 게시물 신고팝업
  * 인 자 :
  * 작성자 : bvs
  * 수정일 수정자 수정내용
  * ------ ------ -------------------
  * 2021.03.15 고동연 최초생성
  ************************************************************************/
 function fn_reportPopClose(){
	$("body").css("overflow","");
	$("body").css("overflow-y","");
	$("#iframeReportPop").remove();
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
  * 함수명 : fn_setCommentWriteDt
  * 설 명 : 댓글 등록시간 세팅
  * 인 자 :
  * 작성자 : bvs
  * 수정일 수정자 수정내용
  * ------ ------ -------------------
  * 2021.03.15 최초생성
  ************************************************************************/
 function fn_setCommentWriteDt(){
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
