
/* ============================================================
 * layout_common.js
 * layout.js + inline Script 통합본
 * - 기존 기능/이벤트 삭제 없이 전부 유지
 * - 오타 수정 완료
 * - 역할별 init 함수로 구조화 (React 마이그레이션 시 useEffect 단위 대응 목적)
 * - 공통 영역에서 사용되는 레이아웃 DOM 
 * - 공통 영역에서만 사용되는 init 함수는 layout_common.js에 정의
 * ============================================================ */

/**
 * ============================================================================
 * layout_common.js
 * 공통 레이아웃 제어 및 인터랙션 통합 스크립트
 * ----------------------------------------------------------------------------
 * [개요]
 * - 기존 `layout.js`와 HTML 내부 인라인 스크립트를 하나로 통합한 파일입니다.
 * - 기존 기능 및 이벤트 핸들러의 누락 없이 100% 온전하게 보존하였습니다.
 * - 발견된 오타 및 잠재적 오류를 수정하여 안정성을 확보했습니다.
 * 
 * [아키텍처 및 구조 특징]
 * - 역할별 `init` 함수 패턴으로 구조화하여 코드의 응집도와 가독성을 높였습니다.
 * - 추후 React 등 모던 프론트엔드로 마이그레이션할 때, 컴포넌트별 
 *   `useEffect` 단위로 쉽게 쪼개어 대응할 수 있도록 모듈식으로 설계되었습니다.
 * 
 * [사용 범위]
 * - 전역 공통 영역(Header, Footer, GNB 등)에서 공통으로 사용되는 레이아웃 DOM 제어
 * - 공통 영역 전용 초기화 함수들을 본 파일 내에서 정의 및 관리
 * 
 * [기타]
 * - 기존 `layout.js`와 HTML 내부 인라인 스크립트의 기능을 모두 포함하고 있으므로,
 *  중복 로딩을 방지하기 위해 기존 파일들은 제거하고 본 파일만 로드하도록 권장합니다.
 *    
 * - 경로오류를 방지하기 위해, 임시로 루트 설정을 URL 상에서 `https://dream.kotra.or.kr`로 고정하였습니다.
 * ============================================================================
 */

/* ============================================================
 * 추가 
 * layout.js + inline Script 통합본
 * - slickSnbBookmark snb_board 하단에 있는 snb 가 시장뉴스 사이트에서는 pnb로 이룸이 변경되어있는것같고. snb 관련 태그 작성되어있는것이없음!
 * - 
 * - 
 * - 
 * - 
 * - 
 * - 
 * - 
 * ============================================================ */
// 



$(document).ready(function () {

  // 1. DOM 삽입 (헤더 / 사이트맵 / pnb / 푸터 / top버튼)
  initCommonLayout();

  // 2. gnb 깊이 변수 - 전역으로 명시적 선언 (layout.js에서 참조)
  // var gnbDep1 = 0;
  // var gnbDep2 = 0;
  // var gnbDep3 = 0;
  // 임시 전역 선언
  window.gnbDep1 = 0;
  window.gnbDep2 = 0;
  window.gnbDep3 = 0;

  // 2-1. MENU_ID / gnb on 기준으로 현재 메뉴 표시
  applyGnbCurrentByMenuId();

  // 3. 상단 공지 슬라이더 (inline Script)
  initTopNotice();

  // 4. gnb href 위임 클릭 처리 (inline Script)
  initGnbHrefDelegate();

  // 5. gnbDep1/2/3 계산 + 검색/로그인/로그아웃 등 헤더 유틸 (inline Script)
  initHeaderUtil();

  // 6. 사이트맵 (inline Script)
  initSitemap();

  // 7. SNS 공유 / 카카오 / 북마크 / 프린트 / URL복사 (inline Script)
  initSnsShare();

  // 8. SNS 보드 슬릭 (inline Script)
  initSnsBoardSlick();

  // 9. 푸터 배너 슬릭 (inline Script)
  initFooterBannerSlick();

  // ---- 여기부터 layout.js  ----

  // 10. 상단 KOTRA 내부사이트 토글 버튼 (layout.js)
  initKotraSiteToggle();

  // 11. gnb 현재 메뉴 on 클래스 세팅 (layout.js)
  initGnbCurrentState();

  // 11-1. gnb on 경로를 pnb(브레드크럼) 텍스트/목록으로 치환
  initPnbFromGnb();

  // 12. gnb 마우스오버/호버 (PC) (layout.js)
  initGnbHover();

  // 13. 모바일 gnb 메뉴 동작 (layout.js)
  initMobileGnb();

  // 14. Footer top버튼 / 폰트사이즈 / familySite (layout.js)
  initFooterExtras();

  // 15. 스크롤 이벤트 (sticky, top버튼 노출) (layout.js)
  initScrollHandler();

  // 16. pnb / snb 옵션박스 동작 (layout.js)
  initPnbOptions();

  // 17. 상단 사이트맵 팝업 열기/닫기 (layout.js, initSitemap과는 별도 - pnb류 팝업 오픈 트리거)
  initSitemapPopupTrigger();

  // 18. 탭 너비 계산 / 모바일 탭 슬라이드 (layout.js)
  initTabResize();

  // 19. 화면 회전 시 새로고침 (layout.js)
  initOrientationReload();

  // 20. 접근성 (skip menu, 키보드 포커스 이동) (layout.js)
  initAccessibility();

  // 21. 모바일 접근성 (load/resize 시 tabindex 재설정) (layout.js)
  initMobileAccessibility();

  // 22. As-is 탑배너 팝업 (layout.js)
  initTopBannerPopup();

});


/* ============================================================
 * 1. DOM 주입 (inline Script)
 * ============================================================ */
