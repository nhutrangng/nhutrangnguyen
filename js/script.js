const musicWidget = document.getElementById('musicWidget');
const bgMusic = document.getElementById('bgMusic');

if (musicWidget && bgMusic) {
    musicWidget.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicWidget.classList.add('is-playing');
        } else {
            bgMusic.pause();
            musicWidget.classList.remove('is-playing');
        }
    });
}

const pastelPalettes = [
    { bg: 'rgba(255, 204, 213, 0.7)', text: '#d63384' },
    { bg: 'rgba(204, 245, 225, 0.7)', text: '#0f5132' },
    { bg: 'rgba(204, 229, 255, 0.7)', text: '#0b5ed7' },
    { bg: 'rgba(232, 211, 255, 0.9)', text: '#6f42c1' },
    { bg: 'rgba(255, 243, 205, 0.8)', text: '#664d03' },
    { bg: 'rgba(255, 229, 217, 0.8)', text: '#b85c00' },
    { bg: 'rgba(225, 255, 250, 0.8)', text: '#008080' },
    { bg: 'rgba(240, 240, 240, 0.9)', text: '#333333' }
];

const navLinks = Array.from(document.querySelectorAll('.nav-links a:not(.btn-contact)'));
const menuItems = document.querySelectorAll('.nav-links a, .btn-contact');


const syncActiveNav = () => {
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    const currentHash = window.location.hash;

    const hasHashLinks = navLinks.some(link => link.getAttribute('href').startsWith('#'));
    if (!hasHashLinks) return;

    navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        let isActive = false;

        if (href.startsWith('#')) {
            isActive = href === (currentHash || '#home');
        } else {
            isActive = href === currentFile;
        }

        link.classList.toggle('is-active', isActive);
        if (isActive) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
};

if (navLinks.length) {
    syncActiveNav();
    window.addEventListener('hashchange', syncActiveNav);
}

const resetItemColor = (item) => {
    if (item.classList.contains('btn-contact')) {
        item.style.backgroundColor = '#111';
        item.style.color = '#fff';
    } else if (item.classList.contains('is-active')) {
        item.style.backgroundColor = 'transparent';
        item.style.color = '#111';
    } else {
        item.style.backgroundColor = 'transparent';
        item.style.color = '#555';
    }
};

menuItems.forEach((item) => {
    resetItemColor(item);

    item.addEventListener('mouseenter', () => {
        const randomIdx = Math.floor(Math.random() * pastelPalettes.length);
        const chosenColor = pastelPalettes[randomIdx];
        item.style.backgroundColor = chosenColor.bg;
        item.style.color = chosenColor.text;
    });

    item.addEventListener('mouseleave', () => {
        resetItemColor(item);
    });
});

// ---------------- 5. MODAL CONTACT ----------------
const contactModal = document.getElementById('contactModal');
const contactBtns = document.querySelectorAll('.btn-contact');
const modalCloseBtn = document.querySelector('.modal-close');

const openModal = () => {
    if (!contactModal) return;
    contactModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';   
};

const closeModal = () => {
    if (!contactModal) return;
    contactModal.classList.remove('is-open');
    document.body.style.overflow = '';
};
contactBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });
});

if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
}
if (contactModal) {
    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) closeModal();
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});


const SFX_KEY = 'portfolio-sfx-enabled';
let sfxEnabled = localStorage.getItem(SFX_KEY) !== 'off';  
const SFX_POOL_SIZE = 4;
const hoverSfxPool = [];
let sfxIndex = 0;

for (let i = 0; i < SFX_POOL_SIZE; i++) {
    const a = new Audio('assets/hover.mp3');
    a.volume = 0.25;                
    a.preload = 'auto';
    hoverSfxPool.push(a);
}

const playHoverSfx = () => {
    if (!sfxEnabled) return;
    const sound = hoverSfxPool[sfxIndex];
    sfxIndex = (sfxIndex + 1) % SFX_POOL_SIZE;
    sound.currentTime = 0;
    sound.play().catch(() => {});
};

const sfxTargets = document.querySelectorAll(
    '.skill-chip, .tech-logo, .project-card, .modal-link, .nav-links a, .btn-contact'
);

sfxTargets.forEach((el) => {
    el.addEventListener('mouseenter', playHoverSfx);
});

const sfxToggle = document.getElementById('sfxToggle');

const updateSfxToggleUI = () => {
    if (!sfxToggle) return;
    sfxToggle.classList.toggle('is-muted', !sfxEnabled);
    sfxToggle.setAttribute('aria-label', sfxEnabled ? 'Turn sound off' : 'Turn sound on');
    sfxToggle.setAttribute('title', sfxEnabled ? 'Sound on' : 'Sound off');
};

if (sfxToggle) {
    updateSfxToggleUI();
    sfxToggle.addEventListener('click', () => {
        sfxEnabled = !sfxEnabled;
        localStorage.setItem(SFX_KEY, sfxEnabled ? 'on' : 'off');
        updateSfxToggleUI();
        if (sfxEnabled) playHoverSfx();  
    });
}