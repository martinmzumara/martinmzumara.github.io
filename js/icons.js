/* Custom iOS-style SVG icon injector.
 *
 * Loads the /assets/icons/icons.svg sprite once, then swaps every
 * <i class="ti ti-NAME"> element for an <svg><use href="#ic-NAME"></svg>.
 *
 * - Keeps the element's existing modifier classes (icon-blue, icon-large,
 *   check-icon, icon-close, icon-sun/moon, etc.) so all current theming
 *   and sizing keeps working.
 * - Sizes each SVG using the computed width of the original <i>, so CSS
 *   rules (icon-large:32px, check-icon:14px, ...) are honored automatically.
 * - If an icon has no matching <symbol>, the original <i> is left in place
 *   and renders via the Tabler webfont (graceful fallback).
 */
(function () {
    "use strict";

    var SPRITE_URL = "/assets/icons/icons.svg";
    var ready = false;

    // Extract the ti-<name> from an element's class list ("ti ti-code icon-large")
    function iconName(el) {
        var classes = el.classList;
        for (var i = 0; i < classes.length; i++) {
            var c = classes[i];
            if (c.lastIndexOf("ti-", 0) === 0) {
                return c.slice(3); // strip "ti-"
            }
        }
        return null;
    }

    // Best-effort square size from the icon's computed layout width.
    function iconSize(el) {
        var s;
        try {
            s = parseFloat(window.getComputedStyle(el).width);
        } catch (e) {
            s = NaN;
        }
        if (isNaN(s) || s < 8 || s > 300) s = 20;
        return Math.round(s);
    }

    function swapIcon(el) {
        var name = iconName(el);
        if (!name || !document.getElementById("ic-" + name)) return;

        var size = iconSize(el);

        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("width", size);
        svg.setAttribute("height", size);
        svg.setAttribute("aria-hidden", "true");
        svg.classList.add("ci");

        // Keep modifier classes, drop the "ti" and "ti-name" identifiers
        var classes = Array.prototype.slice.call(el.classList);
        for (var i = 0; i < classes.length; i++) {
            var c = classes[i];
            if (c === "ti" || c.lastIndexOf("ti-", 0) === 0) continue;
            svg.classList.add(c);
        }

        var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
        use.setAttribute("href", "#ic-" + name);
        use.setAttribute("xlink:href", "#ic-" + name);
        // No width/height on <use>: it must fill the outer SVG's 24x24
        // viewBox. Setting a small size here would crop the glyph and push
        // it off-centre (0–N units of a 24-unit canvas starting at 0,0).
        svg.appendChild(use);

        el.replaceWith(svg);
    }

    function swapAll() {
        if (!ready) return;
        var icons = document.querySelectorAll("i.ti, [class*=' ti-'], [class^='ti-']");
        Array.prototype.forEach.call(icons, swapIcon);
    }

    // Inline the sprite's <symbol>s into the page once, then swap.
    function loadSprite() {
        fetch(SPRITE_URL)
            .then(function (res) {
                if (!res.ok) throw new Error("sprite " + res.status);
                return res.text();
            })
            .then(function (text) {
                var temp = document.createElement("div");
                temp.innerHTML = text;
                var src = temp.querySelector("svg");
                if (!src) throw new Error("sprite missing <svg>");

                var host = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                host.setAttribute("aria-hidden", "true");
                host.style.cssText = "display:none;width:0;height:0;";
                Array.prototype.forEach.call(src.querySelectorAll("symbol"), function (sym) {
                    host.appendChild(sym);
                });

                var holder = document.createElement("div");
                holder.setAttribute("hidden", "");
                holder.appendChild(host);
                document.body.insertAdjacentElement("afterbegin", holder);

                ready = true;
                swapAll();
            })
            .catch(function () {
                // Sprite unavailable (e.g. opened via file://) — leave Tabler icons as-is.
                ready = true;
            });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", loadSprite);
    } else {
        loadSprite();
    }

    // Re-swap dynamically added icons (tools grid / modal are rendered by
    // script.js after this file runs).
    if (window.MutationObserver) {
        var obs = new MutationObserver(function (mutations) {
            var dirty = false;
            mutations.forEach(function (m) {
                m.addedNodes.forEach(function (nd) {
                    if (nd.querySelector && nd.querySelector("i.ti, [class*=' ti-'], [class^='ti-']")) {
                        dirty = true;
                    }
                });
            });
            if (dirty) swapAll();
        });
        obs.observe(document.body, { childList: true, subtree: true });
    }
})();