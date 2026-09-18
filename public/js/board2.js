
var gbn = '';

$().ready(function() {

	
		fn_comment_list();
	

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
	
	$(document).on('click', '.btn_sym', function(){
		var val = $(this).val();
		
	    fn_comm_ajax({
	        url : "/ajaxf/frNews/updateKotraBoardLikeInfo.do",
	        data : "pNttSn=" + $("#sendForm input:hidden[name=pNttSn]").val() + "&pLikesGbnCd=" + val,
	        dataType : "json",
	        success : function(data) {
	        	if(data != null ){
		            if(data.RESULT == "SUCCESS"){
		            	fn_getLikeInfo();
		            }
				}else{
					alert('저장에 실패했습니다.');
				}
	        }
	    });	
	});
	
	$(document).on('click', '.imgViewPop', function(){
		var nttSn = $(this).data('nttsn');
		var atfileSn = $(this).data('atfilesn');
		
		frameBtnObj = $(this);
	 	$(document).find('body').css("overflow-y","hidden");
		$('<iframe id="iframePop" class="pop_iframe iframe_imgView on" src="/cms/news/actionKotraBoardImgFileDetailPop.do?pNttSn='+nttSn+'&pAtfileSn='+atfileSn+'" title="[팝업] 이미지 상세보기" frameborder="0" />').appendTo($(document).find("body #container"));
	});
	
	fn_getLikeInfo();
	
	$(document).on('click', '.btn_recommAi', function(){
		
		if($('.aiRecommArea .area').length == 0){
			fn_comm_ajax({
		        url : "/ajaxf/frNews/getAPIRecommContents.do",
		        data : $("#sendForm").serialize(),
		        dataType : "json",
		        async : false,
		        success : function(data) {
		        	if(data != null){
		        		if(data.natList != null && data.natList.length > 0){
		        			var divObj = '<div class="area natInfo">';
		        			divObj += '<p class="tit">드림AI추천 - 국가별</p>';
		        			divObj += '<div class="btn_R">';
		        			divObj += '<a href="#none" class="btnC_s Navy" data-gbn="nat"><span>전체 목록</span></a>';
		        			divObj += '</div>';
		        			divObj += '<ul class="list">';
		        			for(var i=0; i<data.natList.length; i++){
		        				divObj += '<li>';
		        				divObj += '<a href="'+data.natList[i].LINK_URL+'" target="_blank" title="새 창 열림">'+data.natList[i].TITLE +'</a>';
		        				divObj += '<p class="info">';
		        				if(data.natList[i].COLCT_PRTY_NM == ''){
			        				divObj += '<span>KOTRA</span>';
		        				}else{
			        				divObj += '<span>'+data.natList[i].COLCT_PRTY_NM+'</span>';
		        				}
		        				if(data.natList[i].REG_DT.length > 8){
			        				divObj += '<span>'+data.natList[i].REG_DT.substring(0,4)+'-'+data.natList[i].REG_DT.substring(4,6)+'-'+data.natList[i].REG_DT.substring(6,8)+'</span>';
		        				}
		        				divObj += '</p>';
			        			divObj += '</li>';
		        			}
		        			divObj += '</ul>';
		        			divObj += '</div>';
		        			
		        			$(divObj).appendTo($('.aiRecommArea'));
		        		}
		        		if(data.hscdList != null && data.hscdList.length > 0){
		        			for(var i=0; i<data.hscdList.length; i++){
		        				var divObj = '<div class="area hscdInfo">';
			        			divObj += '<p class="tit">드림AI추천 - 품목별</p>';
			        			divObj += '<div class="btn_R">';
			        			divObj += '<a href="#none" class="btnC_s Navy" data-gbn="hscd"><span>전체 목록</span></a>';
			        			divObj += '</div>';
			        			divObj += '<ul class="list">';
			        			for(var i=0; i<data.hscdList.length; i++){
			        				divObj += '<li>';
			        				divObj += '<a href="'+data.hscdList[i].LINK_URL+'" target="_blank" title="새 창 열림">'+data.hscdList[i].TITLE +'</a>';
			        				divObj += '<p class="info">';
			        				if(data.hscdList[i].COLCT_PRTY_NM == ''){
				        				divObj += '<span>KOTRA</span>';
			        				}else{
				        				divObj += '<span>'+data.hscdList[i].COLCT_PRTY_NM+'</span>';
			        				}
			        				if(data.hscdList[i].REG_DT.length > 8){
				        				divObj += '<span>'+data.hscdList[i].REG_DT.substring(0,4)+'-'+data.hscdList[i].REG_DT.substring(4,6)+'-'+data.hscdList[i].REG_DT.substring(6,8)+'</span>';
			        				}
			        				divObj += '</p>';
				        			divObj += '</li>';
			        			}
			        			divObj += '</ul>';
			        			divObj += '</div>';
			        			
			        			$(divObj).appendTo($('.aiRecommArea'));
		        			}
		        		}
		        	}
		        }
		    });
		}
		
		var offset = $('.aiRecommArea').offset();
		$('html, body').animate({scrollTop : offset.top -250}, 1000);
		
	});
	
	$(document).on('click', '.aiRecommArea .btnC_s', function(){
		$(document).find('body').css("overflow-y","hidden");
		$('<iframe id="iframePop" class="pop_iframe on" src="/cms/news/actionKotraAiRecommPop.do?gbn='+$(this).data('gbn')+'&pSiteNo=3&pMenuNo=140&pContSn='+$('#sendForm [name=pDataId]').val()+'&pa1='+$('#sendForm [name=apiNat]').val()+'&pa2='+$('#sendForm [name=apiHscd]').val()+'" title="[팝업] 드림AI추천" frameborder="0" />').appendTo($(document).find("body #container"));
	});
});

