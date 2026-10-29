"use strict";

// 윈도우 사이즈 체크
const windowSize = {
  winSize: null,
  breakPoint: 1024,

  setWinSize() {
    this.winSize = window.innerWidth >= this.breakPoint ? "pc" : "mob";
  },

  getWinSize() {
    return this.winSize;
  },
};

// 스크롤 방향 체크
const scrollManager = {
  _scrollY: 0,
  _scrollH: 0,
  _lastScrollY: 0,

  updateScrollValues() {
    this._scrollY = window.scrollY;
    this._scrollH = document.body.scrollHeight;
  },

  handleScrollDirection() {
    const $wrap = document.querySelector("#wrap");
    if ($wrap) {
      const _conOffsetTop = document.querySelector("#container").offsetTop;
      const _scrollY = window.scrollY;
      const _scrollDown = _scrollY > this._lastScrollY;
      const _scrollUp = _scrollY < this._lastScrollY;

      if (_scrollY > _conOffsetTop + 50 && _scrollDown) {
        $wrap.classList.add("scroll-down");
        $wrap.classList.remove("scroll-up");
      } else if (_scrollY > _conOffsetTop + 50 && _scrollUp) {
        $wrap.classList.add("scroll-up");
        $wrap.classList.remove("scroll-down");
      } else {
        $wrap.classList.remove("scroll-down", "scroll-up");
      }

      this._lastScrollY = _scrollY;
    }
  },

  getscrollY() {
    return this._scrollY;
  },

  getScrollH() {
    return this._scrollH;
  },
};

// common
const common = {
  isFocusableVisible(el, root) {
    if (!el || el.disabled || el.getAttribute("aria-hidden") === "true") return false;
    if (el.closest("[inert]")) return false;
    let node = el;
    while (node && node !== root && node !== document.documentElement) {
      const style = window.getComputedStyle(node);
      if (style.display === "none" || style.visibility === "hidden") return false;
      node = node.parentElement;
    }
    return true;
  },
  getFocusableElements(root) {
    const selector = `a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])`;
    return [...root.querySelectorAll(selector)].filter((el) => this.isFocusableVisible(el, root));
  },
  focusTrap(trap) {
    const focusableElements = this.getFocusableElements(trap);

    if (!focusableElements.length) return;

    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    trap.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") return;
      const list = this.getFocusableElements(trap);
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === trap) {
        event.preventDefault();
        last.focus();
      }
    });
  },
};

/** PC/모바일에서 display:none·닫힌 패널로 Tab 포커스가 가지 않도록 inert 동기화 */
const headerFocusScope = {
  setInert(el, on) {
    if (!el) return;
    if (on) {
      el.setAttribute("inert", "");
      el.setAttribute("aria-hidden", "true");
    } else {
      el.removeAttribute("inert");
      el.removeAttribute("aria-hidden");
    }
  },
  sync() {
    windowSize.setWinSize();
    const isMobile = windowSize.getWinSize() === "mob";
    const pcMenu = document.querySelector(".header_news .news_main_menu:not(.sample)");
    const mobileMenu = document.querySelector(".header_news .news_main_menu_mobile:not(.sample)");
    const topSearch = document.querySelector(".header_news .news_top_search");
    const headerUtility = document.querySelector(".header_news .header_utility");
    const mobileOpen = !!mobileMenu?.classList.contains("is-open");

    if (isMobile) {
      // PC GNB·상단검색 등 숨김 영역은 탭 순서에서 제외 (로고 다음 = btn_navi)
      this.setInert(pcMenu, true);
      this.setInert(topSearch, true);
      this.setInert(headerUtility, true);
      this.setInert(mobileMenu, !mobileOpen);
      if (mobileMenu && !mobileOpen) {
        mobileMenu.style.display = "none";
      }
    } else {
      // PC 복귀 시 jQuery hide 등으로 남은 인라인 display 제거 → CSS MQ가 표시
      if (pcMenu) pcMenu.style.display = "";
      this.setInert(pcMenu, false);
      this.setInert(topSearch, false);
      this.setInert(headerUtility, false);
      this.setInert(mobileMenu, true);
      if (mobileMenu && !mobileOpen) {
        mobileMenu.style.display = "none";
      }
      if (!mobileOpen) {
        document.querySelector(".header_news .header_in")?.removeAttribute("inert");
        document.getElementById("container")?.removeAttribute("inert");
        document.getElementById("footer")?.removeAttribute("inert");
      }
    }

    const active = document.activeElement;
    if (active && typeof active.closest === "function" && active.closest("[inert]")) {
      active.blur();
    }
  },
};

