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

    let activeCategory = "all";

    /* ======================================
       제품 표시
    ====================================== */

    const updateProducts = () => {
        let visibleCount = 0;

        productCards.forEach((card) => {
            const cardCategory =
                card.dataset.category;

            const isVisible =
                activeCategory === "all" ||
                cardCategory === activeCategory;

            card.hidden = !isVisible;

            if (isVisible) {
                visibleCount += 1;
            }
        });

        if (productCount) {
            productCount.textContent =
                String(visibleCount);
        }

        if (emptyState) {
            emptyState.hidden =
                visibleCount !== 0;
        }

        if (productGrid) {
            productGrid.hidden =
                visibleCount === 0;
        }
    };

    /* ======================================
       카테고리 선택
    ====================================== */

    categoryInputs.forEach((input) => {
        input.addEventListener("change", () => {
            activeCategory = input.value;
            updateProducts();

            closeMobileFilter();
        });
    });

    /* ======================================
       필터 초기화
    ====================================== */

    const resetFilter = () => {
        activeCategory = "all";

        const allInput = document.querySelector(
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
       제품 정렬
    ====================================== */

    const sortProducts = (sortType) => {
        if (!productGrid) {
            return;
        }

        const sortedCards = [...productCards];

        sortedCards.sort((firstCard, secondCard) => {
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

                return secondBest - firstBest;
            }

            const firstNew = Number(
                firstCard.dataset.new ?? 0
            );

            const secondNew = Number(
                secondCard.dataset.new ?? 0
            );

            return secondNew - firstNew;
        });

        sortedCards.forEach((card) => {
            productGrid.appendChild(card);
        });
    };

    sortSelect?.addEventListener(
        "change",
        () => {
            sortProducts(sortSelect.value);
        }
    );

    /* ======================================
       필터 접기
    ====================================== */

    const filterGroupButton =
        document.querySelector(
            ".wb-filter__group-title"
        );

    const filterOptions =
        document.querySelector(
            ".wb-filter__options"
        );

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

    const openMobileFilter = () => {
        if (!filterPanel || !filterBackdrop) {
            return;
        }

        filterPanel.classList.add("is-open");
        filterBackdrop.hidden = false;
        document.body.style.overflow = "hidden";
    };

    const closeMobileFilter = () => {
        if (!filterPanel || !filterBackdrop) {
            return;
        }

        filterPanel.classList.remove("is-open");
        filterBackdrop.hidden = true;
        document.body.style.overflow = "";
    };

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
       앵커 스크롤
    ====================================== */

    const productAnchor = document.querySelector(
        'a[href="#wbProductSection"]'
    );

    productAnchor?.addEventListener(
        "click",
        (event) => {
            const target = document.querySelector(
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

    if (
        "IntersectionObserver" in window &&
        !window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {
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
                        "0px 0px -50px 0px"
                }
            );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach((element) => {
            element.classList.add("is-visible");
        });
    }

    /* ======================================
       초기 실행
    ====================================== */

    sortProducts("new");
    updateProducts();
});