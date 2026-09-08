// ============================================================
// Tools & Software articles renderer.
// Shared by the homepage and the /articles/ page:
//  - Renders cards into any element with id="tools-grid".
//  - If .tools-filter buttons exist, wires the Laptop/Phone/All
//    filter (articles page). Otherwise renders only the entries
//    flagged featured: true (homepage).
//  - If the reading modal markup exists, wires open/close/Escape.
// Requires js/tools-data.js to be loaded first (window.SITE_TOOLS).
// ============================================================
(function () {
    "use strict";

    var init = function () {
        var tools = window.SITE_TOOLS;
        var toolsGrid = document.getElementById('tools-grid');
        if (!toolsGrid) return;
        console.log('[tools] init running. SITE_TOOLS:', tools ? tools.length + ' entries' : 'MISSING');
        if (!tools || !tools.length) {
            console.error('[tools] SITE_TOOLS is missing or empty — check that js/tools-data.js loaded (Network tab).');
            toolsGrid.innerHTML = '<p style="color:tomato;font-family:monospace">[tools] Data failed to load — open DevTools Console for details.</p>';
            return;
        }
        var toolsModal = document.getElementById('tools-modal');
        var toolsModalContent = document.getElementById('tools-modal-content');
        var toolsModalClose = document.getElementById('tools-modal-close');
        var toolsModalBackdrop = document.getElementById('tools-modal-backdrop');
        var hasFilters = !!document.querySelector('.tools-filter');

        var deviceLabel = function (dev) { return dev === 'phone' ? 'Phone' : 'Laptop'; };
        var deviceIcon = function (dev) { return dev === 'phone' ? 'ti-device-mobile' : 'ti-device-laptop'; };

        var renderTools = function (filter) {
            var list = tools.filter(function (t) {
                if (filter === 'featured') return !!t.featured;
                return filter === 'all' || t.dev === filter;
            });
            toolsGrid.innerHTML = list.map(function (t, i) {
                return '<button class="tool-card" data-id="' + t.name + '" style="animation-delay:' + (i * 70) + 'ms">' +
                    '<div class="tool-card-top">' +
                        '<span class="tool-icon"><i class="ti ' + t.icon + '"></i></span>' +
                        '<span class="tool-device ' + t.dev + '"><i class="ti ' + deviceIcon(t.dev) + '"></i> ' + deviceLabel(t.dev) + '</span>' +
                    '</div>' +
                    '<span class="tool-tag">' + t.tag + '</span>' +
                    '<h3>' + t.name + '</h3>' +
                    '<p class="tool-summary">' + t.summary + '</p>' +
                    '<span class="tool-arrow">Read more <i class="ti ti-arrow-right"></i></span>' +
                '</button>';
            }).join('');
            console.log('[tools] rendered', list.length, 'cards (filter: ' + filter + ')');
        };

        renderTools(hasFilters ? 'all' : 'featured');

        // Filter buttons (Laptop / Phone / All) — articles page only
        if (hasFilters) {
            document.querySelectorAll('.filter-btn').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    document.querySelectorAll('.filter-btn').forEach(function (b) {
                        b.classList.remove('active');
                        b.setAttribute('aria-selected', 'false');
                    });
                    btn.classList.add('active');
                    btn.setAttribute('aria-selected', 'true');
                    renderTools(btn.getAttribute('data-filter'));
                });
            });
        }

        // Reading modal (homepage + articles page)
        var lastToolTrigger = null;
        var openToolModal = function (tool) {
            if (!toolsModal || !toolsModalContent) return;
            toolsModalContent.innerHTML =
                '<span class="tool-device ' + tool.dev + '"><i class="ti ' + deviceIcon(tool.dev) + '"></i> ' + deviceLabel(tool.dev) + '</span>' +
                '<span class="tool-tag">' + tool.tag + '</span>' +
                '<h3>' + tool.name + '</h3>' +
                '<span class="tool-meta">' + tool.summary + '</span>' +
                '<p>' + tool.intro + '</p>' +
                '<p>' + tool.body + '</p>' +
                '<ul>' + tool.bullets.map(function (b) { return '<li><i class="ti ti-check"></i> ' + b + '</li>'; }).join('') + '</ul>';
            toolsModal.classList.add('active');
            toolsModal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('tools-open');
            if (toolsModalClose) toolsModalClose.focus();
        };

        var closeToolModal = function () {
            if (!toolsModal) return;
            toolsModal.classList.remove('active');
            toolsModal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('tools-open');
            if (lastToolTrigger) lastToolTrigger.focus();
        };

        if (toolsGrid) {
            toolsGrid.addEventListener('click', function (e) {
                var card = e.target.closest('.tool-card');
                if (!card) return;
                var tool = tools.find(function (t) { return t.name === card.getAttribute('data-id'); });
                if (tool) {
                    lastToolTrigger = card;
                    openToolModal(tool);
                }
            });
        }
        if (toolsModalClose) toolsModalClose.addEventListener('click', closeToolModal);
        if (toolsModalBackdrop) toolsModalBackdrop.addEventListener('click', closeToolModal);
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && toolsModal && toolsModal.classList.contains('active')) {
                closeToolModal();
            }
        });
    };

    // Run as soon as the DOM is ready — even if other scripts errored.
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
