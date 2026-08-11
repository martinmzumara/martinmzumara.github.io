// Pre-apply theme early to prevent visual flashing on page load
(function initTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        document.documentElement.setAttribute("data-theme", "light");
    } else {
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
            localStorage.setItem("theme", newTheme);
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
    const iconMenu = document.querySelector(".icon-menu");
    const iconClose = document.querySelector(".icon-close");

    if (navToggle && navLinks) {
        navToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            const isOpen = navLinks.classList.contains("active");
            
            if (iconMenu && iconClose) {
                iconMenu.style.display = isOpen ? "none" : "block";
                iconClose.style.display = isOpen ? "block" : "none";
            }
        });

        // Close menu when clicking a link
        document.querySelectorAll(".nav-link").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                if (iconMenu && iconClose) {
                    iconMenu.style.display = "block";
                    iconClose.style.display = "none";
                }
            });
        });
    }

    // 5. Lightbox Modal Functionality for Showcase Items
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxClose = document.getElementById("lightbox-close");
    const showcaseItems = document.querySelectorAll(".showcase-item");

    if (lightbox && lightboxImg && showcaseItems.length > 0) {
        showcaseItems.forEach(item => {
            item.addEventListener("click", () => {
                const fullSrc = item.getAttribute("data-full");
                if (fullSrc) {
                    lightboxImg.src = fullSrc;
                    lightbox.classList.add("active");
                }
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove("active");
        };

        if (lightboxClose) {
            lightboxClose.addEventListener("click", closeLightbox);
        }

        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
});