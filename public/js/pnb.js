/* ============================================================
 * pnb.js  (시장뉴스)
 * - html_org/menu_*.html 의 #pnb 구조를 기준으로 구현
 *
 * 구조 (org):
 *   #pnb
 *     .pnb_nav > a.btn_home + ul > li > .navList > .menu > btnTit + ul(형제)
 *     .pnb_menu > .pnbList > .menu > btnTit(현재) + ul(형제, href="#;" data-menuno)
 *     .pnb_func > 프린트/공유/공유박스
 *
 * 메뉴 소스 (우선순위):
 *   1) html_org 정적 trail (js/pnb_org_trails.js) — DOM 링크 없어도 전 메뉴
 *   2) PC 헤더 .gnb_menu / 사이트맵 #sitemap / 레거시 #gnb
 *   3) L1 단독 폴백 (10~60, 400, 770)
 *
 * - 드롭다운: href="#;" + data-menuno → 해당 MENU_ID 로 이동
 * ============================================================ */

(function (window, $) {
  "use strict";

  if (!$ || !$.fn) {
    return;
  }

  var PNB_HOME_HREF = "/kotranews/index.do";

  /**
   * html_org L1 전체 (menu_10/400/770 등 L1 단독 pnbList 형제)
   * 노출 GNB: 10~60 / 숨김: 400 열린마당, 770 로그인
   */
  var L1_MENU_ITEMS = [
    { text: "뉴스", menuNo: "10" },
    { text: "상품·산업", menuNo: "20" },
    { text: "국가·지역정보", menuNo: "30" },
    { text: "보고서", menuNo: "40" },
    { text: "멀티미디어뉴스", menuNo: "50" },
    { text: "해외투자", menuNo: "60" },
    { text: "열린마당", menuNo: "400" },
    { text: "로그인", menuNo: "770" },
  ];

  var L1_MENU_BY_LABEL = {};
  for (var _i = 0; _i < L1_MENU_ITEMS.length; _i++) {
    L1_MENU_BY_LABEL[L1_MENU_ITEMS[_i].text] = L1_MENU_ITEMS[_i].menuNo;
  }

  /** MENU_ID 없는 외부 메뉴 (html_org data-menuno="590") */
  var EXTERNAL_MENU_BY_NO = {
    590: {
      text: "청산·국내복귀",
      href: "https://www.investkorea.org/ik-kr/cntnts/i-237/web.do",
      target: "_blank",
    },
  };
  var EXTERNAL_MENU_BY_LABEL = {
    "청산·국내복귀": "590",
  };

  var PNB_SKELETON_HTML =
    '<div class="pnb_nav">' +
    '  <a href="' +
    PNB_HOME_HREF +
    '" class="btn_home" title="홈 화면 이동" target="_self"><span class="txtHidden">홈</span></a>' +
    "  <ul></ul>" +
    "</div>" +
    '<div class="pnb_menu">' +
    '  <div class="pnbList">' +
    '    <div class="menu">' +
    '      <button type="button" class="btnTit" title="열기"></button>' +
    "      <ul></ul>" +
    "    </div>" +
    "  </div>" +
    "</div>" +
    '<div class="pnb_func">' +
    '  <button type="button" class="btn_print" title="프린트">프린트</button>' +
    '  <button type="button" class="btn_share" title="공유하기">공유</button>' +
    '  <div class="shareBox">' +
    '    <div class="shareBox_wrap">' +
    "      <strong>공유하기</strong>" +
    "      <ul>" +
    '        <li><a href="javascript:void(0);" class="btn_facebook" onclick="shareSns(\'facebook\');" title="페이스북 공유하기">페이스북</a></li>' +
    '        <li><a href="javascript:void(0);" class="btn_twitter" onclick="shareSns(\'twitter\');" title="X 공유하기">X</a></li>' +
    '        <li><a href="javascript:void(0);" id="kakao-link-btn" class="btn_kakaotalk" title="카카오톡 공유하기">카카오톡</a></li>' +
    '        <li><a href="javascript:void(0);" class="btn_nBlog" onclick="shareSns(\'blog\');" title="네이버블로그 공유하기">네이버블로그</a></li>' +
    '        <li><a href="javascript:void(0);" class="btn_nBand" onclick="shareSns(\'band\');" title="네이버밴드 공유하기">네이버밴드</a></li>' +
    '        <li class="etc">' +
    '          <input type="text" id="copyUrl" title="복사할 URL">' +
    '          <button type="button" class="btn_urlCopy">URL 복사</button>' +
    "        </li>" +
    "      </ul>" +
    '      <button type="button" class="btn_close">닫기</button>' +
    "    </div>" +
    "  </div>" +
    "</div>";

  function getCurrentMenuId() {
    var menuId = $.trim($("#MENU_ID").val() || $("input[name=MENU_ID]").val() || "");
    if (menuId) return String(menuId);

    try {
      if (window.URLSearchParams) {
        menuId = new URLSearchParams(window.location.search).get("MENU_ID") || "";
        if (menuId) return String(menuId);
      }
    } catch (e) {}

    var matched = String(window.location.search).match(/[?&]MENU_ID=(\d+)/i);
    if (matched) return matched[1];

    var pathMatch = String(window.location.pathname || "").match(/(?:^|\/)_?menu_(\d+)\.html$/i);
    return pathMatch ? pathMatch[1] : "";
  }

  function getMenuIdFromHref(href) {
    var m = String(href || "").match(/[?&]MENU_ID=(\d+)/i);
    return m ? m[1] : "";
  }

  function getGnbMenuNo($a) {
    if (!$a || !$a.length) return "";
    var fromHref = getMenuIdFromHref($a.attr("href"));
    if (fromHref) return fromHref;
    var className = $a.attr("class") || "";
    var classMatch = className.match(/\b(\d+)\b/);
    return classMatch ? classMatch[1] : "";
  }

  function menuLabel($el) {
    if (!$el || !$el.length) return "";
    var $span = $el.children("span").first();
    if ($span.length) return $.trim($span.text());
    var title = $.trim($el.attr("title") || "");
    if (title && title.indexOf("현재창") === -1 && title.indexOf("새창") === -1) {
      return title;
    }
    return $.trim($el.text());
  }

  function isDisplayNone($el) {
    if (!$el || !$el.length) return true;
    if (/display\s*:\s*none/i.test($el.attr("style") || "")) return true;
    try {
      if ($el.css("display") === "none") return true;
    } catch (e) {}
    return false;
  }

  function getNewsGnbRoot() {
    var $root = $(".header_news .news_main_menu:not(.sample) .gnb_menu").first();
    if ($root.length) return $root;
    return $(".news_main_menu:not(.sample) .main_menu_inner > .gnb_menu").first();
  }

  function getSitemapRoot() {
    var $root = $(".sitemapBox ul#sitemap, .map_nav ul#sitemap, ul#sitemap").first();
    return $root;
  }

  function hasLegacyGnb() {
    return $("#gnb").length > 0;
  }

  function hasNewsGnb() {
    return getNewsGnbRoot().length > 0;
  }

  function hasSitemap() {
    return getSitemapRoot().length > 0;
  }

  /** a[href*MENU_ID] exact match within $scope */
  function findLinkInScope($scope, menuId) {
    var id = String(menuId);
    if (!$scope || !$scope.length) return $();
    return $scope
      .find("a[href]")
      .filter(function () {
        return getMenuIdFromHref(this.getAttribute("href")) === id;
      })
      .first();
  }

  /**
   * MENU_ID → 링크 (news → sitemap → #gnb)
   * @returns {{ $a: jQuery, source: string }|null}
   */
  function findMenuLinkContext(menuId) {
    var id = String(menuId || "");
    if (!id) return null;

    var $news = findLinkInScope(getNewsGnbRoot(), id);
    if ($news.length) return { $a: $news, source: "news" };

    var $map = findLinkInScope(getSitemapRoot(), id);
    if ($map.length) return { $a: $map, source: "sitemap" };

    if (hasLegacyGnb()) {
      var $byClass = $("#gnb a").filter(function () {
        return (" " + (this.className || "") + " ").indexOf(" " + id + " ") > -1;
      });
      if ($byClass.length) return { $a: $byClass.first(), source: "legacy" };
      var $byHref = findLinkInScope($("#gnb"), id);
      if ($byHref.length) return { $a: $byHref, source: "legacy" };
    }

    return null;
  }

  function findLinkByMenuId(menuId) {
    var ctx = findMenuLinkContext(menuId);
    return ctx ? ctx.$a : $();
  }

  function getL1MenuNoFromLabel(label) {
    return L1_MENU_BY_LABEL[$.trim(label || "")] || "";
  }

  function getL1MenuNoFromTrigger($trigger) {
    var label = menuLabel($trigger);
    if (getL1MenuNoFromLabel(label)) return getL1MenuNoFromLabel(label);
    var $li = $trigger.closest("li");
    var $first = $li
      .find("ul.gnb_depth2 > li > a")
      .filter(function () {
        return !!getMenuIdFromHref(this.getAttribute("href"));
      })
      .first();
    return getGnbMenuNo($first) || "";
  }

  /**
   * L1 형제 (html_org 고정)
   * - L1 단독 현재(menu_10/400/770): 10~60 + 400 + 770
   * - 하위 페이지 조상 navList: 노출 10~60 만
   */
  function getL1SiblingItems(includeHidden) {
    if (includeHidden) {
      return L1_MENU_ITEMS.map(function (item) {
        return { text: item.text, menuNo: item.menuNo };
      });
    }
    return L1_MENU_ITEMS.filter(function (item) {
      return item.menuNo !== "400" && item.menuNo !== "770";
    }).map(function (item) {
      return { text: item.text, menuNo: item.menuNo };
    });
  }

  function resolveAnchorMenuItem($a) {
    if (!$a || !$a.length) return null;
    var text = menuLabel($a);
    var menuNo = getGnbMenuNo($a);
    if (!menuNo && EXTERNAL_MENU_BY_LABEL[text]) {
      menuNo = EXTERNAL_MENU_BY_LABEL[text];
    }
    if (!menuNo) return null;
    return { text: text, menuNo: menuNo };
  }

  function siblingItemsFromLis($lis) {
    var items = [];
    $lis.not(".emptyArea").each(function () {
      var $li = $(this);
      var $a = $li.children("a").first();
      if ($a.length) {
        var item = resolveAnchorMenuItem($a);
        if (item) items.push(item);
        return;
      }
      var $h3 = $li.children("h3").first();
      if ($h3.length) {
        var label = menuLabel($h3);
        var no = getL1MenuNoFromLabel(label);
        if (!no) return;
        items.push({ text: label, menuNo: no });
      }
    });
    return items;
  }

  /** DOM 에 링크 없는 L1 (로그인 770 등) → pnbList 단독 trail */
  function buildTrailFromL1Only(menuId) {
    var id = String(menuId || "");
    for (var i = 0; i < L1_MENU_ITEMS.length; i++) {
      if (L1_MENU_ITEMS[i].menuNo === id) {
        return [
          {
            text: L1_MENU_ITEMS[i].text,
            menuNo: id,
            siblings: getL1SiblingItems(true),
          },
        ];
      }
    }
    return null;
  }

  function getNewsL2SiblingItems($l1Li) {
    return siblingItemsFromLis($l1Li.find("ul.gnb_depth2").first().children("li"));
  }

  function getNewsL3SiblingItems($depth3Ul) {
    return siblingItemsFromLis($depth3Ul.children("li"));
  }

  function buildTrailFromNewsGnbLink($a, menuId) {
    if (!$a || !$a.length) return null;
    if (!$a.closest(".gnb_menu").length) return null;

    var trail = [];
    var $depth3Ul = $a.closest("ul.depth3_list");

    if ($depth3Ul.length) {
      var $l2Li = $depth3Ul.closest("li");
      var $l2a = $l2Li.children("a").first();
      var $l1Li = $l2Li.closest(".gnb_menu > li");
      var $trigger = $l1Li.children(".gnb_main_trigger").first();

      trail.push({
        text: menuLabel($trigger),
        menuNo: getL1MenuNoFromTrigger($trigger),
        siblings: getL1SiblingItems(false),
      });
      trail.push({
        text: menuLabel($l2a),
        menuNo: getGnbMenuNo($l2a),
        siblings: getNewsL2SiblingItems($l1Li),
      });
      trail.push({
        text: menuLabel($a),
        menuNo: getGnbMenuNo($a) || String(menuId),
        siblings: getNewsL3SiblingItems($depth3Ul),
      });
      return trail;
    }

    if ($a.closest("ul.gnb_depth2").length) {
      var $l1 = $a.closest(".gnb_menu > li");
      var $trig = $l1.children(".gnb_main_trigger").first();
      trail.push({
        text: menuLabel($trig),
        menuNo: getL1MenuNoFromTrigger($trig),
        siblings: getL1SiblingItems(false),
      });
      trail.push({
        text: menuLabel($a),
        menuNo: getGnbMenuNo($a) || String(menuId),
        siblings: getNewsL2SiblingItems($l1),
      });
      return trail;
    }

    return null;
  }

  /**
   * 사이트맵 #sitemap → trail (열린마당·4뎁스 menuSS 포함)
   * li > h3 = L1, ul.menuM = L2, ul.menuS = L3, ul.menuSS = L4
   */
  function buildTrailFromSitemapLink($a, menuId) {
    if (!$a || !$a.length) return null;
    var $sitemap = getSitemapRoot();
    if (!$sitemap.length || !$a.closest($sitemap).length) return null;

    var trail = [];
    var $li = $a.closest("li");
    var guard = 0;

    while ($li.length && $li.closest($sitemap).length && guard < 8) {
      guard++;
      var $childA = $li.children("a").first();
      var $h3 = $li.children("h3").first();
      var text = "";
      var menuNo = "";
      var siblings = [];

      if ($childA.length) {
        text = menuLabel($childA);
        menuNo = getGnbMenuNo($childA) || "";
        siblings = siblingItemsFromLis($li.parent().children("li"));
      } else if ($h3.length) {
        text = menuLabel($h3);
        menuNo = getL1MenuNoFromLabel(text);
        siblings = [];
      } else {
        break;
      }

      trail.unshift({ text: text, menuNo: menuNo, siblings: siblings });

      var $parentUl = $li.parent("ul");
      if (!$parentUl.length) break;
      if ($parentUl.is($sitemap) || $parentUl.attr("id") === "sitemap") break;
      $li = $parentUl.parent("li");
    }

    if (!trail.length) return null;

    // L1 형제: org — 현재=L1 이면 숨김 포함, 조상이면 노출만
    var l1IsCurrent = trail.length === 1;
    trail[0].siblings = getL1SiblingItems(l1IsCurrent);

    if (!trail[trail.length - 1].menuNo && menuId) {
      trail[trail.length - 1].menuNo = String(menuId);
    }
    return trail;
  }

  function buildTrailFromLegacyLink($a, menuId) {
    if (!$a || !$a.length) return null;
    var $leaf = $a.closest("#gnb li");
    if (!$leaf.length) return null;

    var trail = [];
    var $node = $leaf;
    while ($node.length && $node.closest("#gnb").length) {
      var $link = $node.children("a").first();
      if ($link.length) {
        trail.unshift({
          text: menuLabel($link),
          menuNo: getGnbMenuNo($link),
          siblings: siblingItemsFromLis($node.parent().children("li")),
        });
      }
      $node = $node.parent().closest("#gnb li");
    }
    if (!trail.length) return null;

    var l1IsCurrent = trail.length === 1;
    trail[0].siblings = getL1SiblingItems(l1IsCurrent);
    if (!trail[trail.length - 1].menuNo && menuId) {
      trail[trail.length - 1].menuNo = String(menuId);
    }
    return trail;
  }

  /** html_org 에서 추출한 정적 trail (js/pnb_org_trails.js → window.PNB_ORG_TRAILS) */
  function buildTrailFromOrgData(menuId) {
    var id = String(menuId || "");
    var table = window.PNB_ORG_TRAILS;
    if (!table || !table[id] || !table[id].length) return null;
    return table[id].map(function (level) {
      return {
        text: level.text,
        menuNo: level.menuNo,
        siblings: (level.siblings || []).map(function (s) {
          return { text: s.text, menuNo: s.menuNo };
        }),
      };
    });
  }

  function buildPnbTrail(menuId) {
    var id = String(menuId || "");
    if (!id) return null;

    // 1) html_org 정적 trail — DOM 링크 없어도 전 메뉴 동작
    var orgTrail = buildTrailFromOrgData(id);
    if (orgTrail && orgTrail.length) return orgTrail;

    // 2) 살아 있는 GNB / 사이트맵 DOM
    var ctx = findMenuLinkContext(id);
    if (ctx) {
      var trail = null;
      if (ctx.source === "news") {
        trail = buildTrailFromNewsGnbLink(ctx.$a, id);
      } else if (ctx.source === "sitemap") {
        trail = buildTrailFromSitemapLink(ctx.$a, id);
      } else if (ctx.source === "legacy") {
        trail = buildTrailFromLegacyLink(ctx.$a, id);
      }
      if (trail && trail.length) return trail;
    }

    // 3) L1 단독 폴백 (로그인 770 등)
    return buildTrailFromL1Only(id);
  }

  function getGnbLeafLi() {
    var menuId = getCurrentMenuId();
    var $a = findLinkByMenuId(menuId);
    if ($a.length) return $a.closest("li");

    var $leaf = $("#gnb li.on")
      .filter(function () {
        return $(this).find("li.on").length === 0;
      })
      .first();
    if ($leaf.length) return $leaf;

    var $aOn = $("#gnb a.on").first();
    if ($aOn.length) return $aOn.closest("li");
    return $();
  }

  function applyGnbCurrentByMenuId() {
    var menuId = getCurrentMenuId();
    if (!menuId) return;

    var ctx = findMenuLinkContext(menuId);
    if (!ctx) return;
    var $a = ctx.$a;

    if (ctx.source === "news" && hasNewsGnb()) {
      var $root = getNewsGnbRoot();
      $root.find("li, a, .gnb_main_trigger").removeClass("on");
      $a.addClass("on");
      $a.closest("li").addClass("on");
      $a.parents(".gnb_menu li").addClass("on");
      $a.closest(".gnb_menu > li").children(".gnb_main_trigger").addClass("on");
    }

    if (ctx.source === "sitemap") {
      var $map = getSitemapRoot();
      $map.find("li, a").removeClass("on");
      $a.addClass("on");
      $a.closest("li").addClass("on");
      $a.parents("#sitemap li").addClass("on");
    }

    if (hasLegacyGnb()) {
      var $legacy = findLinkInScope($("#gnb"), menuId);
      if (!$legacy.length) {
        $legacy = $("#gnb a").filter(function () {
          return (" " + (this.className || "") + " ").indexOf(" " + menuId + " ") > -1;
        });
      }
      if ($legacy.length) {
        $("#gnb li").removeClass("on");
        $("#gnb a").removeClass("on");
        var $li = $legacy.first().closest("li");
        $li.addClass("on");
        $li.parents("#gnb li").addClass("on");
        $li.closest("#gnb > li").children("a").addClass("on");
      }
    }
  }

  function calcGnbDepthVars() {
    window.gnbDep1 = 0;
    window.gnbDep2 = 0;
    window.gnbDep3 = 0;

    var menuId = getCurrentMenuId();
    var trail = buildPnbTrail(menuId);
    if (trail && trail.length) {
      window.gnbDep1 = 1;
      if (trail.length >= 2) window.gnbDep2 = 1;
      if (trail.length >= 3) window.gnbDep3 = 1;
    }

    if (hasNewsGnb()) {
      var $a = findLinkInScope(getNewsGnbRoot(), menuId);
      if ($a.length) {
        var $l1Li = $a.closest(".gnb_menu > li");
        window.gnbDep1 = getNewsGnbRoot().children("li").index($l1Li) + 1;
        if ($a.closest("ul.depth3_list").length) {
          var $l2Li = $a.closest("ul.depth3_list").closest("li");
          window.gnbDep2 =
            $l1Li.find("ul.gnb_depth2").first().children("li").index($l2Li) + 1;
          window.gnbDep3 =
            $a.closest("ul.depth3_list").children("li").index($a.closest("li")) + 1;
        } else if ($a.closest("ul.gnb_depth2").length) {
          window.gnbDep2 =
            $l1Li.find("ul.gnb_depth2").first().children("li").index($a.closest("li")) + 1;
        }
      }
      return getGnbLeafLi();
    }

    var $leaf = getGnbLeafLi();
    if (!$leaf.length || !$leaf.closest("#gnb").length) return $leaf;

    var $parentUl = $leaf.parent("ul");
    if ($parentUl.hasClass("menuS")) {
      window.gnbDep1 = $("#gnb > li").index($leaf.closest("ul.menuM").parent()) + 1;
      window.gnbDep2 =
        $leaf.closest("ul.menuM").children("li").index($leaf.parent().closest("li")) + 1;
      window.gnbDep3 = $parentUl.children("li").index($leaf) + 1;
    } else if ($parentUl.hasClass("menuM")) {
      window.gnbDep1 = $("#gnb > li").index($leaf.closest("ul.menuM").parent()) + 1;
      window.gnbDep2 = $parentUl.children("li").index($leaf) + 1;
    } else {
      window.gnbDep1 = $("#gnb > li").index($leaf) + 1;
    }
    return $leaf;
  }

  function getPnbSiblingLis($li) {
    return $li.parent().children("li").not(".emptyArea");
  }

  function getVisibleSiblingLis($li) {
    return getPnbSiblingLis($li).filter(function () {
      return !isDisplayNone($(this));
    });
  }

  function escapePnbText(text) {
    return $("<div>")
      .text(text == null ? "" : text)
      .html();
  }

  function escapePnbAttr(text) {
    return String(text == null ? "" : text)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");
  }

  function buildPnbDropdownFromItems(items) {
    var html = "";
    if (!items || !items.length) return html;
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (!item || !item.menuNo) continue;
      html +=
        '<li><a href="#;" data-menuno="' +
        escapePnbAttr(item.menuNo) +
        '" target="_self">' +
        escapePnbText(item.text) +
        "</a></li>";
    }
    return html;
  }

  function buildPnbDropdownHtml($siblingLis) {
    return buildPnbDropdownFromItems(siblingItemsFromLis($siblingLis));
  }

  function buildNavListHtml(trailItem) {
    return (
      '<li><div class="navList"><div class="menu">' +
      '<button type="button" class="btnTit" title="열기">' +
      escapePnbText(trailItem.text) +
      "</button>" +
      "<ul>" +
      buildPnbDropdownFromItems(trailItem.siblings) +
      "</ul>" +
      "</div></div></li>"
    );
  }

  function ensurePnbSkeleton() {
    var $pnb = $("#pnb");
    if (!$pnb.length) {
      if ($("#contents").length) {
        $("#contents").prepend('<div id="pnb"></div>');
      } else {
        return $();
      }
      $pnb = $("#pnb");
    }
    if (!$pnb.find(".pnb_nav").length || !$pnb.find(".pnb_menu").length) {
      $pnb.html(PNB_SKELETON_HTML);
    }
    return $pnb;
  }

  /**
   * MENU_ID → #pnb 텍스트/목록 채움 (전 페이지 범용)
   * page15(MENU_ID=1310 공지사항) 등 PC GNB 밖 메뉴는 사이트맵으로 채움
   */
  function initPnbFromGnb() {
    var $pnb = ensurePnbSkeleton();
    if (!$pnb.length) return;

    var menuId = getCurrentMenuId();
    var trail = buildPnbTrail(menuId);
    if (!trail || !trail.length) return;

    var current = trail[trail.length - 1];
    var ancestors = trail.slice(0, -1);
    var navHtml = "";
    for (var i = 0; i < ancestors.length; i++) {
      navHtml += buildNavListHtml(ancestors[i]);
    }

    $pnb.find(".pnb_nav > ul").html(navHtml);
    $pnb.find(".pnb_menu .pnbList .btnTit").attr("title", "열기").text(current.text || "");
    $pnb
      .find(".pnb_menu .pnbList .menu > ul")
      .html(buildPnbDropdownFromItems(current.siblings));
  }

  function navigateByMenuNo(menuNo) {
    if (!menuNo && menuNo !== 0) return;
    var val = String(menuNo);

    var external = EXTERNAL_MENU_BY_NO[val];
    if (external && external.href) {
      if (external.target === "_blank") {
        window.open(external.href);
      } else {
        location.href = external.href;
      }
      return;
    }

    var $target = findLinkByMenuId(val);

    // L1 (10/20/…/400/770) — 링크가 없으면 해당 섹션 첫 하위 또는 CMS URL
    if (!$target.length) {
      var label = "";
      for (var key in L1_MENU_BY_LABEL) {
        if (L1_MENU_BY_LABEL[key] === val) {
          label = key;
          break;
        }
      }
      if (label && hasSitemap()) {
        getSitemapRoot()
          .children("li")
          .each(function () {
            var $h3 = $(this).children("h3").first();
            if (menuLabel($h3) !== label) return;
            $target = $(this)
              .find("a[href]")
              .filter(function () {
                return !!getMenuIdFromHref(this.getAttribute("href"));
              })
              .first();
            return false;
          });
      }
      if (!$target.length && hasNewsGnb()) {
        getNewsGnbRoot()
          .children("li")
          .each(function () {
            var $trigger = $(this).children(".gnb_main_trigger").first();
            if (getL1MenuNoFromTrigger($trigger) !== val) return;
            $target = $(this)
              .find("ul.gnb_depth2 a[href]")
              .filter(function () {
                return !!getMenuIdFromHref(this.getAttribute("href"));
              })
              .first();
            return false;
          });
      }
      if (!$target.length && /^\d+$/.test(val)) {
        location.href = "/kotranews/cms/com/index.do?MENU_ID=" + val;
        return;
      }
    }

    if (!$target.length) return;

    $target.closest("li").trigger("click");
    var href = $target.attr("href");
    var target = $target.attr("target");
    if (target === "_blank") {
      window.open(href);
    } else if (href && href !== "#" && href.indexOf("javascript:") !== 0) {
      location.href = href;
    }
  }

  function bindPnbMenuClicks() {
    $(document)
      .off("click.pnbNav", ".navList>.menu>ul>li>a")
      .on("click.pnbNav", ".navList>.menu>ul>li>a", function (e) {
        e.preventDefault();
        navigateByMenuNo($(this).data("menuno"));
      });

    $(document)
      .off("click.pnbList", ".pnbList>.menu>ul>li>a")
      .on("click.pnbList", ".pnbList>.menu>ul>li>a", function (e) {
        e.preventDefault();
        navigateByMenuNo($(this).data("menuno"));
      });
  }

  function initPnbOptions() {
    function pnb_btnTit() {
      $("#pnb .pnb_menu .pnbList .menu_txt").css({
        width:
          $("#pnb .pnb_menu .pnbList").width() -
          $("#pnb .pnb_menu .pnbList .menu").width() -
          10,
      });
    }
    window.pnb_btnTit = pnb_btnTit;

    $(document)
      .off("click.pnbMenuTit", "#pnb .pnb_menu .pnbList .btnTit")
      .on("click.pnbMenuTit", "#pnb .pnb_menu .pnbList .btnTit", function () {
        if ($("#pnb .pnb_nav .navList .menu>ul").hasClass("on")) {
          $("#pnb .pnb_nav .navList .menu>ul").removeClass("on").slideUp(200);
          $("#pnb .pnb_nav .navList .btnTit").attr("title", "열기");
        }

        if ($("#pnb .pnb_menu .pnbList").hasClass("on")) {
          $("#pnb .pnb_menu .pnbList").removeClass("on");
          $("#pnb .pnb_menu .pnbList .menu>ul").slideUp(200);
          $(this).attr("title", "열기");
        } else {
          $("#pnb .pnb_menu .pnbList").addClass("on");
          $("#pnb .pnb_menu .pnbList .menu>ul").slideDown(200);
          $(this).attr("title", "닫기");
        }
      });

    $(document)
      .off("click.pnbNavTit", "#pnb .pnb_nav .navList .btnTit")
      .on("click.pnbNavTit", "#pnb .pnb_nav .navList .btnTit", function () {
        if ($("#pnb .pnb_menu .pnbList").hasClass("on")) {
          $("#pnb .pnb_menu .pnbList").removeClass("on");
          $("#pnb .pnb_menu .pnbList .menu>ul").slideUp(200);
          $("#pnb .pnb_menu .pnbList .menu .btnTit").attr("title", "열기");
        }

        $("#pnb .pnb_nav .navList .btnTit").not(this).siblings("ul").removeClass("on").slideUp(200);
        $("#pnb .pnb_nav .navList .btnTit").not(this).attr("title", "열기");

        if ($(this).siblings("ul").hasClass("on")) {
          $(this).siblings("ul").removeClass("on").slideUp(200);
          $(this).attr("title", "열기");
        } else {
          $(this).siblings("ul").addClass("on").slideDown(200);
          $(this).attr("title", "닫기");
        }
      });

    $(document)
      .off("click.pnbShare", "#pnb .pnb_func .btn_share")
      .on("click.pnbShare", "#pnb .pnb_func .btn_share", function () {
        $(this).addClass("on");
        $("#pnb .pnb_func .shareBox").addClass("on").attr("tabindex", "-1");
        setTimeout(function () {
          $("#pnb .pnb_func .shareBox").focus();
        }, 300);
      });

    $(document)
      .off("click.pnbShareClose", "#pnb .pnb_func .shareBox .btn_close")
      .on("click.pnbShareClose", "#pnb .pnb_func .shareBox .btn_close", function () {
        $("#pnb .pnb_func .shareBox").removeClass("on");
        $("#pnb .pnb_func .btn_share").removeClass("on");
        setTimeout(function () {
          $("#pnb .pnb_func .btn_share").focus();
        }, 300);
      });

    $(document)
      .off("click.pnbBookmark", "#pnb .pnb_func .btn_bookmark")
      .on("click.pnbBookmark", "#pnb .pnb_func .btn_bookmark", function () {
        if ($(this).hasClass("on")) {
          $("#pnb .pnb_func .btn_bookmark").removeClass("on").attr("title", "북마크 선택 안됨");
        } else {
          $("#pnb .pnb_func .btn_bookmark").addClass("on").attr("title", "북마크 선택됨");
        }
      });

    $(document)
      .off("click.pnbOptOpen", ".searchOptBox .boxBtn .btn_optBoxOpen")
      .on("click.pnbOptOpen", ".searchOptBox .boxBtn .btn_optBoxOpen", function () {
        $(".searchOptBox").addClass("on");
        $(".searchOptBox .searchOpt").slideDown(200);
        $("#pnb .pnb_menu .pnbList.on .btnTit").trigger("click");
        $("#pnb .pnb_func .shareBox").removeClass("on");
      });

    $(document)
      .off("click.pnbOptClose", ".searchOptBox .boxBtn .btn_optBoxClose")
      .on("click.pnbOptClose", ".searchOptBox .boxBtn .btn_optBoxClose", function () {
        if ($(this).hasClass("seachOptTypeOpen")) {
          $(this).removeClass("seachOptTypeOpen").addClass("seachOptTypeClose");
          $(this).html("<span>상세 검색 닫기</span>");
          $(".searchBaseDN").addClass("searchOptShow");
        } else if ($(this).hasClass("seachOptTypeClose")) {
          $(this).removeClass("seachOptTypeClose").addClass("seachOptTypeOpen");
          $(this).html("<span>상세 검색 열기</span>");
          $(".searchBaseDN").removeClass("searchOptShow");
        } else {
          $(".searchOptBox .searchOpt").slideUp(200);
          $(".searchOptBox").removeClass("on");
          setTimeout(function () {
            $(".btn_optBoxOpen").focus();
          });
        }
      });

    $(document)
      .off("click.pnbBoardList", ".boardOptBox .optBox .typeView .typeList")
      .on("click.pnbBoardList", ".boardOptBox .optBox .typeView .typeList", function () {
        if (!$(this).hasClass("on")) {
          $(this).addClass("on");
          $(".boardOptBox .optBox .typeView .typeThumb").removeClass("on");
        }
      });

    $(document)
      .off("click.pnbBoardThumb", ".boardOptBox .optBox .typeView .typeThumb")
      .on("click.pnbBoardThumb", ".boardOptBox .optBox .typeView .typeThumb", function () {
        if (!$(this).hasClass("on")) {
          $(this).addClass("on");
          $(".boardOptBox .optBox .typeView .typeList").removeClass("on");
        }
      });
  }

  function initPnb() {
    ensurePnbSkeleton();
    applyGnbCurrentByMenuId();
    initPnbFromGnb();
    bindPnbMenuClicks();
    initPnbOptions();
  }

  window.getCurrentMenuId = getCurrentMenuId;
  window.getGnbMenuNo = getGnbMenuNo;
  window.getGnbLeafLi = getGnbLeafLi;
  window.applyGnbCurrentByMenuId = applyGnbCurrentByMenuId;
  window.calcGnbDepthVars = calcGnbDepthVars;
  window.getVisibleSiblingLis = getVisibleSiblingLis;
  window.getPnbSiblingLis = getPnbSiblingLis;
  window.escapePnbText = escapePnbText;
  window.escapePnbAttr = escapePnbAttr;
  window.buildPnbDropdownHtml = buildPnbDropdownHtml;
  window.buildPnbDropdownFromItems = buildPnbDropdownFromItems;
  window.buildPnbTrail = buildPnbTrail;
  window.ensurePnbSkeleton = ensurePnbSkeleton;
  window.initPnbFromGnb = initPnbFromGnb;
  window.bindPnbMenuClicks = bindPnbMenuClicks;
  window.initPnbOptions = initPnbOptions;
  window.initPnb = initPnb;
})(window, window.jQuery);
