// Pre-apply theme early to prevent visual flashing on page load
(function initTheme() {
    try {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "light") {
            document.documentElement.setAttribute("data-theme", "light");
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
        }
    } catch (e) {
        document.documentElement.setAttribute("data-theme", "dark");
    }
})();

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }

    // 2. Light / Dark Theme Toggle Setup
    const themeToggleBtn = document.getElementById("theme-toggle");
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const currentTheme = document.documentElement.getAttribute("data-theme");
            const newTheme = currentTheme === "light" ? "dark" : "light";
            
            document.documentElement.setAttribute("data-theme", newTheme);
            try {
                localStorage.setItem("theme", newTheme);
            } catch (e) {
                // localStorage unavailable (e.g. private browsing) - theme still works for this session
            }
        });
    }

    // 3. Dynamic Copyright Year
    const yearSpan = document.getElementById("current-year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 4. Mobile Navigation Toggle
    const navToggle = document.getElementById("nav-toggle");
    const navLinks = document.getElementById("nav-links");

    if (navToggle && navLinks) {
        const updateNavIcons = () => {
            const isOpen = navLinks.classList.contains("active");
            const iconMenu = document.querySelector(".icon-menu");
            const iconClose = document.querySelector(".icon-close");
            
            if (iconMenu) {
                iconMenu.style.display = isOpen ? "none" : "block";
            }
            if (iconClose) {
                iconClose.style.display = isOpen ? "block" : "none";
            }
            
            navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        };

        navToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            updateNavIcons();
        });

        // Close menu when clicking a link
        document.querySelectorAll(".nav-link").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                updateNavIcons();
            });
        });

        // Close menu on Escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && navLinks.classList.contains("active")) {
                navLinks.classList.remove("active");
                updateNavIcons();
                navToggle.focus();
            }
        });

        // Close menu when clicking outside
        document.addEventListener("click", (e) => {
            if (navLinks.classList.contains("active") && 
                !navLinks.contains(e.target) && 
                !navToggle.contains(e.target)) {
                navLinks.classList.remove("active");
                updateNavIcons();
            }
        });
    }

    // 5. Lightbox Modal Functionality for Showcase Items
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxClose = document.getElementById("lightbox-close");
    const showcaseItems = document.querySelectorAll(".showcase-item");

    if (lightbox && lightboxImg && showcaseItems.length > 0) {
        const openLightbox = (src) => {
            lightboxImg.src = src;
            lightbox.classList.add("active");
            lightbox.setAttribute("aria-hidden", "false");
            document.body.classList.add("lightbox-open");
            if (lightboxClose) {
                lightboxClose.focus();
            }
        };

        const closeLightbox = () => {
            lightbox.classList.remove("active");
            lightbox.setAttribute("aria-hidden", "true");
            document.body.classList.remove("lightbox-open");
            lightboxImg.src = "";
        };

        showcaseItems.forEach(item => {
            item.addEventListener("click", () => {
                const fullSrc = item.getAttribute("data-full");
                if (fullSrc) {
                    openLightbox(fullSrc);
                }
            });
        });

        if (lightboxClose) {
            lightboxClose.addEventListener("click", closeLightbox);
        }

        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Close lightbox on Escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && lightbox.classList.contains("active")) {
                closeLightbox();
            }
        });
    }
});