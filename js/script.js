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

    // =============== 14. Tools & Software data ===============
    // Edit the entries below to add/remove tools. Each entry renders a card
    // and a "read more" modal. dev: 'laptop' or 'phone'.
    const tools = [];

    tools.push({
        name: 'Visual Studio Code',
        dev: 'laptop',
        tag: 'Code Editor',
        icon: 'ti-brand-vscode',
        summary: 'My daily driver for writing, debugging, and refactoring code across web, mobile, and embedded projects.',
        intro: 'VS Code is the center of my development workflow — lightweight, fast, and endlessly extensible.',
        body: 'I lean on it for Flutter/Dart, HTML/CSS/JS, and ESP32 firmware. The integrated terminal, Git panel, and Remote-SSH let me move between laptop and server work without switching tools.',
        bullets: [
            'Integrated Git and source control',
            'Remote-SSH for managing servers and Raspberry Pi',
            'Live Server + Flutter extensions for fast iteration',
            'Settings and themes synced across machines'
        ]
    });

    tools.push({
        name: 'Flutter & Dart',
        dev: 'laptop',
        tag: 'App Development',
        icon: 'ti-code',
        summary: 'My framework of choice for building LeakSAFE, EncPlus, and other cross-platform mobile apps.',
        intro: 'Flutter lets me ship one codebase to Android and iOS with a single, fast UI.',
        body: 'I use Flutter with Dart to build the mobile front-ends for my IoT and security projects. Hot reload makes UI iteration extremely quick, and the widget system keeps the design consistent.',
        bullets: [
            'Hot reload for instant feedback',
            'Single codebase for Android + iOS',
            'Great fit for IoT companion apps',
            'State management with Provider / Riverpod'
        ]
    });

    tools.push({
        name: 'Figma',
        dev: 'laptop',
        tag: 'UI / UX Design',
        icon: 'ti-brand-figma',
        summary: 'Where I turn ideas into clean, testable interfaces before writing any code.',
        intro: 'Figma is my design playground for wireframes and high-fidelity mockups.',
        body: 'Before building a feature I sketch the layout and interactions in Figma. It keeps the design consistent and helps clients and teammates visualise the end result early.',
        bullets: [
            'Wireframes and interactive prototypes',
            'Design tokens mirrored into CSS variables',
            'Collaborative feedback on projects'
        ]
    });

    tools.push({
        name: 'Git & GitHub',
        dev: 'laptop',
        tag: 'Version Control',
        icon: 'ti-git-branch',
        summary: 'Every project lives in Git, with GitHub for hosting, collaboration, and this very site.',
        intro: 'Git is non-negotiable in my workflow — every project is versioned from day one.',
        body: 'I use Git for branching, feature work, and clean history, and GitHub for remote backups, issues, and deploying this portfolio on GitHub Pages.',
        bullets: [
            'Feature branches and pull requests',
            'Clean, readable commit history',
            'GitHub Pages for static hosting'
        ]
    });

    tools.push({
        name: 'Arduino IDE',
        dev: 'laptop',
        tag: 'Embedded / IoT',
        icon: 'ti-cpu',
        summary: 'The tool I use to program ESP32 and Arduino boards for my IoT systems.',
        intro: 'Arduino IDE is my entry point into the hardware side of my IoT projects.',
        body: 'From sensor readouts to the ESP32 firmware behind LeakSAFE, I use the Arduino toolchain to flash and debug microcontrollers that talk to my mobile apps.',
        bullets: [
            'ESP32 Wi-Fi + BLE development',
            'Sensor drivers and telemetry',
            'Serial monitor for debugging'
        ]
    });

    tools.push({
        name: 'Postman',
        dev: 'laptop',
        tag: 'API Testing',
        icon: 'ti-api',
        summary: 'For designing, testing, and debugging the APIs that connect my apps to backends.',
        intro: 'Postman keeps my API work organised and repeatable.',
        body: 'I use it to test Firebase and REST endpoints, inspect responses, and document request collections that I can re-run after every change.',
        bullets: [
            'Request collections and environments',
            'Automated API tests',
            'Shareable API documentation'
        ]
    });

    tools.push({
        name: 'Termux',
        dev: 'phone',
        tag: 'Terminal',
        icon: 'ti-terminal-2',
        summary: 'A full Linux terminal on Android — for quick edits, Git, and SSH from my phone.',
        intro: 'Termux turns my phone into a pocket Linux box.',
        body: 'When I am away from the laptop I still commit code, run scripts, and SSH into servers straight from Termux. It is surprisingly capable for a terminal app.',
        bullets: [
            'Run Git, SSH, and shell scripts',
            'Install packages via apt',
            'Access servers on the go'
        ]
    });

    tools.push({
        name: 'Termius',
        dev: 'phone',
        tag: 'SSH Client',
        icon: 'ti-terminal',
        summary: 'A polished SSH client for managing servers and network gear from anywhere.',
        intro: 'Termius is my go-to for remote server work on mobile.',
        body: 'It stores host profiles and keys securely, syncs across devices, and makes it easy to jump into a server or a switch from my phone in the field.',
        bullets: [
            'Saved host profiles and key pairs',
            'Cross-device sync',
            'Great for on-site network work'
        ]
    });

    tools.push({
        name: 'GitHub Mobile',
        dev: 'phone',
        tag: 'Developer On-the-go',
        icon: 'ti-brand-github',
        summary: 'Reviewing PRs, triaging issues, and keeping tabs on repos without opening a laptop.',
        intro: 'GitHub Mobile keeps my repos within reach.',
        body: 'I use it to respond to issues, review pull requests, and check CI status while away from my desk.',
        bullets: [
            'Review and merge pull requests',
            'Manage issues and notifications',
            'Check build status'
        ]
    });

    tools.push({
        name: 'Tasker',
        dev: 'phone',
        tag: 'Automation',
        icon: 'ti-settings',
        summary: 'Automating the repetitive bits of my phone — from connectivity to quick actions.',
        intro: 'Tasker automates the little things that save time every day.',
        body: 'I use Tasker for profiles that toggle Wi-Fi, run quick scripts, and trigger actions based on time and location.',
        bullets: [
            'Location and time-based profiles',
            'Trigger Termux scripts',
            'Automate connectivity and notifications'
        ]
    });

    // =============== 15. Render tools grid + filters + modal ===============
    const toolsGrid = document.getElementById('tools-grid');
    const toolsModal = document.getElementById('tools-modal');
    const toolsModalContent = document.getElementById('tools-modal-content');
    const toolsModalClose = document.getElementById('tools-modal-close');
    const toolsModalBackdrop = document.getElementById('tools-modal-backdrop');

    const deviceLabel = (dev) => (dev === 'phone' ? 'Phone' : 'Laptop');
    const deviceIcon = (dev) => (dev === 'phone' ? 'ti-device-mobile' : 'ti-device-laptop');

    const renderTools = (filter) => {
        if (!toolsGrid) return;
        const list = tools.filter(t => filter === 'all' || t.dev === filter);
        toolsGrid.innerHTML = list.map((t, i) => `
            <button class="tool-card" data-id="${t.name}" style="animation-delay:${i * 70}ms">
                <div class="tool-card-top">
                    <span class="tool-icon"><i class="ti ${t.icon}"></i></span>
                    <span class="tool-device ${t.dev}"><i class="ti ${deviceIcon(t.dev)}"></i> ${deviceLabel(t.dev)}</span>
                </div>
                <span class="tool-tag">${t.tag}</span>
                <h3>${t.name}</h3>
                <p class="tool-summary">${t.summary}</p>
                <span class="tool-arrow">Read more <i class="ti ti-arrow-right"></i></span>
            </button>
        `).join('');
    };
    renderTools('all');

    // Filter buttons (Laptop / Phone / All)
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            renderTools(btn.getAttribute('data-filter'));
        });
    });

    // Reading modal
    let lastToolTrigger = null;
    const openToolModal = (tool) => {
        if (!toolsModal || !toolsModalContent) return;
        toolsModalContent.innerHTML = `
            <span class="tool-device ${tool.dev}"><i class="ti ${deviceIcon(tool.dev)}"></i> ${deviceLabel(tool.dev)}</span>
            <span class="tool-tag">${tool.tag}</span>
            <h3>${tool.name}</h3>
            <span class="tool-meta">${tool.summary}</span>
            <p>${tool.intro}</p>
            <p>${tool.body}</p>
            <ul>${tool.bullets.map(b => `<li><i class="ti ti-check"></i> ${b}</li>`).join('')}</ul>
        `;
        toolsModal.classList.add('active');
        toolsModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('tools-open');
        if (toolsModalClose) toolsModalClose.focus();
    };

    const closeToolModal = () => {
        if (!toolsModal) return;
        toolsModal.classList.remove('active');
        toolsModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('tools-open');
        if (lastToolTrigger) lastToolTrigger.focus();
    };

    if (toolsGrid) {
        toolsGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.tool-card');
            if (!card) return;
            const tool = tools.find(t => t.name === card.getAttribute('data-id'));
            if (tool) {
                lastToolTrigger = card;
                openToolModal(tool);
            }
        });
    }
    if (toolsModalClose) toolsModalClose.addEventListener('click', closeToolModal);
    if (toolsModalBackdrop) toolsModalBackdrop.addEventListener('click', closeToolModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && toolsModal && toolsModal.classList.contains('active')) {
            closeToolModal();
        }
    });

});
