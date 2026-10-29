/*
 * 프론트 HTML/JS만 공통 모듈화
 * /ajaxf, /ajaxa, /bvs, /kotranews, /cms 등 서버 경로·파일은 변경하지 않음
 */
(function (window, $) {
	"use strict";

	var BOARD_TYPES = {
		news: {
			listUrl: "/ajaxf/frNews/getKotraBoardList.do",
			noticeUrl: "/ajaxf/frNews/getKotraBoardNoticeList.do",
			detailUrl: "/kotranews/cms/news/actionKotraBoardDetail.do",
			nationUrl: "/ajaxf/frNews/getInNewsNationList.do",
			tradeUrl: "/ajaxf/frNews/getKotraBoardTradeList.do",
			clsfUrl: "/ajaxf/frNews/getKotraBoardClsfCdList.do"
		}
	};

	var chkNatCd = "N";
	var chkKbcCd = "N";

	function queryVal(name) {
		try {
			return new URLSearchParams(window.location.search).get(name) || "";
		} catch (e) {
			return "";
		}
	}

	function cfg() {
		var $area = $(".board_area[data-board-type]").first();
		var type = ($area.data("boardType") || "news") + "";
		var base = $.extend({}, BOARD_TYPES[type] || BOARD_TYPES.news);
		if ($area.attr("data-attach") === "Y") base.attach = true;
		return base;
	}

	function listSel() {
		if ($("#tbody").length) return "#tbody";
		if ($("#ul").length) return "#ul";
		return "#tbody";
	}

	window.fn_list = function () {
		var option = cfg();
		var pStartDt = $("#pStartDt").val();
		var pEndDt = $("#pEndDt").val();
		if (pStartDt && pEndDt && pStartDt > pEndDt) {
			alert("시작일은 종료일보다 클 수 없습니다.");
			return;
		}

		if ($("#sendForm [name=pageNo]").val() === "") {
			$("#sendForm [name=pageNo]").val("1");
		}
		if ($("#sendForm input:hidden[name=recordCountPerPage]").val() === "") {
			$("#sendForm input:hidden[name=recordCountPerPage]").val("10");
		}

		fn_comm_ajax({
			url: option.listUrl,
			data: $("#sendForm").serialize(),
			dataType: "json",
			success: function (data) {
				var sel = listSel();
				fn_comm_setList(sel, data, "#listTemplate", "#noListTemplate", "#rowCount", ".pagination");

				$(sel + " a[data-source]").each(function () {
					fn_setDetailUrl($(this), $(this).attr("data-source"));
				});

				if (option.attach) {
					fn_setAttachList(data.list);
				}
				if ($("#galley_list").length && $("#galleyListTemplate").length) {
					fn_comm_setList("#galley_list", data, "#galleyListTemplate", "#noGalleyListTemplate", "#rowCount", ".pagination");
				}
				if (typeof window.fn_makeAttachFileIcon === "function") {
					fn_makeAttachFileIcon(data);
				}
				if (typeof window.fn_replaceContents === "function") {
					fn_replaceContents(data);
				}
				if (typeof galleryRate === "function") {
					galleryRate();
				}
			}
		});
	};

	window.fn_linkPage = function (pageNo) {
		$("#sendForm [name='pageNo']").val(pageNo);
		fn_list();
	};

	window.fn_searchReset = function () {
		$("[name=pStartDt]").val("");
		$("[name=pEndDt]").val("");
		$("[name=sSearchGbn] option").eq(0).prop("selected", true);
		$("[name=sSearchVal]").val("");
		$("[name=pRegnCd]").eq(0).prop("checked", true);
		$("[name=pRegnCd]:checked").trigger("click");
		$("[name=pIndustCd] option").eq(0).prop("selected", true);
		$("[name=pHsCode]").val("");
		$("[name=pHsCodeNm]").val("");
		$("[name=pHsCdType]").val("");
		$("[name=pReltdRegnCd] option").eq(0).prop("selected", true);
		$("[name=pNttCtgrySn] option").eq(0).prop("selected", true);
		$("[name=LCLSF_CD] option").eq(0).prop("selected", true);
		$("[name=CLSF_CD] option").eq(0).prop("selected", true);
	};

	window.fn_view = function (nttSn) {
		var option = cfg();
		$("#sendForm [name=pNttSn]").val(nttSn);
		location.href =
			option.detailUrl + "?" + $("#sendForm").serialize() + "&sSearchVal=" + encodeURI($("[name=sSearchVal]").val());
	};

	window.fn_setDetailUrl = function ($item, nttSn) {
		var option = cfg();
		$("#sendForm [name=pNttSn]").val(nttSn);
		$item.attr(
			"href",
			option.detailUrl + "?" + $("#sendForm").serialize() + "&sSearchVal=" + encodeURI($("[name=sSearchVal]").val())
		);
		$("#sendForm [name=pNttSn]").val("");
	};

	window.fn_setAttachList = function (data) {
		if (!data) return;
		for (var idx = 0; idx < data.length; idx++) {
			var attachList = data[idx].attachList;
			var nttSn = data[idx].NTT_SN;
			if (attachList && attachList.length) {
				var obj = "";
				for (var idx2 = 0; idx2 < attachList.length; idx2++) {
					obj +=
						'<a href="#;" class="file-download" title="' +
						attachList[idx2].NTT_ATFILE_IMG_MVP_DC_CN +
						'" data-nttsn="' +
						attachList[idx2].NTT_SN +
						'" data-atfilesn="' +
						attachList[idx2].ATFILE_SN +
						'" data-filename="' +
						attachList[idx2].REAL_ATFILE_NAME +
						'" onclick="fn_fileDown(this);">';
					obj +=
						'<img src="https://dream.kotra.or.kr/kotranews/type/common/img/common/file_' +
						attachList[idx2].ATFILE_EXT_NAME +
						'.png" alt="' +
						attachList[idx2].NTT_ATFILE_IMG_MVP_DC_CN +
						'" class="ico_file_' +
						attachList[idx2].ATFILE_EXT_NAME +
						"\" onError=\"this.src='/type/common/img/common/file_etc.png'\"/>";
					obj += "</a>&nbsp;";
				}
				$(obj).appendTo($("#tbody tr[data-idno=" + nttSn + "]").find(".fileArea"));
			} else {
				$("#tbody tr[data-idno=" + nttSn + "]")
					.find(".fileArea")
					.html('<em class="mSort">첨부파일</em>-');
			}
		}
	};

	window.fn_fileDown = function (obj) {
		var pUrl =
			"/ajaxa/fileCpnt/fileDown.do?gbn=n01&nttSn=" +
			$(obj).data("nttsn") +
			"&atFileSn=" +
			$(obj).data("atfilesn") +
			"&pFrontYn=Y";
		fn_filedown_progress(pUrl, $(obj).data("filename"));
	};

	window.fn_hscodeSel = function (untyCdClCd, hscd, hsnm) {
		$("[name=pHsCode]").val(hscd);
		$("[name=pHsCodeNm]").val(hsnm);
		$("[name=pHsCdType]").val(untyCdClCd);
		fn_ifmPopClose();
	};

	window.fn_ifmPopClose = function () {
		$("body").css("overflow", "");
		$("body").css("overflow-y", "");
		$("#iframePop").remove();
	};

	function noticeTemplateCell(name) {
		if (name === "제목") {
			return '<td class="txtL"><a href="#;" class="subjectTxt"></a></td>';
		}
		if (name === "게시일") {
			return '<td class="noticeOthbcDt"><em class="mSort">게시일</em></td>';
		}
		if (name === "국가") {
			return '<td><em class="mSort">국가</em>본사</td>';
		}
		if (name === "무역관") {
			return '<td><em class="mSort">무역관</em>본사</td>';
		}
		return "<td></td>";
	}

	function ensureNoticeTemplate() {
		if (!$("#noticeArea").length) return;

		var $ths = $("#noticeArea").closest("table").find("thead th");
		if (!$ths.length) {
			$ths = $(".board_area thead th");
		}

		var cells = ['<td class="no"><div class="btnC_s Blue"><span>공지</span></div></td>'];
		if ($ths.length) {
			$ths.each(function (idx) {
				if (idx === 0) return;
				cells.push(noticeTemplateCell($.trim($(this).text())));
			});
		} else {
			cells.push(noticeTemplateCell("제목"));
			cells.push(noticeTemplateCell("국가"));
			cells.push(noticeTemplateCell("무역관"));
			cells.push(noticeTemplateCell("게시일"));
		}

		$("#noticeTemplate").remove();
		var template = document.createElement("template");
		template.id = "noticeTemplate";
		template.innerHTML = '<tr class="nttTr">' + cells.join("") + "</tr>";
		document.body.appendChild(template);
	}

	window.fn_noticeList = function () {
		ensureNoticeTemplate();
		if (!$("#noticeArea").length || !$("#noticeTemplate").length) return;
		fn_comm_ajax({
			url: cfg().noticeUrl,
			data: $("#sendForm").serialize(),
			dataType: "json",
			success: function (data) {
				if (!Array.isArray(data) || !data.length) return;
				data.forEach(function (item) {
					var template = document.getElementById("noticeTemplate");
					var clone = template.content.cloneNode(true);
					var $row = $(clone);
					$row.find(".subjectTxt").text(item.NTT_SJ);
					$row.find(".noticeOthbcDt").text(item.OTHBC_DT);
					fn_setDetailUrl($row.find("a.subjectTxt"), item.NTT_SN);
					$("#noticeArea").append($row);
				});
			}
		});
	};

	$(function () {
		if (!$("#sendForm").length || !$(".board_area").length) return;
		/* 뉴스 상세(__news_page2): 댓글/이전다음. 목록 AJAX 를 돌리지 않는다 */
		if ($("#commentForm").length || $(".prevNnext").length) return;
		/* 산업보고서 상세(__news_page12)는 board_report.js 가 목록/첨부를 담당한다 */
		if ($("#listForm [name=pRptNo]").length) return;
		/* 진출기업(__news_page9)는 board_invest.js 가 담당한다 */
		if ($(".invest_companyInfo").length || $(".board_area[data-board-type=invest]").length) return;
		/* 국별모아드림 항목 상세(__news_page14 투자환경 등)는 board_nation_item.js 가 담당한다 */
		if ($("#pageTab").length || $("#newsBody").length) return;

		if (window.datePickerController) {
			if ($("#pStartDt").length) {
				datePickerController.createDatePicker({ formElements: { pStartDt: "%Y/%m/%d" } });
			}
			if ($("#pEndDt").length) {
				datePickerController.createDatePicker({ formElements: { pEndDt: "%Y/%m/%d" } });
			}
			if ($("#START_DT").length) {
				datePickerController.createDatePicker({ formElements: { START_DT: "%Y/%m/%d" } });
			}
			if ($("#END_DT").length) {
				datePickerController.createDatePicker({ formElements: { END_DT: "%Y/%m/%d" } });
			}
		}

		var qNat = queryVal("pNatCd");
		var qKbc = queryVal("pKbcCd");
		var qSearch = queryVal("sSearchVal");
		if (qNat) chkNatCd = "Y";
		if (qKbc) chkKbcCd = "Y";
		if (qSearch) $("#sendForm [name=sSearchVal]").val(decodeURIComponent(qSearch));

		if (window.performance && window.performance.navigation.type == 2) {
			fn_searchReset();
		}
		$(window).on("pageshow", function (event) {
			if (event.originalEvent.persisted || (window.performance && window.performance.navigation.type == 2)) {
				fn_searchReset();
				if ($("[name=pNatCd]:checked").length < 1) $("#natAll").prop("checked", true);
			}
		});

		$(document).on("focus", "[name=pStartDt]", function () {
			if (window.datePickerController) {
				datePickerController.setRangeLow("pEndDt", $("#pStartDt").val().split("/").join(""));
			}
		});
		$(document).on("focus", "[name=pEndDt]", function () {
			if (window.datePickerController) {
				datePickerController.setRangeHigh("pStartDt", $("#pEndDt").val().split("/").join(""));
			}
		});

		$(document).on("change", "[name=viewCnt]", function () {
			var cntVal = $(this).val();
			if (!cntVal) return;
			$("#sendForm [name=pageNo]").val("1");
			$("#sendForm [name=recordCountPerPage]").val(cntVal);
			fn_list();
		});

		$(document).on("click", ".listViewType button", function () {
			if ($(".thumbnailList").length && $(".normalList").length) {
				$(".listViewType button").removeClass("on").removeAttr("title");
				$(this).addClass("on").attr("title", "선택됨");
				var listType = $("ul.listViewType").find(".on").attr("class");
				if (listType === "typeTit on") {
					$(".thumbnailList").addClass("none");
					$(".bookCoverList").addClass("none");
					$(".normalList").removeClass("none");
				} else if (listType === "typeThumb on") {
					$(".normalList").addClass("none");
					$(".bookCoverList").addClass("none");
					$(".thumbnailList").removeClass("none");
				} else {
					$(".thumbnailList").addClass("none");
					$(".normalList").addClass("none");
					$(".bookCoverList").removeClass("none");
				}
				$(window).trigger("resize");
				return;
			}
			var viewType = $(this).data("viewtype");
			var menuId = $("#sendForm [name=MENU_ID]").val();
			var contentsNo = $("#sendForm [name=CONTENTS_NO]").val();
			location.href =
				"/kotranews/cms/com/index.do?MENU_ID=" +
				menuId +
				"&CONTENTS_NO=" +
				contentsNo +
				"&viewType=" +
				viewType +
				"&" +
				$("#sendForm").serialize();
		});

		$(document).on("click", ".hscdPop", function () {
			$("body").css("overflow-y", "hidden");
			$(
				'<iframe id="iframePop" src="/cms/frCom/actionHsSearchPop.do" class="pop_iframe on" height="100%" scrolling="no" frameborder="0" title="HSCODE 검색 팝업"/>'
			).appendTo($("body #container"));
		});

		$(document).on("click", "[name=pRegnCd]", function () {
			var option = cfg();
			$("#natArea").html(
				'<li><span class="inp_r"><input type="radio" name="pNatCd" id="natAll" value="" checked><label for="natAll">전체</label></span></li>'
			);
			var val = $(this).val();
			if (val === "") {
				$("[name=pKbcCd]").html('<option value="" selected="selected">전체</option>');
				return;
			}
			fn_comm_ajax({
				url: option.nationUrl,
				data: { cd: val, bbsSn: $("[name=bbsSn]").val() },
				dataType: "json",
				async: false,
				success: function (data) {
					if (!data) return;
					var html = "";
					for (var idx = 0; idx < data.length; idx++) {
						var ck = qNat && qNat == data[idx].UN_NAT_CD && chkNatCd === "Y" ? "checked" : "";
						html +=
							'<li><span class="inp_r"><input type="radio" name="pNatCd" id="nat' +
							data[idx].UN_NAT_CD +
							'" value="' +
							data[idx].UN_NAT_CD +
							'" ' +
							ck +
							"><label for=\"nat" +
							data[idx].UN_NAT_CD +
							'">' +
							data[idx].UNTY_NAT_NAME +
							"</label></span></li>";
					}
					$(html).appendTo($("#natArea"));
					if ($("[name=pNatCd]:checked").length < 1) {
						$("[name=pNatCd]").eq(0).prop("checked", true);
					}
					if ($("[name=pNatCd]:checked").val() === "") {
						$("[name=pKbcCd]").html('<option value="" selected="selected">전체</option>');
					} else {
						$("[name=pKbcCd]").html('<option value="" selected="selected">선택</option>');
					}
					if (qNat) {
						$("[name=pNatCd]:checked").trigger("click");
						chkNatCd = "N";
						chkKbcCd = "N";
					}
				}
			});
		});

		$(document).on("click", "[name=pNatCd]", function () {
			var option = cfg();
			$("[name=pKbcCd]").html('<option value="" selected="selected">선택</option>');
			var val = $(this).val();
			if (val === "") {
				$("[name=pKbcCd]").html('<option value="" selected="selected">전체</option>');
				return;
			}
			fn_comm_ajax({
				url: option.tradeUrl,
				data: { cd: val },
				dataType: "json",
				async: false,
				success: function (data) {
					if (!data) return;
					var html = "";
					for (var idx = 0; idx < data.length; idx++) {
						var ck = qKbc && qKbc == data[idx].CMMN_CD && chkKbcCd === "Y" ? "selected" : "";
						html +=
							'<option value="' +
							data[idx].CMMN_CD +
							'" ' +
							ck +
							">" +
							data[idx].CD_NAME +
							"</option>";
					}
					$(html).appendTo("[name=pKbcCd]");
					chkNatCd = "N";
					chkKbcCd = "N";
				}
			});
		});

		$(document).on("change", "[name=LCLSF_CD]", function () {
			$("[name=CLSF_CD]").html('<option value="" selected="selected">선택</option>');
			var val = $(this).val();
			if (val === "") {
				$("[name=CLSF_CD]").html('<option value="" selected="selected">전체</option>');
				return;
			}
			fn_comm_ajax({
				url: cfg().clsfUrl,
				data: { cd: val, pBbsSn: $("#sendForm [name=bbsSn]").val() },
				dataType: "json",
				async: false,
				success: function (data) {
					if (!data) return;
					var html = "";
					for (var idx = 0; idx < data.length; idx++) {
						html += '<option value="' + data[idx].CLSF_CD + '">' + data[idx].CLSF_NAME + "</option>";
					}
					$(html).appendTo("[name=CLSF_CD]");
				}
			});
		});

		$("[name=pRegnCd]:checked").trigger("click");
		if (typeof window.fn_setDefaultShowType === "function") {
			window.fn_setDefaultShowType();
		}
		if ($("#noticeArea").length) {
			fn_noticeList();
		}
		fn_list();
	});
})(window, jQuery);

