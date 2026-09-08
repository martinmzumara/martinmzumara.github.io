// ============================================================
// Tools & Software articles data.
// Shared by the homepage (#tools, featured subset) and the
// /articles/ page (full archive).
//
// To add a post, copy a SITE_TOOLS.push({ ... }); block, edit the
// fields, and save. Set featured: true on up to ~3 entries to have
// them shown on the homepage.
// dev: 'laptop' or 'phone' (drives the filter + badge).
// ============================================================
var SITE_TOOLS = [];

SITE_TOOLS.push({
    name: 'Visual Studio Code',
    dev: 'laptop',
    tag: 'Code Editor',
    icon: 'ti-brand-vscode',
    featured: true,
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

SITE_TOOLS.push({
    name: 'Flutter & Dart',
    dev: 'laptop',
    tag: 'App Development',
    icon: 'ti-code',
    featured: true,
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

SITE_TOOLS.push({
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

SITE_TOOLS.push({
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

SITE_TOOLS.push({
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

SITE_TOOLS.push({
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

SITE_TOOLS.push({
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

SITE_TOOLS.push({
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

SITE_TOOLS.push({
    name: 'GitHub Mobile',
    dev: 'phone',
    tag: 'Developer On-the-go',
    icon: 'ti-brand-github',
    featured: true,
    summary: 'Reviewing PRs, triaging issues, and keeping tabs on repos without opening a laptop.',
    intro: 'GitHub Mobile keeps my repos within reach.',
    body: 'I use it to respond to issues, review pull requests, and check CI status while away from my desk.',
    bullets: [
        'Review and merge pull requests',
        'Manage issues and notifications',
        'Check build status'
    ]
});

SITE_TOOLS.push({
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
