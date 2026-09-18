/*
 * 뉴스 게시판 상세 공통 모듈.
 * 원본: js/board.js 상세 구간 (목록 fn_list 와 분리).
 * /ajaxf, /ajaxa, /kotranews, /cms 서버 경로는 변경하지 않는다.
 *
 * 목록의 fn_linkPage 와 이름이 겹치므로, 상세 페이지에서만 이 파일을 로드한다.
 * 댓글 더보기는 원본과 같이 fn_linkPage → fn_comment_list 이다.
 */
(function (window, $) {
	"use strict";

	function isDetailPage() {
		return $(".lineList_v").length > 0 || $("#commentForm").length > 0 || $(".prevNnext").length > 0;
	}

	function isHotClip() {
		var gbn = ($("#sendForm [name=hotClipGbn]").val() || "").toString();
		return gbn === "HotClip";
	}

	function detailUrl() {
		if (isHotClip()) {
			return "/kotranews/cms/newsHotClip/actionKotraBoardHotClipDetail.do?" + $("#sendForm").serialize();
		}
		return "/kotranews/cms/news/actionKotraBoardDetail.do?" + $("#sendForm").serialize();
	}

	function isLoggedOutComment() {
		var txt = $(".replyArea .writer").first().text() || "";
		return txt.indexOf("로그인") !== -1;
	}

	function needsPrivacyFileDown() {
		var bbsSn = ($("#sendForm [name=bbsSn]").val() || "").toString();
		return bbsSn === "252";
	}

	window.fn_getLikeInfo = function () {
		fn_comm_ajax({
			url: "/ajaxf/frNews/getKotraBoardLikeInfo.do",
			data: $("#sendForm").serialize(),
			dataType: "json",
			success: function (data) {
				if (data == null) return;
				$(".util_l").empty();
				$('<button type="button" class="btn_sym"><span class="txtHidden">공감하기</span><em>' + data.AGREE_CNT + "</em></button>").appendTo($(".util_l"));
			}
		});
	};

	/************************************************************************
	 * 함수명 : fn_modiComment
	 * 설 명 : 댓글 수정할 수 있는 영역으로 변경
	 ************************************************************************/
	window.fn_modiComment = function (obj) {
		$("#commentList .reCommentArea").remove();
		var comText = $(obj).closest("li").find(".cmmntCn").text();
		$(".orgBtnArea").show();
		$("#commentList li fieldset").remove();
		$("#commentList li .cmmntCn").show();
		$(obj).closest("li").find(".cmmntCn").hide();
		$(obj).closest("li").find(".orgBtnArea").hide();
		var html = "<fieldset><legend>댓글 수정</legend>";
		html += '<textarea class="inp_area" name="cmmntCn" title="댓글 수정창" onkeyup="fn_areaLengthSet(this);">' + comText + "</textarea>";
		html += '<div class="calByte"><span><b class="commentCurByte">' + comText.length + "</b> / 1000</span></div>";
		html += '<div class="btn">';
		html += '<button class="btn_replyS" type="button" onclick="fn_cancel(this);">취소</button>';
		html += '<button class="btn_replyS" type="button" onclick="fn_CommentUpdate(this);">수정</button>';
		html += "</div></fieldset>";
		$(html).appendTo($(obj).closest("li"));
	};

	/************************************************************************
	 * 함수명 : fn_cancel
	 * 설 명 : 댓글 수정 취소
	 ************************************************************************/
	window.fn_cancel = function (obj) {
		$(obj).closest("li").find(".cmmntCn").show();
		$(obj).closest("li").find(".orgBtnArea").show();
		$(obj).closest("fieldset").remove();
	};

	/************************************************************************
	 * 함수명 : fn_CommentUpdate
	 * 설 명 : 댓글 수정
	 ************************************************************************/
	window.fn_CommentUpdate = function (obj) {
		var cmmntSn = $(obj).closest("li").data("cmmntsn");
		var comText = $(obj).closest("li").find("[name=cmmntCn]").val().trim();
		if (comText === "") {
			alert("댓글을 입력하세요.");
			return;
		}
		if (comText.length < 1) {
			alert("댓글 최소 글자수 1 보다 많이 입력 해주셔야 합니다.");
			return;
		}
		if (comText.length > 1000) {
			alert("댓글 최대 글자수 1000 보다 많이 입력 할 수 없습니다.");
			return;
		}
		if (!confirm("저장하시겠습니까?")) return;

		var rsaPublicKeyModulus = document.getElementById("rsaPublicKeyModulus").value;
		var rsaPublicKeyExponent = document.getElementById("rsaPublicKeyExponent").value;
		var rsa = new RSAKey();
		rsa.setPublic(rsaPublicKeyModulus, rsaPublicKeyExponent);
		var securedNttSn = rsa.encrypt($("#commentForm input[name=pNttSn]").val());
		$("#commentForm input[name=rsaValue]").val(securedNttSn);

		fn_comm_ajax({
			url: "/ajaxf/frNews/updateKotraBoardCommentInfo.do",
			data:
				"pNttSn=" +
				$("#commentForm input:hidden[name=pNttSn]").val() +
				"&pCmmntSn=" +
				cmmntSn +
				"&pCmmntCn=" +
				encodeURIComponent(comText) +
				"&rsaValue=" +
				securedNttSn,
			dataType: "json",
			success: function (data) {
				if (data != null) {
					alert(data.MSG);
					location.reload();
				} else {
					alert("저장에 실패했습니다.");
				}
			}
		});
	};

	/************************************************************************
	 * 함수명 : fn_newReCommentView
	 * 설 명 : 대댓글 입력폼 생성
	 ************************************************************************/
	window.fn_newReCommentView = function (obj) {
		var parent = $(obj).closest("li").data("cmmntsn");
		var topsn = $(obj).closest("li").data("topsn");
		if (topsn == "0") topsn = parent;
		var parent_lvl = $(obj).closest("li").data("lvl");
		$(".orgBtnArea").show();
		$("#commentList li fieldset").remove();
		$("#commentList li .cmmntCn").show();
		$(obj).closest("li").find(".orgBtnArea").hide();
		$("#commentList .reCommentArea").remove();
		var html = '<li class="reCommentArea"><fieldset><legend>답글 등록</legend>';
		html += '<input type="hidden" name="pCmmntTopSntncVal" value="' + topsn + '"/>';
		html += '<input type="hidden" name="pUpperCmmntSn" value="' + parent + '"/>';
		html += '<input type="hidden" name="pCmmntDp" value="' + (parent_lvl + 1) + '"/>';
		html += '<textarea name="pReCmmntCn" class="inp_area" title="답글 등록창" onkeyup="fn_areaLengthSet(this);"></textarea>';
		html += '<div class="calByte"><span><b class="commentCurByte">0</b> / 1000</span></div>';
		html += '<div class="btn">';
		html += '<button type="button" class="btn_replyS" onclick="fn_reCommentCancel(this);">취소</button>';
		html += '<button type="button" class="btn_reply" onclick="fn_newReCommentSave(this);">등록</button>';
		html += "</div></fieldset></li>";
		$(html).insertAfter($(obj).closest("li"));
	};

	/************************************************************************
	 * 함수명 : fn_reCommentCancel
	 * 설 명 : 대댓글 작성 취소
	 ************************************************************************/
	window.fn_reCommentCancel = function (obj) {
		var parentSn = $(obj).closest("li").find("[name=pUpperCmmntSn]").val();
		$("#commentList li[data-cmmntsn=" + parentSn + "]")
			.find(".orgBtnArea")
			.show();
		$(obj).closest(".reCommentArea").remove();
	};

	/************************************************************************
	 * 함수명 : fn_newReCommentSave
	 * 설 명 : 대댓글 저장
	 ************************************************************************/
	window.fn_newReCommentSave = function (obj) {
		var val = $("[name=pReCmmntCn]").val();
		if (val.trim() === "") {
			alert("내용을 입력 해주세요.");
			return;
		}
		if (val.length < 1) {
			alert("댓글 최소 글자수 1 보다 많이 입력 해주셔야 합니다.");
			return;
		}
		if (val.length > 1000) {
			alert("댓글 최대 글자수 1000 보다 많이 입력 할 수 없습니다.");
			return;
		}
		if (!confirm("저장하시겠습니까?")) return;

		var rsaPublicKeyModulus = document.getElementById("rsaPublicKeyModulus").value;
		var rsaPublicKeyExponent = document.getElementById("rsaPublicKeyExponent").value;
		var rsa = new RSAKey();
		rsa.setPublic(rsaPublicKeyModulus, rsaPublicKeyExponent);
		var securedNttSn = rsa.encrypt($("#commentForm input[name=pNttSn]").val());
		$("#commentForm input[name=rsaValue]").val(securedNttSn);

		fn_comm_ajax({
			url: "/ajaxf/frNews/insertKotraBoardReCommentInfo.do",
			data: $("#commentForm").serialize(),
			dataType: "json",
			success: function (data) {
				if (data != null) {
					alert(data.MSG);
					location.reload();
				} else {
					alert("저장에 실패했습니다.");
				}
			}
		});
	};

	/************************************************************************
	 * 함수명 : fn_delComment
	 * 설 명 : 댓글 삭제
	 ************************************************************************/
	window.fn_delComment = function (obj) {
		if (!confirm("삭제하시겠습니까?")) return;
		var cmmntSn = $(obj).closest("li").data("cmmntsn");
		fn_comm_ajax({
			url: "/ajaxf/frNews/deleteKotraBoardCommentInfo.do",
			data: $("#commentForm").serialize() + "&pCmmntSn=" + cmmntSn,
			dataType: "json",
			success: function (data) {
				if (data != null) {
					alert(data.MSG);
					$("#commentList").empty();
					fn_linkPage("1");
				} else {
					alert("삭제에 실패했습니다.");
				}
			}
		});
	};

	/************************************************************************
	 * 함수명 : fn_comment_list
	 * 설 명 : 댓글 리스트
	 ************************************************************************/
	window.fn_comment_list = function () {
		fn_comm_ajax({
			url: "/ajaxf/frNews/getKotraBoardCommentList.do",
			data: $("#commentForm").serialize(),
			dataType: "json",
			success: function (data) {
				$("#commentList").show();
				if (data != null) {
					fn_comm_moreList("#commentList", data, "#commentListTemplate", "#commentNoListTemplate", "#comment_count", "#p_moreF");
				}
				if ($("#commentList>li").length < 1) {
					$("#commentList").hide();
				}
			}
		});
	};

	/************************************************************************
	 * 함수명 : fn_comment_save
	 * 설 명 : 댓글 저장
	 ************************************************************************/
	window.fn_comment_save = function () {
		if (isLoggedOutComment()) {
			alert("로그인 후 의견을 남겨주세요.");
			return;
		}
		if ($("#commentForm textarea[name=pCmmntCn]").val().trim() === "") {
			alert("댓글을 입력하세요.");
			return;
		}
		var val = $("#commentForm textarea[name=pCmmntCn]").val();
		if (val.length < 1) {
			alert("댓글 최소 글자수 1 보다 많이 입력 해주셔야 합니다.");
			return;
		}
		if (val.length > 1000) {
			alert("댓글 최대 글자수 1000 보다 많이 입력 할 수 없습니다.");
			return;
		}
		if (!confirm("저장하시겠습니까?")) return;

		var rsaPublicKeyModulus = document.getElementById("rsaPublicKeyModulus").value;
		var rsaPublicKeyExponent = document.getElementById("rsaPublicKeyExponent").value;
		var rsa = new RSAKey();
		rsa.setPublic(rsaPublicKeyModulus, rsaPublicKeyExponent);
		var securedNttSn = rsa.encrypt($("#commentForm input[name=pNttSn]").val());
		$("#commentForm input[name=rsaValue]").val(securedNttSn);

		fn_comm_ajax({
			url: "/ajaxf/frNews/insertKotraBoardCommentInfo.do",
			data: $("#commentForm").serialize() + "&refUrl=" + encodeURIComponent(window.location.href),
			dataType: "json",
			success: function (data) {
				if (data != null) {
					alert(data.MSG);
					location.reload();
				} else {
					alert("저장에 실패했습니다. 관리자에 문의하세요.");
				}
			}
		});
	};

	/************************************************************************
	 * 함수명 : fn_linkPage
	 * 설 명 : 댓글 페이징 (상세 전용. 목록 페이지에서는 board_list.js 를 쓴다)
	 ************************************************************************/
	window.fn_linkPage = function (pageNo) {
		$("#commentForm [name='pageNo']").val(pageNo);
		fn_comment_list();
	};

	/************************************************************************
	 * 함수명 : fn_fileDown
	 * 설 명 : 첨부파일 다운로드
	 ************************************************************************/
	window.fn_fileDown = function (obj) {
		var pUrl =
			"/ajaxa/fileCpnt/fileDown.do?gbn=n01&nttSn=" +
			$("#sendForm [name=pNttSn]").val() +
			"&atFileSn=" +
			$(obj).data("atfilesn") +
			"&pFrontYn=Y";
		if (needsPrivacyFileDown()) {
			fn_filedown_progress_privacy(pUrl, $(obj).data("filename"));
		} else {
			fn_filedown_progress(pUrl, $(obj).data("filename"));
		}
	};

	/************************************************************************
	 * 함수명 : fn_prev
	 * 설 명 : 이전글로 이동
	 ************************************************************************/
	window.fn_prev = function (bbsSn, nttSn) {
		$("#sendForm input:hidden[name=pNttSn]").val(nttSn);
		location.href = detailUrl();
	};

	/************************************************************************
	 * 함수명 : fn_next
	 * 설 명 : 다음글로 이동
	 ************************************************************************/
	window.fn_next = function (bbsSn, nttSn) {
		$("#sendForm input:hidden[name=pNttSn]").val(nttSn);
		location.href = detailUrl();
	};

	/************************************************************************
	 * 함수명 : fn_ifmPopClose
	 * 설 명 : iframe 비활성화
	 ************************************************************************/
	window.fn_ifmPopClose = function () {
		$("body").css("overflow", "");
		$("body").css("overflow-y", "");
		$("#iframePop").remove();
	};

	/************************************************************************
	 * 함수명 : fn_listPage
	 * 설 명 : 목록이동
	 ************************************************************************/
	window.fn_listPage = function () {
		location.href = "/kotranews/cms/com/index.do?" + $("#sendForm").serialize();
	};

	/************************************************************************
	 * 함수명 : fn_areaLengthSet
	 * 설 명 : 댓글 입력 영역 카운트
	 ************************************************************************/
	window.fn_areaLengthSet = function (obj) {
		$(obj).parent().find(".commentCurByte").text($(obj).val().length);
	};

	/************************************************************************
	 * 함수명 : fn_saveScrap
	 * 설 명 : 게시물 스크랩
	 ************************************************************************/
	window.fn_saveScrap = function () {
		var msg = $(".btn_scrap").hasClass("on") ? "스크랩을 취소하시겠습니까?" : "게시물을 스크랩하시겠습니까?";
		if (!confirm(msg)) return false;
		fn_comm_ajax({
			url: "/ajaxf/frCom/saveScrap.do",
			data: $("#scrapForm").serialize(),
			dataType: "json",
			success: function (data) {
				if (data == null) return;
				alert(data.MSG);
				if (data.RESULT === "SUCCESS") {
					$(".btn_scrap").toggleClass("on");
				}
			}
		});
		return false;
	};

	/************************************************************************
	 * 함수명 : fn_goKeywordSearch
	 * 설 명 : 키워드 통합검색 이동
	 ************************************************************************/
	window.fn_goKeywordSearch = function (str) {
		$("#searchForm [name=searchTxt]").val(str);
		$("#searchForm [name=pRetUrl]").val("");
		$("#searchForm").attr("target", "_blank");
		$("#searchForm").submit();
	};

	/************************************************************************
	 * 함수명 : fn_goPromisingBuyerSearch
	 * 설 명 : 유망바이어찾기 이동
	 ************************************************************************/
	window.fn_goPromisingBuyerSearch = function () {
		if (!confirm("로그인한 회원만 이용할 수 있습니다.\n로그인 페이지로 이동하시겠습니까?")) return;
		var regUrl = "/kotranews/cms/news/actionKotraBoardDetail.do?" + $("#sendForm").serialize();
		location.href = "/kotranews/cms/com/index.do?MENU_ID=770&CONTENTS_NO=1&pRetUrl=" + encodeURIComponent(regUrl);
	};

	/************************************************************************
	 * 함수명 : fn_filePreview
	 * 설 명 : PDF미리보기 팝업 열기
	 ************************************************************************/
	window.fn_filePreview = function (obj) {
		var nttSn = $("#sendForm [name=pNttSn]").val();
		var atFileSn = $(obj).data("atfilesn");
		$("body").css("overflow-y", "hidden");
		$(
			'<iframe id="iframePop" src="/cms/frCom/actionPdfViewerPop.do?pGbn=n01&nttSn=' +
				nttSn +
				"&atFileSn=" +
				atFileSn +
				'" class="pop_iframe on" height="100%" scrolling="no" frameborder="0" title="PDF 미리보기 팝업"/>'
		).appendTo($("body #container"));
	};

	$(function () {
		if (!isDetailPage()) return;

		if ($("#commentForm").length) {
			fn_comment_list();
		}

		if ($(".photoSlider").length && !$(".photoSlider").hasClass("slick-initialized")) {
			$(".photoSlider").slick({
				infinite: false,
				slidesToShow: 5,
				slidesToScroll: 1,
				arrows: true,
				variableWidth: true,
				adaptiveHeight: true,
				responsive: [{ breakpoint: 1041, settings: { arrows: false, infinite: true } }]
			});
		}

		$(document).on("click", ".btn_sym", function () {
			var val = $(this).val();
			fn_comm_ajax({
				url: "/ajaxf/frNews/updateKotraBoardLikeInfo.do",
				data: "pNttSn=" + $("#sendForm input:hidden[name=pNttSn]").val() + "&pLikesGbnCd=" + val,
				dataType: "json",
				success: function (data) {
					if (data != null) {
						if (data.RESULT === "SUCCESS") fn_getLikeInfo();
					} else {
						alert("저장에 실패했습니다.");
					}
				}
			});
		});

		$(document).on("click", ".imgViewPop", function () {
			var nttSn = $(this).data("nttsn");
			var atfileSn = $(this).data("atfilesn");
			$("body").css("overflow-y", "hidden");
			$(
				'<iframe id="iframePop" class="pop_iframe iframe_imgView on" src="/cms/news/actionKotraBoardImgFileDetailPop.do?pNttSn=' +
					nttSn +
					"&pAtfileSn=" +
					atfileSn +
					'" title="[팝업] 이미지 상세보기" frameborder="0" />'
			).appendTo($("body #container"));
		});

		fn_getLikeInfo();

		$(document).on("click", ".btn_recommAi", function () {
			if ($(".aiRecommArea .area").length !== 0) return;
			fn_comm_ajax({
				url: "/ajaxf/frNews/getAPIRecommContents.do",
				data: $("#sendForm").serialize(),
				dataType: "json",
				async: false,
				success: function (data) {
					if (data == null) return;
					if (data.natList && data.natList.length > 0) {
						var divObj = '<div class="area natInfo"><p class="tit">드림AI추천 - 국가별</p><div class="btn_R">';
						divObj += '<a href="#none" class="btnC_s Navy" data-gbn="nat"><span>전체 목록</span></a></div><ul class="list">';
						for (var i = 0; i < data.natList.length; i++) {
							divObj += "<li><a href=\"" + data.natList[i].LINK_URL + '" target="_blank" title="새 창 열림">' + data.natList[i].TITLE + "</a>";
							divObj += '<p class="info"><span>' + (data.natList[i].COLCT_PRTY_NM || "KOTRA") + "</span>";
							if (data.natList[i].REG_DT && data.natList[i].REG_DT.length > 8) {
								divObj +=
									"<span>" +
									data.natList[i].REG_DT.substring(0, 4) +
									"-" +
									data.natList[i].REG_DT.substring(4, 6) +
									"-" +
									data.natList[i].REG_DT.substring(6, 8) +
									"</span>";
							}
							divObj += "</p></li>";
						}
						divObj += "</ul></div>";
						$(divObj).appendTo($(".aiRecommArea"));
					}
					if (data.hscdList && data.hscdList.length > 0) {
						var hObj = '<div class="area hscdInfo"><p class="tit">드림AI추천 - 품목별</p><div class="btn_R">';
						hObj += '<a href="#none" class="btnC_s Navy" data-gbn="hscd"><span>전체 목록</span></a></div><ul class="list">';
						for (var j = 0; j < data.hscdList.length; j++) {
							hObj += "<li><a href=\"" + data.hscdList[j].LINK_URL + '" target="_blank" title="새 창 열림">' + data.hscdList[j].TITLE + "</a>";
							hObj += '<p class="info"><span>' + (data.hscdList[j].COLCT_PRTY_NM || "KOTRA") + "</span>";
							if (data.hscdList[j].REG_DT && data.hscdList[j].REG_DT.length > 8) {
								hObj +=
									"<span>" +
									data.hscdList[j].REG_DT.substring(0, 4) +
									"-" +
									data.hscdList[j].REG_DT.substring(4, 6) +
									"-" +
									data.hscdList[j].REG_DT.substring(6, 8) +
									"</span>";
							}
							hObj += "</p></li>";
						}
						hObj += "</ul></div>";
						$(hObj).appendTo($(".aiRecommArea"));
					}
				}
			});
			var offset = $(".aiRecommArea").offset();
			if (offset) $("html, body").animate({ scrollTop: offset.top - 250 }, 1000);
		});

		$(document).on("click", ".aiRecommArea .btnC_s", function () {
			$("body").css("overflow-y", "hidden");
			$(
				'<iframe id="iframePop" class="pop_iframe on" src="/cms/news/actionKotraAiRecommPop.do?gbn=' +
					$(this).data("gbn") +
					"&pSiteNo=3&pMenuNo=" +
					($("#sendForm [name=MENU_ID]").val() || "") +
					"&pContSn=" +
					$("#sendForm [name=pDataId]").val() +
					"&pa1=" +
					$("#sendForm [name=apiNat]").val() +
					"&pa2=" +
					$("#sendForm [name=apiHscd]").val() +
					'" title="[팝업] 드림AI추천" frameborder="0" />'
			).appendTo($("body #container"));
		});
	});
})(window, jQuery);