/* __news_page11 원문 일괄 다운로드 — 구 인라인 스크립트 */
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

// 		window.open("https://dream.kotra.or.kr/kotranews/cms/news/actionKotraBoardDownDetail.do?MENU_ID=320&pNttSn=" + nttSn + "&bbsSn=" + bbsSn + "&type=" + type);
		var src = "https://dream.kotra.or.kr/kotranews/cms/news/actionKotraBoardDownDetail.do?MENU_ID=320&pNttSn=" + nttSn + "&bbsSn=" + bbsSn;
		$('<iframe class="pdfFrame" id="downloadFrame'+$(this).val()+'" src="'+src+'" data-title="'+title+'"></iframe>').appendTo($("#frameDiv"));
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
 * 함수명 : fn_viewPage
 * 설 명 : 상세보고서로 이동 (__news_page5 목록 인라인)
 ************************************************************************/
function fn_viewPage(RPT_NO) {
	$("#sendForm input:hidden[name=pRptNo]").val(RPT_NO);
	location.href =
		"https://dream.kotra.or.kr/kotranews/cms/indReport/actionIndReportDetail.do?" +
		$("#sendForm").serialize();
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
function fn_nationPdfDown() {
	if ($("[name=chkNatSn]:checked").length < 1) {
		alert("국가를 선택하세요.");
		return;
	}
	var pUrl = "/ajaxa/frNation/nationPdfDown.do?" + $("#sendForm").serialize();
	var pFilename = "";
	if ($("[name=chkNatSn]:checked").length > 1) {
		pFilename = "국가정보.zip";
	} else if ($("[name=chkNatSn]:checked").length == 1) {
		pFilename = $("label[for='natSn_" + $("[name=chkNatSn]:checked").val() + "']").text() + ".pdf";
	}
	fn_filedown_progress(pUrl, pFilename);
}

/************************************************************************
 * 함수명 : fn_replaceContents
 * 설 명 : Contents(내용)에 html 태그제거 (__news_page6)
 * 작성자 : bvs
 * 수정일 수정자 수정내용
 * ------ ------ -------------------
 * 2021.03.15 bvs 최초생성
 ************************************************************************/
function fn_replaceContents(data) {
	if (!data || !data.list) return;
	for (var idx in data.list) {
		var contents = data.list[idx].CONTENTS;
		var replaceCt = "";
		if (contents != null) {
			if (/<[a-z][\s\S]*>/i.test(contents)) {
				replaceCt += contents;
			} else {
				replaceCt += contents.replace(/\n/g, "<br/>");
			}
		}
		$("#txt_s" + data.list[idx].BBS_SEQ).html(replaceCt);
	}
}

/************************************************************************
 * 함수명 : fn_makeAttachFileIcon
 * 설 명 : 첨부파일이 존재하면 첨부파일 컬럼에 아이콘 생성 (__news_page6)
 * 작성자 : dygo
 ************************************************************************/
function fn_makeAttachFileIcon(data) {
	if (!data || !data.list || !data.list.length) return;
	$(".openY").each(function (i) {
		if (!data.list[i] || !data.list[i].EXISTFILE) return;
		var extIcon = "";
		if (data.list[i].EXISTFILE.EXIST_FILE_YN == "Y") {
			extIcon = "<em class='mSort'>첨부파일</em><span class='hasFile'><em>첨부파일 존재</em></span>";
		} else {
			extIcon = "<em class='mSort'>첨부파일</em>-";
		}
		$(this).find(".attachFile").append(extIcon);
	});
}

/************************************************************************
 * 함수명 : fn_setDefaultShowType
 * 설 명 : 동영상형 목록/썸네일 기본 보기 (__news_page6)
 ************************************************************************/
function fn_setDefaultShowType() {
	if (!$(".thumbnailList").length) return;
	var showType = "B0302";
	if (showType == "B0301") {
		$("ul.listViewType > li").find(".typeTit").addClass("on");
		$("ul.listViewType > li").find(".typeTit").attr("title", "선택됨");
	} else {
		$("ul.listViewType").show();
		$("ul.listViewType > li").find(".typeThumb").addClass("on");
		$("ul.listViewType > li").find(".typeThumb").attr("title", "선택됨");
	}
}

$(document).on("click", "tr.openY td.txtL > a, .thumbnailList div.photo > a, .thumbnailList div.txtL > a", function () {
	var bbs_seq = $(this).data("idno");
	if (!bbs_seq) return;
	$(this).attr("href", "#;");
	$("#sendForm input:hidden[name=BBS_SEQ]").val(bbs_seq);
	fn_comm_ajax({
		url: "/ajaxf/frBoard/bbsChecking.do",
		data: $("#sendForm").serialize(),
		dataType: "json",
		success: function (data) {
			if (data == 0) {
				alert("비밀글입니다.");
			} else if (data == 1) {
				location.href = "/kotranews/cms/board/boardView.do?" + encodeURI($("#sendForm").serialize());
			} else if (data == 2) {
				alert("권한이 없습니다.");
			} else {
				alert("잘못된 접근입니다.");
			}
		}
	});
});

