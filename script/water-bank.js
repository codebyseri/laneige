"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const productGrid = document.querySelector(
        "#wbProductGrid"
    );

    const productCards = Array.from(
        document.querySelectorAll(".wb-product-card")
    );

    const categoryInputs = document.querySelectorAll(
        'input[name="wbCategory"]'
    );

    const productCount = document.querySelector(
        "#wbProductCount"
    );

    const visibleCountElement = document.querySelector(
        "#wbVisibleCount"
    );

    const totalCountElement = document.querySelector(
        "#wbTotalCount"
    );

    const loadMoreArea = document.querySelector(
        "#wbLoadMoreArea"
    );

    const loadMoreButton = document.querySelector(
        "#wbLoadMoreButton"
    );

    const sortSelect = document.querySelector(
        "#wbSortSelect"
    );

    const filterReset = document.querySelector(
        "#wbFilterReset"
    );

    const emptyState = document.querySelector(
        "#wbProductEmpty"
    );

    const emptyResetButton =
        emptyState?.querySelector("button");

    const filterPanel =
        document.querySelector(".wb-filter");

    const mobileFilterButton =
        document.querySelector(
            "#wbMobileFilterButton"
        );

    const filterBackdrop =
        document.querySelector(
            "#wbFilterBackdrop"
        );

    const filterGroupButton =
        document.querySelector(
            ".wb-filter__group-title"
        );

    const filterOptions =
        document.querySelector(
            ".wb-filter__options"
        );

    const initialVisibleCount = 9;
    const loadMoreCount = 5;

    let activeCategory = "all";
    let visibleLimit = initialVisibleCount;

    /* ======================================
       현재 필터에 해당하는 상품 가져오기
    ====================================== */

    const getFilteredCards = () => {
        return productCards.filter((card) => {
            const cardCategory =
                card.dataset.category;

            return (
                activeCategory === "all" ||
                cardCategory === activeCategory
            );
        });
    };

    /* ======================================
       상품 표시 업데이트
    ====================================== */

    const updateProducts = ({
        animateNewItems = false
    } = {}) => {
        const filteredCards = getFilteredCards();
        const totalFilteredCount =
            filteredCards.length;

        const actualVisibleCount = Math.min(
            visibleLimit,
            totalFilteredCount
        );

        productCards.forEach((card) => {
            card.hidden = true;
            card.classList.remove(
                "is-load-hidden",
                "is-load-visible"
            );
        });

        filteredCards.forEach((card, index) => {
            const shouldShow =
                index < visibleLimit;

            card.hidden = false;
            card.classList.toggle(
                "is-load-hidden",
                !shouldShow
            );

            if (
                animateNewItems &&
                shouldShow &&
                index >= visibleLimit - loadMoreCount
            ) {
                card.classList.add(
                    "is-load-visible"
                );
            }
        });

        if (productCount) {
            productCount.textContent =
                String(totalFilteredCount);
        }

        if (visibleCountElement) {
            visibleCountElement.textContent =
                String(actualVisibleCount);
        }

        if (totalCountElement) {
            totalCountElement.textContent =
                String(totalFilteredCount);
        }

        const hasProducts =
            totalFilteredCount > 0;

        if (productGrid) {
            productGrid.hidden = !hasProducts;
        }

        if (emptyState) {
            emptyState.hidden = hasProducts;
        }

        if (loadMoreArea) {
            const hasMoreProducts =
                actualVisibleCount <
                totalFilteredCount;

            loadMoreArea.hidden =
                !hasMoreProducts;
        }
    };

    /* ======================================
       Load More
    ====================================== */

    loadMoreButton?.addEventListener(
        "click",
        () => {
            visibleLimit += loadMoreCount;

            updateProducts({
                animateNewItems: true
            });
        }
    );

    /* ======================================
       카테고리 필터
    ====================================== */

    categoryInputs.forEach((input) => {
        input.addEventListener("change", () => {
            activeCategory = input.value;

            /* 필터를 바꾸면 다시 최대 8개부터 표시 */
            visibleLimit = initialVisibleCount;

            updateProducts();
            closeMobileFilter();
        });
    });

    /* ======================================
       필터 초기화
    ====================================== */

    const resetFilter = () => {
        activeCategory = "all";
        visibleLimit = initialVisibleCount;

        const allInput =
            document.querySelector(
                'input[name="wbCategory"][value="all"]'
            );

        if (allInput) {
            allInput.checked = true;
        }

        updateProducts();
    };

    filterReset?.addEventListener(
        "click",
        resetFilter
    );

    emptyResetButton?.addEventListener(
        "click",
        resetFilter
    );

    /* ======================================
       상품 정렬
    ====================================== */

    const sortProducts = (sortType) => {
        if (!productGrid) {
            return;
        }

        productCards.sort(
            (firstCard, secondCard) => {
                if (sortType === "name") {
                    const firstName =
                        firstCard.dataset.name ?? "";

                    const secondName =
                        secondCard.dataset.name ?? "";

                    return firstName.localeCompare(
                        secondName,
                        "ko"
                    );
                }

                if (sortType === "best") {
                    const firstBest = Number(
                        firstCard.dataset.best ?? 0
                    );

                    const secondBest = Number(
                        secondCard.dataset.best ?? 0
                    );

                    return (
                        secondBest - firstBest
                    );
                }

                const firstNew = Number(
                    firstCard.dataset.new ?? 0
                );

                const secondNew = Number(
                    secondCard.dataset.new ?? 0
                );

                return secondNew - firstNew;
            }
        );

        productCards.forEach((card) => {
            productGrid.appendChild(card);
        });

        /*
         정렬을 변경해도 사용자가 열어놓은
         상품 개수는 유지
        */
        updateProducts();
    };

    sortSelect?.addEventListener(
        "change",
        () => {
            sortProducts(sortSelect.value);
        }
    );

    /* ======================================
       필터 메뉴 접기
    ====================================== */

    filterGroupButton?.addEventListener(
        "click",
        () => {
            if (!filterOptions) {
                return;
            }

            const isCollapsed =
                filterOptions.classList.toggle(
                    "is-collapsed"
                );

            filterGroupButton.setAttribute(
                "aria-expanded",
                String(!isCollapsed)
            );

            const icon =
                filterGroupButton.querySelector("i");

            icon?.classList.toggle(
                "fa-minus",
                !isCollapsed
            );

            icon?.classList.toggle(
                "fa-plus",
                isCollapsed
            );
        }
    );

    /* ======================================
       모바일 필터
    ====================================== */

    function openMobileFilter() {
        if (!filterPanel || !filterBackdrop) {
            return;
        }

        filterPanel.classList.add("is-open");
        filterBackdrop.hidden = false;

        document.body.style.overflow =
            "hidden";
    }

    function closeMobileFilter() {
        if (!filterPanel || !filterBackdrop) {
            return;
        }

        filterPanel.classList.remove("is-open");
        filterBackdrop.hidden = true;

        document.body.style.overflow = "";
    }

    mobileFilterButton?.addEventListener(
        "click",
        openMobileFilter
    );

    filterBackdrop?.addEventListener(
        "click",
        closeMobileFilter
    );

    document.addEventListener(
        "keydown",
        (event) => {
            if (
                event.key === "Escape" &&
                filterPanel?.classList.contains(
                    "is-open"
                )
            ) {
                closeMobileFilter();
            }
        }
    );

    /* ======================================
       제품 영역 부드러운 이동
    ====================================== */

    const productAnchor =
        document.querySelector(
            'a[href="#wbProductSection"]'
        );

    productAnchor?.addEventListener(
        "click",
        (event) => {
            const target =
                document.querySelector(
                    "#wbProductSection"
                );

            if (!target) {
                return;
            }

            event.preventDefault();

            const header =
                document.querySelector(
                    ".site-header"
                );

            const headerHeight =
                header?.offsetHeight ?? 0;

            const targetTop =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight;

            window.scrollTo({
                top: targetTop,
                behavior: "smooth"
            });
        }
    );

    /* ======================================
       스크롤 등장 효과
    ====================================== */

    const revealElements =
        document.querySelectorAll(
            ".wb-reveal"
        );

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    if (
        "IntersectionObserver" in window &&
        !reducedMotion
    ) {
        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        if (
                            !entry.isIntersecting
                        ) {
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
                    threshold: 0.1,
                    rootMargin:
                        "0px 0px -40px 0px"
                }
            );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach((element) => {
            element.classList.add(
                "is-visible"
            );
        });
    }

    /* ======================================
       초기 실행
    ====================================== */

    sortProducts("new");
});