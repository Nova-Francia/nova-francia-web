document.documentElement.classList.add("js");

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
        if (height === null) {
            content.style.height = "auto";
            return;
        }

        content.style.height = `${height}px`;
    };

    let state = details.open ? "open" : "closed";

    content.addEventListener("transitionend", function (event) {
        if (event.propertyName !== "height") {
            return;
        }

        if (state === "opening") {
            state = "open";
            setHeight(null);
        } else if (state === "closing") {
            details.open = false;
            state = "closed";
            setHeight(0);
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
            window.requestAnimationFrame(function () {
                setHeight(0);
            });
            return;
        }

        details.open = true;
        state = "opening";
        setHeight(content.getBoundingClientRect().height);
        window.requestAnimationFrame(function () {
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

const galleries = document.querySelectorAll(".gallery");

if (galleries.length > 0) {
    const galleryItems = Array.from(document.querySelectorAll(".gallery > div"));
    const lightboxes = galleryItems
        .map(function (item) {
            const link = item.querySelector("a[href^='#lightbox-']");
            return link ? document.querySelector(link.getAttribute("href")) : null;
        })
        .filter(Boolean);
    let activeIndex = -1;
    let lastFocusedElement = null;

    const getCategoryHash = function (lightbox) {
        const closeLink = lightbox.querySelector("a.close");
        return closeLink ? closeLink.getAttribute("href") : "#";
    };

    const updateLightbox = function (index, updateUrl) {
        const lightbox = lightboxes[index];

        if (!lightbox) {
            return;
        }

        activeIndex = index;
        lightboxes.forEach(function (item) {
            const isInactive = item !== lightbox;
            item.setAttribute("aria-hidden", String(isInactive));
            item.inert = isInactive;
        });

        const previous = lightbox.querySelector("button.gallery-previous");
        const next = lightbox.querySelector("button.gallery-next");
        if (previous) {
            previous.disabled = lightboxes.length < 2;
        }
        if (next) {
            next.disabled = lightboxes.length < 2;
        }

        if (updateUrl) {
            window.location.hash = lightbox.id;
        }
    };

    const closeLightbox = function (restoreFocus) {
        if (activeIndex < 0) {
            return;
        }

        const lightbox = lightboxes[activeIndex];
        const categoryHash = getCategoryHash(lightbox);

        window.location.hash = categoryHash.substring(1);
        lightboxes.forEach(function (item) {
            item.setAttribute("aria-hidden", "true");
            item.inert = true;
        });
        document.body.classList.remove("gallery-open");

        if (restoreFocus && lastFocusedElement) {
            lastFocusedElement.focus();
        }

        activeIndex = -1;
    };

    const moveLightbox = function (offset) {
        if (activeIndex < 0) {
            return;
        }

        const nextIndex = (activeIndex + offset + lightboxes.length) % lightboxes.length;
        updateLightbox(nextIndex, true);
        lightboxes[nextIndex].querySelector(".gallery-close").focus();
    };

    lightboxes.forEach(function (lightbox, index) {
        const container = lightbox.querySelector(".container");
        const closeLink = lightbox.querySelector("a.close");

        if (!container || !closeLink) {
            return;
        }

        lightbox.setAttribute("role", "dialog");
        lightbox.setAttribute("aria-modal", "true");
        lightbox.setAttribute("aria-hidden", "true");
        lightbox.inert = true;
        closeLink.classList.add("gallery-close");
        closeLink.setAttribute("aria-label", "Fermer la galerie");

        const controls = document.createElement("div");
        controls.className = "gallery-controls";
        controls.innerHTML = `
            <button type="button" class="gallery-previous" aria-label="Image précédente">‹</button>
            <button type="button" class="gallery-next" aria-label="Image suivante">›</button>
        `;
        container.appendChild(controls);

        controls.querySelector(".gallery-previous").addEventListener("click", function () {
            moveLightbox(-1);
        });
        controls.querySelector(".gallery-next").addEventListener("click", function () {
            moveLightbox(1);
        });

        closeLink.addEventListener("click", function (event) {
            event.preventDefault();
            closeLightbox(true);
        });

        lightbox.addEventListener("click", function (event) {
            if (event.target === lightbox) {
                closeLightbox(true);
            }
        });

        const itemLink = galleryItems[index].querySelector("a[href^='#lightbox-']");
        if (itemLink) {
            galleryItems[index].querySelector("img").addEventListener("click", function () {
                itemLink.click();
            });
            itemLink.addEventListener("click", function (event) {
                event.preventDefault();
                lastFocusedElement = itemLink;
                window.location.hash = lightbox.id;
                document.body.classList.add("gallery-open");
                updateLightbox(index, false);
                closeLink.focus();
            });
        }

        let touchStartX = null;
        lightbox.addEventListener("touchstart", function (event) {
            touchStartX = event.touches[0].clientX;
        }, {passive: true});
        lightbox.addEventListener("touchend", function (event) {
            if (touchStartX === null) {
                return;
            }

            const distance = event.changedTouches[0].clientX - touchStartX;
            touchStartX = null;
            if (Math.abs(distance) >= 50) {
                moveLightbox(distance > 0 ? -1 : 1);
            }
        }, {passive: true});
    });

    document.addEventListener("keydown", function (event) {
        if (activeIndex < 0) {
            return;
        }

        if (event.key === "Escape") {
            event.preventDefault();
            closeLightbox(true);
        } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            moveLightbox(-1);
        } else if (event.key === "ArrowRight") {
            event.preventDefault();
            moveLightbox(1);
        } else if (event.key === "Tab") {
            const lightbox = lightboxes[activeIndex];
            const focusable = lightbox.querySelectorAll("button, a");
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });

    window.addEventListener("hashchange", function () {
        const index = lightboxes.findIndex(function (lightbox) {
            return `#${lightbox.id}` === window.location.hash;
        });

        if (index >= 0 && activeIndex < 0) {
            document.body.classList.add("gallery-open");
            updateLightbox(index, false);
        } else if (index < 0 && activeIndex >= 0) {
            closeLightbox(false);
        }
    });

    const initialIndex = lightboxes.findIndex(function (lightbox) {
        return `#${lightbox.id}` === window.location.hash;
    });

    if (initialIndex >= 0) {
        document.body.classList.add("gallery-open");
        updateLightbox(initialIndex, false);
    }
}
