(function () {
    // Configuration
    const MAX_SCROLL_DISTANCE = Math.floor(Math.random() * 5000) + 10000;
    const BLOCK_TIME = 50 * 60 * 1000; // 50 minutes

    // Variables
    let lastBlockTime = parseInt(localStorage.getItem('lastBlockTime')) || 0;
    let totalScrolledDistance = parseInt(localStorage.getItem('totalScrolledDistance')) || 0;
    let maxScrollDepth = window.scrollY;
    let currentURL = window.location.href;

    // Elements
    const overlay = createRedOverlay();
    const style = createStyles();
    document.head.appendChild(style);

    // Event Listeners
    window.addEventListener('scroll', function () {
        if (window.location.href !== currentURL) {
            this.setTimeout(function () {
                currentURL = window.location.href;
                resetMaxScrollDepth();
            }, 500);
        } else {
            updateTotalScrolledDistance();
        }
    }, { passive: true });

    // Functions
    function updateTotalScrolledDistance() {
        const currentScrollDepth = window.scrollY;
        if (currentScrollDepth > maxScrollDepth) {
            const additionalScrollDistance = currentScrollDepth - maxScrollDepth;
            maxScrollDepth = currentScrollDepth;
            totalScrolledDistance += additionalScrollDistance;
            localStorage.setItem('totalScrolledDistance', totalScrolledDistance.toString());
            enforceMaxScroll();
        }
    }

    function resetMaxScrollDepth() {
        maxScrollDepth = window.scrollY;
    }

    function resetTotalScrolledDistance() {
        totalScrolledDistance = 0;
        localStorage.removeItem('totalScrolledDistance');
        //localStorage.setItem('totalScrolledDistance', '0');
    }

    function createRedOverlay() {
        const overlay = document.createElement('div');
        overlay.style = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: red; opacity: 0; z-index: 1000; transition: opacity 0.5s; pointer-events: none;";
        document.body.appendChild(overlay);
        return overlay;
    }

    function flashRedOverlay() {
        overlay.style.opacity = '0.8';
        setTimeout(function () {
            overlay.style.opacity = '0';
        }, 300);
    }

    function enforceMaxScroll() {
        const currentTime = new Date().getTime();
        if (totalScrolledDistance > MAX_SCROLL_DISTANCE) {
            // window.scrollTo(0, MAX_SCROLL_DISTANCE);
            flashRedOverlay();
            // resetTotalScrolledDistance();
            lastBlockTime = currentTime;
            localStorage.setItem('lastBlockTime', lastBlockTime.toString());
            blockAccessToTwitter();
        }
    }

    function blockAccessToTwitter() {
        const currentTime = new Date().getTime();
        if (lastBlockTime !== 0 && currentTime < lastBlockTime + BLOCK_TIME) {
            const timeLeft = Math.ceil((lastBlockTime + BLOCK_TIME - currentTime) / 1000);
            setTimeout(function () {
                resetTotalScrolledDistance();
                window.location.replace('about:blank?x-is-back-in=' + timeLeft);
            }, 400);
        }
    }

    function createStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
        [data-testid="cellInnerDiv"] > div > div[role="button"] {
            display: none;
            }
            
            div[data-testid="sidebarColumn"] {
            display: none !important;
            }
            
            [data-testid="AppTabBar_Home_Link"] {
            display: none;
            }
            
            [data-testid="AppTabBar_Explore_Link"] {
            margin-top: 40px;
            }
            
            .css-175oi2r.r-dnmrzs.r-1vvnge1 {
              display: none;
            }
            
            .r-dkhcqf {
            display: none;
            }
            
            [data-testid="primaryColumn"],
            .r-1ye8kvj {
            max-width: 700px;
            }
            
            .r-113js5t {
            width: 900px;
            }
        `;
        return style;
    }

    // Initialization
    if (!localStorage.getItem('totalScrolledDistance')) {
        localStorage.setItem('totalScrolledDistance', '0');
    }
    const currentTime = new Date().getTime();
    if (lastBlockTime !== 0 && currentTime > lastBlockTime + BLOCK_TIME) {
        localStorage.removeItem('lastBlockTime');
        resetTotalScrolledDistance(); // Reset totalScrolledDistance if block time has expired
    }
    blockAccessToTwitter();
})();