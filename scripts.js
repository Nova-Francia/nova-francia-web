document.documentElement.classList.add("js");

document.querySelectorAll("details").forEach(function (details) {
    const summary = details.querySelector(":scope > summary");
    let closeTimer;

    if (!summary) {
        return;
    }

    summary.addEventListener("click", function (event) {
        event.preventDefault();
        window.clearTimeout(closeTimer);

        if (details.open) {
            details.classList.add("closing");
            closeTimer = window.setTimeout(function () {
                details.open = false;
                details.classList.remove("closing");
            }, 350);
            return;
        }

        details.open = true;
        window.requestAnimationFrame(function () {
            details.classList.remove("closing");
        });
    });
});

document.querySelectorAll(".menu-button").forEach(function (button) {
    const menu = document.getElementById(button.getAttribute("aria-controls"));

    if (!menu) {
        return;
    }

    menu.setAttribute("aria-hidden", "true");

    const closeMenu = function () {
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-label", "Ouvrir le menu de navigation");
        menu.setAttribute("aria-hidden", "true");
        menu.style.position = "";
    };

    button.addEventListener("click", function () {
        const isExpanded = button.getAttribute("aria-expanded") === "true";

        button.setAttribute("aria-expanded", String(!isExpanded));
        button.setAttribute("aria-label", isExpanded ? "Ouvrir le menu de navigation" : "Fermer le menu de navigation");
        menu.setAttribute("aria-hidden", String(isExpanded));
        menu.style.position = isExpanded ? "" : "fixed";
    });

    menu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeMenu();
            button.focus();
        }
    });
});

document.querySelectorAll("a[target='_blank']").forEach(function (link) {
    const rel = new Set((link.getAttribute("rel") || "").split(/\s+/).filter(Boolean));
    rel.add("noopener");
    rel.add("noreferrer");
    link.setAttribute("rel", Array.from(rel).join(" "));
});

document.querySelectorAll("details").forEach(function (details) {
    const summary = details.querySelector(":scope > summary");
    const content = details.querySelector(":scope > div");

    if (!summary || !content) {
        return;
    }

    content.classList.add("details-content");

    const setHeight = function (height) {
        content.style.maxHeight = height === null ? "none" : `${height}px`;
    };

    let state = details.open ? "open" : "closed";

    content.addEventListener("transitionend", function (event) {
        if (event.propertyName !== "max-height") {
            return;
        }

        if (state === "opening") {
            state = "open";
            setHeight(null);
        } else if (state === "closing") {
            details.open = false;
            state = "closed";
            setHeight(null);
        }
    });

    if (details.open) {
        setHeight(null);
    } else {
        setHeight(0);
    }

    summary.addEventListener("click", function (event) {
        event.preventDefault();

        if (state === "open" || state === "opening") {
            state = "closing";
            setHeight(content.getBoundingClientRect().height);
            requestAnimationFrame(function () {
                setHeight(0);
            });
            return;
        }

        details.open = true;
        state = "opening";
        setHeight(0);
        requestAnimationFrame(function () {
            setHeight(content.scrollHeight);
        });
    });
});

const faders = document.querySelectorAll(".fade-in");

if ("IntersectionObserver" in window) {
    const appearOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("appear");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0,
        rootMargin: "0px 0px -100px 0px"
    });

    faders.forEach(function (fader) {
        appearOnScroll.observe(fader);
    });
} else {
    faders.forEach(function (fader) {
        fader.classList.add("appear");
    });
}

const fullscreen = document.getElementById("full-screen");

if (fullscreen) {
    fullscreen.addEventListener("click", function () {
        const header = document.querySelector("header");
        const footer = document.querySelector("footer");
        const iframe = document.getElementById("mainIframe");
        const isFullscreen = this.classList.toggle("fullscreen");

        header.classList.toggle("heightMask", isFullscreen);
        footer.classList.toggle("heightMask", isFullscreen);
        iframe.classList.toggle("iframe-fullscreen", isFullscreen);
        this.setAttribute("aria-label", isFullscreen ? "Quitter le plein écran" : "Afficher la carte en plein écran");
    });
}