function initCommonLayout() {

  // 스킵 메뉴
  $('body.typeSub').prepend(`
    <div id="skip_menu">
      <a href="#contents">본문 바로가기</a>
      <a href="#header">주메뉴 바로가기</a>
      <a href="#footer">푸터 바로가기</a>
    </div>
    <div id="dim"></div>
    <div id="gnb_dim"></div>
        `);

  // 헤더
  $('#header').html(`
    <header>
    <h1 class="logo">
      <a href="https://dream.kotra.or.kr/kotranews/index.do">
        <img src="https://dream.kotra.or.kr/ajaxa/fileCpnt/fileView.do?gbn=x01&SITE_GROUP_NO=2&SITE_NO=3" alt="KOTRA 해외시장뉴스" />
      </a>
    </h1>
    <button type="button" title="전체메뉴" class="mBtn_topMenu">전체메뉴</button>
    <!-- 모바일 전용 -->
    <div class="top_util">
      <a href="javascript:void(0);" class="btn_topLogin" title="로그인"><span>로그인</span></a>
      <a href="https://www.kotra.or.kr/kp/cmm/mber/sbscrb/selectSbscrbUsrTy.do" class="btn_join" title="회원가입"><span>회원가입</span></a>

      <div class="new_header_19">
        <div class="clearfix">
          <div class="fL">
            <a href="https://www.kotra.or.kr/kp/kotra/cmm/sso/loginBySSO.do?div=kp" target="_blank" title="새 창 열림">
              <img src="https://dream.kotra.or.kr/type/common/img/common/logo_t_06_s.png" alt="KOTRA 지원안내" />
            </a>
            <a href="https://www.buykorea.or.kr/" target="_blank" title="새 창 열림" class="btn_s">
              <img src="https://dream.kotra.or.kr/type/news/img/layout/logo_t_07_s.png" alt="바이코리아(Seller)" title="바이코리아(Seller)" />
            </a>
            <a href="https://www.investkorea.org/" target="_blank" title="새 창 열림" class="btn_s">
              <img src="https://dream.kotra.or.kr/type/news/img/layout/logo_t_05_s.png" alt="Inverst KOREA" title="Inverst KOREA" />
            </a>
            <button type="button" class="btn_more"><span>사이트 더보기</span></button>
          </div>
        </div>
        <div class="pop_home" style="display: none">
          <div class="home_box">
            <div>
              <h3>KOTRA 사이트</h3>
              <p>
                <a href="https://dream.kotra.or.kr/kp/kotraSsoUrl.do" target="_blank" class="btn_s" style="display: inline-block" title="새 창 열림">
                  <img src="https://dream.kotra.or.kr/type/common/img/common/more_siteLogo12.png" alt="KOTRA 무역투자24" title="KOTRA 무역투자24" />
                </a>
                <a href="https://dream.kotra.or.kr/kp/kotraSsoUrl.do" target="_blank" class="btn_o" style="display: none">
                  <strong>KOTRA 무역투자24</strong>
                </a>
              </p>
              <p>
                <a href="https://dream.kotra.or.kr/dream/index.do" target="_blank" class="btn_s" title="새 창 열림">
                  <img src="https://dream.kotra.or.kr/type/news/img/layout/logo_t_12.png" alt="해외경제정보드림" title="해외경제정보드림" />
                </a>
                <a href="https://dream.kotra.or.kr/dream/index.do" target="_blank" class="btn_o" style="display: none">
                  <strong>해외경제정보드림</strong>
                </a>
              </p>
              <p>
                <a href="https://www.exportvoucher.com" target="_blank" class="btn_s" title="새 창 열림">
                  <img src="https://dream.kotra.or.kr/type/news/img/layout/logo_t_03.png" alt="수출지원기반 활용사업" title="수출지원기반 활용사업" />
                </a>
                <a href="https://www.exportvoucher.com" target="_blank" class="btn_o" style="display: none">
                  <strong>수출바우처 · 지사화</strong>
                </a>
              </p>
              <p class="">
                <a href="https://dream.kotra.or.kr/ob/kotraSsoUrl.do" target="_blank" class="btn_s" title="새 창 열림" style="">
                  <img src="https://dream.kotra.or.kr/type/news/img/layout/logo_t_04.png" alt="옴부즈만" title="옴부즈만" />
                </a>
                <a href="https://dream.kotra.or.kr/ob/kotraSsoUrl.do" target="_blank" class="btn_o" style="display: none">
                  <strong>외투기업고충처리</strong>
                </a>
              </p>
              <p class="">
                <a href="https://dream.kotra.or.kr/iv/kotraSsoUrl.do" target="_blank" class="btn_s" title="새 창 열림" style="">
                  <img src="https://dream.kotra.or.kr/type/news/img/layout/logo_t_05.png" alt="Inverst KOREA" title="Inverst KOREA" />
                </a>
                <a href="https://dream.kotra.or.kr/iv/kotraSsoUrl.do" target="_blank" class="btn_o" style="display: none">
                  <strong>투자유치정보제공</strong>
                </a>
              </p>
              <p class="">
                <a href="https://dream.kotra.or.kr/ge/kotraSsoUrl.do" target="_blank" class="btn_s" style="display: inline-block" title="새 창 열림">
                  <img src="https://dream.kotra.or.kr/type/news/img/layout/logo_t_06.png" alt="글로벌 전시포털" title="글로벌 전시포털" />
                </a>
                <a href="https://dream.kotra.or.kr/ge/kotraSsoUrl.do" target="_blank" class="btn_o" style="display: none">
                  <strong>국내 · 해외전시정보</strong>
                </a>
              </p>
              <p class="">
                <a href="https://dream.kotra.or.kr/bk/kotraSsoUrl.do" target="_blank" class="btn_s" title="새 창 열림" style="">
                  <img src="https://dream.kotra.or.kr/type/news/img/layout/logo_t_07.png" alt="바이코리아(Seller)" title="바이코리아(Seller)" />
                </a>
                <a href="https://dream.kotra.or.kr/bk/kotraSsoUrl.do" target="_blank" class="btn_o" style="display: none">
                  <strong>수출지원 온라인 플랫폼</strong>
                </a>
              </p>
              <p class="">
                <a href="https://dream.kotra.or.kr/gw/kotraSsoUrl.do" target="_blank" class="btn_s" title="새 창 열림" style="">
                  <img src="https://dream.kotra.or.kr/type/news/img/layout/logo_t_08.png" alt="경제외교 활용포털" title="경제외교 활용포털" />
                </a>
                <a href="https://dream.kotra.or.kr/gw/kotraSsoUrl.do" target="_blank" class="btn_o" style="display: none">
                  <strong>경제외교 활용포털</strong>
                </a>
              </p>
              <p class="">
                <a href="https://www.kotra.or.kr/gtc_kor/index.do" target="_blank" class="btn_s" title="새 창 열림" style="">
                  <img src="https://dream.kotra.or.kr/type/news/img/layout/logo_t_09.png" alt="Contract KOREA" title="Contract KOREA" />
                </a>
                <a href="https://www.kotra.or.kr/gtc_kor/index.do" target="_blank" class="btn_o" style="display: none">
                  <strong>해외전문인력유치센터</strong>
                </a>
              </p>
              <p class="">
                <a href="https://dream.kotra.or.kr/kd/kotraSsoUrl.do" target="_blank" class="btn_s" title="새 창 열림" style="">
                  <img src="https://dream.kotra.or.kr/type/news/img/layout/logo_t_10.png" alt="Kodits" title="Kodits" />
                </a>
                <a href="https://dream.kotra.or.kr/kd/kotraSsoUrl.do" target="_blank" class="btn_o" style="display: none">
                  <strong>방산물자교역지원센터</strong>
                </a>
              </p>
              <p class="">
                <a href="https://dream.kotra.or.kr/bd/kotraSsoUrl.do" target="_blank" class="btn_s" title="새 창 열림" style="">
                  <img src="https://dream.kotra.or.kr/type/news/img/layout/logo_t_13.png" alt="무역투자빅데이터" title="무역투자빅데이터" />
                </a>
                <a href="https://dream.kotra.or.kr/bd/kotraSsoUrl.do" target="_blank" class="btn_o" style="display: none">
                  <strong>무역투자빅데이터</strong>
                </a>
              </p>
            </div>
            <button type="button" class="btn_close"><span>닫기</span></button>
          </div>
        </div>
      </div>
      <a href="https://dream.kotra.or.kr/dream/index.do" class="btn_goDream" target="_blank" title="해외경제정보드림 새창 이동"><span>해외경제정보드림</span></a>
    </div>

    <nav>
      <ul id="gnb">
        <li class="child">
          <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=10" title="뉴스 현재창  이동" data-sub="Y" target="_self" class="10">뉴스</a>
          <p class="gnbTit">
            <b>뉴스</b>
            <span></span>
          </p>

          <ul class="menuM">
            <li class="emptyArea">
              <p class="exclam Orange">좌측 메뉴를 클릭하시면 상세 메뉴정보를 확인하실 수 있습니다.</p>
            </li>
            <li class="">
              <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=70" class="70" title="전체 현재창  이동" data-sub="N" target="_self">전체</a>
            </li>
            <li class="">
              <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=80" class="80" title="경제∙무역 현재창  이동" data-sub="N" target="_self">경제∙무역</a>
            </li>
            <li class="">
              <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=90" class="90" title="통상∙규제 현재창  이동" data-sub="N" target="_self">통상∙규제</a>
            </li>
            <li class="">
              <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=100" class="100" title="투자진출 현재창  이동" data-sub="N" target="_self">투자진출</a>
            </li>
            <li class="">
              <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=110" class="110" title="현장∙인터뷰 현재창  이동" data-sub="N" target="_self">현장∙인터뷰</a>
            </li>
            <li class="child">
              <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1480" class="1480" title="기고 현재창  이동" data-sub="Y" target="_self">기고</a>
              <ul class="menuS">
                <li class="">
                  <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=130" class="130" title="" data-sub="N" target="_self">전문가기고</a>
                </li>
                <li class="">
                  <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=140" class="140" title="" data-sub="N" target="_self">직원기고</a>
                </li>
              </ul>
            </li>
            <li class="">
              <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=290" class="290" title="글로벌 이슈 모니터링 현재창  이동" data-sub="N" target="_self">글로벌 이슈 모니터링</a>
            </li>
            <li class="child">
              <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1550" class="1550" title="글로벌 공급망 동향 현재창  이동" data-sub="Y" target="_self">글로벌 공급망 동향</a>
              <ul class="menuS">
                <li class="">
                  <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1360" class="1360" title="" data-sub="N" target="_self">동향뉴스</a>
                </li>
                <li class="">
                  <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1560" class="1560" title="" data-sub="N" target="_self">글로벌 공급망 인사이트</a>
                </li>
              </ul>
            </li>
            <li class="child">
              <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1500" class="1500" title="글로벌 ESG 정보 현재창  이동" data-sub="Y" target="_self">글로벌 ESG 정보</a>
              <ul class="menuS">
                <li class="">
                  <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1520" class="1520" title="" data-sub="N" target="_self">동향뉴스</a>
                </li>
                <li class="">
                  <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1510" class="1510" title="" data-sub="N" target="_self">연관 보고서</a>
                </li>
                <li class="">
                  <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1570" class="1570" title="" data-sub="N" target="_self">ESG 활용지원센터</a>
                </li>
              </ul>
            </li>
            <li class="">
              <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1580" class="1580" title="미국 통상정책 주요 동향 현재창  이동" data-sub="N" target="_self">미국 통상정책 주요 동향</a>
            </li>
            <li class="child">
              <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1470" class="1470" title="핫클립 현재창  이동" data-sub="Y" target="_self">핫클립</a>
              <ul class="menuS">
                <li class="">
                  <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1590" class="1590" title="" data-sub="N" target="_self">우크라이나 사태 해외동향</a>
                </li>
                <li class="">
                  <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1490" class="1490" title="" data-sub="N" target="_self">중동 관련 주요 동향</a>
                </li>
                <li class="">
                  <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1460" class="1460" title="" data-sub="N" target="_self">지금 수출 현장은</a>
                </li>
                <li class="">
                  <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=120" class="120" title="" data-sub="N" target="_self">기획리포트</a>
                </li>
                <li class="">
                  <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=150" class="150" title="" data-sub="N" target="_self">일자리동향</a>
                </li>
              </ul>
            </li>
            <li class="">
              <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1630" class="1630" title="산업뉴스콕콕 현재창  이동" data-sub="Y" target="_self">산업뉴스콕콕</a>
            </li>
          </ul>
        </li>

        <li class="child">
          <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=20" title="상품·산업 현재창  이동" data-sub="Y" target="_self" class="20">상품·산업</a>
          <p class="gnbTit"><b>상품·산업</b><span></span></p>
          <ul class="menuM">
            <li class="emptyArea"><p class="exclam Orange">좌측 메뉴를 클릭하시면 상세 메뉴정보를 확인하실 수 있습니다.</p></li>
            <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=170" class="170" title="전체 현재창  이동" data-sub="N" target="_self">전체</a></li>
            <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=180" class="180" title="트렌드 현재창  이동" data-sub="N" target="_self">트렌드</a></li>
            <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=190" class="190" title="상품DB 현재창  이동" data-sub="N" target="_self">상품DB</a></li>
            <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=200" class="200" title="국별주요산업 현재창  이동" data-sub="N" target="_self">국별주요산업</a></li>
            <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=210" class="210" title="해외인증정보 현재창  이동" data-sub="N" target="_self">해외인증정보</a></li>
          </ul>
        </li>

        <li class="child">
          <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=30" title="국가·지역정보 현재창  이동" data-sub="Y" target="_self" class="30">국가·지역정보</a>
          <p class="gnbTit"><b>국가·지역정보</b><span></span></p>
          <ul class="menuM">
            <li class="emptyArea"><p class="exclam Orange">좌측 메뉴를 클릭하시면 상세 메뉴정보를 확인하실 수 있습니다.</p></li>
            <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=220" class="220" title="국가지역정보 현재창  이동" data-sub="N" target="_self">국가지역정보</a></li>
            <li class="child">
              <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=240" class="240" title="북한정보 현재창  이동" data-sub="Y" target="_self">북한정보</a>
              <ul class="menuS">
                <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=520" class="520" title="" data-sub="N" target="_self">북한정보</a></li>
                <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=530" class="530" title="" data-sub="N" target="_self">북한대외무역동향</a></li>
              </ul>
            </li>
            <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=250" class="250" title="진출전략 현재창  이동" data-sub="N" target="_self">진출전략</a></li>
            <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=260" class="260" title="출장자료 현재창  이동" data-sub="N" target="_self">출장자료</a></li>
            <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=270" class="270" title="무역관뉴스레터 현재창  이동" data-sub="N" target="_self">무역관뉴스레터</a></li>
          </ul>
        </li>

        <li class="child">
          <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=40" title="보고서 현재창  이동" data-sub="Y" target="_self" class="40">보고서</a>
          <p class="gnbTit"><b>보고서</b><span></span></p>
          <ul class="menuM">
            <li class="emptyArea"><p class="exclam Orange">좌측 메뉴를 클릭하시면 상세 메뉴정보를 확인하실 수 있습니다.</p></li>
            <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=280" class="280" title="전체 현재창  이동" data-sub="N" target="_self">전체</a></li>
          </ul>
        </li>

        <li class="child">
          <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=50" title="멀티미디어뉴스 현재창  이동" data-sub="Y" target="_self" class="50">멀티미디어뉴스</a>
          <p class="gnbTit"><b>멀티미디어뉴스</b><span></span></p>
          <ul class="menuM">
            <li class="emptyArea"><p class="exclam Orange">좌측 메뉴를 클릭하시면 상세 메뉴정보를 확인하실 수 있습니다.</p></li>
            <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=540" class="540" title="동영상뉴스 현재창  이동" data-sub="N" target="_self">동영상뉴스</a></li>
            <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=310" class="310" title="포토뉴스 현재창  이동" data-sub="N" target="_self">포토뉴스</a></li>
            <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=320" class="320" title="카드뉴스 현재창  이동" data-sub="N" target="_self">카드뉴스</a></li>
          </ul>
        </li>

        <li class="child">
          <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=60" title="해외투자 현재창  이동" data-sub="Y" target="_self" class="60">해외투자</a>
          <p class="gnbTit"><b>해외투자</b><span></span></p>
          <ul class="menuM">
            <li class="emptyArea"><p class="exclam Orange">좌측 메뉴를 클릭하시면 상세 메뉴정보를 확인하실 수 있습니다.</p></li>
            <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=350" class="350" title="해외투자안내 현재창  이동" data-sub="N" target="_self">해외투자안내</a></li>
            <li class="child">
              <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=360" class="360" title="직접투자절차 현재창  이동" data-sub="Y" target="_self">직접투자절차</a>
              <ul class="menuS">
                <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=570" class="570" title="" data-sub="N" target="_self">해외투자준비</a></li>
                <li class=""><a href="https://www.investkorea.org/ik-kr/cntnts/i-237/web.do" class="590" title="새창열림" data-sub="N" target="_blank">청산·국내복귀</a></li>
                <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=600" class="600" title="" data-sub="N" target="_self">FAQ</a></li>
              </ul>
            </li>
            <li class="child">
              <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=370" class="370" title="국별참고자료 현재창  이동" data-sub="Y" target="_self">국별참고자료</a>
              <ul class="menuS">
                <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=610" class="610" title="" data-sub="N" target="_self">법규&middot;서식</a></li>
                <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=620" class="620" title="" data-sub="N" target="_self">진출기업지원세미나자료</a></li>
              </ul>
            </li>
            <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1350" class="1350" title="진출기업정보 현재창  이동" data-sub="N" target="_self">진출기업정보</a></li>
          </ul>
        </li>

        <li class="child" style="display: none">
          <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=400" title="열린마당 현재창  이동" data-sub="Y" target="_self" class="400">열린마당</a>
          <p class="gnbTit"><b>열린마당</b><span></span></p>
          <ul class="menuM">
            <li class="emptyArea"><p class="exclam Orange">좌측 메뉴를 클릭하시면 상세 메뉴정보를 확인하실 수 있습니다.</p></li>
            <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1310" class="1310" title="공지사항 현재창  이동" data-sub="Y" target="_self">공지사항</a></li>
            <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1320" class="1320" title="고객조사제안  현재창  이동" data-sub="Y" target="_self">고객조사제안 </a></li>
            <li class="" style="display: none"><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=670" class="670" title="뉴스레터신청 현재창  이동" data-sub="Y" target="_self">뉴스레터신청</a></li>
            <li class="child">
              <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1340" class="1340" title="고객문의 현재창  이동" data-sub="Y" target="_self">고객문의</a>
              <ul class="menuS">
                <li class="" style="display: none"><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=640" class="640" title="" data-sub="Y" target="_self">고객문의</a></li>
              </ul>
            </li>
            <li class="child">
              <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=680" class="680" title="사이트이용 현재창  이동" data-sub="Y" target="_self">사이트이용</a>
              <ul class="menuS">
                <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=710" class="710" title="" data-sub="Y" target="_self">API</a></li>
                <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=720" class="720" title="" data-sub="Y" target="_self">RSS2.0</a></li>
                <li class="" style="display: none"><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=750" class="750" title="" data-sub="Y" target="_self">뷰어다운로드</a></li>
              </ul>
            </li>
            <li class="child">
              <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=730" class="730" title="정책∙방침 현재창  이동" data-sub="Y" target="_self">정책∙방침</a>
              <ul class="menuS">
                <li class="" style="display: none"><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1010" class="1010" title="" data-sub="Y" target="_self">저작권정책</a></li>
                <li class="">
                  <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1400" class="1400" title="" data-sub="Y" target="_self">개인정보처리방침</a>
                  <ul class="menuX" style="display: none">
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1430" class="1430" title="" target="_self">개인정보처리방침</a></li>
                    <li class="" style="display: none"><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1020" class="1020" title="" target="_self">개인정보처리방침(2022.05.16)</a></li>
                    <li class="" style="display: none"><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1410" class="1410" title="" target="_self">개인정보처리방침(2021.07.07)</a></li>
                  </ul>
                </li>
                <li class="" style="display: none"><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1030" class="1030" title="" data-sub="Y" target="_self">공공데이터개방</a></li>
              </ul>
            </li>
          </ul>
        </li>

        <li class="" style="display: none">
          <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=770" title="로그인 현재창  이동" data-sub="Y" target="_self" class="770">로그인</a>
          <p class="gnbTit"><b>로그인</b><span></span></p>
        </li>
      </ul>
    </nav>

    <div class="gnb_util">
      <fieldset class="totalSearchArea">
        <legend>메뉴검색</legend>
        <div class="search_opt">
          <button type="button" title="검색어를 입력하세요" class="btn_searchOpt" name="tDiv" value="ALL">통합검색</button>
          <ul>
            <li><button type="button" value="ALL" title="통합검색">통합검색</button></li>
            <li><button type="button" value="TITLE" title="제목">제목</button></li>
            <li><button type="button" value="CONT" title="내용">내용</button></li>
          </ul>
        </div>
        <input type="text" title="검색어입력" class="search_inp" onkeyup="fn_enterkey()" />
        <button type="button" class="btn_search" title="검색"><span>검색</span></button>
      </fieldset>
      <button type="button" class="btn_sitemap" title="사이트맵"><span>사이트맵</span></button>
    </div>

    <button type="button" title="메뉴 닫기" class="mBtn_close">메뉴 닫기</button>
    <!-- 모바일 전용 -->
  </header>
  `);

  // 사이트맵
  $('section.sitemapBox').html(`
    <div class="sitemap_wrap">
      <h2 class="box_tit">사이트맵</h2>
      <div class="box_ct">
        <ul class="map_gnb">
          <li><a href="#" title="뉴스" class="on">뉴스</a></li>
          <li><a href="#" title="상품·산업">상품·산업</a></li>
          <li><a href="#" title="국가·지역정보">국가·지역정보</a></li>
          <li><a href="#" title="보고서">보고서</a></li>
          <li><a href="#" title="멀티미디어뉴스">멀티미디어뉴스</a></li>
          <li><a href="#" title="해외투자">해외투자</a></li>
          <li style="display: none"><a href="#" title="열린마당">열린마당</a></li>
          <li style="display: none"><a href="#" title="로그인">로그인</a></li>
        </ul>
        <div class="map_nav">
          <ul id="sitemap">
            <li class="child">
              <h3 class="txtHidden">뉴스</h3>
              <ul class="menuM menuStep">
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=70" title="전체 현재창  이동" data-sub="N" target="_self">전체</a></li>
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=80" title="경제∙무역 현재창  이동" data-sub="N" target="_self">경제∙무역</a></li>
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=90" title="통상∙규제 현재창  이동" data-sub="N" target="_self">통상∙규제</a></li>
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=100" title="투자진출 현재창  이동" data-sub="N" target="_self">투자진출</a></li>
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=110" title="현장∙인터뷰 현재창  이동" data-sub="N" target="_self">현장∙인터뷰</a></li>
                <li class="child">
                  <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1480" title="기고 현재창  이동" data-sub="Y" target="_self">기고</a>
                  <ul class="menuS">
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=130" title="" data-sub="N" target="_self">전문가기고</a></li>
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=140" title="" data-sub="N" target="_self">직원기고</a></li>
                  </ul>
                </li>
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=290" title="글로벌 이슈 모니터링 현재창  이동" data-sub="N" target="_self">글로벌 이슈 모니터링</a></li>
                <li class="child">
                  <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1550" title="글로벌 공급망 동향 현재창  이동" data-sub="Y" target="_self">글로벌 공급망 동향</a>
                  <ul class="menuS">
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1360" title="" data-sub="N" target="_self">동향뉴스</a></li>
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1560" title="" data-sub="N" target="_self">글로벌 공급망 인사이트</a></li>
                  </ul>
                </li>
                <li class="child">
                  <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1500" title="글로벌 ESG 정보 현재창  이동" data-sub="Y" target="_self">글로벌 ESG 정보</a>
                  <ul class="menuS">
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1520" title="" data-sub="N" target="_self">동향뉴스</a></li>
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1510" title="" data-sub="N" target="_self">연관 보고서</a></li>
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1570" title="" data-sub="N" target="_self">ESG 활용지원센터</a></li>
                  </ul>
                </li>
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1580" title="미국 통상정책 주요 동향 현재창  이동" data-sub="N" target="_self">미국 통상정책 주요 동향</a></li>
                <li class="child">
                  <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1470" title="핫클립 현재창  이동" data-sub="Y" target="_self">핫클립</a>
                  <ul class="menuS">
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1590" title="" data-sub="N" target="_self">우크라이나 사태 해외동향</a></li>
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1490" title="" data-sub="N" target="_self">중동 관련 주요 동향</a></li>
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1460" title="" data-sub="N" target="_self">지금 수출 현장은</a></li>
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=120" title="" data-sub="N" target="_self">기획리포트</a></li>
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=150" title="" data-sub="N" target="_self">일자리동향</a></li>
                  </ul>
                </li>
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1630" title="산업뉴스콕콕 현재창  이동" data-sub="Y" target="_self">산업뉴스콕콕</a></li>
              </ul>
            </li>
            <li class="child">
              <h3 class="txtHidden">상품·산업</h3>
              <ul class="menuM menuStep">
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=170" title="전체 현재창  이동" data-sub="N" target="_self">전체</a></li>
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=180" title="트렌드 현재창  이동" data-sub="N" target="_self">트렌드</a></li>
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=190" title="상품DB 현재창  이동" data-sub="N" target="_self">상품DB</a></li>
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=200" title="국별주요산업 현재창  이동" data-sub="N" target="_self">국별주요산업</a></li>
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=210" title="해외인증정보 현재창  이동" data-sub="N" target="_self">해외인증정보</a></li>
              </ul>
            </li>
            <li class="child">
              <h3 class="txtHidden">국가·지역정보</h3>
              <ul class="menuM menuStep">
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=220" title="국가지역정보 현재창  이동" data-sub="N" target="_self">국가지역정보</a></li>
                <li class="child">
                  <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=240" title="북한정보 현재창  이동" data-sub="Y" target="_self">북한정보</a>
                  <ul class="menuS">
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=520" title="" data-sub="N" target="_self">북한정보</a></li>
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=530" title="" data-sub="N" target="_self">북한대외무역동향</a></li>
                  </ul>
                </li>
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=250" title="진출전략 현재창  이동" data-sub="N" target="_self">진출전략</a></li>
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=260" title="출장자료 현재창  이동" data-sub="N" target="_self">출장자료</a></li>
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=270" title="무역관뉴스레터 현재창  이동" data-sub="N" target="_self">무역관뉴스레터</a></li>
              </ul>
            </li>
            <li class="child">
              <h3 class="txtHidden">보고서</h3>
              <ul class="menuM menuStep">
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=280" title="전체 현재창  이동" data-sub="N" target="_self">전체</a></li>
              </ul>
            </li>
            <li class="child">
              <h3 class="txtHidden">멀티미디어뉴스</h3>
              <ul class="menuM menuStep">
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=540" title="동영상뉴스 현재창  이동" data-sub="N" target="_self">동영상뉴스</a></li>
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=310" title="포토뉴스 현재창  이동" data-sub="N" target="_self">포토뉴스</a></li>
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=320" title="카드뉴스 현재창  이동" data-sub="N" target="_self">카드뉴스</a></li>
              </ul>
            </li>
            <li class="child">
              <h3 class="txtHidden">해외투자</h3>
              <ul class="menuM menuStep">
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=350" title="해외투자안내 현재창  이동" data-sub="N" target="_self">해외투자안내</a></li>
                <li class="child">
                  <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=360" title="직접투자절차 현재창  이동" data-sub="Y" target="_self">직접투자절차</a>
                  <ul class="menuS">
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=570" title="" data-sub="N" target="_self">해외투자준비</a></li>
                    <li class=""><a href="https://www.investkorea.org/ik-kr/cntnts/i-237/web.do" title="새창열림" data-sub="N" target="_blank">청산·국내복귀</a></li>
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=600" title="" data-sub="N" target="_self">FAQ</a></li>
                  </ul>
                </li>
                <li class="child">
                  <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=370" title="국별참고자료 현재창  이동" data-sub="Y" target="_self">국별참고자료</a>
                  <ul class="menuS">
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=610" title="" data-sub="N" target="_self">법규&middot;서식</a></li>
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=620" title="" data-sub="N" target="_self">진출기업지원세미나자료</a></li>
                  </ul>
                </li>
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1350" title="진출기업정보 현재창  이동" data-sub="N" target="_self">진출기업정보</a></li>
              </ul>
            </li>
            <li class="child">
              <h3 class="txtHidden">열린마당</h3>
              <ul class="menuM menuStep">
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1310" title="공지사항 현재창  이동" data-sub="Y" target="_self">공지사항</a></li>
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1320" title="고객조사제안  현재창  이동" data-sub="Y" target="_self">고객조사제안 </a></li>
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=670" title="뉴스레터신청 현재창  이동" data-sub="Y" target="_self">뉴스레터신청</a></li>
                <li class="child">
                  <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1340" title="고객문의 현재창  이동" data-sub="Y" target="_self">고객문의</a>
                  <ul class="menuS">
                    <li class="" style="display: none"><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=640" title="" data-sub="Y" target="_self">고객문의</a></li>
                  </ul>
                </li>
                <li class="child">
                  <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=680" title="사이트이용 현재창  이동" data-sub="Y" target="_self">사이트이용</a>
                  <ul class="menuS">
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=710" title="" data-sub="Y" target="_self">API</a></li>
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=720" title="" data-sub="Y" target="_self">RSS2.0</a></li>
                    <li class="" style="display: none"><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=750" title="" data-sub="Y" target="_self">뷰어다운로드</a></li>
                  </ul>
                </li>
                <li class="child">
                  <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=730" title="정책∙방침 현재창  이동" data-sub="Y" target="_self">정책∙방침</a>
                  <ul class="menuS">
                    <li class="" style="display: none"><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1010" title="" data-sub="Y" target="_self">저작권정책</a></li>
                    <li class="">
                      <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1400" title="" data-sub="Y" target="_self">개인정보처리방침</a>
                      <ul class="menuSS">
                        <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1430" title="" target="_self">개인정보처리방침</a></li>
                        <li class="" style="display: none"><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1020" title="" target="_self">개인정보처리방침(2022.05.16)</a></li>
                        <li class="" style="display: none"><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1410" title="" target="_self">개인정보처리방침(2021.07.07)</a></li>
                      </ul>
                    </li>
                    <li class="" style="display: none"><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1030" title="" data-sub="Y" target="_self">공공데이터개방</a></li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div class="map_func"></div>
      </div>
      <button type="button" class="btn_close">닫기</button>
    </div>
  `);

  // 브레드크럼: 메뉴명/목록은 initPnbFromGnb() 가 현재 MENU_ID 기준으로 채움
  $('#container #contents #pnb').html(`
          <div class="pnb_nav">
            <a href="https://dream.kotra.or.kr/kotranews/index.do" class="btn_home" title="홈 화면 이동" target="_self"><span class="txtHidden">홈</span></a>
            <ul></ul>
          </div>
          <div class="pnb_menu">
            <div class="pnbList">
              <div class="menu">
                <button type="button" class="btnTit" title="열기"></button>
                <ul></ul>
              </div>
            </div>
          </div>
          <div class="pnb_func">
            <button type="button" class="btn_print" title="프린트">프린트</button>
            <button type="button" class="btn_share" title="공유하기">공유</button>
            <div class="shareBox">
              <div class="shareBox_wrap">
                <strong>공유하기</strong>
                <ul>
                  <li><a href="javascript:void(0);" class="btn_facebook" onclick="shareSns('facebook')" title="페이스북 공유하기">페이스북</a></li>
                  <li><a href="javascript:void(0);" class="btn_twitter" onclick="shareSns('twitter')" title="X 공유하기">X</a></li>
                  <li><a href="javascript:void(0);" id="kakao-link-btn" class="btn_kakaotalk" title="카카오톡 공유하기">카카오톡</a></li>
                  <li><a href="javascript:void(0);" class="btn_nBlog" onclick="shareSns('blog')" title="네이버블로그 공유하기">네이버블로그</a></li>
                  <li><a href="javascript:void(0);" class="btn_nBand" onclick="shareSns('band')" title="네이버밴드 공유하기">네이버밴드</a></li>
                  <li class="etc">
                    <input type="text" id="copyUrl" title="복사할 URL" />
                    <button type="button" class="btn_urlCopy">URL 복사</button>
                  </li>
                </ul>
                <button type="button" class="btn_close">닫기</button>
              </div>
            </div>
          </div>
        `);

  // TOP버튼
  $('#footer').before(`
    <button type="button" id="btn_top">TOP</button>
    `);

  // 푸터
  $('#footer').html(`
    <footer>
      <ul class="f_menu">
        <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=750" target="_self" title="뷰어다운로드 현재창 열림">뷰어다운로드</a></li>
        <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1010" target="_self" title="저작권정책 현재창 열림">저작권정책</a></li>
        <li class="point"><a href="https://www.kotra.or.kr/module/stplatLog/selectPolicyLogList.do?stplatSeq=2000002272" target="_self" title="개인정보처리방침 현재창 열림">개인정보처리방침</a></li>
        <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1030" target="_self" title="공공데이터개방 현재창 열림">공공데이터개방</a></li>
        <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=720" target="_self" title="RSS2.0 현재창 열림">RSS2.0</a></li>
      </ul>
      <address>
        <span class="address">(06792) 서울시 서초구 헌릉로 13</span>
        <span>사업자등록번호 120-82-00275</span>
        <span>TEL : 1600-7119</span>
        <p class="copyright">
          COPYRIGHT(C)2012 KOTRA. ALL RIGHTS RESERVED <br />
          대한무역투자진흥공사
        </p>
      </address>
      <div class="f_sns">
        <p class="tit">Follow Us</p>
        <ul>
          <li><a href="https://www.facebook.com/globalkotra" target="_blank" style="background: url(https://dream.kotra.or.kr/ajaxa/fileCpnt/fileView.do?gbn=f01&BASIC_SEQ=17&INFO_SEQ=1) no-repeat center" title="페이스북  새 창 열림"> 페이스북 </a></li>
          <li><a href="https://blog.naver.com/kimglobal" target="_blank" style="background: url(https://dream.kotra.or.kr/ajaxa/fileCpnt/fileView.do?gbn=f01&BASIC_SEQ=17&INFO_SEQ=2) no-repeat center" title="블로그  새 창 열림"> 블로그 </a></li>
          <li><a href="https://www.instagram.com/globalkotra/" target="_blank" style="background: url(https://dream.kotra.or.kr/ajaxa/fileCpnt/fileView.do?gbn=f01&BASIC_SEQ=17&INFO_SEQ=3) no-repeat center" title="인스타그램  새 창 열림"> 인스타그램 </a></li>
          <li><a href="https://www.youtube.com/channel/UCPvcRkwx_IDYag3MO_n1nHg" target="_blank" style="background: url(https://dream.kotra.or.kr/ajaxa/fileCpnt/fileView.do?gbn=f01&BASIC_SEQ=17&INFO_SEQ=4) no-repeat center" title="유튜브  새 창 열림"> 유튜브 </a></li>
        </ul>
      </div>
    </footer>
  `);
}
/* ============================================================
 * 3. 상단 공지 슬라이더 (inline Script)
 * ============================================================ */
