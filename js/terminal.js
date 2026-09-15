/* ============================================================
   Hidden terminal easter egg
   Open: press ` (backtick)  ·  Close: Esc, or type `exit`
   ============================================================ */
(function () {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---- Build the overlay ---- */
    const overlay = document.createElement('div');
    overlay.className = 'term-egg';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'Hidden terminal');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML =
        '<div class="term-egg-window">' +
        '  <div class="term-bar term-egg-bar"><span class="term-egg-close" title="Close (Esc)">×</span></div>' +
        '  <div class="term-egg-out" aria-live="polite"></div>' +
        '  <div class="term-egg-input-row">' +
        '    <span class="term-egg-prompt">martin@portfolio:~$</span>' +
        '    <input class="term-egg-input" type="text" autocomplete="off" spellcheck="false" aria-label="Terminal command">' +
        '  </div>' +
        '</div>';
    document.body.appendChild(overlay);

    const out = overlay.querySelector('.term-egg-out');
    const input = overlay.querySelector('.term-egg-input');
    let lastFocus = null;
    let history = [];
    let histIdx = -1;

    function print(text, cls) {
        const line = document.createElement('div');
        line.className = 'term-egg-line' + (cls ? ' ' + cls : '');
        line.textContent = text;
        out.appendChild(line);
        out.scrollTop = out.scrollHeight;
    }

    function typeLine(text, cls, done) {
        if (reduceMotion) { print(text, cls); if (done) done(); return; }
        const line = document.createElement('div');
        line.className = 'term-egg-line' + (cls ? ' ' + cls : '');
        out.appendChild(line);
        let i = 0;
        (function tick() {
            line.textContent = text.slice(0, ++i);
            out.scrollTop = out.scrollHeight;
            if (i < text.length) setTimeout(tick, 12);
            else if (done) done();
        })();
    }

    function typeSeq(lines, cls, done) {
        if (!lines.length) { if (done) done(); return; }
        typeLine(lines.shift(), cls, () => typeSeq(lines, cls, done));
    }

    const CMDS = {
        help: () => [
            'available commands:',
            '  whoami          who is martin?',
            '  ls              list projects',
            '  open <name>     navigate to a project (e.g. open leaksafe)',
            '  contact         how to reach me',
            '  theme           toggle dark / light',
            '  uptime          time in the game',
            '  sudo hire-me    the important one',
            '  clear           clear the screen',
            '  exit            close terminal'
        ],
        whoami: () => ['martin mzumara — software developer & it technician, lilongwe malawi'],
        ls: () => ['leaksafe/  encplus/  manguzi/  blog/'],
        open: (arg) => {
            const routes = {
                leaksafe: '/leaksafe/', encplus: '/encplus/', manguzi: '/manguzi/',
                blog: 'https://martinmzumara.github.io/blog/'
            };
            const r = routes[(arg || '').toLowerCase()];
            if (r) { print('opening ' + arg + ' …', 'term-egg-ok'); setTimeout(() => { location.href = r; }, 500); return null; }
            return ['open: unknown target "' + arg + '" — try: ' + Object.keys(routes).join(', ')];
        },
        contact: () => [
            'email:  martinmzumara08@gmail.com',
            'github: github.com/martinmzumara',
            "tip: try 'sudo hire-me'"
        ],
        theme: () => {
            const el = document.documentElement;
            const next = el.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            el.setAttribute('data-theme', next);
            try { localStorage.setItem('theme', next); } catch (e) { /* private mode */ }
            return ['theme set to ' + next];
        },
        uptime: () => ['up ' + Math.max(1, new Date().getFullYear() - 2022) + ' years, still compiling…'],
        clear: () => { out.innerHTML = ''; return null; },
        exit: () => { close(); return null; },
        'sudo': (arg) => {
            if ((arg || '').toLowerCase().replace('_', '-') === 'hire-me') {
                typeSeq(['[sudo] password for recruiter: ********', 'permission granted ✔', 'opening mail client…'], 'term-egg-ok',
                    () => { location.href = 'mailto:martinmzumara08@gmail.com'; });
                return null;
            }
            return ['sudo: only "sudo hire-me" is supported 😄'];
        }
    };

    function run(raw) {
        const trimmed = raw.trim();
        if (!trimmed) return;
        print('martin@portfolio:~$ ' + trimmed, 'term-egg-cmd');
        history.push(trimmed);
        histIdx = history.length;
        const parts = trimmed.split(/\s+/);
        const cmd = CMDS[parts[0].toLowerCase()];
        if (!cmd) { print('bash: ' + parts[0] + ': command not found — try "help"', 'term-egg-err'); return; }
        const result = cmd(parts.slice(1).join(' '));
        if (Array.isArray(result)) result.forEach(l => print(l));
    }

    function open() {
        lastFocus = document.activeElement;
        overlay.classList.add('is-open');
        overlay.setAttribute('aria-hidden', 'false');
        if (!out.childElementCount) {
            typeLine('// martin@portfolio — v1.0. type "help" for commands.', 'term-egg-ok');
        }
        setTimeout(() => input.focus(), reduceMotion ? 0 : 120);
    }

    function close() {
        overlay.classList.remove('is-open');
        overlay.setAttribute('aria-hidden', 'true');
        if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    document.addEventListener('keydown', (e) => {
        const tag = (e.target.tagName || '').toLowerCase();
        const typing = tag === 'input' || tag === 'textarea' || e.target.isContentEditable;
        if (e.key === '`' && !typing && !overlay.classList.contains('is-open')) {
            e.preventDefault();
            open();
        } else if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
            close();
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { run(input.value); input.value = ''; }
        else if (e.key === 'ArrowUp' && histIdx > 0) { input.value = history[--histIdx]; }
        else if (e.key === 'ArrowDown') {
            input.value = histIdx < history.length - 1 ? history[++histIdx] : (histIdx = history.length, '');
        }
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.classList.contains('term-egg-close')) close();
    });
})();

