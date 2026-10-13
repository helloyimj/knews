/*
 * 진출기업 안내카드 목록(__news_page9).
 * /ajaxf, /ajaxa 서버 경로는 기존 board9.js 와 같다.
 * board_list.js 보다 뒤에 로드해 fn_list / fn_fileDown / fn_linkPage 를 덮어쓴다.
 */
(function (window, $) {
	"use strict";

	/************************************************************************
	 * 함수명 : fn_list
	 * 설 명 : 게시물 리스트 조회
	 * 인 자 :
	 * 작성자 : bvs
	 * 수정일 수정자 수정내용
	 * ------ ------ -------------------
	 * 2021.03.15 bvs 최초생성
	 ************************************************************************/
	window.fn_list = function () {
		if ($("#sendForm input:hidden[name=pageNo]").val() == "") {
			$("#sendForm input:hidden[name=pageNo]").val("1");
		}

		if ($("#sendForm input:hidden[name=recordCountPerPage]").val() == "") {
			$("#sendForm input:hidden[name=recordCountPerPage]").val("10");
		}

		fn_comm_ajax({
			url: "/ajaxf/frInvestment/getAdvncEntpList.do",
			data: $("#sendForm").serialize(),
			dataType: "json",
			success: function (data) {
				if (data != null) {
					fn_comm_setList("#tbody", data, "#listTemplate", "#noListTemplate", "#rowCount", ".pagination");
					if ($("#tbody .typeNoArticle").length > 0) {
						$("#tbody .typeNoArticle > td").prop("colspan", $("#listTable > thead th").length);
					}
				}
			}
		});
	};

	/************************************************************************
	 * 함수명 : fn_linkPage
	 * 설 명 :  페이징
	 * 인 자 :  pageNo(페이지번호)
	 * 작성자 : bvs
	 * 수정일 수정자 수정내용
	 * ------ ------ -------------------
	 * 2021.03.15 bvs 최초생성
	 ************************************************************************/
	window.fn_linkPage = function (pageNo) {
		$("#sendForm [name='pageNo']").val(pageNo);
		fn_list();
	};

	/************************************************************************
	 * 함수명 : fn_fileDown
	 * 설 명 :  첨부파일 다운로드
	 * 인 자 :  obj(파일다운 컨트롤러)
	 * 작성자 : bvs
	 * 수정일 수정자 수정내용
	 * ------ ------ -------------------
	 * 2022.08.29 bvs 최초생성
	 ************************************************************************/
	window.fn_fileDown = function (obj) {
		var pGbnCd = $(obj).data("gbncd");
		if ($(obj).data("filenm") == null) {
			alert("파일이 등록되어 있지 않습니다.");
			return;
		}
		var pUrl = "/ajaxa/fileCpnt/fileDown.do?gbn=i02" + "&pGbnCd=" + pGbnCd;
		var pFilename = $(obj).data("filenm");
		fn_filedown_progress(pUrl, pFilename);
	};

	/************************************************************************
	 함수명 : fn_searchReset
	 설 명 : 검색조건 초기화
	 인 자 :
	 작성자 : [대외경제정보 통합 플랫폼] 포털파트
	 수정일              수정자                                   수정내용
	 ----------  ---------------------   ------------------
	 2021-03-12  [대외경제정보 통합 플랫폼]      최초 생성
	 ************************************************************************/
	window.fn_searchReset = function () {
		$("#sendForm .searchOpt input:text").val("");
	};

	$().ready(function () {
		if (!$(".invest_companyInfo").length && !$(".board_area[data-board-type=invest]").length) return;

		//대륙 선택
		$(document).on("click", "[name=pRegnCd]", function () {
			var ck = "";
			if ("true" == "true") ck = "checked";
			$("#natArea").html("");

			$("#kbcArea").html("");
			$(".kbcArea").css("display", "none");

			var val = $(this).val();

			if (val == "") {
				$(".natArea").css("display", "none");
				return;
			}

			fn_comm_ajax({
				url: "/ajaxf/frNation/getNationCodeList.do",
				data: { cd: val },
				dataType: "json",
				async: false,
				success: function (data) {
					if (null != data) {
						$(".natArea").css("display", "flex");

						var html = "";
						for (var idx = 0; idx < data.length; idx++) {
							ck = "";

							if ("" == data[idx].UN_NAT_CD) {
								ck = "checked";
							}

							html += '<input type="radio" name="pNatCd" id="nat' + data[idx].UN_NAT_CD + '" value="' + data[idx].UN_NAT_CD + '" ' + ck + ">";
							html += '<label style="cursor: pointer;" for="nat' + data[idx].UN_NAT_CD + '">';
							html +=
								'<img src="https://dream.kotra.or.kr/ajaxa/fileCpnt/fileView.do?gbn=c02&natSn=' +
								data[idx].UN_NAT_CD +
								'" style="width: 28px; margin-right: 14px; vertical-align: middle; border-radius: 20px; height: 28px; border: 1px #fff solid;" alt="' +
								data[idx].UNTY_NAT_NAME +
								' 국기">' +
								data[idx].UNTY_NAT_NAME;
							html += "</label>";
						}

						$(html).appendTo($("#natArea"));
					}

					$("#sendForm [name=pageNo]").val("1");
					fn_list();
				}
			});
		});

		//국가 선택
		$(document).on("click", "[name=pNatCd]", function () {
			var ck = "";
			if ("true" == "true") ck = "checked";
			$("#kbcArea").html("");

			var val = $(this).val();

			if (val == "") {
				$(".kbcArea").css("display", "none");
				return;
			}

			fn_comm_ajax({
				url: "/ajaxf/frInvestment/getKbcCodeList.do",
				data: { cd: val },
				dataType: "json",
				async: false,
				success: function (data) {
					if (null != data) {
						$(".kbcArea").css("display", "flex");

						var html = "";
						for (var idx = 0; idx < data.length; idx++) {
							ck = "";

							if ("" == data[idx].UN_NAT_CD) {
								ck = "checked";
							}

							html += '<input type="radio" name="pKbcCd" id="kbc' + data[idx].CMMN_CD + '" value="' + data[idx].CMMN_CD + '" ' + ck + ">";
							html += '<label style="cursor: pointer; margin-right: 10px;" for="kbc' + data[idx].CMMN_CD + '">' + data[idx].CD_NAME + "</label>";
						}

						$(html).appendTo($("#kbcArea"));
					}

					$("#sendForm [name=pageNo]").val("1");
					fn_list();
				}
			});
		});

		//무역관 선택
		$(document).on("click", "[name=pKbcCd]", function () {
			$("#sendForm [name=pageNo]").val("1");
			fn_list();
		});

		//페이지 출력개수
		$(document).on("change", "[name=viewCnt]", function () {
			var cntVal = $(this).val();
			if (cntVal != "") {
				$("#sendForm [name=pageNo]").val("1");
				$("#sendForm [name=recordCountPerPage]").val(cntVal);
				fn_list();
			}
		});

		fn_list();

		$(document).on("click", ".btnC_s", function () {
			if ($("#sendForm input:hidden[name=pageNo]").val() == "") {
				$("#sendForm input:hidden[name=pageNo]").val("1");
			}

			if ($("#sendForm input:hidden[name=recordCountPerPage]").val() == "") {
				$("#sendForm input:hidden[name=recordCountPerPage]").val("10");
			}

			fn_list();
		});
	});
})(window, jQuery);