function initTopNotice() {
  $(".mTopNotice .innerCont").not(".slick-initialized").slick({
    speed: 300,
    dots: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    infinite: true,
    // 21-11-24 추가
    autoplay: true
  });

  /* 21-11-15 탑배너 버튼 추가 1 */
  if ($(".mTopNotice .slick-arrow").length < 1) {
    $(".mTopNotice .list_control").removeClass("on");
  } else {
    $(".mTopNotice .list_control").addClass("on");
  }

  $(".mTopNotice .list_control>button").click(function () {
    if ($(this).hasClass("btn_pause")) {
      $(".mTopNotice .slick-slider").slick("slickPause");
      $(this).attr("class", "btn_play").text("재생");
    } else {
      $(".mTopNotice .slick-slider").slick("slickPlay");
      $(this).attr("class", "btn_pause").text("일시정지");
    }
  });
  /* //21-11-15 탑배너 버튼 추가 1 */

  // 상단공지 닫기
  $(document).on("click", ".mTopNotice .closedArea .closedBtn", function (e) {
    if ($("input[name=news_top_cls]").prop("checked")) {
      setCookie("news_top_cls", "done", 1);
    }
    $("body").removeClass("typeTopNotice");
    $(".mTopNotice").hide();
  });

  $(".mTopNotice").hide();
  $(".typeMain").removeClass("typeTopNotice");
}
/* ============================================================
 * gnb href 재귀 세팅 함수 (inline Script)
 * initGnbHrefDelegate(), initSitemap()에서 공용으로 사용
 * ============================================================ */
