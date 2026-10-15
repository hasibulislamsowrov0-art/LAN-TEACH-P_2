/**
 * Smart Land Mapping (স্মার্ট ল্যান্ড ম্যাপিং) - Main Client Portal Script
 * Fully Professional Navigation, Real Interactive Leaflet GIS Satellite Map,
 * All-Districts Emergency Police Station Calling System, High-Definition Photo Gallery,
 * Land Area Measurement Calculator & Comprehensive Cadastral Management.
 */

(function (window) {
    'use strict';

    // Application Navigation & Filter States
    let currentTab = 'overview'; // 'overview', 'map', 'lands', 'emergency', 'gallery', 'directory', 'guide', 'myplots', 'verifications'
    let currentSlideIndex = 0;
    let slideInterval = null;
    let editingPlotId = null;

    let emergencyDivisionFilter = 'all';
    let emergencyDistrictFilter = 'all';
    let emergencySearchQuery = '';

    let galleryCategoryFilter = 'all';

    let mapDistrictFilter = 'all';
    let mapStatusFilter = 'all';
    let focusedMapPlotId = null;

    let isMobileNavOpen = false;

    // User High-Security, Anti-Bot & Lockout State
    let isUserRobotVerified = false;
    let userRobotVerificationCode = '';
    let userRobotMathAnswer = null;
    let userRobotVerificationTimestamp = 0;
    let userLockoutCountdownTimer = null;

    document.addEventListener('DOMContentLoaded', () => {
        initPortal();
        setupSyncListener();
    });

    function setupSyncListener() {
        window.addEventListener('geoterra-data-synced', () => {
            renderPortal();
        });
    }

    function initPortal() {
        renderPortal();
        startSlideAutoplay();
    }

    function startSlideAutoplay() {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(() => {
            const slides = GeoTerraStore.getSlides();
            if (slides && slides.length > 0) {
                currentSlideIndex = (currentSlideIndex + 1) % slides.length;
                updateSlideView();
            }
        }, 5000);
    }

    // --- Master Render Pipeline ---
    function renderPortal() {
        const app = document.getElementById('app');
        if (!app) return;

        if (userLockoutCountdownTimer) {
            clearInterval(userLockoutCountdownTimer);
            userLockoutCountdownTimer = null;
        }

        const config = GeoTerraStore.getSiteConfig();
        const user = GeoTerraStore.getUserSession();
        const lang = GeoTerraStore.getLanguage();

        // Update Document Title
        const displayTitle = lang === 'bn' ? (config.siteNameBn || 'স্মার্ট ল্যান্ড ম্যাপিং') : (config.siteName || 'Smart Land Mapping');
        const displayTagline = lang === 'bn' ? (config.taglineBn || 'ডিজিটাল ভূমি রেকর্ড ও ক্যাডাস্ট্রাল পোর্টাল') : (config.tagline || 'National Cadastral & GIS Land Bureau');
        document.title = `${displayTitle} - ${displayTagline}`;

        renderTopBanner(config, lang);
        renderNavbar(config, user, lang);
        renderFloatingEmergencyWidget(lang);

        if (!user) {
            app.innerHTML = renderPublicLanding(config, lang);
            bindPublicEvents();
            if (currentTab === 'overview') updateSlideView();
        } else {
            app.innerHTML = renderDashboardView(config, user, lang);
            bindDashboardEvents(user, lang);
        }

        // Post-render lifecycle: Initialize Leaflet Map if current tab is 'map'
        if (currentTab === 'map') {
            setTimeout(() => {
                initLeafletInteractiveMap(lang, focusedMapPlotId);
            }, 50);
        }
    }

    // --- Floating Emergency Police Button ---
    function renderFloatingEmergencyWidget(lang) {
        let el = document.getElementById('floating-emergency-widget');
        if (!el) {
            el = document.createElement('div');
            el.id = 'floating-emergency-widget';
            document.body.appendChild(el);
        }

        el.className = 'fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 pointer-events-auto';
        el.innerHTML = `
            <button type="button" onclick="window.switchPortalTab('emergency')" 
                class="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-xs shadow-2xl shadow-red-600/60 hover:scale-105 transition-all animate-pulse border-2 border-white/80">
                <i class="fa-solid fa-shield-halved text-base"></i>
                <span class="tracking-wide">${lang === 'bn' ? '🚨 জরুরি পুলিশ কল (সকল জেলা)' : '🚨 Call Police (All Districts)'}</span>
            </button>
        `;
    }

    // --- Top Announcement Banner ---
    function renderTopBanner(config, lang) {
        let bannerEl = document.getElementById('top-notice-banner');
        if (!config.enableNotice) {
            if (bannerEl) bannerEl.style.display = 'none';
            return;
        }

        if (!bannerEl) {
            bannerEl = document.createElement('div');
            bannerEl.id = 'top-notice-banner';
            document.body.insertBefore(bannerEl, document.body.firstChild);
        }

        const noticeText = lang === 'bn' ? (config.noticeBannerBn || config.noticeBanner) : config.noticeBanner;
        bannerEl.style.display = 'block';
        bannerEl.className = 'bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-emerald-200 text-xs py-2 px-4 border-b border-emerald-800/60 shadow-xs';
        bannerEl.innerHTML = `
            <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
                <div class="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
                    <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span class="font-medium text-emerald-100">${escapeHtml(noticeText)}</span>
                </div>
                <div class="flex items-center gap-3 text-[11px] text-emerald-300 font-mono shrink-0">
                    <a href="tel:999" class="hover:text-red-300 font-bold text-red-400 flex items-center gap-1 transition">
                        <i class="fa-solid fa-phone-volume"></i> 999 Police
                    </a>
                    <span>&bull;</span>
                    <a href="tel:16122" class="hover:text-emerald-200 flex items-center gap-1 transition">
                        <i class="fa-solid fa-headset text-emerald-400"></i> ${lang === 'bn' ? 'ভূমি সেবা:' : 'Land:'} <strong class="text-white">16122</strong>
                    </a>
                    <span>&bull;</span>
                    <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[10px]">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> RTK GIS ONLINE
                    </span>
                </div>
            </div>
        `;
    }

    // --- Header Navbar with Fully Professional Navigation Menu Bar ---
    function renderNavbar(config, user, lang) {
        let navEl = document.getElementById('main-navbar');
        if (!navEl) return;

        const siteName = lang === 'bn' ? (config.siteNameBn || 'স্মার্ট ল্যান্ড ম্যাপিং') : (config.siteName || 'Smart Land Mapping');
        const tagline = lang === 'bn' ? (config.taglineBn || 'ডিজিটাল ভূমি রেকর্ড পোর্টাল') : (config.tagline || 'National Cadastral & GIS Land Bureau');

        const activeClass = "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-bold";
        const inactiveClass = "text-slate-700 hover:text-emerald-600 hover:bg-slate-100 font-medium";

        navEl.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16 sm:h-20">
                    
                    <!-- Brand Identity -->
                    <div class="flex items-center gap-3">
                        <a href="javascript:void(0)" onclick="window.switchPortalTab('overview')" class="flex items-center gap-2.5 group">
                            <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 group-hover:scale-105 transition-all">
                                <i class="fa-solid fa-earth-americas text-xl animate-spin-slow"></i>
                            </div>
                            <div>
                                <span class="font-black text-lg sm:text-xl tracking-tight text-slate-900 flex items-center gap-1.5">
                                    ${escapeHtml(siteName)}
                                    <span class="text-[9px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-mono uppercase tracking-wider">GIS 2026</span>
                                </span>
                                <p class="text-[10px] text-slate-500 font-semibold tracking-wide uppercase truncate max-w-[170px] sm:max-w-none">${escapeHtml(tagline)}</p>
                            </div>
                        </a>
                    </div>

                    <!-- Professional Desktop Navigation Bar -->
                    <nav class="hidden lg:flex items-center gap-1 font-semibold text-xs overflow-x-auto max-w-3xl scrollbar-none py-1">
                        <button type="button" onclick="window.switchPortalTab('overview')" 
                            class="px-2.5 py-1.5 rounded-xl transition flex items-center gap-1 shrink-0 ${currentTab === 'overview' ? activeClass : inactiveClass}">
                            <i class="fa-solid fa-house"></i> ${lang === 'bn' ? 'হোম' : 'Home'}
                        </button>
                        <button type="button" onclick="window.switchPortalTab('map')" 
                            class="px-2.5 py-1.5 rounded-xl transition flex items-center gap-1 shrink-0 ${currentTab === 'map' ? activeClass : inactiveClass}">
                            <i class="fa-solid fa-map-location-dot text-emerald-500"></i> ${lang === 'bn' ? 'লাইভ ম্যাপ' : 'Live Map'}
                        </button>
                        <button type="button" onclick="window.switchPortalTab('advisor')" 
                            class="px-2.5 py-1.5 rounded-xl transition flex items-center gap-1 shrink-0 ${currentTab === 'advisor' ? activeClass : inactiveClass}">
                            <i class="fa-solid fa-seedling text-emerald-600"></i> ${lang === 'bn' ? 'জমি পরিকল্পনা' : 'Land Advisor'}
                        </button>
                        <button type="button" onclick="window.switchPortalTab('weather')" 
                            class="px-2.5 py-1.5 rounded-xl transition flex items-center gap-1 shrink-0 ${currentTab === 'weather' ? activeClass : inactiveClass}">
                            <i class="fa-solid fa-cloud-sun text-amber-500"></i> ${lang === 'bn' ? 'আবহাওয়া' : 'Agro-Weather'}
                        </button>
                        <button type="button" onclick="window.switchPortalTab('officials')" 
                            class="px-2.5 py-1.5 rounded-xl transition flex items-center gap-1 shrink-0 ${currentTab === 'officials' ? activeClass : inactiveClass}">
                            <i class="fa-solid fa-building-columns text-blue-600"></i> ${lang === 'bn' ? 'কর্মকর্তা' : 'Officers'}
                        </button>
                        <button type="button" onclick="window.switchPortalTab('emergency')" 
                            class="px-2.5 py-1.5 rounded-xl transition flex items-center gap-1 shrink-0 ${currentTab === 'emergency' ? 'bg-red-600 text-white shadow-md shadow-red-600/30 font-bold' : 'text-red-700 hover:text-red-800 hover:bg-red-50 font-bold'}">
                            <i class="fa-solid fa-shield-halved text-red-500"></i> ${lang === 'bn' ? 'পুলিশ' : 'Police'}
                        </button>
                        <button type="button" onclick="window.switchPortalTab('lands')" 
                            class="px-2.5 py-1.5 rounded-xl transition flex items-center gap-1 shrink-0 ${currentTab === 'lands' ? activeClass : inactiveClass}">
                            <i class="fa-solid fa-layer-group"></i> ${lang === 'bn' ? 'প্লটসমূহ' : 'Plots'}
                        </button>
                        <button type="button" onclick="window.switchPortalTab('gallery')" 
                            class="px-2.5 py-1.5 rounded-xl transition flex items-center gap-1 shrink-0 ${currentTab === 'gallery' ? activeClass : inactiveClass}">
                            <i class="fa-solid fa-images text-teal-500"></i> ${lang === 'bn' ? 'চিত্রশালা' : 'Gallery'}
                        </button>
                        <button type="button" onclick="window.switchPortalTab('directory')" 
                            class="px-2.5 py-1.5 rounded-xl transition flex items-center gap-1 shrink-0 ${currentTab === 'directory' ? activeClass : inactiveClass}">
                            <i class="fa-solid fa-users"></i> ${lang === 'bn' ? 'মালিকবৃন্দ' : 'Users'}
                        </button>
                        <button type="button" onclick="window.switchPortalTab('guide')" 
                            class="px-2.5 py-1.5 rounded-xl transition flex items-center gap-1 shrink-0 ${currentTab === 'guide' ? activeClass : inactiveClass}">
                            <i class="fa-solid fa-calculator text-amber-500"></i> ${lang === 'bn' ? 'ক্যালকুলেটর' : 'Calc'}
                        </button>
                    </nav>

                    <!-- Right Controls (Emergency Call, Language, Profile / Login) -->
                    <div class="flex items-center gap-2 sm:gap-3">
                        <!-- Direct 999 Police Calling Button -->
                        <a href="tel:999" class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-black shadow-md shadow-red-600/25 transition" title="National Police Emergency 999">
                            <i class="fa-solid fa-phone"></i> <span>999 Police</span>
                        </a>

                        <!-- Language Switcher Button -->
                        <button type="button" onclick="window.toggleAppLanguage()" class="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-300 hover:border-emerald-600 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-bold transition shadow-2xs">
                            <i class="fa-solid fa-language text-sm text-emerald-600"></i>
                            <span>${lang === 'bn' ? 'ENG' : 'বাংলা'}</span>
                        </button>

                        ${user ? `
                            <div class="flex items-center gap-2 bg-slate-100 p-1 sm:p-1.5 rounded-xl border border-slate-200">
                                <img src="${escapeHtml(user.avatar)}" class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover border border-emerald-500">
                                <div class="hidden md:block text-left pr-1 leading-tight">
                                    <span class="text-xs font-bold text-slate-800 block truncate max-w-[110px]">${escapeHtml(lang === 'bn' ? (user.fullNameBn || user.fullName) : user.fullName)}</span>
                                    <span class="text-[10px] text-emerald-600 font-mono font-bold">${escapeHtml(user.username)}</span>
                                </div>
                                <button type="button" onclick="window.userLogout()" class="p-1.5 text-slate-400 hover:text-red-600 text-xs transition" title="Sign Out">
                                    <i class="fa-solid fa-right-from-bracket"></i>
                                </button>
                            </div>
                        ` : `
                            <button type="button" onclick="window.scrollOrFocusLogin()" class="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5">
                                <i class="fa-solid fa-user-lock"></i> <span>${lang === 'bn' ? 'লগইন' : 'Sign In'}</span>
                            </button>
                        `}

                        <!-- Mobile Hamburger Button -->
                        <button type="button" id="mobile-menu-btn" onclick="window.toggleMobileNavDrawer()" class="xl:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition" aria-label="Toggle Menu">
                            <i id="mobile-menu-icon" class="fa-solid ${isMobileNavOpen ? 'fa-xmark' : 'fa-bars'} text-lg"></i>
                        </button>
                    </div>
                </div>

                <!-- Responsive Mobile Slide-Down Menu Drawer -->
                <div id="mobile-nav-drawer" class="${isMobileNavOpen ? 'block' : 'hidden'} xl:hidden border-t border-slate-200 py-3 space-y-1 animate-fade-in bg-white/95">
                    <button type="button" onclick="window.switchPortalTab('overview'); window.toggleMobileNavDrawer();" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${currentTab === 'overview' ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'}">
                        <i class="fa-solid fa-house w-5"></i> ${lang === 'bn' ? 'হোম ওভারভিউ' : 'Home Overview'}
                    </button>
                    <button type="button" onclick="window.switchPortalTab('map'); window.toggleMobileNavDrawer();" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${currentTab === 'map' ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'}">
                        <i class="fa-solid fa-map-location-dot w-5 text-emerald-500"></i> ${lang === 'bn' ? 'জিআইএস লাইভ ভূমি ম্যাপ' : 'GIS Live Land Map'}
                    </button>
                    <button type="button" onclick="window.switchPortalTab('advisor'); window.toggleMobileNavDrawer();" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${currentTab === 'advisor' ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'}">
                        <i class="fa-solid fa-seedling w-5 text-emerald-600"></i> ${lang === 'bn' ? 'জমি ক্রয়োত্তর স্মার্ট পরিকল্পনা ও পরামর্শক' : 'Post-Purchase Land Advisor & Plans'}
                    </button>
                    <button type="button" onclick="window.switchPortalTab('weather'); window.toggleMobileNavDrawer();" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${currentTab === 'weather' ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'}">
                        <i class="fa-solid fa-cloud-sun w-5 text-amber-500"></i> ${lang === 'bn' ? 'কৃষি আবহাওয়া ও জলবায়ু বার্তা' : 'Agro-Weather Climate Center'}
                    </button>
                    <button type="button" onclick="window.switchPortalTab('officials'); window.toggleMobileNavDrawer();" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${currentTab === 'officials' ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'}">
                        <i class="fa-solid fa-building-columns w-5 text-blue-600"></i> ${lang === 'bn' ? 'জেলার কৃষি ও ভূমি কর্মকর্তাদের তালিকা' : 'District Land & Agri Officials'}
                    </button>
                    <button type="button" onclick="window.switchPortalTab('lands'); window.toggleMobileNavDrawer();" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${currentTab === 'lands' ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'}">
                        <i class="fa-solid fa-layer-group w-5"></i> ${lang === 'bn' ? 'জাতীয় জমির দাগ ও খতিয়ান তালিকা' : 'Registered Land Plots'}
                    </button>
                    <button type="button" onclick="window.switchPortalTab('emergency'); window.toggleMobileNavDrawer();" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${currentTab === 'emergency' ? 'bg-red-600 text-white' : 'text-red-700 bg-red-50 hover:bg-red-100'}">
                        <i class="fa-solid fa-shield-halved w-5 text-red-500"></i> ${lang === 'bn' ? 'জরুরি পুলিশ ও থানা ডিরেক্টরি' : 'Emergency Police Directory'}
                    </button>
                    <button type="button" onclick="window.switchPortalTab('gallery'); window.toggleMobileNavDrawer();" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${currentTab === 'gallery' ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'}">
                        <i class="fa-solid fa-images w-5 text-teal-500"></i> ${lang === 'bn' ? 'জমি ও জরিপ চিত্রশালা' : 'Cadastral Photo Gallery'}
                    </button>
                    <button type="button" onclick="window.switchPortalTab('directory'); window.toggleMobileNavDrawer();" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${currentTab === 'directory' ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'}">
                        <i class="fa-solid fa-users w-5"></i> ${lang === 'bn' ? '১০ জন ভূমির মালিকের ডিরেক্টরি' : '10 Landowners Directory'}
                    </button>
                    <button type="button" onclick="window.switchPortalTab('guide'); window.toggleMobileNavDrawer();" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${currentTab === 'guide' ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'}">
                        <i class="fa-solid fa-calculator w-5 text-amber-500"></i> ${lang === 'bn' ? 'ভূমি পরিমাপ ক্যালকুলেটর ও গাইড' : 'Land Area Calculator & Guide'}
                    </button>

                    <div class="pt-2 border-t border-slate-200 flex gap-2">
                        <a href="tel:999" class="flex-1 py-2 rounded-xl bg-red-600 text-white text-xs font-bold flex items-center justify-center gap-2">
                            <i class="fa-solid fa-phone"></i> Call 999 Police
                        </a>
                        <button type="button" onclick="window.toggleAppLanguage()" class="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700">
                            ${lang === 'bn' ? 'English' : 'বাংলা'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    window.toggleMobileNavDrawer = function () {
        isMobileNavOpen = !isMobileNavOpen;
        const drawer = document.getElementById('mobile-nav-drawer');
        const icon = document.getElementById('mobile-menu-icon');
        if (drawer) {
            if (isMobileNavOpen) drawer.classList.remove('hidden');
            else drawer.classList.add('hidden');
        }
        if (icon) {
            icon.className = `fa-solid ${isMobileNavOpen ? 'fa-xmark' : 'fa-bars'} text-lg`;
        }
    };

    window.scrollOrFocusLogin = function () {
        if (currentTab !== 'overview') {
            currentTab = 'overview';
            renderPortal();
        }
        setTimeout(() => {
            const form = document.getElementById('user-login-username');
            if (form) {
                form.scrollIntoView({ behavior: 'smooth', block: 'center' });
                form.focus();
            }
        }, 100);
    };

    // --- Public Landing Switcher ---
    function renderPublicLanding(config, lang) {
        switch (currentTab) {
            case 'map':
                return renderLiveMapTab(lang);
            case 'advisor':
                return renderLandAdvisorTab(lang);
            case 'weather':
                return renderWeatherTab(lang);
            case 'officials':
                return renderOfficialsTab(lang);
            case 'emergency':
                return renderEmergencyTab(lang);
            case 'gallery':
                return renderGalleryTab(lang);
            case 'directory':
                return renderDirectoryStandaloneTab(lang);
            case 'guide':
                return renderGuideTab(lang);
            case 'lands':
                return renderLandsStandaloneTab(lang);
            case 'overview':
            default:
                return renderOverviewHeroAndContent(config, lang);
        }
    }

    // --- Overview Hero & Content View ---
    function renderOverviewHeroAndContent(config, lang) {
        const stats = GeoTerraStore.getStats();
        const users = GeoTerraStore.getAllUsers();
        const slides = GeoTerraStore.getSlides();
        const userLockState = GeoTerraStore.getUserLockoutState ? GeoTerraStore.getUserLockoutState() : { isLocked: false, remainingSeconds: 0, failedAttempts: 0 };
        const isUserLocked = userLockState.isLocked;

        return `
            <div class="flex-1 flex flex-col animate-fade-in">
                <!-- Hero Section: Interactive Animated Slider / Carousel (Bangla & Eng) -->
                <section class="relative bg-slate-950 text-white overflow-hidden py-10 sm:py-14 border-b border-slate-800 gis-grid-dark">
                    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>

                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <!-- Top Carousel Card -->
                        <div class="relative bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl mb-10 backdrop-blur-xl">
                            <div id="hero-carousel-container" class="relative min-h-[380px] sm:min-h-[440px] flex items-center">
                                ${slides.map((s, index) => {
                                    const title = lang === 'bn' ? s.titleBn : s.titleEn;
                                    const desc = lang === 'bn' ? s.descriptionBn : s.descriptionEn;
                                    const badge = lang === 'bn' ? s.badgeBn : s.badgeEn;

                                    return `
                                        <div class="hero-slide-item absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlideIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}" data-slide-index="${index}">
                                            <div class="absolute inset-0">
                                                <img src="${s.image}" class="w-full h-full object-cover opacity-25 filter blur-xs" alt="Slide">
                                                <div class="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent"></div>
                                            </div>

                                            <div class="relative z-10 p-6 sm:p-12 md:p-16 max-w-3xl space-y-4">
                                                <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold tracking-wider">
                                                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                                    ${escapeHtml(badge)}
                                                </div>
                                                <h1 class="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
                                                    ${escapeHtml(title)}
                                                </h1>
                                                <p class="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                                                    ${escapeHtml(desc)}
                                                </p>
                                                <div class="pt-2 flex flex-wrap items-center gap-3">
                                                    <button type="button" onclick="window.switchPortalTab('map')" class="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-emerald-600/30 flex items-center gap-2">
                                                        <i class="fa-solid fa-map-location-dot"></i> ${lang === 'bn' ? 'লাইভ স্যাটেলাইট ম্যাপ দেখুন' : 'Explore Live GIS Map'}
                                                    </button>
                                                    <button type="button" onclick="window.switchPortalTab('emergency')" class="px-5 py-2.5 bg-red-600/80 hover:bg-red-600 text-white border border-red-500/50 rounded-xl text-xs font-bold transition flex items-center gap-2">
                                                        <i class="fa-solid fa-shield-halved"></i> ${lang === 'bn' ? 'জরুরি পুলিশ থানা' : 'Emergency Police'}
                                                    </button>
                                                    <button type="button" onclick="window.switchPortalTab('gallery')" class="px-5 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-2">
                                                        <i class="fa-solid fa-images text-teal-400"></i> ${lang === 'bn' ? 'জমি ও জরিপ চিত্রশালা' : 'Photo Gallery'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>

                            <!-- Carousel Navigation Controls -->
                            <div class="absolute bottom-5 right-6 z-20 flex items-center gap-3">
                                <button type="button" onclick="window.prevHeroSlide()" class="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-emerald-600 text-white flex items-center justify-center border border-slate-700 transition">
                                    <i class="fa-solid fa-chevron-left text-xs"></i>
                                </button>
                                <div class="flex items-center gap-1.5">
                                    ${slides.map((_, i) => `
                                        <button type="button" onclick="window.gotoHeroSlide(${i})" class="slide-indicator-dot w-2.5 h-2.5 rounded-full transition-all ${i === currentSlideIndex ? 'bg-emerald-400 w-6' : 'bg-slate-600 hover:bg-slate-400'}"></button>
                                    `).join('')}
                                </div>
                                <button type="button" onclick="window.nextHeroSlide()" class="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-emerald-600 text-white flex items-center justify-center border border-slate-700 transition">
                                    <i class="fa-solid fa-chevron-right text-xs"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Grid: Key Statistics & Landowner Fast-Access Terminal -->
                        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            
                            <!-- Left: Key KPI Metrics & Quick Feature Shortcuts -->
                            <div class="lg:col-span-7 space-y-6">
                                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <div class="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl hover:border-emerald-500/50 transition">
                                        <div class="text-2xl font-black text-emerald-400">${stats.totalPlots}</div>
                                        <div class="text-[11px] text-slate-400 font-bold uppercase mt-0.5">${GeoTerraStore.t('totalPlots')}</div>
                                    </div>
                                    <div class="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl hover:border-emerald-500/50 transition">
                                        <div class="text-2xl font-black text-teal-400">${stats.totalAreaDecimals} <span class="text-xs font-normal">Dec</span></div>
                                        <div class="text-[11px] text-slate-400 font-bold uppercase mt-0.5">${GeoTerraStore.t('totalArea')}</div>
                                    </div>
                                    <div class="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl hover:border-emerald-500/50 transition">
                                        <div class="text-2xl font-black text-blue-400">${stats.verifiedCount}</div>
                                        <div class="text-[11px] text-slate-400 font-bold uppercase mt-0.5">${GeoTerraStore.t('fullyVerified')}</div>
                                    </div>
                                    <div class="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl hover:border-emerald-500/50 transition">
                                        <div class="text-2xl font-black text-amber-400">64</div>
                                        <div class="text-[11px] text-slate-400 font-bold uppercase mt-0.5">${lang === 'bn' ? 'সকল জেলা পুলিশ' : 'All Police ST'}</div>
                                    </div>
                                </div>

                                <!-- Feature Highlight Cards -->
                                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div onclick="window.switchPortalTab('map')" class="cursor-pointer bg-gradient-to-br from-emerald-950/70 to-slate-900 p-4 rounded-2xl border border-emerald-800/40 hover:border-emerald-500 transition group">
                                        <div class="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                                            <i class="fa-solid fa-map-location-dot"></i>
                                        </div>
                                        <h4 class="text-white font-bold text-sm">${lang === 'bn' ? 'লাইভ স্যাটেলাইট ম্যাপ' : 'GIS Satellite Map'}</h4>
                                        <p class="text-slate-400 text-xs mt-1 leading-relaxed">${lang === 'bn' ? 'জমির দাগ, সীমানা ও জিপিএস আরটিকে স্থানাঙ্ক পরীক্ষা।' : 'Visual cadastral boundary plots with real satellite overlays.'}</p>
                                    </div>

                                    <div onclick="window.switchPortalTab('emergency')" class="cursor-pointer bg-gradient-to-br from-red-950/70 to-slate-900 p-4 rounded-2xl border border-red-800/40 hover:border-red-500 transition group">
                                        <div class="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                                            <i class="fa-solid fa-shield-halved"></i>
                                        </div>
                                        <h4 class="text-white font-bold text-sm">${lang === 'bn' ? 'সকল জেলার পুলিশ থানা' : 'All Police Stations'}</h4>
                                        <p class="text-slate-400 text-xs mt-1 leading-relaxed">${lang === 'bn' ? '৬৪ জেলার থানা ও ওসির নম্বরে সরাসরি ১-ক্লিকে ফোন কল।' : 'Direct calling directory for all district SPs & Thana OCs.'}</p>
                                    </div>

                                    <div onclick="window.switchPortalTab('gallery')" class="cursor-pointer bg-gradient-to-br from-teal-950/70 to-slate-900 p-4 rounded-2xl border border-teal-800/40 hover:border-teal-500 transition group">
                                        <div class="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                                            <i class="fa-solid fa-images"></i>
                                        </div>
                                        <h4 class="text-white font-bold text-sm">${lang === 'bn' ? 'জমি ও জরিপ চিত্রশালা' : 'Cadastral Gallery'}</h4>
                                        <p class="text-slate-400 text-xs mt-1 leading-relaxed">${lang === 'bn' ? 'কৃষিজমি, চা বাগান ও ড্রোন জরিপের এইচডি ফটোগ্রাফি।' : 'High-definition farmland and drone survey photo showcase.'}</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Right: Landowner Sign-In Terminal & 10 Quick-Accounts -->
                            <div class="lg:col-span-5">
                                <div class="bg-slate-900 border border-slate-800 p-6 sm:p-7 rounded-3xl shadow-xl backdrop-blur-md">
                                    <div class="mb-5">
                                        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                                            <i class="fa-solid fa-shield-check"></i> High-Security Access
                                        </span>
                                        <h3 class="text-lg font-black text-white">${GeoTerraStore.t('loginTitle')}</h3>
                                        <p class="text-xs text-slate-400 mt-1">${GeoTerraStore.t('loginSub')}</p>
                                    </div>

                                    ${isUserLocked ? `
                                        <div id="user-lockout-alert-box" class="mb-5 p-4 bg-red-950/80 border border-red-500/50 rounded-2xl text-xs text-red-200 space-y-1.5 animate-shake">
                                            <div class="flex items-center gap-2 font-bold text-red-100">
                                                <i class="fa-solid fa-ban text-red-400 text-base"></i>
                                                <span>${lang === 'bn' ? 'অ্যাকাউন্ট সাময়িকভাবে লক করা হয়েছে!' : 'Security Lockout Active!'}</span>
                                            </div>
                                            <p class="text-[11px] text-red-300">
                                                ${lang === 'bn' ? 'পরপর ৩ বার ভুল পাসওয়ার্ড দেওয়ায় ৫ মিনিটের জন্য লগইন স্থগিত রয়েছে।' : 'Multiple failed attempts. Access is locked for 5 minutes.'}
                                            </p>
                                            <div class="pt-1 flex items-center gap-2 text-xs font-mono text-red-400">
                                                <span>${lang === 'bn' ? 'অবশিষ্ট সময়:' : 'Remaining:'}</span>
                                                <span id="user-lockout-countdown" class="font-bold bg-red-950 px-2 py-0.5 rounded border border-red-800">${userLockState.remainingSeconds}s</span>
                                            </div>
                                        </div>
                                    ` : (userLockState.failedAttempts > 0 ? `
                                        <div class="mb-4 p-2.5 bg-amber-950/60 border border-amber-500/40 rounded-xl text-[11px] text-amber-300 flex items-center gap-2">
                                            <i class="fa-solid fa-triangle-exclamation text-amber-400"></i>
                                            <span>${lang === 'bn' ? `সতর্কতা: ${userLockState.failedAttempts}/৩ ব্যর্থ প্রচেষ্টা।` : `Notice: ${userLockState.failedAttempts}/3 failed attempts.`}</span>
                                        </div>
                                    ` : '')}

                                    <form id="public-login-form" class="space-y-4">
                                        <input type="text" name="user_trap_auth" style="position:absolute;left:-9999px;opacity:0" tabindex="-1" autocomplete="off">

                                        <div>
                                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">${GeoTerraStore.t('username')}</label>
                                            <div class="relative">
                                                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                                                    <i class="fa-solid fa-user text-sm"></i>
                                                </span>
                                                <input type="text" id="user-login-username" name="username" required placeholder="e.g., akmjobayer" ${isUserLocked ? 'disabled' : ''}
                                                    class="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm disabled:opacity-50">
                                            </div>
                                        </div>

                                        <div>
                                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">${GeoTerraStore.t('password')}</label>
                                            <div class="relative">
                                                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                                                    <i class="fa-solid fa-lock text-sm"></i>
                                                </span>
                                                <input type="password" id="user-login-password" name="password" required placeholder="Default: 123" ${isUserLocked ? 'disabled' : ''}
                                                    class="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm disabled:opacity-50">
                                                <button type="button" onclick="window.toggleUserPasswordVisibility()" class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300">
                                                    <i class="fa-solid fa-eye text-xs" id="user-password-eye"></i>
                                                </button>
                                            </div>
                                        </div>

                                        <!-- Robot Verification Challenge -->
                                        <div id="user-robot-verification-card" class="bg-slate-950/90 border border-slate-800 rounded-2xl p-3.5 transition-all">
                                            <div id="user-robot-checkbox-btn" onclick="window.toggleUserRobotChallenge()" class="flex items-center justify-between cursor-pointer select-none">
                                                <div class="flex items-center gap-3">
                                                    <div id="user-robot-check-box" class="w-6 h-6 rounded-lg border-2 ${isUserRobotVerified ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' : 'border-slate-600 bg-slate-900'} flex items-center justify-center transition">
                                                        <i id="user-robot-check-icon" class="fa-solid fa-check text-xs ${isUserRobotVerified ? 'text-emerald-400' : 'text-transparent'}"></i>
                                                    </div>
                                                    <div>
                                                        <span id="user-robot-check-label" class="text-xs font-bold ${isUserRobotVerified ? 'text-emerald-400' : 'text-slate-200'}">
                                                            ${isUserRobotVerified ? (lang === 'bn' ? '✓ মানুষ যাচাই সম্পন্ন (রোবট মুক্ত)' : '✓ Human Verified') : (lang === 'bn' ? 'আমি রোবট নই (রোবট যাচাই)' : "I'm not a robot")}
                                                        </span>
                                                        <span class="block text-[10px] text-slate-500 font-mono">Anti-Bot AI Security Challenge</span>
                                                    </div>
                                                </div>
                                                <div class="text-right">
                                                    <i class="fa-solid fa-robot text-lg ${isUserRobotVerified ? 'text-emerald-400' : 'text-slate-600'}"></i>
                                                </div>
                                            </div>

                                            <div id="user-robot-challenge-box" class="hidden mt-3 pt-3 border-t border-slate-800/80 space-y-2.5">
                                                <div class="flex items-center gap-2">
                                                    <canvas id="user-robot-captcha-canvas" width="180" height="44" class="rounded-xl border border-slate-700 bg-slate-950 shrink-0"></canvas>
                                                    <button type="button" onclick="window.refreshUserRobotCaptcha()" title="New Code" class="h-10 w-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 flex items-center justify-center border border-slate-700 transition shrink-0">
                                                        <i class="fa-solid fa-rotate-right text-xs"></i>
                                                    </button>
                                                </div>
                                                <div class="flex gap-2">
                                                    <input type="text" id="user-robot-captcha-input" placeholder="Enter code" class="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono uppercase tracking-widest focus:outline-none focus:border-emerald-500">
                                                    <button type="button" onclick="window.verifyUserRobotCaptcha()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition">Verify</button>
                                                </div>
                                            </div>
                                        </div>

                                        <button type="submit" ${isUserLocked ? 'disabled' : ''} class="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2">
                                            <i class="fa-solid fa-right-to-bracket"></i>
                                            <span>${GeoTerraStore.t('enterPortal')}</span>
                                        </button>
                                    </form>

                                    <!-- 10 Pre-configured Accounts Instant 1-Click Fast Switch -->
                                    <div class="mt-6 pt-5 border-t border-slate-800">
                                        <div class="flex justify-between items-center mb-2">
                                            <span class="text-xs font-bold text-slate-300 uppercase tracking-wide">
                                                ${GeoTerraStore.t('presetUsers')}
                                            </span>
                                            <span class="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-mono font-bold">
                                                PASS: 123
                                            </span>
                                        </div>
                                        <p class="text-[11px] text-slate-400 mb-2">${GeoTerraStore.t('clickToLogin')}</p>
                                        <div class="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
                                            ${users.map(u => `
                                                <button type="button" data-quick-user="${escapeHtml(u.username)}" class="btn-quick-login flex items-center gap-2 p-2 rounded-xl bg-slate-950/80 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-500/50 text-left transition group">
                                                    <img src="${escapeHtml(u.avatar)}" class="w-7 h-7 rounded-lg object-cover border border-slate-700">
                                                    <div class="overflow-hidden min-w-0">
                                                        <div class="text-xs font-bold text-slate-200 group-hover:text-emerald-400 truncate">${escapeHtml(lang === 'bn' ? (u.fullNameBn || u.username) : u.username)}</div>
                                                        <div class="text-[10px] text-slate-400 truncate">${escapeHtml(lang === 'bn' ? (u.districtBn || u.district) : u.district)}</div>
                                                    </div>
                                                </button>
                                            `).join('')}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                <!-- Featured Cadastral Plots Preview Section -->
                <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            <h2 class="text-2xl font-black text-slate-900">${lang === 'bn' ? 'জাতীয় ক্যাডাস্ট্রাল ভূমি রেকর্ড ডিরেক্টরি' : 'National Cadastral Land Directory'}</h2>
                            <p class="text-xs text-slate-500">${lang === 'bn' ? 'দাগ নম্বর, মৌজা ও জিপিএস স্থানাঙ্ক অনুযায়ী প্লটের সার্বিক তথ্য অনুসন্ধান করুন' : 'Live search registered DAG numbers, mouzas, and verified parcels across Bangladesh'}</p>
                        </div>
                        <div class="flex items-center gap-3 w-full sm:w-auto">
                            <button type="button" onclick="window.switchPortalTab('map')" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5 whitespace-nowrap">
                                <i class="fa-solid fa-map-location-dot"></i> ${lang === 'bn' ? 'ম্যাপে সবগুলো প্লট দেখুন' : 'View All on Map'}
                            </button>
                        </div>
                    </div>

                    <div id="public-plots-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${renderPublicPlotsCards('', lang)}
                    </div>
                </section>
            </div>
        `;
    }

    // --- Standalone Tab: All Registered Plots Directory ---
    function renderLandsStandaloneTab(lang) {
        return `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
                <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                            <i class="fa-solid fa-layer-group"></i> Cadastral Directory 2026
                        </div>
                        <h2 class="text-2xl font-black text-slate-900">${lang === 'bn' ? 'সকল জরিপকৃত জমির খতিয়ান ও দাগ তালিকা' : 'Registered Land Parcels & Cadastral Records'}</h2>
                        <p class="text-xs text-slate-500 mt-1">${lang === 'bn' ? 'সারাদেশের সকল বিভাগের জমির মালিকানা, ফসল ও থানা ক্লিয়ারেন্স তথ্য' : 'Search and inspect land parcels across all divisions with official clearances'}</p>
                    </div>

                    <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <div class="relative flex-1 md:w-72">
                            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                <i class="fa-solid fa-magnifying-glass text-xs"></i>
                            </span>
                            <input type="text" id="standalone-plots-search" oninput="window.handleStandalonePlotsSearch(this.value)" placeholder="${GeoTerraStore.t('searchPlaceholder')}" 
                                class="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50">
                        </div>
                        <button type="button" onclick="window.switchPortalTab('map')" class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap shadow-xs">
                            <i class="fa-solid fa-map-location-dot text-emerald-400"></i> ${lang === 'bn' ? 'লাইভ ম্যাপে দেখুন' : 'Inspect on Map'}
                        </button>
                    </div>
                </div>

                <div id="standalone-plots-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${renderPublicPlotsCards('', lang)}
                </div>
            </div>
        `;
    }

    window.handleStandalonePlotsSearch = function (query) {
        const grid = document.getElementById('standalone-plots-grid');
        if (grid) {
            const lang = GeoTerraStore.getLanguage();
            grid.innerHTML = renderPublicPlotsCards(query.trim(), lang);
        }
    };

    // --- Standalone Tab: 10 Landowners Directory ---
    function renderDirectoryStandaloneTab(lang) {
        const users = GeoTerraStore.getAllUsers();
        return `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
                <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                            <i class="fa-solid fa-users"></i> Landowners Registry
                        </div>
                        <h2 class="text-2xl font-black text-slate-900">${lang === 'bn' ? '১০ জন ভূমির মালিক ও সার্ভেয়ার ডিরেক্টরি' : '10 Pre-configured Landowners & Surveyors'}</h2>
                        <p class="text-xs text-slate-500 mt-1">${lang === 'bn' ? 'যেকোনো একাউন্টে ক্লিক করে তাৎক্ষণিক ১-ক্লিকে সুইচ বা লগইন করুন' : 'Instant 1-click switch into any registered landowner profile'}</p>
                    </div>
                    <div class="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-mono font-bold border border-slate-200">
                        ${lang === 'bn' ? 'ডিফল্ট পাসওয়ার্ড: 123' : 'Default Password: 123'}
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    ${users.map(u => {
                        const userPlots = GeoTerraStore.getLandsByUser(u.username);
                        return `
                            <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-500 transition card-hover-effect flex flex-col justify-between">
                                <div class="flex items-start gap-4">
                                    <img src="${escapeHtml(u.avatar)}" class="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-xs shrink-0">
                                    <div class="min-w-0 flex-1">
                                        <div class="flex items-center justify-between">
                                            <h4 class="font-bold text-slate-900 text-sm truncate">${escapeHtml(lang === 'bn' ? (u.fullNameBn || u.fullName) : u.fullName)}</h4>
                                            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">${escapeHtml(u.status || 'Active')}</span>
                                        </div>
                                        <p class="text-xs text-emerald-700 font-semibold truncate">${escapeHtml(lang === 'bn' ? (u.roleBn || u.role) : u.role)}</p>
                                        <div class="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                                            <i class="fa-solid fa-location-dot text-emerald-600"></i> ${escapeHtml(lang === 'bn' ? (u.districtBn || u.district) : u.district)}
                                        </div>
                                        <div class="text-[11px] text-slate-400 font-mono mt-0.5 truncate">User: <strong class="text-slate-700">${escapeHtml(u.username)}</strong></div>
                                    </div>
                                </div>

                                <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                    <span class="text-slate-600 font-semibold">
                                        <i class="fa-solid fa-map-pin text-emerald-500 mr-1"></i> ${userPlots.length} Plots
                                    </span>
                                    <button type="button" onclick="window.switchUserAccount('${escapeHtml(u.username)}')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs">
                                        <i class="fa-solid fa-right-to-bracket"></i> ${lang === 'bn' ? '১-ক্লিক লগইন' : '1-Click Login'}
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    // --- Core Feature 1: Real Interactive Leaflet GIS Satellite Land Map ---
    function renderLiveMapTab(lang) {
        const stats = GeoTerraStore.getStats();
        return `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
                
                <!-- Map Header & Filter Toolbar -->
                <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold uppercase tracking-wider mb-1.5">
                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                GIS Satellite RTK Land Mapping
                            </div>
                            <h2 class="text-2xl font-black text-slate-900">${lang === 'bn' ? 'জিআইএস লাইভ স্যাটেলাইট ভূমি ম্যাপ' : 'GIS Live Satellite Land Map'}</h2>
                            <p class="text-xs text-slate-500">${lang === 'bn' ? 'সারাদেশের সকল জেলার নিবন্ধিত জমির অবস্থান, সীমানা ও ফসল স্যাটেলাইটে পর্যবেক্ষণ করুন।' : 'High-resolution cadastral plot visualizer with GPS boundary polygons across Bangladesh.'}</p>
                        </div>

                        <!-- Statistics Badges -->
                        <div class="flex items-center gap-2">
                            <span class="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-xs">
                                <i class="fa-solid fa-map text-emerald-400"></i> ${stats.totalPlots} ${lang === 'bn' ? 'টি প্লট' : 'Plots'}
                            </span>
                            <span class="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-mono text-xs font-bold flex items-center gap-1.5">
                                <i class="fa-solid fa-crosshairs text-emerald-600"></i> ${stats.totalAreaDecimals} Decimals
                            </span>
                        </div>
                    </div>

                    <!-- Interactive Map Control Tools Bar -->
                    <div class="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                        <!-- District Filter -->
                        <div>
                            <label class="block text-[10px] uppercase font-bold text-slate-400 mb-1">${lang === 'bn' ? 'জেলা অনুযায়ী ফিল্টার' : 'Filter by District'}</label>
                            <select id="map-district-select" onchange="window.filterMapDistrict(this.value)" class="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                <option value="all">${lang === 'bn' ? 'সকল জেলা (সমগ্র বাংলাদেশ)' : 'All Districts (Bangladesh)'}</option>
                                <option value="Dhaka">Dhaka (ঢাকা)</option>
                                <option value="Gazipur">Gazipur (গাজীপুর)</option>
                                <option value="Chittagong">Chittagong (চট্টগ্রাম)</option>
                                <option value="Sylhet">Sylhet (সিলেট)</option>
                                <option value="Comilla">Comilla (কুমিল্লা)</option>
                                <option value="Rajshahi">Rajshahi (রাজশাহী)</option>
                                <option value="Khulna">Khulna (খুলনা)</option>
                                <option value="Bogra">Bogra (বগুড়া)</option>
                                <option value="Barisal">Barisal (বরিশাল)</option>
                                <option value="Mymensingh">Mymensingh (ময়মনসিংহ)</option>
                            </select>
                        </div>

                        <!-- Status Filter -->
                        <div>
                            <label class="block text-[10px] uppercase font-bold text-slate-400 mb-1">${lang === 'bn' ? 'ক্লিয়ারেন্স স্ট্যাটাস' : 'Verification Status'}</label>
                            <select id="map-status-select" onchange="window.filterMapStatus(this.value)" class="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                <option value="all">${lang === 'bn' ? 'সকল স্ট্যাটাস' : 'All Verification States'}</option>
                                <option value="Approved">${lang === 'bn' ? 'পুলিশ অনুমোদিত ও ক্লিয়ার্ড' : 'Approved & Cleared'}</option>
                                <option value="Pending">${lang === 'bn' ? 'অপেক্ষমান ক্লিয়ারেন্স' : 'Pending Clearance'}</option>
                            </select>
                        </div>

                        <!-- Quick City Jump Buttons -->
                        <div class="sm:col-span-2 flex items-end gap-1.5 flex-wrap">
                            <span class="text-[10px] uppercase font-bold text-slate-400 block w-full">${lang === 'bn' ? 'দ্রুত লোকেশনে যান' : 'Quick Jump to City'}</span>
                            <button type="button" onclick="window.flyMapToLocation(23.6850, 90.3563, 7)" class="px-2.5 py-1.5 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 rounded-lg text-slate-700 font-bold transition">
                                🇧🇩 Bangladesh
                            </button>
                            <button type="button" onclick="window.flyMapToLocation(23.8103, 90.4125, 12)" class="px-2.5 py-1.5 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 rounded-lg text-slate-700 font-bold transition">
                                Dhaka
                            </button>
                            <button type="button" onclick="window.flyMapToLocation(22.3569, 91.7832, 12)" class="px-2.5 py-1.5 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 rounded-lg text-slate-700 font-bold transition">
                                Chittagong
                            </button>
                            <button type="button" onclick="window.flyMapToLocation(24.8949, 91.8687, 12)" class="px-2.5 py-1.5 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 rounded-lg text-slate-700 font-bold transition">
                                Sylhet
                            </button>
                            <button type="button" onclick="window.flyMapToLocation(24.3745, 88.6042, 12)" class="px-2.5 py-1.5 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 rounded-lg text-slate-700 font-bold transition">
                                Rajshahi
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Leaflet Interactive Map Container -->
                <div class="relative bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
                    <div id="gis-interactive-leaflet-map" style="height: 640px; width: 100%; z-index: 10;" class="relative">
                        <!-- Fallback / Loading Spinner -->
                        <div class="absolute inset-0 flex items-center justify-center bg-slate-950 text-white">
                            <div class="text-center space-y-3">
                                <div class="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                <p class="text-xs font-mono text-emerald-400">Calibrating Geodetic Satellite Sensors...</p>
                            </div>
                        </div>
                    </div>

                    <!-- Map Legend Overlay -->
                    <div class="absolute bottom-4 left-4 z-20 bg-slate-950/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800 text-[11px] text-white space-y-1.5 shadow-xl font-mono hidden sm:block">
                        <div class="text-slate-400 font-bold text-[10px] uppercase tracking-wider mb-1">Plot Verification Legend</div>
                        <div class="flex items-center gap-2">
                            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                            <span>Police Approved & Cleared</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                            <span>Pending Station Clearance</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                            <span>Disputed Boundary</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // --- Leaflet Engine Initialization ---
    function initLeafletInteractiveMap(lang, focusPlotId = null) {
        const container = document.getElementById('gis-interactive-leaflet-map');
        if (!container) return;

        if (typeof L === 'undefined') {
            container.innerHTML = `
                <div class="h-full flex items-center justify-center p-8 bg-slate-900 text-white text-center">
                    <div>
                        <i class="fa-solid fa-triangle-exclamation text-4xl text-amber-400 mb-3"></i>
                        <p class="font-bold text-sm">Leaflet GIS Engine Loading...</p>
                    </div>
                </div>
            `;
            return;
        }

        // Clean previous instance if existing
        if (window._currentLeafletMapInstance) {
            try {
                window._currentLeafletMapInstance.remove();
            } catch (e) {}
            window._currentLeafletMapInstance = null;
        }

        const defaultCenter = [23.6850, 90.3563];
        const map = L.map('gis-interactive-leaflet-map', {
            center: defaultCenter,
            zoom: 7,
            scrollWheelZoom: true
        });
        window._currentLeafletMapInstance = map;

        // Tile Layers (High-Res Satellite Esri & OpenStreetMap Street)
        const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 19,
            attribution: 'Tiles © Esri, Maxar, Earthstar Geographics'
        });

        const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        });

        // Default to Satellite View
        satelliteLayer.addTo(map);

        const baseMaps = {
            "🛰️ Satellite HD (Esri)": satelliteLayer,
            "🗺️ Street Map (OSM)": streetLayer
        };
        L.control.layers(baseMaps).addTo(map);
        L.control.scale({ imperial: false }).addTo(map);

        // Fetch plots and apply filters
        let plots = GeoTerraStore.getAllLands();
        if (mapDistrictFilter && mapDistrictFilter !== 'all') {
            plots = plots.filter(p => p.district && p.district.toLowerCase().includes(mapDistrictFilter.toLowerCase()));
        }
        if (mapStatusFilter && mapStatusFilter !== 'all') {
            plots = plots.filter(p => p.policeVerification && p.policeVerification.toLowerCase().includes(mapStatusFilter.toLowerCase()));
        }

        const markerGroup = L.featureGroup();

        plots.forEach(plot => {
            const coords = parseLatLong(plot.coordinates);
            if (!coords) return;

            const isApproved = plot.policeVerification && plot.policeVerification.includes('Approved');
            const isPending = plot.policeVerification && plot.policeVerification.includes('Pending');
            const pinColor = isApproved ? '#10b981' : (isPending ? '#f59e0b' : '#ef4444');

            // Custom pulsing SVG HTML Icon
            const iconHtml = `
                <div style="position:relative; width:34px; height:34px; display:flex; align-items:center; justify-content:center;">
                    <div style="position:absolute; inset:0; border-radius:50%; background:${pinColor}; opacity:0.3; animation:pulse-ring 2s infinite;"></div>
                    <div style="width:26px; height:26px; border-radius:50%; background:${pinColor}; color:#fff; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(0,0,0,0.5); border:2px solid #ffffff; font-size:12px;">
                        <i class="fa-solid fa-location-dot"></i>
                    </div>
                </div>
            `;
            const customIcon = L.divIcon({
                html: iconHtml,
                className: 'custom-land-pin',
                iconSize: [34, 34],
                iconAnchor: [17, 34],
                popupAnchor: [0, -32]
            });

            // Cadastral Polygon Demarcation
            const lat = coords.lat;
            const lng = coords.lng;
            const offset = 0.0016;
            const polygonCoords = [
                [lat + offset, lng - offset],
                [lat + offset * 0.9, lng + offset * 1.2],
                [lat - offset * 0.8, lng + offset * 1.1],
                [lat - offset * 1.1, lng - offset * 0.9]
            ];
            const polygon = L.polygon(polygonCoords, {
                color: pinColor,
                weight: 2,
                opacity: 0.85,
                fillColor: pinColor,
                fillOpacity: 0.18,
                dashArray: isApproved ? null : '5, 5'
            });
            polygon.addTo(markerGroup);

            // Rich interactive Popup
            const popupContent = `
                <div style="min-width:240px; max-width:280px; font-family:Inter,sans-serif; padding:2px;">
                    <div style="position:relative; height:110px; border-radius:10px; overflow:hidden; margin-bottom:8px;">
                        <img src="${plot.landImage}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80'">
                        <span style="position:absolute; top:6px; left:6px; background:rgba(15,23,42,0.9); color:#fff; padding:2px 8px; border-radius:6px; font-family:monospace; font-size:11px; font-weight:bold;">
                            ${escapeHtml(plot.landNumber)}
                        </span>
                        <span style="position:absolute; top:6px; right:6px; background:#16a34a; color:#fff; padding:2px 7px; border-radius:6px; font-size:10px; font-weight:bold;">
                            ${escapeHtml(lang === 'bn' ? (plot.areaBn || plot.area) : plot.area)}
                        </span>
                    </div>
                    <div style="font-size:12px; font-weight:bold; color:#0f172a; margin-bottom:4px;">
                        ${escapeHtml(lang === 'bn' ? (plot.mouzaBn || plot.mouza) : plot.mouza)}
                    </div>
                    <div style="font-size:11px; color:#475569; margin-bottom:3px;">
                        <strong>${lang === 'bn' ? 'মালিক:' : 'Owner:'}</strong> ${escapeHtml(lang === 'bn' ? (plot.ownerNameBn || plot.ownerName) : plot.ownerName)} (${escapeHtml(plot.district)})
                    </div>
                    <div style="font-size:11px; color:#166534; font-weight:bold; margin-bottom:3px;">
                        <strong>${lang === 'bn' ? 'ফসল:' : 'Crop:'}</strong> ${escapeHtml(lang === 'bn' ? (plot.currentCropBn || plot.currentCrop) : plot.currentCrop)}
                    </div>
                    <div style="margin-bottom:8px;">
                        <span style="display:inline-block; font-size:10px; font-weight:bold; padding:2px 6px; border-radius:4px; ${isApproved ? 'background:#dcfce7; color:#15803d;' : 'background:#fef3c7; color:#b45309;'}">
                            ${escapeHtml(plot.policeVerification)}
                        </span>
                    </div>
                    <div style="display:flex; gap:6px;">
                        <button type="button" onclick="window.openGISModal('${escapeHtml(plot.id)}')" style="flex:1; padding:6px; background:#0f172a; color:#fff; border:none; border-radius:8px; font-size:11px; font-weight:bold; cursor:pointer;">
                            <i class="fa-solid fa-satellite"></i> GIS Details
                        </button>
                        <button type="button" onclick="window.switchPortalTab('emergency')" style="flex:1; padding:6px; background:#dc2626; color:#fff; border:none; border-radius:8px; font-size:11px; font-weight:bold; cursor:pointer;">
                            <i class="fa-solid fa-phone"></i> Police
                        </button>
                    </div>
                </div>
            `;

            const marker = L.marker([lat, lng], { icon: customIcon });
            marker.bindPopup(popupContent);
            marker.addTo(markerGroup);

            if (focusPlotId && plot.id === focusPlotId) {
                setTimeout(() => {
                    map.flyTo([lat, lng], 14, { duration: 1.5 });
                    marker.openPopup();
                }, 400);
            }
        });

        markerGroup.addTo(map);

        if (!focusPlotId && plots.length > 0) {
            try {
                map.fitBounds(markerGroup.getBounds().pad(0.15));
            } catch (e) {
                map.setView(defaultCenter, 7);
            }
        }
    }

    window.filterMapDistrict = function (dist) {
        mapDistrictFilter = dist;
        focusedMapPlotId = null;
        initLeafletInteractiveMap(GeoTerraStore.getLanguage());
    };

    window.filterMapStatus = function (status) {
        mapStatusFilter = status;
        focusedMapPlotId = null;
        initLeafletInteractiveMap(GeoTerraStore.getLanguage());
    };

    window.flyMapToLocation = function (lat, lng, zoom) {
        if (window._currentLeafletMapInstance) {
            window._currentLeafletMapInstance.flyTo([lat, lng], zoom, { duration: 1.2 });
        }
    };

    window.viewPlotOnMap = function (plotId) {
        focusedMapPlotId = plotId;
        currentTab = 'map';
        renderPortal();
    };

    // --- Core Feature 2: All-Districts Emergency Police Service with 1-Click Calling ---
    function renderEmergencyTab(lang) {
        const hotlines = GeoTerraStore.getEmergencyHotlines();
        const stations = GeoTerraStore.getPoliceStations({
            division: emergencyDivisionFilter,
            district: emergencyDistrictFilter,
            query: emergencySearchQuery
        });

        const divisions = [
            { key: 'all', nameEn: 'All Divisions', nameBn: 'সকল বিভাগ' },
            { key: 'Dhaka', nameEn: 'Dhaka', nameBn: 'ঢাকা বিভাগ' },
            { key: 'Chittagong', nameEn: 'Chittagong', nameBn: 'চট্টগ্রাম বিভাগ' },
            { key: 'Rajshahi', nameEn: 'Rajshahi', nameBn: 'রাজশাহী বিভাগ' },
            { key: 'Khulna', nameEn: 'Khulna', nameBn: 'খুলনা বিভাগ' },
            { key: 'Barisal', nameEn: 'Barisal', nameBn: 'বরিশাল বিভাগ' },
            { key: 'Sylhet', nameEn: 'Sylhet', nameBn: 'সিলেট বিভাগ' },
            { key: 'Rangpur', nameEn: 'Rangpur', nameBn: 'রংপুর বিভাগ' },
            { key: 'Mymensingh', nameEn: 'Mymensingh', nameBn: 'ময়মনসিংহ বিভাগ' }
        ];

        return `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
                
                <!-- National Emergency Hotlines Banner -->
                <div class="bg-gradient-to-r from-red-950 via-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl border border-red-800/40 shadow-xl text-white">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                                <i class="fa-solid fa-tower-broadcast text-red-400"></i>
                                24/7 National Emergency Bureau
                            </div>
                            <h2 class="text-2xl sm:text-3xl font-black text-white">${lang === 'bn' ? 'জরুরি পুলিশ ও থানা ডিরেক্টরি (১-ক্লিক কল)' : 'Emergency Police & Hotlines Calling Service'}</h2>
                            <p class="text-xs text-slate-300 mt-1 max-w-2xl">${lang === 'bn' ? 'জমির দখল, সীমানা বিরোধ বা যেকোনো জরুরি মুহূর্তে ৬৪ জেলার থানা এবং ওসির সরকারি নম্বরে সরাসরি ফোন করুন।' : 'Direct 1-click calling directory for Bangladesh Police Headquarters, SP Offices, and Model Thana OCs across all 64 districts.'}</p>
                        </div>
                        <a href="tel:999" class="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-sm shadow-xl shadow-red-600/40 flex items-center gap-2.5 transition animate-pulse">
                            <i class="fa-solid fa-phone-volume text-lg"></i>
                            <span>${lang === 'bn' ? 'জরুরি ৯৯৯ কল করুন' : 'Dial 999 Hotline'}</span>
                        </a>
                    </div>

                    <!-- Hotlines Grid with 1-Click Call Buttons -->
                    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        ${hotlines.map(h => `
                            <a href="tel:${h.number}" class="bg-slate-900/90 hover:bg-red-950/80 border border-slate-800 hover:border-red-500/50 p-3.5 rounded-2xl flex flex-col justify-between transition group text-left shadow-xs">
                                <div class="flex justify-between items-center mb-2">
                                    <div class="w-8 h-8 rounded-xl ${h.color} flex items-center justify-center text-white text-xs group-hover:scale-110 transition">
                                        <i class="fa-solid ${h.icon}"></i>
                                    </div>
                                    <span class="text-xs text-red-400 font-bold group-hover:underline"><i class="fa-solid fa-phone text-[10px]"></i> Call</span>
                                </div>
                                <div class="font-black text-white text-base tracking-tight font-mono">${escapeHtml(h.number)}</div>
                                <div class="text-[10px] text-slate-400 mt-0.5 line-clamp-1 leading-tight">${escapeHtml(lang === 'bn' ? h.labelBn : h.labelEn)}</div>
                            </a>
                        `).join('')}
                    </div>
                </div>

                <!-- Division Filter & Real-Time Search Bar -->
                <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h3 class="font-black text-slate-900 text-lg flex items-center gap-2">
                                <i class="fa-solid fa-building-shield text-emerald-600"></i> ${lang === 'bn' ? 'সকল জেলা ও থানার পুলিশ স্টেশনসমূহ' : 'All District & Thana Police Stations'}
                            </h3>
                            <p class="text-xs text-slate-500">${lang === 'bn' ? `মোট ${stations.length} টি সক্রিয় থানা ও পুলিশ কন্ট্রোল অন্তর্ভুক্ত` : `Showing ${stations.length} official police stations and command centers`}</p>
                        </div>

                        <!-- Live Search Input -->
                        <div class="relative w-full md:w-80">
                            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                                <i class="fa-solid fa-magnifying-glass text-xs"></i>
                            </span>
                            <input type="text" id="emergency-search-input" value="${escapeHtml(emergencySearchQuery)}" 
                                oninput="window.handleEmergencySearch(this.value)" 
                                placeholder="${lang === 'bn' ? 'থানা, জেলা বা ফোন নম্বর খুঁজুন...' : 'Search Thana, District, OC or Phone...'}"
                                class="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-xs bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                        </div>
                    </div>

                    <!-- Division Filter Pills -->
                    <div class="pt-3 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1">
                        ${divisions.map(d => `
                            <button type="button" onclick="window.filterEmergencyDivision('${d.key}')" 
                                class="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${emergencyDivisionFilter === d.key ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}">
                                ${escapeHtml(lang === 'bn' ? d.nameBn : d.nameEn)}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- Police Stations Directory Cards Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    ${stations.length === 0 ? `
                        <div class="col-span-full bg-white p-12 text-center rounded-2xl border border-slate-200">
                            <i class="fa-solid fa-shield-slash text-4xl text-slate-300 mb-3"></i>
                            <h4 class="font-bold text-slate-700 text-sm">${lang === 'bn' ? 'কোনো পুলিশ স্টেশন খুঁজে পাওয়া যায়নি' : 'No Police Stations Match Your Search'}</h4>
                            <p class="text-xs text-slate-400 mt-1">${lang === 'bn' ? 'দয়া করে অন্য কোনো জেলা বা থানার নাম দিয়ে অনুসন্ধান করুন।' : 'Try searching another district name or phone number.'}</p>
                        </div>
                    ` : stations.map(p => `
                        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-red-500/50 transition card-hover-effect flex flex-col justify-between">
                            <div>
                                <div class="flex items-start justify-between gap-2 mb-2">
                                    <div class="flex items-center gap-2">
                                        <div class="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold shrink-0">
                                            <i class="fa-solid fa-shield-halved"></i>
                                        </div>
                                        <div>
                                            <h4 class="font-bold text-slate-900 text-sm leading-tight">${escapeHtml(lang === 'bn' ? (p.nameBn || p.name) : p.name)}</h4>
                                            <span class="text-[10px] text-slate-500 font-medium">${escapeHtml(p.type)}</span>
                                        </div>
                                    </div>
                                    <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold font-mono shrink-0">${escapeHtml(p.district)}</span>
                                </div>

                                <div class="text-[11px] text-slate-500 mb-3 flex items-center gap-1.5">
                                    <i class="fa-solid fa-location-dot text-emerald-600"></i> ${escapeHtml(p.address || p.district)}
                                </div>

                                <!-- Contact Details Box -->
                                <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs font-mono mb-4">
                                    <div class="flex justify-between items-center">
                                        <span class="text-slate-500 font-sans text-[11px]">${lang === 'bn' ? 'ভারপ্রাপ্ত কর্মকর্তা (ওসি):' : 'OC Mobile:'}</span>
                                        <span class="font-bold text-slate-800">${escapeHtml(p.phone)}</span>
                                    </div>
                                    ${p.dutyOfficer ? `
                                        <div class="flex justify-between items-center pt-1 border-t border-slate-200/60">
                                            <span class="text-slate-500 font-sans text-[11px]">${lang === 'bn' ? 'ডিউটি অফিসার:' : 'Duty Officer:'}</span>
                                            <span class="font-bold text-blue-700">${escapeHtml(p.dutyOfficer)}</span>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>

                            <!-- Direct 1-Click Call & Copy Action Buttons -->
                            <div class="flex items-center gap-2 pt-2 border-t border-slate-100">
                                <a href="tel:${p.phone}" class="flex-1 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-sm transition">
                                    <i class="fa-solid fa-phone"></i> ${lang === 'bn' ? 'ওসি কল' : 'Call OC'}
                                </a>
                                ${p.dutyOfficer ? `
                                    <a href="tel:${p.dutyOfficer}" class="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-sm transition">
                                        <i class="fa-solid fa-phone-volume"></i> ${lang === 'bn' ? 'ডিউটি অফিসার' : 'Duty Call'}
                                    </a>
                                ` : ''}
                                <button type="button" onclick="window.copyPoliceNumber('${escapeHtml(p.phone)}', '${escapeHtml(p.name)}')" title="Copy Phone Number" class="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition">
                                    <i class="fa-solid fa-copy text-xs"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    window.filterEmergencyDivision = function (div) {
        emergencyDivisionFilter = div;
        renderPortal();
    };

    window.handleEmergencySearch = function (q) {
        emergencySearchQuery = q;
        const lang = GeoTerraStore.getLanguage();
        const container = document.getElementById('app');
        if (container) {
            container.innerHTML = renderEmergencyTab(lang);
            const input = document.getElementById('emergency-search-input');
            if (input) {
                input.focus();
                input.setSelectionRange(input.value.length, input.value.length);
            }
        }
    };

    window.copyPoliceNumber = function (num, name) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(num);
        } else {
            const ta = document.createElement('textarea');
            ta.value = num;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            ta.remove();
        }
        GeoTerraStore.showToast('Number Copied', `${name} hotline (${num}) copied to clipboard!`, 'success');
    };

    // --- Core Feature 3: Cadastral & Land Photo Gallery with HD Lightbox ---
    function renderGalleryTab(lang) {
        const photos = GeoTerraStore.getGalleryPhotos(galleryCategoryFilter);
        const categories = [
            { key: 'all', nameEn: 'All Photos', nameBn: 'সকল ছবি' },
            { key: 'Agricultural', nameEn: 'Agricultural Lands', nameBn: 'কৃষিজমি' },
            { key: 'Survey', nameEn: 'Field RTK GPS Surveys', nameBn: 'মাঠ জরিপ ও আরটিকে' },
            { key: 'Aerial Drone', nameEn: 'Aerial Drone Mapping', nameBn: 'ড্রোন ম্যাপিং দৃশ্য' },
            { key: 'Tea Estate', nameEn: 'Tea Estates', nameBn: 'চা বাগান' },
            { key: 'Orchard', nameEn: 'Fruit Orchards', nameBn: 'ফলজ বাগান' },
            { key: 'Commercial', nameEn: 'Commercial & Greenhouse', nameBn: 'বাণিজ্যিক প্লট' }
        ];

        return `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
                
                <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                                <i class="fa-solid fa-images text-teal-600"></i> HD Cadastral Photo Documentation
                            </div>
                            <h2 class="text-2xl sm:text-3xl font-black text-slate-900">${lang === 'bn' ? 'জমি ও জরিপ চিত্রশালা (গ্যালারি)' : 'National Land & Survey Photo Gallery'}</h2>
                            <p class="text-xs text-slate-500 mt-1 max-w-2xl">${lang === 'bn' ? 'সারাদেশের অনুমোদিত কৃষিজমি, চা বাগান, আরটিকে জিপিএস জরিপ এবং ড্রোন ম্যাপিংয়ের আলোকচিত্র।' : 'High-definition photogrammetry documentation of surveyed parcels, RTK rovers, drone flights, and crop landscapes.'}</p>
                        </div>
                        <span class="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-mono font-bold rounded-xl border border-slate-200">
                            ${photos.length} ${lang === 'bn' ? 'টি ছবি প্রদর্শিত' : 'Photos Available'}
                        </span>
                    </div>

                    <!-- Category Pills -->
                    <div class="pt-3 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1">
                        ${categories.map(c => `
                            <button type="button" onclick="window.filterGalleryCategory('${c.key}')" 
                                class="px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${galleryCategoryFilter === c.key ? 'bg-teal-700 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}">
                                ${escapeHtml(lang === 'bn' ? c.nameBn : c.nameEn)}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- Gallery Cards Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${photos.map(p => `
                        <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:border-teal-500/50 transition group card-hover-effect flex flex-col justify-between">
                            <div>
                                <div class="relative h-60 bg-slate-900 overflow-hidden cursor-pointer" onclick="window.openGalleryLightbox('${p.id}')">
                                    <img src="${p.image}" alt="${escapeHtml(p.titleEn)}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition"></div>
                                    <span class="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-teal-300 px-3 py-1 rounded-xl text-[10px] font-bold font-mono uppercase">
                                        ${escapeHtml(lang === 'bn' ? (p.categoryBn || p.category) : p.category)}
                                    </span>
                                    <div class="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/90 text-slate-900 flex items-center justify-center text-xs shadow-md group-hover:bg-teal-600 group-hover:text-white transition">
                                        <i class="fa-solid fa-magnifying-glass-plus"></i>
                                    </div>
                                </div>
                                <div class="p-5 space-y-2">
                                    <h4 class="font-bold text-slate-900 text-base leading-snug group-hover:text-teal-700 transition">${escapeHtml(lang === 'bn' ? p.titleBn : p.titleEn)}</h4>
                                    <div class="text-xs text-slate-500 flex items-center gap-1.5">
                                        <i class="fa-solid fa-location-dot text-emerald-600"></i>
                                        <span>${escapeHtml(lang === 'bn' ? (p.locationBn || p.location) : p.location)}</span>
                                    </div>
                                    <p class="text-xs text-slate-600 leading-relaxed pt-1">${escapeHtml(lang === 'bn' ? p.descriptionBn : p.descriptionEn)}</p>
                                </div>
                            </div>
                            <div class="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs">
                                <button type="button" onclick="window.switchPortalTab('map')" class="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
                                    <i class="fa-solid fa-map-location-dot"></i> ${lang === 'bn' ? 'ম্যাপে দাগ দেখুন' : 'Inspect Plot on Map'}
                                </button>
                                <button type="button" onclick="window.openGalleryLightbox('${p.id}')" class="font-bold text-teal-700 hover:text-teal-800">
                                    ${lang === 'bn' ? 'পূর্ণাঙ্গ ছবি' : 'Full HD View'} &rarr;
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    window.filterGalleryCategory = function (cat) {
        galleryCategoryFilter = cat;
        renderPortal();
    };

    window.openGalleryLightbox = function (photoId) {
        const photos = GeoTerraStore.getGalleryPhotos('all');
        const photo = photos.find(p => p.id === photoId) || photos[0];
        if (!photo) return;

        const lang = GeoTerraStore.getLanguage();
        const modal = document.createElement('div');
        modal.id = 'gallery-lightbox-modal';
        modal.className = 'fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in';
        modal.innerHTML = `
            <div class="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl text-white my-8">
                <div class="relative max-h-[60vh] bg-black">
                    <img src="${photo.image}" class="w-full h-full object-contain max-h-[60vh] mx-auto">
                    <button type="button" onclick="window.closeGalleryLightbox()" class="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-red-600 text-white flex items-center justify-center text-lg font-bold transition">
                        &times;
                    </button>
                </div>
                <div class="p-6 space-y-3 bg-slate-900 border-t border-slate-800">
                    <div class="flex items-center justify-between">
                        <span class="text-xs px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 font-mono font-bold">${escapeHtml(photo.category)}</span>
                        <span class="text-xs text-slate-400 font-mono">${escapeHtml(photo.location)}</span>
                    </div>
                    <h3 class="text-xl font-black text-white">${escapeHtml(lang === 'bn' ? photo.titleBn : photo.titleEn)}</h3>
                    <p class="text-xs text-slate-300 leading-relaxed">${escapeHtml(lang === 'bn' ? photo.descriptionBn : photo.descriptionEn)}</p>
                    <div class="pt-2 flex justify-end gap-3">
                        <button type="button" onclick="window.closeGalleryLightbox()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition">Close</button>
                        <button type="button" onclick="window.switchPortalTab('map'); window.closeGalleryLightbox();" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-2">
                            <i class="fa-solid fa-map-location-dot"></i> View on GIS Map
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    };

    window.closeGalleryLightbox = function () {
        const modal = document.getElementById('gallery-lightbox-modal');
        if (modal) modal.remove();
    };

    // --- Core Feature 4: Land Area Measurement Calculator & Guidelines ---
    function renderGuideTab(lang) {
        return `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
                
                <!-- Header -->
                <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
                    <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                        <i class="fa-solid fa-calculator text-amber-600"></i> Smart Cadastral Calculator
                    </div>
                    <h2 class="text-2xl sm:text-3xl font-black text-slate-900">${lang === 'bn' ? 'ভূমি পরিমাপ ক্যালকুলেটর ও জরিপ নির্দেশিকা' : 'Land Area Measurement Calculator & Cadastral Guide'}</h2>
                    <p class="text-xs text-slate-500 mt-1 max-w-2xl">${lang === 'bn' ? 'শতাংশ, কাঠা, বিঘা, বর্গফুট ও একরের তাৎক্ষণিক রূপান্তর এবং পুলিশ ও রাজস্ব ক্লিয়ারেন্স প্রক্রিয়া।' : 'Real-time conversion of traditional decimals into Katha, Bigha, Square Feet, and Acres.'}</p>
                </div>

                <!-- Calculator Container -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    <!-- Left: Interactive Converter Tool -->
                    <div class="lg:col-span-6 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
                        <div class="flex items-center gap-3 border-b border-slate-800 pb-4">
                            <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg">
                                <i class="fa-solid fa-scale-balanced"></i>
                            </div>
                            <div>
                                <h3 class="font-black text-base text-white">${lang === 'bn' ? 'জমির পরিমাপ রূপান্তরক' : 'Real-Time Unit Converter'}</h3>
                                <p class="text-[11px] text-slate-400">Enter area in decimals (শতাংশ) to calculate</p>
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-300 uppercase mb-2">
                                ${lang === 'bn' ? 'জমির পরিমাণ (শতাংশ / Decimals):' : 'Enter Land Area in Decimals:'}
                            </label>
                            <div class="relative">
                                <input type="number" id="calc-input-decimals" value="10" min="0" step="0.1" oninput="window.calculateLandArea()" 
                                    class="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-xl font-bold font-mono text-emerald-400 focus:outline-none focus:border-emerald-500">
                                <span class="absolute inset-y-0 right-4 flex items-center text-xs font-mono text-slate-500">Decimals</span>
                            </div>
                        </div>

                        <!-- Real-Time Calculated Results -->
                        <div class="grid grid-cols-2 gap-3 text-xs">
                            <div class="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                                <span class="text-slate-400 font-bold block mb-1">${lang === 'bn' ? 'কাঠা (Katha)' : 'Katha'}</span>
                                <span id="calc-res-katha" class="text-lg font-black text-white font-mono">6.05</span>
                                <span class="text-[10px] text-slate-500 block mt-0.5">1 Dec = 0.605 Katha</span>
                            </div>
                            <div class="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                                <span class="text-slate-400 font-bold block mb-1">${lang === 'bn' ? 'বিঘা (Bigha)' : 'Bigha'}</span>
                                <span id="calc-res-bigha" class="text-lg font-black text-teal-400 font-mono">0.30</span>
                                <span class="text-[10px] text-slate-500 block mt-0.5">1 Bigha = 33 Decimals</span>
                            </div>
                            <div class="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                                <span class="text-slate-400 font-bold block mb-1">${lang === 'bn' ? 'বর্গফুট (Sq. Feet)' : 'Square Feet'}</span>
                                <span id="calc-res-sqft" class="text-lg font-black text-amber-400 font-mono">4,356</span>
                                <span class="text-[10px] text-slate-500 block mt-0.5">1 Dec = 435.6 Sq. Ft</span>
                            </div>
                            <div class="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                                <span class="text-slate-400 font-bold block mb-1">${lang === 'bn' ? 'একর (Acres)' : 'Acres'}</span>
                                <span id="calc-res-acres" class="text-lg font-black text-emerald-400 font-mono">0.10</span>
                                <span class="text-[10px] text-slate-500 block mt-0.5">1 Acre = 100 Decimals</span>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Step-by-Step Cadastral & Police Clearance Guidelines -->
                    <div class="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
                        <h3 class="font-black text-lg text-slate-900 flex items-center gap-2">
                            <i class="fa-solid fa-circle-check text-emerald-600"></i>
                            ${lang === 'bn' ? 'ভূমি যাচাইকরণ ও থানা ক্লিয়ারেন্স ধাপসমূহ' : 'Official Verification & Police Clearance Steps'}
                        </h3>

                        <div class="space-y-4 text-xs">
                            <div class="flex gap-3">
                                <div class="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">1</div>
                                <div>
                                    <h4 class="font-bold text-slate-900 text-sm">${lang === 'bn' ? 'দাগ ও খতিয়ান নম্বর যাচাই' : 'DAG & Khatian Verification'}</h4>
                                    <p class="text-slate-500 mt-0.5 leading-relaxed">${lang === 'bn' ? 'উপজেলা ভূমি অফিস ও ডিজিটাল রেকর্ডে জমির সিএস, এসএ এবং আরএস খতিয়ানের সঠিকতা নিশ্চিত করুন।' : 'Confirm RS, SA, and CS records with the Upazila Land Revenue registry.'}</p>
                                </div>
                            </div>

                            <div class="flex gap-3">
                                <div class="w-7 h-7 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0">2</div>
                                <div>
                                    <h4 class="font-bold text-slate-900 text-sm">${lang === 'bn' ? 'থানা পুলিশ বিরোধ ক্লিয়ারেন্স' : 'Police Dispute-Free Clearance'}</h4>
                                    <p class="text-slate-500 mt-0.5 leading-relaxed">${lang === 'bn' ? 'জমির সীমানা নিয়ে কোনো ফৌজদারি বা ১৪৪/১৪৫ ধারার মামলা না থাকলে সংশ্লিষ্ট থানার ওসি কর্তৃক ছাড়পত্র দেওয়া হয়।' : 'Local Thana OC verifies there are no active Section 144/145 boundary dispute injunctions.'}</p>
                                </div>
                            </div>

                            <div class="flex gap-3">
                                <div class="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0">3</div>
                                <div>
                                    <h4 class="font-bold text-slate-900 text-sm">${lang === 'bn' ? 'স্যাটেলাইট ও আরটিকে সীমানা জরিপ' : 'RTK Geodetic GPS Demarcation'}</h4>
                                    <p class="text-slate-500 mt-0.5 leading-relaxed">${lang === 'bn' ? 'জিপিএস স্থানাঙ্ক দিয়ে প্লটের চারকোণার সীমানা খুঁটি নির্ধারণ এবং জিআইএস স্যাটেলাইটে ম্যাপ তৈরি।' : 'Licensed surveyors lock plot vertex coordinates using sub-meter RTK rovers.'}</p>
                                </div>
                            </div>

                            <div class="flex gap-3">
                                <div class="w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0">4</div>
                                <div>
                                    <h4 class="font-bold text-slate-900 text-sm">${lang === 'bn' ? 'কৃষি কর্মকর্তার ফসল প্রত্যয়ন' : 'Agricultural Officer Certification'}</h4>
                                    <p class="text-slate-500 mt-0.5 leading-relaxed">${lang === 'bn' ? 'কৃষি সম্প্রসারণ অধিদপ্তর কর্তৃক মাটির উর্বরতা, সেচ ব্যবস্থা ও মৌসুমী ফসল চাষের রিপোর্ট তৈরি।' : 'DAE extension officers record seasonal crop type and soil classification.'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        `;
    }

    window.calculateLandArea = function () {
        const input = document.getElementById('calc-input-decimals');
        if (!input) return;
        const dec = parseFloat(input.value) || 0;

        const katha = (dec * 0.605).toFixed(2);
        const bigha = (dec / 33.0).toFixed(2);
        const sqft = (dec * 435.6).toLocaleString('en-US', { maximumFractionDigits: 1 });
        const acres = (dec / 100.0).toFixed(2);

        const elK = document.getElementById('calc-res-katha');
        const elB = document.getElementById('calc-res-bigha');
        const elS = document.getElementById('calc-res-sqft');
        const elA = document.getElementById('calc-res-acres');

        if (elK) elK.innerText = katha;
        if (elB) elB.innerText = bigha;
        if (elS) elS.innerText = sqft;
        if (elA) elA.innerText = acres;
    };

    // --- Helper: Render Public Land Plots Cards ---
    function renderPublicPlotsCards(filterQuery = '', lang = 'bn') {
        const plots = GeoTerraStore.getAllLands({ query: filterQuery });
        if (plots.length === 0) {
            return `
                <div class="col-span-full bg-white p-12 text-center rounded-2xl border border-slate-200">
                    <i class="fa-solid fa-map-location-dot text-4xl text-slate-300 mb-3"></i>
                    <h3 class="font-bold text-slate-700 text-sm">${lang === 'bn' ? 'কোনো প্লট রেকর্ড খুঁজে পাওয়া যায়নি' : 'No Land Records Matching Search'}</h3>
                    <p class="text-xs text-slate-400 mt-1">${lang === 'bn' ? 'দয়া করে অন্য কোনো দাগ নম্বর বা মৌজার নাম দিয়ে অনুসন্ধান করুন।' : 'Try searching another DAG number or location.'}</p>
                </div>
            `;
        }

        return plots.map(plot => `
            <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs card-hover-effect flex flex-col justify-between">
                <div>
                    <div class="relative h-48 bg-slate-100 overflow-hidden">
                        <img src="${escapeHtml(plot.landImage)}" alt="Land" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80'">
                        <div class="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-bold font-mono">
                            ${escapeHtml(plot.landNumber)}
                        </div>
                        <div class="absolute top-3 right-3 bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                            ${escapeHtml(lang === 'bn' ? (plot.areaBn || plot.area) : plot.area)}
                        </div>
                        <button type="button" onclick="window.viewPlotOnMap('${escapeHtml(plot.id)}')" class="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold hover:bg-emerald-600 transition flex items-center gap-1.5 shadow-md">
                            <i class="fa-solid fa-map-location-dot text-emerald-400"></i> ${lang === 'bn' ? 'ম্যাপে দেখুন' : 'View on Map'}
                        </button>
                    </div>
                    <div class="p-5 space-y-3">
                        <div>
                            <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">${GeoTerraStore.t('mouza')}</span>
                            <div class="font-bold text-slate-800 text-sm">${escapeHtml(lang === 'bn' ? (plot.mouzaBn || plot.mouza) : plot.mouza)}</div>
                        </div>
                        <div class="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                            <div>
                                <span class="text-slate-400 block font-semibold text-[10px]">${lang === 'bn' ? 'মালিক' : 'Owner'}</span>
                                <span class="font-bold text-slate-700 truncate block">${escapeHtml(lang === 'bn' ? (plot.ownerNameBn || plot.ownerName || plot.ownerUsername) : (plot.ownerName || plot.ownerUsername))}</span>
                            </div>
                            <div>
                                <span class="text-slate-400 block font-semibold text-[10px]">${GeoTerraStore.t('currentCrop')}</span>
                                <span class="font-bold text-emerald-700 truncate block">${escapeHtml(lang === 'bn' ? (plot.currentCropBn || plot.currentCrop) : plot.currentCrop)}</span>
                            </div>
                        </div>
                        <div class="flex flex-wrap gap-1.5 pt-1">
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${plot.policeVerification.includes('Approved') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                                ${escapeHtml(plot.policeVerification)}
                            </span>
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${plot.imageVerification === 'Verified' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'}">
                                Satellite: ${escapeHtml(plot.imageVerification)}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
                    <span class="text-[11px] font-mono text-slate-500">${escapeHtml(plot.coordinates)}</span>
                    <button type="button" onclick="window.openGISModal('${escapeHtml(plot.id)}')" class="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
                        <i class="fa-solid fa-satellite"></i> GIS Radar &rarr;
                    </button>
                </div>
            </div>
        `).join('');
    }

    // --- User Password Visibility Toggle ---
    window.toggleUserPasswordVisibility = function () {
        const input = document.getElementById('user-login-password');
        const eye = document.getElementById('user-password-eye');
        if (!input) return;
        if (input.type === 'password') {
            input.type = 'text';
            if (eye) eye.className = 'fa-solid fa-eye-slash text-xs text-emerald-400';
        } else {
            input.type = 'password';
            if (eye) eye.className = 'fa-solid fa-eye text-xs text-slate-500';
        }
    };

    // --- Anti-Bot CAPTCHA Challenge System ---
    window.toggleUserRobotChallenge = function () {
        if (isUserRobotVerified) return;
        const box = document.getElementById('user-robot-challenge-box');
        if (box) {
            box.classList.remove('hidden');
            window.refreshUserRobotCaptcha();
        }
    };

    window.refreshUserRobotCaptcha = function () {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 5; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        userRobotVerificationCode = code;
        window.drawUserRobotCaptchaCanvas(code);
        const input = document.getElementById('user-robot-captcha-input');
        if (input) input.value = '';
    };

    window.drawUserRobotCaptchaCanvas = function (text) {
        const canvas = document.getElementById('user-robot-captcha-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < 6; i++) {
            ctx.strokeStyle = `rgba(16, 185, 129, ${0.15 + Math.random() * 0.25})`;
            ctx.lineWidth = 1 + Math.random() * 1.5;
            ctx.beginPath();
            ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.bezierCurveTo(
                Math.random() * canvas.width, Math.random() * canvas.height,
                Math.random() * canvas.width, Math.random() * canvas.height,
                Math.random() * canvas.width, Math.random() * canvas.height
            );
            ctx.stroke();
        }

        ctx.font = 'bold 20px "JetBrains Mono", monospace';
        ctx.textBaseline = 'middle';
        const startX = 16;
        for (let i = 0; i < text.length; i++) {
            ctx.save();
            const charX = startX + (i * 32);
            const charY = 22 + (Math.sin(i) * 4);
            ctx.translate(charX, charY);
            ctx.rotate((Math.random() - 0.5) * 0.35);
            ctx.fillStyle = i % 2 === 0 ? '#34d399' : '#10b981';
            ctx.fillText(text[i], -10, 0);
            ctx.restore();
        }
    };

    window.verifyUserRobotCaptcha = function () {
        const input = document.getElementById('user-robot-captcha-input');
        if (!input) return;
        const val = input.value.trim().toUpperCase();

        if (val === userRobotVerificationCode) {
            isUserRobotVerified = true;
            userRobotVerificationTimestamp = Date.now();

            const check = document.getElementById('user-robot-check-box');
            const icon = document.getElementById('user-robot-check-icon');
            const label = document.getElementById('user-robot-check-label');
            const box = document.getElementById('user-robot-challenge-box');

            if (check) check.className = 'w-6 h-6 rounded-lg border-2 border-emerald-500 bg-emerald-500/20 text-emerald-400 flex items-center justify-center transition';
            if (icon) icon.className = 'fa-solid fa-check text-xs text-emerald-400';
            if (label) {
                const lang = GeoTerraStore.getLanguage();
                label.className = 'text-xs font-bold text-emerald-400';
                label.innerText = lang === 'bn' ? '✓ মানুষ যাচাই সম্পন্ন (রোবট মুক্ত)' : '✓ Human Verified';
            }
            if (box) box.classList.add('hidden');

            GeoTerraStore.showToast('Human Verified', 'Anti-Bot security challenge cleared.', 'success');
        } else {
            GeoTerraStore.showToast('Invalid Code', 'Incorrect captcha code. Please try again.', 'error');
            window.refreshUserRobotCaptcha();
        }
    };

    function startUserLockoutCountdown(seconds) {
        if (userLockoutCountdownTimer) clearInterval(userLockoutCountdownTimer);
        let remain = seconds;
        userLockoutCountdownTimer = setInterval(() => {
            remain--;
            const countEl = document.getElementById('user-lockout-countdown');
            if (countEl) countEl.innerText = `${remain}s`;
            if (remain <= 0) {
                clearInterval(userLockoutCountdownTimer);
                userLockoutCountdownTimer = null;
                GeoTerraStore.resetUserLockoutState();
                renderPortal();
            }
        }, 1000);
    }

    // --- Public Form Event Bindings ---
    function bindPublicEvents() {
        const loginForm = document.getElementById('public-login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const honeypot = loginForm.user_trap_auth && loginForm.user_trap_auth.value;
                if (honeypot) {
                    GeoTerraStore.showToast('Security Rejection', 'Automated bot activity blocked.', 'error');
                    return;
                }

                if (!isUserRobotVerified) {
                    GeoTerraStore.showToast('Security Challenge Required', 'Please complete the "I\'m not a robot" verification before signing in.', 'warning');
                    window.toggleUserRobotChallenge();
                    return;
                }

                const username = loginForm.username.value.trim();
                const password = loginForm.password.value.trim();

                const auth = GeoTerraStore.checkUserLogin(username, password);
                if (auth.success) {
                    isUserRobotVerified = false;
                    GeoTerraStore.showToast('Authentication Successful', `Welcome, ${auth.user.fullName}!`, 'success');
                    currentTab = 'dashboard';
                    renderPortal();
                } else {
                    if (auth.locked) {
                        startUserLockoutCountdown(auth.remainingSeconds);
                        renderPortal();
                    } else {
                        GeoTerraStore.showToast('Access Denied', auth.error, 'error');
                        renderPortal();
                    }
                }
            });
        }

        // Quick login buttons
        const quickBtns = document.querySelectorAll('.btn-quick-login');
        quickBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const username = btn.getAttribute('data-quick-user');
                if (username) window.switchUserAccount(username);
            });
        });
    }

    // --- Logged-In User Dashboard View ---
    function renderDashboardView(config, user, lang) {
        const userPlots = GeoTerraStore.getLandsByUser(user.username);
        const totalArea = userPlots.reduce((acc, p) => {
            const m = (p.area || '').match(/([0-9.]+)/);
            return acc + (m ? parseFloat(m[1]) : 0);
        }, 0);
        const verifiedCount = userPlots.filter(p => p.imageVerification === 'Verified' && p.policeVerification.includes('Approved')).length;
        const siteName = lang === 'bn' ? (config.siteNameBn || 'স্মার্ট ল্যান্ড ম্যাপিং') : (config.siteName || 'Smart Land Mapping');

        return `
            <div class="flex-1 flex bg-slate-100 animate-fade-in">
                <!-- Sidebar Navigation for Logged-In Landowner -->
                <aside class="w-64 bg-slate-900 text-slate-300 flex-col justify-between hidden md:flex border-r border-slate-800 shrink-0">
                    <div>
                        <div class="p-6 border-b border-slate-800 flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/30">
                                <i class="fa-solid fa-earth-americas"></i>
                            </div>
                            <div>
                                <h1 class="font-bold text-white text-base">${escapeHtml(siteName)}</h1>
                                <p class="text-[10px] text-emerald-400 uppercase tracking-widest font-semibold">${lang === 'bn' ? 'ইউজার পোর্টাল' : 'User Bureau'}</p>
                            </div>
                        </div>

                        <div class="p-4">
                            <div class="px-3 py-2.5 mb-4 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center gap-3">
                                <img src="${escapeHtml(user.avatar)}" class="w-10 h-10 rounded-full object-cover border-2 border-emerald-500">
                                <div class="overflow-hidden min-w-0">
                                    <div class="font-bold text-white text-xs truncate">${escapeHtml(lang === 'bn' ? (user.fullNameBn || user.fullName) : user.fullName)}</div>
                                    <div class="text-[10px] text-emerald-400 truncate">${escapeHtml(lang === 'bn' ? (user.roleBn || user.role) : user.role)}</div>
                                    <div class="text-[9px] text-slate-400 truncate">${escapeHtml(lang === 'bn' ? (user.districtBn || user.district) : user.district)}</div>
                                </div>
                            </div>

                            <nav class="space-y-1">
                                <button type="button" onclick="window.switchPortalTab('dashboard')" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${currentTab === 'dashboard' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}">
                                    <i class="fa-solid fa-chart-pie w-5"></i> ${GeoTerraStore.t('dashboard')}
                                </button>
                                <button type="button" onclick="window.switchPortalTab('map')" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${currentTab === 'map' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}">
                                    <i class="fa-solid fa-map-location-dot w-5 text-emerald-400"></i> ${GeoTerraStore.t('liveMap')}
                                </button>
                                <button type="button" onclick="window.switchPortalTab('advisor')" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${currentTab === 'advisor' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'hover:bg-slate-800 text-emerald-400 hover:text-white'}">
                                    <i class="fa-solid fa-seedling w-5 text-emerald-400"></i> ${lang === 'bn' ? 'জমি পরিকল্পনা' : 'Land Advisor'}
                                </button>
                                <button type="button" onclick="window.switchPortalTab('weather')" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${currentTab === 'weather' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'hover:bg-slate-800 text-amber-400 hover:text-white'}">
                                    <i class="fa-solid fa-cloud-sun w-5 text-amber-400"></i> ${lang === 'bn' ? 'আবহাওয়া বার্তা' : 'Agro-Weather'}
                                </button>
                                <button type="button" onclick="window.switchPortalTab('officials')" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${currentTab === 'officials' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'hover:bg-slate-800 text-blue-400 hover:text-white'}">
                                    <i class="fa-solid fa-building-columns w-5 text-blue-400"></i> ${lang === 'bn' ? 'কৃষি ও ভূমি কর্মকর্তা' : 'Land & Agri Officers'}
                                </button>
                                <button type="button" onclick="window.switchPortalTab('lands')" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${currentTab === 'lands' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}">
                                    <i class="fa-solid fa-layer-group w-5"></i> ${GeoTerraStore.t('myPlots')} (${userPlots.length})
                                </button>
                                <button type="button" onclick="window.switchPortalTab('emergency')" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${currentTab === 'emergency' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'hover:bg-slate-800 text-red-400 hover:text-white'}">
                                    <i class="fa-solid fa-shield-halved w-5"></i> ${GeoTerraStore.t('emergencyPolice')}
                                </button>
                                <button type="button" onclick="window.switchPortalTab('gallery')" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${currentTab === 'gallery' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}">
                                    <i class="fa-solid fa-images w-5 text-teal-400"></i> ${GeoTerraStore.t('photoGallery')}
                                </button>
                                <button type="button" onclick="window.switchPortalTab('verifications')" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${currentTab === 'verifications' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}">
                                    <i class="fa-solid fa-shield-check w-5"></i> ${GeoTerraStore.t('verifications')}
                                </button>
                                <button type="button" onclick="window.switchPortalTab('directory')" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${currentTab === 'directory' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}">
                                    <i class="fa-solid fa-users w-5"></i> ${GeoTerraStore.t('directory')}
                                </button>
                                <button type="button" onclick="window.switchPortalTab('guide')" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${currentTab === 'guide' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}">
                                    <i class="fa-solid fa-calculator w-5 text-amber-400"></i> ${lang === 'bn' ? 'ক্যালকুলেটর' : 'Calculator'}
                                </button>
                            </nav>
                        </div>
                    </div>

                    <div class="p-4 border-t border-slate-800 space-y-2">
                        <button type="button" onclick="window.userLogout()" class="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-semibold transition">
                            <i class="fa-solid fa-right-from-bracket"></i> ${GeoTerraStore.t('signOut')}
                        </button>
                    </div>
                </aside>

                <!-- Dashboard Content Workspace -->
                <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <div class="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                                ${currentTab === 'dashboard' ? (lang === 'bn' ? 'ক্যাডাস্ট্রাল ড্যাশবোর্ড' : 'Cadastral Dashboard') :
                                  currentTab === 'map' ? (lang === 'bn' ? 'জিআইএস লাইভ স্যাটেলাইট ম্যাপ' : 'GIS Satellite Land Map') :
                                  currentTab === 'lands' ? (lang === 'bn' ? 'আমার জমির প্লটসমূহ' : 'My Land Plots') :
                                  currentTab === 'emergency' ? (lang === 'bn' ? 'জরুরি পুলিশ ও থানা ডিরেক্টরি' : 'Emergency Police') :
                                  currentTab === 'gallery' ? (lang === 'bn' ? 'জমি ও জরিপ চিত্রশালা' : 'Cadastral Gallery') :
                                  currentTab === 'verifications' ? (lang === 'bn' ? 'পুলিশ ও আইনি ছাড়পত্র' : 'Clearances & Police') :
                                  currentTab === 'guide' ? (lang === 'bn' ? 'ভূমি ক্যালকুলেটর ও গাইড' : 'Land Area Calculator') :
                                  (lang === 'bn' ? '১০ জন ভূমির মালিকের ডিরেক্টরি' : 'Landowners Directory')}
                            </h2>
                            <p class="text-xs text-slate-500">${lang === 'bn' ? 'সক্রিয় ইউজার' : 'User'}: <span class="font-semibold text-emerald-600">${escapeHtml(lang === 'bn' ? (user.fullNameBn || user.fullName) : user.fullName)}</span> &bull; ${escapeHtml(lang === 'bn' ? (user.districtBn || user.district) : user.district)}</p>
                        </div>
                        <div class="flex items-center gap-2.5">
                            <button type="button" onclick="window.openAddLandModal()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5">
                                <i class="fa-solid fa-plus"></i> ${GeoTerraStore.t('registerPlot')}
                            </button>
                            <button type="button" onclick="window.toggleAppLanguage()" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5">
                                <i class="fa-solid fa-language text-emerald-600"></i> ${lang === 'bn' ? 'ENG' : 'বাংলা'}
                            </button>
                        </div>
                    </div>

                    <main class="flex-1 p-6 overflow-y-auto">
                        ${currentTab === 'dashboard' ? renderUserDashboardTab(user, userPlots, totalArea, verifiedCount, lang) :
                          currentTab === 'map' ? renderLiveMapTab(lang) :
                          currentTab === 'advisor' ? renderLandAdvisorTab(lang, user) :
                          currentTab === 'weather' ? renderWeatherTab(lang, user) :
                          currentTab === 'officials' ? renderOfficialsTab(lang, user) :
                          currentTab === 'lands' ? renderUserLandsTab(user, userPlots, lang) :
                          currentTab === 'emergency' ? renderEmergencyTab(lang) :
                          currentTab === 'gallery' ? renderGalleryTab(lang) :
                          currentTab === 'verifications' ? renderUserVerificationsTab(userPlots, lang) :
                          currentTab === 'guide' ? renderGuideTab(lang) :
                          renderUserDirectoryTab(lang)}
                    </main>
                </div>
            </div>
        `;
    }

    function renderUserDashboardTab(user, userPlots, totalArea, verifiedCount, lang) {
        return `
            <div class="space-y-6">
                <!-- Stat Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                        <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl font-bold">
                            <i class="fa-solid fa-map"></i>
                        </div>
                        <div>
                            <div class="text-xs text-slate-500 font-semibold uppercase">${GeoTerraStore.t('myPlots')}</div>
                            <div class="text-2xl font-black text-slate-800">${userPlots.length}</div>
                        </div>
                    </div>
                    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                        <div class="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center text-xl font-bold">
                            <i class="fa-solid fa-ruler-combined"></i>
                        </div>
                        <div>
                            <div class="text-xs text-slate-500 font-semibold uppercase">${GeoTerraStore.t('totalArea')}</div>
                            <div class="text-2xl font-black text-slate-800">${totalArea.toFixed(1)} <span class="text-xs font-normal">Dec</span></div>
                        </div>
                    </div>
                    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                        <div class="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">
                            <i class="fa-solid fa-shield-check"></i>
                        </div>
                        <div>
                            <div class="text-xs text-slate-500 font-semibold uppercase">${GeoTerraStore.t('fullyVerified')}</div>
                            <div class="text-2xl font-black text-slate-800">${verifiedCount}</div>
                        </div>
                    </div>
                    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                        <div class="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl font-bold">
                            <i class="fa-solid fa-wheat-awn"></i>
                        </div>
                        <div>
                            <div class="text-xs text-slate-500 font-semibold uppercase">${GeoTerraStore.t('activeCrops')}</div>
                            <div class="text-2xl font-black text-slate-800">${new Set(userPlots.map(p => p.currentCrop)).size} ${lang === 'bn' ? 'ধরনের' : 'Types'}</div>
                        </div>
                    </div>
                </div>

                <!-- Live Agricultural Weather Widget for User''s District -->
                ${(() => {
                    const userWeather = GeoTerraStore.getDistrictWeather(user.district);
                    const userDistrictName = lang === 'bn' ? (user.districtBn || user.district) : user.district;
                    return `
                        <div class="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 rounded-3xl p-6 text-white shadow-xl border border-emerald-500/30 relative overflow-hidden">
                            <div class="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
                            <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
                                <div class="space-y-2">
                                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-mono font-bold">
                                        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                                        <span>${lang === 'bn' ? 'লাইভ কৃষি আবহাওয়া পূর্বাভাস' : 'Live Agro-Weather Station'}: ${escapeHtml(userDistrictName)}</span>
                                    </div>
                                    <div class="flex items-center gap-4">
                                        <div class="text-4xl sm:text-5xl font-black text-white tracking-tight flex items-center gap-2">
                                            <span>${userWeather.temp}&deg;C</span>
                                            <i class="fa-solid ${userWeather.icon} text-amber-400 text-3xl sm:text-4xl"></i>
                                        </div>
                                        <div>
                                            <div class="text-sm font-bold text-emerald-200">${lang === 'bn' ? userWeather.conditionBn : userWeather.conditionEn}</div>
                                            <div class="text-xs text-slate-400">${lang === 'bn' ? `অনুভূত: ${userWeather.feelsLike}°C` : `Feels like: ${userWeather.feelsLike}°C`} &bull; ${lang === 'bn' ? userWeather.airQuality : 'Air Quality: Good'}</div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Key Weather Metrics Pills -->
                                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto">
                                    <div class="bg-slate-950/60 border border-emerald-500/20 px-3.5 py-2.5 rounded-2xl text-center">
                                        <span class="text-[10px] text-slate-400 uppercase block font-semibold">${lang === 'bn' ? 'আর্দ্রতা' : 'Humidity'}</span>
                                        <span class="text-sm font-bold text-white font-mono">${userWeather.humidity}</span>
                                    </div>
                                    <div class="bg-slate-950/60 border border-emerald-500/20 px-3.5 py-2.5 rounded-2xl text-center">
                                        <span class="text-[10px] text-slate-400 uppercase block font-semibold">${lang === 'bn' ? 'বৃষ্টিপাত' : 'Rain Chance'}</span>
                                        <span class="text-sm font-bold text-emerald-400 font-mono">${userWeather.rainChance}</span>
                                    </div>
                                    <div class="bg-slate-950/60 border border-emerald-500/20 px-3.5 py-2.5 rounded-2xl text-center">
                                        <span class="text-[10px] text-slate-400 uppercase block font-semibold">${lang === 'bn' ? 'বাতাস' : 'Wind'}</span>
                                        <span class="text-xs font-bold text-white font-mono">${escapeHtml(userWeather.wind)}</span>
                                    </div>
                                    <div class="bg-slate-950/60 border border-emerald-500/20 px-3.5 py-2.5 rounded-2xl text-center">
                                        <span class="text-[10px] text-slate-400 uppercase block font-semibold">${lang === 'bn' ? 'মাটির আর্দ্রতা' : 'Soil Moisture'}</span>
                                        <span class="text-xs font-bold text-teal-300 font-mono">${escapeHtml(userWeather.soilMoisture)}</span>
                                    </div>
                                </div>

                                <button type="button" onclick="window.switchPortalTab('weather')" 
                                    class="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/30 flex items-center gap-2 whitespace-nowrap self-stretch lg:self-auto justify-center">
                                    <span>${lang === 'bn' ? '৫ দিনের পূর্বাভাস কেন্দ্র' : '5-Day Forecast Center'}</span>
                                    <i class="fa-solid fa-arrow-right"></i>
                                </button>
                            </div>

                            <!-- Integrated Agro Advisory Banner -->
                            <div class="mt-4 pt-4 border-t border-emerald-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                                <div class="flex items-center gap-2 text-emerald-200">
                                    <i class="fa-solid fa-bell text-amber-400"></i>
                                    <span><strong>${lang === 'bn' ? 'আজকের কৃষি পরামর্শ:' : 'Agro-Advisory:'}</strong> ${escapeHtml(lang === 'bn' ? userWeather.agriAdvisory.cropAdviceBn : userWeather.agriAdvisory.cropAdviceEn)}</span>
                                </div>
                                <span class="text-[11px] text-emerald-300 font-mono shrink-0 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                                    ${escapeHtml(lang === 'bn' ? userWeather.agriAdvisory.sprayAlertBn : userWeather.agriAdvisory.sprayAlertEn)}
                                </span>
                            </div>
                        </div>
                    `;
                })()}

                <!-- Post-Purchase Smart Land Planning & District Officials Access Banners -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <!-- Land Advisor Banner -->
                    <div class="bg-gradient-to-br from-white to-emerald-50/50 p-6 rounded-3xl border border-emerald-200 shadow-xs flex flex-col justify-between">
                        <div class="space-y-3">
                            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                                <i class="fa-solid fa-seedling"></i>
                                <span>${lang === 'bn' ? 'জমি ক্রয়োত্তর পরামর্শক ও পরিকল্পনা' : 'Post-Purchase Land Advisor'}</span>
                            </div>
                            <h3 class="text-lg font-black text-slate-900">${lang === 'bn' ? 'জমি কেনার পর কি কি করবেন? সঠিক পরিকল্পনা তৈরি করুন' : 'What can you do with your land? Get a complete custom plan'}</h3>
                            <p class="text-xs text-slate-600 leading-relaxed">
                                ${lang === 'bn' ? 'ফলবাগান, ৩-ফসলি শস্য আবর্তন, মাছ চাষ, ডেইরি বা বাণিজ্যিক ব্যবহারের পূর্ণাঙ্গ বাজেট, লাভ-ক্ষতির হিসাব এবং ৫০ দিনের আইনি নামজারি পরিক্রমা।' : 'Explore high-value crops, fisheries, dairy models, 12-month budget breakdowns, and mandatory 50-day legal mutation roadmaps.'}
                            </p>
                        </div>
                        <div class="pt-5 mt-3 border-t border-emerald-100 flex items-center justify-between">
                            <span class="text-xs font-semibold text-emerald-700">
                                <i class="fa-solid fa-list-check text-emerald-500 mr-1"></i> ৭টি লাভজনক মডেল
                            </span>
                            <button type="button" onclick="window.switchPortalTab('advisor')" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5">
                                <span>${lang === 'bn' ? 'পরিকল্পনা শুরু করুন' : 'Start Planning'}</span> &rarr;
                            </button>
                        </div>
                    </div>

                    <!-- District Officials Banner -->
                    <div class="bg-gradient-to-br from-white to-blue-50/50 p-6 rounded-3xl border border-blue-200 shadow-xs flex flex-col justify-between">
                        <div class="space-y-3">
                            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider">
                                <i class="fa-solid fa-building-columns"></i>
                                <span>${lang === 'bn' ? 'সরকারি কর্মকর্তাদের ডিরেক্টরি' : 'Govt Land & Agri Bureau'}</span>
                            </div>
                            <h3 class="text-lg font-black text-slate-900">${lang === 'bn' ? 'জেলার কৃষি এবং ভূমি সংক্রান্ত কর্মকর্তাদের তালিকা ও নম্বর' : 'District Land & Agriculture Officials Directory'}</h3>
                            <p class="text-xs text-slate-600 leading-relaxed">
                                ${lang === 'bn' ? `আপনার জেলা (${user.districtBn || user.district})-এর সহকারী কমিশনার (ভূমি), সাব-রেজিস্ট্রার, তহশিলদার এবং কৃষি সম্প্রসারণ অধিদপ্তরের ভেরিফাইড ফোন নম্বর ও ১-ক্লিকে কল সুবিধা।` : `Verified contact numbers for AC Land, Sub-Registrar, and Upazila Agriculture Officers across all districts with direct 1-click calling.`}
                            </p>
                        </div>
                        <div class="pt-5 mt-3 border-t border-blue-100 flex items-center justify-between">
                            <span class="text-xs font-semibold text-blue-700">
                                <i class="fa-solid fa-phone-volume text-blue-500 mr-1"></i> ১-ক্লিকে সরাসরি কল
                            </span>
                            <button type="button" onclick="window.switchPortalTab('officials')" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition flex items-center gap-1.5">
                                <span>${lang === 'bn' ? 'কর্মকর্তাদের তালিকা দেখুন' : 'View Directory'}</span> &rarr;
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Recent Registered Plots Table -->
                <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                    <div class="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                        <h3 class="font-bold text-slate-800 text-sm">${lang === 'bn' ? 'আমার নিবন্ধিত জমির দাগসমূহ' : 'My Registered Land Parcels'}</h3>
                        <button type="button" onclick="window.switchPortalTab('lands')" class="text-xs font-bold text-emerald-600 hover:text-emerald-700">${lang === 'bn' ? 'সবগুলো দেখুন' : 'View All'} &rarr;</button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr class="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
                                    <th class="px-6 py-3">${GeoTerraStore.t('landNumber')}</th>
                                    <th class="px-6 py-3">${GeoTerraStore.t('mouza')}</th>
                                    <th class="px-6 py-3">${GeoTerraStore.t('area')}</th>
                                    <th class="px-6 py-3">${GeoTerraStore.t('currentCrop')}</th>
                                    <th class="px-6 py-3">${GeoTerraStore.t('policeStatus')}</th>
                                    <th class="px-6 py-3 text-right">${GeoTerraStore.t('actions')}</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 text-xs font-medium">
                                ${userPlots.map(plot => `
                                    <tr class="hover:bg-slate-50/80 transition">
                                        <td class="px-6 py-4 font-mono font-bold text-emerald-700">${escapeHtml(plot.landNumber)}</td>
                                        <td class="px-6 py-4 text-slate-700">${escapeHtml(lang === 'bn' ? (plot.mouzaBn || plot.mouza) : plot.mouza)}</td>
                                        <td class="px-6 py-4 text-slate-900 font-bold">${escapeHtml(lang === 'bn' ? (plot.areaBn || plot.area) : plot.area)}</td>
                                        <td class="px-6 py-4 text-slate-700">${escapeHtml(lang === 'bn' ? (plot.currentCropBn || plot.currentCrop) : plot.currentCrop)}</td>
                                        <td class="px-6 py-4">
                                            <span class="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${plot.policeVerification.includes('Approved') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                                                ${escapeHtml(plot.policeVerification)}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                                            <button type="button" onclick="window.viewPlotOnMap('${escapeHtml(plot.id)}')" class="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs" title="View on Map"><i class="fa-solid fa-map-location-dot"></i></button>
                                            <button type="button" onclick="window.openGISModal('${escapeHtml(plot.id)}')" class="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs" title="GIS Radar"><i class="fa-solid fa-satellite"></i></button>
                                            <button type="button" onclick="window.openEditLandModal('${escapeHtml(plot.id)}')" class="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs" title="Edit"><i class="fa-solid fa-pen"></i></button>
                                            <button type="button" onclick="window.deleteLandPlot('${escapeHtml(plot.id)}')" class="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs" title="Delete"><i class="fa-solid fa-trash"></i></button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    function renderUserLandsTab(user, userPlots, lang) {
        return `
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="text-base font-bold text-slate-800">${GeoTerraStore.t('myPlots')}</h3>
                        <p class="text-xs text-slate-500">${escapeHtml(lang === 'bn' ? (user.fullNameBn || user.fullName) : user.fullName)} - ${lang === 'bn' ? 'সকল প্লট ও স্যাটেলাইট রেকর্ড' : 'Geospatial records'}</p>
                    </div>
                    <button type="button" onclick="window.openAddLandModal()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5">
                        <i class="fa-solid fa-plus"></i> ${GeoTerraStore.t('registerPlot')}
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${userPlots.map(plot => `
                        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs card-hover-effect flex flex-col justify-between">
                            <div>
                                <div class="relative h-48 bg-slate-100 overflow-hidden">
                                    <img src="${escapeHtml(plot.landImage)}" alt="Plot" class="w-full h-full object-cover">
                                    <div class="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-bold font-mono">
                                        ${escapeHtml(plot.landNumber)}
                                    </div>
                                    <div class="absolute top-3 right-3 bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                                        ${escapeHtml(lang === 'bn' ? (plot.areaBn || plot.area) : plot.area)}
                                    </div>
                                    <div class="absolute bottom-3 right-3 flex gap-2">
                                        <button type="button" onclick="window.viewPlotOnMap('${escapeHtml(plot.id)}')" class="px-3 py-1.5 rounded-lg bg-emerald-600/90 backdrop-blur-md text-white text-xs font-semibold hover:bg-emerald-700 transition flex items-center gap-1.5 shadow-md">
                                            <i class="fa-solid fa-map-location-dot"></i> Map
                                        </button>
                                        <button type="button" onclick="window.openGISModal('${escapeHtml(plot.id)}')" class="px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold hover:bg-emerald-600 transition flex items-center gap-1.5 shadow-md">
                                            <i class="fa-solid fa-satellite text-emerald-400"></i> GIS
                                        </button>
                                    </div>
                                </div>
                                <div class="p-5 space-y-3">
                                    <div>
                                        <div class="text-xs text-slate-400 uppercase font-semibold">${GeoTerraStore.t('mouza')}</div>
                                        <div class="font-bold text-slate-800 text-sm">${escapeHtml(lang === 'bn' ? (plot.mouzaBn || plot.mouza) : plot.mouza)}</div>
                                    </div>
                                    <div class="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                                        <div>
                                            <span class="text-slate-400 block font-semibold text-[10px]">${GeoTerraStore.t('currentCrop')}</span>
                                            <span class="font-bold text-emerald-700">${escapeHtml(lang === 'bn' ? (plot.currentCropBn || plot.currentCrop) : plot.currentCrop)}</span>
                                        </div>
                                        <div>
                                            <span class="text-slate-400 block font-semibold text-[10px]">GPS</span>
                                            <span class="font-medium text-slate-700 truncate block">${escapeHtml(plot.coordinates)}</span>
                                        </div>
                                    </div>
                                    <div class="pt-2 flex flex-wrap gap-1.5">
                                        <span class="px-2 py-0.5 rounded text-[10px] font-bold ${plot.imageVerification === 'Verified' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}">Image: ${escapeHtml(plot.imageVerification)}</span>
                                        <span class="px-2 py-0.5 rounded text-[10px] font-bold ${plot.policeVerification.includes('Approved') ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">Police: ${escapeHtml(plot.policeVerification)}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                                <button type="button" onclick="window.openEditLandModal('${escapeHtml(plot.id)}')" class="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition">
                                    <i class="fa-solid fa-pen mr-1"></i> Edit
                                </button>
                                <button type="button" onclick="window.deleteLandPlot('${escapeHtml(plot.id)}')" class="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-semibold transition">
                                    <i class="fa-solid fa-trash mr-1"></i> Delete
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    function renderUserVerificationsTab(userPlots, lang) {
        return `
            <div class="space-y-6">
                <div class="bg-white p-6 rounded-2xl border border-slate-200">
                    <h3 class="text-base font-bold text-slate-800 mb-2">${GeoTerraStore.t('verifications')}</h3>
                    <p class="text-xs text-slate-500">${lang === 'bn' ? 'পুলিশ স্টেশন ক্লিয়ারেন্স ও স্যাটেলাইট ভেরিফিকেশন স্ট্যাটাস' : 'Police Station & Satellite Photo Verification Status'}</p>
                </div>
                <div class="space-y-4">
                    ${userPlots.map(plot => `
                        <div class="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <span class="font-mono font-bold text-emerald-700 text-sm">${escapeHtml(plot.landNumber)}</span>
                                <h4 class="font-bold text-slate-800 text-sm mt-0.5">${escapeHtml(lang === 'bn' ? (plot.mouzaBn || plot.mouza) : plot.mouza)}</h4>
                                <p class="text-[11px] text-slate-400 mt-1 font-mono">${escapeHtml(plot.coordinates)}</p>
                            </div>
                            <div class="flex flex-wrap gap-3">
                                <div class="px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
                                    <span class="text-slate-400 block text-[10px] font-bold uppercase">Police Station</span>
                                    <span class="font-bold text-slate-800">${escapeHtml(plot.policeVerification)}</span>
                                </div>
                                <div class="px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
                                    <span class="text-slate-400 block text-[10px] font-bold uppercase">Satellite Photo</span>
                                    <span class="font-bold text-slate-800">${escapeHtml(plot.imageVerification)}</span>
                                </div>
                                <div class="px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
                                    <span class="text-slate-400 block text-[10px] font-bold uppercase">Agri Officer</span>
                                    <span class="font-bold text-slate-800">${escapeHtml(plot.cropVerification || 'Verified')}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    function renderUserDirectoryTab(lang) {
        return renderDirectoryStandaloneTab(lang);
    }

    function bindDashboardEvents() {}

    // --- Slide Carousel Logic ---
    function updateSlideView() {
        const slides = document.querySelectorAll('.hero-slide-item');
        slides.forEach((s, idx) => {
            if (idx === currentSlideIndex) {
                s.classList.remove('opacity-0', 'z-0', 'pointer-events-none');
                s.classList.add('opacity-100', 'z-10');
            } else {
                s.classList.remove('opacity-100', 'z-10');
                s.classList.add('opacity-0', 'z-0', 'pointer-events-none');
            }
        });

        const dots = document.querySelectorAll('.slide-indicator-dot');
        dots.forEach((d, idx) => {
            if (idx === currentSlideIndex) {
                d.className = 'slide-indicator-dot w-6 h-2.5 rounded-full transition-all bg-emerald-400';
            } else {
                d.className = 'slide-indicator-dot w-2.5 h-2.5 rounded-full transition-all bg-slate-600 hover:bg-slate-400';
            }
        });
    }

    window.nextHeroSlide = function () {
        const slides = GeoTerraStore.getSlides();
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        updateSlideView();
    };

    window.prevHeroSlide = function () {
        const slides = GeoTerraStore.getSlides();
        currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
        updateSlideView();
    };

    window.gotoHeroSlide = function (idx) {
        currentSlideIndex = idx;
        updateSlideView();
    };

    window.toggleAppLanguage = function () {
        const next = GeoTerraStore.toggleLanguage();
        renderPortal();
    };

    window.switchPortalTab = function (tab) {
        currentTab = tab;
        focusedMapPlotId = null;
        renderPortal();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.userLogout = function () {
        isUserRobotVerified = false;
        GeoTerraStore.clearUserSession();
        GeoTerraStore.showToast('Logged Out', 'User session closed.', 'info');
        currentTab = 'overview';
        renderPortal();
    };

    window.switchUserAccount = function (username) {
        const user = GeoTerraStore.getUser(username);
        if (user) {
            GeoTerraStore.checkUserLogin(user.username, user.password);
            currentTab = 'dashboard';
            renderPortal();
            GeoTerraStore.showToast('Switched User', `Switched to ${user.fullName} (${user.district})`, 'success');
        }
    };

    window.deleteLandPlot = function (id) {
        if (confirm('Are you sure you want to delete this land parcel record?')) {
            GeoTerraStore.deleteLand(id);
            GeoTerraStore.showToast('Plot Removed', 'Land parcel deleted.', 'info');
            renderPortal();
        }
    };

    // --- Land Modal Registration with Quick Farmland Photo Presets ---
    window.openAddLandModal = function () {
        editingPlotId = null;
        const user = GeoTerraStore.getUserSession() || { username: 'akmjobayer', fullName: 'AKM Jobayer', district: 'Dhaka' };
        renderLandFormModal({
            landNumber: 'DAG-' + Math.floor(1000 + Math.random() * 9000),
            khatianNumber: 'KH-' + Math.floor(100 + Math.random() * 900),
            mouza: '',
            district: user.district,
            area: '15.0 Decimals',
            coordinates: '23.8103° N, 90.4125° E',
            currentCrop: 'Paddy / Rice',
            pastHistory: '',
            imageVerification: 'Verified',
            policeVerification: 'Approved & Cleared',
            cropVerification: 'Verified by Agri Officer',
            landImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
            notes: ''
        }, false);
    };

    window.openEditLandModal = function (id) {
        const plot = GeoTerraStore.getLandById(id);
        if (plot) {
            editingPlotId = id;
            renderLandFormModal(plot, true);
        }
    };

    window.closeLandFormModal = function () {
        const modal = document.getElementById('land-form-modal');
        if (modal) modal.remove();
    };

    function renderLandFormModal(plot, isEdit) {
        window.closeLandFormModal();
        const user = GeoTerraStore.getUserSession() || { username: 'akmjobayer', fullName: 'AKM Jobayer', district: 'Dhaka' };

        const modalDiv = document.createElement('div');
        modalDiv.id = 'land-form-modal';
        modalDiv.className = 'fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in';
        modalDiv.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 transform transition-all my-8">
                <div class="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-4 flex justify-between items-center text-white">
                    <h3 class="font-bold text-lg flex items-center gap-2">
                        <i class="fa-solid fa-map-location-dot"></i> ${isEdit ? 'Edit Land Plot Record' : 'Register New Land Plot'}
                    </h3>
                    <button type="button" onclick="window.closeLandFormModal()" class="text-white/80 hover:text-white text-2xl font-bold leading-none">&times;</button>
                </div>
                <form id="land-modal-form" class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Land / DAG Number *</label>
                            <input type="text" name="landNumber" required value="${escapeHtml(plot.landNumber)}" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm font-mono">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Mouza / Location Name *</label>
                            <input type="text" name="mouza" required value="${escapeHtml(plot.mouza)}" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm">
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Area / Size *</label>
                            <input type="text" name="area" required value="${escapeHtml(plot.area)}" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm" placeholder="e.g., 14.5 Decimals">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">GPS Coordinates *</label>
                            <input type="text" name="coordinates" required value="${escapeHtml(plot.coordinates)}" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm font-mono" placeholder="23.8103° N, 90.4125° E">
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Current Crop / Cultivation *</label>
                            <input type="text" name="currentCrop" required value="${escapeHtml(plot.currentCrop)}" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm" placeholder="e.g., Rice, Potato, Wheat">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Past Agricultural History</label>
                            <input type="text" name="pastHistory" value="${escapeHtml(plot.pastHistory || '')}" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm">
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Image Verification</label>
                            <select name="imageVerification" class="w-full px-2 py-1.5 border border-slate-300 rounded-lg bg-white text-xs font-medium">
                                <option value="Verified" ${plot.imageVerification === 'Verified' ? 'selected' : ''}>Verified</option>
                                <option value="Pending Review" ${plot.imageVerification === 'Pending Review' ? 'selected' : ''}>Pending Review</option>
                                <option value="Rejected" ${plot.imageVerification === 'Rejected' ? 'selected' : ''}>Rejected</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Police Station Status</label>
                            <select name="policeVerification" class="w-full px-2 py-1.5 border border-slate-300 rounded-lg bg-white text-xs font-medium">
                                <option value="Approved & Cleared" ${plot.policeVerification.includes('Approved') || plot.policeVerification.includes('Cleared') ? 'selected' : ''}>Approved & Cleared</option>
                                <option value="Pending Station Clearance" ${plot.policeVerification.includes('Pending') ? 'selected' : ''}>Pending Station Clearance</option>
                                <option value="Disputed" ${plot.policeVerification.includes('Disputed') ? 'selected' : ''}>Disputed</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Crop Verification</label>
                            <select name="cropVerification" class="w-full px-2 py-1.5 border border-slate-300 rounded-lg bg-white text-xs font-medium">
                                <option value="Verified by Agri Officer" ${plot.cropVerification && plot.cropVerification.includes('Verified') ? 'selected' : ''}>Verified by Agri Officer</option>
                                <option value="Pending Inspection" ${plot.cropVerification && plot.cropVerification.includes('Pending') ? 'selected' : ''}>Pending Inspection</option>
                            </select>
                        </div>
                    </div>

                    <!-- Photo URL & 1-Click Farmland Presets -->
                    <div>
                        <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Land Image Photo URL</label>
                        <input type="url" id="plot-image-input-url" name="landImage" value="${escapeHtml(plot.landImage || '')}" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm font-mono mb-2">
                        <div class="text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
                            <i class="fa-solid fa-wand-magic-sparkles text-emerald-600"></i> Quick 1-Click Photo Presets:
                        </div>
                        <div class="grid grid-cols-6 gap-2">
                            <button type="button" onclick="document.getElementById('plot-image-input-url').value='https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'" class="h-12 rounded-lg overflow-hidden border-2 border-transparent hover:border-emerald-500 transition group" title="Paddy Field">
                                <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=150&q=80" class="w-full h-full object-cover">
                            </button>
                            <button type="button" onclick="document.getElementById('plot-image-input-url').value='https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80'" class="h-12 rounded-lg overflow-hidden border-2 border-transparent hover:border-emerald-500 transition group" title="Agro Farm">
                                <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=150&q=80" class="w-full h-full object-cover">
                            </button>
                            <button type="button" onclick="document.getElementById('plot-image-input-url').value='https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'" class="h-12 rounded-lg overflow-hidden border-2 border-transparent hover:border-emerald-500 transition group" title="Tea Estate">
                                <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=150&q=80" class="w-full h-full object-cover">
                            </button>
                            <button type="button" onclick="document.getElementById('plot-image-input-url').value='https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80'" class="h-12 rounded-lg overflow-hidden border-2 border-transparent hover:border-emerald-500 transition group" title="Drone Aerial">
                                <img src="https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=150&q=80" class="w-full h-full object-cover">
                            </button>
                            <button type="button" onclick="document.getElementById('plot-image-input-url').value='https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80'" class="h-12 rounded-lg overflow-hidden border-2 border-transparent hover:border-emerald-500 transition group" title="Orchard">
                                <img src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=150&q=80" class="w-full h-full object-cover">
                            </button>
                            <button type="button" onclick="document.getElementById('plot-image-input-url').value='https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=800&q=80'" class="h-12 rounded-lg overflow-hidden border-2 border-transparent hover:border-emerald-500 transition group" title="Harvest Field">
                                <img src="https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=150&q=80" class="w-full h-full object-cover">
                            </button>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Surveyor Notes & Remarks</label>
                        <textarea name="notes" rows="2" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm">${escapeHtml(plot.notes || '')}</textarea>
                    </div>
                    <div class="pt-3 border-t border-slate-200 flex justify-end gap-3">
                        <button type="button" onclick="window.closeLandFormModal()" class="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 text-sm font-medium">Cancel</button>
                        <button type="submit" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium shadow-md shadow-emerald-600/20">Save Record</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modalDiv);

        document.getElementById('land-modal-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const form = e.target;
            const landData = {
                id: editingPlotId || ('plot-' + Date.now()),
                ownerUsername: plot.ownerUsername || user.username,
                ownerName: plot.ownerName || user.fullName,
                district: plot.district || user.district,
                landNumber: form.landNumber.value.trim(),
                mouza: form.mouza.value.trim(),
                area: form.area.value.trim(),
                coordinates: form.coordinates.value.trim(),
                currentCrop: form.currentCrop.value.trim(),
                pastHistory: form.pastHistory.value.trim(),
                imageVerification: form.imageVerification.value,
                policeVerification: form.policeVerification.value,
                cropVerification: form.cropVerification.value,
                landImage: form.landImage.value.trim() || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
                notes: form.notes.value.trim()
            };

            GeoTerraStore.saveLand(landData);
            window.closeLandFormModal();
            GeoTerraStore.showToast('Plot Saved', `${landData.landNumber} record has been saved.`, 'success');
            renderPortal();
        });
    }

    // --- Upgraded GIS Satellite Radar & Embedded Mini Map Visualizer ---
    window.openGISModal = function (plotId) {
        const plot = GeoTerraStore.getLandById(plotId);
        if (!plot) return;

        const lang = GeoTerraStore.getLanguage();
        const coords = parseLatLong(plot.coordinates) || { lat: 23.8103, lng: 90.4125 };

        const modalDiv = document.createElement('div');
        modalDiv.id = 'gis-map-modal';
        modalDiv.className = 'fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in';
        modalDiv.innerHTML = `
            <div class="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col text-white my-8">
                <div class="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                            <i class="fa-solid fa-satellite-dish"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-sm text-white flex items-center gap-2">
                                ${lang === 'bn' ? 'জিআইএস স্যাটেলাইট প্লট ভিজ্যুয়ালাইজার' : 'GIS Satellite Plot Visualizer'} 
                                <span class="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">${escapeHtml(plot.landNumber)}</span>
                            </h3>
                            <p class="text-[10px] text-slate-400 font-mono">${escapeHtml(plot.coordinates)} &bull; ${escapeHtml(plot.mouza)}</p>
                        </div>
                    </div>
                    <button type="button" onclick="document.getElementById('gis-map-modal').remove()" class="text-slate-400 hover:text-white text-2xl font-bold leading-none">&times;</button>
                </div>

                <div class="relative h-80 sm:h-96 w-full satellite-map-box gis-grid-dark flex items-center justify-center">
                    <!-- Embedded Mini Leaflet Satellite Map -->
                    <div id="gis-mini-leaflet-box" class="absolute inset-0 w-full h-full z-10"></div>

                    <div class="absolute top-4 left-4 z-20 bg-slate-950/85 backdrop-blur-md border border-slate-800 p-3 rounded-xl text-[11px] font-mono space-y-1 text-slate-300 pointer-events-none">
                        <div><span class="text-emerald-400 font-bold">DAG:</span> ${escapeHtml(plot.landNumber)}</div>
                        <div><span class="text-emerald-400 font-bold">LAT/LON:</span> ${escapeHtml(plot.coordinates)}</div>
                        <div><span class="text-emerald-400 font-bold">STATUS:</span> ${escapeHtml(plot.policeVerification)}</div>
                    </div>

                    <div class="absolute bottom-4 right-4 z-20 flex gap-2">
                        <button type="button" onclick="window.viewPlotOnMap('${plot.id}'); document.getElementById('gis-map-modal').remove();" class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-white shadow-lg shadow-emerald-600/30 flex items-center gap-1.5">
                            <i class="fa-solid fa-expand"></i> Full Map View
                        </button>
                    </div>
                </div>

                <div class="p-6 bg-slate-900 grid grid-cols-1 sm:grid-cols-4 gap-4 border-t border-slate-800 text-xs">
                    <div>
                        <span class="text-[10px] uppercase font-bold text-slate-400 block">${GeoTerraStore.t('currentCrop')}</span>
                        <span class="font-bold text-emerald-400 text-sm">${escapeHtml(lang === 'bn' ? (plot.currentCropBn || plot.currentCrop) : plot.currentCrop)}</span>
                    </div>
                    <div>
                        <span class="text-[10px] uppercase font-bold text-slate-400 block">${lang === 'bn' ? 'মালিকানা' : 'Landowner'}</span>
                        <span class="font-bold text-white text-sm">${escapeHtml(lang === 'bn' ? (plot.ownerNameBn || plot.ownerName || plot.ownerUsername) : (plot.ownerName || plot.ownerUsername))}</span>
                    </div>
                    <div>
                        <span class="text-[10px] uppercase font-bold text-slate-400 block">${GeoTerraStore.t('policeStatus')}</span>
                        <span class="inline-block px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold">${escapeHtml(plot.policeVerification)}</span>
                    </div>
                    <div>
                        <span class="text-[10px] uppercase font-bold text-slate-400 block">Emergency Police</span>
                        <button type="button" onclick="window.switchPortalTab('emergency'); document.getElementById('gis-map-modal').remove();" class="px-3 py-1 bg-red-600/80 hover:bg-red-600 text-white rounded-lg font-bold text-[11px] mt-0.5 flex items-center gap-1">
                            <i class="fa-solid fa-phone"></i> Call Station
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modalDiv);

        // Initialize mini satellite map inside modal
        setTimeout(() => {
            if (typeof L !== 'undefined' && document.getElementById('gis-mini-leaflet-box')) {
                const miniMap = L.map('gis-mini-leaflet-box', {
                    center: [coords.lat, coords.lng],
                    zoom: 15,
                    attributionControl: false,
                    zoomControl: false
                });
                L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                    maxZoom: 19
                }).addTo(miniMap);

                const offset = 0.0016;
                L.polygon([
                    [coords.lat + offset, coords.lng - offset],
                    [coords.lat + offset * 0.9, coords.lng + offset * 1.2],
                    [coords.lat - offset * 0.8, coords.lng + offset * 1.1],
                    [coords.lat - offset * 1.1, coords.lng - offset * 0.9]
                ], {
                    color: '#10b981',
                    weight: 3,
                    fillColor: '#10b981',
                    fillOpacity: 0.25
                }).addTo(miniMap);

                L.marker([coords.lat, coords.lng]).addTo(miniMap);
            }
        }, 100);
    };

    // =========================================================================
    // Tab 1: Post-Purchase Land Planning & Recommendation Advisor (স্মার্ট জমি পরিকল্পনা)
    // =========================================================================
    let currentAdvisorSelectedPlot = null;
    let currentAdvisorPlanResult = null;

    function renderLandAdvisorTab(lang, user) {
        const templates = GeoTerraStore.getLandAdvisorTemplates();
        const userPlots = user ? GeoTerraStore.getLandsByUser(user.username) : [];
        const allLands = GeoTerraStore.getAllLands();

        // If no custom plan generated yet, pre-generate default plan for first user plot or standard 33 decimal plot
        if (!currentAdvisorPlanResult) {
            const defaultPlot = userPlots.length > 0 ? userPlots[0] : (allLands[0] || null);
            let areaVal = 33.0;
            if (defaultPlot && defaultPlot.area) {
                const m = defaultPlot.area.match(/([0-9.]+)/);
                if (m) areaVal = parseFloat(m[1]);
            }
            currentAdvisorPlanResult = GeoTerraStore.generateLandPlan({
                plotId: defaultPlot ? defaultPlot.id : 'default-demo',
                dagNumber: defaultPlot ? defaultPlot.landNumber : 'DAG-402',
                mouza: defaultPlot ? (lang === 'bn' ? defaultPlot.mouzaBn || defaultPlot.mouza : defaultPlot.mouza) : 'Gazipur Sadar',
                district: defaultPlot ? defaultPlot.district : (user ? user.district : 'Gazipur'),
                landArea: areaVal,
                purpose: 'fruits',
                soilType: 'উর্বর দোআঁশ ও পলিমাটি (Loamy Alluvial Soil)',
                waterSource: 'ভূগর্ভস্থ গভীর নলকূপ ও সেচ ক্যানেল (Deep Tubewell)'
            });
        }

        return `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
                <!-- Hero Header -->
                <div class="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-6 sm:p-8 rounded-3xl border border-emerald-500/30 text-white shadow-xl relative overflow-hidden">
                    <div class="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div class="relative z-10 max-w-3xl space-y-3">
                        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider border border-emerald-500/30">
                            <i class="fa-solid fa-seedling"></i>
                            <span>${lang === 'bn' ? 'জমি ক্রয়োত্তর স্মার্ট পরিকল্পনা ও পরামর্শক' : 'Post-Purchase Land Advisor & Action Planner'}</span>
                        </div>
                        <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight">
                            ${lang === 'bn' ? 'জমি কেনার পর আপনি কি কি করতে পারবেন? সঠিক অ্যাকশন প্ল্যান' : 'What can you do after buying land? Custom Action Plan & ROI Roadmap'}
                        </h2>
                        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            ${lang === 'bn' ? 'আপনার জমির আয়তন ও মাটির ধরণ অনুযায়ী সর্বাধিক লাভজনক ব্যবহারের সুপারিশ, আনুমানিক বাজেট, বার্ষিক মুনাফা, সরকারি ৪% কৃষি ঋণ সুবিধা এবং ৫০ দিনের আইনি নামজারি রোডম্যাপ।' : 'Comprehensive recommendations tailored to your parcel: high-value agro-horticulture, crop rotation, aquaculture, livestock, warehouses, budget estimations, and mandatory legal mutation checklists.'}
                        </p>
                    </div>
                </div>

                <!-- Section 1: Interactive Land Planning Generator Form -->
                <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-4">
                        <div>
                            <h3 class="text-lg font-black text-slate-900 flex items-center gap-2">
                                <i class="fa-solid fa-sliders text-emerald-600"></i>
                                <span>${lang === 'bn' ? 'আপনার জমির জন্য কাস্টম পরিকল্পনা তৈরি করুন' : 'Generate Custom Land Plan for Your Plot'}</span>
                            </h3>
                            <p class="text-xs text-slate-500">${lang === 'bn' ? 'নিচের তথ্যগুলো নির্বাচন করে "প্ল্যান তৈরি করুন" বাটনে চাপ দিন' : 'Select parcel parameters below to calculate budgets, yields, and execution timelines'}</p>
                        </div>
                        <span class="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-mono font-bold">
                            AI-Powered Cadastral Engine
                        </span>
                    </div>

                    <form id="advisor-planner-form" onsubmit="window.handleGeneratePlanSubmit(event)" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-700 uppercase mb-1.5">${lang === 'bn' ? 'জমির প্লট নির্বাচন' : 'Select Registered Plot'}</label>
                            <select id="adv-plot-select" onchange="window.handleAdvisorPlotChange(this.value)" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                                <option value="custom">${lang === 'bn' ? 'কাস্টম নতুন জমি (Custom Plot)' : 'Custom Plot / New Purchase'}</option>
                                ${userPlots.map(p => `
                                    <option value="${p.id}" ${currentAdvisorPlanResult && currentAdvisorPlanResult.plotId === p.id ? 'selected' : ''}>
                                        ${p.landNumber} - ${lang === 'bn' ? (p.mouzaBn || p.mouza) : p.mouza} (${p.area})
                                    </option>
                                `).join('')}
                            </select>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-700 uppercase mb-1.5">${lang === 'bn' ? 'জমির আয়তন (শতাংশ / Decimals)' : 'Land Area (Decimals)'}</label>
                            <input type="number" step="0.5" id="adv-area-input" required value="${currentAdvisorPlanResult ? currentAdvisorPlanResult.area : 33}" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                            <span class="text-[10px] text-slate-400 font-mono mt-0.5 block">${lang === 'bn' ? '৩৩ শতাংশ = ১ বিঘা | ১০০ শতাংশ = ১ একর' : '33 Decimals = 1 Bigha | 100 Decimals = 1 Acre'}</span>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-700 uppercase mb-1.5">${lang === 'bn' ? 'ব্যবহারের প্রধান লক্ষ্য / মডেল' : 'Primary Utilization Model'}</label>
                            <select id="adv-purpose-select" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                                ${templates.models.map(m => `
                                    <option value="${m.key}" ${currentAdvisorPlanResult && currentAdvisorPlanResult.purposeKey === m.key ? 'selected' : ''}>
                                        ${lang === 'bn' ? m.nameBn : m.nameEn}
                                    </option>
                                `).join('')}
                            </select>
                        </div>

                        <div class="flex items-end">
                            <button type="submit" class="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/25 transition flex items-center justify-center gap-2">
                                <i class="fa-solid fa-wand-magic-sparkles"></i>
                                <span>${lang === 'bn' ? 'পরিপূর্ণ পরিকল্পনা তৈরি করুন' : 'Generate Full Action Plan'}</span>
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Section 2: Generated Custom Plan Presentation Result -->
                <div id="advisor-plan-result-box" class="space-y-6">
                    ${renderAdvisorPlanResultCard(currentAdvisorPlanResult, lang)}
                </div>

                <!-- Section 3: 7 Pre-Built Utilization Models Overview -->
                <div class="space-y-4">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                            <h3 class="text-xl font-black text-slate-900">${lang === 'bn' ? '৭টি সেরা লাভজনক ভূমি ব্যবহার মডেলের তুলনামূলক বিশ্লেষণ' : '7 High-Return Land Utilization Models Comparison'}</h3>
                            <p class="text-xs text-slate-500">${lang === 'bn' ? 'আপনার জমির ধরণ ও বাজেটের সাথে মানানসই সেরা মডেলটি বেছে নিন' : 'Compare start-up investment, expected yields, break-even timelines, and govt subsidies'}</p>
                        </div>
                        <span class="text-xs font-mono text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full font-bold">
                            Official DAE Standards 2026
                        </span>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${templates.models.map(m => `
                            <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-emerald-500 transition card-hover-effect flex flex-col justify-between">
                                <div class="space-y-4">
                                    <div class="flex items-start justify-between gap-3">
                                        <div class="w-12 h-12 rounded-2xl bg-${m.color === 'emerald' ? 'emerald' : m.color === 'amber' ? 'amber' : m.color === 'blue' ? 'blue' : m.color === 'rose' ? 'rose' : m.color === 'teal' ? 'teal' : 'indigo'}-100 text-${m.color === 'emerald' ? 'emerald' : m.color === 'amber' ? 'amber' : m.color === 'blue' ? 'blue' : m.color === 'rose' ? 'rose' : m.color === 'teal' ? 'teal' : 'indigo'}-600 flex items-center justify-center text-xl shrink-0">
                                            <i class="fa-solid ${m.icon}"></i>
                                        </div>
                                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-slate-100 text-slate-700">
                                            ${lang === 'bn' ? m.badgeBn : m.badgeEn}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 class="font-bold text-slate-900 text-sm">${lang === 'bn' ? m.nameBn : m.nameEn}</h4>
                                        <p class="text-xs text-slate-500 mt-1 leading-relaxed">${lang === 'bn' ? m.overviewBn : m.overviewEn}</p>
                                    </div>

                                    <div class="space-y-2 pt-2 border-t border-slate-100 text-xs">
                                        <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                            <span class="text-slate-400 block font-semibold text-[10px]">${lang === 'bn' ? 'উপযুক্ত জমি ও মাটি' : 'Suitability'}</span>
                                            <span class="font-bold text-slate-700">${lang === 'bn' ? m.suitabilityBn : m.suitabilityEn}</span>
                                        </div>
                                        <div class="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                                            <span class="text-emerald-600 block font-semibold text-[10px]">${lang === 'bn' ? 'সম্ভাব্য লাভ ও আয়' : 'Yield & Profit'}</span>
                                            <span class="font-bold text-emerald-800">${lang === 'bn' ? m.expectedYieldBn : m.expectedYieldEn}</span>
                                        </div>
                                        <div class="text-[11px] text-slate-500 font-mono">
                                            ${lang === 'bn' ? m.budgetPerDecBn : m.budgetPerDecEn}
                                        </div>
                                    </div>
                                </div>

                                <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                                    <span class="text-[10px] text-slate-400 font-mono">${lang === 'bn' ? m.roiTimelineBn : m.roiTimelineEn}</span>
                                    <button type="button" onclick="window.selectAdvisorModelPreset('${m.key}')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1">
                                        <span>${lang === 'bn' ? 'প্ল্যান দেখুন' : 'Apply'}</span> &rarr;
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Section 4: 50-Day Mandatory Legal & Mutation Roadmap Timeline -->
                <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-4">
                        <div>
                            <h3 class="text-xl font-black text-slate-900 flex items-center gap-2">
                                <i class="fa-solid fa-scale-balanced text-emerald-600"></i>
                                <span>${lang === 'bn' ? 'জমি ক্রয়ের পর ৫০ দিনের জরুরি আইনি ও নামজারি পরিক্রমা' : '50-Day Mandatory Legal & Mutation Action Timeline'}</span>
                            </h3>
                            <p class="text-xs text-slate-500">${lang === 'bn' ? 'আইনি ঝামেলা ও বেদখল এড়াতে জমি কেনার পরপরই নিচের ৭টি ধাপ অবশ্যই সম্পন্ন করুন' : 'Step-by-step government offices roadmap: e-Mutation, Tahsil inspection, digital DCR, and RCC boundary pillars'}</p>
                        </div>
                        <a href="https://land.gov.bd" target="_blank" class="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5">
                            <i class="fa-solid fa-arrow-up-right-from-square text-emerald-400"></i>
                            <span>land.gov.bd</span>
                        </a>
                    </div>

                    <div class="space-y-4">
                        ${templates.legalRoadmap.map(r => `
                            <div class="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-emerald-50/40 hover:border-emerald-300 transition group">
                                <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center shrink-0 shadow-sm">
                                    ${r.step}
                                </div>
                                <div class="flex-1 space-y-1 min-w-0">
                                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                        <h4 class="font-bold text-slate-900 text-sm group-hover:text-emerald-800 transition">${lang === 'bn' ? r.titleBn : r.titleEn}</h4>
                                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 shrink-0 w-fit">
                                            ${lang === 'bn' ? r.dayRange : r.dayRange}
                                        </span>
                                    </div>
                                    <p class="text-xs text-slate-600 leading-relaxed">${lang === 'bn' ? r.detailsBn : r.detailsEn}</p>
                                    <div class="text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5 pt-1">
                                        <i class="fa-solid fa-building-columns"></i>
                                        <span>${lang === 'bn' ? `কার্যস্থল: ${r.officeBn}` : `Authority: ${r.officeEn}`}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    function renderAdvisorPlanResultCard(plan, lang) {
        if (!plan) return '';
        const m = plan.model;
        return `
            <div id="advisor-printable-plan-area" class="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white border border-emerald-500/40 shadow-2xl relative overflow-hidden space-y-6">
                <!-- Top Ribbon -->
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-5">
                    <div>
                        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                            <i class="fa-solid fa-circle-check"></i>
                            <span>${lang === 'bn' ? 'প্রস্তুতকৃত জমির চূড়ান্ত পরিকল্পনা' : 'Verified Land Action Blueprint 2026'}</span>
                        </div>
                        <h3 class="text-2xl font-black text-white mt-1">
                            ${lang === 'bn' ? m.nameBn : m.nameEn}
                        </h3>
                        <p class="text-xs text-slate-400 font-mono mt-0.5">
                            ${plan.dagNumber} &bull; ${plan.area} ${lang === 'bn' ? 'শতাংশ' : 'Decimals'} (${plan.areaBigha} ${lang === 'bn' ? 'বিঘা' : 'Bigha'}) &bull; ${plan.district}
                        </p>
                    </div>

                    <div class="flex items-center gap-2">
                        <button type="button" onclick="window.printAdvisorPlan()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-700">
                            <i class="fa-solid fa-print text-emerald-400"></i> ${lang === 'bn' ? 'প্রিন্ট / PDF সেভ' : 'Print / Save Plan'}
                        </button>
                        <button type="button" onclick="window.switchPortalTab('officials')" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/30">
                            <i class="fa-solid fa-phone"></i> ${lang === 'bn' ? 'কর্মকর্তাদের সাথে যোগাযোগ' : 'Contact Officials'}
                        </button>
                    </div>
                </div>

                <!-- Financial Feasibility Matrix Grid -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div class="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                        <span class="text-[10px] text-slate-400 font-semibold uppercase block">${lang === 'bn' ? 'আনুমানিক প্রাথমিক বাজেট' : 'Estimated Setup Budget'}</span>
                        <div class="text-lg sm:text-xl font-black text-white font-mono mt-1">৳${plan.financials.minBudget.toLocaleString()} - ৳${plan.financials.maxBudget.toLocaleString()}</div>
                        <span class="text-[10px] text-slate-500 block mt-0.5">${plan.area} ${lang === 'bn' ? 'শতাংশের জন্য' : 'decimals total'}</span>
                    </div>

                    <div class="bg-slate-900/80 border border-emerald-500/30 p-4 rounded-2xl">
                        <span class="text-[10px] text-emerald-400 font-semibold uppercase block">${lang === 'bn' ? 'সম্ভাব্য বার্ষিক নিট লাভ' : 'Expected Annual Net Return'}</span>
                        <div class="text-lg sm:text-xl font-black text-emerald-400 font-mono mt-1">৳${plan.financials.minAnnualReturn.toLocaleString()} - ৳${plan.financials.maxAnnualReturn.toLocaleString()}</div>
                        <span class="text-[10px] text-emerald-300 block mt-0.5">${lang === 'bn' ? '২য় বছর থেকে নিয়মিত' : 'Recurring from Year 2'}</span>
                    </div>

                    <div class="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                        <span class="text-[10px] text-slate-400 font-semibold uppercase block">${lang === 'bn' ? 'আনুমানিক রিটার্ন (ROI)' : 'Estimated Annual ROI'}</span>
                        <div class="text-lg sm:text-xl font-black text-teal-300 font-mono mt-1">${plan.financials.estimatedRoi}</div>
                        <span class="text-[10px] text-slate-500 block mt-0.5">${lang === 'bn' ? 'বার্ষিক শতকরা লাভ' : 'Annualized capital return'}</span>
                    </div>

                    <div class="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                        <span class="text-[10px] text-slate-400 font-semibold uppercase block">${lang === 'bn' ? 'ব্রেক-ইভেন সময়কাল' : 'Break-Even Horizon'}</span>
                        <div class="text-sm font-bold text-amber-300 font-mono mt-1.5">${lang === 'bn' ? m.roiTimelineBn : m.roiTimelineEn}</div>
                        <span class="text-[10px] text-slate-500 block mt-0.5">${lang === 'bn' ? 'মূলধন ফেরত আসার সময়' : 'Capital recovery window'}</span>
                    </div>
                </div>

                <!-- 12-Month Step-by-Step Action Roadmap with Interactive Checkboxes -->
                <div class="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
                    <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h4 class="font-bold text-white text-sm flex items-center gap-2">
                            <i class="fa-solid fa-calendar-check text-emerald-400"></i>
                            <span>${lang === 'bn' ? '১২ মাসের বাস্তবায়ন চেকলিস্ট ও সময়সূচি' : '12-Month Execution Milestone Checklist'}</span>
                        </h4>
                        <span class="text-[11px] text-emerald-400 font-mono">${lang === 'bn' ? 'ধাপ অনুযায়ী টিক দিন' : 'Interactive Checkpoints'}</span>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        ${plan.timeline12Months.map((item, idx) => `
                            <div class="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-emerald-500/50 transition">
                                <input type="checkbox" id="chk-step-${idx}" class="w-4 h-4 rounded border-slate-700 text-emerald-600 focus:ring-0 mt-0.5 cursor-pointer accent-emerald-500">
                                <label for="chk-step-${idx}" class="cursor-pointer select-none">
                                    <span class="font-bold text-emerald-300 font-mono block">${lang === 'bn' ? item.monthBn : item.monthEn}</span>
                                    <span class="text-slate-300 leading-snug block mt-0.5">${lang === 'bn' ? item.taskBn : item.taskEn}</span>
                                </label>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Government Grants, Subsidies & 4% Concessional Agri-Loan Notice -->
                <div class="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 flex items-start gap-3 text-xs">
                    <i class="fa-solid fa-hand-holding-dollar text-emerald-400 text-lg mt-0.5 shrink-0"></i>
                    <div class="space-y-1">
                        <span class="font-bold text-emerald-300 block">${lang === 'bn' ? 'সরকারি অনুদান ও ৪% রেয়াতি সুদের কৃষি ঋণ সুবিধা:' : 'Government Grants & 4% Concessional Agriculture Loan:'}</span>
                        <p class="text-emerald-100 leading-relaxed">${lang === 'bn' ? m.subsidyBn : m.subsidyEn}</p>
                    </div>
                </div>
            </div>
        `;
    }

    window.handleGeneratePlanSubmit = function (e) {
        e.preventDefault();
        const area = parseFloat(document.getElementById('adv-area-input').value) || 33;
        const purpose = document.getElementById('adv-purpose-select').value;
        const plotId = document.getElementById('adv-plot-select').value;

        let plotObj = null;
        if (plotId !== 'custom') {
            plotObj = GeoTerraStore.getLandById(plotId);
        }

        const lang = GeoTerraStore.getLanguage();
        currentAdvisorPlanResult = GeoTerraStore.generateLandPlan({
            plotId: plotObj ? plotObj.id : 'custom-land',
            dagNumber: plotObj ? plotObj.landNumber : 'DAG-' + Math.floor(1000 + Math.random() * 9000),
            mouza: plotObj ? (lang === 'bn' ? plotObj.mouzaBn || plotObj.mouza : plotObj.mouza) : 'Gazipur / Custom Mouza',
            district: plotObj ? plotObj.district : 'Gazipur',
            landArea: area,
            purpose: purpose
        });

        const box = document.getElementById('advisor-plan-result-box');
        if (box) {
            box.innerHTML = renderAdvisorPlanResultCard(currentAdvisorPlanResult, lang);
            box.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        GeoTerraStore.showToast('Plan Generated', 'Custom land action blueprint has been calculated.', 'success');
    };

    window.handleAdvisorPlotChange = function (val) {
        if (val !== 'custom') {
            const plot = GeoTerraStore.getLandById(val);
            if (plot && plot.area) {
                const m = plot.area.match(/([0-9.]+)/);
                if (m) document.getElementById('adv-area-input').value = parseFloat(m[1]);
            }
        }
    };

    window.selectAdvisorModelPreset = function (modelKey) {
        const sel = document.getElementById('adv-purpose-select');
        if (sel) {
            sel.value = modelKey;
            const form = document.getElementById('advisor-planner-form');
            if (form) {
                const event = new Event('submit', { cancelable: true });
                form.dispatchEvent(event);
            }
        }
    };

    window.printAdvisorPlan = function () {
        window.print();
    };

    // =========================================================================
    // Tab 2: Agricultural Weather Forecast & Live Climate Center (কৃষি আবহাওয়া কেন্দ্র)
    // =========================================================================
    let currentWeatherActiveDistrict = 'Dhaka';

    function renderWeatherTab(lang, user) {
        if (user && user.district && !currentWeatherActiveDistrict) {
            currentWeatherActiveDistrict = user.district;
        }

        const weatherData = GeoTerraStore.getDistrictWeather(currentWeatherActiveDistrict);
        const allWeathers = GeoTerraStore.getAllDistrictWeathers();
        const districtList = Object.keys(allWeathers);

        return `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
                <!-- Weather Center Header -->
                <div class="bg-gradient-to-r from-slate-950 via-teal-950 to-slate-900 p-6 sm:p-8 rounded-3xl border border-teal-500/30 text-white shadow-xl relative overflow-hidden">
                    <div class="absolute -right-16 -top-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div class="relative z-10 max-w-3xl space-y-3">
                        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-mono font-bold uppercase tracking-wider border border-teal-500/30">
                            <i class="fa-solid fa-cloud-sun"></i>
                            <span>${lang === 'bn' ? 'বাংলাদেশ কৃষি আবহাওয়া ও জলবায়ু কেন্দ্র' : 'Agro-Meteorological Climate Center 2026'}</span>
                        </div>
                        <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight">
                            ${lang === 'bn' ? 'সারাদেশের কৃষি আবহাওয়া পূর্বাভাস ও পরামর্শ বার্তা' : 'National Agricultural Weather Station & 5-Day Agro-Forecast'}
                        </h2>
                        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            ${lang === 'bn' ? 'তাপমাত্রা, আর্দ্রতা, বৃষ্টিপাতের পূর্বাভাস, মাটির তাপমাত্রা এবং ফসলে সার ও বালাইনাশক স্প্রে করার উপযুক্ত সময় পর্যবেক্ষণ করুন।' : 'Real-time microclimate metrics across all 64 districts: temperature, precipitation probability, soil moisture, and farming advisories.'}
                        </p>
                    </div>
                </div>

                <!-- District Selector Navigation Bar -->
                <div class="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-bold text-slate-700 uppercase tracking-wider">${lang === 'bn' ? 'জেলা নির্বাচন করুন:' : 'Select District:'}</span>
                    </div>

                    <!-- Horizontal Scrollable District Pills -->
                    <div class="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
                        ${districtList.map(dist => {
                            const dObj = allWeathers[dist];
                            const isSelected = currentWeatherActiveDistrict.toLowerCase() === dist.toLowerCase();
                            return `
                                <button type="button" onclick="window.changeWeatherDistrict('${dist}')" 
                                    class="px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${isSelected ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}">
                                    ${lang === 'bn' ? dObj.districtBn : dist} (${dObj.temp}&deg;C)
                                </button>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- Main Active District Meteorological Dashboard -->
                <div class="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white border border-teal-500/30 shadow-2xl relative overflow-hidden space-y-6">
                    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-slate-800 pb-6">
                        <div class="space-y-2">
                            <div class="flex items-center gap-2">
                                <span class="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-mono font-bold">
                                    <span class="w-2 h-2 rounded-full bg-teal-400 inline-block animate-ping mr-1"></span>
                                    LIVE METEOROLOGICAL STATION
                                </span>
                                <span class="text-xs text-slate-400 font-mono">${lang === 'bn' ? weatherData.division + ' বিভাগ' : weatherData.division + ' Division'}</span>
                            </div>
                            <h3 class="text-3xl font-black text-white">
                                ${lang === 'bn' ? weatherData.districtBn : weatherData.district}
                            </h3>
                            <div class="flex items-center gap-4">
                                <div class="text-5xl font-black font-mono text-white flex items-center gap-3">
                                    <span>${weatherData.temp}&deg;C</span>
                                    <i class="fa-solid ${weatherData.icon} text-amber-400 text-4xl"></i>
                                </div>
                                <div class="border-l border-slate-800 pl-4">
                                    <div class="text-base font-bold text-teal-300">${lang === 'bn' ? weatherData.conditionBn : weatherData.conditionEn}</div>
                                    <div class="text-xs text-slate-400 font-mono">${lang === 'bn' ? `অনুভূত: ${weatherData.feelsLike}°C` : `Feels like: ${weatherData.feelsLike}°C`}</div>
                                </div>
                            </div>
                        </div>

                        <!-- 8 Microclimate Parameters Grid -->
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
                            <div class="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl text-center">
                                <span class="text-[10px] text-slate-400 uppercase font-semibold block">${lang === 'bn' ? 'আর্দ্রতা' : 'Humidity'}</span>
                                <span class="text-sm font-bold text-white font-mono">${weatherData.humidity}</span>
                            </div>
                            <div class="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl text-center">
                                <span class="text-[10px] text-slate-400 uppercase font-semibold block">${lang === 'bn' ? 'বৃষ্টিপাতের শঙ্কা' : 'Rain Chance'}</span>
                                <span class="text-sm font-bold text-teal-400 font-mono">${weatherData.rainChance}</span>
                            </div>
                            <div class="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl text-center">
                                <span class="text-[10px] text-slate-400 uppercase font-semibold block">${lang === 'bn' ? 'বাতাসের বেগ' : 'Wind Speed'}</span>
                                <span class="text-xs font-bold text-white font-mono">${escapeHtml(weatherData.wind)}</span>
                            </div>
                            <div class="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl text-center">
                                <span class="text-[10px] text-slate-400 uppercase font-semibold block">${lang === 'bn' ? 'অতিবেগুনী রশ্মি' : 'UV Index'}</span>
                                <span class="text-xs font-bold text-amber-400 font-mono">${escapeHtml(weatherData.uvIndex)}</span>
                            </div>
                            <div class="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl text-center">
                                <span class="text-[10px] text-slate-400 uppercase font-semibold block">${lang === 'bn' ? 'মাটির আর্দ্রতা' : 'Soil Moisture'}</span>
                                <span class="text-xs font-bold text-emerald-400 font-mono">${escapeHtml(weatherData.soilMoisture)}</span>
                            </div>
                            <div class="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl text-center">
                                <span class="text-[10px] text-slate-400 uppercase font-semibold block">${lang === 'bn' ? 'মাটির তাপমাত্রা' : 'Soil Temp'}</span>
                                <span class="text-xs font-bold text-white font-mono">${escapeHtml(weatherData.soilTemp)}</span>
                            </div>
                            <div class="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl text-center">
                                <span class="text-[10px] text-slate-400 uppercase font-semibold block">${lang === 'bn' ? 'বায়ুমান সূচক' : 'Air Quality'}</span>
                                <span class="text-xs font-bold text-teal-300 font-mono">${escapeHtml(weatherData.airQuality)}</span>
                            </div>
                            <div class="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl text-center">
                                <span class="text-[10px] text-slate-400 uppercase font-semibold block">${lang === 'bn' ? 'সেচ অবস্থা' : 'Irrigation'}</span>
                                <span class="text-xs font-bold text-emerald-400 font-mono">${lang === 'bn' ? 'অনুকূল' : 'Optimal'}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Agro-Meteorological Advisories (কৃষি পরামর্শ বার্তা) -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div class="bg-slate-900/80 border border-emerald-500/30 p-4 rounded-2xl space-y-1.5">
                            <div class="flex items-center gap-2 text-emerald-300 font-bold">
                                <i class="fa-solid fa-seedling text-emerald-400"></i>
                                <span>${lang === 'bn' ? 'শস্য ব্যবস্থাপনা ও সেচ পরামর্শ' : 'Crop & Irrigation Advisory'}</span>
                            </div>
                            <p class="text-slate-300 leading-relaxed">${lang === 'bn' ? weatherData.agriAdvisory.cropAdviceBn : weatherData.agriAdvisory.cropAdviceEn}</p>
                        </div>

                        <div class="bg-slate-900/80 border border-amber-500/30 p-4 rounded-2xl space-y-1.5">
                            <div class="flex items-center gap-2 text-amber-300 font-bold">
                                <i class="fa-solid fa-spray-can-sparkles text-amber-400"></i>
                                <span>${lang === 'bn' ? 'বালাইনাশক ও সার স্প্রে করার পূর্বাভাস' : 'Pesticide & Spray Weather Window'}</span>
                            </div>
                            <p class="text-slate-300 leading-relaxed">${lang === 'bn' ? weatherData.agriAdvisory.sprayAlertBn : weatherData.agriAdvisory.sprayAlertEn}</p>
                            <span class="text-[11px] text-slate-400 block font-mono">${lang === 'bn' ? weatherData.agriAdvisory.specialAlertBn : ''}</span>
                        </div>
                    </div>
                </div>

                <!-- 5-Day Agricultural Weather Forecast Grid -->
                <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-4">
                        <div>
                            <h3 class="text-xl font-black text-slate-900 flex items-center gap-2">
                                <i class="fa-solid fa-calendar-days text-teal-600"></i>
                                <span>${lang === 'bn' ? '৫ দিনের বিস্তারিত কৃষি আবহাওয়া পূর্বাভাস' : '5-Day Agricultural Weather Forecast'}</span>
                            </h3>
                            <p class="text-xs text-slate-500">${lang === 'bn' ? 'প্রতিদিনের আবহাওয়া ও কৃষকদের জন্য করণীয় অ্যাকশন' : 'Daily temperature swings, rain chances, and practical farming suggestions'}</p>
                        </div>
                        <span class="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full">
                            Synced via BMD API
                        </span>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        ${weatherData.forecast5Day.map((fc, i) => `
                            <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-3 hover:border-teal-500 transition card-hover-effect">
                                <div class="font-bold text-slate-800 text-sm">${lang === 'bn' ? fc.dayBn : fc.dayEn}</div>
                                <div class="w-12 h-12 mx-auto rounded-2xl bg-white shadow-xs flex items-center justify-center text-2xl text-amber-500">
                                    <i class="fa-solid ${fc.icon}"></i>
                                </div>
                                <div class="space-y-0.5">
                                    <div class="text-lg font-black text-slate-900 font-mono">${fc.maxTemp}&deg;C <span class="text-xs font-normal text-slate-400">/ ${fc.minTemp}&deg;C</span></div>
                                    <div class="text-[11px] text-teal-700 font-semibold font-mono">
                                        <i class="fa-solid fa-cloud-showers-heavy text-[10px]"></i> ${fc.rainChance}
                                    </div>
                                </div>
                                <div class="pt-2 border-t border-slate-200 text-[11px] text-slate-600 leading-snug">
                                    ${lang === 'bn' ? fc.adviceBn : fc.adviceEn}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    window.changeWeatherDistrict = function (dist) {
        currentWeatherActiveDistrict = dist;
        const lang = GeoTerraStore.getLanguage();
        const user = GeoTerraStore.getUserSession();
        const app = document.getElementById('portal-app');
        if (app) {
            renderPortal();
        }
    };

    // =========================================================================
    // Tab 3: District Land & Agriculture Officials Directory (কর্মকর্তা তালিকা)
    // =========================================================================
    let currentOfficialsDivision = 'all';
    let currentOfficialsSector = 'all';
    let currentOfficialsSearch = '';

    function renderOfficialsTab(lang, user) {
        const officials = GeoTerraStore.getLandOfficials({
            division: currentOfficialsDivision,
            sector: currentOfficialsSector,
            search: currentOfficialsSearch
        });

        const divisions = [
            { id: 'all', nameBn: 'সকল বিভাগ', nameEn: 'All Divisions' },
            { id: 'Dhaka', nameBn: 'ঢাকা', nameEn: 'Dhaka' },
            { id: 'Chittagong', nameBn: 'চট্টগ্রাম', nameEn: 'Chittagong' },
            { id: 'Rajshahi', nameBn: 'রাজশাহী', nameEn: 'Rajshahi' },
            { id: 'Khulna', nameBn: 'খুলনা', nameEn: 'Khulna' },
            { id: 'Barisal', nameBn: 'বরিশাল', nameEn: 'Barisal' },
            { id: 'Sylhet', nameBn: 'সিলেট', nameEn: 'Sylhet' },
            { id: 'Rangpur', nameBn: 'রংপুর', nameEn: 'Rangpur' },
            { id: 'Mymensingh', nameBn: 'ময়মনসিংহ', nameEn: 'Mymensingh' }
        ];

        return `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
                <!-- Header -->
                <div class="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 p-6 sm:p-8 rounded-3xl border border-blue-500/30 text-white shadow-xl relative overflow-hidden">
                    <div class="absolute -right-16 -top-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div class="relative z-10 max-w-3xl space-y-3">
                        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-bold uppercase tracking-wider border border-blue-500/30">
                            <i class="fa-solid fa-building-columns"></i>
                            <span>${lang === 'bn' ? 'জাতীয় ভূমি ও কৃষি কর্মকর্তা ডিরেক্টরি' : 'Govt Land & Agriculture Bureau Directory'}</span>
                        </div>
                        <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight">
                            ${lang === 'bn' ? 'জেলার কৃষি এবং ভূমি সংক্রান্ত গুরুত্বপূর্ণ কর্মকর্তাদের তালিকা ও নম্বর' : 'District Land & Agriculture Officials Direct Calling Directory'}
                        </h2>
                        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            ${lang === 'bn' ? 'সকল জেলার সহকারী কমিশনার (ভূমি), সাব-রেজিস্ট্রার, এডিসি রাজস্ব এবং কৃষি সম্প্রসারণ অধিদপ্তরের (DAE) ভেরিফাইড যোগাযোগের নম্বর ও ১-ক্লিকে সরাসরি কল।' : 'Verified contacts for Assistant Commissioners (Land), District Sub-Registrars, ADC Revenue, and Upazila Agriculture Officers across all divisions.'}
                        </p>
                    </div>
                </div>

                <!-- Filters & Search Toolbar -->
                <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <!-- Sector Filter Buttons -->
                        <div class="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl w-full sm:w-auto">
                            <button type="button" onclick="window.filterOfficialsSector('all')" 
                                class="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition ${currentOfficialsSector === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:text-blue-600'}">
                                ${lang === 'bn' ? 'সকল কর্মকর্তা' : 'All Officials'}
                            </button>
                            <button type="button" onclick="window.filterOfficialsSector('land')" 
                                class="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition ${currentOfficialsSector === 'land' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-700 hover:text-indigo-600'}">
                                <i class="fa-solid fa-landmark text-indigo-400 mr-1"></i> ${lang === 'bn' ? 'ভূমি প্রশাসন ও রেজিস্ট্রি' : 'Land & Registry'}
                            </button>
                            <button type="button" onclick="window.filterOfficialsSector('agriculture')" 
                                class="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition ${currentOfficialsSector === 'agriculture' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-700 hover:text-emerald-600'}">
                                <i class="fa-solid fa-seedling text-emerald-400 mr-1"></i> ${lang === 'bn' ? 'কৃষি সম্প্রসারণ ও মৃত্তিকা' : 'Agriculture & Soil'}
                            </button>
                        </div>

                        <!-- Live Search Bar -->
                        <div class="relative w-full lg:w-80">
                            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                                <i class="fa-solid fa-magnifying-glass text-xs"></i>
                            </span>
                            <input type="text" id="officials-search-input" value="${escapeHtml(currentOfficialsSearch)}" oninput="window.handleOfficialsLiveSearch(this.value)" 
                                placeholder="${lang === 'bn' ? 'কর্মকর্তা, পদবি, জেলা বা নম্বর খুঁজুন...' : 'Search officer, title, district or phone...'}"
                                class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none">
                        </div>
                    </div>

                    <!-- Division Filter Pills -->
                    <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-slate-100 pt-3">
                        <span class="text-xs font-bold text-slate-400 uppercase shrink-0 mr-1">${lang === 'bn' ? 'বিভাগ:' : 'Division:'}</span>
                        ${divisions.map(d => {
                            const isSel = currentOfficialsDivision.toLowerCase() === d.id.toLowerCase();
                            return `
                                <button type="button" onclick="window.filterOfficialsDivision('${d.id}')" 
                                    class="px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition ${isSel ? 'bg-slate-900 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}">
                                    ${lang === 'bn' ? d.nameBn : d.nameEn}
                                </button>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- Officials Cards Grid -->
                <div id="officials-cards-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${renderOfficialsCardsList(officials, lang)}
                </div>

                <!-- Citizen Guidance: Which Officer to Approach for What Service -->
                <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <h3 class="text-lg font-black text-slate-900 flex items-center gap-2">
                        <i class="fa-solid fa-circle-question text-blue-600"></i>
                        <span>${lang === 'bn' ? 'নাগরিক নির্দেশিকা: কোন কাজের জন্য কার কাছে যাবেন?' : 'Citizen Quick Guide: Which Officer to Approach'}</span>
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div class="bg-indigo-50/70 border border-indigo-200 p-4 rounded-2xl space-y-1.5">
                            <span class="font-bold text-indigo-900 block text-sm">১. সহকারী কমিশনার (ভূমি) / এসি ল্যান্ড</span>
                            <p class="text-indigo-800 leading-relaxed">ই-নামজারি ও জমাভাগ, খতিয়ান সংশোধন, মিসকেস নিষ্পত্তি, ডিসিআর প্রদান এবং মৌজা সীমানা বিরোধের শুনানি।</p>
                        </div>
                        <div class="bg-blue-50/70 border border-blue-200 p-4 rounded-2xl space-y-1.5">
                            <span class="font-bold text-blue-900 block text-sm">২. সাব-রেজিস্ট্রার / জেলা রেজিস্ট্রার</span>
                            <p class="text-blue-800 leading-relaxed">জমির সাফ-কবলা, দানপত্র, হেবা দলিল রেজিস্ট্রি, মূল দলিলের নকল উত্তোলন, বায়নানামা এবং দলিলের তল্লাশি সনদ।</p>
                        </div>
                        <div class="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl space-y-1.5">
                            <span class="font-bold text-emerald-900 block text-sm">৩. উপজেলা কৃষি অফিসার ও SRDI</span>
                            <p class="text-emerald-800 leading-relaxed">মাটি পরীক্ষা (pH ও উর্বরতা), সরকারি বিনামূল্যে সার-বীজ প্রণোদনা, বালাই দমন পরামর্শ ও ৪% রেয়াতি কৃষি ঋণ সুপারিশ।</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderOfficialsCardsList(officials, lang) {
        if (!officials || officials.length === 0) {
            return `
                <div class="col-span-full py-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500">
                    <i class="fa-solid fa-user-slash text-3xl mb-2 text-slate-400"></i>
                    <p class="text-sm font-semibold">${lang === 'bn' ? 'কোনো কর্মকর্তার তথ্য পাওয়া যায়নি।' : 'No officials found matching the filter.'}</p>
                </div>
            `;
        }

        return officials.map(off => {
            const isLand = off.sector === 'land';
            const badgeBg = isLand ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800';
            const callBtnBg = isLand ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-emerald-600 hover:bg-emerald-700';

            return `
                <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-blue-500 transition card-hover-effect flex flex-col justify-between space-y-4">
                    <div class="space-y-3">
                        <div class="flex items-start justify-between gap-3">
                            <div>
                                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${badgeBg}">
                                    ${lang === 'bn' ? off.sectorBn : (isLand ? 'Land & Registry' : 'Agriculture & Soil')}
                                </span>
                                <h4 class="font-black text-slate-900 text-base mt-2">${lang === 'bn' ? off.officerNameBn : off.officerNameEn}</h4>
                                <p class="text-xs font-bold text-blue-700 mt-0.5">${lang === 'bn' ? off.titleBn : off.titleEn}</p>
                            </div>
                            <div class="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                                <i class="fa-solid ${isLand ? 'fa-landmark' : 'fa-seedling'}"></i>
                            </div>
                        </div>

                        <div class="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                            <div class="flex items-center gap-2">
                                <i class="fa-solid fa-location-dot text-slate-400 w-4"></i>
                                <span class="truncate"><strong>${lang === 'bn' ? off.districtBn : off.district}:</strong> ${lang === 'bn' ? off.officeBn : off.officeEn}</span>
                            </div>
                            <div class="flex items-center gap-2 font-mono">
                                <i class="fa-solid fa-phone text-emerald-500 w-4"></i>
                                <span>Mobile: <strong>${off.phone}</strong></span>
                            </div>
                            ${off.landline ? `
                                <div class="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                                    <i class="fa-solid fa-square-phone text-slate-400 w-4"></i>
                                    <span>Phone: ${off.landline}</span>
                                </div>
                            ` : ''}
                        </div>

                        <!-- Services Badge List -->
                        <div class="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-[11px] text-slate-700">
                            <span class="text-slate-400 font-bold block text-[10px] uppercase mb-1">${lang === 'bn' ? 'প্রদত্ত নাগরিক সেবাসমূহ:' : 'Services Provided:'}</span>
                            <p class="leading-relaxed">${lang === 'bn' ? off.servicesBn : off.servicesEn}</p>
                        </div>
                    </div>

                    <!-- Direct Call & Action Buttons -->
                    <div class="pt-3 border-t border-slate-100 flex items-center gap-2">
                        <a href="tel:${off.phone}" class="flex-1 py-2.5 ${callBtnBg} text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm">
                            <i class="fa-solid fa-phone-volume"></i>
                            <span>${lang === 'bn' ? 'সরাসরি কল' : 'Call Officer'}</span>
                        </a>
                        ${off.email ? `
                            <a href="mailto:${off.email}" class="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center" title="${off.email}">
                                <i class="fa-solid fa-envelope"></i>
                            </a>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    window.filterOfficialsSector = function (sec) {
        currentOfficialsSector = sec;
        const grid = document.getElementById('officials-cards-grid');
        if (grid) {
            const list = GeoTerraStore.getLandOfficials({
                division: currentOfficialsDivision,
                sector: currentOfficialsSector,
                search: currentOfficialsSearch
            });
            grid.innerHTML = renderOfficialsCardsList(list, GeoTerraStore.getLanguage());
        }
    };

    window.filterOfficialsDivision = function (div) {
        currentOfficialsDivision = div;
        const grid = document.getElementById('officials-cards-grid');
        if (grid) {
            const list = GeoTerraStore.getLandOfficials({
                division: currentOfficialsDivision,
                sector: currentOfficialsSector,
                search: currentOfficialsSearch
            });
            grid.innerHTML = renderOfficialsCardsList(list, GeoTerraStore.getLanguage());
        }
    };

    window.handleOfficialsLiveSearch = function (q) {
        currentOfficialsSearch = q.trim();
        const grid = document.getElementById('officials-cards-grid');
        if (grid) {
            const list = GeoTerraStore.getLandOfficials({
                division: currentOfficialsDivision,
                sector: currentOfficialsSector,
                search: currentOfficialsSearch
            });
            grid.innerHTML = renderOfficialsCardsList(list, GeoTerraStore.getLanguage());
        }
    };


    // --- Helper: Parse Latitude and Longitude from Coordinates String ---
    function parseLatLong(coordStr) {
        if (!coordStr) return null;
        const matches = coordStr.match(/([0-9]+\.[0-9]+|[0-9]+)/g);
        if (matches && matches.length >= 2) {
            return {
                lat: parseFloat(matches[0]),
                lng: parseFloat(matches[1])
            };
        }
        return null;
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

})(window);
