// Pre-apply theme early to prevent visual flashing on page load.
// The site defaults to the light theme; a user's saved choice overrides it.
(function initTheme() {
    const STORAGE_KEY = "theme";

    const getSystemTheme = () => {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
    };

    const getSavedTheme = () => {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            return null;
        }
    };

    const applyTheme = (theme) => {
        document.documentElement.setAttribute("data-theme", theme);
    };

    // Initial theme: saved preference or system
    const savedTheme = getSavedTheme();
    applyTheme(savedTheme || getSystemTheme());

    // Listen for system theme changes (only matters when no saved preference)
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
        if (!getSavedTheme()) {
            applyTheme(getSystemTheme());
        }
    };

    if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleSystemChange);
    } else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleSystemChange); // Safari < 14
    }
})();

document.addEventListener("DOMContentLoaded", () => {
    // 1. Light / Dark Theme Toggle Setup
    const themeToggleBtn = document.getElementById("theme-toggle");
    const themeToggleLabel = document.getElementById("theme-toggle-label");

    const updateThemeToggleLabel = () => {
        if (!themeToggleLabel) return;
        const currentTheme = document.documentElement.getAttribute("data-theme");
        themeToggleLabel.textContent = currentTheme === "light" ? "Change to dark theme" : "Change to light theme";
    };

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const currentTheme = document.documentElement.getAttribute("data-theme");
            const newTheme = currentTheme === "light" ? "dark" : "light";
            
            document.documentElement.setAttribute("data-theme", newTheme);
            try {
                localStorage.setItem("theme", newTheme);
            } catch (e) {
                // localStorage unavailable - theme still works for this session
            }
            updateThemeToggleLabel();
        });
    }

    // Initialize theme toggle label
    updateThemeToggleLabel();

    // 3. Dynamic Copyright Year
    const yearSpan = document.getElementById("current-year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Copy email address to clipboard (contact section)
    const copyEmailBtn = document.getElementById("copy-email");
    if (copyEmailBtn) {
        const EMAIL = "martinmzumara08@gmail.com";
        const setCopied = (ok) => {
            copyEmailBtn.innerHTML = ok
                ? '<i class="ti ti-check"></i> COPIED!'
                : '<i class="ti ti-copy"></i> COPY EMAIL';
            clearTimeout(setCopied._t);
            setCopied._t = setTimeout(() => {
                copyEmailBtn.innerHTML = '<i class="ti ti-copy"></i> COPY EMAIL';
            }, 2000);
        };
        copyEmailBtn.addEventListener("click", () => {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(EMAIL).then(() => setCopied(true)).catch(() => setCopied(false));
            } else {
                // Legacy fallback
                const tmp = document.createElement("textarea");
                tmp.value = EMAIL;
                tmp.style.position = "fixed";
                tmp.style.opacity = "0";
                document.body.appendChild(tmp);
                tmp.select();
                let ok = false;
                try { ok = document.execCommand("copy"); } catch (e) {}
                document.body.removeChild(tmp);
                setCopied(ok);
            }
        });
    }

    // 3. Mobile Navigation Toggle
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