var frameBtnObj;

function setHref(obj, org) {
  if ($(obj).find("> div").length > 0) {
    if ($(obj).find("> div> ul > li:not('.emptyArea')").length > 0) {
      if ($(obj).find(">a").data("sub") == "Y") {
        $(org).find(">a").attr("href", $(obj).find("> div> ul > li:not('.emptyArea'):eq(0) > a").attr("href"));
        $(org).find(">a").attr("target", $(obj).find("> div> ul > li:not('.emptyArea'):eq(0) > a").attr("target"));

        setHref($(obj).find("> div> ul > li:not('.emptyArea'):eq(0)"), org);
      } else {
        $(org).find(">a").attr("href", $(org).find(">a").attr("href"));
      }
    }
  } else {
    if ($(obj).find("> ul > li:not('.emptyArea')").length > 0) {
      if ($(obj).find(">a").data("sub") == "Y") {
        $(org).find(">a").attr("href", $(obj).find("> ul > li:not('.emptyArea'):eq(0) > a").attr("href"));
        $(org).find(">a").attr("target", $(obj).find("> ul > li:not('.emptyArea'):eq(0) > a").attr("target"));

        setHref($(obj).find("> ul > li:not('.emptyArea'):eq(0)"), org);
      } else {
        $(org).find(">a").attr("href", $(org).find(">a").attr("href"));
      }
    }
  }
}

function initGnbHrefDelegate() {
  $(document).on("click", "ul#gnb li, ul#snb li", function () {
    setHref($(this), $(this));
  });
}
/* ============================================================
 * 헤더 유틸: gnbDep 계산, 검색, 로그인/로그아웃, 팝업 포커스
 * (inline Script)
 * ============================================================ */
