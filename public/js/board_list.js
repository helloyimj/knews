(function (window, $) {
	"use strict";

	var BOARD_TYPES = {
		news: {
			listUrl: "/ajaxf/frNews/getKotraBoardList.do",
			noticeUrl: "/ajaxf/frNews/getKotraBoardNoticeList.do",
			detailUrl: "/kotranews/cms/news/actionKotraBoardDetail.do",
			nationUrl: "/ajaxf/frNews/getInNewsNationList.do",
			tradeUrl: "/ajaxf/frNews/getKotraBoardTradeList.do",
			clsfUrl: "/ajaxf/frNews/getKotraBoardClsfCdList.do",
			pageSize: 5
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
		if ($area.data("listUrl")) base.listUrl = $area.data("listUrl");
		if ($area.data("detailUrl")) base.detailUrl = $area.data("detailUrl");
		if ($area.attr("data-attach") === "Y") base.attach = true;
		return base;
	}

	function fn_board_renderPagination(data, selector) {
		var $box = $(selector);
		if (!$box.length) return;

		var current = Math.max(1, Number(data.currentPageNo) || 1);
		var rec = Math.max(1, Number(data.recordCountPerPage) || 10);
		var totalCnt = Number(data.totalRecordCount) || 0;
		var pageSize = Number(data.pageSize) || cfg().pageSize || 5;
		var totalPage = Math.max(1, Math.ceil(totalCnt / rec) || 1);
		var jsFn = data.jsFunction || "fn_linkPage";

		if (!totalCnt) {
			$box.empty();
			return;
		}

		var start = Math.floor((current - 1) / pageSize) * pageSize + 1;
		var end = Math.min(start + pageSize - 1, totalPage);
		var html = [];

		html.push('<div class="num_paging"><span>Page ' + current + "/" + totalPage + "</span></div>");

		if (totalPage > pageSize) {
			html.push(
				'<button type="button" class="btn_first" onclick="' +
					jsFn +
					'(1);" title="첫 페이지로 이동"><span>처음</span></button> '
			);
			html.push(
				'<button type="button" class="btn_prev" onclick="' +
					jsFn +
					"(" +
					(start > 1 ? start - 1 : 1) +
					');" title="이전 5개 목록 페이지로 이동"><span>이전</span></button> '
			);
		}

		html.push('<ul class="paging">');
		for (var i = start; i <= end; i++) {
			if (i === current) {
				html.push('<li><button type="button" class="on" title="선택됨">' + i + "</button></li> ");
			} else {
				html.push(
					'<li><button type="button" onclick="' +
						jsFn +
						"(" +
						i +
						');" title="' +
						i +
						'번 페이지로 이동">' +
						i +
						"</button></li> "
				);
			}
		}
		html.push("</ul>");

		if (totalPage > pageSize) {
			html.push(
				'<button type="button" class="btn_next" onclick="' +
					jsFn +
					"(" +
					(end < totalPage ? start + pageSize : totalPage) +
					');" title="다음 5개 목록 페이지로 이동"><span>다음</span></button> '
			);
			html.push(
				'<button type="button" class="btn_end" onclick="' +
					jsFn +
					"(" +
					totalPage +
					');" title="마지막 페이지로 이동"><span>끝</span></button>'
			);
		}

		$box.html(html.join(""));
	}

	window.fn_board_renderPagination = fn_board_renderPagination;

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
				if (!$("#pagingDummy").length) {
					$('<div id="pagingDummy" style="display:none" aria-hidden="true"></div>').appendTo("body");
				}
				fn_comm_setList("#tbody", data, "#listTemplate", "#noListTemplate", "#rowCount", "#pagingDummy");
				fn_board_renderPagination(data, ".pagination");

				$("#tbody a[data-source]").each(function () {
					fn_setDetailUrl($(this), $(this).attr("data-source"));
				});

				if (option.attach) {
					fn_setAttachList(data.list);
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
						'<img src="/type/common/img/common/file_' +
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

	window.fn_noticeList = function () {
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
		if ($("#noticeArea").length) {
			fn_noticeList();
		}
		fn_list();
	});
})(window, jQuery);
