
$(function(){
	//공통
	$(".board_area .fileArea>ul>li").each(function(){
		var downTitle = $(this).find('a:not(.btn_pdf_priview)').text();
		$(this).find('a:not(.btn_pdf_priview)').attr('title', downTitle);
	});

	$(".board_area td>.hasArea").each(function(){
		if($(this).find('a').length < 1){
			$(this).parent('td').css("padding","0");
		}
	});

	$(".boardOptBox .func .listViewType li>button").click(function(){
		if(!$(this).hasClass('on')){
			$(".boardOptBox .func .listViewType li>button").removeClass('on');
			$(this).addClass('on');
		}
	});

	//faq
	$(".lineList_ul.typeFaq dl>dt>button, .lineList_tb.typeFaq td>button").attr("title", "답변 열기");
	$(document).on('click', '.lineList_ul.typeFaq dl>dt>button', function(){
		if($(this).parent('dt').attr('class') != 'on'){
			$(".lineList_ul.typeFaq dl dt button").attr("title", "답변 열기");
			$(".lineList_ul.typeFaq dl dt").removeClass('on');
			$(".lineList_ul.typeFaq dl dd").removeClass('on').slideUp(200).removeAttr("tabindex");

			$(this).attr("title", "답변 닫기");
			$(this).parent('dt').addClass('on');
			$(this).parent('dt').next().addClass('on').slideDown(200).attr("tabindex","0");
		}else{
			$(".lineList_ul.typeFaq dl dt button").attr("title", "답변 열기");
			$(".lineList_ul.typeFaq dl dt").removeClass('on');
			$(".lineList_ul.typeFaq dl dd").removeClass('on').slideUp(200).removeAttr("tabindex");
		}
	});

	$(document).on('click', '.lineList_tb.typeFaq td>button', function(){
		if(!$(this).parent('td').hasClass('on')){
			$(".lineList_tb.typeFaq td>button").attr("title", "답변 열기");
			$(".lineList_tb.typeFaq td").removeClass('on');
			$(".lineList_tb.typeFaq .typeFaqA>td").removeClass('on');
			$(".lineList_tb.typeFaq .typeFaqA>td .faqA_wrap").slideUp(200).removeAttr("tabindex");

			$(this).attr("title", "답변 닫기");
			$(this).parent('td').addClass('on');
			$(this).parents('tr').next('.typeFaqA').children('td').addClass('on');
			$(this).parents('tr').next('.typeFaqA').find('.faqA_wrap').slideDown(200).attr("tabindex","0");
		}else{
			$(".lineList_tb.typeFaq td>button").attr("title", "답변 열기");
			$(".lineList_tb.typeFaq td").removeClass('on');
			$(".lineList_tb.typeFaq .typeFaqA>td").removeClass('on');
			$(".lineList_tb.typeFaq .typeFaqA>td .faqA_wrap").slideUp(200).removeAttr("tabindex");
		}
	});
	
	// 카드뉴스
	function cardNewsUtilLoc(){
		var cardImgH =  $('.typePhotoView .typeCardNews .photoSoloSlider .unit:nth-child(1) img').innerHeight();

		if(window.innerWidth <= 1280){
			// arrow loc
			$(".typePhotoView .typeCardNews .photoSoloSlider .slick-arrow").css({
				"top" : cardImgH / 2
			});

			// dots loc
			$(".typePhotoView .typeCardNews .photoSoloSlider .slick-dots").css({
				"top" : cardImgH
			});
		}else{
			$(".typePhotoView .typeCardNews .photoSoloSlider .slick-arrow").css({
				"top": ""
			});

			// dots loc
			$(".typePhotoView .typeCardNews .photoSoloSlider .slick-dots").css({
				"top" : ""
			});
		}
	}

	$('.popLayout .popConts .popInner').attr('tabIndex','0');
	
	// 첨부파일 찾아보기 버튼 Focus
	$('.fileArea input[type=file]').on('focus', function () {
		$(this).parent().addClass('focused');
	});
	$('.fileArea input[type=file]').on('blur', function () {
		$(this).parent().removeClass('focused');
	});
	
	$(document).on("click", ".fileArea .btn_fileFind", function(e){
		$(this).siblings('input[type=file]').trigger('click');
	});

	$(window).bind('load resize', function(){
		galleryRate(); 
		cardNewsUtilLoc();
	});

	
});

// thumnail
function galleryRate(){
	if($(".lineList_ul.typeGallery:not(.typeGalleryList)").hasClass('typeCardNews')){
		$(".typeCardNews:not(.typeGalleryList) .photo a>img").css({
			"height": Math.floor($(".typeCardNews .photo a").width() * 1)
		});
	}else if($(".lineList_ul.typeGallery:not(.typeGalleryList)").hasClass('typeBookcover')){
		$(".typeBookcover:not(.typeGalleryList) .photo a>img").css({
			"height": Math.floor($(".typeBookcover .photo a").width() * 1.35)
		});
	}else{
		$(".lineList_ul.typeGallery:not(.typeGalleryList) .photo a>img").css({
			"height": Math.floor($(".lineList_ul.typeGallery:not(.typeGalleryList) .photo a").width() * 0.687)
		});
	}

	//게시판 버튼 title
	$(document).on('click', '.listViewType button', function(){
		$('.listViewType button').attr('title', '');
		$(this).attr('title', '선택됨');
	});
}