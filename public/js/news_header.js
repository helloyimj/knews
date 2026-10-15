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
  focusTrap(trap) {
    const focusableElements = trap.querySelectorAll(`a, button, [tabindex="0"], input, textarea, select`);

    if (!focusableElements.length) return;

    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    trap.addEventListener("keydown", (event) => {
      if (event.key === "Tab") {
        if (event.shiftKey && document.activeElement === firstFocusableElement) {
          event.preventDefault();
          lastFocusableElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastFocusableElement) {
          event.preventDefault();
          firstFocusableElement.focus();
          // 모달 오픈 후 첫 초점 역방향 제어(modal-content가 첫초점이 아니면 사용 안해도 됨)
        } else if (event.key === "Tab" && event.shiftKey && document.activeElement === trap) {
          event.preventDefault();
          lastFocusableElement.focus();
        }
      }
    });
  },
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
  toggleMainMenu(mainTrigger) {
    const isActive = mainTrigger.classList.contains("active");
    const isDropDown = mainTrigger.classList.contains("is-dropdown");
    if (!isActive && mainTrigger.nextElementSibling) {
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
    } else {
      this.closeMainMenu();
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
    document.body.classList.toggle("is-gnb-web", isOpen);
  },
  adjustSubMenuHeight(target) {
    if (!target) return;
    const wrap = target.closest(".gnb_toggle_wrap");
    const sub = target.querySelector(".gnb_sub_list.active") || target.querySelector(".gnb_sub_list");
    const minFloor = 252;

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
    document.addEventListener("click", ({ target }) => {
      if (!target.closest(".news_main_menu")) this.closeMainMenu();
    });

    document.addEventListener("keyup", (event) => {
      if (event.code === "Escape" || !event.target.closest(".news_main_menu")) {
        this.closeMainMenu();
      }
    });

    mainTriggers.forEach((mainTrigger) => {
      mainTrigger.addEventListener("click", () => this.toggleMainMenu(mainTrigger));
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
  },
  setupAriaAttributes(mobileGnb) {
    const tabList = mobileGnb.querySelector(".menu_wrap");
    if (tabList) {
      tabList.querySelector(".menu_wrap ul").setAttribute("role", "tablist");
      tabList.querySelectorAll(".menu_wrap li").forEach((li) => li.setAttribute("role", "none"));

      const tabs = document.querySelectorAll(".menu_wrap .gnb_main_trigger");
      tabs.forEach((item, idx) => {
        item.setAttribute("role", "tab");
        item.setAttribute("aria-selected", "false");
        item.setAttribute("aria-controls", item.getAttribute("href").substring(1));
        item.setAttribute("id", `tab-${idx}`);

        // gnb-main-trigger 클릭시 해당 위치로 스크롤
        item.addEventListener("click", (event) => {
          event.preventDefault();
          const id = item.getAttribute("aria-controls");
          const top = document.getElementById(id).offsetTop
          const gnbBody = document.querySelector(".gnb_body");
          gnbBody.scrollTo({
            left: 0,
            top: top,
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
    const openGnb = document.querySelector(`[aria-controls=${id}]`);
    const closeGnb = mobileGnb.querySelector("#close_nav");

    openGnb.addEventListener("click", () => this.openMainMenu(mobileGnb));
    closeGnb.addEventListener("click", () => this.closeMainMenu(mobileGnb));
    this.setupAnchorScroll(mobileGnb);
    this.setupAnchorLinks(mobileGnb);

    // 반응형 처리
    window.addEventListener("resize", () => {
      const isPC = windowSize.getWinSize() === "pc";
      if (isPC) this.closeMainMenu(mobileGnb);
    });
  },
  openMainMenu(mobileGnb) {
    const navContainer = mobileGnb.querySelector(".gnb_wrap");
    // const id = mobileGnb.getAttribute("id");
    // const openGnb = document.querySelector(`[aria-controls=${id}]`);
    // const header = document.querySelector(".header_news");

    mobileGnb.style.display = "block";
    navContainer.setAttribute("tabindex", 0);
    // openGnb.setAttribute("aria-expanded", "true");
    // header.style.zIndex = "1000";

    // active 메뉴로 스크롤 이동
    const activeTrigger = document.querySelector(".gnb_main_trigger.active");
    if (activeTrigger) {
      const id = activeTrigger.getAttribute("aria-controls");
      const top = document.getElementById(id).offsetTop;
      const gnbBody = document.querySelector(".gnb_body");
      gnbBody.style.scrollBehavior = "auto";
      gnbBody.scrollTop = top
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

      // inert 설정
      document.querySelector(".header_news .header_in").setAttribute("inert", "");
      document.getElementById("container")?.setAttribute("inert", "");
      document.getElementById("footer")?.setAttribute("inert", "");
      
      // 포커스 트랩 설정
      common.focusTrap(mobileGnb);
    });

  },
  closeMainMenu(mobileGnb) {
    const id = mobileGnb.getAttribute("id");
    const openGnb = document.querySelector(`[aria-controls=${id}]`);
    // const header = document.querySelector(".header_news");

    mobileGnb.classList.remove("is-backdrop");
    mobileGnb.classList.remove("is-open");
    // openGnb.setAttribute("aria-expanded", "false");
    // header.style.zIndex = "";

    // inert 설정
    document.querySelector(".header_news .header_in").removeAttribute("inert");
    document.getElementById("container")?.removeAttribute("inert");
    document.getElementById("footer")?.removeAttribute("inert");
    
    // transition 종료후 실행
    mobileGnb.addEventListener("transitionend", function onTransitionEnd() {
      openGnb.focus();
      mobileGnb.removeEventListener("transitionend", onTransitionEnd);
    });
    
    setTimeout(() => {
      mobileGnb.style.display = "none";
      document.body.classList.remove("is-gnb-mobile");
    }, 400);
  },
  setupAnchorScroll(mobileGnb) {
    const gnbBody = mobileGnb.querySelector(".gnb_body");
    const navContainer = mobileGnb.querySelector(".gnb_wrap");
    const navItems = mobileGnb.querySelectorAll(".submenu_wrap .gnb_sub_list");
    const headerTabArea = mobileGnb.querySelector(".gnb-tab-nav");
    const headerTabMenu = headerTabArea?.querySelector(".menu_wrap");

    gnbBody.addEventListener("scroll", () => {
      const scrollTop = gnbBody.scrollTop;
      const scrollHeight = gnbBody.scrollHeight;
      const bodyHeight = gnbBody.clientHeight;

      navItems.forEach((item) => {
        const id = item.getAttribute("id");
        const menuLink = mobileGnb.querySelector(`[href="#${id}"]`);
        const offset = item.offsetTop;
        if (scrollTop >= offset || bodyHeight + scrollTop >= scrollHeight) {
          this.resetAnchorMenu();
          menuLink.classList.add("active");
          menuLink.setAttribute("aria-selected", "true");
          if (headerTabArea) {
            const headerTabMenuUl = headerTabMenu.querySelector("ul");
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

    if (!document.querySelector(".menu_wrap .gnb_main_trigger.active")) {
      menuItems[0].classList.add("active");
      menuItems[0].setAttribute("aria-selected", "true");
    }

    // 3depth
    navItems.forEach((item) => {
      const depth3Items = item.querySelectorAll(".has-depth3");
      if (depth3Items.length > 0) {
        depth3Items.forEach((item) => {
          if (item.classList.contains("active")) {
            item.classList.add("active");
            item.setAttribute("aria-expanded", "true");
            item.nextElementSibling.classList.add("is-open");
          } else {
            item.setAttribute("aria-expanded", "false");
          }
          item.addEventListener("click", (event) => this.handleDepth3Click(event, item));
        });
      }
    });

    // 4depth
    navItems.forEach((item) => {
      const depth4Items = item.querySelectorAll(".has-depth4");
      if (depth4Items.length > 0) {
        depth4Items.forEach((item) => {
          item.addEventListener("click", (event) => this.handleDepth4Click(event, item));
        });
      }
    });
  },
  handleDepth3Click(event) {
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
  handleDepth4Click(event) {
    const target = event.target.nextElementSibling;
    const prevButton = target.querySelector(".trigger-prev");
    const closeButton = target.querySelector(".trigger-close");

    target.style.display = "block";
    setTimeout(() => {
      target.classList.add("is-open");
    }, 0);
    prevButton.focus();

    const depth4Close = () => {
      target.classList.remove("is-open");
      event.target.focus();
      setTimeout(() => {
        target.style.display = "";
      }, 400);
    };

    prevButton.addEventListener("click", depth4Close);
    closeButton.addEventListener("click", depth4Close);

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
  init() {
    const viewport = document.querySelector(".news_hot_viewport");
    const list = viewport?.querySelector(".news_hot_list");
    if (!viewport || !list) return;
    const items = [...list.children];
    if (items.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    list.appendChild(items[0].cloneNode(true));
    let index = 0;
    const step = () => {
      index += 1;
      list.style.transition = "transform 0.45s ease";
      list.style.transform = `translateY(-${index * items[0].offsetHeight}px)`;
      if (index >= items.length) {
        window.setTimeout(() => {
          list.style.transition = "none";
          list.style.transform = "translateY(0)";
          index = 0;
        }, 450);
      }
    };
    const start = () => {
      this.stop();
      this.timer = window.setInterval(step, 2500);
    };
    viewport.addEventListener("mouseenter", () => this.stop());
    viewport.addEventListener("mouseleave", start);
    viewport.addEventListener("focusin", () => this.stop());
    viewport.addEventListener("focusout", start);
    start();
  },
  stop() {
    window.clearInterval(this.timer);
    this.timer = null;
  },
};

window.addEventListener('DOMContentLoaded', () => {
  windowSize.setWinSize();
  news_mainMenuPC.init();
  news_mainMenuMobile.init();
  news_dropEvent.init();
  newsHotRoll.init();
});

window.addEventListener('scroll', () => {
  news_mainMenuPC.closeMainMenu();
});

window.addEventListener('resize', () => {
  windowSize.setWinSize();
  document.querySelectorAll(".news_main_menu .gnb_toggle_wrap.is-open .gnb_main_list").forEach((list) => {
    news_mainMenuPC.adjustSubMenuHeight(list);
  });
});