function fn_getLikeInfo(){
    fn_comm_ajax({
        url : "/ajaxf/frNews/getKotraBoardLikeInfo.do",
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
	var comText = $(obj).closest("li").find(".cmmntCn").text();
	
	$(".orgBtnArea").show();
	$("#commentList li fieldset").remove();
	$("#commentList li .cmmntCn").show();
	
	$(obj).closest("li").find(".cmmntCn").hide();
	$(obj).closest('li').find('.orgBtnArea').hide();
	
	var html = '<fieldset><legend>댓글 수정</legend>';
		html += '<textarea class="inp_area" name="cmmntCn" title="댓글 수정창" onkeyup="fn_areaLengthSet(this);">'+comText+'</textarea>';
		html += '<div class="calByte">';
		html += '<span><b class="commentCurByte">'+comText.length+'</b> / 1000</span>';
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
    
    var minLen = "1";
    var maxLen = "1000";
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

    var rsaPublicKeyModulus = document.getElementById("rsaPublicKeyModulus").value;
    var rsaPublicKeyExponent = document.getElementById("rsaPublicKeyExponent").value;
    
    var rsa = new RSAKey();
    rsa.setPublic(rsaPublicKeyModulus, rsaPublicKeyExponent);

    //RSA로 암호화한다.
    var securedNttSn = rsa.encrypt($("#commentForm input[name=pNttSn]").val());
    $("#commentForm input[name=rsaValue]").val(securedNttSn);
    
    fn_comm_ajax({
        url : "/ajaxf/frNews/updateKotraBoardCommentInfo.do",
        data : "pNttSn=" + $("#commentForm input:hidden[name=pNttSn]").val() + "&pCmmntSn=" + cmmntSn + "&pCmmntCn=" + encodeURIComponent(comText) + "&rsaValue=" + securedNttSn,
        dataType : "json",
        success : function(data) {
        	if(data != null ){
				alert(data.MSG);
        		location.reload();
	            /* if(data.RESULT == "SUCCESS"){
	            	$(obj).closest('li').find('.cmmntCn').show();
	            	$(obj).closest('li').find('.orgBtnArea').show();
	            	$(obj).closest('li').find('fieldset').remove();
	            	$("#commentList").empty();
	            	fn_linkPage('1');
	            } */
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
		html += '<textarea name="pReCmmntCn" class="inp_area" title="답글 등록창" onkeyup="fn_areaLengthSet(this);"></textarea>';
		html += '<div class="calByte">';
		html += '<span><b class="commentCurByte">0</b> / 1000</span>';
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
	
    var minLen = "1";
    var maxLen = "1000";
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
    
    var rsaPublicKeyModulus = document.getElementById("rsaPublicKeyModulus").value;
    var rsaPublicKeyExponent = document.getElementById("rsaPublicKeyExponent").value;
     
	var rsa = new RSAKey();
    rsa.setPublic(rsaPublicKeyModulus, rsaPublicKeyExponent);

    // 사용자ID와 비밀번호를 RSA로 암호화한다.
    var securedNttSn = rsa.encrypt($("#commentForm input[name=pNttSn]").val());
    $("#commentForm input[name=rsaValue]").val(securedNttSn);
    
	fn_comm_ajax({
        url : "/ajaxf/frNews/insertKotraBoardReCommentInfo.do",
        data : $("#commentForm").serialize(),
        dataType : "json",
        success : function(data) {
        	if(data != null ){
				alert(data.MSG);
        		location.reload();
	           /*  if(data.RESULT == "SUCCESS"){
	            	var parentSn = $(obj).closest('li').find('[name=pUpperCmmntSn]').val();
	            	$("#commentList li[data-cmmntsn="+parentSn+"]").find('.orgBtnArea').show();
	            	$(".reCommentArea").remove();
	            	$("#commentList").empty();
	            	fn_linkPage('1');
	            } */
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
        url : "/ajaxf/frNews/deleteKotraBoardCommentInfo.do",
        data : $("#commentForm").serialize()+"&pCmmntSn="+cmmntSn,
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
        url : "/ajaxf/frNews/getKotraBoardCommentList.do",
        data : $("#commentForm").serialize(),
        dataType : "json",
        success : function(data) {
        	$("#commentList").show();
        	if(null != data){
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
    
    var val = $("#commentForm textarea[name=pCmmntCn]").val();
    var minLen = "1";
    var maxLen = "1000";
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
    
    if(!confirm('저장하시겠습니까?')) {
        return;
    }
    
    var rsaPublicKeyModulus = document.getElementById("rsaPublicKeyModulus").value;
    var rsaPublicKeyExponent = document.getElementById("rsaPublicKeyExponent").value;
     
	var rsa = new RSAKey();
    rsa.setPublic(rsaPublicKeyModulus, rsaPublicKeyExponent);

    //RSA로 암호화한다.
    var securedNttSn = rsa.encrypt($("#commentForm input[name=pNttSn]").val());
    $("#commentForm input[name=rsaValue]").val(securedNttSn);
    
    var refUrl = window.location.href;

    fn_comm_ajax({
        url : "/ajaxf/frNews/insertKotraBoardCommentInfo.do",
        data : $("#commentForm").serialize() + "&refUrl=" + encodeURIComponent(refUrl),
        dataType : "json",
        success : function(data) {
        	if(null != data){
        		alert(data.MSG);
        		
        		location.reload();
        		
//         		if(data.RESULT == "SUCCESS"){
//         			$("#commentForm textarea[name=pCmmntCn]").val("");
//         			$("#commentForm textarea[name=pCmmntCn]").trigger('onkeyup');
//         			$("#commentList").empty();
//         			fn_linkPage('1');
//         		}
        	}else{
        		alert('저장에 실패했습니다. 관리자에 문의하세요.');
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
* 인 자 : obj
* 작성자 : bvs
* 수정일 수정자 수정내용
* ------ ------ -------------------
* 2021.03.15 bvs 최초생성
************************************************************************/
function fn_fileDown(obj){
	//location.href="/ajaxa/fileCpnt/fileDown.do?gbn=n01" + "&nttSn=" + $("#sendForm [name=pNttSn]").val() + "&atFileSn=" + atFileSn + "&pFrontYn=Y";
	var pUrl = "/ajaxa/fileCpnt/fileDown.do?gbn=n01" + "&nttSn=" + $("#sendForm [name=pNttSn]").val() + "&atFileSn=" + $(obj).data('atfilesn') + "&pFrontYn=Y";
	var pFilename = $(obj).data('filename');
	if("444" == "252"){
		fn_filedown_progress_privacy(pUrl, pFilename);
	}else{
		fn_filedown_progress(pUrl, pFilename);
	}	
	
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
function fn_prev(bbsSn, nttSn){
// 	$("#sendForm input:hidden[name=bbsSn]").val(bbsSn);
	$("#sendForm input:hidden[name=pNttSn]").val(nttSn);
	
	if("" == "HotClip"){
		location.href = "/kotranews/cms/newsHotClip/actionKotraBoardHotClipDetail.do?"+$("#sendForm").serialize();
	}else{
	    location.href = "/kotranews/cms/news/actionKotraBoardDetail.do?"+$("#sendForm").serialize();
	}	
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
function fn_next(bbsSn, nttSn){
// 	$("#sendForm input:hidden[name=bbsSn]").val(bbsSn);
	$("#sendForm input:hidden[name=pNttSn]").val(nttSn);
	
	if("" == "HotClip"){
		location.href = "/kotranews/cms/newsHotClip/actionKotraBoardHotClipDetail.do?"+$("#sendForm").serialize();
	}else{
		location.href = "/kotranews/cms/news/actionKotraBoardDetail.do?"+$("#sendForm").serialize();
	}
	
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
* 함수명 : fn_listPage
* 설 명 : 목록이동
* 인 자 : 
* 작성자 : bvs
* 수정일 수정자 수정내용
* ------ ------ -------------------
* 2021.03.15 bvs 최초생성
************************************************************************/
function fn_listPage(){
	location.href="/kotranews/cms/com/index.do?"+$("#sendForm").serialize();
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
                	if(data.RESULT == 'SUCCESS'){
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
 * 함수명 : fn_goPromisingBuyerSearch
 * 설 명 : 유망바이어찾기 이동
 * 인 자 :
 * 작성자 : bvs
 * 수정일 수정자 수정내용
 * ------ ------ -------------------
 * 2021.03.15 최초생성
 ************************************************************************/
 function fn_goPromisingBuyerSearch(){
	 
	

	    if(confirm("로그인한 회원만 이용할 수 있습니다.\n로그인 페이지로 이동하시겠습니까?")) {
	    	var regUrl = "/kotranews/cms/news/actionKotraBoardDetail.do?" + $("#sendForm").serialize();
	    	location.href = "&pRetUrl="+encodeURIComponent(regUrl);
	    }else{
	    	return;
	    }

	 

					
	var countryCd = $('[name=countryCd]').val();
	var hscds = $('[name=hscds]').val();
	
    fn_comm_ajax({
    	url: '/ajaxf/frPromisingBuyerSearch/saveSearchHistory.do',
    	ajaxFormName: 'sendForm',
    	dataType: 'json',
    	async: false,
    	success: function(data){

			if(data != null){
				if(data.RESULT == 'SUCCESS'){
				    var url = 'ext/getBlEntpList?hscds='+hscds+'&countryCd='+countryCd+'&st=';
				    window.open(url, '_blank');					
				}				
			}else{
				alert('검색에 실패했습니다. 관리자에 문의하세요.');
			}
    	}
    })	
 }

 /************************************************************************
 함수명 : fn_filePreview
 설 명 : PDF미리보기 팝업 열기
 인 자 : obj
 작성자 : [대외경제정보 통합 플랫폼] 포털파트
  수정일            수정자                                수정내용
 ----------  ---------------------   ------------------
 2025-06-11  portal                  최초 생성
 ************************************************************************/
 function  fn_filePreview(obj){	
     var dataObj = new Object();
     
     dataObj.pGbn = 'n01';
     dataObj.nttSn = $("#sendForm [name=pNttSn]").val();
     dataObj.atFileSn = $(obj).data('atfilesn');
     
     $(document).find('body').css("overflow-y","hidden");
     $('<iframe id="iframePop" src="/cms/frCom/actionPdfViewerPop.do?pGbn='+ dataObj.pGbn +'&nttSn='+ dataObj.nttSn +'&atFileSn='+ dataObj.atFileSn +'" class="pop_iframe on" height="100%" scrolling="no" frameborder="0" title="PDF 미리보기 팝업"/>').appendTo($(document).find("body #container"));
 }
