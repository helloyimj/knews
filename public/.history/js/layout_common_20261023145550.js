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
 * - snb_board(SNS 보드) 하단 snb 는 시장뉴스에서 pnb 로 바뀐 것으로 보이며, snb 관련 마크업이 없을 수 있음
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

  // 2-1. MENU_ID / gnb on 기준으로 현재 메뉴 표시 (breadcrumb.js)
  if (typeof window.applyGnbCurrentByMenuId === "function") {
    applyGnbCurrentByMenuId();
  }

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

  // 8. SNS 보드 슬라이더 (inline Script) — #snb_board .snb_bookmark 있을 때만
  initSnsBoardSlider();

  // ---- 여기부터 layout.js  ----

  // 10. 상단 KOTRA 내부사이트 토글 버튼 (layout.js)
  initKotraSiteToggle();

  // 11. gnb 현재 메뉴 on 클래스 세팅 (layout.js)
  initGnbCurrentState();

  // 11-1. pnb: 뼈대·메뉴 채움 + 드롭다운 클릭 + 옵션 UI (breadcrumb.js / html_org 기준)
  // 메인(typeMain)에는 #pnb 없음
  if (!$("body").hasClass("typeMain") && typeof window.initPnb === "function") {
    initPnb();
  }

  // 12. gnb 마우스오버/호버 (PC) (layout.js)
  initGnbHover();

  // 13. 모바일 gnb 메뉴 동작 (layout.js)
  initMobileGnb();

  // 14. Footer top버튼 / 폰트사이즈 / familySite (layout.js)
  initFooterExtras();

  // 15. 스크롤 이벤트 (sticky, top버튼 노출) (layout.js)
  initScrollHandler();

  // 16. (pnb UI → initPnb / js/breadcrumb.js)

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
  $("body.typeSub").prepend(`
    <div id="skip_menu">
      <a href="#contents">본문 바로가기</a>
      <a href="#header">주메뉴 바로가기</a>
      <a href="#footer">푸터 바로가기</a>
    </div>
    <div id="dim"></div>
    <div id="gnb_dim"></div>

        `);

  // 최상단 masthead
  $("#masthead_kotra").html(`
          <!-- masthead -->
          <div class="masthead_kotra">
            <div class="masthead_wrapper">
              <div class="masthead_inner_wrapper">
              <div class="masthead_logo_wrapper">
                <div class="masthead_logo">
                  <a href="javascript:void(0);" target="_blank" aria-label="KOTRA 사이트로 이동 (새 창 열림)">
                  </a>
                </div>
                <div class="masthead_family">
            <button type="button" class="btn_family_more" aria-expanded="false" aria-controls="pop_kotra_family" aria-haspopup="true">
                    <span class="sr-only">KOTRA 사이트 더보기</span>
                  </button>
            <div id="pop_kotra_family" class="pop_kotra_family" role="dialog" aria-label="KOTRA 패밀리 사이트" aria-hidden="true">
              <button type="button" class="btn_close" aria-label="패밀리 사이트 닫기">닫기</button>
              <ul class="list_kotra_family">
                <li><a href="/bigdata/kotraSsoRedirect?targetURL=https://www.kotra.or.kr" target="_blank" class="family_site01" aria-label="kotra 무역투자24 (새 창 열림)">kotra 무역투자24</a></li>
                <li><a href="/bigdata/kotraSsoRedirect?targetURL=https://dream.kotra.or.kr/dream" target="_blank" class="family_site02" aria-label="해외비즈니스 정보 포털 (새 창 열림)">해외비즈니스 정보 포털</a></li>
                <li><a href="/bigdata/kotraSsoRedirect?targetURL=https://www.gep.or.kr/" target="_blank" class="family_site03" aria-label="글로벌 전시포털 (새 창 열림)">글로벌 전시포털</a></li>
                <li><a href="https://www.kotra.or.kr/gtc_kor" target="_blank" class="family_site04" aria-label="KOTRA 해외인재유치센터 (새 창 열림)">KOTRA 해외인재유치센터</a></li>
                <li><a href="/bigdata/kotraSsoRedirect?targetURL=https://www.investkorea.org/" target="_blank" class="family_site05" aria-label="투자유치정보제공 (새 창 열림)">투자유치정보제공</a></li>
                <li><a href="/bigdata/kotraSsoRedirect?targetURL=https://www.buykorea.or.kr/" target="_blank" class="family_site06" aria-label="수출지원 온라인 플랫폼 (새 창 열림)">수출지원 온라인 플랫폼</a></li>
                <li><a href="/bigdata/" target="_blank" class="family_site07" aria-label="빅데이터 서비스 (새 창 열림)">빅데이터 서비스</a></li>
                <li><a href="/bigdata/kotraSsoRedirect?targetURL=https://president.globalwindow.org" target="_blank" class="family_site08" aria-label="경제외교 활용포털 (새 창 열림)">경제외교 활용포털</a></li>
                <li><a href="/bigdata/kotraSsoRedirect?targetURL=https://www.kotra.or.kr/kodits" target="_blank" class="family_site09" aria-label="방산물자교역지원센터 (새 창 열림)">방산물자교역지원센터</a></li>
                <li><a href="/bigdata/kotraSsoRedirect?targetURL=https://ombudsman.kotra.or.kr/ob-kr" target="_blank" class="family_site10" aria-label="외투기업고충처리 (새 창 열림)">외투기업고충처리</a></li>
                <li><a href="https://www.exportvoucher.com" target="_blank" class="family_site11" aria-label="수출바우처 · 지사화 (새 창 열림)">수출바우처 · 지사화</a></li>
              </ul>
                </div>
              </div>
        </div>
        <div class="masthead_links">
          <ul class="masthead_menus">
                  <li>
                    <a href="javascript:void(0);" target="_self">로그아웃</a>
                    <!-- <a href="javascript:void(0);">로그인</a> -->
                  </li>
                  <li>
                    <a href="javascript:void(0);" target="_self">홍길동님</a>
                    <!-- <a href="https://www.kotra.or.kr/kp/cmm/mber/sbscrb/selectSbscrbUsrTy.do">회원가입</a> -->
                  </li>
            <!-- <li>
                    <a href="javascript:void(0);" target="_self">한국이디에스</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);" target="_self">마이코트라 로고</a>
            </li> -->
                </ul>
                <ul class="masthead_utils masthead_utils">
                  <li>
              <button type="button" class="btn_sitemap" aria-label="사이트맵" aria-expanded="false" aria-haspopup="dialog"><span>사이트맵</span></button>
                  </li>
                </ul>
            </div>
              </div>
                  </div>
      <div class="sitemapBox" aria-hidden="true">
        <div class="sitemap_wrap">
          <button type="button" class="btn_close" aria-label="사이트맵 닫기">닫기</button>
          <h2 class="box_tit">사이트맵</h2>
          <div class="box_ct">
            <ul class="map_gnb">
              <li><a href="#" title="뉴스">뉴스</a></li>
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
                    <li>
                      <a href="/kotranews/cms/com/index.do?MENU_ID=70" data-sub="N" target="_self">전체</a>
            </li>
                    <li>
                      <a href="/kotranews/cms/com/index.do?MENU_ID=80" data-sub="N" target="_self">경제∙무역</a>
            </li>
                    <li>
                      <a href="/kotranews/cms/com/index.do?MENU_ID=90" data-sub="N" target="_self">통상∙규제</a>
            </li>
                    <li>
                      <a href="/kotranews/cms/com/index.do?MENU_ID=100" data-sub="N" target="_self">투자진출</a>
            </li>
                    <li>
                      <a href="/kotranews/cms/com/index.do?MENU_ID=110" data-sub="N" target="_self">현장∙인터뷰</a>
            </li>
            <li class="child">
                      <a href="/kotranews/cms/com/index.do?MENU_ID=1480" data-sub="Y" target="_self">기고</a>

              <ul class="menuS">
                <li class="">
                          <a href="/kotranews/cms/com/index.do?MENU_ID=130" title="" data-sub="N" target="_self">전문가기고</a>
                </li>
                <li class="">
                          <a href="/kotranews/cms/com/index.do?MENU_ID=140" title="" data-sub="N" target="_self">직원기고</a>
                </li>
              </ul>
            </li>
                    <li>
                      <a href="/kotranews/cms/com/index.do?MENU_ID=290" data-sub="N" target="_self">글로벌 이슈 모니터링</a>
            </li>
            <li class="child">
                      <a href="/kotranews/cms/com/index.do?MENU_ID=1550" data-sub="Y" target="_self">글로벌 공급망 동향</a>

              <ul class="menuS">
                <li class="">
                          <a href="/kotranews/cms/com/index.do?MENU_ID=1360" title="" data-sub="N" target="_self">동향뉴스</a>
                </li>
                <li class="">
                          <a href="/kotranews/cms/com/index.do?MENU_ID=1560" title="" data-sub="N" target="_self">글로벌 공급망 인사이트</a>
                </li>
              </ul>
            </li>
            <li class="child">
                      <a href="/kotranews/cms/com/index.do?MENU_ID=1500" data-sub="Y" target="_self">글로벌 ESG 정보</a>

              <ul class="menuS">
                <li class="">
                          <a href="/kotranews/cms/com/index.do?MENU_ID=1520" title="" data-sub="N" target="_self">동향뉴스</a>
                </li>
                <li class="">
                          <a href="/kotranews/cms/com/index.do?MENU_ID=1510" title="" data-sub="N" target="_self">연관 보고서</a>
                </li>
                <li class="">
                          <a href="/kotranews/cms/com/index.do?MENU_ID=1570" title="" data-sub="N" target="_self">ESG 활용지원센터</a>
                </li>
              </ul>
            </li>
                    <li>
                      <a href="/kotranews/cms/com/index.do?MENU_ID=1580" data-sub="N" target="_self">미국 통상정책 주요 동향</a>
            </li>
            <li class="child">
                      <a href="/kotranews/cms/com/index.do?MENU_ID=1470" data-sub="Y" target="_self">핫클립</a>

              <ul class="menuS">
                <li class="">
                          <a href="/kotranews/cms/com/index.do?MENU_ID=1590" title="" data-sub="N" target="_self">우크라이나 사태 해외동향</a>
                </li>
                <li class="">
                          <a href="/kotranews/cms/com/index.do?MENU_ID=1490" title="" data-sub="N" target="_self">중동 관련 주요 동향</a>
                </li>
                <li class="">
                          <a href="/kotranews/cms/com/index.do?MENU_ID=1460" title="" data-sub="N" target="_self">지금 수출 현장은</a>
                </li>
                <li class="">
                          <a href="/kotranews/cms/com/index.do?MENU_ID=120" title="" data-sub="N" target="_self">기획리포트</a>
                </li>
                <li class="">
                          <a href="/kotranews/cms/com/index.do?MENU_ID=150" title="" data-sub="N" target="_self">일자리동향</a>
                </li>
              </ul>
            </li>
                    <li>
                      <a href="/kotranews/cms/com/index.do?MENU_ID=1630" data-sub="Y" target="_self">산업뉴스콕콕</a>
            </li>
          </ul>
        </li>

        <li class="child">
                  <h3 class="txtHidden">상품·산업</h3>
                  <ul class="menuM menuStep">
                    <li>
                      <a href="/kotranews/cms/com/index.do?MENU_ID=170" data-sub="N" target="_self">전체</a>
                    </li>
                    <li>
                      <a href="/kotranews/cms/com/index.do?MENU_ID=180" data-sub="N" target="_self">트렌드</a>
                    </li>
                    <li>
                      <a href="/kotranews/cms/com/index.do?MENU_ID=190" data-sub="N" target="_self">상품DB</a>
                    </li>
                    <li>
                      <a href="/kotranews/cms/com/index.do?MENU_ID=200" data-sub="N" target="_self">국별주요산업</a>
                    </li>
                    <li>
                      <a href="/kotranews/cms/com/index.do?MENU_ID=210" data-sub="N" target="_self">해외인증정보</a>
                    </li>
          </ul>
        </li>
        <li class="child">
                  <h3 class="txtHidden">국가·지역정보</h3>
                  <ul class="menuM menuStep">
                    <li>
                      <a href="/kotranews/cms/com/index.do?MENU_ID=220" data-sub="N" target="_self">국가지역정보</a>
                    </li>
            <li class="child">
                      <a href="/kotranews/cms/com/index.do?MENU_ID=240" data-sub="Y" target="_self">북한정보</a>
              <ul class="menuS">
                        <li class="">
                          <a href="/kotranews/cms/com/index.do?MENU_ID=520" title="" data-sub="N" target="_self">북한정보</a>
                        </li>
                        <li class="">
                          <a href="/kotranews/cms/com/index.do?MENU_ID=530" title="" data-sub="N" target="_self">북한대외무역동향</a>
                        </li>
              </ul>
            </li>
                    <li>
                      <a href="/kotranews/cms/com/index.do?MENU_ID=250" data-sub="N" target="_self">진출전략</a>
                    </li>
                    <li>
                      <a href="/kotranews/cms/com/index.do?MENU_ID=260" data-sub="N" target="_self">출장자료</a>
                    </li>
                    <li>
                      <a href="/kotranews/cms/com/index.do?MENU_ID=270" data-sub="N" target="_self">무역관뉴스레터</a>
                    </li>
          </ul>
        </li>
        <li class="child">
                  <h3 class="txtHidden">보고서</h3>
                  <ul class="menuM menuStep">
                    <li>
                      <a href="/kotranews/cms/com/index.do?MENU_ID=280" data-sub="N" target="_self">전체</a>
                    </li>
          </ul>
        </li>
        <li class="child">
                  <h3 class="txtHidden">멀티미디어뉴스</h3>
                  <ul class="menuM menuStep">
                    <li>
                      <a href="/kotranews/cms/com/index.do?MENU_ID=540" data-sub="N" target="_self">동영상뉴스</a>
                    </li>
                    <li>
                      <a href="/kotranews/cms/com/index.do?MENU_ID=310" data-sub="N" target="_self">포토뉴스</a>
                    </li>
                    <li>
                      <a href="/kotranews/cms/com/index.do?MENU_ID=320" data-sub="N" target="_self">카드뉴스</a>
                    </li>
          </ul>
        </li>
        <li class="child">
                  <h3 class="txtHidden">해외투자</h3>
                  <ul class="menuM menuStep">
                    <li>
                      <a href="/kotranews/cms/com/index.do?MENU_ID=350" data-sub="N" target="_self">해외투자안내</a>
                    </li>
            <li class="child">
                      <a href="/kotranews/cms/com/index.do?MENU_ID=360" data-sub="Y" target="_self">직접투자절차</a>
              <ul class="menuS">
                        <li class="">
                          <a href="/kotranews/cms/com/index.do?MENU_ID=570" title="" data-sub="N" target="_self">해외투자준비</a>
                        </li>
                        <li class="">
                          <a href="https://www.investkorea.org/ik-kr/cntnts/i-237/web.do" title="새 창 열림" data-sub="N" target="_blank" aria-label="청산·국내복귀(새 창 열림)" rel="noopener noreferrer">청산·국내복귀</a>
                        </li>
                        <li class="">
                          <a href="/kotranews/cms/com/index.do?MENU_ID=600" title="" data-sub="N" target="_self">FAQ</a>
                        </li>
              </ul>
            </li>
            <li class="child">
                      <a href="/kotranews/cms/com/index.do?MENU_ID=370" data-sub="Y" target="_self">국별참고자료</a>
              <ul class="menuS">
                        <li class="">
                          <a href="/kotranews/cms/com/index.do?MENU_ID=610" title="" data-sub="N" target="_self">법규·서식</a>
                        </li>
                        <li class="">
                          <a href="/kotranews/cms/com/index.do?MENU_ID=620" title="" data-sub="N" target="_self">진출기업지원세미나자료</a>
                        </li>
              </ul>
            </li>
                    <li>
                      <a href="/kotranews/cms/com/index.do?MENU_ID=1350" data-sub="N" target="_self">진출기업정보</a>
                    </li>
          </ul>
        </li>
            <li class="child">
                  <h3 class="txtHidden">열린마당</h3>
                  <ul class="menuM menuStep">
                    <li>
                      <a href="/kotranews/cms/com/index.do?MENU_ID=1310" data-sub="Y" target="_self">공지사항</a>
                    </li>
                    <li>
                      <a href="/kotranews/cms/com/index.do?MENU_ID=1320" data-sub="Y" target="_self">고객조사제안 </a>
                    </li>
                    <li>
                      <a href="/kotranews/cms/com/index.do?MENU_ID=670" data-sub="Y" target="_self">뉴스레터신청</a>
                    </li>
                    <li class="child">
                      <a href="/kotranews/cms/com/index.do?MENU_ID=1340" data-sub="Y" target="_self">고객문의</a>

              <ul class="menuS">
                        <li class="" style="display: none">
                          <a href="/kotranews/cms/com/index.do?MENU_ID=640" title="" data-sub="Y" target="_self">고객문의</a>
                        </li>
              </ul>
            </li>
            <li class="child">
                      <a href="/kotranews/cms/com/index.do?MENU_ID=680" data-sub="Y" target="_self">사이트이용</a>
              <ul class="menuS">
                        <li class="">
                          <a href="/kotranews/cms/com/index.do?MENU_ID=710" title="" data-sub="Y" target="_self">API</a>
                        </li>
                        <li class="">
                          <a href="/kotranews/cms/com/index.do?MENU_ID=720" title="" data-sub="Y" target="_self">RSS2.0</a>
                        </li>
                        <li class="" style="display: none">
                          <a href="/kotranews/cms/com/index.do?MENU_ID=750" title="" data-sub="Y" target="_self">뷰어다운로드</a>
                        </li>
              </ul>
            </li>
            <li class="child">
                      <a href="/kotranews/cms/com/index.do?MENU_ID=730" data-sub="Y" target="_self">정책∙방침</a>
              <ul class="menuS">
                        <li class="" style="display: none">
                          <a href="/kotranews/cms/com/index.do?MENU_ID=1010" title="" data-sub="Y" target="_self">저작권정책</a>
                        </li>
                <li class="">
                          <a href="/kotranews/cms/com/index.do?MENU_ID=1400" title="" data-sub="Y" target="_self">개인정보처리방침</a>
                          <ul class="menuSS">
                            <li class="">
                              <a href="/kotranews/cms/com/index.do?MENU_ID=1430" title="" target="_self">개인정보처리방침</a>
                            </li>
                            <li class="" style="display: none">
                              <a href="/kotranews/cms/com/index.do?MENU_ID=1020" title="" target="_self">개인정보처리방침(2022.05.16)</a>
                            </li>
                            <li class="" style="display: none">
                              <a href="/kotranews/cms/com/index.do?MENU_ID=1410" title="" target="_self">개인정보처리방침(2021.07.07)</a>
                            </li>
                  </ul>
                </li>
                        <li class="" style="display: none">
                          <a href="/kotranews/cms/com/index.do?MENU_ID=1030" title="" data-sub="Y" target="_self">공공데이터개방</a>
                        </li>
              </ul>
            </li>
          </ul>
        </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="map_func"></div>
        <!-- </div> -->
      </div>
    </div>
    `);

  initMastheadFamilyPopup();

  /* 마스트헤드 안 중복 .sitemapBox 제거 → section.sitemapBox 단일 패널만 사용 */
  $("#masthead_kotra .sitemapBox").remove();

  /* 사이트맵 패널: 마스트헤드 다음, #container 앞. 목업에서 슬롯이 주석이면 만든다. */
  if (!$("section.sitemapBox").length) {
    var $sitemapSlot = $('<section class="sitemapBox" aria-hidden="true"></section>');
    if ($("#masthead_kotra").length) {
      $sitemapSlot.insertAfter("#masthead_kotra");
    } else if ($("#container").length) {
      $sitemapSlot.insertBefore("#container");
    } else {
      $sitemapSlot.appendTo("body");
    }
  }

  // 헤더. 목업에서 #header 를 주석 처리하면 #gnb 가 없어
  // initPnbFromGnb() 가 pnb_nav > ul 을 채우지 못하므로 숨긴 슬롯을 만든다.
  if (!$("#header").length) {
    var $hiddenHeader = $(
      '<div id="header" class="isHide" aria-hidden="true" style="display:none"></div>'
    );
    if ($("section.sitemapBox").length) {
      $hiddenHeader.insertAfter("section.sitemapBox");
    } else if ($("#masthead_kotra").length) {
      $hiddenHeader.insertAfter("#masthead_kotra");
    } else {
      $hiddenHeader.prependTo("body");
    }
  }
  // $('#header').html(`
  //   <header>
  //   <h1 class="logo">
  //     <a href="https://dream.kotra.or.kr/kotranews/index.do">
  //       <img src="https://dream.kotra.or.kr/ajaxa/fileCpnt/fileView.do?gbn=x01&SITE_GROUP_NO=2&SITE_NO=3" alt="KOTRA 해외시장뉴스" />
  //     </a>
  //   </h1>
  //   <button type="button" title="전체메뉴" class="mBtn_topMenu">전체메뉴</button>

  //   <!-- 모바일 전용 -->
  //   <div class="top_util">
  //     <a href="javascript:void(0);" class="btn_topLogin" title="로그인"><span>로그인</span></a>
  //     <a href="https://www.kotra.or.kr/kp/cmm/mber/sbscrb/selectSbscrbUsrTy.do" class="btn_join" title="회원가입"><span>회원가입</span></a>

  //     <div class="new_header_19">
  //       <div class="clearfix">
  //         <div class="fL">
  //           <a href="https://www.kotra.or.kr/kp/kotra/cmm/sso/loginBySSO.do?div=kp" target="_blank" title="새 창 열림">
  //             <img src="https://dream.kotra.or.kr/type/common/img/common/logo_t_06_s.png" alt="KOTRA 지원안내" />
  //           </a>
  //           <a href="https://www.buykorea.or.kr/" target="_blank" title="새 창 열림" class="btn_s">
  //             <img src="https://dream.kotra.or.kr/type/news/img/layout/logo_t_07_s.png" alt="바이코리아(Seller)" title="바이코리아(Seller)" />
  //           </a>
  //           <a href="https://www.investkorea.org/" target="_blank" title="새 창 열림" class="btn_s">
  //             <img src="https://dream.kotra.or.kr/type/news/img/layout/logo_t_05_s.png" alt="Inverst KOREA" title="Inverst KOREA" />
  //           </a>
  //           <button type="button" class="btn_more"><span>사이트 더보기</span></button>
  //         </div>
  //       </div>
  //       <div class="pop_home" style="display: none">
  //         <div class="home_box">
  //           <div>
  //             <h3>KOTRA 사이트</h3>
  //             <p>
  //               <a href="https://dream.kotra.or.kr/kp/kotraSsoUrl.do" target="_blank" class="btn_s" style="display: inline-block" title="새 창 열림">
  //                 <img src="https://dream.kotra.or.kr/type/common/img/common/more_siteLogo12.png" alt="KOTRA 무역투자24" title="KOTRA 무역투자24" />
  //               </a>
  //               <a href="https://dream.kotra.or.kr/kp/kotraSsoUrl.do" target="_blank" class="btn_o" style="display: none" title="새 창 열림">
  //                 <strong>KOTRA 무역투자24</strong>
  //               </a>
  //             </p>
  //             <p>
  //               <a href="https://dream.kotra.or.kr/dream/index.do" target="_blank" class="btn_s" title="새 창 열림">
  //                 <img src="https://dream.kotra.or.kr/type/news/img/layout/logo_t_12.png" alt="해외경제정보드림" title="해외경제정보드림" />
  //               </a>
  //               <a href="https://dream.kotra.or.kr/dream/index.do" target="_blank" class="btn_o" style="display: none" title="새 창 열림">
  //                 <strong>해외경제정보드림</strong>
  //               </a>
  //             </p>
  //             <p>
  //               <a href="https://www.exportvoucher.com" target="_blank" class="btn_s" title="새 창 열림">
  //                 <img src="https://dream.kotra.or.kr/type/news/img/layout/logo_t_03.png" alt="수출지원기반 활용사업" title="수출지원기반 활용사업" />
  //               </a>
  //               <a href="https://www.exportvoucher.com" target="_blank" class="btn_o" style="display: none" title="새 창 열림">
  //                 <strong>수출바우처 · 지사화</strong>
  //               </a>
  //             </p>
  //             <p class="">
  //               <a href="https://dream.kotra.or.kr/ob/kotraSsoUrl.do" target="_blank" class="btn_s" title="새 창 열림" style="">
  //                 <img src="https://dream.kotra.or.kr/type/news/img/layout/logo_t_04.png" alt="옴부즈만" title="옴부즈만" />
  //               </a>
  //               <a href="https://dream.kotra.or.kr/ob/kotraSsoUrl.do" target="_blank" class="btn_o" style="display: none" title="새 창 열림">
  //                 <strong>외투기업고충처리</strong>
  //               </a>
  //             </p>
  //             <p class="">
  //               <a href="https://dream.kotra.or.kr/iv/kotraSsoUrl.do" target="_blank" class="btn_s" title="새 창 열림" style="">
  //                 <img src="https://dream.kotra.or.kr/type/news/img/layout/logo_t_05.png" alt="Inverst KOREA" title="Inverst KOREA" />
  //               </a>
  //               <a href="https://dream.kotra.or.kr/iv/kotraSsoUrl.do" target="_blank" class="btn_o" style="display: none" title="새 창 열림">
  //                 <strong>투자유치정보제공</strong>
  //               </a>
  //             </p>
  //             <p class="">
  //               <a href="https://dream.kotra.or.kr/ge/kotraSsoUrl.do" target="_blank" class="btn_s" style="display: inline-block" title="새 창 열림">
  //                 <img src="https://dream.kotra.or.kr/type/news/img/layout/logo_t_06.png" alt="글로벌 전시포털" title="글로벌 전시포털" />
  //               </a>
  //               <a href="https://dream.kotra.or.kr/ge/kotraSsoUrl.do" target="_blank" class="btn_o" style="display: none" title="새 창 열림">
  //                 <strong>국내 · 해외전시정보</strong>
  //               </a>
  //             </p>
  //             <p class="">
  //               <a href="https://dream.kotra.or.kr/bk/kotraSsoUrl.do" target="_blank" class="btn_s" title="새 창 열림" style="">
  //                 <img src="https://dream.kotra.or.kr/type/news/img/layout/logo_t_07.png" alt="바이코리아(Seller)" title="바이코리아(Seller)" />
  //               </a>
  //               <a href="https://dream.kotra.or.kr/bk/kotraSsoUrl.do" target="_blank" class="btn_o" style="display: none" title="새 창 열림">
  //                 <strong>수출지원 온라인 플랫폼</strong>
  //               </a>
  //             </p>
  //             <p class="">
  //               <a href="https://dream.kotra.or.kr/gw/kotraSsoUrl.do" target="_blank" class="btn_s" title="새 창 열림" style="">
  //                 <img src="https://dream.kotra.or.kr/type/news/img/layout/logo_t_08.png" alt="경제외교 활용포털" title="경제외교 활용포털" />
  //               </a>
  //               <a href="https://dream.kotra.or.kr/gw/kotraSsoUrl.do" target="_blank" class="btn_o" style="display: none" title="새 창 열림">
  //                 <strong>경제외교 활용포털</strong>
  //               </a>
  //             </p>
  //             <p class="">
  //               <a href="https://www.kotra.or.kr/gtc_kor/index.do" target="_blank" class="btn_s" title="새 창 열림" style="">
  //                 <img src="https://dream.kotra.or.kr/type/news/img/layout/logo_t_09.png" alt="Contract KOREA" title="Contract KOREA" />
  //               </a>
  //               <a href="https://www.kotra.or.kr/gtc_kor/index.do" target="_blank" class="btn_o" style="display: none" title="새 창 열림">
  //                 <strong>해외전문인력유치센터</strong>
  //               </a>
  //             </p>
  //             <p class="">
  //               <a href="https://dream.kotra.or.kr/kd/kotraSsoUrl.do" target="_blank" class="btn_s" title="새 창 열림" style="">
  //                 <img src="https://dream.kotra.or.kr/type/news/img/layout/logo_t_10.png" alt="Kodits" title="Kodits" />
  //               </a>
  //               <a href="https://dream.kotra.or.kr/kd/kotraSsoUrl.do" target="_blank" class="btn_o" style="display: none" title="새 창 열림">
  //                 <strong>방산물자교역지원센터</strong>
  //               </a>
  //             </p>
  //             <p class="">
  //               <a href="https://dream.kotra.or.kr/bd/kotraSsoUrl.do" target="_blank" class="btn_s" title="새 창 열림" style="">
  //                 <img src="https://dream.kotra.or.kr/type/news/img/layout/logo_t_13.png" alt="무역투자빅데이터" title="무역투자빅데이터" />
  //               </a>
  //               <a href="https://dream.kotra.or.kr/bd/kotraSsoUrl.do" target="_blank" class="btn_o" style="display: none" title="새 창 열림">
  //                 <strong>무역투자빅데이터</strong>
  //               </a>
  //             </p>
  //           </div>
  //           <button type="button" class="btn_close"><span>닫기</span></button>
  //         </div>
  //       </div>
  //     </div>
  //     <a href="https://dream.kotra.or.kr/dream/index.do" class="btn_goDream" target="_blank" title="해외경제정보드림 새 창 열림"><span>해외경제정보드림</span></a>
  //   </div>

  //   <nav>
  //     <ul id="gnb">
  //       <li class="child">
  //         <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=10" data-sub="Y" target="_self" class="10">뉴스</a>
  //         <p class="gnbTit">
  //           <b>뉴스</b>
  //           <span></span>
  //         </p>

  //         <ul class="menuM">
  //           <li class="emptyArea">
  //             <p class="exclam Orange">좌측 메뉴를 클릭하시면 상세 메뉴정보를 확인하실 수 있습니다.</p>
  //           </li>
  //           <li class="">
  //             <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=70" class="70" data-sub="N" target="_self">전체</a>
  //           </li>
  //           <li class="">
  //             <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=80" class="80" data-sub="N" target="_self">경제∙무역</a>
  //           </li>
  //           <li class="">
  //             <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=90" class="90" data-sub="N" target="_self">통상∙규제</a>
  //           </li>
  //           <li class="">
  //             <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=100" class="100" data-sub="N" target="_self">투자진출</a>
  //           </li>
  //           <li class="">
  //             <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=110" class="110" data-sub="N" target="_self">현장∙인터뷰</a>
  //           </li>
  //           <li class="child">
  //             <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1480" class="1480" data-sub="Y" target="_self">기고</a>
  //             <ul class="menuS">
  //               <li class="">
  //                 <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=130" class="130" title="" data-sub="N" target="_self">전문가기고</a>
  //               </li>
  //               <li class="">
  //                 <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=140" class="140" title="" data-sub="N" target="_self">직원기고</a>
  //               </li>
  //             </ul>
  //           </li>
  //           <li class="">
  //             <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=290" class="290" data-sub="N" target="_self">글로벌 이슈 모니터링</a>
  //           </li>
  //           <li class="child">
  //             <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1550" class="1550" data-sub="Y" target="_self">글로벌 공급망 동향</a>
  //             <ul class="menuS">
  //               <li class="">
  //                 <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1360" class="1360" title="" data-sub="N" target="_self">동향뉴스</a>
  //               </li>
  //               <li class="">
  //                 <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1560" class="1560" title="" data-sub="N" target="_self">글로벌 공급망 인사이트</a>
  //               </li>
  //             </ul>
  //           </li>
  //           <li class="child">
  //             <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1500" class="1500" data-sub="Y" target="_self">글로벌 ESG 정보</a>
  //             <ul class="menuS">
  //               <li class="">
  //                 <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1520" class="1520" title="" data-sub="N" target="_self">동향뉴스</a>
  //               </li>
  //               <li class="">
  //                 <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1510" class="1510" title="" data-sub="N" target="_self">연관 보고서</a>
  //               </li>
  //               <li class="">
  //                 <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1570" class="1570" title="" data-sub="N" target="_self">ESG 활용지원센터</a>
  //               </li>
  //             </ul>
  //           </li>
  //           <li class="">
  //             <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1580" class="1580" data-sub="N" target="_self">미국 통상정책 주요 동향</a>
  //           </li>
  //           <li class="child">
  //             <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1470" class="1470" data-sub="Y" target="_self">핫클립</a>
  //             <ul class="menuS">
  //               <li class="">
  //                 <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1590" class="1590" title="" data-sub="N" target="_self">우크라이나 사태 해외동향</a>
  //               </li>
  //               <li class="">
  //                 <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1490" class="1490" title="" data-sub="N" target="_self">중동 관련 주요 동향</a>
  //               </li>
  //               <li class="">
  //                 <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1460" class="1460" title="" data-sub="N" target="_self">지금 수출 현장은</a>
  //               </li>
  //               <li class="">
  //                 <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=120" class="120" title="" data-sub="N" target="_self">기획리포트</a>
  //               </li>
  //               <li class="">
  //                 <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=150" class="150" title="" data-sub="N" target="_self">일자리동향</a>
  //               </li>
  //             </ul>
  //           </li>
  //           <li class="">
  //             <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1630" class="1630" data-sub="Y" target="_self">산업뉴스콕콕</a>
  //           </li>
  //         </ul>
  //       </li>

  //       <li class="child">
  //         <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=20" data-sub="Y" target="_self" class="20">상품·산업</a>
  //         <p class="gnbTit"><b>상품·산업</b><span></span></p>
  //         <ul class="menuM">
  //           <li class="emptyArea"><p class="exclam Orange">좌측 메뉴를 클릭하시면 상세 메뉴정보를 확인하실 수 있습니다.</p></li>
  //           <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=170" class="170" data-sub="N" target="_self">전체</a></li>
  //           <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=180" class="180" data-sub="N" target="_self">트렌드</a></li>
  //           <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=190" class="190" data-sub="N" target="_self">상품DB</a></li>
  //           <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=200" class="200" data-sub="N" target="_self">국별주요산업</a></li>
  //           <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=210" class="210" data-sub="N" target="_self">해외인증정보</a></li>
  //         </ul>
  //       </li>

  //       <li class="child">
  //         <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=30" data-sub="Y" target="_self" class="30">국가·지역정보</a>
  //         <p class="gnbTit"><b>국가·지역정보</b><span></span></p>
  //         <ul class="menuM">
  //           <li class="emptyArea"><p class="exclam Orange">좌측 메뉴를 클릭하시면 상세 메뉴정보를 확인하실 수 있습니다.</p></li>
  //           <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=220" class="220" data-sub="N" target="_self">국가지역정보</a></li>
  //           <li class="child">
  //             <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=240" class="240" data-sub="Y" target="_self">북한정보</a>
  //             <ul class="menuS">
  //               <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=520" class="520" title="" data-sub="N" target="_self">북한정보</a></li>
  //               <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=530" class="530" title="" data-sub="N" target="_self">북한대외무역동향</a></li>
  //             </ul>
  //           </li>
  //           <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=250" class="250" data-sub="N" target="_self">진출전략</a></li>
  //           <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=260" class="260" data-sub="N" target="_self">출장자료</a></li>
  //           <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=270" class="270" data-sub="N" target="_self">무역관뉴스레터</a></li>
  //         </ul>
  //       </li>

  //       <li class="child">
  //         <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=40" data-sub="Y" target="_self" class="40">보고서</a>
  //         <p class="gnbTit"><b>보고서</b><span></span></p>
  //         <ul class="menuM">
  //           <li class="emptyArea"><p class="exclam Orange">좌측 메뉴를 클릭하시면 상세 메뉴정보를 확인하실 수 있습니다.</p></li>
  //           <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=280" class="280" data-sub="N" target="_self">전체</a></li>
  //         </ul>
  //       </li>

  //       <li class="child">
  //         <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=50" data-sub="Y" target="_self" class="50">멀티미디어뉴스</a>
  //         <p class="gnbTit"><b>멀티미디어뉴스</b><span></span></p>
  //         <ul class="menuM">
  //           <li class="emptyArea"><p class="exclam Orange">좌측 메뉴를 클릭하시면 상세 메뉴정보를 확인하실 수 있습니다.</p></li>
  //           <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=540" class="540" data-sub="N" target="_self">동영상뉴스</a></li>
  //           <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=310" class="310" data-sub="N" target="_self">포토뉴스</a></li>
  //           <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=320" class="320" data-sub="N" target="_self">카드뉴스</a></li>
  //         </ul>
  //       </li>

  //       <li class="child">
  //         <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=60" data-sub="Y" target="_self" class="60">해외투자</a>
  //         <p class="gnbTit"><b>해외투자</b><span></span></p>
  //         <ul class="menuM">
  //           <li class="emptyArea"><p class="exclam Orange">좌측 메뉴를 클릭하시면 상세 메뉴정보를 확인하실 수 있습니다.</p></li>
  //           <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=350" class="350" data-sub="N" target="_self">해외투자안내</a></li>
  //           <li class="child">
  //             <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=360" class="360" data-sub="Y" target="_self">직접투자절차</a>
  //             <ul class="menuS">
  //               <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=570" class="570" title="" data-sub="N" target="_self">해외투자준비</a></li>
  //               <li class=""><a href="https://www.investkorea.org/ik-kr/cntnts/i-237/web.do" class="590" title="새 창 열림" data-sub="N" target="_blank" aria-label="청산·국내복귀(새 창 열림)" rel="noopener noreferrer">청산·국내복귀</a></li>
  //               <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=600" class="600" title="" data-sub="N" target="_self">FAQ</a></li>
  //             </ul>
  //           </li>
  //           <li class="child">
  //             <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=370" class="370" data-sub="Y" target="_self">국별참고자료</a>
  //             <ul class="menuS">
  //               <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=610" class="610" title="" data-sub="N" target="_self">법규&middot;서식</a></li>
  //               <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=620" class="620" title="" data-sub="N" target="_self">진출기업지원세미나자료</a></li>
  //             </ul>
  //           </li>
  //           <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1350" class="1350" data-sub="N" target="_self">진출기업정보</a></li>
  //         </ul>
  //       </li>

  //       <li class="child" style="display: none">
  //         <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=400" data-sub="Y" target="_self" class="400">열린마당</a>
  //         <p class="gnbTit"><b>열린마당</b><span></span></p>
  //         <ul class="menuM">
  //           <li class="emptyArea"><p class="exclam Orange">좌측 메뉴를 클릭하시면 상세 메뉴정보를 확인하실 수 있습니다.</p></li>
  //           <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1310" class="1310" data-sub="Y" target="_self">공지사항</a></li>
  //           <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1320" class="1320" data-sub="Y" target="_self">고객조사제안 </a></li>
  //           <li class="" style="display: none"><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=670" class="670" data-sub="Y" target="_self">뉴스레터신청</a></li>
  //           <li class="child">
  //             <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1340" class="1340" data-sub="Y" target="_self">고객문의</a>
  //             <ul class="menuS">
  //               <li class="" style="display: none"><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=640" class="640" title="" data-sub="Y" target="_self">고객문의</a></li>
  //             </ul>
  //           </li>
  //           <li class="child">
  //             <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=680" class="680" data-sub="Y" target="_self">사이트이용</a>
  //             <ul class="menuS">
  //               <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=710" class="710" title="" data-sub="Y" target="_self">API</a></li>
  //               <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=720" class="720" title="" data-sub="Y" target="_self">RSS2.0</a></li>
  //               <li class="" style="display: none"><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=750" class="750" title="" data-sub="Y" target="_self">뷰어다운로드</a></li>
  //             </ul>
  //           </li>
  //           <li class="child">
  //             <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=730" class="730" data-sub="Y" target="_self">정책∙방침</a>
  //             <ul class="menuS">
  //               <li class="" style="display: none"><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1010" class="1010" title="" data-sub="Y" target="_self">저작권정책</a></li>
  //               <li class="">
  //                 <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1400" class="1400" title="" data-sub="Y" target="_self">개인정보처리방침</a>
  //                 <ul class="menuX" style="display: none">
  //                   <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1430" class="1430" title="" target="_self">개인정보처리방침</a></li>
  //                   <li class="" style="display: none"><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1020" class="1020" title="" target="_self">개인정보처리방침(2022.05.16)</a></li>
  //                   <li class="" style="display: none"><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1410" class="1410" title="" target="_self">개인정보처리방침(2021.07.07)</a></li>
  //                 </ul>
  //               </li>
  //               <li class="" style="display: none"><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1030" class="1030" title="" data-sub="Y" target="_self">공공데이터개방</a></li>
  //             </ul>
  //           </li>
  //         </ul>
  //       </li>

  //       <li class="" style="display: none">
  //         <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=770" data-sub="Y" target="_self" class="770">로그인</a>
  //         <p class="gnbTit"><b>로그인</b><span></span></p>
  //       </li>
  //     </ul>
  //   </nav>

  //   <div class="gnb_util">
  //     <fieldset class="totalSearchArea">
  //       <legend>메뉴검색</legend>
  //       <div class="search_opt">
  //         <button type="button" title="검색어를 입력하세요" class="btn_searchOpt" name="tDiv" value="ALL">통합검색</button>
  //         <ul>
  //           <li><button type="button" value="ALL" title="통합검색">통합검색</button></li>
  //           <li><button type="button" value="TITLE" title="제목">제목</button></li>
  //           <li><button type="button" value="CONT" title="내용">내용</button></li>
  //         </ul>
  //       </div>
  //       <input type="text" title="검색어입력" class="search_inp" onkeyup="fn_enterkey()" />
  //       <button type="button" class="btn_search" title="검색"><span>검색</span></button>
  //     </fieldset>
  //     <button type="button" class="btn_sitemap" title="사이트맵"><span>사이트맵</span></button>
  //   </div>

  //   <button type="button" title="메뉴 닫기" class="mBtn_close">메뉴 닫기</button>
  //   <!-- 모바일 전용 -->
  // </header>
  // `);

  // HTML에 이미 #header > #header_news 가 있으면 덮어쓰지 않음 (header_news.js 바인딩 유지)
  if (!$("#header #header_news.header_news").length) {
    $("#header").html(`
          <!-- header -->
      <header id="header_news" class="header_news">
        <!-- 헤더 컨텐츠 영역  -->
        <div class="header_in">
          <!-- 헤더 상단 기타메뉴 -->
          <div class="header_container">
            <div class="inner">
              <div class="header_branding">
                <h2 class="logo">
                  <a href="#" target="_self" aria-label="KOTRA 해외시장뉴스"></a>
                </h2>
                <div class="news_top_search">
                  <form class="news_search" role="search" action="https://dream.kotra.or.kr/kotranews/index.do" method="get">
                    <label class="sr_only" for="newsSearchInput">검색어</label>
                    <input id="newsSearchInput" class="news_search_input" type="search" name="searchWrd" placeholder="검색어를 입력해주세요" autocomplete="off" />
                    <button type="submit" class="news_search_submit" aria-label="검색">
                      <i class="svg_icon ico_sch"></i>
                    </button>
                  </form>
                  <div class="news_hot">
                    <span class="news_hot_badge">HOT</span>
                    <div class="news_hot_viewport">
                      <ul class="news_hot_list">
                        <li><a href="https://dream.kotra.or.kr/kotranews/index.do?searchWrd=미국 배송로봇" target="_self">미국 배송로봇</a></li>
                        <li><a href="https://dream.kotra.or.kr/kotranews/index.do?searchWrd=유럽 탄소국경세" target="_self">유럽 탄소국경세</a></li>
                        <li><a href="https://dream.kotra.or.kr/kotranews/index.do?searchWrd=베트남 수출규제" target="_self">베트남 수출규제</a></li>
                        <li><a href="https://dream.kotra.or.kr/kotranews/index.do?searchWrd=일본 반도체" target="_self">일본 반도체</a></li>
                        <li><a href="https://dream.kotra.or.kr/kotranews/index.do?searchWrd=중동 플랜트" target="_self">중동 플랜트</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="header_actions">
                  <button type="button" class="btn_navi all" aria-controls="mobile_nav" aria-expanded="false">전체메뉴</button>
                </div>
              </div>
            </div>
          </div>
          <!-- //헤더 상단 기타메뉴 -->

          <!-- 메인메뉴 : wide -->
          <nav class="news_main_menu">
            <div class="main_menu_inner">
              <ul class="gnb_menu">
                <li>
                  <button type="button" class="gnb_main_trigger" data-trigger="gnb" data-sub="Y">뉴스</button>
                  <div class="gnb_toggle_wrap">
                    <div class="gnb_main_list" data-has-submenu="true">
                      <div class="gnb_sub_list">
                        <div class="gnb_sub_content">
                          <ul class="gnb_depth2">
                            <li>
                              <a href="/kotranews/cms/com/index.do?MENU_ID=70" class="depth2_title" data-sub="N" target="_self">
                                <span>전체</span>
                              </a>
        </li>
                            <li>
                              <a href="/kotranews/cms/com/index.do?MENU_ID=80" class="depth2_title" data-sub="N" target="_self">
                                <span>경제∙무역</span>
                              </a>
                            </li>
                            <li>
                              <a href="/kotranews/cms/com/index.do?MENU_ID=90" class="depth2_title" data-sub="N" target="_self">
                                <span>통상∙규제</span>
                              </a>
                            </li>
                            <li>
                              <a href="/kotranews/cms/com/index.do?MENU_ID=100" class="depth2_title" data-sub="N" target="_self">
                                <span>투자진출</span>
                              </a>
                            </li>
                            <li>
                              <a href="/kotranews/cms/com/index.do?MENU_ID=110" class="depth2_title" data-sub="N" target="_self">
                                <span>현장∙인터뷰</span>
                              </a>
                            </li>
                            <li>
                              <a href="/kotranews/cms/com/index.do?MENU_ID=1480" class="depth2_title" data-sub="Y" target="_self">
                                <span>기고</span>
                              </a>
                              <ul class="depth3_list">
                                <li><a href="/kotranews/cms/com/index.do?MENU_ID=130" data-sub="N" target="_self">전문가기고</a></li>
                                <li><a href="/kotranews/cms/com/index.do?MENU_ID=140" data-sub="N" target="_self">직원기고</a></li>
      </ul>
                            </li>
                            <li>
                              <a href="/kotranews/cms/com/index.do?MENU_ID=290" class="depth2_title" data-sub="N" target="_self">
                                <span>글로벌 이슈 모니터링</span>
                              </a>
                            </li>
                            <li>
                              <a href="/kotranews/cms/com/index.do?MENU_ID=1550" class="depth2_title" data-sub="Y" target="_self">
                                <span>글로벌 공급망 동향</span>
                              </a>
                              <ul class="depth3_list">
                                <li><a href="/kotranews/cms/com/index.do?MENU_ID=1360" data-sub="N" target="_self">동향뉴스</a></li>
                                <li><a href="/kotranews/cms/com/index.do?MENU_ID=1560" data-sub="N" target="_self">글로벌 공급망 인사이트</a></li>
                              </ul>
                            </li>
                            <li>
                              <a href="/kotranews/cms/com/index.do?MENU_ID=1500" class="depth2_title" data-sub="Y" target="_self">
                                <span>글로벌 ESG 정보</span>
                              </a>
                              <ul class="depth3_list">
                                <li><a href="/kotranews/cms/com/index.do?MENU_ID=1520" data-sub="N" target="_self">동향뉴스</a></li>
                                <li><a href="/kotranews/cms/com/index.do?MENU_ID=1510" data-sub="N" target="_self">연관 보고서</a></li>
                                <li><a href="/kotranews/cms/com/index.do?MENU_ID=1570" data-sub="N" target="_self">ESG 활용지원센터</a></li>
                              </ul>
                            </li>
                            <li>
                              <a href="/kotranews/cms/com/index.do?MENU_ID=1580" class="depth2_title" data-sub="N" target="_self">
                                <span>미국 통상정책 주요 동향</span>
                              </a>
                            </li>
                            <li>
                              <a href="/kotranews/cms/com/index.do?MENU_ID=1470" class="depth2_title" data-sub="Y" target="_self">
                                <span>핫클립</span>
                              </a>
                              <ul class="depth3_list">
                                <li><a href="/kotranews/cms/com/index.do?MENU_ID=1590" data-sub="N" target="_self">우크라이나 사태 해외동향</a></li>
                                <li><a href="/kotranews/cms/com/index.do?MENU_ID=1490" data-sub="N" target="_self">중동 관련 주요 동향</a></li>
                                <li><a href="/kotranews/cms/com/index.do?MENU_ID=1460" data-sub="N" target="_self">지금 수출 현장은</a></li>
                                <li><a href="/kotranews/cms/com/index.do?MENU_ID=120" data-sub="N" target="_self">기획리포트</a></li>
                                <li><a href="/kotranews/cms/com/index.do?MENU_ID=150" data-sub="N" target="_self">일자리동향</a></li>
                              </ul>
                            </li>
                            <li>
                              <a href="/kotranews/cms/com/index.do?MENU_ID=1630" class="depth2_title" data-sub="N" target="_self">
                                <span>산업뉴스콕콕</span>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <button type="button" class="gnb_main_trigger" data-trigger="gnb" data-sub="Y">상품·산업</button>
                  <div class="gnb_toggle_wrap">
                    <div class="gnb_main_list">
                      <div class="gnb_sub_list">
                        <div class="gnb_sub_content">
                          <ul class="gnb_depth2">
                            <li>
                              <a href="/kotranews/cms/com/index.do?MENU_ID=170" class="depth2_title" data-sub="N" target="_self"><span>전체</span></a>
                            </li>
                            <li>
                              <a href="/kotranews/cms/com/index.do?MENU_ID=180" class="depth2_title" data-sub="N" target="_self"><span>트렌드</span></a>
                            </li>
                            <li>
                              <a href="/kotranews/cms/com/index.do?MENU_ID=190" class="depth2_title" data-sub="N" target="_self"><span>상품DB</span></a>
                            </li>
                            <li>
                              <a href="/kotranews/cms/com/index.do?MENU_ID=200" class="depth2_title" data-sub="N" target="_self"><span>국별주요산업</span></a>
                            </li>
                            <li>
                              <a href="/kotranews/cms/com/index.do?MENU_ID=210" class="depth2_title" data-sub="N" target="_self"><span>해외인증정보</span></a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <button type="button" class="gnb_main_trigger" data-trigger="gnb" data-sub="Y">국가·지역정보</button>
                  <div class="gnb_toggle_wrap">
                    <div class="gnb_main_list" data-has-submenu="true">
                      <div class="gnb_sub_list">
                        <div class="gnb_sub_content">
                          <ul class="gnb_depth2">
                            <li>
                              <a href="/kotranews/cms/com/index.do?MENU_ID=220" class="depth2_title" data-sub="N" target="_self"><span>국가지역정보</span></a>
                            </li>
                            <li>
                              <a href="/kotranews/cms/com/index.do?MENU_ID=240" class="depth2_title" data-sub="Y" target="_self"><span>북한정보</span></a>
                              <ul class="depth3_list">
                                <li><a href="/kotranews/cms/com/index.do?MENU_ID=520" data-sub="N" target="_self">북한정보</a></li>
                                <li><a href="/kotranews/cms/com/index.do?MENU_ID=530" data-sub="N" target="_self">북한대외무역동향</a></li>
                              </ul>
                            </li>
                            <li>
                              <a href="/kotranews/cms/com/index.do?MENU_ID=250" class="depth2_title" data-sub="N" target="_self"><span>진출전략</span></a>
                            </li>
                            <li>
                              <a href="/kotranews/cms/com/index.do?MENU_ID=260" class="depth2_title" data-sub="N" target="_self"><span>출장자료</span></a>
                            </li>
                            <li>
                              <a href="/kotranews/cms/com/index.do?MENU_ID=270" class="depth2_title" data-sub="N" target="_self"><span>무역관뉴스레터</span></a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <button type="button" class="gnb_main_trigger" data-trigger="gnb" data-sub="Y">보고서</button>
                  <div class="gnb_toggle_wrap">
                    <div class="gnb_main_list">
                      <div class="gnb_sub_list">
                        <div class="gnb_sub_content">
                          <ul class="gnb_depth2">
                            <li>
                              <a href="/kotranews/cms/com/index.do?MENU_ID=280" class="depth2_title" data-sub="N" target="_self"><span>전체</span></a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <button type="button" class="gnb_main_trigger" data-trigger="gnb" data-sub="Y">멀티미디어뉴스</button>
                  <div class="gnb_toggle_wrap">
                    <div class="gnb_main_list">
                      <div class="gnb_sub_list">
                        <div class="gnb_sub_content">
                          <ul class="gnb_depth2">
                            <li>
                              <a href="/kotranews/cms/com/index.do?MENU_ID=540" class="depth2_title" data-sub="N" target="_self"><span>동영상뉴스</span></a>
                            </li>
                            <li>
                              <a href="/kotranews/cms/com/index.do?MENU_ID=310" class="depth2_title" data-sub="N" target="_self"><span>포토뉴스</span></a>
                            </li>
                            <li>
                              <a href="/kotranews/cms/com/index.do?MENU_ID=320" class="depth2_title" data-sub="N" target="_self"><span>카드뉴스</span></a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <button type="button" class="gnb_main_trigger" data-trigger="gnb" data-sub="Y">해외투자</button>
                  <div class="gnb_toggle_wrap">
                    <div class="gnb_main_list" data-has-submenu="true">
                      <div class="gnb_sub_list">
                        <div class="gnb_sub_content">
                          <ul class="gnb_depth2">
                            <li>
                              <a href="/kotranews/cms/com/index.do?MENU_ID=350" class="depth2_title" data-sub="N" target="_self"><span>해외투자안내</span></a>
                            </li>
                            <li>
                              <a href="/kotranews/cms/com/index.do?MENU_ID=360" class="depth2_title" data-sub="Y" target="_self"><span>직접투자절차</span></a>
                              <ul class="depth3_list">
                                <li><a href="/kotranews/cms/com/index.do?MENU_ID=570" data-sub="N" target="_self">해외투자준비</a></li>
                                <li>
                                  <a href="https://www.investkorea.org/ik-kr/cntnts/i-237/web.do" data-sub="N" target="_blank" aria-label="청산·국내복귀(새 창 열림)" rel="noopener noreferrer" title="새 창 열림">청산·국내복귀<i class="svg_icon ico_go"></i></a>
                                </li>
                                <li><a href="/kotranews/cms/com/index.do?MENU_ID=600" data-sub="N" target="_self">FAQ</a></li>
                              </ul>
                            </li>
                            <li>
                              <a href="/kotranews/cms/com/index.do?MENU_ID=370" class="depth2_title" data-sub="Y" target="_self"><span>국별참고자료</span></a>
                              <ul class="depth3_list">
                                <li><a href="/kotranews/cms/com/index.do?MENU_ID=610" data-sub="N" target="_self">법규·서식</a></li>
                                <li><a href="/kotranews/cms/com/index.do?MENU_ID=620" data-sub="N" target="_self">진출기업지원세미나자료</a></li>
                              </ul>
                            </li>
                            <li>
                              <a href="/kotranews/cms/com/index.do?MENU_ID=1350" class="depth2_title" data-sub="N" target="_self"><span>진출기업정보</span></a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
    </nav>
          <!-- //메인메뉴 : wide -->
        </div>
        <!-- //헤더 컨텐츠 영역  -->

        <!-- 메인메뉴 : mobile -->
        <div id="mobile_nav" class="news_main_menu_mobile">
          <div class="gnb_wrap">
            <!-- gnb-header -->
            <div class="gnb_header">
              <!-- gnb-close : mobile 메뉴 열림 시 우측 상단 -->
              <button type="button" class="news_btn medium icon" id="close_nav">
                <span class="sr_only">전체메뉴 닫기</span>
                <i class="svg_icon ico_popup_close"></i>
              </button>
              <!-- //gnb-close -->
              <!-- gnb-login -->
              <div class="gnb_login">
                <!-- 로그인 전 -->
                <!-- <button type="button" class="news_btn large text">로그인을 해주세요</button> -->
                <!-- <button type="button" class="news_btn large text"><i class="svg_icon ico_log"></i> 로그인을 해주세요</button> -->

                <!-- 로그인 후 -->

                <!-- <span class="user">홍길동님</span>
                <button type="button" class="news_btn large text"><i class="svg_icon ico_logout"></i> 로그아웃</button> -->
                <!-- <a href="javascript:void(0);" class="gnb_main_trigger news_btn large text" target="_self">홍길동님</a> -->
                <button type="button" class="news_btn large text">홍길동 님</button>
                <button type="button" class="news_btn large text"><i class="svg_icon ico_logout"></i> 로그아웃</button>
              </div>
              <!-- //gnb-login -->
              <!-- 검색 -->
              <div class="sch_input">
                <input type="text" class="news_input" placeholder="검색어를 입력해주세요" title="검색어 입력" />
                <button type="button" class="news_btn medium icon ico_search">
                  <span class="sr_only">검색</span>
                  <i class="svg_icon ico_sch"></i>
                </button>
              </div>
              <!-- //검색 -->
            </div>
            <!-- //gnb-header -->

            <!-- gnb-body -->
            <div class="gnb_body">
              <!-- gnb-menu -->
              <div class="gnb_menu">
                <div class="menu_wrap">
                  <ul>
                    <li>
                      <a href="#mGnb_anchor1" class="gnb_main_trigger" data-sub="Y" target="_self">뉴스</a>
                    </li>
                    <li>
                      <a href="#mGnb_anchor2" class="gnb_main_trigger" data-sub="Y" target="_self">상품·산업</a>
                    </li>
                    <li>
                      <a href="#mGnb_anchor3" class="gnb_main_trigger" data-sub="Y" target="_self">국가·지역정보</a>
                    </li>
                    <li>
                      <a href="#mGnb_anchor4" class="gnb_main_trigger" data-sub="Y" target="_self">보고서</a>
                    </li>
                    <li>
                      <a href="#mGnb_anchor5" class="gnb_main_trigger" data-sub="Y" target="_self">멀티미디어뉴스</a>
                    </li>
                    <li>
                      <a href="#mGnb_anchor6" class="gnb_main_trigger" data-sub="Y" target="_self">해외투자</a>
                    </li>
          </ul>
        </div>
                <div class="submenu_wrap">
                  <div class="gnb_sub_list" id="mGnb_anchor1">
                    <a class="sub_title" href="/kotranews/cms/com/index.do?MENU_ID=70" data-sub="N" target="_self">전체</a>
                    <a class="sub_title" href="/kotranews/cms/com/index.do?MENU_ID=80" data-sub="N" target="_self">경제∙무역</a>
                    <a class="sub_title" href="/kotranews/cms/com/index.do?MENU_ID=90" data-sub="N" target="_self">통상∙규제</a>
                    <a class="sub_title" href="/kotranews/cms/com/index.do?MENU_ID=100" data-sub="N" target="_self">투자진출</a>
                    <a class="sub_title" href="/kotranews/cms/com/index.do?MENU_ID=110" data-sub="N" target="_self">현장∙인터뷰</a>
                    <a class="sub_title" href="/kotranews/cms/com/index.do?MENU_ID=1480" data-sub="Y" target="_self">기고</a>
                    <ul>
                      <li><a href="/kotranews/cms/com/index.do?MENU_ID=130" class="gnb_sub_trigger" data-sub="N" target="_self">전문가기고</a></li>
                      <li><a href="/kotranews/cms/com/index.do?MENU_ID=140" class="gnb_sub_trigger" data-sub="N" target="_self">직원기고</a></li>
                    </ul>
                    <a class="sub_title" href="/kotranews/cms/com/index.do?MENU_ID=290" data-sub="N" target="_self">글로벌 이슈 모니터링</a>
                    <a class="sub_title" href="/kotranews/cms/com/index.do?MENU_ID=1550" data-sub="Y" target="_self">글로벌 공급망 동향</a>
                    <ul>
                      <li><a href="/kotranews/cms/com/index.do?MENU_ID=1360" class="gnb_sub_trigger" data-sub="N" target="_self">동향뉴스</a></li>
                      <li><a href="/kotranews/cms/com/index.do?MENU_ID=1560" class="gnb_sub_trigger" data-sub="N" target="_self">글로벌 공급망 인사이트</a></li>
                    </ul>
                    <a class="sub_title" href="/kotranews/cms/com/index.do?MENU_ID=1500" data-sub="Y" target="_self">글로벌 ESG 정보</a>
                    <ul>
                      <li><a href="/kotranews/cms/com/index.do?MENU_ID=1520" class="gnb_sub_trigger" data-sub="N" target="_self">동향뉴스</a></li>
                      <li><a href="/kotranews/cms/com/index.do?MENU_ID=1510" class="gnb_sub_trigger" data-sub="N" target="_self">연관 보고서</a></li>
                      <li><a href="/kotranews/cms/com/index.do?MENU_ID=1570" class="gnb_sub_trigger" data-sub="N" target="_self">ESG 활용지원센터</a></li>
                    </ul>
                    <a class="sub_title" href="/kotranews/cms/com/index.do?MENU_ID=1580" data-sub="N" target="_self">미국 통상정책 주요 동향</a>
                    <a class="sub_title" href="/kotranews/cms/com/index.do?MENU_ID=1470" data-sub="Y" target="_self">핫클립</a>
                    <ul>
                      <li><a href="/kotranews/cms/com/index.do?MENU_ID=1590" class="gnb_sub_trigger" data-sub="N" target="_self">우크라이나 사태 해외동향</a></li>
                      <li><a href="/kotranews/cms/com/index.do?MENU_ID=1490" class="gnb_sub_trigger" data-sub="N" target="_self">중동 관련 주요 동향</a></li>
                      <li><a href="/kotranews/cms/com/index.do?MENU_ID=1460" class="gnb_sub_trigger" data-sub="N" target="_self">지금 수출 현장은</a></li>
                      <li><a href="/kotranews/cms/com/index.do?MENU_ID=120" class="gnb_sub_trigger" data-sub="N" target="_self">기획리포트</a></li>
                      <li><a href="/kotranews/cms/com/index.do?MENU_ID=150" class="gnb_sub_trigger" data-sub="N" target="_self">일자리동향</a></li>
                    </ul>
                    <a class="sub_title" href="/kotranews/cms/com/index.do?MENU_ID=1630" data-sub="Y" target="_self">산업뉴스콕콕</a>
    </div>
                  <div class="gnb_sub_list" id="mGnb_anchor2">
                    <a class="sub_title" href="/kotranews/cms/com/index.do?MENU_ID=170" data-sub="N" target="_self">전체</a>
                    <a class="sub_title" href="/kotranews/cms/com/index.do?MENU_ID=180" data-sub="N" target="_self">트렌드</a>
                    <a class="sub_title" href="/kotranews/cms/com/index.do?MENU_ID=190" data-sub="N" target="_self">상품DB</a>
                    <a class="sub_title" href="/kotranews/cms/com/index.do?MENU_ID=200" data-sub="N" target="_self">국별주요산업</a>
                    <a class="sub_title" href="/kotranews/cms/com/index.do?MENU_ID=210" data-sub="N" target="_self">해외인증정보</a>
                  </div>
                  <div class="gnb_sub_list" id="mGnb_anchor3">
                    <a class="sub_title" href="/kotranews/cms/com/index.do?MENU_ID=220" data-sub="N" target="_self">국가지역정보</a>
                    <a class="sub_title" href="/kotranews/cms/com/index.do?MENU_ID=240" data-sub="Y" target="_self">북한정보</a>
                    <ul>
                      <li><a href="/kotranews/cms/com/index.do?MENU_ID=520" class="gnb_sub_trigger" data-sub="N" target="_self">북한정보</a></li>
                      <li><a href="/kotranews/cms/com/index.do?MENU_ID=530" class="gnb_sub_trigger" data-sub="N" target="_self">북한대외무역동향</a></li>
                    </ul>
                    <a class="sub_title" href="/kotranews/cms/com/index.do?MENU_ID=250" data-sub="N" target="_self">진출전략</a>
                    <a class="sub_title" href="/kotranews/cms/com/index.do?MENU_ID=260" data-sub="N" target="_self">출장자료</a>
                    <a class="sub_title" href="/kotranews/cms/com/index.do?MENU_ID=270" data-sub="N" target="_self">무역관뉴스레터</a>
                  </div>
                  <div class="gnb_sub_list" id="mGnb_anchor4">
                    <a class="sub_title" href="/kotranews/cms/com/index.do?MENU_ID=280" data-sub="N" target="_self">전체</a>
                  </div>
                  <div class="gnb_sub_list" id="mGnb_anchor5">
                    <a class="sub_title" href="/kotranews/cms/com/index.do?MENU_ID=540" data-sub="N" target="_self">동영상뉴스</a>
                    <a class="sub_title" href="/kotranews/cms/com/index.do?MENU_ID=310" data-sub="N" target="_self">포토뉴스</a>
                    <a class="sub_title" href="/kotranews/cms/com/index.do?MENU_ID=320" data-sub="N" target="_self">카드뉴스</a>
                  </div>
                  <div class="gnb_sub_list" id="mGnb_anchor6">
                    <a class="sub_title" href="/kotranews/cms/com/index.do?MENU_ID=350" data-sub="N" target="_self">해외투자안내</a>
                    <a class="sub_title" href="/kotranews/cms/com/index.do?MENU_ID=360" data-sub="Y" target="_self">직접투자절차</a>
                    <ul>
                      <li><a href="/kotranews/cms/com/index.do?MENU_ID=570" class="gnb_sub_trigger" data-sub="N" target="_self">해외투자준비</a></li>
                      <li>
                        <a href="https://www.investkorea.org/ik-kr/cntnts/i-237/web.do" class="gnb_sub_trigger" data-sub="N" target="_blank" aria-label="청산·국내복귀(새 창 열림)" rel="noopener noreferrer" title="새 창 열림">청산·국내복귀<i class="svg_icon ico_go"></i></a>
                      </li>
                      <li><a href="/kotranews/cms/com/index.do?MENU_ID=600" class="gnb_sub_trigger" data-sub="N" target="_self">FAQ</a></li>
                    </ul>
                    <a class="sub_title" href="/kotranews/cms/com/index.do?MENU_ID=370" data-sub="Y" target="_self">국별참고자료</a>
                    <ul>
                      <li><a href="/kotranews/cms/com/index.do?MENU_ID=610" class="gnb_sub_trigger" data-sub="N" target="_self">법규·서식</a></li>
                      <li><a href="/kotranews/cms/com/index.do?MENU_ID=620" class="gnb_sub_trigger" data-sub="N" target="_self">진출기업지원세미나자료</a></li>
                    </ul>
                    <a class="sub_title" href="/kotranews/cms/com/index.do?MENU_ID=1350" data-sub="N" target="_self">진출기업정보</a>
                  </div>
                </div>
              </div>
              <!-- //gnb-menu -->
            </div>
            <!-- //gnb-body -->
          </div>
        </div>
        <!-- //메인메뉴 : mobile -->
  </header>
      <!-- //header -->
  `);
  }

  // jQuery 3 ready는 DOMContentLoaded보다 늦게 돌 수 있음 → 헤더 주입 후 이벤트 바인딩
  if (typeof window.initHeaderNews === "function") {
    window.initHeaderNews();
  }

  // 사이트맵 (닫기 버튼을 DOM 앞에 두어 Tab 시 X가 먼저 포커스됨. 위치는 absolute)
  $("section.sitemapBox").html(`
    <div class="sitemap_wrap">
      <button type="button" class="btn_close" aria-label="사이트맵 닫기">닫기</button>
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
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=70" data-sub="N" target="_self">전체</a></li>
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=80" data-sub="N" target="_self">경제∙무역</a></li>
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=90" data-sub="N" target="_self">통상∙규제</a></li>
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=100" data-sub="N" target="_self">투자진출</a></li>
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=110" data-sub="N" target="_self">현장∙인터뷰</a></li>
                <li class="child">
                  <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1480" data-sub="Y" target="_self">기고</a>
                  <ul class="menuS">
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=130" title="" data-sub="N" target="_self">전문가기고</a></li>
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=140" title="" data-sub="N" target="_self">직원기고</a></li>
                  </ul>
                </li>
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=290" data-sub="N" target="_self">글로벌 이슈 모니터링</a></li>
                <li class="child">
                  <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1550" data-sub="Y" target="_self">글로벌 공급망 동향</a>
                  <ul class="menuS">
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1360" title="" data-sub="N" target="_self">동향뉴스</a></li>
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1560" title="" data-sub="N" target="_self">글로벌 공급망 인사이트</a></li>
                  </ul>
                </li>
                <li class="child">
                  <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1500" data-sub="Y" target="_self">글로벌 ESG 정보</a>
                  <ul class="menuS">
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1520" title="" data-sub="N" target="_self">동향뉴스</a></li>
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1510" title="" data-sub="N" target="_self">연관 보고서</a></li>
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1570" title="" data-sub="N" target="_self">ESG 활용지원센터</a></li>
                  </ul>
                </li>
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1580" data-sub="N" target="_self">미국 통상정책 주요 동향</a></li>
                <li class="child">
                  <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1470" data-sub="Y" target="_self">핫클립</a>
                  <ul class="menuS">
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1590" title="" data-sub="N" target="_self">우크라이나 사태 해외동향</a></li>
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1490" title="" data-sub="N" target="_self">중동 관련 주요 동향</a></li>
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1460" title="" data-sub="N" target="_self">지금 수출 현장은</a></li>
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=120" title="" data-sub="N" target="_self">기획리포트</a></li>
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=150" title="" data-sub="N" target="_self">일자리동향</a></li>
                  </ul>
                </li>
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1630" data-sub="Y" target="_self">산업뉴스콕콕</a></li>
              </ul>
            </li>
            <li class="child">
              <h3 class="txtHidden">상품·산업</h3>
              <ul class="menuM menuStep">
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=170" data-sub="N" target="_self">전체</a></li>
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=180" data-sub="N" target="_self">트렌드</a></li>
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=190" data-sub="N" target="_self">상품DB</a></li>
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=200" data-sub="N" target="_self">국별주요산업</a></li>
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=210" data-sub="N" target="_self">해외인증정보</a></li>
              </ul>
            </li>
            <li class="child">
              <h3 class="txtHidden">국가·지역정보</h3>
              <ul class="menuM menuStep">
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=220" data-sub="N" target="_self">국가지역정보</a></li>
                <li class="child">
                  <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=240" data-sub="Y" target="_self">북한정보</a>
                  <ul class="menuS">
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=520" title="" data-sub="N" target="_self">북한정보</a></li>
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=530" title="" data-sub="N" target="_self">북한대외무역동향</a></li>
                  </ul>
                </li>
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=250" data-sub="N" target="_self">진출전략</a></li>
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=260" data-sub="N" target="_self">출장자료</a></li>
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=270" data-sub="N" target="_self">무역관뉴스레터</a></li>
              </ul>
            </li>
            <li class="child">
              <h3 class="txtHidden">보고서</h3>
              <ul class="menuM menuStep">
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=280" data-sub="N" target="_self">전체</a></li>
              </ul>
            </li>
            <li class="child">
              <h3 class="txtHidden">멀티미디어뉴스</h3>
              <ul class="menuM menuStep">
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=540" data-sub="N" target="_self">동영상뉴스</a></li>
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=310" data-sub="N" target="_self">포토뉴스</a></li>
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=320" data-sub="N" target="_self">카드뉴스</a></li>
              </ul>
            </li>
            <li class="child">
              <h3 class="txtHidden">해외투자</h3>
              <ul class="menuM menuStep">
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=350" data-sub="N" target="_self">해외투자안내</a></li>
                <li class="child">
                  <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=360" data-sub="Y" target="_self">직접투자절차</a>
                  <ul class="menuS">
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=570" title="" data-sub="N" target="_self">해외투자준비</a></li>
                    <li class=""><a href="https://www.investkorea.org/ik-kr/cntnts/i-237/web.do" title="새 창 열림" data-sub="N" target="_blank" aria-label="청산·국내복귀(새 창 열림)" rel="noopener noreferrer">청산·국내복귀</a></li>
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=600" title="" data-sub="N" target="_self">FAQ</a></li>
                  </ul>
                </li>
                <li class="child">
                  <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=370" data-sub="Y" target="_self">국별참고자료</a>
                  <ul class="menuS">
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=610" title="" data-sub="N" target="_self">법규&middot;서식</a></li>
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=620" title="" data-sub="N" target="_self">진출기업지원세미나자료</a></li>
                  </ul>
                </li>
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1350" data-sub="N" target="_self">진출기업정보</a></li>
              </ul>
            </li>
            <li class="child">
              <h3 class="txtHidden">열린마당</h3>
              <ul class="menuM menuStep">
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1310" data-sub="Y" target="_self">공지사항</a></li>
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1320" data-sub="Y" target="_self">고객조사제안 </a></li>
                <li><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=670" data-sub="Y" target="_self">뉴스레터신청</a></li>
                <li class="child">
                  <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=1340" data-sub="Y" target="_self">고객문의</a>
                  <ul class="menuS">
                    <li class="" style="display: none"><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=640" title="" data-sub="Y" target="_self">고객문의</a></li>
                  </ul>
                </li>
                <li class="child">
                  <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=680" data-sub="Y" target="_self">사이트이용</a>
                  <ul class="menuS">
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=710" title="" data-sub="Y" target="_self">API</a></li>
                    <li class=""><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=720" title="" data-sub="Y" target="_self">RSS2.0</a></li>
                    <li class="" style="display: none"><a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=750" title="" data-sub="Y" target="_self">뷰어다운로드</a></li>
                  </ul>
                </li>
                <li class="child">
                  <a href="https://dream.kotra.or.kr/kotranews/cms/com/index.do?MENU_ID=730" data-sub="Y" target="_self">정책∙방침</a>
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
    </div>
  `);

  /* 사이트맵 HTML 채운 뒤 포커스 트랩 바인딩 (패널 1개 = section.sitemapBox) */
  initMastheadSitemapBox();

  // 브레드크럼 뼈대 → breadcrumb.js (html_org #pnb 구조). 메뉴명/목록은 initPnb() 가 채움
  // 메인(typeMain)에는 #pnb 없음
  if (!$("body").hasClass("typeMain") && typeof window.ensurePnbSkeleton === "function") {
    ensurePnbSkeleton();
  }

  // TOP버튼
  $("#footer").before(`
    <button type="button" id="btn_top">TOP</button>
    `);

  // 푸터
  $("#footer").html(`
    <footer class="footer_kotra">
          <div class="footer_kotra_wrapper">
        <p class="footer_kotra_logo">
          <img src="../img/logo/logo_kotra_news_white.svg" alt="해외시장뉴스 로고" />
        </p>
            <div class="footer_kotra_info">
              <ul class="footer_list_menu">
            <li><a href="https://www.kotra.or.kr/module/stplatLog/selectStplatLogList.do?stplatSeq=2000002282" target="_self">이용약관</a></li>
            <li><a href="https://dream.kotra.or.kr/dream/cms/com/index.do?MENU_ID=4880" target="_self">저작권정책</a></li>
                <li><a href="https://www.kotra.or.kr/module/stplatLog/selectPolicyLogList.do?stplatSeq=2000002272" target="_self" class="policy">개인정보처리방침</a></li>
            <li><a href="https://www.kotra.or.kr/subList/20000005857" target="_self">정보공개</a></li>
              </ul>
              <ul class="footer_list_info">
                  <li><span>서울시 서초구 헌릉로 13</span></li>
                  <li><span>사업자등록번호 : 120-82-00275</span></li>
            <li>
              <span>대표자명 : 강경성 TEL.</span><span><a href="tel:16007119">1600-7119</a></span>
            </li>
              </ul>
              <p class="copyright">COPYRIGHT(c)2023 KOTRA. ALL RIGHTS RESERVED 대한무역투자진흥공사</p>
            </div>
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
        $(org)
          .find(">a")
          .attr("href", $(obj).find("> div> ul > li:not('.emptyArea'):eq(0) > a").attr("href"));
        $(org)
          .find(">a")
          .attr("target", $(obj).find("> div> ul > li:not('.emptyArea'):eq(0) > a").attr("target"));

        setHref($(obj).find("> div> ul > li:not('.emptyArea'):eq(0)"), org);
      } else {
        $(org).find(">a").attr("href", $(org).find(">a").attr("href"));
      }
    }
  } else {
    if ($(obj).find("> ul > li:not('.emptyArea')").length > 0) {
      if ($(obj).find(">a").data("sub") == "Y") {
        $(org)
          .find(">a")
          .attr("href", $(obj).find("> ul > li:not('.emptyArea'):eq(0) > a").attr("href"));
        $(org)
          .find(">a")
          .attr("target", $(obj).find("> ul > li:not('.emptyArea'):eq(0) > a").attr("target"));

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
  // navList / pnbList 클릭 → breadcrumb.js bindPnbMenuClicks()

  calcGnbDepthVars();
  var $gnbLeaf = getGnbLeafLi();
  if ($gnbLeaf.length) {
    $(".sVisual strong").text($.trim($gnbLeaf.children("a").first().text()));
  }

  $(document).on("click", ".btn_logout, .btn_topLogout", function () {
    frameBtnObj = $(this);
    $("body").css("overflow-y", "hidden");
    $(
      '<iframe id="iframeLogoutPop" src="https://dream.kotra.or.kr/kotranews/cms/frCom/actionLogoutPop.do" class="pop_iframe on" height="100%" scrolling="no" frameborder="0" title="로그아웃 팝업"/>'
    ).appendTo($("body #container"));
  });

  $(document).on("click", ".btn_login, .btn_topLogin", function () {
    //뉴스
    //location.href = "https://dream.kotra.or.kr/kotranews/login/topUtilLink.do?pRetUrl=" + encodeURIComponent(window.location.pathname + window.location.search);
    sessionStorage.setItem("newsLogin", "newsLogin");
    location.href = "https://www.kotra.or.kr/membership/membershipLoginForm.do?siteName=kn";
  });

  $(document).on("click", ".btn_mypage", function () {
    location.href = "https://dream.kotra.or.kr/dream/mypage/topUtilLink.do";
  });

  $(document).on("click", ".gnb_util .btn_search", function () {
    var pSearchTxt = $(".search_inp").val();

    fn_comm_ajax({
      url: "https://dream.kotra.or.kr/ajaxf/totalSearch/getStopWordList.do",
      data: {},
      dataType: "json",
      async: false,
      success: function (data) {
        if (null != data && "" != data) {
          for (var i = 0; i < data.length; i++) {
            if (pSearchTxt == data[i].BAN_WORD) {
              alert("'" + data[i].BAN_WORD + "'" + "은(는)" + " 검색할 수 없는 단어입니다.");
              return false;
            }
          }
        }

        $("#searchForm").find("[name=searchTxt]").val($(".search_inp").val());
        $("#searchForm").find("[name=tDiv]").val($(".search_opt .btn_searchOpt").val());
        $("#searchForm")
          .find("[name=pRetUrl]")
          .val(window.location.pathname + window.location.search);
        $("#searchForm").submit();
      }
    });
  });

  $(document).on("click", ".search_opt > ul > li > button", function () {
    var sVal = $(this).val();
    var sText = $(this).text();
    $(".search_opt .btn_searchOpt").val(sVal);
    $(".search_opt .btn_searchOpt").text(sText);
  });

  $("header .mBtn_topMenu").click(function () {
    if (window.innerWidth < 1024) {
      if (!$("nav>#gnb>li>a").hasClass("on")) {
        $("nav>#gnb>li>a").eq(0).trigger("click");
      }
    }
  });

  // 접근성 팝업 포커스 변경
  $(document).on("DOMNodeInserted", ".pop_iframe", function () {
    $(this).focus();
  });
  $(document).on("DOMNodeRemoved", ".pop_iframe", function () {
    $(frameBtnObj).focus();
  });
}

function closeSearchPop() {
  $("#iframeSearchPop").remove();
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
    $(".btn_search").trigger("click");
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
  var $mapNav = $(".sitemapBox .map_nav");
  if ($mapNav.length && !$mapNav.hasClass("mCustomScrollbar")) {
    $mapNav.mCustomScrollbar({
      keyboard: {
        enable: true,
        scrollType: "stepless",
        scrollAmount: 40
      },
      advanced: {
        autoScrollOnFocus: true
      }
    });
  }

  /* Tab으로 링크 포커스 시 스크롤 영역 안으로 보이도록 */
  $(document)
    .off("focusin.sitemapMapNav", ".sitemapBox .map_nav a")
    .on("focusin.sitemapMapNav", ".sitemapBox .map_nav a", function () {
      var $nav = $(".sitemapBox .map_nav");
      var el = this;
      if ($nav.length && $nav.data("mCS")) {
        try {
          $nav.mCustomScrollbar("scrollTo", el, { scrollInertia: 200 });
        } catch (err) {
          if (el.scrollIntoView) {
            el.scrollIntoView({ block: "nearest", inline: "nearest" });
          }
        }
      } else if (el.scrollIntoView) {
        el.scrollIntoView({ block: "nearest", inline: "nearest" });
      }
    });

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

  snsItems["facebook"] =
    "http://www.facebook.com/share.php?t=" +
    encodeURIComponent(snsTitle) +
    "&u=" +
    encodeURIComponent(snsUrl);
  snsItems["twitter"] =
    "https://twitter.com/intent/tweet?text=" + encodeURIComponent(snsTitle + "\n" + snsUrl);
  snsItems["kakao"] = "https://story.kakao.com/share?url=" + encodeURIComponent(snsUrl);
  snsItems["blog"] =
    "http://blog.naver.com/openapi/share?url=" +
    encodeURIComponent(snsUrl) +
    "&title=" +
    encodeURIComponent(snsTitle);
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
 * SNS 보드 슬라이더 (inline Script)
 * #snb_board .snb_bookmark .list 가 있을 때만 Slick 초기화
 * ============================================================ */
function initSnsBoardSlider() {
  var $list = $("#snb_board .snb_bookmark .list");
  if (!$list.length) return;
  var snsBoardSliderOpts = {
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
        breakpoint: 1024,
        settings: {
          slidesToShow: 5
        }
      }
    ]
  };
  $list.not(".slick-initialized").slick(snsBoardSliderOpts);
}

/* ============================================================
 * 10. KOTRA 내부사이트 토글 (layout.js)
 * ============================================================ */
function initKotraSiteToggle() {
  $(".top_util .btn_kotraSite").click(function () {
    if ($(this).hasClass("on")) {
      $(this).removeClass("on");
      $(this).parents("#header").removeClass("kotraSiteOn");
      $(this).attr("title", "KOTRA 내부사이트 열기");
    } else {
      $(this).addClass("on");
      $(this).parents("#header").addClass("kotraSiteOn");
      $(this).attr("title", "KOTRA 내부사이트 닫기");
    }
  });

  $(".top_util .moreSiteArea .btn_close").click(function () {
    $(".top_util .btn_kotraSite").trigger("click");
  });
}
/* pnb / gnb 동기화 · 브레드크럼 → js/breadcrumb.js
 * (getCurrentMenuId, applyGnbCurrentByMenuId, calcGnbDepthVars,
 *  getGnbLeafLi, initPnbFromGnb, initPnbOptions, initPnb …)
 */
/* ============================================================
 * 11. gnb 현재 메뉴 on 클래스 세팅 (layout.js)
 * ============================================================ */
function initGnbCurrentState() {
  calcGnbDepthVars();

  var gnbCrt0 = $("#gnb>li:nth-child(" + gnbDep1 + ")>a");
  var gnbCrt1 = $("#gnb>li:nth-child(" + gnbDep1 + ")>a");
  var gnbCrt2 = $("#gnb>li:nth-child(" + gnbDep1 + ")>ul>li:nth-child(" + gnbDep2 + ")");
  var gnbCrt3 = $(
    "#gnb>li:nth-child(" +
      gnbDep1 +
      ")>ul>li:nth-child(" +
      gnbDep2 +
      ")>ul>li:nth-child(" +
      gnbDep3 +
      ")"
  );
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
    if(window.innerWidth >= 1024){
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
    if (window.innerWidth >= 1024) {
      //$("#header").removeClass("gnbOn");
      $("#gnb>li>a, #gnb>li>.gnbTit, #gnb>li>.menuM").removeClass("act");

      $("#header").css("height", "");
      $(".gnbTit").css("height", "");

      $("#header").addClass("gnbOn");
      $("#gnb_dim").addClass("on");
      $(this).addClass("act");
      $(this).siblings().addClass("act");

      if ($(this).parent("li").hasClass("child")) {
        if ($(this).siblings(".menuM").height() > 125) {
          $("#header").height($(this).siblings(".menuM").height() + 153);
        } else {
          $("#header").height(230);
        }
        $(this)
          .siblings(".gnbTit")
          .height($(this).siblings(".menuM").height() + 100);
      } else {
        $("#header").removeAttr("style");
      }

      $(this)
        .siblings(".menuStep")
        .children("li")
        .css({
          width: 100 / $(this).siblings(".menuStep").children("li").not(".emptyArea").length + "%"
        });
    }
  });

  $("#header").mouseleave(function () {
    if (window.innerWidth >= 1024) {
      $("#header").removeClass("gnbOn").removeAttr("style");
      $("#gnb_dim").removeClass("on");
      $("#gnb>li>a").removeClass("act");
      $("#gnb, #gnb .gnbTit, #gnb .menuM").removeClass("act");
      $("#gnb, #gnb .gnbTit, #gnb .menuM>li").removeClass("act").removeAttr("style");
    }
  });
}
/* ============================================================
 * 13. 모바일 gnb 메뉴 동작 (layout.js)
 * ============================================================ */
function menuM() {
  if (window.innerWidth < 1024) {
    var depOneLength = $("header>nav #gnb>li:visible").length;

    // $("header>nav #gnb li>ul.menuM").css({
    // 	"top": 54 * (Math.ceil(depOneLength / 4))
    // });

    if ($("body").hasClass("typeTopNotice")) {
      // 상단배너 있는 경우
      $("header>nav #gnb ul.menuM").css({
        height: window.innerHeight - 294
      });
    } else {
      $("header>nav #gnb ul.menuM").css({
        height: window.innerHeight - 209
      });
    }
  } else {
    // $("header>nav #gnb li>ul.menuM").css('top','');
    $("header>nav #gnb li>ul.menuM").css("height", "");
  }
}

function menuS() {
  if (window.innerWidth < 1024) {
    var depOneLength = $("header>nav #gnb>li:visible").length;
    var depOneHeight = 54 * Math.ceil(depOneLength / 4);

    // $("header>nav #gnb li>ul.menuS").css({
    // 	"top": depOneHeight
    // });

    $("header>nav #gnb li>ul.menuS").css({
      height: window.innerHeight - depOneHeight - 52 - 80
    });
  } else {
    // $("header>nav #gnb li>ul.menuS").css('top','')
    $("header>nav #gnb li>ul.menuS").css("height", "");
  }
}

function mbMenuResult() {
  if (window.innerWidth < 1024) {
    $(".typeSearchResult .m_searchResult").css({
      height: window.innerHeight - 220
    });
  }
}

function mBtnClose() {
  $("#gnb_dim").removeClass("on");
  $("#header").removeClass("gnbOn");
  $("header>nav #gnb li").removeClass("act");
  $("body").css("overflow", "visible");

  if (window.innerWidth < 1024) {
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
    if (window.innerWidth < 1024) {
      $(this).nextAll("nav").show();
      $("header>nav #gnb").removeAttr("style"); //reset
      $("header>nav #gnb ul.menuM>li").removeClass("act"); //reset
      $("header>nav #gnb .on").addClass("act"); //reset
      $("header>nav #gnb li.on>.menuSS").slideDown(0); //reset

      $("#gnb_dim").addClass("on");
      $("#header").addClass("gnbOn");
      $("header>nav #gnb").css({
        height: window.innerHeight - $("#header").height()
      });

      menuM();

      $("body").css("overflow", "hidden");
    }
  });

  $("header>nav #gnb>li>a").click(function () {
    if (window.innerWidth < 1024) {
      if ($(this).parent("li").hasClass("child")) {
        $("header>nav #gnb li").removeClass("act"); //reset
        $("header>nav #gnb li.on>.menuSS").slideDown(0); //reset

        /*if(!$(this).hasClass('act') && !$(this).hasClass('on')){
          $("header>nav #gnb ul.menuM>li:first-child").addClass('act');
        }*/

        if ($(this).parent("li").hasClass("child")) {
          if (!$(this).hasClass("act")) {
            $("header>nav #gnb>li>a.act").removeClass("act");
            $(this).addClass("act");
          }
        }

        $("header>nav #gnb li.on").addClass("act");

        return false;
      } else {
        return true;
      }
    }
  });

  $("header>nav #gnb ul.menuM>li>a").click(function () {
    if (window.innerWidth < 1024) {
      if (
        $(this).parent("li").attr("class") == "child" ||
        $(this).parent("li").attr("class") == "child on"
      ) {
        $("header>nav #gnb li").removeClass("act");
        $(this).parent("li").addClass("act");

        return false;
      } else if ($(this).parent("li").attr("class") == "child act") {
        $(this).parent("li").removeClass("act");

        return false;
      } else {
        return true;
      }
    }
  });

  $("header>nav #gnb ul.menuS>li>a").click(function () {
    if (window.innerWidth < 1024) {
      if (
        $(this).parent("li").attr("class") == "child" ||
        $(this).parent("li").attr("class") == "child on"
      ) {
        $("header>nav #gnb .menuS>li").removeClass("act");
        $("header>nav #gnb .menuSS").slideUp(200);
        $(this).parent("li").addClass("act");
        $(this).siblings(".menuSS").slideDown(200);

        return false;
      } else if (
        $(this).parent("li").attr("class") == "child act" ||
        $(this).parent("li").attr("class") == "child on act"
      ) {
        $(this).parent("li").removeClass("act");
        $(this).siblings(".menuSS").slideUp(200);

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
  // 클릭/Enter 시 포커스를 header로 옮기면 #btn_top 링이 잠깐 보이다
  // 헤더 링크의 기본 focus-ring으로 바뀌어 보임 → 스크롤 완료 후 이동
  $("#btn_top").on("click", function () {
    $("html, body")
      .stop()
      .animate({ scrollTop: 0 }, 150, function () {
        var $target = $("header a").filter(":visible").first();
        if ($target.length) {
          $target.focus();
        }
      });
  });

  $("#snb_nav .snb_util .zoom>button").click(function () {
    $("#contents article").FontSize({
      increaseTimes: 3,
      reduceTimes: 3,
      step: 3,
      increaseBtn: ".btn_zoomIn",
      reduceBtn: ".btn_zoomOut"
    });
  });

  // familySite
  $("#footer .btn_familysite").click(function () {
    if ($("#footer .familySite").hasClass("on")) {
      $("#footer .familySite").removeClass("on");
    } else {
      $("#footer .familySite").addClass("on");
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

    if ($("body").hasClass("typeMain")) {
      if (conts_loc > 0) {
        $("body").addClass("mSticky");
      } else {
        $("body").removeClass("mSticky");
      }
    }

    if ($("body").hasClass("typeSub")) {
      if (window.innerWidth >= 1024) {
        if (conts_loc > 400) {
          $("body").addClass("stickyFix");
        } else {
          $("body").removeClass("stickyFix");
        }
      } else {
        if (conts_loc > 181) {
          $("body").addClass("stickyFix");
        } else {
          $("body").removeClass("stickyFix");
        }
      }
    }

    if (conts_loc > 100) {
      $("#btn_top").addClass("on");
    } else {
      $("#btn_top").removeClass("on");
    }
  });
}
/* 16. pnb UI / 검색·보드 옵션 → js/breadcrumb.js (initPnbOptions) */
/* ============================================================
 * 패밀리 사이트 팝업 열기/닫기 · 포커스 이동/트랩 · Esc
 * ============================================================ */
function initMastheadFamilyPopup() {
  var $btn = $(".masthead_kotra .btn_family_more");
  var $pop = $(".masthead_kotra .pop_kotra_family");
  if (!$btn.length || !$pop.length) {
    return;
  }

  var focusableSel = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function getFocusable() {
    return $pop.find(focusableSel).filter(":visible");
  }

  function openFamilyPopup() {
    $btn.attr("aria-expanded", "true");
    $pop.attr("aria-hidden", "false");
    /* 열릴 때 포커스는 트리거 버튼에 유지. Tab 시 .btn_close 로 이동 */
    $pop.stop(true, true).slideDown(200);
  }

  function closeFamilyPopup() {
    $btn.attr("aria-expanded", "false");
    $pop.attr("aria-hidden", "true");
    $pop.stop(true, true).slideUp(200, function () {
      $btn.focus();
    });
  }

  function isOpen() {
    return $pop.is(":visible");
  }

  $(document)
    .off("click.familyPopup")
    .on("click.familyPopup", ".masthead_kotra .btn_family_more", function (e) {
      e.preventDefault();
      if (isOpen()) {
        closeFamilyPopup();
      } else {
        openFamilyPopup();
      }
    });

  $(document)
    .off("click.familyPopupClose")
    .on("click.familyPopupClose", ".masthead_kotra .pop_kotra_family .btn_close", function (e) {
      e.preventDefault();
      closeFamilyPopup();
    });

  $(document)
    .off("keydown.familyPopup")
    .on("keydown.familyPopup", function (e) {
      if (!isOpen()) {
        return;
      }
      var key = e.key || e.keyCode;

      if (key === "Escape" || key === "Esc" || key === 27) {
        e.preventDefault();
        closeFamilyPopup();
        return;
      }

      if (key !== "Tab" && key !== 9) {
        return;
      }

      var $items = getFocusable();
      if (!$items.length) {
        return;
      }
      var $first = $items.first();
      var $last = $items.last();
      var active = document.activeElement;

      /* 트리거에서 Tab → 닫기(X), Shift+Tab(열림 상태) → 마지막 링크 */
      if (active === $btn[0]) {
        e.preventDefault();
        if (e.shiftKey) {
          $last.focus();
        } else {
          $first.focus(); /* DOM 상 첫 포커스 = .btn_close */
        }
        return;
      }

      if (e.shiftKey) {
        if (active === $first[0]) {
          e.preventDefault();
          $btn.focus();
        }
      } else if (active === $last[0]) {
        e.preventDefault();
        $first.focus();
      }
    });

  $pop.off("mouseenter.familyPopup", "a").on("mouseenter.familyPopup", "a", function () {
    $(this).closest("li").addClass("on").siblings().removeClass("on");
  });
}

/* ============================================================
 * 마스트헤드 사이트맵 패널 (on / off)
 * masthead 주입 스크립트 하단과 동일 동작
 * ============================================================ */
function initMastheadSitemapBox() {
  var sitemapPrevLoc = 0;
  var sitemapBtnSel = ".masthead_kotra .btn_sitemap, header .gnb_util .btn_sitemap";
  var focusableSel = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
  /* 배경 inert 대상 (패널·dim 제외) */
  var inertSel = "#skip_menu, #masthead_kotra, #header, #container, #footer, #btn_top, #gnb_dim";

  function $panel() {
    var $sec = $("section.sitemapBox");
    if ($sec.length) return $sec.first();
    return $(".sitemapBox").first();
  }

  function $trigger() {
    var $btn = $(".masthead_kotra .btn_sitemap");
    if (!$btn.length) {
      $btn = $("header .gnb_util .btn_sitemap");
    }
    return $btn;
  }

  function isOpen() {
    return $panel().hasClass("on");
  }

  function getFocusable() {
    return $panel()
      .find(focusableSel)
      .filter(function () {
        var $el = $(this);
        if (!$el.is(":visible")) return false;
        if ($el.closest(".mCSB_scrollTools").length) return false;
        return true;
      });
  }

  function focusFirstInPanel() {
    var $close = $panel().find(".btn_close").filter(":visible").first();
    if ($close.length) {
      $close.focus();
      return;
    }
    var $items = getFocusable();
    if ($items.length) {
      $items.first().focus();
    }
  }

  function setBackgroundInert(on) {
    $(inertSel).each(function () {
      if (on) {
        this.setAttribute("inert", "");
        this.setAttribute("aria-hidden", "true");
      } else {
        this.removeAttribute("inert");
        this.removeAttribute("aria-hidden");
      }
    });
  }

  function openSitemapBox() {
    var $p = $panel();
    if (!$p.length) return;

    sitemapPrevLoc = $(window).scrollTop();
    var siteMapInnerH = $p.find(".map_nav").height();
    var siteMapLastH = $p.find("#sitemap>li:last-child .menuM").height();

    $("html").css("overflow", "hidden");
    $("body").css("overflow", "hidden");
    if (siteMapInnerH && siteMapLastH) {
      $p.find("#sitemap>li:last-child").css("height", siteMapInnerH - siteMapLastH);
    }
    $("#dim").addClass("on");
    $p.addClass("on").removeClass("off").attr({
      "aria-hidden": "false",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "사이트맵"
    });
    $trigger().attr("aria-expanded", "true");
    /* map_nav 는 Tab 순서에 넣지 않음 → 닫기 다음 = map_gnb 첫 메뉴(뉴스) */
    setBackgroundInert(true);
    window.setTimeout(focusFirstInPanel, 50);
  }

  function closeSitemapBox() {
    var $p = $panel();
    $("html").css("overflow", "");
    $("body").css("overflow", "");
    $("html, body").animate({ scrollTop: sitemapPrevLoc }, 0);
    $p.addClass("off")
      .removeClass("on")
      .attr("aria-hidden", "true")
      .removeAttr("role")
      .removeAttr("aria-modal")
      .removeAttr("aria-label");
    $("#dim").removeClass("on");
    setBackgroundInert(false);
    $trigger().attr("aria-expanded", "false").focus();
  }

  $(document)
    .off("click.sitemapBox")
    .on("click.sitemapBox", sitemapBtnSel, function (e) {
      e.preventDefault();
      if (isOpen()) {
        closeSitemapBox();
      } else {
        openSitemapBox();
      }
    });

  $(document)
    .off("click.sitemapBoxClose")
    .on("click.sitemapBoxClose", ".sitemapBox .btn_close", function (e) {
      e.preventDefault();
      closeSitemapBox();
    });

  /* 딤 클릭 시 닫기 */
  $(document)
    .off("click.sitemapDim")
    .on("click.sitemapDim", "#dim.on", function () {
      if (isOpen()) closeSitemapBox();
    });

  /* 패널 밖으로 포커스가 새면 다시 안으로 */
  $(document)
    .off("focusin.sitemapBoxTrap")
    .on("focusin.sitemapBoxTrap", function (e) {
      if (!isOpen()) return;
      var panel = $panel()[0];
      if (!panel) return;
      if (!panel.contains(e.target)) {
        e.stopPropagation();
        focusFirstInPanel();
      }
    });

  $(document)
    .off("keydown.sitemapBox")
    .on("keydown.sitemapBox", function (e) {
      if (!isOpen()) {
        return;
      }
      var key = e.key || e.keyCode;
      var panel = $panel()[0];
      var $items = getFocusable();
      if (!$items.length) {
        return;
      }
      var $first = $items.first();
      var $last = $items.last();
      var active = document.activeElement;

      if (key === "Escape" || key === "Esc" || key === 27) {
        e.preventDefault();
        closeSitemapBox();
        return;
      }

      var scrollKeys = {
        ArrowDown: 40,
        ArrowUp: -40,
        PageDown: 200,
        PageUp: -200,
        End: "bottom",
        Home: "top"
      };
      if (scrollKeys.hasOwnProperty(key) && panel && panel.contains(active)) {
        var $nav = $panel().find(".map_nav");
        var inMapNav = $(active).closest(".map_nav").length || active === $nav[0];
        if (inMapNav && $nav.length) {
          var delta = scrollKeys[key];
          if ($nav.data("mCS")) {
            e.preventDefault();
            if (delta === "top" || delta === "bottom") {
              $nav.mCustomScrollbar("scrollTo", delta);
            } else {
              var rel = (delta > 0 ? "+=" : "-=") + Math.abs(delta);
              $nav.mCustomScrollbar("scrollTo", rel, { scrollInertia: 120 });
            }
            return;
          }
          if ($nav[0].scrollHeight > $nav[0].clientHeight) {
            e.preventDefault();
            if (delta === "top") {
              $nav[0].scrollTop = 0;
            } else if (delta === "bottom") {
              $nav[0].scrollTop = $nav[0].scrollHeight;
            } else {
              $nav[0].scrollTop += delta;
            }
            return;
          }
        }
      }

      if (key !== "Tab" && key !== 9) {
        return;
      }

      if (!panel || !panel.contains(active)) {
        e.preventDefault();
        if (e.shiftKey) {
          $last.focus();
        } else {
          $first.focus();
        }
        return;
      }

      if (e.shiftKey) {
        if (active === $first[0]) {
          e.preventDefault();
          $last.focus();
        }
      } else if (active === $last[0]) {
        e.preventDefault();
        $first.focus();
      }
    });

  window.sitemapClose = function sitemapClose() {
    if (isOpen()) {
      closeSitemapBox();
    }
  };

  window.initMastheadSitemapBox = initMastheadSitemapBox;
}

/* ============================================================
 * 17. 상단 사이트맵 팝업 열기/닫기 트리거 (layout.js)
 * 사이트맵 on/off 는 initMastheadSitemapBox() 가 담당한다.
 * ============================================================ */
function initSitemapPopupTrigger() {
  $("header .gnb_util .totalSearchArea .btn_searchOpt").click(function () {
    if ($(".search_opt").hasClass("on")) {
      $(".search_opt").removeClass("on");
    } else {
      $(".search_opt").addClass("on");
    }
  });

  $("header .gnb_util .totalSearchArea .search_opt ul button").click(function () {
    $(".search_opt").removeClass("on");
  });
}
/* ============================================================
 * 18. 탭 너비 계산 / 모바일 탭 슬라이드 (layout.js)
 * ============================================================ */
function tab_w() {
  if (window.innerWidth >= 1024) {
    $("#pageTab li").css({
      width: 100 / $("#pageTab li").length + "%"
    });
  } else {
    $("#pageTab li").css({
      width: ""
    });
  }

  if (window.innerWidth >= 1024) {
    $("#pageTab02 li").css({
      width: 100 / $("#pageTab02 li").length + "%"
    });
  } else {
    $("#pageTab02 li").css({
      width: ""
    });
  }

  if (window.innerWidth >= 1024) {
    $("#contTab_line li").css({
      width: 100 / $("#contTab_line li").length + "%"
    });
  } else {
    $("#contTab_line li").css({
      width: ""
    });
  }

  $("#contTab_fix li").each(function () {
    if (window.innerWidth >= 1024) {
      $(this).css({
        width: 100 / $("#contTab_fix li").length + "%"
      });
    } else {
      $(this).css({
        width: ""
      });
    }
  });
}

/* 모바일 탭 슬라이드 전환 (Sly — Slick 아님) */
function mbTabSlide() {
  if (window.innerWidth <= 1023) {
    var tabNum = $("#pageTab .tabList>li").length;

    if (tabNum > 2) {
      var on = $("#pageTab .tabList li").find(".on").parent("li").index();
      $("#pageTab").sly({
        horizontal: 1,
        itemNav: "centered",
        speed: 300,
        smart: 1,
        activateOn: "click",
        mouseDragging: 1,
        touchDragging: 1,
        activateMiddle: 1,
        releaseSwing: 1,
        activeClass: "active",
        startAt: on
      });

      setTimeout(function () {
        $("#pageTab ul").css("width", function (i) {
          return $(this).width() + 80;
        });
      }, 100);
    }
  } else {
    $("#pageTab").sly(false);
    $("#pageTab .tabList").css("width", "auto");
  }
}

function mbTabSlide02() {
  if (window.innerWidth <= 1023) {
    var tabNum = $("#contTab_line .tabList>li").length;

    if (tabNum > 1) {
      var on = $("#contTab_line .tabList li").find(".on").parent("li").index();
      $("#contTab_line").sly({
        horizontal: 1,
        itemNav: "centered",
        speed: 300,
        smart: 1,
        activateOn: "click",
        mouseDragging: 1,
        touchDragging: 1,
        activateMiddle: 1,
        releaseSwing: 1,
        activeClass: "active",
        startAt: on
      });

      setTimeout(function () {
        $("#contTab_line ul").css("width", function (i) {
          return $(this).width() + 70;
        });
      }, 300);
    }
  } else {
    $("#contTab_line").sly(false);
    $("#contTab_line .tabList").css("width", "100%");
  }
}

function initTabResize() {
  $(window).bind("load resize", function () {
    if (typeof window.pnb_btnTit === "function") window.pnb_btnTit();
    mbTabSlide();
    mbTabSlide02();
    mbMenuResult();
    // tab_w();

    /** 해제 **/
    mBtnClose(); //모바일메뉴
    if (typeof window.sitemapClose === "function") window.sitemapClose(); // sitemap
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
  };
}
/* ============================================================
 * 20. 접근성 (skip menu, 키보드 포커스 이동) (layout.js)
 * ============================================================ */
function initAccessibility() {
  // 본문 랜드마크: <main> 대체 — #contents에 role="main"
  if ($("#contents").length && !$("#contents").is("main") && !$("main").length) {
    $("#contents").attr("role", "main");
  }
  $("#skip_menu a").focusin(function () {
    $("#contents").attr("tabindex", "0");
    $("#gnb").attr("tabindex", "0");
    $("#footer").attr("tabindex", "0");
    typeKeyNav = 1;
  });

  $("#skip_menu").focusout(function () {
    $("#contents").removeAttr("tabindex");
    $("#gnb").removeAttr("tabindex");
    $("#footer").removeAttr("tabindex");
  });

  $(".top_util .moreSiteArea .btn_close").keydown(function (event) {
    var v_keyCode = event.keyCode || event.which;

    if (v_keyCode == 9) {
      if (!event.shiftKey) {
        $(".top_util .moreSiteArea ul li:first-child").find("a").focus();
        return false;
      }
    }
  });

  //gnbON
  $("#gnb>li>a").focusin(function () {
    $(this).trigger("mouseover");
  });

  $("#gnb>li>a").keydown(function (event) {
    var gnb_loc = $(this).parent("li").index();
    var v_keyCode = event.keyCode || event.which;
    if (v_keyCode == 9) {
      if (event.shiftKey) {
        if (gnb_loc > 0) {
          $(this).parent("li").prev("li").find("a").first().trigger("mouseover");
          if ($(this).prev("li").hasClass("child")) {
            if (
              $("header>nav #gnb>li:nth-child(" + gnb_loc + ") .menuM>li:last-child").hasClass(
                "child"
              )
            ) {
              $(
                "header>nav #gnb>li:nth-child(" +
                  gnb_loc +
                  ") .menuM>li:last-child .menuS>li:last-child"
              )
                .find("a")
                .first()
                .focus();
              return false;
            } else {
              $("header>nav #gnb>li:nth-child(" + gnb_loc + ") .menuM>li:last-child")
                .find("a")
                .first()
                .focus();
              return false;
            }
          }
        } else {
          $(this).trigger("mouseleave");
          $(".top_util .btn_goDream").focus();
          return false;
        }
      }
    }
  });

  //gnb Off
  $("header .logo>a").on("focusout", function (e) {
    $(this).trigger("mouseleave");
  });

  /*
   *GBN 하위 메뉴중 display:none 을 제외한 마지막 객체 제어
   */
  //Show, hide 상태 검증 변수 브라우저별 display:none 띄워쓰기 달라서 경우의 수에 따라 검증 범위 확장
  var TargetState =
    "[style*='display:none'], [style*='display: none'], [style*='display :none'], [style*='display : none']";

  $("header>nav #gnb>li")
    .not(TargetState)
    .last()
    .find(".menuM>li")
    .not(TargetState)
    .last()
    .find(".menuS>li")
    .not(TargetState)
    .last()
    .on("focusout", function (e) {
      $(this).trigger("mouseleave");
    });

  $("header>nav #gnb>li")
    .not(TargetState)
    .last()
    .find(".menuM>li")
    .not(TargetState)
    .last()
    .on("focusout", function (e) {
      if (!$(this).hasClass("child")) {
        $(this).trigger("mouseleave");
      }
    });

  $("header .gnb_util button:last-child").on("focusout", function (e) {
    $(this).trigger("mouseleave");
  });

  // 사이트맵 팝업 키보드는 initMastheadSitemapBox() 에서 처리

  //pnb
  $("#pnb .pnb_func .shareBox .btn_close").keydown(function (event) {
    var v_keyCode = event.keyCode || event.which;
    if (v_keyCode == 9) {
      if (!event.shiftKey) {
        $(".shareBox_wrap ul li:first-child").find("a").focus();
        return false;
      }
    }
  });

  $(".shareBox_wrap ul li:first-child a").keydown(function (event) {
    var v_keyCode = event.keyCode || event.which;
    if (v_keyCode == 9) {
      if (event.shiftKey) {
        $("#pnb .pnb_func .shareBox .btn_close").focus();
        return false;
      }
    }
  });
}
/* ============================================================
 * 21. 모바일 접근성 (load/resize 시 tabindex 재설정) (layout.js)
 * ============================================================ */
function initMobileAccessibility() {
  $(window).bind("load resize", function () {
    if ($(window).innerWidth() <= 1023) {
      //gnb
      $("header .logo a").keydown(function (event) {
        var v_keyCode = event.keyCode || event.which;

        if (v_keyCode == 9) {
          if (!event.shiftKey) {
            $("header .top_util a:first-child").focus();
            return false;
          }
        }
      });

      $("header .gnb_util .btn_mypage").keydown(function (event) {
        var v_keyCode = event.keyCode || event.which;

        if (v_keyCode == 9) {
          if (!event.shiftKey) {
            $("header .mBtn_topMenu").focus();
            return false;
          }
        }
      });

      $("header .gnb_util .btn_login").keydown(function (event) {
        var v_keyCode = event.keyCode || event.which;

        if (v_keyCode == 9) {
          if (!event.shiftKey) {
            $("header .mBtn_topMenu").focus();
            return false;
          }
        }
      });

      //mVisual
      $("header .mBtn_topMenu").keydown(function (event) {
        var v_keyCode = event.keyCode || event.which;

        if (v_keyCode == 9) {
          if (event.shiftKey) {
            if ($("header .gnb_util .btn_mypage").length > 0) {
              $("header .gnb_util .btn_mypage").focus();
              return false;
            } else {
              $("header .gnb_util .btn_search").focus();
              return false;
            }
          } else {
            $("#container").find("a").first().focus();
          }
        }
      });

      $("header .gnb_util .btn_search").keydown(function (event) {
        var v_keyCode = event.keyCode || event.which;

        if (v_keyCode == 9) {
          if (event.shiftKey) {
            $("header .logo a").focus();
            return false;
          }
        }
      });

      // bookmark
      $(".snb_bookmark .list .unit").attr("aria-hidden", "false");
      $(".snb_bookmark .list .unit a").attr("tabindex", "0");

      // tab
      $("#pageTab .slick-slide").attr("aria-hidden", "false");
      $("#pageTab .slick-slide a").attr("tabindex", "0");
      $("#contTab_line .slick-slide").attr("aria-hidden", "false");
      $("#contTab_line .slick-slide a").attr("tabindex", "0");
    } else {
      $("#header nav").show();
    }
  });
}
/* ============================================================
 * 22. As-is 탑배너 팝업 (layout.js)
 * ============================================================ */
function initTopBannerPopup() {
  $(".new_header_19 .btn_more").click(function () {
    $("div.pop_home").slideDown(200);
  });

  $("div.pop_home p").hover(function () {
    $(this).addClass("on");
    $(this).find(".btn_s").hide();
    $(this).find(".btn_o").show();
  });

  $("div.pop_home p").mouseout(function (e) {
    $(this).siblings("p").removeClass("on");
    $(this).siblings("p").find(".btn_o").hide();
    $(this).siblings("p").find(".btn_s").show();
  });

  $("div.home_box").hover(function () {
    var btnOn = $("div.pop_home p.on");
    btnOn.removeClass("on");
    if (btnOn) {
      btnOn.find(".btn_o").hide();
      btnOn.find(".btn_s").show();
    }
  });

  $("div.home_box .btn_close").click(function () {
    var btnOn = $("div.pop_home p.on");
    btnOn.removeClass("on");
    if (btnOn) {
      btnOn.find(".btn_o").hide();
      btnOn.find(".btn_s").show();
    }

    $("div.pop_home").slideUp(200);
  });
}
