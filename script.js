"use strict";

/* =========================================================
   SAFE DOM HELPERS
========================================================= */

const $ = (selector, parent = document) =>
    parent.querySelector(selector);

const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];


/* =========================================================
   FOOTER YEAR
========================================================= */

const yearElement = $("#year");

if (yearElement) {
    yearElement.textContent =
        new Date().getFullYear();
}


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

const navToggle = $(".nav-toggle");
const navLinks = $(".nav-links");
const navItems = $$(".nav-link");


const closeNavigation = () => {

    if (!navToggle || !navLinks) {
        return;
    }

    navLinks.classList.remove("open");

    navToggle.setAttribute(
        "aria-expanded",
        "false"
    );

    navToggle.setAttribute(
        "aria-label",
        "Open navigation"
    );

    document.body.classList.remove(
        "nav-open"
    );
};


const openNavigation = () => {

    if (!navToggle || !navLinks) {
        return;
    }

    navLinks.classList.add("open");

    navToggle.setAttribute(
        "aria-expanded",
        "true"
    );

    navToggle.setAttribute(
        "aria-label",
        "Close navigation"
    );

    document.body.classList.add(
        "nav-open"
    );
};


if (navToggle && navLinks) {

    navToggle.addEventListener(
        "click",
        () => {

            const isOpen =
                navToggle.getAttribute(
                    "aria-expanded"
                ) === "true";

            if (isOpen) {
                closeNavigation();
            } else {
                openNavigation();
            }
        }
    );


    navItems.forEach((item) => {

        item.addEventListener(
            "click",
            closeNavigation
        );

    });


    document.addEventListener(
        "click",
        (event) => {

            if (
                !navLinks.contains(event.target) &&
                !navToggle.contains(event.target)
            ) {
                closeNavigation();
            }
        }
    );


    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {

                closeNavigation();

                navToggle.focus();
            }
        }
    );
}


/* =========================================================
   REVEAL ELEMENTS ON SCROLL
========================================================= */

const revealElements =
    $$(".reveal");


if (
    "IntersectionObserver" in window &&
    revealElements.length > 0
) {

    const revealObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add(
                        "visible"
                    );

                    observer.unobserve(
                        entry.target
                    );
                });

            },
            {
                threshold: 0.12,

                rootMargin:
                    "0px 0px -40px 0px"
            }
        );


    revealElements.forEach((element) => {

        revealObserver.observe(element);

    });

} else {

    revealElements.forEach((element) => {

        element.classList.add("visible");

    });
}


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const sections =
    $$("main section[id]");


if (
    "IntersectionObserver" in window &&
    sections.length > 0 &&
    navItems.length > 0
) {

    const sectionObserver =
        new IntersectionObserver(
            (entries) => {

                const visibleSections =
                    entries
                        .filter(
                            (entry) =>
                                entry.isIntersecting
                        )
                        .sort(
                            (a, b) =>
                                b.intersectionRatio -
                                a.intersectionRatio
                        );


                if (
                    visibleSections.length === 0
                ) {
                    return;
                }


                const activeId =
                    visibleSections[0]
                        .target
                        .id;


                navItems.forEach((item) => {

                    const isActive =
                        item.getAttribute(
                            "href"
                        ) ===
                        `#${activeId}`;


                    item.classList.toggle(
                        "active",
                        isActive
                    );

                });

            },
            {
                rootMargin:
                    "-30% 0px -55% 0px",

                threshold: [
                    0.05,
                    0.15,
                    0.3
                ]
            }
        );


    sections.forEach((section) => {

        sectionObserver.observe(section);

    });
}


/* =========================================================
   CLOSE NAVIGATION AFTER RESIZE
========================================================= */

let resizeTimer = null;


window.addEventListener(
    "resize",
    () => {

        clearTimeout(resizeTimer);

        resizeTimer =
            setTimeout(() => {

                if (
                    window.innerWidth > 700
                ) {
                    closeNavigation();
                }

            }, 150);

    },
    {
        passive: true
    }
);


/* =========================================================
   HANDLE HASH LINKS ON INITIAL LOAD
========================================================= */

window.addEventListener(
    "load",
    () => {

        const hash =
            window.location.hash;

        if (!hash) {
            return;
        }


        const target =
            document.getElementById(
                hash.substring(1)
            );


        if (!target) {
            return;
        }


        setTimeout(() => {

            const reducedMotion =
                window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches;


            target.scrollIntoView({
                behavior:
                    reducedMotion
                        ? "auto"
                        : "smooth"
            });

        }, 100);
    }
);