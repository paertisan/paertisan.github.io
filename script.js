document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.querySelector('.content-area');
    const navLinks = document.querySelectorAll('nav a');
    const logoLink = document.querySelector('.logo-link');
    const popup = document.getElementById('streaming-popup');
    const closePopup = popup.querySelector('.close-popup');

    // Content for each "page"
    const pages = {
        '#home': `
            <div class="block-quote">
                <i>
                    The <span class="highlight">Word</span> is my
                    <span class="highlight">music</span>
                </i>
            </div>
        `,
        '#about': `
            <div class="text-body">
                Robert is a composer and pianist living in Oregon.
            </div>
        `,
        '#music': `
            <div class="music-links">
                <a href="#" class="vol0">Vol. 0</a>
            </div>
        `,
        '#contact': `
            <div class="text-body contact-section">
                <div class="contact-icons">
                    <a href="https://x.com/rwalterrust" target="_blank" rel="noopener noreferrer" class="contact-link" aria-label="Follow on X">
                        <svg viewBox="0 0 24 24" width="32" height="32" class="contact-icon">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor"></path>
                        </svg>
                    </a>
                    <a href="mailto:info@rwrmusic.com" class="contact-link" aria-label="Email info@rwrmusic.com">
                        <svg viewBox="0 0 24 24" width="32" height="32" class="contact-icon">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"></path>
                        </svg>
                    </a>
                </div>
            </div>
        `
    };

    // Function to check if the device is mobile
    function isMobile() {
        return window.innerWidth <= 768;
    }

    // Function to update page title
    function updateTitle(hash) {
        const titles = {
            '#home': 'RWR Music - Home',
            '#about': 'RWR Music - About',
            '#music': 'RWR Music - Music',
            '#contact': 'RWR Music - Contact'
        };
        document.title = titles[hash] || 'RWR Music';
    }

    // Function to update content with transition
    function updateContent(hash) {
        if (!pages[hash] && hash !== '#home') {
            console.warn(`Hash ${hash} not found, defaulting to #home`);
        }
        contentArea.classList.add('content-area--exit');
        setTimeout(() => {
            contentArea.innerHTML = pages[hash] || pages['#home'];
            contentArea.classList.remove('content-area--exit');
            contentArea.classList.add('content-area--enter');
            setTimeout(() => {
                contentArea.classList.remove('content-area--enter');
            }, 300);
            if (hash !== '#music' && !popup.classList.contains('show')) {
                document.body.classList.remove('vol0-active');
            }
            bindVol0Link();
            updateTitle(hash);
        }, 300);
    }

    // Function to bind click event to .vol0
    function bindVol0Link() {
        const vol0Link = document.querySelector('.vol0');
        if (vol0Link) {
            vol0Link.addEventListener('click', (event) => {
                event.preventDefault();
                popup.style.display = 'flex';
                popup.classList.add('show');
                document.body.classList.add('vol0-active');
                closePopup.focus();
                vol0Link.dataset.lastFocused = 'true';
            });
        }
    }

    // Bind nav links once
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const href = link.getAttribute('href');
            if (href === '#music' && isMobile()) {
                document.body.classList.add('vol0-active');
            }
            updateContent(href);
        });
    });

    // Logo click to home
    logoLink.addEventListener('click', (event) => {
        event.preventDefault();
        updateContent('#home');
    });

    // Close popup and revert styles
    closePopup.addEventListener('click', () => {
        popup.classList.remove('show');
        setTimeout(() => {
            popup.style.display = 'none';
            document.body.classList.remove('vol0-active');
            const lastFocused = document.querySelector('.vol0[data-last-focused="true"]');
            if (lastFocused) {
                lastFocused.focus();
                delete lastFocused.dataset.lastFocused;
            }
        }, 300);
    });

    // Close popup when clicking outside
    popup.addEventListener('click', (event) => {
        if (event.target === popup) {
            closePopup.click();
        }
    });

    // Close popup with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && popup.classList.contains('show')) {
            closePopup.click();
        }
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', (event) => {
        updateContent(window.location.hash || '#home');
    });

    // Load initial content based on URL hash
    updateContent(window.location.hash || '#home');
});