// 3b. Active section highlighting (scroll-spy) with aria-current
    const navLinksAll = document.querySelectorAll('.nav-link');
    const sections = [];
    navLinksAll.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('/#')) {
            const id = href.substring(2);
            const sec = document.getElementById(id);
            if (sec) sections.push({ id, sec, link });
        }
    });
    const spy = () => {
        const pos = window.scrollY + 120;
        let currentId = sections.length ? sections[0].id : null;
        sections.forEach(s => {
            if (s.sec.offsetTop <= pos) currentId = s.id;
        });
        navLinksAll.forEach(link => {
            const isActive = link.getAttribute('href') === '#/' + currentId ||
                link.getAttribute('href') === '/#' + currentId;
            if (isActive) {
                link.setAttribute('aria-current', 'true');
                link.classList.add('nav-link-active');
            } else {
                link.removeAttribute('aria-current');
                link.classList.remove('nav-link-active');
            }
        });
    };
    if (sections.length > 0) {
        window.addEventListener('scroll', spy, { passive: true });
        window.addEventListener('resize', spy, { passive: true });
        spy();
    }
    // 4. Lightbox Modal + focus management for showcase items
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const showcaseItems = document.querySelectorAll('.showcase-item');
    let lastFocused = null;

    if (lightbox && lightboxImg && showcaseItems.length > 0) {
        const openLightbox = (src, trigger) => {
            lastFocused = trigger;
            lightboxImg.src = src;
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden','false');
            document.body.classList.add('lightbox-open');
            lightbox.setAttribute('role','dialog');
            if (lightboxClose) { lightboxClose.focus(); }
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden','true');
            document.body.classList.remove('lightbox-open');
            lightboxImg.src = '';
            lightbox.removeAttribute('role');
            if (lastFocused) { lastFocused.focus(); lastFocused = null; }
        };

        showcaseItems.forEach(item => {
            item.addEventListener('click', () => {
                const fullSrc = item.getAttribute('data-full');
                if (fullSrc) { openLightbox(fullSrc, item); }
            });
        });

        if (lightboxClose) { lightboxClose.addEventListener('click', closeLightbox); }

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) { closeLightbox(); }
        });

        // Close on Escape key + trap Tab inside modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
            if (e.key === 'Tab' && lightbox.classList.contains('active')) {
                const focusable = lightbox.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (focusable.length === 0) return;
                const firstElem = focusable[0];
                const lastElem = focusable[focusable.length - 1];
                if (e.shiftKey) {
                    if (document.activeElement === firstElem) { e.preventDefault(); lastElem.focus(); }
                } else {
                    if (document.activeElement === lastElem) { e.preventDefault(); firstElem.focus(); }
                }
            }
        });
    }

    // 5. Back to Top button
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        const toggleBackToTop = () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
                backToTopBtn.removeAttribute('hidden');
            } else {
                backToTopBtn.classList.remove('visible');
                backToTopBtn.setAttribute('hidden', '');
            }
        };
        window.addEventListener('scroll', toggleBackToTop, { passive: true });
        toggleBackToTop();
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // =============== 6. Preloader ===============
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    const preloader = document.getElementById('preloader');
    const preloaderCount = document.getElementById('preloader-count');

    const finishPreload = () => {
        document.body.classList.add('loaded');
        if (preloader) {
            preloader.classList.add('done');
            setTimeout(() => { if (preloader.parentNode) preloader.parentNode.removeChild(preloader); }, 400);
        }
    };

    if (preloader && !reduceMotion) {
        document.documentElement.style.overflow = 'hidden';
        const pStart = performance.now();
        const pDur = 1300;
        const pStep = (now) => {
            const p = Math.min((now - pStart) / pDur, 1);
            if (preloaderCount) preloaderCount.textContent = Math.round((1 - Math.pow(1 - p, 3)) * 100);
            if (p < 1) {
                requestAnimationFrame(pStep);
            } else {
                document.documentElement.style.overflow = '';
                finishPreload();
            }
        };
        requestAnimationFrame(pStep);
    } else {
        finishPreload();
    }

    // =============== 7. Scroll progress bar ===============
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        const updateProgress = () => {
            const doc = document.documentElement;
            const max = doc.scrollHeight - window.innerHeight;
            const sy = doc.scrollTop || window.pageYOffset || 0;
            progressBar.style.transform = `scaleX(${max > 0 ? sy / max : 0})`;
        };
        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress, { passive: true });
        updateProgress();
    }

    // =============== 8. Live local time (Lilongwe) ===============
    const clockEl = document.getElementById('local-time');
    const updateClock = () => {
        if (!clockEl) return;
        try {
            clockEl.textContent = new Intl.DateTimeFormat('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                timeZone: 'Africa/Blantyre'
            }).format(new Date());
        } catch (e) {
            clockEl.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        }
    };
    if (clockEl) {
        updateClock();
        setInterval(updateClock, 1000);
    }

    // =============== 9. Skills marquee: duplicate for seamless loop ===============
    const marqueeTrack = document.getElementById('marquee-track');
    if (marqueeTrack && !reduceMotion) {
        marqueeTrack.innerHTML += marqueeTrack.innerHTML;
    }

    // =============== 10. Scroll-reveal system ===============
    const REVEAL_SEL = '.system-label, .section-title, .section-lead, .section-head, .card, .project-card, .timeline-item, .cred-card, .approach-text, .approach-image-container, .showcase-item';
    const revealEls = document.querySelectorAll(REVEAL_SEL);
    if (revealEls.length && 'IntersectionObserver' in window && !reduceMotion) {
        revealEls.forEach(el => el.classList.add('reveal-el'));
        const revealDelay = (el) => {
            const parent = el.parentElement;
            if (!parent) return 0;
            const peers = Array.prototype.filter.call(parent.children, (c) => c.classList && c.classList.contains('reveal-el'));
            return Math.min(peers.indexOf(el) * 90, 450);
        };
        const revealObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = revealDelay(el);
                    el.style.transitionDelay = delay + 'ms';
                    el.classList.add('revealed');
                    setTimeout(() => {
                        el.classList.remove('reveal-el');
                        el.style.transitionDelay = '';
                    }, delay + 780);
                    revealObs.unobserve(el);
                }
            });
        }, { threshold: 0.1 });
        revealEls.forEach(el => revealObs.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('revealed'));
        revealEls.forEach(el => el.classList.remove('reveal-el'));
    }

    // =============== 11. Animated stat counters ===============
    const statValues = document.querySelectorAll('.stat-value[data-count]');
    const heroStats = document.querySelector('.hero-stats');
    const animateStat = (el) => {
        const target = parseInt(el.getAttribute('data-count'), 10) || 0;
        if (reduceMotion) { el.textContent = target; return; }
        const sStart = performance.now();
        const sDur = 1400;
        const sStep = (now) => {
            const p = Math.min((now - sStart) / sDur, 1);
            el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
            if (p < 1) requestAnimationFrame(sStep);
            else el.textContent = target;
        };
        requestAnimationFrame(sStep);
    };
    if (statValues.length && heroStats && 'IntersectionObserver' in window) {
        const statsObs = new IntersectionObserver((entries) => {
            entries.forEach(en => {
                if (en.isIntersecting) {
                    statValues.forEach(animateStat);
                    statsObs.disconnect();
                }
            });
        }, { threshold: 0.25 });
        statsObs.observe(heroStats);
    } else {
        statValues.forEach(el => { el.textContent = el.getAttribute('data-count'); });
    }

    // =============== 12. 3D tilt + cursor spotlight on cards ===============
    if (!reduceMotion && finePointer) {
        document.querySelectorAll('.card, .project-card, .tool-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
                card.style.setProperty('--my', (e.clientY - r.top) + 'px');
                if (r.width >= 280 && !card.classList.contains('tool-card')) {
                    card.style.transform = `perspective(760px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-6px)`;
                } else {
                    card.style.transform = 'translateY(-5px)';
                }
            });
            card.addEventListener('mouseleave', () => {
                card.style.removeProperty('--mx');
                card.style.removeProperty('--my');
                card.style.transform = '';
            });
        });
    }

    // =============== 13. Magnetic primary buttons ===============
    if (!reduceMotion && finePointer) {
        document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const r = btn.getBoundingClientRect();
                const dx = e.clientX - r.left - r.width / 2;
                const dy = e.clientY - r.top - r.height / 2;
                btn.style.transform = `translate(${dx * 0.14}px, ${dy * 0.14}px)`;
            });
            btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
        });
    }


});