window.syncHeaderFocusScope = function syncHeaderFocusScope() {
  try {
    headerFocusScope.sync();
  } catch (e) {
    console.error("[header_news] syncHeaderFocusScope", e);
  }
};

/*** * news_mainMenuPC * ***/
const news_mainMenuPC = {
  init() {
    const gnbMenu = document.querySelector(".news_main_menu:not(.sample) .gnb_menu");

    if (!gnbMenu) return;

    // gnb 속성설정
    gnbMenu.setAttribute("aria-label", "메인 메뉴");

    // dimed 요소를 설정, 기존 dimed가 없을 경우 생성
    this.backdrop = document.querySelector(".gnb-backdrop") || this.createBackdrop();

    // 주 메뉴 트리거를 설정하고 이벤트를 연결 (부메뉴는 1뎁스 열림 시 바로 노출)
    const mainTriggers = gnbMenu.querySelectorAll(".gnb_main_trigger");
    mainTriggers.forEach((mainTrigger) => this.setupMainTrigger(mainTrigger));
    this.attachEvents(mainTriggers);
    this.setupKeyboardNavigation(mainTriggers);
  },
  setupMainTrigger(mainTrigger) {
    const toggleWrap = mainTrigger.nextElementSibling;
    if (toggleWrap) {
      const uniqueIdx = `gnb-main-menu-${Math.random().toString(36).substring(2, 9)}`;
      mainTrigger.setAttribute("aria-controls", uniqueIdx);
      mainTrigger.setAttribute("aria-expanded", "false");
      mainTrigger.setAttribute("aria-haspopup", "true");
      toggleWrap.setAttribute("id", uniqueIdx);
    }
  },
  openMainMenu(mainTrigger) {
    if (!mainTrigger?.nextElementSibling) return;
    if (mainTrigger.classList.contains("active")) return;

    const isDropDown = mainTrigger.classList.contains("is-dropdown");
    this.resetMainMenu();
    mainTrigger.setAttribute("aria-expanded", "true");
    mainTrigger.classList.add("active");
    mainTrigger.nextElementSibling.classList.add("is-open");
    mainTrigger.nextElementSibling.querySelector(".gnb_sub_list")?.classList.add("active");
    if (!isDropDown) {
      this.toggleBackdrop(true);
      this.toggleScrollbar(true);
      const mainList = mainTrigger.nextElementSibling.querySelector(".gnb_main_list");
      this.adjustSubMenuHeight(mainList);
      requestAnimationFrame(() => this.adjustSubMenuHeight(mainList));
    }
  },
  toggleMainMenu(mainTrigger) {
    if (mainTrigger.classList.contains("active")) {
      this.closeMainMenu();
    } else {
      this.openMainMenu(mainTrigger);
    }
  },
  createBackdrop() {
    const backdrop = document.createElement("div");
    backdrop.classList.add("gnb-backdrop");
    document.body.appendChild(backdrop);
    return backdrop;
  },
  toggleBackdrop(isOpen) {
    this.backdrop?.classList.toggle("active", isOpen);
    document.documentElement.classList.toggle("is-gnb-web", isOpen);
    document.body.classList.toggle("is-gnb-web", isOpen);
  },
  adjustSubMenuHeight(target) {
    if (!target) return;
    const wrap = target.closest(".gnb_toggle_wrap");
    const sub = target.querySelector(".gnb_sub_list.active") || target.querySelector(".gnb_sub_list");
    const minFloor = 180;

    target.style.height = "auto";
    target.style.minHeight = "0px";
    if (wrap) {
      wrap.style.height = "auto";
      wrap.style.minHeight = "0px";
    }
    void target.offsetHeight;

    const contentHeight = Math.max(Math.ceil(sub?.scrollHeight || 0), minFloor);
    target.style.minHeight = `${contentHeight}px`;
    target.style.height = `${contentHeight}px`;
    target.style.setProperty("--gnb-list-bg-height", `${contentHeight}px`);
    if (wrap) {
      wrap.style.minHeight = `${contentHeight}px`;
      wrap.style.height = "auto";
    }
  },
  toggleScrollbar(isEnabled) {
    const isScrollNeeded = document.body.scrollHeight > window.innerHeight;
    document.body.classList.toggle("hasScrollY", isEnabled && isScrollNeeded);

    if (isEnabled) {
      if (this._bodyScrollLocked) return;
      this._lockedScrollY = window.scrollY || window.pageYOffset || 0;
      this._bodyScrollLocked = true;
      document.body.style.position = "fixed";
      document.body.style.top = `-${this._lockedScrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      this._onWheelLock = (event) => {
        if (!event.target.closest(".news_main_menu .gnb_toggle_wrap.is-open")) {
          event.preventDefault();
        }
      };
      window.addEventListener("wheel", this._onWheelLock, { passive: false });
      window.addEventListener("touchmove", this._onWheelLock, { passive: false });
    } else if (this._bodyScrollLocked) {
      this._bodyScrollLocked = false;
      if (this._onWheelLock) {
        window.removeEventListener("wheel", this._onWheelLock);
        window.removeEventListener("touchmove", this._onWheelLock);
        this._onWheelLock = null;
      }
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      window.scrollTo(0, this._lockedScrollY || 0);
    }
  },
  resetMainMenu() {
    document.querySelectorAll(".news_main_menu:not(.sample) .gnb_main_trigger:not(.is_link)").forEach((mainTrigger) => {
      mainTrigger.classList.remove("active");
      mainTrigger.setAttribute("aria-expanded", "false");
    });
    document.querySelectorAll(".news_main_menu:not(.sample) .gnb_toggle_wrap").forEach((toggleWrap) => {
      toggleWrap.classList.remove("is-open");
      toggleWrap.style.minHeight = "";
      toggleWrap.style.height = "";
      const mainList = toggleWrap.querySelector(".gnb_main_list");
      if (mainList) {
        mainList.style.minHeight = "";
        mainList.style.height = "";
        mainList.style.removeProperty("--gnb-list-bg-height");
      }
      toggleWrap.querySelectorAll(".gnb_sub_list").forEach((sub) => sub.classList.remove("active"));
    });
  },
  closeMainMenu() {
    this.resetMainMenu();
    this.toggleBackdrop(false);
    this.toggleScrollbar(false);
  },
  attachEvents(mainTriggers) {
    const gnbRoot = document.querySelector(".news_main_menu:not(.sample)");

    document.addEventListener("click", ({ target }) => {
      if (!target.closest(".news_main_menu")) this.closeMainMenu();
    });

    document.addEventListener("keyup", (event) => {
      if (event.code === "Escape") {
        this.closeMainMenu();
      }
    });

    // 마지막 하위 링크 등에서 헤더(GNB) 밖으로 탭 이동 시 메뉴 닫기
    gnbRoot?.addEventListener("focusout", () => {
      requestAnimationFrame(() => {
        if (!gnbRoot.contains(document.activeElement)) {
          this.closeMainMenu();
        }
      });
    });

    mainTriggers.forEach((mainTrigger) => {
      mainTrigger.addEventListener("click", () => this.toggleMainMenu(mainTrigger));
      // 키보드 탭으로 트리거에 진입하면 해당 하위 메뉴를 연다 (이전 메뉴는 닫힘)
      mainTrigger.addEventListener("focus", () => {
        requestAnimationFrame(() => {
          if (mainTrigger.matches(":focus-visible")) {
            this.openMainMenu(mainTrigger);
          }
        });
      });
    });
  },
  setupKeyboardNavigation(mainTriggers) {
    const focusMenuItem = (element) => {
      if (element) {
        element.focus();
      }
    };
    const findFocusableElement = (element, direction) => {
      const sibling = direction === "next" ? "nextElementSibling" : "previousElementSibling";
      const parent = element.closest("li")?.[sibling];
      return parent ? parent.querySelector("[data-trigger]") : null;
    };
    // Home, End, 방향키를 통해 메뉴 항목 간의 이동을 처리
    document.addEventListener("keydown", (event) => {
      const target = event.target;
      if (target.getAttribute("data-trigger")) {
        switch (event.key) {
          case "Home":
            event.preventDefault();
            focusMenuItem(mainTriggers[0]);
            break;
          case "End":
            event.preventDefault();
            focusMenuItem(mainTriggers[mainTriggers.length - 1]);
            break;
          case "ArrowRight":
          case "ArrowDown":
            event.preventDefault();
            const nextElement = findFocusableElement(target, "next");
            focusMenuItem(nextElement);
            break;
          case "ArrowLeft":
          case "ArrowUp":
            event.preventDefault();
            const previousElement = findFocusableElement(target, "prev");
            focusMenuItem(previousElement);
            break;
          default:
            break;
        }
      }
    });
  },
};

/*** * news_mainMenuMobile * ***/
const news_mainMenuMobile = {
  init() {
    const mobileGnb = document.querySelector(".news_main_menu_mobile:not(.sample)");

    if (!mobileGnb) return;

    if (mobileGnb.classList.contains("is-open")) {
      this.openMainMenu(mobileGnb);
    } else {
      mobileGnb.style.display = "none";
    }

    // gnb 외부 클릭 처리
    mobileGnb.addEventListener("click", (event) => {
      if (!event.target.closest(".gnb_wrap")) {
        mobileGnb.querySelector(".gnb_wrap").focus();
      }
    });

    // 접근성 설정(tab)
    this.setupAriaAttributes(mobileGnb);

    this.attachEvents(mobileGnb);
    headerFocusScope.sync();
  },
  setupAriaAttributes(mobileGnb) {
    const tabList = mobileGnb.querySelector(".menu_wrap");
    if (tabList) {
      const tabListUl = tabList.querySelector(":scope > ul") || tabList.querySelector("ul");
      if (tabListUl) {
        tabListUl.setAttribute("role", "tablist");
      }
      tabList.querySelectorAll(":scope > ul > li, ul > li").forEach((li) => li.setAttribute("role", "none"));

      const tabs = tabList.querySelectorAll(".gnb_main_trigger");
      tabs.forEach((item, idx) => {
        const href = item.getAttribute("href") || "";
        const panelId = href.startsWith("#") ? href.substring(1) : href;
        item.setAttribute("role", "tab");
        item.setAttribute("aria-selected", "false");
        if (panelId) {
          item.setAttribute("aria-controls", panelId);
        }
        item.setAttribute("id", `tab-${idx}`);

        // gnb-main-trigger 클릭시 해당 위치로 스크롤
        item.addEventListener("click", (event) => {
          event.preventDefault();
          const id = item.getAttribute("aria-controls");
          const panel = id ? document.getElementById(id) : null;
          const gnbBody = document.querySelector(".gnb_body");
          if (!panel || !gnbBody) return;
          gnbBody.scrollTo({
            left: 0,
            top: panel.offsetTop,
            behavior: "smooth",
          });
        })
      });

      const tabPanels = document.querySelectorAll(".submenu_wrap .gnb_sub_list");
      tabPanels.forEach((item, idx) => {
        item.setAttribute("role", "tabpanel");
        item.setAttribute("aria-labelledby", `tab-${idx}`);
      });
    }
  },
  attachEvents(mobileGnb) {
    const id = mobileGnb.getAttribute("id");
    const openGnb = id ? document.querySelector(`[aria-controls="${id}"]`) : null;
    const closeGnb = mobileGnb.querySelector("#close_nav");

    if (openGnb) {
      openGnb.addEventListener("click", () => this.openMainMenu(mobileGnb));
    }
    if (closeGnb) {
      closeGnb.addEventListener("click", () => this.closeMainMenu(mobileGnb));
    }
    this.setupAnchorScroll(mobileGnb);
    this.setupAnchorLinks(mobileGnb);

    // 반응형 처리
    window.addEventListener("resize", () => {
      windowSize.setWinSize();
      const isPC = windowSize.getWinSize() === "pc";
      if (isPC && mobileGnb.classList.contains("is-open")) {
        this.closeMainMenu(mobileGnb);
      } else {
        headerFocusScope.sync();
      }
    });
  },
  openMainMenu(mobileGnb) {
    const navContainer = mobileGnb.querySelector(".gnb_wrap");
    const id = mobileGnb.getAttribute("id");
    const openGnb = id ? document.querySelector(`[aria-controls="${id}"]`) : null;

    mobileGnb.style.display = "block";
    mobileGnb.removeAttribute("inert");
    navContainer?.setAttribute("tabindex", 0);
    openGnb?.setAttribute("aria-expanded", "true");

    // active 메뉴로 스크롤 이동
    const activeTrigger = document.querySelector(".gnb_main_trigger.active");
    if (activeTrigger) {
      const id = activeTrigger.getAttribute("aria-controls");
      const panel = id ? document.getElementById(id) : null;
      const gnbBody = document.querySelector(".gnb_body");
      if (panel && gnbBody) {
        gnbBody.style.scrollBehavior = "auto";
        gnbBody.scrollTop = panel.offsetTop;
      }
    } 
    
    setTimeout(() => {
      mobileGnb.classList.add("is-backdrop");
      mobileGnb.classList.add("is-open");
      document.body.classList.add("is-gnb-mobile");
    }, 100);

    // transition 종료후 실행
    mobileGnb.addEventListener("transitionend", function onTransitionEnd() {
      navContainer.focus();
      mobileGnb.removeEventListener("transitionend", onTransitionEnd);

      // inert 설정 — 배경(헤더/본문)만 막고, 모바일 메뉴는 포커스 허용
      document.querySelector(".header_news .header_in")?.setAttribute("inert", "");
      document.getElementById("container")?.setAttribute("inert", "");
      document.getElementById("footer")?.setAttribute("inert", "");
      headerFocusScope.sync();
      
      // 포커스 트랩 설정
      common.focusTrap(mobileGnb);
    });

  },
  closeMainMenu(mobileGnb) {
    const id = mobileGnb.getAttribute("id");
    const openGnb = id ? document.querySelector(`[aria-controls="${id}"]`) : null;

    mobileGnb.classList.remove("is-backdrop");
    mobileGnb.classList.remove("is-open");
    openGnb?.setAttribute("aria-expanded", "false");

    // inert 설정
    document.querySelector(".header_news .header_in")?.removeAttribute("inert");
    document.getElementById("container")?.removeAttribute("inert");
    document.getElementById("footer")?.removeAttribute("inert");
    
    // transition 종료후 실행
    mobileGnb.addEventListener("transitionend", function onTransitionEnd() {
      openGnb?.focus();
      mobileGnb.removeEventListener("transitionend", onTransitionEnd);
    });
    
    setTimeout(() => {
      mobileGnb.style.display = "none";
      document.body.classList.remove("is-gnb-mobile");
      headerFocusScope.sync();
    }, 400);
  },
  setupAnchorScroll(mobileGnb) {
    const gnbBody = mobileGnb.querySelector(".gnb_body");
    const navContainer = mobileGnb.querySelector(".gnb_wrap");
    const navItems = mobileGnb.querySelectorAll(".submenu_wrap .gnb_sub_list");
    const headerTabArea = mobileGnb.querySelector(".gnb-tab-nav");
    const headerTabMenu = headerTabArea?.querySelector(".menu_wrap");

    if (!gnbBody) return;

    gnbBody.addEventListener("scroll", () => {
      const scrollTop = gnbBody.scrollTop;
      const scrollHeight = gnbBody.scrollHeight;
      const bodyHeight = gnbBody.clientHeight;

      navItems.forEach((item) => {
        const id = item.getAttribute("id");
        const menuLink = id ? mobileGnb.querySelector(`[href="#${id}"]`) : null;
        if (!menuLink) return;
        const offset = item.offsetTop;
        if (scrollTop >= offset || bodyHeight + scrollTop >= scrollHeight) {
          this.resetAnchorMenu();
          menuLink.classList.add("active");
          menuLink.setAttribute("aria-selected", "true");
          if (headerTabArea && headerTabMenu) {
            const headerTabMenuUl = headerTabMenu.querySelector("ul");
            if (!headerTabMenuUl) return;
            gnbBody.addEventListener("scrollend", () => {
              headerTabMenuUl.scrollLeft = menuLink.offsetLeft;
            });
          }
        }
      });

      this.handleTopScroll(headerTabArea, navContainer, gnbBody);
    });
  },
  handleTopScroll(headerTabArea, navContainer, gnbBody) {
    // gnb-mobile-type1(headerTabArea: gnb-tab-nav)
    let lastBodyScrollY = 0;

    if (!headerTabArea) return; // 요소가 없을 경우 함수 종료

    gnbBody.addEventListener("scroll", (event) => {
      const bodyScrollY = event.target.scrollTop;

      if (bodyScrollY > 0) {
        headerTabArea.style.height = `${headerTabArea.scrollHeight}px`;
        headerTabArea.style.transition = "ease-out .4s";
        navContainer.classList.add("is-active");
      } else if (bodyScrollY < 50 && bodyScrollY < lastBodyScrollY) {
        headerTabArea.style.height = "";
        headerTabArea.style.transition = "ease-out .4s .2s";
        setTimeout(() => {
          navContainer.classList.remove("is-active");
        }, 600);
      }

      lastBodyScrollY = bodyScrollY;
    });
  },
  setupAnchorLinks(mobileGnb) {
    const menuItems = mobileGnb.querySelectorAll(".menu_wrap .gnb_main_trigger");
    const navItems = mobileGnb.querySelectorAll(".submenu_wrap .gnb_sub_list");

    if (menuItems.length && !document.querySelector(".menu_wrap .gnb_main_trigger.active")) {
      menuItems[0].classList.add("active");
      menuItems[0].setAttribute("aria-selected", "true");
    }

    // 2depth
    navItems.forEach((item) => {
      const depth2Items = item.querySelectorAll(".has-depth2");
      if (depth2Items.length > 0) {
        depth2Items.forEach((item) => {
          if (item.classList.contains("active")) {
            item.classList.add("active");
            item.setAttribute("aria-expanded", "true");
            item.nextElementSibling.classList.add("is-open");
          } else {
            item.setAttribute("aria-expanded", "false");
          }
          item.addEventListener("click", (event) => this.handleDepth2Click(event, item));
        });
      }
    });

    // 3depth
    navItems.forEach((item) => {
      const depth3Items = item.querySelectorAll(".has-depth3");
      if (depth3Items.length > 0) {
        depth3Items.forEach((item) => {
          item.addEventListener("click", (event) => this.handleDepth3Click(event, item));
        });
      }
    });
  },
  handleDepth2Click(event) {
    event.preventDefault();
    const trigger = event.currentTarget;
    const isActive = trigger.classList.contains("active");

    if (!isActive) {
      trigger.classList.add("active");
      trigger.setAttribute("aria-expanded", "true");
      trigger.nextElementSibling.classList.add("is-open");
    } else {
      trigger.classList.remove("active");
      trigger.setAttribute("aria-expanded", "false");
      trigger.nextElementSibling.classList.remove("is-open");
    }
  },
  handleDepth3Click(event) {
    const target = event.target.nextElementSibling;
    const prevButton = target.querySelector(".trigger-prev");
    const closeButton = target.querySelector(".trigger-close");

    target.style.display = "block";
    setTimeout(() => {
      target.classList.add("is-open");
    }, 0);
    prevButton.focus();

    const depth3Close = () => {
      target.classList.remove("is-open");
      event.target.focus();
      setTimeout(() => {
        target.style.display = "";
      }, 400);
    };

    prevButton.addEventListener("click", depth3Close);
    closeButton.addEventListener("click", depth3Close);

    // 포커스 트랩 설정
    common.focusTrap(target);
  },
  resetAnchorMenu() {
    document.querySelectorAll(".news_main_menu_mobile .menu_wrap .gnb_main_trigger").forEach((menu) => {
      menu.classList.remove("active");
      menu.setAttribute("aria-selected", "false");
    });
  },
};

/*** * news_dropEvent(gnb utils / page-title-wrap) * ***/
const news_dropEvent = {
  dropButtons: null,
  init() {
    this.dropButtons = document.querySelectorAll(".news_drop_wrap:not(.sample) .drop_btn");

    if (!this.dropButtons.length) return;

    this.setupEventListeners();
    this.setupFocusOutEvent();
  },
  setupEventListeners() {
    this.dropButtons.forEach((button) => {
      const menu = button.nextElementSibling;
      button.setAttribute("aria-expanded", "false");

      button.addEventListener("click", () => {
        const isOpen = menu.style.display === "block";
        this.closeAllDropdowns();
        if (!isOpen) {
          this.openDropdown(button, menu);
        }
      });

      this.setupMenuItems(menu);
    });
  },
  setupMenuItems(menu) {
	if (!menu) return; // ← null 체크 추가
    const items = menu.querySelectorAll(".item_link");

    items.forEach((item) => {
      item.innerHTML += `<span class="sr_only"></span>`;
      if (item.classList.contains("active")) {
        item.querySelector(".sr_only").innerHTML = "선택됨";
      }

      item.addEventListener("click", () => {
        this.activateMenuItem(item);
        this.closeAllDropdowns();
        const button = item.closest(".news_drop_wrap").querySelector(".drop_btn");
        button?.focus();
      });

      item.addEventListener("focus", () => {
        document.querySelectorAll(".news_drop_wrap .drop_list .item_link").forEach((item) => {
          item.style.position = "relative";
          item.style.zIndex = "0";
        });
        item.style.zIndex = "1";
      });
    });
  },
  activateMenuItem(selectedItem) {
    const menu = selectedItem.closest(".drop_menu");
    const items = menu.querySelectorAll(".item_link");

    items.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
      item.querySelector(".sr_only").innerText = "";
    });

    selectedItem.classList.add("active");
    selectedItem.setAttribute("aria-selected", "true");
    selectedItem.querySelector(".sr_only").innerText = "선택됨";
  },
  openDropdown(button, menu) {
    menu.style.display = "block";
    button.classList.add("active");
    button.setAttribute("aria-expanded", "true");

    // 여백에 따라 위치 조정
    const menuRect = menu.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    if (menuRect.left < 0) {
      menu.closest(".news_drop_wrap").classList.add("drop-left");
    } else if (windowWidth < menuRect.left + menuRect.width) {
      menu.closest(".news_drop_wrap").classList.add("drop-right");
    }

  },
  closeAllDropdowns() {
    document.querySelectorAll(".news_drop_wrap .drop_menu").forEach((menu) => {
      menu.style.display = "none";
    });
    this.dropButtons.forEach((button) => {
      button.classList.remove("active");
      button.setAttribute("aria-expanded", "false");
    });
  },
  setupFocusOutEvent() {
    // ESC 닫기
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" || event.key === "Esc") {
        this.closeAllDropdowns();
        event.target.closest(".news_drop_wrap")?.querySelector(".drop_btn")?.focus();
      }
    });

    // 드롭다운 외부 클릭 시 닫기
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".news_drop_wrap")) {
        this.closeAllDropdowns();
      }
    });

    // 드롭다운 포커스 아웃 처리
    this.dropButtons.forEach((button) => {
      const menu = button.nextElementSibling;

      if (!menu) return;

      // 드롭다운 메뉴의 포커스 아웃 처리
      menu.addEventListener("focusout", (event) => {
        const isFocusInside = menu.contains(event.relatedTarget) || button.contains(event.relatedTarget);
        if (!isFocusInside) {
          this.closeAllDropdowns();
        }
      });

      // 버튼의 포커스 아웃 처리
      button.addEventListener("focusout", (event) => {
        const isFocusInside = menu.contains(event.relatedTarget) || button.contains(event.relatedTarget);
        if (!isFocusInside) {
          this.closeAllDropdowns();
        }
      });
    });
  },
};

const newsHotRoll = {
  timer: null,
  paused: false,
  reduceMotion: false,
  control: null,
  init() {
    const root = document.querySelector(".news_hot");
    const viewport = document.querySelector(".news_hot_viewport");
    const list = viewport?.querySelector(".news_hot_list");
    const control =
      root?.querySelector(".news_hot_control") ||
      document.querySelector(".news_hot_control");
    if (!viewport || !list) return;

    this.control = control;
    const originalItems = [...list.children];
    if (originalItems.length < 2) return;

    this.reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!this.reduceMotion) {
      const clone = originalItems[0].cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.querySelector("a")?.setAttribute("tabindex", "-1");
      list.appendChild(clone);
    }

    let index = 0;
    let looping = false;
    const itemHeight = () => originalItems[0].offsetHeight || 23;

    const goTo = (i, { animate = true } = {}) => {
      index = i;
      list.style.transition = animate && !this.reduceMotion ? "transform 0.45s ease" : "none";
      list.style.transform = `translateY(-${index * itemHeight()}px)`;
    };

    const step = () => {
      if (this.paused || looping || viewport.contains(document.activeElement)) return;
      index += 1;
      goTo(index, { animate: true });
      if (index >= originalItems.length) {
        looping = true;
        window.setTimeout(() => {
          goTo(0, { animate: false });
          looping = false;
        }, 450);
      }
    };

    const start = () => {
      if (this.reduceMotion || this.paused) return;
      if (viewport.contains(document.activeElement)) return;
      this.stopTimer();
      this.timer = window.setInterval(step, 2500);
    };

    const syncControl = () => {
      if (!control) return;
      const isPaused = this.paused || this.reduceMotion;
      /* 메인과 동일: .btn_play = 재생 아이콘, .btn_play.stop = 일시정지 아이콘 */
      control.classList.add("btn_play");
      control.classList.toggle("stop", !isPaused);
      control.setAttribute("aria-pressed", isPaused ? "true" : "false");
      control.setAttribute(
        "aria-label",
        isPaused ? "인기 검색어 롤링 재생" : "인기 검색어 롤링 일시정지"
      );
      const sr = control.querySelector(".sr_only");
      if (sr) sr.textContent = isPaused ? "재생" : "일시정지";
      if (this.reduceMotion) {
        control.disabled = true;
        control.setAttribute("aria-disabled", "true");
      }
    };

    const showFocused = (link) => {
      const li = link.closest("li");
      if (!li || !list.contains(li)) return;
      const i = [...list.children].indexOf(li);
      if (i < 0) return;
      this.stopTimer();
      goTo(i >= originalItems.length ? 0 : i, { animate: false });
    };

    list.querySelectorAll("a").forEach((link) => {
      link.addEventListener("focus", () => showFocused(link));
    });

    viewport.addEventListener("mouseenter", () => this.stopTimer());
    viewport.addEventListener("mouseleave", () => start());
    viewport.addEventListener("focusin", () => this.stopTimer());
    viewport.addEventListener("focusout", (event) => {
      if (!viewport.contains(event.relatedTarget)) start();
    });

    if (control) {
      control.addEventListener("click", () => {
        if (this.reduceMotion) return;
        this.paused = !this.paused;
        if (this.paused) this.stopTimer();
        else start();
        syncControl();
      });
    }

    this.paused = !!this.reduceMotion;
    syncControl();
    if (!this.reduceMotion) start();
  },
  stopTimer() {
    window.clearInterval(this.timer);
    this.timer = null;
  },
  /** @deprecated use stopTimer — 외부 호환 */
  stop() {
    this.stopTimer();
  },
};

/**
 * 헤더 인터랙션 초기화.
 * - 정적 HTML(#header 안에 마크업) 페이지: DOMContentLoaded 에서 실행
 * - layout_common 주입 페이지: jQuery ready 가 DOMContentLoaded 보다 늦을 수 있어
 *   주입 직후 layout_common 에서 다시 호출해야 함
 */
window.initHeaderNews = function initHeaderNews() {
  if (window.initHeaderNews._bound) return true;
  // 헤더 DOM이 아직 없으면(주입 전) 실패 — 나중에 재호출
  if (!document.querySelector(".news_main_menu:not(.sample) .gnb_menu")) return false;

  windowSize.setWinSize();
  try { newsHotRoll.init(); } catch (e) { console.error("[header_news] newsHotRoll", e); }
  try { news_mainMenuPC.init(); } catch (e) { console.error("[header_news] news_mainMenuPC", e); }
  try { news_mainMenuMobile.init(); } catch (e) { console.error("[header_news] news_mainMenuMobile", e); }
  try { news_dropEvent.init(); } catch (e) { console.error("[header_news] news_dropEvent", e); }
  try { headerFocusScope.sync(); } catch (e) { console.error("[header_news] headerFocusScope", e); }
  window.initHeaderNews._bound = true;
  return true;
};

window.addEventListener("DOMContentLoaded", () => {
  window.initHeaderNews();
});

window.addEventListener("resize", () => {
  windowSize.setWinSize();
  try { headerFocusScope.sync(); } catch (e) { console.error("[header_news] headerFocusScope", e); }
  document.querySelectorAll(".news_main_menu .gnb_toggle_wrap.is-open .gnb_main_list").forEach((list) => {
    news_mainMenuPC.adjustSubMenuHeight(list);
  });
});