function initHeaderUtil() {

  $(document).on("click", ".navList>.menu>ul>li>a", function () {
    var val = $(this).data('menuno');
    $("ul#gnb li").find('.' + val).closest('li').trigger('click');
    if ($("ul#gnb li").find('.' + val).attr('target') == "_blank") {
      window.open($("ul#gnb li").find('.' + val).attr('href'));
    } else {
      location.href = $("ul#gnb li").find('.' + val).attr('href');
    }
  });

  $(document).on("click", ".pnbList>.menu>ul>li>a", function () {
    var val = $(this).data('menuno');
    $("ul#gnb li").find('.' + val).closest('li').trigger('click');
    if ($("ul#gnb li").find('.' + val).attr('target') == "_blank") {
      window.open($("ul#gnb li").find('.' + val).attr('href'));
    } else {
      location.href = $("ul#gnb li").find('.' + val).attr('href');
    }
    // $("ul#gnb li").find('.'+val).get(0).click();
  });

  calcGnbDepthVars();
  var $gnbLeaf = getGnbLeafLi();
  if ($gnbLeaf.length) {
    $('.sVisual strong').text($.trim($gnbLeaf.children('a').first().text()));
  }

  $(document).on('click', '.btn_logout, .btn_topLogout', function () {
    frameBtnObj = $(this);
    $("body").css("overflow-y", "hidden");
    $('<iframe id="iframeLogoutPop" src="https://dream.kotra.or.kr/kotranews/cms/frCom/actionLogoutPop.do" class="pop_iframe on" height="100%" scrolling="no" frameborder="0" title="로그아웃 팝업"/>').appendTo($("body #container"));
  });

  $(document).on('click', '.btn_login, .btn_topLogin', function () {
    //뉴스
    //location.href = "https://dream.kotra.or.kr/kotranews/login/topUtilLink.do?pRetUrl=" + encodeURIComponent(window.location.pathname + window.location.search);
    sessionStorage.setItem('newsLogin', 'newsLogin');
    location.href = "https://www.kotra.or.kr/membership/membershipLoginForm.do?siteName=kn"
  });

  $(document).on('click', '.btn_mypage', function () {
    location.href = "https://dream.kotra.or.kr/dream/mypage/topUtilLink.do";
  });

  $(document).on('click', '.gnb_util .btn_search', function () {
    var pSearchTxt = $('.search_inp').val()

    fn_comm_ajax({
      url: "https://dream.kotra.or.kr/ajaxf/totalSearch/getStopWordList.do",
      data: {},
      dataType: "json",
      async: false,
      success: function (data) {
        if (null != data && '' != data) {
          for (var i = 0; i < data.length; i++) {
            if (pSearchTxt == data[i].BAN_WORD) {
              alert('\'' + data[i].BAN_WORD + '\'' + '은(는)' + ' 검색할 수 없는 단어입니다.');
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

  $(document).on('click', '.search_opt > ul > li > button', function () {
    var sVal = $(this).val();
    var sText = $(this).text();
    $('.search_opt .btn_searchOpt').val(sVal);
    $('.search_opt .btn_searchOpt').text(sText);
  });

  $("header .mBtn_topMenu").click(function () {
    if (window.innerWidth < 1041) {
      if (!$("nav>#gnb>li>a").hasClass('on')) {
        $("nav>#gnb>li>a").eq(0).trigger('click');
      }
    }
  });

  // 접근성 팝업 포커스 변경
  $(document).on('DOMNodeInserted', '.pop_iframe', function () {
    $(this).focus();
  });
  $(document).on('DOMNodeRemoved', '.pop_iframe', function () {
    $(frameBtnObj).focus();
  });
}

function closeSearchPop() {
  $('#iframeSearchPop').remove();
}

function closeTotalSearchPop() {
  $("body").css("overflow", "");
  $("body").css("overflow-y", "");
  $("#iframeSearchPop").remove();
}
function closeLogoutPop() {
  $("body").css("overflow", "");
  $("body").css("overflow-y", "");
  $("#iframeLogoutPop").remove();
}

/************************************************************************
* 함수명 : fn_logout
* 설 명 :  로그아웃
************************************************************************/
function fn_logout() {
  location.href = "https://dream.kotra.or.kr/kotranews/action/actionLogout.do";
}

/************************************************************************
* 함수명 : fn_enterkey
* 설 명 :  엔터키 클릭 이벤트 호출
************************************************************************/
function fn_enterkey() {
  if (window.event.keyCode == 13) {
    $('.btn_search').trigger('click');
  }
}
/* ============================================================
 * 사이트맵 (inline Script)
 * ============================================================ */
function sitemap() {
  $(".sitemapBox .map_nav").css({
    height: window.innerHeight - 240
  });
}

// 포커스 시 초점 이동 막기
$.fn.focusWithoutScrolling = function () {
  var x = window.scrollX,
    y = window.scrollY;
  this.focus();
  window.scrollTo(x, y);
  return this; //chainability
};

function initSitemap() {
  $(".sitemapBox .map_nav").mCustomScrollbar();

  $(".sitemapBox .map_gnb>li>a").click(function () {
    var mapGnb_num = $(this).parent("li").index();
    $(".sitemapBox .map_gnb>li>a").removeClass("on");
    $(this).addClass("on");

    $(".sitemapBox .map_nav")
      .find(".mCSB_container")
      .find("#sitemap>li:eq(" + mapGnb_num + ")")
      .find(".menuM>li:eq(0)>a")
      .focusWithoutScrolling();

    $(".sitemapBox .map_nav").mCustomScrollbar(
      "scrollTo",
      $(".sitemapBox .map_nav")
        .find(".mCSB_container")
        .find("#sitemap>li:eq(" + mapGnb_num + ")")
    );
  });

  $(window).bind("load resize", function () {
    sitemap();
  });

  $(document).on("click", "ul#sitemap li", function () {
    setHref($(this), $(this));
  });
}
/* ============================================================
 * SNS 공유 / 카카오 / 북마크 / 프린트 / URL복사 (inline Script)
 * ============================================================ */
function fn_getUrl() {
  var rtnUrl = "";
  var url = decodeURIComponent(location.href);
  url = decodeURIComponent(url).replace("#", "");
  url = decodeURIComponent(url).replace(";", "");
  rtnUrl = url.replace("#;", "");
  rtnUrl = fn_makeShortUrl(rtnUrl);
  return rtnUrl;
}

// 2024-06-25 네이버 밴드 추가
function shareSns(sns) {
  var snsTitle = "";
  var snsItems = new Array();
  var winOpt = new Array();
  var snsUrl = fn_getUrl();

  snsItems["facebook"] = "http://www.facebook.com/share.php?t=" + encodeURIComponent(snsTitle) + "&u=" + encodeURIComponent(snsUrl);
  snsItems["twitter"] = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(snsTitle + "\n" + snsUrl);
  snsItems["kakao"] = "https://story.kakao.com/share?url=" + encodeURIComponent(snsUrl);
  snsItems["blog"] = "http://blog.naver.com/openapi/share?url=" + encodeURIComponent(snsUrl) + "&title=" + encodeURIComponent(snsTitle);
  snsItems["band"] = "https://band.us/plugin/share?body=" + encodeURIComponent(snsUrl);

  winOpt["facebook"] = "width=700, height=500, resizable=yes";
  winOpt["twitter"] = "width=700, height=500, resizable=yes";
  winOpt["kakao"] = "width=500, height=500, resizable=yes";
  winOpt["blog"] = "width=500, height=500, resizeable=yes";
  winOpt["band"] = "width=500, height=500, resizeable=yes";

  var win = window.open(snsItems[sns], sns, winOpt[sns]);
  if (win) {
    win.focus();
  }
}

function fn_makeShortUrl(url) {
  var shortUrl;

  fn_comm_ajax({
    url: "https://dream.kotra.or.kr/ajaxf/frBoard/getKotraShortUrl.do",
    data: { url: encodeURIComponent(url) },
    dataType: "json",
    async: false,
    success: function (data) {
      if (data != null && data.shortUrl != null) {
        shortUrl = data.shortUrl;
      } else {
        shortUrl = url;
      }
    }
  });

  return shortUrl;
}

function initSnsShare() {
  $(".btn_print").bind("click", function () {
    if ($(".nation_areainfo").length > 0) {
      $(".nation_areainfo").printThis();
    } else if ($("#pdfArea").length > 0) {
      $("#pdfArea").printThis();
    } else if ($(".lineList_v").length > 0) {
      $(".lineList_v").printThis();
    } else {
      window.print();
    }
  });

  var clipboard = new ClipboardJS(".btn_urlCopy", {
    text: function () {
      return fn_getUrl();
    }
  });
  clipboard.on("success", function (e) {
    alert("URL이 복사되었습니다.");
  });
  clipboard.on("error", function (e) {
    alert("URL복사에 실패했습니다.");
  });

  $(document).on("click", ".btn_bookmark", function () {
    var val = $(this).val();
    if (val == null || val == "") val = "N";
    fn_comm_ajax({
      url: "https://dream.kotra.or.kr/ajaxf/frCom/setBookmark.do",
      data: { SITE_NO: "3", MENU_NO: "140", CONTENTS_NO: "1", bookmarkYn: val },
      dataType: "json",
      success: function (data) {
        if (data != null) {
          alert(data.MSG);

          if ("SUCCESS" == data.RESULT) {
            if (val == "Y") {
              $(".btn_bookmark").val("N");
              $(".btn_bookmark").removeClass("on");
            } else {
              $(".btn_bookmark").val("Y");
              $(".btn_bookmark").addClass("on");
            }
          }
        }
      }
    });
  });

  //$("#copyUrl").val(fn_getUrl());
  $(document).on("click", ".btn_share", function () {
    if ($("#copyUrl").val() == "") $("#copyUrl").val(fn_getUrl());
  });

  try {
    Kakao.init("db8f875d5ed49c0de3dbd61f92fbc7d0");
  } catch (e) {}

  var title2 = $(document).attr("title");
  var newsImageUrl = "http://dream.kotra.or.kr/type/news/img/layout/logo_navi.png";

  try {
    Kakao.Link.createDefaultButton({
      container: "#kakao-link-btn",
      objectType: "feed",
      content: {
        title: title2,
        description: title2,
        imageUrl: newsImageUrl,
        imageWidth: 60,
        imageHeight: 15,
        link: {
          mobileWebUrl: location.href,
          webUrl: location.href,
          androidExecParams: location.href,
          iosExecParams: location.href
        }
      },
      buttons: [
        {
          title: "웹으로 보기",
          link: {
            mobileWebUrl: location.href,
            webUrl: location.href
          }
        }
      ]
    });
  } catch (e) {}
}
/* ============================================================
 * SNS 보드 슬릭 (inline Script)
 * ============================================================ */
function initSnsBoardSlick() {
  var slickSnbBookmark = {
    infinite: true,
    autoplay: false,
    arrows: true,
    button: false,
    slidesToShow: 5,
    slidesToScroll: 1,
    speed: 600,
    variableWidth: true,
    responsive: [
      {
        breakpoint: 1041,
        settings: {
          slidesToShow: 5
        }
      }
    ]
  };
  $("#snb_board .snb_bookmark .list").not(".slick-initialized").slick(slickSnbBookmark);
}
/* ============================================================
 * 푸터 배너 슬릭 (inline Script)
 * ============================================================ */
function initFooterBannerSlick() {
  var slickFbnr = {
    infinite: true,
    autoplay: false,
    arrows: true,
    button: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    speed: 600,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1041, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 560, settings: { slidesToShow: 2 } }
    ]
  };
  $("footer .f_bnr .list").not(".slick-initialized").slick(slickFbnr);
}
// (layout.js)

/* ============================================================
 * 10. KOTRA 내부사이트 토글 (layout.js)
 * ============================================================ */
function initKotraSiteToggle() {
  $('.top_util .btn_kotraSite').click(function () {
    if ($(this).hasClass('on')) {
      $(this).removeClass('on');
      $(this).parents('#header').removeClass('kotraSiteOn');
      $(this).attr('title', 'KOTRA 내부사이트 열기');
    } else {
      $(this).addClass('on');
      $(this).parents('#header').addClass('kotraSiteOn');
      $(this).attr('title', 'KOTRA 내부사이트 닫기')
    }
  });

  $('.top_util .moreSiteArea .btn_close').click(function () {
    $('.top_util .btn_kotraSite').trigger('click');
  });
}
/* ============================================================
 * gnb 현재 메뉴 / pnb(브레드크럼) 동기화
 * - MENU_ID 또는 gnb 의 가장 깊은 li.on / a.on 을 현재 페이지로 본다
 * - 홈(btn_home)은 유지하고, gnb 경로의 모든 뎁스를 생략 없이 채운다
 * - 2뎁스 페이지: 홈 > 1뎁스 > 현재페이지
 * - 3뎁스 페이지: 홈 > 1뎁스 > 2뎁스 > 현재페이지
 * ============================================================ */
function getCurrentMenuId() {
  var menuId = $.trim($('#MENU_ID').val() || $('input[name=MENU_ID]').val() || '');
  if (menuId) return String(menuId);

  try {
    if (window.URLSearchParams) {
      menuId = new URLSearchParams(window.location.search).get('MENU_ID') || '';
      if (menuId) return String(menuId);
    }
  } catch (e) {}

  var matched = String(window.location.search).match(/[?&]MENU_ID=(\d+)/i);
  if (matched) return matched[1];

  var pathMatch = String(window.location.pathname || '').match(/(?:^|\/)_?menu_(\d+)\.html$/i);
  return pathMatch ? pathMatch[1] : '';
}

function getGnbMenuNo($a) {
  if (!$a || !$a.length) return '';
  var className = $a.attr('class') || '';
  var classMatch = className.match(/\b(\d+)\b/);
  if (classMatch) return classMatch[1];
  var hrefMatch = String($a.attr('href') || '').match(/[?&]MENU_ID=(\d+)/i);
  return hrefMatch ? hrefMatch[1] : '';
}

function getGnbLeafLi() {
  var $leaf = $('#gnb li.on').filter(function () {
    return $(this).find('li.on').length === 0;
  }).first();
  if ($leaf.length) return $leaf;

  var $aOn = $('#gnb a.on').first();
  if ($aOn.length) return $aOn.closest('li');
  return $();
}

function applyGnbCurrentByMenuId() {
  var menuId = getCurrentMenuId();
  if (!menuId) return;

  var $a = $('#gnb a').filter(function () {
    return (' ' + (this.className || '') + ' ').indexOf(' ' + menuId + ' ') > -1;
  });
  if (!$a.length) {
    $a = $('#gnb a[href*="MENU_ID=' + menuId + '"]');
  }
  if (!$a.length) return;

  $('#gnb li').removeClass('on');
  $('#gnb a').removeClass('on');

  var $li = $a.closest('li');
  $li.addClass('on');
  $li.parents('#gnb li').addClass('on');
  $li.closest('#gnb > li').children('a').addClass('on');
}

function calcGnbDepthVars() {
  window.gnbDep1 = 0;
  window.gnbDep2 = 0;
  window.gnbDep3 = 0;

  var $leaf = getGnbLeafLi();
  if (!$leaf.length) return $leaf;

  var $parentUl = $leaf.parent('ul');
  if ($parentUl.hasClass('menuS')) {
    window.gnbDep1 = $('#gnb > li').index($leaf.closest('ul.menuM').parent()) + 1;
    window.gnbDep2 = $leaf.closest('ul.menuM').children('li').index($leaf.parent().closest('li')) + 1;
    window.gnbDep3 = $parentUl.children('li').index($leaf) + 1;
  } else if ($parentUl.hasClass('menuM')) {
    window.gnbDep1 = $('#gnb > li').index($leaf.closest('ul.menuM').parent()) + 1;
    window.gnbDep2 = $parentUl.children('li').index($leaf) + 1;
  } else {
    window.gnbDep1 = $('#gnb > li').index($leaf) + 1;
  }
  return $leaf;
}

function getVisibleSiblingLis($li) {
  return $li.parent().children('li').not('.emptyArea').filter(function () {
    return $(this).css('display') !== 'none';
  });
}

function getPnbSiblingLis($li) {
  return $li.parent().children('li').not('.emptyArea');
}

function escapePnbText(text) {
  return $('<div>').text(text == null ? '' : text).html();
}

function escapePnbAttr(text) {
  return String(text == null ? '' : text)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

function buildPnbDropdownHtml($siblingLis) {
  var html = '';
  $siblingLis.each(function () {
    var $a = $(this).children('a').first();
    var href = $a.attr('href') || 'javascript:void(0);';
    html += '<li><a href="' + escapePnbAttr(href) + '" data-menuno="' + getGnbMenuNo($a) + '" title="현재창 이동" target="_self">' + escapePnbText($.trim($a.text())) + '</a></li>';
  });
  return html;
}

function initPnbFromGnb() {
  var $pnb = $('#pnb');
  if (!$pnb.length) return;

  var $leaf = getGnbLeafLi();
  if (!$leaf.length) return;

  var trail = [];
  var $node = $leaf;
  while ($node.length && $node.closest('#gnb').length) {
    var $a = $node.children('a').first();
    if ($a.length) {
      trail.unshift({
        text: $.trim($a.text()),
        $li: $node
      });
    }
    $node = $node.parent().closest('#gnb li');
  }
  if (!trail.length) return;

  var current = trail[trail.length - 1];
  var ancestors = trail.slice(0, -1);
  var navHtml = '';
  for (var i = 0; i < ancestors.length; i++) {
    navHtml += '<li><div class="navList"><div class="menu">';
    navHtml += '<button type="button" class="btnTit" title="열기">' + escapePnbText(ancestors[i].text) + '</button>';
    navHtml += '<ul>' + buildPnbDropdownHtml(getPnbSiblingLis(ancestors[i].$li)) + '</ul>';
    navHtml += '</div></div></li>';
  }
  $pnb.find('.pnb_nav > ul').html(navHtml);
  $pnb.find('.pnb_menu .pnbList .btnTit').attr('title', '열기').text(current.text);
  $pnb.find('.pnb_menu .pnbList .menu > ul').html(buildPnbDropdownHtml(getPnbSiblingLis(current.$li)));
}
/* ============================================================
 * 11. gnb 현재 메뉴 on 클래스 세팅 (layout.js)
 * ============================================================ */
function initGnbCurrentState() {
  calcGnbDepthVars();

  var gnbCrt0 = $("#gnb>li:nth-child(" + (gnbDep1) + ")>a");
  var gnbCrt1 = $("#gnb>li:nth-child(" + (gnbDep1) + ")>a");
  var gnbCrt2 = $("#gnb>li:nth-child(" + (gnbDep1) + ")>ul>li:nth-child(" + (gnbDep2) + ")");
  var gnbCrt3 = $("#gnb>li:nth-child(" + (gnbDep1) + ")>ul>li:nth-child(" + (gnbDep2) + ")>ul>li:nth-child(" + (gnbDep3) + ")");
  /*var snbCrt1 = $("#snb>li:nth-child(" + (gnbDep1) + ")>a");
  var snbCrt2 = $("#snb>li:nth-child(" + (gnbDep1) + ")>ul>li:nth-child(" + (gnbDep2) + ")>a");
  var snbCrt3 = $("#snb>li:nth-child(" + (gnbDep1) + ")>ul>li:nth-child(" + (gnbDep2) + ")>ul>li:nth-child(" + (gnbDep3) + ")>a");*/

  if (gnbCrt0) gnbCrt0.addClass("on");
  if (gnbCrt1) gnbCrt1.addClass("on");
  if (gnbCrt2) gnbCrt2.addClass("on");
  if (gnbCrt3) gnbCrt3.addClass("on");

  /*if(snbCrt1) snbCrt1.parent().addClass("on");
  if(snbCrt2) snbCrt2.parent().addClass("on");
  if(snbCrt3) snbCrt3.parent().addClass("on");*/

  /*function gnbW(){
    if(window.innerWidth >= 1041){
      $("header>nav #gnb>li").css({
        "width": (100 / ($("#gnb>li").length - $("#gnb>li:hidden").length)) + "%"
      });
    }
  }*/
}
/* ============================================================
 * 12. gnb 호버 (PC) (layout.js)
 * ============================================================ */
function initGnbHover() {
  $("#gnb>li>a").mouseover(function () {
    if (window.innerWidth >= 1041) {
      //$("#header").removeClass("gnbOn");
      $("#gnb>li>a, #gnb>li>.gnbTit, #gnb>li>.menuM").removeClass('act');

      $("#header").css("height", "");
      $(".gnbTit").css("height", "");

      $("#header").addClass("gnbOn");
      $("#gnb_dim").addClass("on");
      $(this).addClass('act');
      $(this).siblings().addClass('act');

      if ($(this).parent('li').hasClass('child')) {
        if ($(this).siblings('.menuM').height() > 125) {
          $("#header").height($(this).siblings('.menuM').height() + 153);
        } else {
          $("#header").height(230);
        }
        $(this).siblings('.gnbTit').height($(this).siblings('.menuM').height() + 100);
      } else {
        $("#header").removeAttr('style');
      }

      $(this).siblings('.menuStep').children('li').css({
        "width": (100 / $(this).siblings('.menuStep').children('li').not('.emptyArea').length) + "%"
      });
    };
  });

  $("#header").mouseleave(function () {
    if (window.innerWidth >= 1041) {
      $("#header").removeClass("gnbOn").removeAttr('style');
      $("#gnb_dim").removeClass("on");
      $("#gnb>li>a").removeClass('act');
      $("#gnb, #gnb .gnbTit, #gnb .menuM").removeClass('act');
      $("#gnb, #gnb .gnbTit, #gnb .menuM>li").removeClass('act').removeAttr('style');
    }
  });
}
/* ============================================================
 * 13. 모바일 gnb 메뉴 동작 (layout.js)
 * ============================================================ */
function menuM() {
  if (window.innerWidth < 1041) {
    var depOneLength = $('header>nav #gnb>li:visible').length;

    // $("header>nav #gnb li>ul.menuM").css({
    // 	"top": 54 * (Math.ceil(depOneLength / 4))
    // });

    if ($('body').hasClass('typeTopNotice')) {
      // 상단배너 있는 경우
      $("header>nav #gnb ul.menuM").css({
        "height": window.innerHeight - 294
      });
    } else {
      $("header>nav #gnb ul.menuM").css({
        "height": window.innerHeight - 209
      });
    }
  } else {
    // $("header>nav #gnb li>ul.menuM").css('top','');
    $("header>nav #gnb li>ul.menuM").css('height', '')
  }
}

function menuS() {
  if (window.innerWidth < 1041) {
    var depOneLength = $('header>nav #gnb>li:visible').length;
    var depOneHeight = 54 * (Math.ceil(depOneLength / 4))

    // $("header>nav #gnb li>ul.menuS").css({
    // 	"top": depOneHeight
    // });

    $("header>nav #gnb li>ul.menuS").css({
      "height": window.innerHeight - depOneHeight - 52 - 80
    });
  } else {
    // $("header>nav #gnb li>ul.menuS").css('top','')
    $("header>nav #gnb li>ul.menuS").css('height', '')
  }
}

function mbMenuResult() {
  if (window.innerWidth < 1041) {
    $(".typeSearchResult .m_searchResult").css({
      "height": window.innerHeight - 220
    });
  }
}

function mBtnClose() {
  $("#gnb_dim").removeClass('on');
  $("#header").removeClass('gnbOn');
  $("header>nav #gnb li").removeClass('act');
  $('body').css('overflow', 'visible');

  if (window.innerWidth < 1041) {
    setTimeout(function () {
      $("#header nav").hide();
    }, 300);
  } else {
    $("#header nav").show();
  }
}

function initMobileGnb() {
  menuM();
  menuS();

  $("header .mBtn_topMenu").click(function () {
    if (window.innerWidth < 1041) {
      $(this).nextAll("nav").show();
      $("header>nav #gnb").removeAttr('style')//reset
      $("header>nav #gnb ul.menuM>li").removeClass('act');//reset
      $("header>nav #gnb .on").addClass('act');//reset
      $("header>nav #gnb li.on>.menuSS").slideDown(0);//reset

      $("#gnb_dim").addClass('on');
      $("#header").addClass('gnbOn');
      $("header>nav #gnb").css({
        "height": window.innerHeight - $("#header").height()
      });

      menuM();

      $('body').css('overflow', 'hidden');
    }
  });

  $("header>nav #gnb>li>a").click(function () {
    if (window.innerWidth < 1041) {
      if ($(this).parent('li').hasClass('child')) {
        $("header>nav #gnb li").removeClass('act');//reset
        $("header>nav #gnb li.on>.menuSS").slideDown(0);//reset

        /*if(!$(this).hasClass('act') && !$(this).hasClass('on')){
          $("header>nav #gnb ul.menuM>li:first-child").addClass('act');
        }*/

        if ($(this).parent('li').hasClass('child')) {
          if (!$(this).hasClass('act')) {
            $("header>nav #gnb>li>a.act").removeClass('act');
            $(this).addClass('act');
          }
        }

        $("header>nav #gnb li.on").addClass('act');

        return false;
      } else {
        return true;
      }
    }
  });

  $("header>nav #gnb ul.menuM>li>a").click(function () {
    if (window.innerWidth < 1041) {
      if ($(this).parent('li').attr('class') == 'child' || $(this).parent('li').attr('class') == 'child on') {
        $("header>nav #gnb li").removeClass('act');
        $(this).parent('li').addClass('act');

        return false;
      } else if ($(this).parent('li').attr('class') == 'child act') {
        $(this).parent('li').removeClass('act');

        return false;
      } else {
        return true;
      }
    }
  });

  $("header>nav #gnb ul.menuS>li>a").click(function () {
    if (window.innerWidth < 1041) {
      if ($(this).parent('li').attr('class') == 'child' || $(this).parent('li').attr('class') == 'child on') {
        $("header>nav #gnb .menuS>li").removeClass('act');
        $("header>nav #gnb .menuSS").slideUp(200);
        $(this).parent('li').addClass('act');
        $(this).siblings('.menuSS').slideDown(200);

        return false;
      } else if ($(this).parent('li').attr('class') == 'child act' || $(this).parent('li').attr('class') == 'child on act') {
        $(this).parent('li').removeClass('act');
        $(this).siblings('.menuSS').slideUp(200);

        return false;
      } else {
        return true;
      }
    }
  });

  $("header .mBtn_close").click(function () {
    mBtnClose();
  });
}
/* ============================================================
 * 14. Footer top버튼 / 폰트사이즈 / familySite (layout.js)
 * ============================================================ */
function initFooterExtras() {
  // top버튼
  $("#btn_top").click(function () {
    $("html, body").stop().animate({
      scrollTop: 0
    }, 150);
    setTimeout(function () {
      $('header a').eq(0).focus();
    })
  });

  $("#snb_nav .snb_util .zoom>button").click(function () {
    $('#contents article').FontSize({
      increaseTimes: 3,
      reduceTimes: 3,
      step: 3,
      increaseBtn: '.btn_zoomIn',
      reduceBtn: '.btn_zoomOut'
    });
  });

  // familySite
  $("#footer .btn_familysite").click(function () {
    if ($("#footer .familySite").hasClass('on')) {
      $("#footer .familySite").removeClass('on');
    } else {
      $("#footer .familySite").addClass('on');
    }
  });

  // if($(".pop_wrap .popConts").find('.limit').length > 0){
  // 	$(".pop_wrap .popConts .limit").mCustomScrollbar();
  // }
}
/* ============================================================
 * 15. 스크롤 이벤트 (layout.js)
 * ============================================================ */
function initScrollHandler() {
  var conts_loc;
  $(window).scroll(function () {
    conts_loc = $(window).scrollTop();

    if ($("body").hasClass('typeMain')) {
      if (conts_loc > 0) {
        $("body").addClass('mSticky');
      } else {
        $("body").removeClass('mSticky');
      }
    }

    if ($("body").hasClass('typeSub')) {
      if (window.innerWidth >= 1041) {
        if (conts_loc > 400) {
          $("body").addClass('stickyFix');
        } else {
          $("body").removeClass('stickyFix');
        }
      } else {
        if (conts_loc > 181) {
          $("body").addClass('stickyFix');
        } else {
          $("body").removeClass('stickyFix');
        }
      }
    }

    if (conts_loc > 100) {
      $("#btn_top").addClass('on');
    } else {
      $("#btn_top").removeClass('on');
    }
  });
}
/* ============================================================
 * 16. pnb, snb (브레드크럼) / boardOptBox 게시판 정렬 옵션 동작 (layout.js)
 * ============================================================ */
function initPnbOptions() {
  function pnb_btnTit() {
    $("#pnb .pnb_menu .pnbList .menu_txt").css({
      "width": $("#pnb .pnb_menu .pnbList").width() - $("#pnb .pnb_menu .pnbList .menu").width() - 10
    });
  }
  // 전역에서 load/resize 시 재사용할 수 있도록 window에 노출
  window.pnb_btnTit = pnb_btnTit;

  $("#pnb .pnb_menu .pnbList .btnTit").attr('title', '열기');
  $("#pnb .pnb_menu .pnbList .btnTit").click(function () {

    if ($("#pnb .pnb_nav .navList .menu>ul").hasClass('on')) {
      $("#pnb .pnb_nav .navList .menu>ul").removeClass('on');
      $("#pnb .pnb_nav .navList .menu>ul").slideUp(200);
      $('#pnb .pnb_nav .navList .btnTit').attr('title', '열기');
    }

    if ($("#pnb .pnb_menu .pnbList").hasClass('on')) {
      $("#pnb .pnb_menu .pnbList").removeClass('on');
      $("#pnb .pnb_menu .pnbList .menu>ul").slideUp(200);
      $(this).attr('title', '열기');
    } else {
      $("#pnb .pnb_menu .pnbList").addClass('on');
      $("#pnb .pnb_menu .pnbList .menu>ul").slideDown(200);
      $(this).attr('title', '닫기');
    }
  });

  $("#pnb .pnb_nav .navList .btnTit").attr('title', '열기');
  $("#pnb .pnb_nav .navList .btnTit").click(function () {
    if ($("#pnb .pnb_menu .pnbList").hasClass('on')) {
      $("#pnb .pnb_menu .pnbList").removeClass('on');
      $("#pnb .pnb_menu .pnbList .menu>ul").slideUp(200);
      $("#pnb .pnb_menu .pnbList .menu .btnTit").attr('title', '열기');
    }

    $("#pnb .pnb_nav .navList .btnTit").not(this).siblings('ul').removeClass('on');
    $("#pnb .pnb_nav .navList .btnTit").not(this).siblings('ul').slideUp(200);
    $("#pnb .pnb_nav .navList .btnTit").not(this).attr('title', '열기');

    if ($(this).siblings('ul').hasClass('on')) {
      $(this).siblings('ul').removeClass('on');
      $(this).siblings('ul').slideUp(200);
      $(this).attr('title', '열기');
    } else {
      $(this).siblings('ul').addClass('on');
      $(this).siblings('ul').slideDown(200);
      $(this).attr('title', '닫기');
    }
  });

  $("#pnb .pnb_func .btn_share").click(function () {
    $(this).addClass('on');
    $("#pnb .pnb_func .shareBox").addClass('on');
    $('#pnb .pnb_func .shareBox').attr('tabindex', '-1');
    setTimeout(function () {
      $('#pnb .pnb_func .shareBox').focus();
    }, 300)
  });

  $("#pnb .pnb_func .shareBox .btn_close").click(function () {
    $("#pnb .pnb_func .shareBox").removeClass('on');
    $("#pnb .pnb_func .btn_share").removeClass('on');
    setTimeout(function () {
      $('#pnb .pnb_func .btn_share').focus();
    }, 300)
  });

  $("#pnb .pnb_func .btn_bookmark").click(function () {
    if ($(this).hasClass('on')) {
      $("#pnb .pnb_func .btn_bookmark").removeClass('on');
      $("#pnb .pnb_func .btn_bookmark").attr('title', '북마크 선택 안됨')
    } else {
      $("#pnb .pnb_func .btn_bookmark").addClass('on');
      $("#pnb .pnb_func .btn_bookmark").attr('title', '북마크 선택됨')
    }
  });

  $(".searchOptBox .boxBtn .btn_optBoxOpen").click(function () {
    $(".searchOptBox").addClass('on');
    $(".searchOptBox .searchOpt").slideDown(200);

    $("#pnb .pnb_menu .pnbList.on .btnTit").trigger('click');
    $("#pnb .pnb_func .shareBox").removeClass('on');
  });

  /* 2024-07-17 상세검색 열기닫기 변경 */
  $(".searchOptBox .boxBtn .btn_optBoxClose").click(function () {
    if ($(this).hasClass('seachOptTypeOpen')) {
      $(this).removeClass('seachOptTypeOpen');
      $(this).addClass('seachOptTypeClose');
      $(this).html('<span>상세 검색 닫기</span>');
      $('.searchBaseDN').addClass('searchOptShow');
    } else if ($(this).hasClass('seachOptTypeClose')) {
      $(this).removeClass('seachOptTypeClose');
      $(this).addClass('seachOptTypeOpen');
      $(this).html('<span>상세 검색 열기</span>');
      $('.searchBaseDN').removeClass('searchOptShow');
    } else {
      $(".searchOptBox .searchOpt").slideUp(200);
      $(".searchOptBox").removeClass('on');
      setTimeout(function () {
        $('.btn_optBoxOpen').focus();
      })
    }
  });

  $(".boardOptBox .optBox .typeView .typeList").click(function () {
    if (!$(this).hasClass('on')) {
      $(this).addClass('on');
      $(".boardOptBox .optBox .typeView .typeThumb").removeClass('on')
    }
  });
  $(".boardOptBox .optBox .typeView .typeThumb").click(function () {
    if (!$(this).hasClass('on')) {
      $(this).addClass('on');
      $(".boardOptBox .optBox .typeView .typeList").removeClass('on')
    }
  });
}
/* ============================================================
 * 17. 상단 사이트맵 팝업 열기/닫기 트리거 (layout.js)
 * ============================================================ */
function initSitemapPopupTrigger() {
  var sitemapPrevLoc;

  $("header .gnb_util .btn_sitemap").click(function () {
    sitemapPrevLoc = $(window).scrollTop();
    var siteMapInnerH = $('.map_nav').height();
    var siteMapLastH = $('.sitemapBox #sitemap>li:last-child .menuM').height();

    $("html").css('overflow', 'hidden');
    $("body").css('overflow', 'hidden');

    $('.sitemapBox #sitemap>li:last-child').css('height', siteMapInnerH - siteMapLastH)

    $("#dim").addClass('on');
    $(".sitemapBox").addClass('on').removeClass('off');
  });

  $(".sitemapBox .btn_close").click(function () {
    $("html").css('overflow', '');
    $("body").css('overflow', '');
    $("html, body").animate({
      scrollTop: sitemapPrevLoc
    }, 0);

    $(".sitemapBox").addClass('off').removeClass('on');
    $("#dim").removeClass('on');
  });

  window.sitemapClose = function sitemapClose() {
    if (window.innerWidth <= 1041) {
      if ($('.sitemapBox').hasClass('on')) {
        $("html").css('overflow', '');
        $("html, body").animate({
          scrollTop: sitemapPrevLoc
        }, 0);
        $(".sitemapBox").addClass('off').removeClass('on');
        $("#dim").removeClass('on');
      }
    }
  };

  $("header .gnb_util .totalSearchArea .btn_searchOpt").click(function () {
    if ($('.search_opt').hasClass('on')) {
      $('.search_opt').removeClass('on');
    } else {
      $('.search_opt').addClass('on');
    }
  });

  $("header .gnb_util .totalSearchArea .search_opt ul button").click(function () {
    $('.search_opt').removeClass('on');
  });
}
/* ============================================================
 * 18. 탭 너비 계산 / 모바일 탭 슬라이드 (layout.js)
 * ============================================================ */
function tab_w() {
  if (window.innerWidth >= 1041) {
    $("#pageTab li").css({
      "width": (100 / $("#pageTab li").length) + "%"
    });
  } else {
    $("#pageTab li").css({
      "width": ""
    });
  }

  if (window.innerWidth >= 1041) {
    $("#pageTab02 li").css({
      "width": (100 / $("#pageTab02 li").length) + "%"
    });
  } else {
    $("#pageTab02 li").css({
      "width": ""
    });
  }

  if (window.innerWidth >= 1041) {
    $("#contTab_line li").css({
      "width": (100 / $("#contTab_line li").length) + "%"
    });
  } else {
    $("#contTab_line li").css({
      "width": ""
    });
  }

  $("#contTab_fix li").each(function () {
    if (window.innerWidth >= 1041) {
      $(this).css({
        "width": (100 / $("#contTab_fix li").length) + "%"
      });
    } else {
      $(this).css({
        "width": ""
      });
    }
  });
}

/* 모바일 탭 슬라이드 전환 */
function mbSlickTab() {
  if (window.innerWidth <= 1041) {
    var tabNum = $('#pageTab .tabList>li').length;

    if (tabNum > 2) {
      var on = $('#pageTab .tabList li').find('.on').parent('li').index();
      $('#pageTab').sly({
        horizontal: 1,
        itemNav: 'centered',
        speed: 300,
        smart: 1,
        activateOn: 'click',
        mouseDragging: 1,
        touchDragging: 1,
        activateMiddle: 1,
        releaseSwing: 1,
        activeClass: 'active',
        startAt: on
      });
      // var frame = new Sly('#pageTab', options).init();

      setTimeout(function () {
        $('#pageTab ul').css('width', function (i) {
          return $(this).width() + 80;
        });
      }, 100)

    }
  } else {
    $('#pageTab').sly(false);
    $('#pageTab .tabList').css('width', 'auto');
  }
}

function mbSlickTab02() {
  if (window.innerWidth <= 1041) {
    var tabNum = $('#contTab_line .tabList>li').length;

    if (tabNum > 1) {
      var on = $('#contTab_line .tabList li').find('.on').parent('li').index();
      $('#contTab_line').sly({
        horizontal: 1,
        itemNav: 'centered',
        speed: 300,
        smart: 1,
        activateOn: 'click',
        mouseDragging: 1,
        touchDragging: 1,
        activateMiddle: 1,
        releaseSwing: 1,
        activeClass: 'active',
        startAt: on
      });
      // var frame = new Sly('#contTab_line', options).init();

      setTimeout(function () {
        $('#contTab_line ul').css('width', function (i) {
          return $(this).width() + 70;
        });
      }, 300)
    }
  } else {
    $('#contTab_line').sly(false);
    $('#contTab_line .tabList').css('width', '100%');
  }
}

function initTabResize() {
  $(window).bind('load resize', function () {
    if (typeof window.pnb_btnTit === 'function') window.pnb_btnTit();
    mbSlickTab();
    mbSlickTab02();
    mbMenuResult();
    // tab_w();

    /** 해제 **/
    mBtnClose(); //모바일메뉴
    if (typeof window.sitemapClose === 'function') window.sitemapClose(); // sitemap
  });
}
/* ============================================================
 * 19. 화면 회전 시 새로고침 (layout.js)
 * ============================================================ */
function initOrientationReload() {
  window.onorientationchange = function () {
    var orientation = window.orientation;
    switch (orientation) {
      case 0:
        //alert('세로모드. 홈버튼이 아래쪽');
        window.location.reload();
        break;
      case 90:
        //alert('가로모드. 홈버튼이 오른쪽.');
        window.location.reload();
        break;
      case -90:
        //alert('가로모드. 홈버튼이 왼쪽.');
        window.location.reload();
        break;
    }
  }
}
/* ============================================================
 * 20. 접근성 (skip menu, 키보드 포커스 이동) (layout.js)
 * ============================================================ */
function initAccessibility() {
  $("#skip_menu a").focusin(function () {
    $("#contents").attr('tabindex', '0');
    $("#gnb").attr('tabindex', '0');
    $("#footer").attr('tabindex', '0');
    typeKeyNav = 1;
  });

  $("#skip_menu").focusout(function () {
    $("#contents").removeAttr('tabindex');
    $("#gnb").removeAttr('tabindex');
    $("#footer").removeAttr('tabindex');
  });

  $(".top_util .moreSiteArea .btn_close").keydown(function (event) {
    var v_keyCode = event.keyCode || event.which;

    if (v_keyCode == 9) {
      if (!event.shiftKey) {
        $(".top_util .moreSiteArea ul li:first-child").find('a').focus();
        return false;
      }
    }
  });

  //gnbON
  $("#gnb>li>a").focusin(function () {
    $(this).trigger('mouseover');
  });

  $("#gnb>li>a").keydown(function (event) {
    var gnb_loc = $(this).parent('li').index();
    var v_keyCode = event.keyCode || event.which;
    if (v_keyCode == 9) {
      if (event.shiftKey) {
        if (gnb_loc > 0) {
          $(this).parent('li').prev('li').find('a').first().trigger('mouseover');
          if ($(this).prev('li').hasClass('child')) {
            if ($("header>nav #gnb>li:nth-child(" + gnb_loc + ") .menuM>li:last-child").hasClass('child')) {
              $("header>nav #gnb>li:nth-child(" + gnb_loc + ") .menuM>li:last-child .menuS>li:last-child").find('a').first().focus();
              return false;
            } else {
              $("header>nav #gnb>li:nth-child(" + gnb_loc + ") .menuM>li:last-child").find('a').first().focus();
              return false;
            }
          }
        } else {
          $(this).trigger('mouseleave');
          $(".top_util .btn_goDream").focus();
          return false;
        }
      }
    }
  });

  //gnb Off
  $("header .logo>a").on('focusout', function (e) {
    $(this).trigger('mouseleave');
  });

  /*
  *GBN 하위 메뉴중 display:none 을 제외한 마지막 객체 제어
  */
  //Show, hide 상태 검증 변수 브라우저별 display:none 띄워쓰기 달라서 경우의 수에 따라 검증 범위 확장
  var TargetState = "[style*='display:none'], [style*='display: none'], [style*='display :none'], [style*='display : none']";

  $("header>nav #gnb>li").not(TargetState).last().find(".menuM>li").not(TargetState).last().find(".menuS>li").not(TargetState).last().on('focusout', function (e) {
    $(this).trigger('mouseleave');
  });

  $("header>nav #gnb>li").not(TargetState).last().find(".menuM>li").not(TargetState).last().on('focusout', function (e) {
    if (!$(this).hasClass("child")) {
      $(this).trigger('mouseleave');
    }
  });

  $('header .gnb_util button:last-child').on('focusout', function (e) {
    $(this).trigger('mouseleave');
  });

  //사이트맵 팝업
  $(".sitemapBox .btn_close").keydown(function (event) {
    var v_keyCode = event.keyCode || event.which;

    if (v_keyCode == 13) {
      $("header .gnb_util .btn_sitemap").focus();
      $(".sitemapBox .btn_close").trigger('click');
      return false;
    }

    if (v_keyCode == 9) {
      if (!event.shiftKey) {
        $('.sitemapBox .map_gnb li:first-child').find('a').focus();
        return false;
      }
    }
  });

  $('.sitemapBox .map_gnb li:first-child a').keydown(function (event) {
    var v_keyCode = event.keyCode || event.which;

    if (v_keyCode == 9) {
      if (event.shiftKey) {
        $('.sitemapBox .btn_close').focus()
        return false;
      }
    }
  });

  //pnb
  $("#pnb .pnb_func .shareBox .btn_close").keydown(function (event) {
    var v_keyCode = event.keyCode || event.which;
    if (v_keyCode == 9) {
      if (!event.shiftKey) {
        $('.shareBox_wrap ul li:first-child').find('a').focus()
        return false;
      }
    }
  });

  $('.shareBox_wrap ul li:first-child a').keydown(function (event) {
    var v_keyCode = event.keyCode || event.which;
    if (v_keyCode == 9) {
      if (event.shiftKey) {
        $("#pnb .pnb_func .shareBox .btn_close").focus()
        return false;
      }
    }
  });
}
/* ============================================================
 * 21. 모바일 접근성 (load/resize 시 tabindex 재설정) (layout.js)
 * ============================================================ */
function initMobileAccessibility() {
  $(window).bind('load resize', function () {
    if ($(window).innerWidth() <= 1041) {

      //gnb
      $("header .logo a").keydown(function (event) {
        var v_keyCode = event.keyCode || event.which;

        if (v_keyCode == 9) {
          if (!event.shiftKey) {
            $('header .top_util a:first-child').focus();
            return false;
          }
        }
      });

      $("header .gnb_util .btn_mypage").keydown(function (event) {
        var v_keyCode = event.keyCode || event.which;

        if (v_keyCode == 9) {
          if (!event.shiftKey) {
            $('header .mBtn_topMenu').focus();
            return false;
          }
        }
      });

      $("header .gnb_util .btn_login").keydown(function (event) {
        var v_keyCode = event.keyCode || event.which;

        if (v_keyCode == 9) {
          if (!event.shiftKey) {
            $('header .mBtn_topMenu').focus();
            return false;
          }
        }
      });

      //mVisual
      $("header .mBtn_topMenu").keydown(function (event) {
        var v_keyCode = event.keyCode || event.which;

        if (v_keyCode == 9) {
          if (event.shiftKey) {
            if ($('header .gnb_util .btn_mypage').length > 0) {
              $('header .gnb_util .btn_mypage').focus();
              return false;
            } else {
              $('header .gnb_util .btn_search').focus();
              return false;
            }
          } else {
            $('#container').find('a').first().focus();
          }
        }
      });

      $("header .gnb_util .btn_search").keydown(function (event) {
        var v_keyCode = event.keyCode || event.which;

        if (v_keyCode == 9) {
          if (event.shiftKey) {
            $('header .logo a').focus();
            return false;
          }
        }
      });

      // bookmark
      $('.snb_bookmark .list .unit').attr('aria-hidden', 'false');
      $('.snb_bookmark .list .unit a').attr('tabindex', '0');

      // tab
      $('#pageTab .slick-slide').attr('aria-hidden', 'false');
      $('#pageTab .slick-slide a').attr('tabindex', '0');
      $('#contTab_line .slick-slide').attr('aria-hidden', 'false');
      $('#contTab_line .slick-slide a').attr('tabindex', '0');
    } else {
      $("#header nav").show();
    }
  });
}
/* ============================================================
 * 22. As-is 탑배너 팝업 (layout.js)
 * ============================================================ */
function initTopBannerPopup() {
  $('.new_header_19 .btn_more').click(function () {
    $('div.pop_home').slideDown(200);
  });

  $('div.pop_home p').hover(function () {
    $(this).addClass('on');
    $(this).find('.btn_s').hide();
    $(this).find('.btn_o').show();
  });

  $('div.pop_home p').mouseout(function (e) {
    $(this).siblings('p').removeClass('on');
    $(this).siblings('p').find('.btn_o').hide();
    $(this).siblings('p').find('.btn_s').show();
  });

  $('div.home_box').hover(function () {
    var btnOn = $('div.pop_home p.on');
    btnOn.removeClass('on');
    if (btnOn) {
      btnOn.find('.btn_o').hide();
      btnOn.find('.btn_s').show();
    }
  });

  $('div.home_box .btn_close').click(function () {
    var btnOn = $('div.pop_home p.on');
    btnOn.removeClass('on');
    if (btnOn) {
      btnOn.find('.btn_o').hide();
      btnOn.find('.btn_s').show();
    }

    $('div.pop_home').slideUp(200);
  });
}