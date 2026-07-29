"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;

    /* ========================================
       Tablet / mobile menu
    ========================================= */

    const mobileMenuButton = document.getElementById("mobileMenuButton");
    const mobileMenu = document.getElementById("mobileMenu");
    const mobileMenuCloseButton = document.getElementById("mobileMenuCloseButton");
    const mobileMenuBackdrop = document.getElementById("mobileMenuBackdrop");

    function openMobileMenu() {
        if (!mobileMenu) {
            return;
        }

        mobileMenu.classList.add("is-open");
        mobileMenu.setAttribute("aria-hidden", "false");
        mobileMenuBackdrop?.classList.add("is-open");
        mobileMenuBackdrop?.setAttribute("aria-hidden", "false");
        mobileMenuButton?.setAttribute("aria-expanded", "true");
        mobileMenuButton?.setAttribute("aria-label", "전체 메뉴 닫기");
        body.classList.add("is-mobile-menu-open");
        mobileMenuCloseButton?.focus();
    }

    function closeMobileMenu({ restoreFocus = true } = {}) {
        mobileMenu?.classList.remove("is-open");
        mobileMenu?.setAttribute("aria-hidden", "true");
        mobileMenuBackdrop?.classList.remove("is-open");
        mobileMenuBackdrop?.setAttribute("aria-hidden", "true");
        mobileMenuButton?.setAttribute("aria-expanded", "false");
        mobileMenuButton?.setAttribute("aria-label", "전체 메뉴 열기");
        body.classList.remove("is-mobile-menu-open");

        if (restoreFocus) {
            mobileMenuButton?.focus();
        }
    }

    mobileMenuButton?.addEventListener("click", () => {
        const isOpen = mobileMenu?.classList.contains("is-open") ?? false;

        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    mobileMenuCloseButton?.addEventListener("click", () => closeMobileMenu());
    mobileMenuBackdrop?.addEventListener("click", () => closeMobileMenu());

    mobileMenu?.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => closeMobileMenu({ restoreFocus: false }));
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && mobileMenu?.classList.contains("is-open")) {
            closeMobileMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth >= 1200 && mobileMenu?.classList.contains("is-open")) {
            closeMobileMenu({ restoreFocus: false });
        }
    });

    /* ========================================
       Header submenu
    ========================================= */

    const submenuItems = document.querySelectorAll(
        ".navigation-item.has-submenu"
    );

    const submenuLinks = document.querySelectorAll(
        ".navigation-item.has-submenu > .navigation-link"
    );

    /**
     * 모든 내비게이션 서브메뉴 닫기
     */
    function closeAllSubmenus(exceptItem = null) {
        submenuItems.forEach((item) => {
            if (item === exceptItem) {
                return;
            }

            item.classList.remove("is-open");

            const link = item.querySelector(
                ":scope > .navigation-link"
            );

            link?.setAttribute("aria-expanded", "false");
        });
    }

    /**
     * 지정한 서브메뉴 열기
     */
    function openSubmenu(item) {
        if (!item) {
            return;
        }

        closeAllSubmenus(item);
        item.classList.add("is-open");

        const link = item.querySelector(
            ":scope > .navigation-link"
        );

        link?.setAttribute("aria-expanded", "true");
    }

    /**
     * 지정한 서브메뉴 닫기
     */
    function closeSubmenu(item) {
        if (!item) {
            return;
        }

        item.classList.remove("is-open");

        const link = item.querySelector(
            ":scope > .navigation-link"
        );

        link?.setAttribute("aria-expanded", "false");
    }

    /**
     * 상위 메뉴 클릭 및 키보드 조작
     */
    submenuLinks.forEach((link) => {
        const item = link.closest(".navigation-item");

        if (!item) {
            return;
        }

        link.addEventListener("click", (event) => {
            /*
             * 상위 메뉴 자체에 실제 페이지를 연결할 경우
             * 아래 preventDefault()를 삭제하면 됩니다.
             */
            event.preventDefault();

            const isOpen = item.classList.contains("is-open");

            if (isOpen) {
                closeSubmenu(item);
            } else {
                openSubmenu(item);
            }
        });

        link.addEventListener("keydown", (event) => {
            const openKeys = [
                "ArrowDown",
                "Enter",
                " "
            ];

            if (openKeys.includes(event.key)) {
                event.preventDefault();
                openSubmenu(item);

                const firstSubmenuLink = item.querySelector(
                    ".mega-menu a, .simple-dropdown a"
                );

                firstSubmenuLink?.focus();
            }

            if (event.key === "Escape") {
                closeSubmenu(item);
                link.focus();
            }
        });
    });

    /**
     * 마우스 호버 시 ARIA 상태 갱신
     */
    submenuItems.forEach((item) => {
        const link = item.querySelector(
            ":scope > .navigation-link"
        );

        item.addEventListener("mouseenter", () => {
            closeAllSubmenus(item);
            link?.setAttribute("aria-expanded", "true");
        });

        item.addEventListener("mouseleave", () => {
            if (!item.classList.contains("is-open")) {
                link?.setAttribute("aria-expanded", "false");
            }
        });

        item.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeSubmenu(item);
                link?.focus();
            }
        });
    });

    /* ========================================
       MY menu
    ========================================= */

    const myMenu = document.querySelector(".my-menu");
    const myMenuButton = document.querySelector(
        ".my-menu__button"
    );

    function openMyMenu() {
        myMenu?.classList.add("is-open");
        myMenuButton?.setAttribute("aria-expanded", "true");
    }

    function closeMyMenu() {
        myMenu?.classList.remove("is-open");
        myMenuButton?.setAttribute("aria-expanded", "false");
    }

    myMenuButton?.addEventListener("click", (event) => {
        event.stopPropagation();

        const isOpen =
            myMenu?.classList.contains("is-open") ?? false;

        if (isOpen) {
            closeMyMenu();
        } else {
            closeAllSubmenus();
            openMyMenu();
        }
    });

    myMenuButton?.addEventListener("keydown", (event) => {
        const openKeys = [
            "ArrowDown",
            "Enter",
            " "
        ];

        if (openKeys.includes(event.key)) {
            event.preventDefault();
            openMyMenu();

            const firstLink = myMenu?.querySelector(
                ".my-dropdown a"
            );

            firstLink?.focus();
        }

        if (event.key === "Escape") {
            closeMyMenu();
            myMenuButton.focus();
        }
    });

    myMenu?.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMyMenu();
            myMenuButton?.focus();
        }
    });

    /* ========================================
       Search overlay
    ========================================= */

    const searchOverlay = document.getElementById(
        "searchOverlay"
    );

    const searchOpenButton = document.getElementById(
        "searchOpenButton"
    );

    const searchCloseButton = document.getElementById(
        "searchCloseButton"
    );

    const searchBackdrop = document.querySelector(
        ".search-overlay__backdrop"
    );

    const searchInput = document.getElementById(
        "siteSearch"
    );

    const searchForm = document.querySelector(
        ".search-form"
    );

    let lastFocusedElement = null;

    function openSearch() {
        if (!searchOverlay) {
            return;
        }

        lastFocusedElement = document.activeElement;

        closeMobileMenu({ restoreFocus: false });
        closeAllSubmenus();
        closeMyMenu();

        searchOverlay.classList.add("is-open");
        searchOverlay.setAttribute("aria-hidden", "false");
        body.classList.add("is-search-open");

        window.setTimeout(() => {
            searchInput?.focus();
        }, 250);
    }

    function closeSearch() {
        if (!searchOverlay) {
            return;
        }

        searchOverlay.classList.remove("is-open");
        searchOverlay.setAttribute("aria-hidden", "true");
        body.classList.remove("is-search-open");

        if (
            lastFocusedElement instanceof HTMLElement
        ) {
            lastFocusedElement.focus();
        }
    }

    searchOpenButton?.addEventListener(
        "click",
        openSearch
    );

    searchCloseButton?.addEventListener(
        "click",
        closeSearch
    );

    searchBackdrop?.addEventListener(
        "click",
        closeSearch
    );

    /**
     * 검색 오버레이 내부 포커스 순환
     */
    function trapSearchFocus(event) {
        const isSearchOpen =
            searchOverlay?.classList.contains("is-open");

        if (event.key !== "Tab" || !isSearchOpen) {
            return;
        }

        const focusableElements =
            searchOverlay.querySelectorAll(
                [
                    "button:not([disabled])",
                    "a[href]",
                    "input:not([disabled])",
                    "select:not([disabled])",
                    "textarea:not([disabled])",
                    '[tabindex]:not([tabindex="-1"])'
                ].join(",")
            );

        if (!focusableElements.length) {
            return;
        }

        const firstElement = focusableElements[0];
        const lastElement =
            focusableElements[
                focusableElements.length - 1
            ];

        const isFirstElementActive =
            document.activeElement === firstElement;

        const isLastElementActive =
            document.activeElement === lastElement;

        if (event.shiftKey && isFirstElementActive) {
            event.preventDefault();
            lastElement.focus();
        } else if (
            !event.shiftKey &&
            isLastElementActive
        ) {
            event.preventDefault();
            firstElement.focus();
        }
    }

    /**
     * 검색 폼 임시 처리
     */
    searchForm?.addEventListener("submit", (event) => {
        event.preventDefault();

        const keyword = searchInput?.value.trim();

        if (!keyword) {
            searchInput?.focus();
            return;
        }

        /*
         * 검색 페이지 제작 후 아래처럼 연결할 수 있습니다.
         *
         * window.location.href =
         *     `/search.html?keyword=${encodeURIComponent(keyword)}`;
         */
    });

    /* ========================================
       Document keyboard events
    ========================================= */

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            const isSearchOpen =
                searchOverlay?.classList.contains("is-open");

            if (isSearchOpen) {
                closeSearch();
                return;
            }

            closeAllSubmenus();
            closeMyMenu();
        }

        trapSearchFocus(event);
    });

    /* ========================================
       Close menus on outside click
    ========================================= */

    document.addEventListener("click", (event) => {
        if (!(event.target instanceof Element)) {
            return;
        }

        const clickedInsideNavigation =
            event.target.closest(
                ".navigation-item.has-submenu"
            );

        const clickedInsideMyMenu =
            event.target.closest(".my-menu");

        if (!clickedInsideNavigation) {
            closeAllSubmenus();
        }

        if (!clickedInsideMyMenu) {
            closeMyMenu();
        }
    });

    /* ========================================
       Main visual slider
    ========================================= */

    const mainVisual = document.querySelector(
        "#mainVisual"
    );

    if (mainVisual) {
        const slides = Array.from(
            mainVisual.querySelectorAll(
                ".main-visual__slide"
            )
        );

        const previousButton =
            mainVisual.querySelector(
                "#mainVisualPrevious"
            ) ??
            document.querySelector(
                "#mainVisualPrevious"
            );

        const nextButton =
            mainVisual.querySelector(
                "#mainVisualNext"
            ) ??
            document.querySelector(
                "#mainVisualNext"
            );

        const playButton =
            mainVisual.querySelector(
                "#mainVisualPlayButton"
            ) ??
            document.querySelector(
                "#mainVisualPlayButton"
            );

        const currentElement =
            mainVisual.querySelector(
                "#mainVisualCurrent"
            ) ??
            document.querySelector(
                "#mainVisualCurrent"
            );

        const totalElement =
            mainVisual.querySelector(
                "#mainVisualTotal"
            ) ??
            document.querySelector(
                "#mainVisualTotal"
            );

        const progressBar =
            mainVisual.querySelector(
                "#mainVisualProgressBar"
            ) ??
            document.querySelector(
                "#mainVisualProgressBar"
            );

        const AUTOPLAY_DELAY = 3500;

        let currentIndex = 0;
        let autoplayTimer = null;
        let isPlaying = true;

        function formatNumber(number) {
            return String(number).padStart(2, "0");
        }

        function updateSlideAccessibility() {
            slides.forEach((slide, index) => {
                const isActive =
                    index === currentIndex;

                slide.classList.toggle(
                    "is-active",
                    isActive
                );

                slide.setAttribute(
                    "aria-hidden",
                    String(!isActive)
                );

                const interactiveElements =
                    slide.querySelectorAll(
                        [
                            "a",
                            "button",
                            "input",
                            "select",
                            "textarea"
                        ].join(",")
                    );

                interactiveElements.forEach(
                    (element) => {
                        if (isActive) {
                            element.removeAttribute(
                                "tabindex"
                            );
                        } else {
                            element.setAttribute(
                                "tabindex",
                                "-1"
                            );
                        }
                    }
                );
            });
        }

        function updateCounter() {
            if (currentElement) {
                currentElement.textContent =
                    formatNumber(currentIndex + 1);
            }

            if (totalElement) {
                totalElement.textContent =
                    formatNumber(slides.length);
            }
        }

        function updateVisualTheme() {
            const activeSlide =
                slides[currentIndex];

            const usesLightControls =
                activeSlide?.dataset.theme === "light";

            mainVisual.classList.toggle(
                "light-ui",
                usesLightControls
            );
        }

        function restartProgress() {
            if (!progressBar) {
                return;
            }

            progressBar.classList.remove(
                "is-running",
                "is-paused"
            );

            /*
             * CSS 애니메이션을 처음부터 시작하기 위한
             * 강제 리플로우입니다.
             */
            void progressBar.offsetWidth;

            if (isPlaying && slides.length > 1) {
                progressBar.classList.add(
                    "is-running"
                );
            }
        }

        function pauseProgress() {
            progressBar?.classList.add(
                "is-paused"
            );
        }

        function stopAutoplay() {
            if (autoplayTimer === null) {
                return;
            }

            window.clearInterval(autoplayTimer);
            autoplayTimer = null;
        }

        function startAutoplay() {
            stopAutoplay();

            if (!isPlaying || slides.length <= 1) {
                return;
            }

            autoplayTimer = window.setInterval(
                () => {
                    showSlide(
                        currentIndex + 1,
                        false
                    );
                },
                AUTOPLAY_DELAY
            );
        }

        function resetAutoplay() {
            if (!isPlaying) {
                return;
            }

            startAutoplay();
            restartProgress();
        }

        function showSlide(
            newIndex,
            shouldResetTimer = true
        ) {
            if (slides.length === 0) {
                return;
            }

            currentIndex =
                (newIndex + slides.length) %
                slides.length;

            updateSlideAccessibility();
            updateCounter();
            updateVisualTheme();

            if (shouldResetTimer) {
                resetAutoplay();
            } else {
                restartProgress();
            }
        }

        function showPreviousSlide() {
            showSlide(currentIndex - 1);
        }

        function showNextSlide() {
            showSlide(currentIndex + 1);
        }

        function updatePlayButton() {
            if (!playButton) {
                return;
            }

            const icon =
                playButton.querySelector("i");

            if (isPlaying) {
                if (icon) {
                    icon.className =
                        "fa-solid fa-pause";
                }

                playButton.setAttribute(
                    "aria-label",
                    "슬라이드 일시정지"
                );

                playButton.setAttribute(
                    "aria-pressed",
                    "false"
                );
            } else {
                if (icon) {
                    icon.className =
                        "fa-solid fa-play";
                }

                playButton.setAttribute(
                    "aria-label",
                    "슬라이드 자동 재생"
                );

                playButton.setAttribute(
                    "aria-pressed",
                    "true"
                );
            }
        }

        function toggleAutoplay() {
            isPlaying = !isPlaying;

            updatePlayButton();

            if (isPlaying) {
                startAutoplay();
                restartProgress();
            } else {
                stopAutoplay();
                pauseProgress();
            }
        }

        previousButton?.addEventListener(
            "click",
            showPreviousSlide
        );

        nextButton?.addEventListener(
            "click",
            showNextSlide
        );

        playButton?.addEventListener(
            "click",
            toggleAutoplay
        );

        /**
         * 슬라이더 내부에서 좌우 방향키 조작
         */
        mainVisual.addEventListener(
            "keydown",
            (event) => {
                if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    showPreviousSlide();
                }

                if (event.key === "ArrowRight") {
                    event.preventDefault();
                    showNextSlide();
                }
            }
        );

        /**
         * 다른 브라우저 탭으로 이동한 경우
         * 자동 재생과 진행 바 일시정지
         */
        document.addEventListener(
            "visibilitychange",
            () => {
                if (document.hidden) {
                    stopAutoplay();
                    pauseProgress();
                    return;
                }

                if (isPlaying) {
                    startAutoplay();
                    restartProgress();
                }
            }
        );

        updateSlideAccessibility();
        updateCounter();
        updateVisualTheme();
        updatePlayButton();
        startAutoplay();
        restartProgress();
    }

    /* ========================================
       Product filter
    ========================================= */

    const productTabs = document.querySelectorAll(
        ".product-tab"
    );

    const productCards = document.querySelectorAll(
        ".product-card"
    );

    productTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const selectedFilter =
                tab.dataset.productFilter;

            productTabs.forEach((item) => {
                const isSelected = item === tab;

                item.classList.toggle(
                    "is-active",
                    isSelected
                );

                item.setAttribute(
                    "aria-selected",
                    String(isSelected)
                );
            });

            productCards.forEach((card) => {
                const categories =
                    card.dataset.productCategory
                        ?.split(" ")
                        .filter(Boolean) ?? [];

                const shouldShow =
                    selectedFilter === "all" ||
                    categories.includes(
                        selectedFilter
                    );

                card.classList.toggle(
                    "is-hidden",
                    !shouldShow
                );
            });
        });
    });

    /* ========================================
       Scroll reveal
    ========================================= */

    const revealSections =
        document.querySelectorAll(
            ".reveal-section"
        );

    const reducedMotionQuery =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

    if (reducedMotionQuery.matches) {
        revealSections.forEach((section) => {
            section.classList.add("is-visible");
        });
    } else if ("IntersectionObserver" in window) {
        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add(
                            "is-visible"
                        );

                        observer.unobserve(
                            entry.target
                        );
                    });
                },
                {
                    threshold: 0.12,
                    rootMargin:
                        "0px 0px -70px 0px"
                }
            );

        revealSections.forEach((section) => {
            revealObserver.observe(section);
        });
    } else {
        /*
         * IntersectionObserver를 지원하지 않는
         * 브라우저에서는 콘텐츠를 바로 표시합니다.
         */
        revealSections.forEach((section) => {
            section.classList.add("is-visible");
        });
    }

    /* ========================================
       Scroll to top
    ========================================= */

    const scrollTopButton =
        document.querySelector(
            ".scroll-top-button"
        );

    scrollTopButton?.addEventListener(
        "click",
        () => {
            window.scrollTo({
                top: 0,
                behavior: reducedMotionQuery.matches
                    ? "auto"
                    : "smooth"
            });
        }
    );

    /* ========================================
       Footer language button
    ========================================= */

    const footerLanguageButton =
        document.querySelector(
            ".footer-language"
        );

    footerLanguageButton?.addEventListener(
        "click",
        () => {
            const isExpanded =
                footerLanguageButton.getAttribute(
                    "aria-expanded"
                ) === "true";

            footerLanguageButton.setAttribute(
                "aria-expanded",
                String(!isExpanded)
            );
        }
    );

    /* ========================================
       Temporary empty links
       실제 링크 연결 후 삭제 가능
    ========================================= */

    const temporaryLinks =
        document.querySelectorAll(
            'a[href="#"]'
        );

    temporaryLinks.forEach((link) => {
        link.addEventListener(
            "click",
            (event) => {
                event.preventDefault();
            }
        );
    });
});
