/**
 * Smart Land Mapping (স্মার্ট ল্যান্ড ম্যাপিং) - Master Admin Panel Script
 * Full Website Control: Bilingual CMS Settings (Bangla & English), Universal Plots, Users, Approvals, & Backups
 */

(function () {
    'use strict';

    let currentAdminTab = 'overview';
    let plotFilter = 'all';
    let plotSearchQuery = '';
    let userSearchQuery = '';
    let weatherSearchQuery = '';
    let officialSearchQuery = '';
    let officialSectorFilter = 'all';
    let officialDivisionFilter = 'all';
    let policeSearchQuery = '';
    let policeDivisionFilter = 'all';
    let galleryCategoryFilter = 'all';

    let editingPlotId = null;
    let editingUsername = null;
    let editingSlideId = null;
    let editingOfficialId = null;
    let editingPoliceId = null;
    let editingGalleryId = null;
    let editingWeatherDistrict = null;
    let editingAdvisorModelKey = null;

    let adminLiveMapInstance = null;

    // --- Security, Inactivity & Robot Verification State ---
    let isRobotVerified = false;
    let robotVerificationCode = '';
    let robotMathAnswer = null;
    let robotVerificationTimestamp = 0;
    let lockoutCountdownTimer = null;
    let sessionCountdownInterval = null;
    const MAX_INACTIVITY_MS = 15 * 60 * 1000; // 15 Minutes Inactivity Timeout

    document.addEventListener('DOMContentLoaded', () => {
        checkSecretUrlParam();
        setupInactivityTracker();
        initAdminPanel();
        setupSyncListener();
    });

    function checkSecretUrlParam() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const key = urlParams.get('key') || urlParams.get('access') || urlParams.get('token') || urlParams.get('passkey');
            if (key) {
                if (GeoTerraStore.verifyAdminSecretKey(key)) {
                    sessionStorage.setItem('geoterra_admin_gate_cleared', 'true');
                    GeoTerraStore.showToast('Clearance Verified', 'Authorized secret administrative link accepted.', 'success');
                    if (window.history && window.history.replaceState) {
                        window.history.replaceState({}, document.title, window.location.pathname);
                    }
                } else {
                    GeoTerraStore.addActivityLog('Unauthorized Gate Attempt', `Invalid URL parameter key tried.`, 'Gatekeeper');
                    GeoTerraStore.showToast('Access Denied', 'Invalid secret access clearance key.', 'error');
                }
            }
        } catch (e) {}
    }

    function isGateCleared() {
        return sessionStorage.getItem('geoterra_admin_gate_cleared') === 'true';
    }

    function setupSyncListener() {
        window.addEventListener('geoterra-data-synced', () => {
            renderAdminPanel();
        });
    }

    function setupInactivityTracker() {
        const resetActivity = () => {
            const session = GeoTerraStore.getAdminSession();
            if (session) {
                GeoTerraStore.touchAdminSession();
            }
        };

        window.addEventListener('mousemove', resetActivity, { passive: true });
        window.addEventListener('keydown', resetActivity, { passive: true });
        window.addEventListener('click', resetActivity, { passive: true });
        window.addEventListener('scroll', resetActivity, { passive: true });
        window.addEventListener('touchstart', resetActivity, { passive: true });
    }

    function startSessionCountdownTimer() {
        if (sessionCountdownInterval) clearInterval(sessionCountdownInterval);

        sessionCountdownInterval = setInterval(() => {
            const session = GeoTerraStore.getAdminSession();
            if (!session) {
                clearInterval(sessionCountdownInterval);
                sessionCountdownInterval = null;
                sessionStorage.removeItem('geoterra_admin_gate_cleared');
                renderAdminPanel();
                return;
            }

            const now = Date.now();
            const lastActive = session.lastActiveAt || now;
            const elapsed = now - lastActive;
            const remainingMs = Math.max(0, MAX_INACTIVITY_MS - elapsed);

            if (remainingMs <= 0) {
                clearInterval(sessionCountdownInterval);
                sessionCountdownInterval = null;
                GeoTerraStore.clearAdminSession('Inactivity timeout (15m)');
                sessionStorage.removeItem('geoterra_admin_gate_cleared');
                GeoTerraStore.showToast('Session Expired', 'Admin session terminated due to 15 minutes of inactivity for security.', 'info');
                renderAdminPanel();
                return;
            }

            const totalSecs = Math.floor(remainingMs / 1000);
            const mins = Math.floor(totalSecs / 60);
            const secs = totalSecs % 60;
            const displayEl = document.getElementById('session-countdown-display');
            if (displayEl) {
                displayEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            }
        }, 1000);
    }

    function initAdminPanel() {
        renderAdminPanel();
    }

    function renderAdminPanel() {
        const app = document.getElementById('admin-app');
        if (!app) return;

        if (lockoutCountdownTimer) {
            clearInterval(lockoutCountdownTimer);
            lockoutCountdownTimer = null;
        }

        const adminSession = GeoTerraStore.getAdminSession();
        const lang = GeoTerraStore.getLanguage();

        if (adminSession) {
            app.innerHTML = renderAdminDashboardView(adminSession, lang);
            bindAdminDashboardEvents(adminSession);
            startSessionCountdownTimer();
            if (currentAdminTab === 'livemap') {
                setTimeout(initAdminLiveMap, 60);
            }
        } else if (isGateCleared()) {
            app.innerHTML = renderAdminLoginView(lang);
            bindAdminLoginEvents();
        } else {
            app.innerHTML = renderSecurityGatekeeperView(lang);
            bindSecurityGatekeeperEvents();
        }
    }

    // --- Layer 1: Security Clearance Gatekeeper (403 Isolated Bureau) ---
    function renderSecurityGatekeeperView(lang) {
        return `
            <div class="min-h-screen flex items-center justify-center p-4 bg-slate-950 gis-grid-dark relative overflow-hidden animate-fade-in font-sans">
                <!-- Ambient Dark Warning Glow -->
                <div class="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

                <div class="max-w-md w-full relative z-10">
                    <div class="text-center mb-8">
                        <div class="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                            <div class="absolute inset-0 rounded-3xl bg-red-500/20 animate-pulse-ring"></div>
                            <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-700 to-amber-600 flex items-center justify-center text-white shadow-xl shadow-red-600/30">
                                <i class="fa-solid fa-shield-halved text-2xl"></i>
                            </div>
                        </div>
                        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 text-[10px] font-mono mb-2">
                            <span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span> 403 ISOLATED ADMIN BUREAU
                        </div>
                        <h1 class="text-2xl font-black text-white tracking-tight">Access Restricted</h1>
                        <p class="text-xs text-slate-400 mt-1 font-medium">
                            ${lang === 'bn' ? 'মাস্টার অ্যাডমিন প্যানেল সাধারণ ওয়েবসাইট থেকে সম্পূর্ণ বিচ্ছিন্ন।' : 'Master Admin Panel is strictly segregated from public website.'}
                        </p>
                    </div>

                    <div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
                        <div class="mb-5 p-3.5 bg-red-950/50 border border-red-500/30 rounded-2xl text-xs text-red-200 flex items-start gap-3">
                            <i class="fa-solid fa-triangle-exclamation text-red-400 text-base mt-0.5 shrink-0"></i>
                            <div class="space-y-1">
                                <strong class="block font-bold text-red-100">${lang === 'bn' ? 'গোপন সিকিউরিটি লিংক প্রয়োজন' : 'Security Clearance Link Required'}</strong>
                                <p class="text-[11px] text-red-300 leading-relaxed">
                                    ${lang === 'bn' 
                                        ? 'এই কন্ট্রোল টার্মিনালে প্রবেশ করতে অনুমোদিত সিক্রেট লিংক ব্যবহার করুন অথবা এডমিন পাসকি প্রদান করে গেটওয়ে আনলক করুন।' 
                                        : 'To enter this control terminal, please access via your private administrative URL or provide the Master Clearance Passkey below.'}
                                </p>
                            </div>
                        </div>

                        <form id="admin-gatekeeper-form" class="space-y-4">
                            <div>
                                <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                                    <span>${lang === 'bn' ? 'মাস্টার সিকিউরিটি পাসকি' : 'Security Clearance Passkey'}</span>
                                    <span class="text-[10px] text-slate-500 font-mono">Passkey Check</span>
                                </label>
                                <div class="relative">
                                    <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                                        <i class="fa-solid fa-key text-sm"></i>
                                    </span>
                                    <input type="password" id="gate-passkey-input" name="passkey" required placeholder="••••••••" autocomplete="off"
                                        class="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-red-500 text-sm font-mono tracking-widest">
                                    <button type="button" onclick="window.toggleGatePasskeyVisibility()" class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300">
                                        <i class="fa-solid fa-eye text-xs" id="gate-passkey-eye"></i>
                                    </button>
                                </div>
                            </div>

                            <button type="submit" class="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transform active:scale-98">
                                <i class="fa-solid fa-shield-cat"></i> ${lang === 'bn' ? 'গেটওয়ে আনলক করুন' : 'Unlock Administrative Terminal'}
                            </button>
                        </form>

                        <div class="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between text-xs">
                            <a href="index.html" class="inline-flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 transition font-medium">
                                <i class="fa-solid fa-arrow-left text-[11px]"></i> ${lang === 'bn' ? 'মূল ওয়েবসাইটে ফিরুন' : 'Return to Website'}
                            </a>
                            <button type="button" onclick="window.toggleAppLanguage()" class="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg text-[10px] font-bold hover:text-white border border-slate-700">
                                ${lang === 'bn' ? 'ENG' : 'বাংলা'}
                            </button>
                        </div>
                    </div>

                    <div class="text-center text-[10px] text-slate-600 mt-6 font-mono">
                        Secluded Geospatial Bureau &bull; End-to-End Cryptographic Isolation &bull; Sowrov Sheikh
                    </div>
                </div>
            </div>
        `;
    }

    window.toggleGatePasskeyVisibility = function () {
        const input = document.getElementById('gate-passkey-input');
        const eye = document.getElementById('gate-passkey-eye');
        if (!input) return;
        if (input.type === 'password') {
            input.type = 'text';
            if (eye) eye.className = 'fa-solid fa-eye-slash text-xs text-amber-400';
        } else {
            input.type = 'password';
            if (eye) eye.className = 'fa-solid fa-eye text-xs text-slate-500';
        }
    };

    function bindSecurityGatekeeperEvents() {
        const form = document.getElementById('admin-gatekeeper-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const passkey = (form.passkey.value || '').trim();
                if (GeoTerraStore.verifyAdminSecretKey(passkey)) {
                    sessionStorage.setItem('geoterra_admin_gate_cleared', 'true');
                    GeoTerraStore.showToast('Security Clearance Verified', 'Gateway unlocked for administrative login.', 'success');
                    renderAdminPanel();
                } else {
                    GeoTerraStore.addActivityLog('Unauthorized Gate Attempt', `Invalid passkey entered at administrative gatekeeper.`, 'Gatekeeper');
                    GeoTerraStore.showToast('Access Denied', 'Invalid Master Security Clearance Passkey.', 'error');
                    form.passkey.value = '';
                    form.passkey.focus();
                }
            });
        }
    }

    // --- Layer 2 & 3: High-Security Admin Login Gateway with Robot Verification ---
    function renderAdminLoginView(lang) {
        const lockState = GeoTerraStore.getLockoutState();
        const isLocked = lockState.isLocked;

        return `
            <div class="min-h-screen flex items-center justify-center p-4 bg-slate-950 gis-grid-dark relative overflow-hidden animate-fade-in font-sans">
                <!-- Ambient Ambient Glow -->
                <div class="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none"></div>

                <div class="max-w-md w-full relative z-10">
                    <div class="text-center mb-6">
                        <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/30 mx-auto mb-3 animate-float">
                            <i class="fa-solid fa-user-shield text-2xl"></i>
                        </div>
                        <div class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono mb-2">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> 256-BIT ENCRYPTED PORTAL
                        </div>
                        <h1 class="text-2xl font-black text-white tracking-tight">Master Admin Control</h1>
                        <p class="text-xs text-emerald-400/90 mt-0.5 font-bold">স্মার্ট ল্যান্ড ম্যাপিং &bull; মাস্টার অ্যাডমিন অথেনটিকেশন</p>
                    </div>

                    <div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
                        <!-- Security Status Bar -->
                        <div class="mb-5 p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 flex items-center justify-between gap-2.5">
                            <div class="flex items-center gap-2">
                                <i class="fa-solid fa-lock text-emerald-400 text-sm"></i>
                                <div>
                                    <span class="font-bold block">${lang === 'bn' ? 'অনুমোদিত অ্যাডমিন টার্মিনাল' : 'Authorized Personnel Gateway'}</span>
                                    <span class="text-[10px] text-emerald-400/80 font-mono">Gatekeeper: Verified Clear</span>
                                </div>
                            </div>
                            <button type="button" onclick="window.toggleAppLanguage()" class="px-2.5 py-1 bg-slate-900 border border-slate-700 text-slate-200 hover:text-white rounded-lg text-[10px] font-bold">
                                ${lang === 'bn' ? 'ENG' : 'বাংলা'}
                            </button>
                        </div>

                        <!-- Brute-force Lockout Alert Banner -->
                        ${isLocked ? `
                            <div id="lockout-alert-box" class="mb-5 p-4 bg-red-950/80 border border-red-500/50 rounded-2xl text-xs text-red-200 space-y-1.5">
                                <div class="flex items-center gap-2 font-bold text-red-100">
                                    <i class="fa-solid fa-ban text-red-400 text-base"></i>
                                    <span>${lang === 'bn' ? 'সিকিউরিটি লকআউট সক্রিয়!' : 'Security Lockout Active!'}</span>
                                </div>
                                <p class="text-[11px] text-red-300">
                                    ${lang === 'bn' ? 'বারবার ভুল তথ্য দেওয়ায় অ্যাডমিন ব্যুরো সাময়িকভাবে লক করা হয়েছে।' : 'Multiple failed login attempts. Access is locked for 5 minutes.'}
                                </p>
                                <div class="pt-1 flex items-center gap-2 text-xs font-mono text-red-400">
                                    <span>${lang === 'bn' ? 'অবশিষ্ট সময়:' : 'Remaining:'}</span>
                                    <span id="lockout-countdown" class="font-bold bg-red-950 px-2 py-0.5 rounded border border-red-800">${lockState.remainingSeconds}s</span>
                                </div>
                            </div>
                        ` : (lockState.failedAttempts > 0 ? `
                            <div class="mb-4 p-2.5 bg-amber-950/60 border border-amber-500/40 rounded-xl text-[11px] text-amber-300 flex items-center gap-2">
                                <i class="fa-solid fa-triangle-exclamation text-amber-400"></i>
                                <span>${lang === 'bn' ? `সতর্কতা: ${lockState.failedAttempts}/৩ ব্যর্থ প্রচেষ্টা। ৩ বার ব্যর্থ হলে ৫ মিনিট লক হবে।` : `Notice: ${lockState.failedAttempts}/3 failed attempts. 3 failures trigger 5m lockout.`}</span>
                            </div>
                        ` : '')}

                        <form id="admin-login-form" class="space-y-4">
                            <!-- Hidden Honeypot Anti-Bot Field -->
                            <input type="text" name="admin_trap_auth" style="position:absolute;left:-9999px;opacity:0" tabindex="-1" autocomplete="off">

                            <!-- Admin Username -->
                            <div>
                                <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Admin Username</label>
                                <div class="relative">
                                    <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                                        <i class="fa-solid fa-user-gear text-sm"></i>
                                    </span>
                                    <input type="text" id="admin-username-input" name="username" required placeholder="${lang === 'bn' ? 'অ্যাডমিন ইউজারনেম দিন' : 'Enter admin username'}" ${isLocked ? 'disabled' : ''}
                                        class="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-sm font-mono disabled:opacity-50">
                                </div>
                            </div>

                            <!-- Admin Password with Visibility Toggle -->
                            <div>
                                <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Admin Password</label>
                                <div class="relative">
                                    <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                                        <i class="fa-solid fa-key text-sm"></i>
                                    </span>
                                    <input type="password" id="admin-password-input" name="password" required placeholder="••••••••••••" ${isLocked ? 'disabled' : ''}
                                        class="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-sm font-mono disabled:opacity-50">
                                    <button type="button" onclick="window.togglePasswordVisibility()" class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300">
                                        <i class="fa-solid fa-eye text-xs" id="admin-password-eye"></i>
                                    </button>
                                </div>
                            </div>

                            <!-- Robot Verification System (Anti-Bot CAPTCHA) -->
                            <div id="robot-verification-card" class="bg-slate-950/90 border border-slate-800 rounded-2xl p-3.5 transition-all">
                                <div id="robot-checkbox-btn" onclick="window.toggleRobotChallenge()" class="flex items-center justify-between cursor-pointer select-none">
                                    <div class="flex items-center gap-3">
                                        <div id="robot-check-box" class="w-6 h-6 rounded-lg border-2 ${isRobotVerified ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' : 'border-slate-600 bg-slate-900'} flex items-center justify-center transition">
                                            <i id="robot-check-icon" class="fa-solid fa-check text-xs ${isRobotVerified ? 'text-emerald-400' : 'text-transparent'}"></i>
                                        </div>
                                        <div>
                                            <span id="robot-check-label" class="text-xs font-bold ${isRobotVerified ? 'text-emerald-400' : 'text-slate-200'}">
                                                ${isRobotVerified ? (lang === 'bn' ? '✓ মানুষ যাচাই সম্পন্ন (রোবট মুক্ত)' : '✓ Human Verified') : (lang === 'bn' ? 'আমি রোবট নই (রোবট যাচাই)' : "I'm not a robot")}
                                            </span>
                                            <span class="block text-[10px] text-slate-500 font-mono">Anti-Bot AI Security Challenge</span>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <i class="fa-solid fa-robot text-lg ${isRobotVerified ? 'text-emerald-400' : 'text-slate-600'}"></i>
                                    </div>
                                </div>

                                <!-- Dynamic Challenge Box (Expanded on click) -->
                                <div id="robot-challenge-box" class="hidden mt-3 pt-3 border-t border-slate-800/80 space-y-2.5">
                                    <div class="text-[11px] text-slate-400 flex items-center justify-between">
                                        <span class="font-bold text-slate-300">${lang === 'bn' ? 'সিকিউরিটি কোড যাচাই করুন:' : 'Solve Security Challenge:'}</span>
                                        <span class="text-[10px] text-emerald-400 font-mono">Anti-Bot</span>
                                    </div>

                                    <div class="flex items-center gap-2">
                                        <canvas id="robot-captcha-canvas" width="180" height="46" class="rounded-xl border border-slate-700 bg-slate-950 shrink-0"></canvas>
                                        <button type="button" onclick="window.refreshRobotCaptcha()" title="New Code" class="h-11 w-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 flex items-center justify-center border border-slate-700 transition shrink-0">
                                            <i class="fa-solid fa-rotate-right text-xs"></i>
                                        </button>
                                    </div>

                                    <div id="robot-math-hint" class="text-[11px] text-emerald-400/90 font-mono"></div>

                                    <div class="flex items-center gap-2">
                                        <input type="text" id="robot-captcha-input" placeholder="${lang === 'bn' ? 'কোড বা গণিতের উত্তর লিখুন' : 'Enter code or answer'}" 
                                            class="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-mono uppercase tracking-wider focus:outline-none focus:border-emerald-500">
                                        <button type="button" onclick="window.verifyRobotCaptcha()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-sm">
                                            ${lang === 'bn' ? 'যাচাই' : 'Verify'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" id="admin-submit-btn" ${isLocked ? 'disabled' : ''}
                                class="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-600/30 transition transform active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed">
                                <i class="fa-solid fa-unlock-keyhole mr-1.5"></i> ${lang === 'bn' ? 'লগইন করুন ও ফুল কন্ট্রোল নিন' : 'Authenticate & Enter Bureau'}
                            </button>
                        </form>

                        <div class="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between text-xs">
                            <a href="index.html" class="inline-flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 transition font-medium">
                                <i class="fa-solid fa-arrow-left text-[11px]"></i> ${lang === 'bn' ? 'মূল ওয়েবসাইট' : 'Main Website'}
                            </a>
                            <button type="button" onclick="window.lockAdminGate()" class="text-slate-500 hover:text-red-400 transition font-mono text-[11px]">
                                <i class="fa-solid fa-lock text-[10px] mr-1"></i> ${lang === 'bn' ? 'টার্মিনাল লক করুন' : 'Lock Gateway'}
                            </button>
                        </div>
                    </div>

                    <div class="text-center text-[10px] text-slate-600 mt-6 font-mono">
                        Isolated Geospatial Infrastructure &bull; Sowrov Sheikh Administration
                    </div>
                </div>
            </div>
        `;
    }

    window.togglePasswordVisibility = function () {
        const input = document.getElementById('admin-password-input');
        const eye = document.getElementById('admin-password-eye');
        if (!input) return;
        if (input.type === 'password') {
            input.type = 'text';
            if (eye) eye.className = 'fa-solid fa-eye-slash text-xs text-emerald-400';
        } else {
            input.type = 'password';
            if (eye) eye.className = 'fa-solid fa-eye text-xs text-slate-500';
        }
    };

    window.lockAdminGate = function () {
        sessionStorage.removeItem('geoterra_admin_gate_cleared');
        isRobotVerified = false;
        GeoTerraStore.showToast('Terminal Locked', 'Gatekeeper security shield re-activated.', 'info');
        renderAdminPanel();
    };

    // --- Robot Verification System Handlers ---
    window.toggleRobotChallenge = function () {
        if (isRobotVerified) {
            GeoTerraStore.showToast('Verified', 'You have already passed the robot verification check.', 'info');
            return;
        }
        const box = document.getElementById('robot-challenge-box');
        if (!box) return;
        const isHidden = box.classList.contains('hidden');
        if (isHidden) {
            box.classList.remove('hidden');
            window.refreshRobotCaptcha();
        } else {
            box.classList.add('hidden');
        }
    };

    window.refreshRobotCaptcha = function () {
        const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
        let code = '';
        for (let i = 0; i < 5; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        robotVerificationCode = code;

        const num1 = Math.floor(Math.random() * 20) + 4;
        const num2 = Math.floor(Math.random() * 15) + 3;
        robotMathAnswer = num1 + num2;

        const mathEl = document.getElementById('robot-math-hint');
        if (mathEl) {
            mathEl.innerHTML = `<i class="fa-solid fa-calculator text-[10px] mr-1"></i> Or calculate math: <strong>${num1} + ${num2} = ?</strong>`;
        }

        const input = document.getElementById('robot-captcha-input');
        if (input) {
            input.value = '';
            input.focus();
        }

        window.drawRobotCaptchaCanvas(code);
    };

    window.drawRobotCaptchaCanvas = function (text) {
        const canvas = document.getElementById('robot-captcha-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dark tech gradient background
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, '#030712');
        grad.addColorStop(1, '#0f172a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw noise lines
        const lineColors = ['#10b981', '#14b8a6', '#06b6d4', '#22c55e', '#3b82f6'];
        for (let i = 0; i < 5; i++) {
            ctx.strokeStyle = lineColors[i % lineColors.length];
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

        // Draw noise dots
        for (let i = 0; i < 35; i++) {
            ctx.fillStyle = `rgba(${Math.floor(Math.random() * 200 + 55)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 200)}, 0.4)`;
            ctx.beginPath();
            ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Render characters with distortion & color variation
        const textColors = ['#34d399', '#2dd4bf', '#a7f3d0', '#38bdf8', '#86efac'];
        const startX = 20;
        const spacing = (canvas.width - 40) / text.length;

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            ctx.save();
            const x = startX + (i * spacing) + (Math.random() * 4 - 2);
            const y = 32 + (Math.random() * 6 - 3);
            const angle = (Math.random() * 30 - 15) * Math.PI / 180;

            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.font = 'bold 22px "JetBrains Mono", monospace';
            ctx.fillStyle = textColors[i % textColors.length];
            ctx.fillText(char, 0, 0);
            ctx.restore();
        }
    };

    window.verifyRobotCaptcha = function () {
        const input = document.getElementById('robot-captcha-input');
        if (!input) return;
        const val = input.value.trim().toUpperCase();

        const isCodeMatch = (val === (robotVerificationCode || '').toUpperCase());
        const isMathMatch = (robotMathAnswer !== null && val === String(robotMathAnswer));

        if (isCodeMatch || isMathMatch) {
            isRobotVerified = true;
            robotVerificationTimestamp = Date.now();

            // Update UI elements
            const card = document.getElementById('robot-verification-card');
            const box = document.getElementById('robot-check-box');
            const icon = document.getElementById('robot-check-icon');
            const label = document.getElementById('robot-check-label');
            const challengeBox = document.getElementById('robot-challenge-box');

            if (box) box.className = 'w-6 h-6 rounded-lg border-2 border-emerald-500 bg-emerald-500/20 text-emerald-400 flex items-center justify-center transition';
            if (icon) icon.className = 'fa-solid fa-check text-xs text-emerald-400';
            if (label) {
                const lang = GeoTerraStore.getLanguage();
                label.className = 'text-xs font-bold text-emerald-400';
                label.textContent = lang === 'bn' ? '✓ মানুষ যাচাই সম্পন্ন (রোবট মুক্ত)' : '✓ Human Verified';
            }
            if (challengeBox) challengeBox.classList.add('hidden');
            if (card) {
                card.classList.add('border-emerald-500/50', 'bg-emerald-950/20');
            }

            GeoTerraStore.showToast('Human Verified', 'Robot verification test successfully passed.', 'success');
        } else {
            isRobotVerified = false;
            GeoTerraStore.showToast('Verification Failed', 'Incorrect code or math answer. Try again.', 'error');
            window.refreshRobotCaptcha();
        }
    };

    function bindAdminLoginEvents() {
        const lockState = GeoTerraStore.getLockoutState();
        if (lockState.isLocked) {
            startLockoutCountdown(lockState.remainingSeconds);
        }

        const form = document.getElementById('admin-login-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                // 1. Anti-Bot Honeypot check
                const trap = form.admin_trap_auth ? form.admin_trap_auth.value : '';
                if (trap) {
                    GeoTerraStore.addActivityLog('Bot Trap Triggered', 'Automated crawler filled hidden honeypot trap.', 'Honeypot Guard');
                    GeoTerraStore.showToast('Security Alert', 'Automated bot activity detected and blocked.', 'error');
                    return;
                }

                // 2. Lockout state check
                const currentLock = GeoTerraStore.getLockoutState();
                if (currentLock.isLocked) {
                    GeoTerraStore.showToast('Security Lockout', `Account is locked. Wait ${currentLock.remainingSeconds}s.`, 'error');
                    return;
                }

                // 3. Robot verification check
                if (!isRobotVerified) {
                    GeoTerraStore.showToast('Verification Required', 'Please complete the "I am not a robot" check first!', 'error');
                    const cBox = document.getElementById('robot-challenge-box');
                    if (cBox && cBox.classList.contains('hidden')) {
                        cBox.classList.remove('hidden');
                        window.refreshRobotCaptcha();
                    }
                    const card = document.getElementById('robot-verification-card');
                    if (card) {
                        card.classList.add('border-red-500');
                        setTimeout(() => card.classList.remove('border-red-500'), 1500);
                    }
                    return;
                }

                // 4. Time anomaly check (< 400ms is inhuman)
                if (Date.now() - robotVerificationTimestamp < 400) {
                    GeoTerraStore.showToast('Bot Activity Detected', 'Instant automated action rejected.', 'error');
                    isRobotVerified = false;
                    return;
                }

                const username = form.username.value.trim();
                const password = form.password.value.trim();

                const res = GeoTerraStore.checkAdminLogin(username, password);
                if (res.success) {
                    isRobotVerified = false;
                    GeoTerraStore.showToast('Access Granted', 'Welcome to Master Admin Control Panel, Sowrov Sheikh!', 'success');
                    renderAdminPanel();
                } else {
                    isRobotVerified = false; // Require fresh verification after credential failure
                    GeoTerraStore.showToast('Access Denied', res.error, 'error');
                    renderAdminPanel();
                }
            });
        }
    }

    function startLockoutCountdown(seconds) {
        if (lockoutCountdownTimer) clearInterval(lockoutCountdownTimer);
        let rem = seconds;

        lockoutCountdownTimer = setInterval(() => {
            rem--;
            const countEl = document.getElementById('lockout-countdown');
            if (countEl) countEl.textContent = `${rem}s`;

            if (rem <= 0) {
                clearInterval(lockoutCountdownTimer);
                lockoutCountdownTimer = null;
                GeoTerraStore.resetLockoutState();
                GeoTerraStore.showToast('Lockout Cleared', 'You may now attempt to authenticate.', 'info');
                renderAdminPanel();
            }
        }, 1000);
    }

    // --- Admin Dashboard (Authenticated) ---
    function renderAdminDashboardView(admin, lang) {
        const stats = GeoTerraStore.getStats();
        const config = GeoTerraStore.getSiteConfig();

        return `
            <div class="min-h-screen flex bg-slate-950 text-slate-100 animate-fade-in font-sans">
                <!-- Admin Sidebar -->
                <aside class="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between hidden lg:flex shrink-0">
                    <div class="overflow-y-auto max-h-screen">
                        <!-- Brand Header -->
                        <div class="p-5 border-b border-slate-800 flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/30">
                                    <i class="fa-solid fa-shield-halved text-base"></i>
                                </div>
                                <div>
                                    <h1 class="font-black text-white text-base">Smart Land Admin</h1>
                                    <p class="text-[10px] text-emerald-400 uppercase tracking-widest font-bold">মাস্টার অ্যাডমিন কন্ট্রোল</p>
                                </div>
                            </div>
                        </div>

                        <!-- Admin Status Badge -->
                        <div class="p-3.5">
                            <div class="p-2.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-3 mb-3">
                                <div class="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                                    SS
                                </div>
                                <div class="overflow-hidden min-w-0">
                                    <div class="font-bold text-white text-xs truncate">${escapeHtml(admin.name)}</div>
                                    <div class="text-[10px] text-emerald-400 truncate font-mono">@${escapeHtml(admin.username)}</div>
                                </div>
                            </div>

                            <!-- Nav Menu: All 9 Modules Requested by User -->
                            <nav class="space-y-1 text-xs font-semibold">
                                <button type="button" onclick="window.switchAdminTab('overview')" class="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition ${currentAdminTab === 'overview' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}">
                                    <i class="fa-solid fa-chart-line w-4 text-emerald-400"></i> ${lang === 'bn' ? 'সার্বিক বিবরণী' : 'Overview'}
                                </button>
                                <button type="button" onclick="window.switchAdminTab('cms')" class="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition ${currentAdminTab === 'cms' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}">
                                    <i class="fa-solid fa-house w-4 text-emerald-400"></i> ${lang === 'bn' ? 'হোম (CMS ও স্লাইডার)' : 'Home (CMS & Slides)'}
                                </button>
                                <button type="button" onclick="window.switchAdminTab('livemap')" class="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition ${currentAdminTab === 'livemap' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}">
                                    <i class="fa-solid fa-map-location-dot w-4 text-emerald-400"></i> ${lang === 'bn' ? 'লাইভ ম্যাপ' : 'Live Map'}
                                </button>
                                <button type="button" onclick="window.switchAdminTab('advisor')" class="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition ${currentAdminTab === 'advisor' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}">
                                    <i class="fa-solid fa-compass-drafting w-4 text-teal-400"></i> ${lang === 'bn' ? 'জমি পরিকল্পনা' : 'Land Planning'}
                                </button>
                                <button type="button" onclick="window.switchAdminTab('weather')" class="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition ${currentAdminTab === 'weather' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}">
                                    <i class="fa-solid fa-cloud-sun-rain w-4 text-amber-400"></i> ${lang === 'bn' ? 'আবহাওয়া' : 'Agro-Weather'}
                                </button>
                                <button type="button" onclick="window.switchAdminTab('officials')" class="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition ${currentAdminTab === 'officials' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}">
                                    <i class="fa-solid fa-user-tie w-4 text-blue-400"></i> ${lang === 'bn' ? 'কর্মকর্তা' : 'Land Officials'}
                                </button>
                                <button type="button" onclick="window.switchAdminTab('police')" class="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition ${currentAdminTab === 'police' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}">
                                    <i class="fa-solid fa-shield-halved w-4 text-red-400"></i> ${lang === 'bn' ? 'পুলিশ' : 'Police Stations'}
                                </button>
                                <button type="button" onclick="window.switchAdminTab('plots')" class="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition ${currentAdminTab === 'plots' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}">
                                    <i class="fa-solid fa-draw-polygon w-4 text-emerald-400"></i> ${lang === 'bn' ? 'প্লটসমূহ' : 'Land Plots'} (${stats.totalPlots})
                                </button>
                                <button type="button" onclick="window.switchAdminTab('gallery')" class="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition ${currentAdminTab === 'gallery' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}">
                                    <i class="fa-solid fa-images w-4 text-purple-400"></i> ${lang === 'bn' ? 'চিত্রশালা' : 'Photo Gallery'}
                                </button>
                                <button type="button" onclick="window.switchAdminTab('users')" class="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition ${currentAdminTab === 'users' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}">
                                    <i class="fa-solid fa-users w-4 text-emerald-400"></i> ${lang === 'bn' ? 'মালিকবৃন্দ' : 'Landowners'} (${stats.totalUsers})
                                </button>
                                <button type="button" onclick="window.switchAdminTab('backup')" class="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition ${currentAdminTab === 'backup' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}">
                                    <i class="fa-solid fa-database w-4 text-cyan-400"></i> ${lang === 'bn' ? 'ডাটা ব্যাকআপ ও রিসেট' : 'Backup & Reset'}
                                </button>
                            </nav>
                        </div>
                    </div>

                    <!-- Sidebar Footer -->
                    <div class="p-3.5 border-t border-slate-800 space-y-1.5">
                        <a href="index.html" target="_blank" class="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition border border-slate-700">
                            <i class="fa-solid fa-external-link text-emerald-400"></i> ${lang === 'bn' ? 'লাইভ ওয়েবসাইট প্রিভিউ' : 'Live Website Preview'}
                        </a>
                        <button type="button" onclick="window.adminLogout()" class="w-full flex items-center justify-center gap-2 py-2 px-3 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 rounded-xl text-xs font-bold transition">
                            <i class="fa-solid fa-arrow-right-from-bracket"></i> ${GeoTerraStore.t('signOut')}
                        </button>
                    </div>
                </aside>

                <!-- Admin Main View Area -->
                <div class="flex-1 flex flex-col min-w-0 bg-slate-950">
                    <!-- Top Navigation Header -->
                    <header class="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div class="flex items-center gap-3">
                            <div class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                            <div>
                                <h2 class="text-base font-bold text-white flex items-center gap-2">
                                    ${currentAdminTab === 'overview' ? (lang === 'bn' ? 'সার্বিক ক্যাডাস্ট্রাল পর্যবেক্ষণ' : 'Executive Cadastral Overview') :
                                      currentAdminTab === 'cms' ? (lang === 'bn' ? 'হোম পেজ ও স্লাইডার CMS কন্ট্রোল' : 'Home Page & Hero Slides CMS') :
                                      currentAdminTab === 'livemap' ? (lang === 'bn' ? 'লাইভ স্যাটেলাইট ম্যাপ ও স্থানাঙ্ক কন্ট্রোল' : 'Live Satellite Map & Demarcation') :
                                      currentAdminTab === 'advisor' ? (lang === 'bn' ? 'জমি পরিকল্পনা ও বিনিয়োগ মডেল' : 'Land Planning & Investment Models') :
                                      currentAdminTab === 'weather' ? (lang === 'bn' ? 'কৃষি আবহাওয়া বার্তা ও পূর্বাভাস কেন্দ্র' : 'Agro-Weather & Climate Center') :
                                      currentAdminTab === 'officials' ? (lang === 'bn' ? 'কৃষি ও ভূমি কর্মকর্তা ডিরেক্টরি' : 'Land & Agriculture Officials Directory') :
                                      currentAdminTab === 'police' ? (lang === 'bn' ? 'জরুরি থানা পুলিশ ও ক্লিয়ারেন্স স্টেশন' : 'Emergency Police Stations & Clearances') :
                                      currentAdminTab === 'plots' ? (lang === 'bn' ? 'মাস্টার ল্যান্ড প্লট ও দাগ কন্ট্রোল' : 'Master Land Plots Management') :
                                      currentAdminTab === 'gallery' ? (lang === 'bn' ? 'ক্যাডাস্ট্রাল চিত্রশালা ও মিডিয়া' : 'Cadastral Photo Gallery') :
                                      currentAdminTab === 'users' ? (lang === 'bn' ? 'জমির মালিকবৃন্দ ও ইউজার ডিরেক্টরি' : 'Landowners & User Directory') :
                                      (lang === 'bn' ? 'ডাটাবেজ ব্যাকআপ ও নিরাপত্তা' : 'Database Management & Security')}
                                </h2>
                                <p class="text-[11px] text-slate-400">Admin: <strong class="text-emerald-400">${escapeHtml(admin.username)}</strong> &bull; ${lang === 'bn' ? 'এখানে যা পরিবর্তন করবেন তা মূল ওয়েবসাইটে সাথে সাথে আপডেট হবে' : 'Changes apply immediately to public website'}</p>
                            </div>
                        </div>

                        <div class="flex items-center gap-2 sm:gap-2.5">
                            <!-- Inactivity Auto-Lock Countdown Display -->
                            <div class="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-300" title="Security Auto-Logout on 15m inactivity">
                                <i class="fa-solid fa-clock-rotate-left text-emerald-400"></i>
                                <span>Auto-Lock:</span>
                                <span id="session-countdown-display" class="font-bold text-emerald-400">15:00</span>
                            </div>

                            <!-- Secret Access Link & Security Settings Button -->
                            <button type="button" onclick="window.openSecretLinkModal()" class="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5">
                                <i class="fa-solid fa-key text-amber-400"></i>
                                <span class="hidden sm:inline">${lang === 'bn' ? 'সিক্রেট লিংক ও পাসকি' : 'Secret Link'}</span>
                            </button>

                            <!-- Bilingual Language Switcher -->
                            <button type="button" onclick="window.toggleAppLanguage()" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5">
                                <i class="fa-solid fa-language text-emerald-400"></i>
                                <span>${lang === 'bn' ? 'English (ENG)' : 'বাংলা (BN)'}</span>
                            </button>

                            <a href="index.html" target="_blank" class="px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5">
                                <i class="fa-solid fa-globe"></i> ${lang === 'bn' ? 'ওয়েবসাইট' : 'View Site'}
                            </a>
                            <button type="button" onclick="window.openAddPlotAdminModal()" class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/20">
                                <i class="fa-solid fa-plus"></i> ${lang === 'bn' ? 'নতুন প্লট' : 'New Plot'}
                            </button>
                        </div>
                    </header>

                    <!-- Mobile Horizontal Scroll Tabs -->
                    <div class="lg:hidden bg-slate-900 border-b border-slate-800 flex overflow-x-auto p-2 gap-1 text-xs font-bold">
                        <button type="button" onclick="window.switchAdminTab('overview')" class="px-2.5 py-1.5 rounded-lg whitespace-nowrap ${currentAdminTab === 'overview' ? 'bg-emerald-600 text-white' : 'text-slate-400'}">Overview</button>
                        <button type="button" onclick="window.switchAdminTab('cms')" class="px-2.5 py-1.5 rounded-lg whitespace-nowrap ${currentAdminTab === 'cms' ? 'bg-emerald-600 text-white' : 'text-slate-400'}">হোম</button>
                        <button type="button" onclick="window.switchAdminTab('livemap')" class="px-2.5 py-1.5 rounded-lg whitespace-nowrap ${currentAdminTab === 'livemap' ? 'bg-emerald-600 text-white' : 'text-slate-400'}">লাইভ ম্যাপ</button>
                        <button type="button" onclick="window.switchAdminTab('advisor')" class="px-2.5 py-1.5 rounded-lg whitespace-nowrap ${currentAdminTab === 'advisor' ? 'bg-emerald-600 text-white' : 'text-slate-400'}">জমি পরিকল্পনা</button>
                        <button type="button" onclick="window.switchAdminTab('weather')" class="px-2.5 py-1.5 rounded-lg whitespace-nowrap ${currentAdminTab === 'weather' ? 'bg-emerald-600 text-white' : 'text-slate-400'}">আবহাওয়া</button>
                        <button type="button" onclick="window.switchAdminTab('officials')" class="px-2.5 py-1.5 rounded-lg whitespace-nowrap ${currentAdminTab === 'officials' ? 'bg-emerald-600 text-white' : 'text-slate-400'}">কর্মকর্তা</button>
                        <button type="button" onclick="window.switchAdminTab('police')" class="px-2.5 py-1.5 rounded-lg whitespace-nowrap ${currentAdminTab === 'police' ? 'bg-emerald-600 text-white' : 'text-slate-400'}">পুলিশ</button>
                        <button type="button" onclick="window.switchAdminTab('plots')" class="px-2.5 py-1.5 rounded-lg whitespace-nowrap ${currentAdminTab === 'plots' ? 'bg-emerald-600 text-white' : 'text-slate-400'}">প্লটসমূহ</button>
                        <button type="button" onclick="window.switchAdminTab('gallery')" class="px-2.5 py-1.5 rounded-lg whitespace-nowrap ${currentAdminTab === 'gallery' ? 'bg-emerald-600 text-white' : 'text-slate-400'}">চিত্রশালা</button>
                        <button type="button" onclick="window.switchAdminTab('users')" class="px-2.5 py-1.5 rounded-lg whitespace-nowrap ${currentAdminTab === 'users' ? 'bg-emerald-600 text-white' : 'text-slate-400'}">মালিকবৃন্দ</button>
                        <button type="button" onclick="window.switchAdminTab('backup')" class="px-2.5 py-1.5 rounded-lg whitespace-nowrap ${currentAdminTab === 'backup' ? 'bg-emerald-600 text-white' : 'text-slate-400'}">ব্যাকআপ</button>
                    </div>

                    <!-- Dynamic Tab Body -->
                    <main class="flex-1 p-6 overflow-y-auto">
                        ${currentAdminTab === 'overview' ? renderOverviewTab(stats, config, lang) :
                          currentAdminTab === 'cms' ? renderCmsTab(config, lang) :
                          currentAdminTab === 'livemap' ? renderLiveMapTab(lang) :
                          currentAdminTab === 'advisor' ? renderAdvisorTab(lang) :
                          currentAdminTab === 'weather' ? renderWeatherTab(lang) :
                          currentAdminTab === 'officials' ? renderOfficialsTab(lang) :
                          currentAdminTab === 'police' ? renderPoliceTab(lang) :
                          currentAdminTab === 'plots' ? renderPlotsTab(lang) :
                          currentAdminTab === 'gallery' ? renderGalleryTab(lang) :
                          currentAdminTab === 'users' ? renderUsersTab(lang) :
                          renderBackupTab(lang)}
                    </main>
                </div>
            </div>
        `;
    }

    // --- Tab 1: Overview ---
    function renderOverviewTab(stats, config, lang) {
        const logs = GeoTerraStore.getActivityLogs().slice(0, 8);
        const plots = GeoTerraStore.getAllLands().slice(0, 5);

        return `
            <div class="space-y-6">
                <!-- Security & Secret Access Link Banner -->
                <div class="p-5 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/60 rounded-2xl border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div class="flex items-start gap-3.5">
                        <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-lg shrink-0 mt-0.5">
                            <i class="fa-solid fa-shield-halved"></i>
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="text-sm font-bold text-white">${lang === 'bn' ? 'হাই-সিকিউরিটি মাস্টার ব্যুরো সক্রিয়' : 'High-Security Master Bureau Protected'}</span>
                                <span class="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold">100% ISOLATED</span>
                            </div>
                            <p class="text-xs text-slate-400 mt-0.5">
                                ${lang === 'bn' 
                                    ? 'অ্যাডমিন প্যানেল সাধারণ ওয়েবসাইট থেকে সম্পূর্ণ বিচ্ছিন্ন। শুধুমাত্র সিক্রেট লিংক অথবা পাসকি দ্বারা প্রবেশযোগ্য।' 
                                    : 'Admin Panel is completely hidden from public website. Access is restricted to secret link and passkey only.'}
                            </p>
                            <div class="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-400">
                                <span class="text-emerald-400"><i class="fa-solid fa-circle-check text-[10px] mr-1"></i> Anti-Bot AI Guard Active</span>
                                <span>&bull;</span>
                                <span class="text-teal-400"><i class="fa-solid fa-circle-check text-[10px] mr-1"></i> 3-Attempt Lockout Active</span>
                                <span>&bull;</span>
                                <span class="text-amber-400"><i class="fa-solid fa-key text-[10px] mr-1"></i> Passkey: <code class="text-amber-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">${escapeHtml(GeoTerraStore.getAdminSecretKey())}</code></span>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 shrink-0 w-full md:w-auto">
                        <button type="button" onclick="window.copySecretAdminLink()" class="flex-1 md:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20">
                            <i class="fa-solid fa-copy"></i> ${lang === 'bn' ? 'সিক্রেট লিংক কপি করুন' : 'Copy Secret Link'}
                        </button>
                        <button type="button" onclick="window.openSecretLinkModal()" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition border border-slate-700" title="Security Settings">
                            <i class="fa-solid fa-gear"></i>
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                        <div class="flex items-center justify-between mb-3">
                            <span class="text-xs font-bold text-slate-400 uppercase">${lang === 'bn' ? 'নিবন্ধিত প্লট' : 'Registered Plots'}</span>
                            <span class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm"><i class="fa-solid fa-map"></i></span>
                        </div>
                        <div class="text-3xl font-black text-white">${stats.totalPlots}</div>
                        <div class="text-[11px] text-emerald-400 mt-1 font-semibold">&bull; Active Cadastral Records</div>
                    </div>

                    <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                        <div class="flex items-center justify-between mb-3">
                            <span class="text-xs font-bold text-slate-400 uppercase">${lang === 'bn' ? 'মোট জমি' : 'Total Land Area'}</span>
                            <span class="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm"><i class="fa-solid fa-ruler-combined"></i></span>
                        </div>
                        <div class="text-3xl font-black text-white">${stats.totalAreaDecimals} <span class="text-xs text-slate-400 font-normal">${lang === 'bn' ? 'শতাংশ' : 'Decimals'}</span></div>
                        <div class="text-[11px] text-blue-400 mt-1 font-mono font-semibold">≈ ${stats.totalAreaAcres} Acres</div>
                    </div>

                    <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                        <div class="flex items-center justify-between mb-3">
                            <span class="text-xs font-bold text-slate-400 uppercase">${lang === 'bn' ? 'অনুমোদিত প্লট' : 'Fully Verified'}</span>
                            <span class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm"><i class="fa-solid fa-shield-check"></i></span>
                        </div>
                        <div class="text-3xl font-black text-emerald-400">${stats.verifiedCount} <span class="text-xs text-slate-400 font-normal">/ ${stats.totalPlots}</span></div>
                        <div class="text-[11px] text-slate-400 mt-1">${stats.pendingPolice} ${lang === 'bn' ? 'পেন্ডিং ক্লিয়ারেন্স' : 'Pending Clearances'}</div>
                    </div>

                    <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                        <div class="flex items-center justify-between mb-3">
                            <span class="text-xs font-bold text-slate-400 uppercase">${lang === 'bn' ? 'ভূমির মালিক' : 'Landowners'}</span>
                            <span class="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm"><i class="fa-solid fa-users"></i></span>
                        </div>
                        <div class="text-3xl font-black text-amber-400">${stats.totalUsers}</div>
                        <div class="text-[11px] text-slate-400 mt-1">Pre-configured Accounts</div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <!-- Recent Plots -->
                    <div class="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                        <div class="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                            <h3 class="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                                <i class="fa-solid fa-map-pin text-emerald-400"></i> ${lang === 'bn' ? 'সাম্প্রতিক জমির প্লটসমূহ' : 'Recent Land Parcels'}
                            </h3>
                            <button type="button" onclick="window.switchAdminTab('plots')" class="text-xs text-emerald-400 hover:underline">View All &rarr;</button>
                        </div>
                        <div class="divide-y divide-slate-800/80">
                            ${plots.map(p => `
                                <div class="p-4 hover:bg-slate-800/50 transition flex items-center justify-between gap-4">
                                    <div class="flex items-center gap-3 min-w-0">
                                        <img src="${escapeHtml(p.landImage)}" class="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0" onerror="this.src='https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80'">
                                        <div class="min-w-0">
                                            <div class="flex items-center gap-2">
                                                <span class="font-bold text-white text-xs font-mono">${escapeHtml(p.landNumber)}</span>
                                                <span class="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">${escapeHtml(lang === 'bn' ? (p.areaBn || p.area) : p.area)}</span>
                                            </div>
                                            <div class="text-[11px] text-slate-400 truncate">${escapeHtml(lang === 'bn' ? (p.mouzaBn || p.mouza) : p.mouza)} &bull; Owner: <strong class="text-slate-300">${escapeHtml(p.ownerName || p.ownerUsername)}</strong></div>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-2 shrink-0">
                                        <button type="button" onclick="window.quickApprovePlot('${escapeHtml(p.id)}')" class="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-[10px] font-bold">
                                            Approve
                                        </button>
                                        <button type="button" onclick="window.openEditPlotAdminModal('${escapeHtml(p.id)}')" class="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs">
                                            <i class="fa-solid fa-pen"></i>
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Audit Activity Feed -->
                    <div class="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
                        <div class="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                            <h3 class="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                                <i class="fa-solid fa-clock-rotate-left text-teal-400"></i> ${lang === 'bn' ? 'অডিট অ্যাক্টিভিটি লগ' : 'Audit Activity Feed'}
                            </h3>
                            <span class="text-[10px] text-slate-500 font-mono">Live</span>
                        </div>
                        <div class="p-4 space-y-3 flex-1 overflow-y-auto max-h-96">
                            ${logs.map(l => `
                                <div class="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1 text-xs">
                                    <div class="flex justify-between items-center">
                                        <span class="font-bold text-emerald-400">${escapeHtml(l.action)}</span>
                                        <span class="text-[10px] text-slate-500 font-mono">${new Date(l.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                    <p class="text-[11px] text-slate-300">${escapeHtml(l.details)}</p>
                                    <div class="text-[10px] text-slate-500">By: <span class="font-medium text-slate-400">${escapeHtml(l.user)}</span></div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // --- Tab 2: CMS & Website Full Control (Home Section) ---
    function renderCmsTab(config, lang) {
        const slides = GeoTerraStore.getSlides();

        return `
            <div class="space-y-8 max-w-5xl">
                <!-- Site Identity & Header CMS -->
                <div class="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6 shadow-xl">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
                        <div>
                            <h3 class="text-base font-bold text-white flex items-center gap-2">
                                <i class="fa-solid fa-house text-emerald-400"></i> ${lang === 'bn' ? 'হোম পেজ সেটিংস ও ব্র্যান্ডিং (CMS)' : 'Home Page Settings & Branding (CMS)'}
                            </h3>
                            <p class="text-xs text-slate-400 mt-1">
                                ${lang === 'bn' ? 'এখানে যা পরিবর্তন করবেন তা পাবলিক ওয়েবসাইটের হোম পেজে সরাসরি আপডেট হবে।' : 'Changes made here apply immediately to the public home page.'}
                            </p>
                        </div>
                        <a href="index.html" target="_blank" class="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-700">
                            <i class="fa-solid fa-arrow-up-right-from-square text-emerald-400"></i> ${lang === 'bn' ? 'লাইভ সাইট' : 'Live Preview'}
                        </a>
                    </div>

                    <form id="admin-cms-form" class="space-y-5">
                        <!-- Site Brand Names (English & Bangla) -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                            <div>
                                <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Website Brand Title (English) *</label>
                                <input type="text" name="siteName" required value="${escapeHtml(config.siteName || 'Smart Land Mapping')}" 
                                    class="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500 font-bold">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-emerald-400 uppercase mb-1">ওয়েবসাইট ব্র্যান্ড টাইটেল (বাংলা) *</label>
                                <input type="text" name="siteNameBn" required value="${escapeHtml(config.siteNameBn || 'স্মার্ট ল্যান্ড ম্যাপিং')}" 
                                    class="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500 font-bold">
                            </div>
                        </div>

                        <!-- Brand Taglines -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Tagline (English) *</label>
                                <input type="text" name="tagline" required value="${escapeHtml(config.tagline || '')}" 
                                    class="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-emerald-400 uppercase mb-1">ট্যাগলাইন (বাংলা) *</label>
                                <input type="text" name="taglineBn" required value="${escapeHtml(config.taglineBn || '')}" 
                                    class="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500">
                            </div>
                        </div>

                        <!-- Hero Title (English & Bangla) -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Hero Section Title (English) *</label>
                                <input type="text" name="heroTitle" required value="${escapeHtml(config.heroTitle || '')}" 
                                    class="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-emerald-400 uppercase mb-1">হিরো সেকশন টাইটেল (বাংলা) *</label>
                                <input type="text" name="heroTitleBn" required value="${escapeHtml(config.heroTitleBn || '')}" 
                                    class="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500">
                            </div>
                        </div>

                        <!-- Hero Description (English & Bangla) -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Hero Description (English)</label>
                                <textarea name="heroDescription" rows="2" 
                                    class="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500">${escapeHtml(config.heroDescription || '')}</textarea>
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-emerald-400 uppercase mb-1">হিরো বর্ণনা (বাংলা)</label>
                                <textarea name="heroDescriptionBn" rows="2" 
                                    class="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500">${escapeHtml(config.heroDescriptionBn || '')}</textarea>
                            </div>
                        </div>

                        <!-- Top Notice Marquee -->
                        <div class="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                            <div class="flex items-center justify-between">
                                <label class="text-xs font-semibold text-slate-300 uppercase">Top Announcement Banner Notice (স্ক্রোলিং নোটিশ)</label>
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" name="enableNotice" ${config.enableNotice ? 'checked' : ''} class="w-4 h-4 rounded text-emerald-600 focus:ring-0">
                                    <span class="text-xs text-emerald-400 font-bold">Display Banner</span>
                                </label>
                            </div>
                            <div class="space-y-2">
                                <input type="text" name="noticeBanner" value="${escapeHtml(config.noticeBanner)}" placeholder="Notice in English" 
                                    class="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500">
                                <input type="text" name="noticeBannerBn" value="${escapeHtml(config.noticeBannerBn || '')}" placeholder="বিজ্ঞপ্তি বাংলায়" 
                                    class="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500">
                            </div>
                        </div>

                        <!-- Contact & Hotline Info -->
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Emergency Land Hotline *</label>
                                <input type="text" name="hotline" required value="${escapeHtml(config.hotline)}" 
                                    class="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500 font-mono">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Official Support Email *</label>
                                <input type="email" name="supportEmail" required value="${escapeHtml(config.supportEmail)}" 
                                    class="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Bureau Office Address</label>
                                <input type="text" name="bureauAddress" value="${escapeHtml(config.bureauAddress || '')}" 
                                    class="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500">
                            </div>
                        </div>

                        <div class="pt-3 border-t border-slate-800 flex justify-end">
                            <button type="submit" class="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 transition flex items-center gap-2">
                                <i class="fa-solid fa-floppy-disk"></i> Save & Publish CMS
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Hero Carousel Slides Manager (Home Section) -->
                <div class="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-5 shadow-xl">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
                        <div>
                            <h3 class="text-base font-bold text-white flex items-center gap-2">
                                <i class="fa-solid fa-film text-emerald-400"></i> ${lang === 'bn' ? 'হোম পেজ ক্যারোসেল স্লাইডার' : 'Home Page Hero Carousel Slides'}
                            </h3>
                            <p class="text-xs text-slate-400 mt-0.5">
                                ${lang === 'bn' ? 'হোম পেজের বড় ব্যানারে প্রদর্শিত স্লাইডগুলোর ছবি, লেখা ও লিংক যোগ বা এডিট করুন।' : 'Manage titles, badges, images, and action links for top carousel slides.'}
                            </p>
                        </div>
                        <button type="button" onclick="window.openAddSlideAdminModal()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/30">
                            <i class="fa-solid fa-plus"></i> ${lang === 'bn' ? 'নতুন স্লাইড যোগ' : 'Add New Slide'}
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        ${slides.map(s => `
                            <div class="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-emerald-500/50 transition">
                                <div class="relative h-36 bg-slate-900 overflow-hidden">
                                    <img src="${escapeHtml(s.image)}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" onerror="this.src='https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80'">
                                    <div class="absolute top-2 left-2 px-2 py-0.5 bg-slate-950/80 backdrop-blur-md rounded-md text-[10px] font-mono font-bold text-emerald-400 border border-emerald-500/30">
                                        ${escapeHtml(lang === 'bn' ? (s.badgeBn || s.badgeEn) : s.badgeEn)}
                                    </div>
                                </div>
                                <div class="p-4 space-y-2 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h4 class="font-bold text-xs text-white leading-snug line-clamp-2">
                                            ${escapeHtml(lang === 'bn' ? (s.titleBn || s.titleEn) : s.titleEn)}
                                        </h4>
                                        <p class="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                                            ${escapeHtml(lang === 'bn' ? (s.descriptionBn || s.descriptionEn) : s.descriptionEn)}
                                        </p>
                                    </div>
                                    <div class="pt-3 border-t border-slate-900 flex items-center justify-between gap-2">
                                        <span class="text-[10px] font-mono text-emerald-400 truncate">
                                            Tab: <strong class="text-white">${escapeHtml(s.actionTab || 'lands')}</strong>
                                        </span>
                                        <div class="flex items-center gap-1.5 shrink-0">
                                            <button type="button" onclick="window.openEditSlideAdminModal('${escapeHtml(s.id)}')" class="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition" title="Edit Slide">
                                                <i class="fa-solid fa-pen"></i>
                                            </button>
                                            <button type="button" onclick="window.adminDeleteSlide('${escapeHtml(s.id)}')" class="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg text-xs transition border border-red-800/40" title="Delete Slide">
                                                <i class="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // --- Tab: Live Map (Interactive GIS Map, Demarcation & Coordinate Tool) ---
    function renderLiveMapTab(lang) {
        const mapConfig = GeoTerraStore.getLiveMapConfig();
        const plots = GeoTerraStore.getAllLands();

        return `
            <div class="space-y-6">
                <!-- Header Banner -->
                <div class="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
                    <div>
                        <h3 class="text-base font-bold text-white flex items-center gap-2">
                            <i class="fa-solid fa-earth-americas text-emerald-400"></i> ${lang === 'bn' ? 'লাইভ স্যাটেলাইট ম্যাপ ও জিআইএস দাগ সীমানা' : 'GIS Live Satellite Map & Boundary Demarcation'}
                        </h3>
                        <p class="text-xs text-slate-400 mt-1">
                            ${lang === 'bn' ? 'ম্যাপে ক্লিক করে যেকোনো দাগের জিপিএস স্থানাঙ্ক বের করুন এবং সরাসরি প্লট রেকর্ড তৈরি বা আপডেট করুন।' : 'Click anywhere on the satellite map to extract precise GPS coordinates and manage plot demarcations.'}
                        </p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button type="button" onclick="window.resetLiveMapView()" class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-700">
                            <i class="fa-solid fa-crosshairs text-emerald-400"></i> ${lang === 'bn' ? 'রিসেন্টার ম্যাপ' : 'Recenter Map'}
                        </button>
                        <button type="button" onclick="window.openAddPlotAdminModal()" class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/30">
                            <i class="fa-solid fa-plus"></i> ${lang === 'bn' ? 'নতুন দাগ যোগ' : 'Add New Plot'}
                        </button>
                    </div>
                </div>

                <!-- Map & Click Inspector Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <!-- Leaflet Interactive Container -->
                    <div class="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl space-y-3">
                        <div class="flex justify-between items-center text-xs px-2">
                            <span class="font-bold text-white flex items-center gap-2">
                                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                                ${lang === 'bn' ? 'রিয়েল-টাইম ক্যাডাস্ট্রাল ভিউয়ার' : 'Real-Time Cadastral Satellite'}
                            </span>
                            <div class="flex items-center gap-3 text-[11px] text-slate-400">
                                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> ${lang === 'bn' ? 'অনুমোদিত' : 'Approved'}</span>
                                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span> ${lang === 'bn' ? 'পেন্ডিং' : 'Pending'}</span>
                                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-red-500"></span> ${lang === 'bn' ? 'বিরোধ' : 'Disputed'}</span>
                            </div>
                        </div>

                        <!-- Map Container -->
                        <div id="admin-live-map" class="w-full h-[520px] rounded-2xl overflow-hidden border border-slate-800 shadow-inner z-0"></div>

                        <!-- Click Coordinates Inspector Bar -->
                        <div class="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                            <div class="flex items-center gap-2 min-w-0">
                                <i class="fa-solid fa-location-crosshairs text-emerald-400 text-sm shrink-0"></i>
                                <span class="text-slate-400 shrink-0">${lang === 'bn' ? 'ক্লিককৃত জিপিএস স্থানাঙ্ক:' : 'Clicked GPS:'}</span>
                                <span id="admin-clicked-coords-display" class="font-mono font-bold text-emerald-300 truncate">23.8103° N, 90.4125° E</span>
                            </div>
                            <div class="flex items-center gap-2 shrink-0">
                                <button type="button" onclick="window.copyClickedCoordinates()" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-bold transition flex items-center gap-1">
                                    <i class="fa-solid fa-copy"></i> ${lang === 'bn' ? 'কপি' : 'Copy'}
                                </button>
                                <button type="button" onclick="window.createPlotWithClickedCoords()" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1 shadow-md shadow-emerald-600/20">
                                    <i class="fa-solid fa-circle-plus"></i> ${lang === 'bn' ? 'এই স্থানাঙ্কে প্লট তৈরি' : 'Create Plot Here'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Live Map Settings & Plot Selector Sidebar -->
                    <div class="lg:col-span-4 space-y-6">
                        <!-- Map Configuration Card -->
                        <div class="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-4 shadow-xl">
                            <h4 class="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <i class="fa-solid fa-gear text-teal-400"></i> ${lang === 'bn' ? 'ম্যাপ ডিসপ্লে ও স্তর সেটিংস' : 'GIS Map Settings'}
                            </h4>
                            <form id="admin-map-settings-form" class="space-y-3.5">
                                <div>
                                    <label class="block text-[11px] font-semibold text-slate-300 mb-1">${lang === 'bn' ? 'ডিফল্ট কেন্দ্র (অক্ষাংশ / দ্রাঘিমাংশ)' : 'Default Center Coordinates'}</label>
                                    <div class="grid grid-cols-2 gap-2">
                                        <input type="number" step="0.0001" name="centerLat" value="${mapConfig.defaultCenter[0]}" required class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono">
                                        <input type="number" step="0.0001" name="centerLng" value="${mapConfig.defaultCenter[1]}" required class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono">
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-[11px] font-semibold text-slate-300 mb-1">${lang === 'bn' ? 'ডিফল্ট জুম লেভেল (৭ - ১৮)' : 'Default Zoom Level (7 - 18)'}</label>
                                    <input type="number" min="7" max="18" name="defaultZoom" value="${mapConfig.defaultZoom}" required class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono">
                                </div>
                                <div>
                                    <label class="block text-[11px] font-semibold text-slate-300 mb-1">${lang === 'bn' ? 'ডিফল্ট জিআইএস স্যাটেলাইট স্তর' : 'Default Base Map Layer'}</label>
                                    <select name="tileLayer" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs">
                                        <option value="satellite" ${mapConfig.tileLayer === 'satellite' ? 'selected' : ''}>Esri World Imagery (Satellite HD)</option>
                                        <option value="street" ${mapConfig.tileLayer === 'street' ? 'selected' : ''}>OpenStreetMap (Standard Street)</option>
                                        <option value="topo" ${mapConfig.tileLayer === 'topo' ? 'selected' : ''}>OpenTopoMap (Topographic Contour)</option>
                                    </select>
                                </div>
                                <div class="flex items-center gap-2">
                                    <input type="checkbox" name="autoFitBounds" id="admin-auto-fit-bounds" ${mapConfig.autoFitBounds ? 'checked' : ''} class="w-4 h-4 rounded text-emerald-600 focus:ring-0">
                                    <label for="admin-auto-fit-bounds" class="text-xs text-slate-300 cursor-pointer">${lang === 'bn' ? 'সকল প্লট অনুযায়ী অটো-ফিট বাউন্ডস' : 'Auto-fit bounds to all plots'}</label>
                                </div>
                                <button type="submit" class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5">
                                    <i class="fa-solid fa-floppy-disk"></i> ${lang === 'bn' ? 'ম্যাপ সেটিংস সংরক্ষণ' : 'Save Map Configuration'}
                                </button>
                            </form>
                        </div>

                        <!-- Jump to Plot Quick Navigator -->
                        <div class="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3 shadow-xl">
                            <div class="flex justify-between items-center">
                                <h4 class="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                    <i class="fa-solid fa-list-check text-emerald-400"></i> ${lang === 'bn' ? 'ম্যাপে প্লটসমূহ' : 'Plots on Map'}
                                </h4>
                                <span class="text-[10px] text-emerald-400 font-mono">${plots.length} ${lang === 'bn' ? 'টি প্লট' : 'Plots'}</span>
                            </div>
                            <div class="space-y-2 max-h-56 overflow-y-auto pr-1">
                                ${plots.map(p => `
                                    <div class="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between gap-2 hover:border-emerald-500/50 transition">
                                        <div class="min-w-0">
                                            <div class="font-bold text-xs text-white font-mono truncate">${escapeHtml(p.landNumber)}</div>
                                            <div class="text-[10px] text-slate-400 truncate">${escapeHtml(p.mouza)} &bull; ${escapeHtml(p.area)}</div>
                                        </div>
                                        <button type="button" onclick="window.flyToAdminMapPlot('${escapeHtml(p.coordinates)}', '${escapeHtml(p.landNumber)}')" class="px-2.5 py-1 bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white rounded-lg text-[10px] font-bold transition shrink-0 flex items-center gap-1">
                                            <i class="fa-solid fa-eye"></i> ${lang === 'bn' ? 'দেখুন' : 'View'}
                                        </button>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function parseGpsCoords(coordStr) {
        if (!coordStr) return null;
        const parts = coordStr.split(',');
        if (parts.length >= 2) {
            const latMatch = parts[0].match(/([0-9.]+)/);
            const lngMatch = parts[1].match(/([0-9.]+)/);
            if (latMatch && lngMatch) {
                return [parseFloat(latMatch[1]), parseFloat(lngMatch[1])];
            }
        }
        return null;
    }

    function initAdminLiveMap() {
        const mapEl = document.getElementById('admin-live-map');
        if (!mapEl) return;

        if (adminLiveMapInstance) {
            try {
                adminLiveMapInstance.remove();
            } catch (e) {}
            adminLiveMapInstance = null;
        }

        const mapConfig = GeoTerraStore.getLiveMapConfig();
        const defaultCenter = mapConfig.defaultCenter || [23.8103, 90.4125];
        const defaultZoom = mapConfig.defaultZoom || 11;

        adminLiveMapInstance = L.map('admin-live-map', {
            zoomControl: true,
            attributionControl: false
        }).setView(defaultCenter, defaultZoom);

        let tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        if (mapConfig.tileLayer === 'street') {
            tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        } else if (mapConfig.tileLayer === 'topo') {
            tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
        }

        L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(adminLiveMapInstance);

        adminLiveMapInstance.on('click', (e) => {
            const lat = e.latlng.lat.toFixed(4);
            const lng = e.latlng.lng.toFixed(4);
            const formatted = `${lat}° N, ${lng}° E`;
            const disp = document.getElementById('admin-clicked-coords-display');
            if (disp) disp.textContent = formatted;
            window._lastAdminClickedCoords = formatted;
            window._lastAdminClickedLatLng = [e.latlng.lat, e.latlng.lng];
        });

        const plots = GeoTerraStore.getAllLands();
        const bounds = [];

        plots.forEach(plot => {
            const coords = parseGpsCoords(plot.coordinates);
            if (coords) {
                bounds.push(coords);
                const isApproved = plot.policeVerification && (plot.policeVerification.includes('Approved') || plot.policeVerification.includes('Cleared'));
                const isDisputed = plot.policeVerification && (plot.policeVerification.includes('Disputed') || plot.imageVerification === 'Rejected');
                const color = isApproved ? '#22c55e' : (isDisputed ? '#ef4444' : '#f59e0b');

                const icon = L.divIcon({
                    className: 'custom-plot-marker',
                    html: `<div style="background-color:${color}; width:16px; height:16px; border-radius:50%; border:3px solid white; box-shadow:0 0 10px ${color};"></div>`,
                    iconSize: [16, 16],
                    iconAnchor: [8, 8]
                });

                const marker = L.marker(coords, { icon: icon }).addTo(adminLiveMapInstance);
                marker.bindPopup(`
                    <div style="font-family:sans-serif; color:#0f172a; min-width:180px;">
                        <div style="font-weight:bold; font-size:13px; color:#0f172a; border-bottom:1px solid #e2e8f0; padding-bottom:4px; margin-bottom:6px;">
                            ${escapeHtml(plot.landNumber)}
                        </div>
                        <div style="font-size:11px; margin-bottom:3px;"><strong>Owner:</strong> ${escapeHtml(plot.ownerName || plot.ownerUsername)}</div>
                        <div style="font-size:11px; margin-bottom:3px;"><strong>Mouza:</strong> ${escapeHtml(plot.mouza)}</div>
                        <div style="font-size:11px; margin-bottom:3px;"><strong>Area:</strong> ${escapeHtml(plot.area)}</div>
                        <div style="font-size:11px; margin-bottom:6px;"><strong>Crop:</strong> ${escapeHtml(plot.currentCrop)}</div>
                        <div style="font-size:10px; padding:3px 6px; border-radius:4px; background:${color}20; color:${color}; font-weight:bold; margin-bottom:6px; display:inline-block;">
                            ${escapeHtml(plot.policeVerification)}
                        </div>
                        <div>
                            <button onclick="window.openEditPlotAdminModal('${escapeHtml(plot.id)}')" style="background:#16a34a; color:white; border:none; padding:4px 8px; border-radius:6px; font-size:11px; font-weight:bold; cursor:pointer;">
                                Edit Plot Record
                            </button>
                        </div>
                    </div>
                `);

                L.circle(coords, {
                    radius: 60,
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.25,
                    weight: 2
                }).addTo(adminLiveMapInstance);
            }
        });

        if (mapConfig.autoFitBounds && bounds.length > 0) {
            try {
                adminLiveMapInstance.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
            } catch (e) {}
        }
    }

    // --- Tab: Land Planning (Advisor Models & Guidelines) ---
    function renderAdvisorTab(lang) {
        const templates = GeoTerraStore.getLandAdvisorTemplates();
        const models = templates.models || [];

        return `
            <div class="space-y-6">
                <!-- Header Card -->
                <div class="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
                    <div>
                        <h3 class="text-base font-bold text-white flex items-center gap-2">
                            <i class="fa-solid fa-compass-drafting text-teal-400"></i> ${lang === 'bn' ? 'জমি পরিকল্পনা, ইনভেস্টমেন্ট মডেল ও কৃষি রোডম্যাপ' : 'Land Planning, Investment Models & Agro Roadmap'}
                        </h3>
                        <p class="text-xs text-slate-400 mt-1">
                            ${lang === 'bn' ? 'জমি কেনার পর কি কি করবেন, কোন ফসলে বা প্রকল্পে কত খরচ ও লাভ হবে তার মডেলসমূহ এডিট ও পরিচালনা করুন।' : 'Manage investment blueprints, cost-return estimates per decimal, and 12-month post-purchase action plans.'}
                        </p>
                    </div>
                    <button type="button" onclick="window.openAddAdvisorModelModal()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 whitespace-nowrap">
                        <i class="fa-solid fa-plus"></i> ${lang === 'bn' ? 'নতুন পরিকল্পনা মডেল' : 'Add Planning Model'}
                    </button>
                </div>

                <!-- Planning Models Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    ${models.map(m => `
                        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-500/50 transition shadow-lg space-y-4">
                            <div>
                                <div class="flex items-start justify-between gap-2 mb-2">
                                    <div class="flex items-center gap-2.5">
                                        <div class="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center text-lg shrink-0">
                                            <i class="fa-solid ${escapeHtml(m.icon || 'fa-seedling')}"></i>
                                        </div>
                                        <div>
                                            <h4 class="font-bold text-sm text-white leading-tight">
                                                ${escapeHtml(lang === 'bn' ? (m.nameBn || m.nameEn) : m.nameEn)}
                                            </h4>
                                            <span class="text-[10px] text-teal-400 font-mono">Key: ${escapeHtml(m.key)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="inline-block px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold mb-2">
                                    ${escapeHtml(lang === 'bn' ? (m.badgeBn || m.badgeEn) : m.badgeEn)}
                                </div>

                                <p class="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-3">
                                    ${escapeHtml(lang === 'bn' ? (m.overviewBn || m.overviewEn) : m.overviewEn)}
                                </p>

                                <div class="space-y-1.5 p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-[11px]">
                                    <div class="flex justify-between text-slate-400">
                                        <span>${lang === 'bn' ? 'আনুমানিক খরচ/শতাংশ:' : 'Setup Budget/Dec:'}</span>
                                        <span class="font-bold text-white text-right truncate max-w-[170px]">${escapeHtml(lang === 'bn' ? (m.budgetPerDecBn || m.budgetPerDecEn) : m.budgetPerDecEn)}</span>
                                    </div>
                                    <div class="flex justify-between text-slate-400">
                                        <span>${lang === 'bn' ? 'সম্ভাব্য আয়:' : 'Expected Yield:'}</span>
                                        <span class="font-bold text-emerald-400 text-right truncate max-w-[170px]">${escapeHtml(lang === 'bn' ? (m.expectedYieldBn || m.expectedYieldEn) : m.expectedYieldEn)}</span>
                                    </div>
                                    <div class="flex justify-between text-slate-400">
                                        <span>${lang === 'bn' ? 'ব্রেক-ইভেন মেয়াদ:' : 'ROI Timeline:'}</span>
                                        <span class="font-bold text-amber-300 text-right truncate max-w-[170px]">${escapeHtml(lang === 'bn' ? (m.roiTimelineBn || m.roiTimelineEn) : m.roiTimelineEn)}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                                <span class="text-[10px] text-slate-400">
                                    ${escapeHtml(lang === 'bn' ? 'মডেল সক্রিয়' : 'Model Active')}
                                </span>
                                <div class="flex items-center gap-1.5">
                                    <button type="button" onclick="window.openEditAdvisorModelModal('${escapeHtml(m.key)}')" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition flex items-center gap-1">
                                        <i class="fa-solid fa-pen text-[10px]"></i> ${lang === 'bn' ? 'এডিট' : 'Edit'}
                                    </button>
                                    <button type="button" onclick="window.adminDeleteAdvisorModel('${escapeHtml(m.key)}')" class="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg text-xs transition border border-red-800/40" title="Delete Model">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // --- Tab: Weather (Agro-Weather Forecasting Center) ---
    function renderWeatherTab(lang) {
        const allWeathers = GeoTerraStore.getAllDistrictWeathers();
        let districtKeys = Object.keys(allWeathers);

        if (weatherSearchQuery) {
            const q = weatherSearchQuery.toLowerCase();
            districtKeys = districtKeys.filter(k => 
                k.toLowerCase().includes(q) || 
                (allWeathers[k].districtBn && allWeathers[k].districtBn.toLowerCase().includes(q)) ||
                (allWeathers[k].division && allWeathers[k].division.toLowerCase().includes(q))
            );
        }

        return `
            <div class="space-y-6">
                <!-- Search & Header Bar -->
                <div class="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 shadow-xl">
                    <div class="relative flex-1 max-w-md">
                        <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                            <i class="fa-solid fa-magnifying-glass text-xs"></i>
                        </span>
                        <input type="text" id="admin-weather-search" value="${escapeHtml(weatherSearchQuery)}" placeholder="${lang === 'bn' ? 'জেলা বা বিভাগ দিয়ে খুঁজুন...' : 'Search District or Division...'}" 
                            class="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500">
                    </div>
                    <div class="flex items-center gap-2">
                        <button type="button" onclick="window.openAddWeatherModal()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30 whitespace-nowrap">
                            <i class="fa-solid fa-plus"></i> ${lang === 'bn' ? 'নতুন জেলা আবহাওয়া যোগ' : 'Add District Weather'}
                        </button>
                    </div>
                </div>

                <!-- Weather Cards Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    ${districtKeys.map(k => {
                        const w = allWeathers[k];
                        return `
                            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-amber-500/50 transition shadow-lg space-y-4">
                                <div>
                                    <div class="flex items-start justify-between gap-2 mb-3">
                                        <div>
                                            <h4 class="font-bold text-base text-white">
                                                ${escapeHtml(lang === 'bn' ? (w.districtBn || w.district) : w.district)}
                                            </h4>
                                            <span class="text-[10px] text-slate-400 font-mono">Division: ${escapeHtml(w.division || 'Dhaka')}</span>
                                        </div>
                                        <div class="text-right">
                                            <div class="text-2xl font-black text-amber-400">${escapeHtml(w.temp)}°C</div>
                                            <div class="text-[10px] text-slate-400">Feels ${escapeHtml(w.feelsLike || w.temp)}°C</div>
                                        </div>
                                    </div>

                                    <div class="flex items-center gap-2 text-xs text-slate-300 mb-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                                        <i class="fa-solid ${escapeHtml(w.icon || 'fa-cloud-sun')} text-amber-400 text-base"></i>
                                        <span class="font-medium">${escapeHtml(lang === 'bn' ? (w.conditionBn || w.conditionEn) : w.conditionEn)}</span>
                                    </div>

                                    <div class="grid grid-cols-3 gap-2 text-center text-[10px] mb-3">
                                        <div class="p-2 bg-slate-950 rounded-lg border border-slate-800">
                                            <div class="text-slate-400">Humidity</div>
                                            <div class="font-bold text-white mt-0.5">${escapeHtml(w.humidity || '60%')}</div>
                                        </div>
                                        <div class="p-2 bg-slate-950 rounded-lg border border-slate-800">
                                            <div class="text-slate-400">Rain Chance</div>
                                            <div class="font-bold text-emerald-400 mt-0.5">${escapeHtml(w.rainChance || '15%')}</div>
                                        </div>
                                        <div class="p-2 bg-slate-950 rounded-lg border border-slate-800">
                                            <div class="text-slate-400">Wind</div>
                                            <div class="font-bold text-white mt-0.5">${escapeHtml(w.wind || '10 km/h')}</div>
                                        </div>
                                    </div>

                                    ${w.agriAdvisory ? `
                                        <div class="p-2.5 bg-emerald-950/30 rounded-xl border border-emerald-500/30 text-[11px] text-slate-300 space-y-1">
                                            <div class="font-bold text-emerald-300 flex items-center gap-1">
                                                <i class="fa-solid fa-leaf text-[10px]"></i> ${lang === 'bn' ? 'কৃষি পরামর্শ:' : 'Agri Advice:'}
                                            </div>
                                            <p class="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                                                ${escapeHtml(lang === 'bn' ? (w.agriAdvisory.cropAdviceBn || w.agriAdvisory.cropAdviceEn) : w.agriAdvisory.cropAdviceEn)}
                                            </p>
                                        </div>
                                    ` : ''}
                                </div>

                                <div class="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                                    <button type="button" onclick="window.openEditWeatherModal('${escapeHtml(k)}')" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition flex items-center gap-1">
                                        <i class="fa-solid fa-pen text-[10px]"></i> ${lang === 'bn' ? 'এডিট' : 'Edit'}
                                    </button>
                                    <button type="button" onclick="window.adminDeleteWeather('${escapeHtml(k)}')" class="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg text-xs transition border border-red-800/40" title="Delete Weather">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    // --- Tab: Land & Agriculture Officials (Officials Section) ---
    function renderOfficialsTab(lang) {
        const officials = GeoTerraStore.getLandOfficials({
            search: officialSearchQuery,
            sector: officialSectorFilter,
            division: officialDivisionFilter
        });

        return `
            <div class="space-y-6">
                <!-- Filters & Search Bar -->
                <div class="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 shadow-xl">
                    <div class="relative flex-1 max-w-md">
                        <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                            <i class="fa-solid fa-magnifying-glass text-xs"></i>
                        </span>
                        <input type="text" id="admin-official-search" value="${escapeHtml(officialSearchQuery)}" placeholder="${lang === 'bn' ? 'নাম, পদবি, জেলা বা ফোন দিয়ে কর্মকর্তা খুঁজুন...' : 'Search Name, Title, District or Phone...'}" 
                            class="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500">
                    </div>

                    <div class="flex flex-wrap items-center gap-2">
                        <select id="admin-official-sector-filter" class="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs">
                            <option value="all" ${officialSectorFilter === 'all' ? 'selected' : ''}>${lang === 'bn' ? 'সকল বিভাগ/দপ্তর' : 'All Sectors'}</option>
                            <option value="land" ${officialSectorFilter === 'land' ? 'selected' : ''}>${lang === 'bn' ? 'ভূমি প্রশাসন ও রেজিস্ট্রি' : 'Land Administration'}</option>
                            <option value="agri" ${officialSectorFilter === 'agri' ? 'selected' : ''}>${lang === 'bn' ? 'কৃষি সম্প্রসারণ অধিদপ্তর' : 'Agriculture Extension'}</option>
                        </select>

                        <button type="button" onclick="window.openAddOfficialModal()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30 whitespace-nowrap">
                            <i class="fa-solid fa-plus"></i> ${lang === 'bn' ? 'নতুন কর্মকর্তা যোগ' : 'Add Official'}
                        </button>
                    </div>
                </div>

                <!-- Officials Cards/Table -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    ${officials.map(o => `
                        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-blue-500/50 transition shadow-lg space-y-4">
                            <div>
                                <div class="flex items-start justify-between gap-2 mb-3">
                                    <div class="flex items-center gap-3">
                                        <div class="w-10 h-10 rounded-xl ${o.sector === 'agri' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'} flex items-center justify-center font-bold text-base shrink-0">
                                            <i class="fa-solid ${o.sector === 'agri' ? 'fa-seedling' : 'fa-building-columns'}"></i>
                                        </div>
                                        <div>
                                            <h4 class="font-bold text-sm text-white">
                                                ${escapeHtml(lang === 'bn' ? (o.officerNameBn || o.officerNameEn) : o.officerNameEn)}
                                            </h4>
                                            <div class="text-[11px] text-blue-400 font-medium">
                                                ${escapeHtml(lang === 'bn' ? (o.titleBn || o.titleEn) : o.titleEn)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="space-y-1.5 text-xs text-slate-300">
                                    <div class="flex items-center gap-2 text-slate-400 text-[11px]">
                                        <i class="fa-solid fa-location-dot w-3.5 text-emerald-400"></i>
                                        <span>${escapeHtml(lang === 'bn' ? (o.districtBn || o.district) : o.district)}, ${escapeHtml(lang === 'bn' ? (o.divisionBn || o.division) : o.division)}</span>
                                    </div>
                                    <div class="flex items-center gap-2 text-slate-400 text-[11px]">
                                        <i class="fa-solid fa-building w-3.5 text-slate-500"></i>
                                        <span class="truncate">${escapeHtml(lang === 'bn' ? (o.officeBn || o.officeEn) : o.officeEn)}</span>
                                    </div>
                                    <div class="flex items-center gap-2 text-[11px]">
                                        <i class="fa-solid fa-phone w-3.5 text-emerald-400"></i>
                                        <a href="tel:${escapeHtml(o.phone)}" class="font-mono text-emerald-300 hover:underline">${escapeHtml(o.phone)}</a>
                                    </div>
                                    ${o.email ? `
                                        <div class="flex items-center gap-2 text-[11px]">
                                            <i class="fa-solid fa-envelope w-3.5 text-slate-400"></i>
                                            <a href="mailto:${escapeHtml(o.email)}" class="text-slate-300 hover:underline truncate">${escapeHtml(o.email)}</a>
                                        </div>
                                    ` : ''}
                                </div>

                                ${o.servicesBn || o.servicesEn ? `
                                    <div class="mt-3 p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[10px] text-slate-400 leading-relaxed line-clamp-2">
                                        ${escapeHtml(lang === 'bn' ? (o.servicesBn || o.servicesEn) : o.servicesEn)}
                                    </div>
                                ` : ''}
                            </div>

                            <div class="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                                <button type="button" onclick="window.openEditOfficialModal('${escapeHtml(o.id)}')" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition flex items-center gap-1">
                                    <i class="fa-solid fa-pen text-[10px]"></i> ${lang === 'bn' ? 'এডিট' : 'Edit'}
                                </button>
                                <button type="button" onclick="window.adminDeleteOfficial('${escapeHtml(o.id)}')" class="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg text-xs transition border border-red-800/40" title="Delete Official">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // --- Tab: Emergency Police Stations (Police Section) ---
    function renderPoliceTab(lang) {
        const stations = GeoTerraStore.getPoliceStations({
            query: policeSearchQuery,
            division: policeDivisionFilter
        });

        return `
            <div class="space-y-6">
                <!-- Search & Header Bar -->
                <div class="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 shadow-xl">
                    <div class="relative flex-1 max-w-md">
                        <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                            <i class="fa-solid fa-magnifying-glass text-xs"></i>
                        </span>
                        <input type="text" id="admin-police-search" value="${escapeHtml(policeSearchQuery)}" placeholder="${lang === 'bn' ? 'থানা, জেলা বা ফোন নম্বর দিয়ে পুলিশ স্টেশন খুঁজুন...' : 'Search Thana, District, OC or Phone...'}" 
                            class="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500">
                    </div>

                    <div class="flex items-center gap-2">
                        <select id="admin-police-division-filter" class="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs">
                            <option value="all" ${policeDivisionFilter === 'all' ? 'selected' : ''}>${lang === 'bn' ? 'সকল বিভাগ' : 'All Divisions'}</option>
                            <option value="Dhaka" ${policeDivisionFilter === 'Dhaka' ? 'selected' : ''}>ঢাকা বিভাগ</option>
                            <option value="Chittagong" ${policeDivisionFilter === 'Chittagong' ? 'selected' : ''}>চট্টগ্রাম বিভাগ</option>
                            <option value="Rajshahi" ${policeDivisionFilter === 'Rajshahi' ? 'selected' : ''}>রাজশাহী বিভাগ</option>
                            <option value="Khulna" ${policeDivisionFilter === 'Khulna' ? 'selected' : ''}>খুলনা বিভাগ</option>
                            <option value="Sylhet" ${policeDivisionFilter === 'Sylhet' ? 'selected' : ''}>সিলেট বিভাগ</option>
                            <option value="Barisal" ${policeDivisionFilter === 'Barisal' ? 'selected' : ''}>বরিশাল বিভাগ</option>
                            <option value="Rangpur" ${policeDivisionFilter === 'Rangpur' ? 'selected' : ''}>রংপুর বিভাগ</option>
                            <option value="Mymensingh" ${policeDivisionFilter === 'Mymensingh' ? 'selected' : ''}>ময়মনসিংহ বিভাগ</option>
                        </select>

                        <button type="button" onclick="window.openAddPoliceModal()" class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/30 whitespace-nowrap">
                            <i class="fa-solid fa-plus"></i> ${lang === 'bn' ? 'নতুন থানা যোগ' : 'Add Station'}
                        </button>
                    </div>
                </div>

                <!-- Stations Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    ${stations.map(p => `
                        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-red-500/50 transition shadow-lg space-y-4">
                            <div>
                                <div class="flex items-start justify-between gap-2 mb-2">
                                    <div class="flex items-center gap-2.5">
                                        <div class="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center text-lg shrink-0">
                                            <i class="fa-solid fa-shield-halved"></i>
                                        </div>
                                        <div>
                                            <h4 class="font-bold text-sm text-white leading-tight">
                                                ${escapeHtml(lang === 'bn' ? (p.nameBn || p.name) : p.name)}
                                            </h4>
                                            <span class="text-[10px] text-red-400 font-mono">${escapeHtml(p.type || 'Police Station')}</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="space-y-1.5 text-xs text-slate-300 mt-2">
                                    <div class="flex items-center gap-2 text-slate-400 text-[11px]">
                                        <i class="fa-solid fa-location-dot w-3.5 text-emerald-400"></i>
                                        <span>${escapeHtml(lang === 'bn' ? (p.thanaBn || p.thana) : p.thana)}, ${escapeHtml(lang === 'bn' ? (p.districtBn || p.district) : p.district)}</span>
                                    </div>
                                    <div class="flex items-center gap-2 text-[11px]">
                                        <i class="fa-solid fa-phone w-3.5 text-red-400"></i>
                                        <span class="text-slate-400">OC:</span>
                                        <a href="tel:${escapeHtml(p.phone)}" class="font-mono text-red-300 font-bold hover:underline">${escapeHtml(p.phone)}</a>
                                    </div>
                                    ${p.dutyOfficer ? `
                                        <div class="flex items-center gap-2 text-[11px]">
                                            <i class="fa-solid fa-headset w-3.5 text-amber-400"></i>
                                            <span class="text-slate-400">Duty Officer:</span>
                                            <a href="tel:${escapeHtml(p.dutyOfficer)}" class="font-mono text-amber-300 hover:underline">${escapeHtml(p.dutyOfficer)}</a>
                                        </div>
                                    ` : ''}
                                    ${p.address ? `
                                        <div class="flex items-start gap-2 text-slate-400 text-[10px] mt-1">
                                            <i class="fa-solid fa-map-pin w-3.5 mt-0.5 text-slate-500"></i>
                                            <span class="truncate">${escapeHtml(p.address)}</span>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>

                            <div class="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                                <a href="tel:${escapeHtml(p.phone)}" class="px-2.5 py-1 bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white rounded-lg text-[10px] font-bold transition flex items-center gap-1">
                                    <i class="fa-solid fa-phone"></i> ${lang === 'bn' ? 'কল দিন' : 'Call'}
                                </a>
                                <div class="flex items-center gap-1.5">
                                    <button type="button" onclick="window.openEditPoliceModal('${escapeHtml(p.id)}')" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition flex items-center gap-1">
                                        <i class="fa-solid fa-pen text-[10px]"></i> ${lang === 'bn' ? 'এডিট' : 'Edit'}
                                    </button>
                                    <button type="button" onclick="window.adminDeletePolice('${escapeHtml(p.id)}')" class="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg text-xs transition border border-red-800/40" title="Delete Station">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // --- Tab: Land Plots ---
    function renderPlotsTab(lang) {
        let plots = GeoTerraStore.getAllLands();

        if (plotFilter === 'verified') {
            plots = plots.filter(p => p.imageVerification === 'Verified' && p.policeVerification.includes('Approved'));
        } else if (plotFilter === 'pending') {
            plots = plots.filter(p => p.policeVerification.includes('Pending') || p.imageVerification === 'Pending Review');
        } else if (plotFilter === 'disputed') {
            plots = plots.filter(p => p.policeVerification.includes('Disputed') || p.imageVerification === 'Rejected');
        }

        if (plotSearchQuery) {
            const q = plotSearchQuery.toLowerCase();
            plots = plots.filter(p =>
                (p.landNumber && p.landNumber.toLowerCase().includes(q)) ||
                (p.mouza && p.mouza.toLowerCase().includes(q)) ||
                (p.ownerName && p.ownerName.toLowerCase().includes(q)) ||
                (p.ownerUsername && p.ownerUsername.toLowerCase().includes(q)) ||
                (p.currentCrop && p.currentCrop.toLowerCase().includes(q))
            );
        }

        return `
            <div class="space-y-6">
                <div class="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
                    <div class="relative flex-1 max-w-md">
                        <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                            <i class="fa-solid fa-magnifying-glass text-xs"></i>
                        </span>
                        <input type="text" id="admin-plot-search" value="${escapeHtml(plotSearchQuery)}" placeholder="Search DAG, Mouza, Landowner..." 
                            class="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500">
                    </div>

                    <div class="flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
                        <button type="button" onclick="window.filterPlotsByStatus('all')" class="px-3 py-1.5 rounded-lg transition ${plotFilter === 'all' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'}">All (${GeoTerraStore.getAllLands().length})</button>
                        <button type="button" onclick="window.filterPlotsByStatus('verified')" class="px-3 py-1.5 rounded-lg transition ${plotFilter === 'verified' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'}">Verified</button>
                        <button type="button" onclick="window.filterPlotsByStatus('pending')" class="px-3 py-1.5 rounded-lg transition ${plotFilter === 'pending' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'}">Pending</button>
                        <button type="button" onclick="window.filterPlotsByStatus('disputed')" class="px-3 py-1.5 rounded-lg transition ${plotFilter === 'disputed' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'}">Disputed</button>
                    </div>

                    <button type="button" onclick="window.openAddPlotAdminModal()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 whitespace-nowrap">
                        <i class="fa-solid fa-plus"></i> ${lang === 'bn' ? 'নতুন প্লট যোগ' : 'Add New Plot'}
                    </button>
                </div>

                <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr class="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800 text-[11px]">
                                    <th class="px-5 py-3.5">DAG / Land #</th>
                                    <th class="px-5 py-3.5">Landowner</th>
                                    <th class="px-5 py-3.5">Mouza & Location</th>
                                    <th class="px-5 py-3.5">Area & GPS</th>
                                    <th class="px-5 py-3.5">Current Crop</th>
                                    <th class="px-5 py-3.5">Police Clearance</th>
                                    <th class="px-5 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-800/70">
                                ${plots.map(p => `
                                    <tr class="hover:bg-slate-800/40 transition">
                                        <td class="px-5 py-4 font-mono font-bold text-white whitespace-nowrap">
                                            <div class="flex items-center gap-2">
                                                <img src="${escapeHtml(p.landImage)}" class="w-8 h-8 rounded-lg object-cover border border-slate-700 shrink-0" onerror="this.src='https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80'">
                                                <span>${escapeHtml(p.landNumber)}</span>
                                            </div>
                                        </td>
                                        <td class="px-5 py-4 whitespace-nowrap">
                                            <div class="font-bold text-slate-200">${escapeHtml(p.ownerName || p.ownerUsername)}</div>
                                            <div class="text-[10px] text-emerald-400 font-mono">@${escapeHtml(p.ownerUsername)}</div>
                                        </td>
                                        <td class="px-5 py-4 text-slate-300">
                                            <div class="font-medium truncate max-w-[160px]">${escapeHtml(lang === 'bn' ? (p.mouzaBn || p.mouza) : p.mouza)}</div>
                                            <div class="text-[10px] text-slate-500">${escapeHtml(p.district || 'Dhaka')}</div>
                                        </td>
                                        <td class="px-5 py-4 whitespace-nowrap">
                                            <div class="font-bold text-white">${escapeHtml(lang === 'bn' ? (p.areaBn || p.area) : p.area)}</div>
                                            <div class="text-[10px] text-slate-500 font-mono truncate max-w-[140px]">${escapeHtml(p.coordinates)}</div>
                                        </td>
                                        <td class="px-5 py-4 whitespace-nowrap">
                                            <span class="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full font-bold text-[11px]">
                                                <i class="fa-solid fa-seedling text-[9px]"></i> ${escapeHtml(lang === 'bn' ? (p.currentCropBn || p.currentCrop) : p.currentCrop)}
                                            </span>
                                        </td>
                                        <td class="px-5 py-4 whitespace-nowrap">
                                            <span class="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${p.policeVerification.includes('Approved') ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}">
                                                ${escapeHtml(p.policeVerification)}
                                            </span>
                                        </td>
                                        <td class="px-5 py-4 text-right whitespace-nowrap space-x-1.5">
                                            <button type="button" onclick="window.quickApprovePlot('${escapeHtml(p.id)}')" class="px-2 py-1 bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-lg text-[10px] font-bold transition" title="1-Click Approve Police Clearance">
                                                <i class="fa-solid fa-check"></i>
                                            </button>
                                            <button type="button" onclick="window.openEditPlotAdminModal('${escapeHtml(p.id)}')" class="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition">
                                                <i class="fa-solid fa-pen"></i>
                                            </button>
                                            <button type="button" onclick="window.deletePlotAdmin('${escapeHtml(p.id)}')" class="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg text-xs transition border border-red-800/40">
                                                <i class="fa-solid fa-trash"></i>
                                            </button>
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

    // --- Tab: Cadastral Photo Gallery ---
    function renderGalleryTab(lang) {
        let photos = GeoTerraStore.getGalleryPhotos(galleryCategoryFilter);

        const categories = [
            { key: 'all', labelBn: 'সকল ছবি', labelEn: 'All Photos' },
            { key: 'Agricultural', labelBn: 'কৃষি জমি', labelEn: 'Agricultural' },
            { key: 'Tea Estate', labelBn: 'চা বাগান', labelEn: 'Tea Estate' },
            { key: 'Survey', labelBn: 'মাঠ জরিপ', labelEn: 'Survey' },
            { key: 'Aerial Drone', labelBn: 'ড্রোন ম্যাপিং', labelEn: 'Drone Mapping' },
            { key: 'Orchard', labelBn: 'ফলজ বাগান', labelEn: 'Orchard' },
            { key: 'Commercial', labelBn: 'বাণিজ্যিক প্লট', labelEn: 'Commercial' },
            { key: 'Cadastral', labelBn: 'ক্যাডাস্ট্রাল সীমানা', labelEn: 'Cadastral' }
        ];

        return `
            <div class="space-y-6">
                <!-- Top Toolbar & Filter -->
                <div class="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
                    <div class="flex items-center gap-1.5 overflow-x-auto text-xs font-bold scrollbar-thin pb-1 md:pb-0">
                        ${categories.map(c => `
                            <button type="button" onclick="window.filterGalleryCategory('${c.key}')" 
                                class="px-3 py-1.5 rounded-lg whitespace-nowrap transition ${galleryCategoryFilter === c.key ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' : 'bg-slate-950 text-slate-400 hover:text-white'}">
                                ${lang === 'bn' ? c.labelBn : c.labelEn}
                            </button>
                        `).join('')}
                    </div>

                    <button type="button" onclick="window.openAddGalleryModal()" 
                        class="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-purple-600/30 whitespace-nowrap">
                        <i class="fa-solid fa-plus"></i> ${lang === 'bn' ? 'নতুন ছবি আপলোড' : 'Add Gallery Photo'}
                    </button>
                </div>

                <!-- Gallery Photos Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    ${photos.map(p => `
                        <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-purple-500/50 transition shadow-lg flex flex-col justify-between group">
                            <div class="relative aspect-video overflow-hidden bg-slate-950">
                                <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.titleEn)}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" onerror="this.src='https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80'">
                                <div class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-purple-300 border border-purple-500/30">
                                    ${escapeHtml(lang === 'bn' ? (p.categoryBn || p.category) : p.category)}
                                </div>
                            </div>

                            <div class="p-4 space-y-2 flex-1 flex flex-col justify-between">
                                <div>
                                    <h4 class="font-bold text-sm text-white line-clamp-1">
                                        ${escapeHtml(lang === 'bn' ? (p.titleBn || p.titleEn) : p.titleEn)}
                                    </h4>
                                    <div class="flex items-center gap-1.5 text-slate-400 text-[11px] mt-1">
                                        <i class="fa-solid fa-location-dot text-emerald-400 text-xs shrink-0"></i>
                                        <span class="truncate">${escapeHtml(lang === 'bn' ? (p.locationBn || p.location) : p.location)}</span>
                                    </div>
                                    <p class="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                                        ${escapeHtml(lang === 'bn' ? (p.descriptionBn || p.descriptionEn) : p.descriptionEn)}
                                    </p>
                                </div>

                                <div class="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 mt-3">
                                    <a href="${escapeHtml(p.image)}" target="_blank" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold transition flex items-center gap-1">
                                        <i class="fa-solid fa-up-right-from-square"></i> ${lang === 'bn' ? 'ফুল স্ক্রিন' : 'View Full'}
                                    </a>
                                    <div class="flex items-center gap-1.5">
                                        <button type="button" onclick="window.openEditGalleryModal('${escapeHtml(p.id)}')" class="px-2.5 py-1 bg-slate-800 hover:bg-purple-600 text-slate-200 hover:text-white rounded-lg text-xs font-bold transition flex items-center gap-1">
                                            <i class="fa-solid fa-pen text-[10px]"></i> ${lang === 'bn' ? 'এডিট' : 'Edit'}
                                        </button>
                                        <button type="button" onclick="window.adminDeleteGalleryPhoto('${escapeHtml(p.id)}')" class="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg text-xs transition border border-red-800/40" title="Delete Photo">
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // --- Tab: Landowners & Users ---
    function renderUsersTab(lang) {
        let users = GeoTerraStore.getAllUsers();
        if (userSearchQuery) {
            const q = userSearchQuery.toLowerCase();
            users = users.filter(u =>
                u.fullName.toLowerCase().includes(q) ||
                u.username.toLowerCase().includes(q) ||
                u.district.toLowerCase().includes(q)
            );
        }

        return `
            <div class="space-y-6">
                <div class="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                    <div class="relative flex-1 max-w-md">
                        <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                            <i class="fa-solid fa-magnifying-glass text-xs"></i>
                        </span>
                        <input type="text" id="admin-user-search" value="${escapeHtml(userSearchQuery)}" placeholder="Search users..." 
                            class="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500">
                    </div>

                    <button type="button" onclick="window.openAddUserAdminModal()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 whitespace-nowrap">
                        <i class="fa-solid fa-user-plus"></i> ${lang === 'bn' ? 'নতুন ইউজার যোগ' : 'Register User'}
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${users.map(u => {
                        const userPlotsCount = GeoTerraStore.getLandsByUser(u.username).length;
                        return `
                            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-500/50 transition">
                                <div class="flex items-start gap-4">
                                    <img src="${escapeHtml(u.avatar)}" class="w-14 h-14 rounded-2xl object-cover border-2 border-slate-700 shrink-0">
                                    <div class="min-w-0 flex-1">
                                        <div class="flex items-center justify-between">
                                            <h4 class="font-bold text-white text-sm truncate">${escapeHtml(lang === 'bn' ? (u.fullNameBn || u.fullName) : u.fullName)}</h4>
                                            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">${escapeHtml(u.status || 'Active')}</span>
                                        </div>
                                        <p class="text-xs text-emerald-400 font-medium truncate">${escapeHtml(lang === 'bn' ? (u.roleBn || u.role) : u.role)}</p>
                                        <div class="text-[11px] text-slate-500 mt-0.5"><i class="fa-solid fa-location-dot mr-1 text-emerald-500"></i> ${escapeHtml(lang === 'bn' ? (u.districtBn || u.district) : u.district)}</div>
                                    </div>
                                </div>

                                <!-- Credentials Box with Direct Admin Edit & Copy -->
                                <div class="my-3.5 p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                                    <div class="flex items-center justify-between">
                                        <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Username:</span>
                                        <div class="flex items-center gap-1.5 font-mono">
                                            <strong class="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">${escapeHtml(u.username)}</strong>
                                            <button type="button" onclick="window.adminCopyUserCredential('${escapeHtml(u.username)}', 'Username')" title="Copy Username" class="p-1 text-slate-400 hover:text-white transition">
                                                <i class="fa-solid fa-copy text-xs"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Password:</span>
                                        <div class="flex items-center gap-1.5 font-mono">
                                            <span id="admin-pass-val-${escapeHtml(u.username)}" class="text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40 font-bold">${escapeHtml(u.password)}</span>
                                            <button type="button" onclick="window.adminToggleUserPasswordView('${escapeHtml(u.username)}', '${escapeHtml(u.password)}')" title="Show / Mask" class="p-1 text-slate-400 hover:text-amber-400 transition">
                                                <i id="admin-pass-icon-${escapeHtml(u.username)}" class="fa-solid fa-eye text-xs"></i>
                                            </button>
                                            <button type="button" onclick="window.adminCopyUserCredential('${escapeHtml(u.password)}', 'Password')" title="Copy Password" class="p-1 text-slate-400 hover:text-white transition">
                                                <i class="fa-solid fa-copy text-xs"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div class="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                                    <span class="text-[11px] text-slate-400 font-bold">
                                        <i class="fa-solid fa-map-pin text-emerald-400 mr-1"></i> ${userPlotsCount} Land Plots
                                    </span>
                                    <div class="space-x-1.5">
                                        <button type="button" onclick="window.openEditUserAdminModal('${escapeHtml(u.username)}')" class="px-3 py-1.5 bg-emerald-600/30 hover:bg-emerald-600 border border-emerald-500/50 hover:text-white text-emerald-300 rounded-xl text-xs font-bold transition flex-inline items-center gap-1.5 shadow-xs">
                                            <i class="fa-solid fa-user-pen mr-1"></i> Edit User & Pass
                                        </button>
                                        <button type="button" onclick="window.deleteUserAdmin('${escapeHtml(u.username)}')" class="px-2.5 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-xl text-xs font-bold transition border border-red-800/30" title="Delete Account">
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    // --- Tab 5: Backup & Reset ---
    function renderBackupTab(lang) {
        return `
            <div class="space-y-6 max-w-3xl">
                <div class="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6">
                    <div>
                        <h3 class="text-lg font-bold text-white flex items-center gap-2">
                            <i class="fa-solid fa-database text-teal-400"></i> ${lang === 'bn' ? 'ডাটাবেজ ব্যাকআপ ও ফ্যাক্টরি রিসেট' : 'Database Management & Backup'}
                        </h3>
                        <p class="text-xs text-slate-400 mt-1">Export current system data or restore to demo records.</p>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
                            <div>
                                <h4 class="font-bold text-white text-sm mb-1">${lang === 'bn' ? 'ডাটাবেজ ডাউনলোড (JSON)' : 'Download System Backup'}</h4>
                                <p class="text-xs text-slate-400">Export all records and configurations into a JSON file.</p>
                            </div>
                            <button type="button" onclick="window.downloadDatabaseBackup()" class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2">
                                <i class="fa-solid fa-download"></i> Export smartland_backup.json
                            </button>
                        </div>

                        <div class="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
                            <div>
                                <h4 class="font-bold text-white text-sm mb-1">${lang === 'bn' ? 'ডাটাবেজ রিস্টোর' : 'Restore Database'}</h4>
                                <p class="text-xs text-slate-400">Import a previously saved JSON backup.</p>
                            </div>
                            <label class="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer">
                                <i class="fa-solid fa-upload"></i> Select Backup JSON
                                <input type="file" id="backup-file-input" accept=".json" class="hidden" onchange="window.importDatabaseBackup(event)">
                            </label>
                        </div>
                    </div>

                    <div class="p-5 bg-red-950/20 border border-red-800/40 rounded-2xl space-y-3">
                        <div class="flex items-center gap-2 text-red-400 font-bold text-sm">
                            <i class="fa-solid fa-triangle-exclamation"></i> Factory Default Reset
                        </div>
                        <p class="text-xs text-slate-400 leading-relaxed">
                            Reset all land plots and user profiles back to the default 10 accounts with original DAG records.
                        </p>
                        <button type="button" onclick="window.resetSystemToDefaults()" class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition">
                            Reset to Default
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // --- Dashboard Event Listeners ---
    function bindAdminDashboardEvents() {
        const cmsForm = document.getElementById('admin-cms-form');
        if (cmsForm) {
            cmsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const form = e.target;
                const newConfig = {
                    siteName: form.siteName.value.trim(),
                    siteNameBn: form.siteNameBn.value.trim(),
                    tagline: form.tagline.value.trim(),
                    taglineBn: form.taglineBn.value.trim(),
                    noticeBanner: form.noticeBanner.value.trim(),
                    noticeBannerBn: form.noticeBannerBn ? form.noticeBannerBn.value.trim() : '',
                    enableNotice: form.enableNotice.checked,
                    hotline: form.hotline.value.trim(),
                    supportEmail: form.supportEmail.value.trim()
                };

                GeoTerraStore.updateSiteConfig(newConfig);
                GeoTerraStore.showToast('CMS Updated', 'Website branding, titles and notices published successfully!', 'success');
                renderAdminPanel();
            });
        }

        const mapSettingsForm = document.getElementById('admin-map-settings-form');
        if (mapSettingsForm) {
            mapSettingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const form = e.target;
                const newConfig = {
                    defaultCenter: [parseFloat(form.centerLat.value) || 23.8103, parseFloat(form.centerLng.value) || 90.4125],
                    defaultZoom: parseInt(form.defaultZoom.value) || 11,
                    tileLayer: form.tileLayer.value || 'satellite',
                    defaultDistrict: form.defaultDistrict ? form.defaultDistrict.value : 'Dhaka'
                };
                GeoTerraStore.saveLiveMapConfig(newConfig);
                GeoTerraStore.showToast('Map Settings Saved', 'Live Satellite Map default view coordinates updated!', 'success');
                renderAdminPanel();
            });
        }

        const plotSearch = document.getElementById('admin-plot-search');
        if (plotSearch) {
            plotSearch.addEventListener('input', (e) => {
                plotSearchQuery = e.target.value.trim();
                renderAdminPanel();
            });
        }

        const userSearch = document.getElementById('admin-user-search');
        if (userSearch) {
            userSearch.addEventListener('input', (e) => {
                userSearchQuery = e.target.value.trim();
                renderAdminPanel();
            });
        }

        const weatherSearch = document.getElementById('admin-weather-search');
        if (weatherSearch) {
            weatherSearch.addEventListener('input', (e) => {
                weatherSearchQuery = e.target.value.trim();
                renderAdminPanel();
            });
        }

        const officialSearch = document.getElementById('admin-official-search');
        if (officialSearch) {
            officialSearch.addEventListener('input', (e) => {
                officialSearchQuery = e.target.value.trim();
                renderAdminPanel();
            });
        }

        const officialSector = document.getElementById('admin-official-sector-filter');
        if (officialSector) {
            officialSector.addEventListener('change', (e) => {
                officialSectorFilter = e.target.value;
                renderAdminPanel();
            });
        }

        const officialDivision = document.getElementById('admin-official-division-filter');
        if (officialDivision) {
            officialDivision.addEventListener('change', (e) => {
                officialDivisionFilter = e.target.value;
                renderAdminPanel();
            });
        }

        const policeSearch = document.getElementById('admin-police-search');
        if (policeSearch) {
            policeSearch.addEventListener('input', (e) => {
                policeSearchQuery = e.target.value.trim();
                renderAdminPanel();
            });
        }

        const policeDivision = document.getElementById('admin-police-division-filter');
        if (policeDivision) {
            policeDivision.addEventListener('change', (e) => {
                policeDivisionFilter = e.target.value;
                renderAdminPanel();
            });
        }
    }

    // --- Language Toggle Global Action ---
    window.toggleAppLanguage = function () {
        const newLang = GeoTerraStore.toggleLanguage();
        GeoTerraStore.showToast(newLang === 'bn' ? 'ভাষা পরিবর্তিত' : 'Language Changed', newLang === 'bn' ? 'বাংলা মোড সক্রিয়।' : 'English mode active.', 'info');
        renderAdminPanel();
    };

    window.switchAdminTab = function (tab) {
        currentAdminTab = tab;
        renderAdminPanel();
    };

    window.adminLogout = function () {
        GeoTerraStore.clearAdminSession('Manual sign out');
        sessionStorage.removeItem('geoterra_admin_gate_cleared');
        if (sessionCountdownInterval) {
            clearInterval(sessionCountdownInterval);
            sessionCountdownInterval = null;
        }
        isRobotVerified = false;
        GeoTerraStore.showToast('Signed Out', 'Administrator session ended.', 'info');
        renderAdminPanel();
    };

    // --- Secret Admin Link & Security Management Modal ---
    window.openSecretLinkModal = function () {
        window.closeSecretLinkModal();

        const lang = GeoTerraStore.getLanguage();
        const secretKey = GeoTerraStore.getAdminSecretKey();
        const currentUrl = window.location.origin + window.location.pathname.replace(/\/+$/, '');
        const secretLink = `${currentUrl}?key=${encodeURIComponent(secretKey)}`;
        const logs = GeoTerraStore.getActivityLogs().filter(l => 
            l.action.includes('Security') || l.action.includes('Admin') || l.action.includes('Clearance') || l.action.includes('Gate')
        ).slice(0, 5);

        const modalDiv = document.createElement('div');
        modalDiv.id = 'admin-secret-link-modal';
        modalDiv.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-sans';
        modalDiv.innerHTML = `
            <div class="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden animate-slide-up">
                <!-- Modal Header -->
                <div class="px-6 py-4 bg-gradient-to-r from-amber-950/60 to-slate-900 border-b border-slate-800 flex items-center justify-between">
                    <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                            <i class="fa-solid fa-key text-sm"></i>
                        </div>
                        <div>
                            <h3 class="text-sm font-bold text-white">${lang === 'bn' ? 'গোপন সিকিউরিটি লিংক ও ব্যুরো সেটিংস' : 'Secret Access Link & Security Settings'}</h3>
                            <p class="text-[10px] text-amber-400 font-mono">End-to-End Segregation</p>
                        </div>
                    </div>
                    <button type="button" onclick="window.closeSecretLinkModal()" class="text-slate-400 hover:text-white text-2xl font-bold leading-none">&times;</button>
                </div>

                <div class="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                    <!-- Security Banner -->
                    <div class="p-3.5 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-start gap-3 text-xs text-emerald-200">
                        <i class="fa-solid fa-shield-halved text-emerald-400 text-base mt-0.5 shrink-0"></i>
                        <div class="space-y-1">
                            <span class="font-bold block text-emerald-100">${lang === 'bn' ? 'ওয়েবসাইট থেকে অ্যাডমিন লিংক সম্পূর্ণ গোপন' : 'Admin Panel 100% Segregated'}</span>
                            <p class="text-[11px] text-slate-300">
                                ${lang === 'bn'
                                    ? 'সাধারণ ব্যবহারকারী বা কোনো ভিজিটর ওয়েবসাইট থেকে অ্যাডমিন প্যানেলে ঢুকতে পারবে না। শুধুমাত্র নিচের সিক্রেট লিংক দিয়ে সরাসরি প্রবেশ করা যাবে।'
                                    : 'Public users cannot discover or link to the Admin Panel. You can only enter using the private secret link or passkey below.'}
                            </p>
                        </div>
                    </div>

                    <!-- Direct Secret URL Card -->
                    <div>
                        <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                            <span>${lang === 'bn' ? 'আপনার ব্যক্তিগত সিক্রেট অ্যাডমিন লিংক' : 'Your Private Secret Admin Link'}</span>
                            <span class="text-[10px] text-emerald-400 font-mono font-normal">Direct Entry</span>
                        </label>
                        <div class="flex items-center gap-2">
                            <input type="text" id="secret-admin-link-input" readonly value="${escapeHtml(secretLink)}"
                                class="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-emerald-400 font-mono text-xs select-all focus:outline-none">
                            <button type="button" onclick="window.copySecretAdminLink()" class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-md">
                                <i class="fa-solid fa-copy"></i> ${lang === 'bn' ? 'কপি' : 'Copy'}
                            </button>
                        </div>
                        <p class="text-[10px] text-slate-500 mt-1">
                            ${lang === 'bn' ? '💡 এই লিংকটি বুকমার্ক করে রাখুন যাতে সহজে লগইন করতে পারেন।' : '💡 Bookmark this link in your private browser for instant 1-click access.'}
                        </p>
                    </div>

                    <!-- Passkey Management Form -->
                    <div class="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-3">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-bold text-white flex items-center gap-1.5">
                                <i class="fa-solid fa-lock text-amber-400 text-xs"></i>
                                ${lang === 'bn' ? 'মাস্টার সিকিউরিটি পাসকি পরিবর্তন' : 'Modify Master Security Passkey'}
                            </span>
                            <span class="text-[10px] font-mono text-slate-400">Current: <strong class="text-amber-400">${escapeHtml(secretKey)}</strong></span>
                        </div>
                        <div class="flex items-center gap-2">
                            <input type="text" id="new-admin-passkey-input" placeholder="${lang === 'bn' ? 'নতুন পাসকি দিন (যেমন: mysecret2026)' : 'New passkey (e.g. secure2026)'}"
                                class="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-500">
                            <button type="button" onclick="window.saveNewAdminPasskey()" class="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition shrink-0">
                                ${lang === 'bn' ? 'আপডেট করুন' : 'Update Passkey'}
                            </button>
                        </div>
                    </div>

                    <!-- Active Protections Summary -->
                    <div>
                        <div class="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <i class="fa-solid fa-shield-virus text-teal-400"></i> ${lang === 'bn' ? 'সক্রিয় নিরাপত্তা স্তরসমূহ' : 'Active Security Guardrails'}
                        </div>
                        <div class="grid grid-cols-2 gap-2 text-xs">
                            <div class="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
                                <div class="text-emerald-400 font-bold flex items-center gap-1.5">
                                    <i class="fa-solid fa-robot"></i> Anti-Bot AI Guard
                                </div>
                                <div class="text-[10px] text-slate-400 mt-0.5">Interactive distorted CAPTCHA & Honeypot</div>
                            </div>
                            <div class="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
                                <div class="text-teal-400 font-bold flex items-center gap-1.5">
                                    <i class="fa-solid fa-user-lock"></i> 3-Attempt Lockout
                                </div>
                                <div class="text-[10px] text-slate-400 mt-0.5">5-minute brute-force defense lockout</div>
                            </div>
                            <div class="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
                                <div class="text-blue-400 font-bold flex items-center gap-1.5">
                                    <i class="fa-solid fa-stopwatch"></i> Inactivity Auto-Lock
                                </div>
                                <div class="text-[10px] text-slate-400 mt-0.5">15-minute idle session termination</div>
                            </div>
                            <div class="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
                                <div class="text-purple-400 font-bold flex items-center gap-1.5">
                                    <i class="fa-solid fa-network-wired"></i> 100% Isolated URL
                                </div>
                                <div class="text-[10px] text-slate-400 mt-0.5">Zero public website links or entrypoints</div>
                            </div>
                        </div>
                    </div>

                    <!-- Recent Security Activity Logs -->
                    <div>
                        <div class="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <i class="fa-solid fa-list-check text-slate-400"></i> ${lang === 'bn' ? 'সাম্প্রতিক সিকিউরিটি ইভেন্ট' : 'Recent Security Events'}
                        </div>
                        <div class="space-y-1.5 max-h-36 overflow-y-auto">
                            ${logs.length > 0 ? logs.map(l => `
                                <div class="p-2 bg-slate-950/80 border border-slate-800 rounded-lg flex items-center justify-between text-[11px]">
                                    <div class="overflow-hidden truncate pr-2">
                                        <strong class="text-emerald-400 font-mono">${escapeHtml(l.action)}</strong>: 
                                        <span class="text-slate-300">${escapeHtml(l.details)}</span>
                                    </div>
                                    <span class="text-[10px] text-slate-500 font-mono shrink-0">${new Date(l.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                </div>
                            `).join('') : '<p class="text-xs text-slate-500 italic">No security incidents logged.</p>'}
                        </div>
                    </div>
                </div>

                <div class="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
                    <button type="button" onclick="window.closeSecretLinkModal()" class="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold">
                        ${lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modalDiv);
    };

    window.closeSecretLinkModal = function () {
        const modal = document.getElementById('admin-secret-link-modal');
        if (modal) modal.remove();
    };

    window.copySecretAdminLink = function () {
        const secretKey = GeoTerraStore.getAdminSecretKey();
        const currentUrl = window.location.origin + window.location.pathname.replace(/\/+$/, '');
        const secretLink = `${currentUrl}?key=${encodeURIComponent(secretKey)}`;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(secretLink).then(() => {
                GeoTerraStore.showToast('Copied to Clipboard!', 'Secret Admin URL copied. Bookmark it in your browser.', 'success');
            }).catch(() => {
                fallbackCopy(secretLink);
            });
        } else {
            fallbackCopy(secretLink);
        }
    };

    function fallbackCopy(text) {
        const temp = document.createElement('textarea');
        temp.value = text;
        document.body.appendChild(temp);
        temp.select();
        try {
            document.execCommand('copy');
            GeoTerraStore.showToast('Copied to Clipboard!', 'Secret Admin URL copied.', 'success');
        } catch (e) {
            GeoTerraStore.showToast('Copy Failed', 'Please manually copy the link from the input field.', 'error');
        }
        temp.remove();
    }

    window.saveNewAdminPasskey = function () {
        const input = document.getElementById('new-admin-passkey-input');
        if (!input) return;
        const val = input.value.trim();
        if (!val || val.length < 4) {
            GeoTerraStore.showToast('Invalid Passkey', 'Passkey must be at least 4 characters long.', 'error');
            return;
        }

        const res = GeoTerraStore.setAdminSecretKey(val);
        if (res.success) {
            GeoTerraStore.showToast('Passkey Updated', `New secret passkey is now "${val}". Keep it confidential!`, 'success');
            window.openSecretLinkModal();
            renderAdminPanel();
        } else {
            GeoTerraStore.showToast('Update Failed', res.error, 'error');
        }
    };

    window.filterPlotsByStatus = function (status) {
        plotFilter = status;
        renderAdminPanel();
    };

    window.quickApprovePlot = function (plotId) {
        GeoTerraStore.updatePlotVerification(plotId, {
            policeVerification: 'Approved & Cleared',
            imageVerification: 'Verified',
            cropVerification: 'Verified by Agri Officer'
        });
        GeoTerraStore.showToast('Clearance Approved', `Plot ${plotId} has been verified and cleared!`, 'success');
        renderAdminPanel();
    };

    window.deletePlotAdmin = function (id) {
        if (confirm('Are you sure you want to delete this land plot from the database?')) {
            GeoTerraStore.deleteLand(id);
            GeoTerraStore.showToast('Plot Deleted', 'The land plot was permanently removed.', 'info');
            renderAdminPanel();
        }
    };

    window.deleteUserAdmin = function (username) {
        if (confirm(`Are you sure you want to delete user "${username}" and all associated land plots?`)) {
            GeoTerraStore.deleteUser(username);
            GeoTerraStore.showToast('User Removed', `Account ${username} deleted.`, 'info');
            renderAdminPanel();
        }
    };

    // --- Modals for Plots (Add / Edit) in Admin ---
    window.openAddPlotAdminModal = function () {
        editingPlotId = null;
        const users = GeoTerraStore.getAllUsers();
        const defaultOwner = users[0] || { username: 'akmjobayer', fullName: 'AKM Jobayer', district: 'Dhaka Sadar' };

        renderAdminPlotModal({
            landNumber: 'DAG-' + Math.floor(Math.random() * 8999 + 1000),
            ownerUsername: defaultOwner.username,
            ownerName: defaultOwner.fullName,
            district: defaultOwner.district,
            mouza: defaultOwner.district + ' Mouza',
            area: '15.0 Decimals',
            coordinates: '23.8103° N, 90.4125° E',
            currentCrop: 'Rice / Paddy',
            pastHistory: 'Wheat (2024)',
            imageVerification: 'Verified',
            policeVerification: 'Approved & Cleared',
            cropVerification: 'Verified by Agri Officer',
            landImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
            notes: 'Cadastral surveyed by Smart Land Mapping Admin.'
        }, false);
    };

    window.openEditPlotAdminModal = function (id) {
        const plot = GeoTerraStore.getLandById(id);
        if (plot) {
            editingPlotId = id;
            renderAdminPlotModal(plot, true);
        }
    };

    window.closeAdminPlotModal = function () {
        const modal = document.getElementById('admin-plot-modal');
        if (modal) modal.remove();
    };

    function renderAdminPlotModal(plot, isEdit) {
        window.closeAdminPlotModal();
        const users = GeoTerraStore.getAllUsers();

        const modalDiv = document.createElement('div');
        modalDiv.id = 'admin-plot-modal';
        modalDiv.className = 'fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in';
        modalDiv.innerHTML = `
            <div class="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl text-white my-8">
                <div class="bg-gradient-to-r from-emerald-700 to-teal-800 px-6 py-4 flex justify-between items-center">
                    <h3 class="font-bold text-base flex items-center gap-2">
                        <i class="fa-solid fa-map-location-dot"></i> ${isEdit ? 'Admin Edit: Land Plot Record' : 'Admin Register: New Land Plot'}
                    </h3>
                    <button type="button" onclick="window.closeAdminPlotModal()" class="text-white/80 hover:text-white text-2xl font-bold leading-none">&times;</button>
                </div>
                <form id="admin-plot-form" class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Assign Landowner *</label>
                            <select name="ownerUsername" required class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-medium">
                                ${users.map(u => `
                                    <option value="${escapeHtml(u.username)}" ${plot.ownerUsername === u.username ? 'selected' : ''}>
                                        ${escapeHtml(u.fullName)} (${escapeHtml(u.username)} - ${escapeHtml(u.district)})
                                    </option>
                                `).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Land / DAG Number *</label>
                            <input type="text" name="landNumber" required value="${escapeHtml(plot.landNumber)}" 
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono font-bold focus:outline-none focus:border-emerald-500">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Mouza / Location Name *</label>
                            <input type="text" name="mouza" required value="${escapeHtml(plot.mouza)}" 
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Area / Size *</label>
                            <input type="text" name="area" required value="${escapeHtml(plot.area)}" 
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500" placeholder="12.5 Decimals">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">GPS Coordinates *</label>
                            <input type="text" name="coordinates" required value="${escapeHtml(plot.coordinates)}" 
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-emerald-500" placeholder="23.8103° N, 90.4125° E">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Current Agro Crop *</label>
                            <input type="text" name="currentCrop" required value="${escapeHtml(plot.currentCrop)}" 
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500" placeholder="Rice, Wheat, Sugarcane">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
                        <div>
                            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Police Clearance</label>
                            <select name="policeVerification" class="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-bold">
                                <option value="Approved & Cleared" ${plot.policeVerification.includes('Approved') || plot.policeVerification.includes('Cleared') ? 'selected' : ''}>Approved & Cleared</option>
                                <option value="Pending Station Clearance" ${plot.policeVerification.includes('Pending') ? 'selected' : ''}>Pending Station Clearance</option>
                                <option value="Disputed" ${plot.policeVerification.includes('Disputed') ? 'selected' : ''}>Disputed</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Satellite Image</label>
                            <select name="imageVerification" class="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-bold">
                                <option value="Verified" ${plot.imageVerification === 'Verified' ? 'selected' : ''}>Verified</option>
                                <option value="Pending Review" ${plot.imageVerification === 'Pending Review' ? 'selected' : ''}>Pending Review</option>
                                <option value="Rejected" ${plot.imageVerification === 'Rejected' ? 'selected' : ''}>Rejected</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Agri Inspection</label>
                            <select name="cropVerification" class="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-bold">
                                <option value="Verified by Agri Officer" ${plot.cropVerification && plot.cropVerification.includes('Verified') ? 'selected' : ''}>Verified by Agri Officer</option>
                                <option value="Pending Inspection" ${plot.cropVerification && plot.cropVerification.includes('Pending') ? 'selected' : ''}>Pending Inspection</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Land Image URL</label>
                        <input type="url" name="landImage" value="${escapeHtml(plot.landImage || '')}" 
                            class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500">
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Bureau Surveyor Notes</label>
                        <textarea name="notes" rows="2" 
                            class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500">${escapeHtml(plot.notes || '')}</textarea>
                    </div>

                    <div class="pt-4 border-t border-slate-800 flex justify-end gap-3">
                        <button type="button" onclick="window.closeAdminPlotModal()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold">Cancel</button>
                        <button type="submit" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30">Save Record</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modalDiv);

        document.getElementById('admin-plot-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const form = e.target;
            const ownerU = form.ownerUsername.value;
            const userObj = GeoTerraStore.getUser(ownerU);

            const landData = {
                id: editingPlotId || ('plot-' + Date.now()),
                ownerUsername: ownerU,
                ownerName: userObj ? userObj.fullName : ownerU,
                district: userObj ? userObj.district : 'Dhaka',
                landNumber: form.landNumber.value.trim(),
                mouza: form.mouza.value.trim(),
                area: form.area.value.trim(),
                coordinates: form.coordinates.value.trim(),
                currentCrop: form.currentCrop.value.trim(),
                imageVerification: form.imageVerification.value,
                policeVerification: form.policeVerification.value,
                cropVerification: form.cropVerification.value,
                landImage: form.landImage.value.trim() || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
                notes: form.notes.value.trim()
            };

            GeoTerraStore.saveLand(landData);
            window.closeAdminPlotModal();
            GeoTerraStore.showToast('Plot Saved', `Plot ${landData.landNumber} updated by Admin.`, 'success');
            renderAdminPanel();
        });
    }

    // --- Modals for Users (Add / Edit) ---
    window.openAddUserAdminModal = function () {
        editingUsername = null;
        renderAdminUserModal({
            username: '',
            password: '123',
            fullName: '',
            role: 'Landowner & Surveyor',
            district: 'Dhaka Sadar',
            phone: '+880 1700-000000',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            status: 'Active'
        }, false);
    };

    window.openEditUserAdminModal = function (username) {
        const user = GeoTerraStore.getUser(username);
        if (user) {
            editingUsername = username;
            renderAdminUserModal(user, true);
        }
    };

    window.closeAdminUserModal = function () {
        const modal = document.getElementById('admin-user-modal');
        if (modal) modal.remove();
    };

    window.adminCopyUserCredential = function (text, label) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text);
        } else {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            ta.remove();
        }
        GeoTerraStore.showToast('Copied', `${label} "${text}" copied to clipboard!`, 'info');
    };

    window.adminToggleUserPasswordView = function (username, actualPass) {
        const span = document.getElementById(`admin-pass-val-${username}`);
        const icon = document.getElementById(`admin-pass-icon-${username}`);
        if (!span) return;
        if (span.innerText === '••••••••') {
            span.innerText = actualPass;
            if (icon) icon.className = 'fa-solid fa-eye-slash text-xs';
        } else {
            span.innerText = '••••••••';
            if (icon) icon.className = 'fa-solid fa-eye text-xs';
        }
    };

    window.generateAdminRandomUserPass = function () {
        const words = ['Land', 'Plot', 'Agro', 'Mouza', 'Smart', 'Survey'];
        const word = words[Math.floor(Math.random() * words.length)];
        const num = Math.floor(1000 + Math.random() * 9000);
        const newPass = `${word}@${num}`;
        const input = document.getElementById('admin-user-input-password');
        if (input) {
            input.value = newPass;
            input.focus();
            GeoTerraStore.showToast('Password Generated', `Generated: ${newPass}`, 'info');
        }
    };

    function renderAdminUserModal(user, isEdit) {
        window.closeAdminUserModal();

        const modalDiv = document.createElement('div');
        modalDiv.id = 'admin-user-modal';
        modalDiv.className = 'fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in';
        modalDiv.innerHTML = `
            <div class="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl text-white my-8">
                <div class="bg-gradient-to-r from-emerald-700 to-teal-800 px-6 py-4 flex justify-between items-center">
                    <h3 class="font-bold text-base flex items-center gap-2">
                        <i class="fa-solid fa-user-shield text-emerald-300"></i> ${isEdit ? 'Admin Control: Edit Username & Password' : 'Admin Register: New Landowner'}
                    </h3>
                    <button type="button" onclick="window.closeAdminUserModal()" class="text-white/80 hover:text-white text-2xl font-bold leading-none">&times;</button>
                </div>
                <form id="admin-user-form" class="p-6 space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Full Name *</label>
                            <input type="text" name="fullName" required value="${escapeHtml(user.fullName)}" 
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-emerald-500">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">
                                Username (Login ID) *
                            </label>
                            <input type="text" id="admin-user-input-username" name="username" required value="${escapeHtml(user.username)}" 
                                class="w-full px-3 py-2 bg-slate-950 border border-emerald-500/60 rounded-xl text-emerald-400 font-mono text-xs font-bold focus:outline-none focus:border-emerald-400">
                        </div>
                    </div>

                    ${isEdit ? `
                        <div class="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-[11px] text-emerald-300 flex items-center gap-2">
                            <i class="fa-solid fa-circle-info text-emerald-400 shrink-0"></i>
                            <span>Admin Privilege: If you change the username, all registered land plots and sessions will transfer to the new username automatically.</span>
                        </div>
                    ` : ''}

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">
                                Password (User Pass) *
                            </label>
                            <div class="relative">
                                <input type="text" id="admin-user-input-password" name="password" required value="${escapeHtml(user.password)}" 
                                    class="w-full pl-3 pr-20 py-2 bg-slate-950 border border-amber-500/60 rounded-xl text-amber-300 font-mono text-xs font-bold focus:outline-none focus:border-amber-400">
                                <button type="button" onclick="window.generateAdminRandomUserPass()" class="absolute inset-y-1 right-1 px-2.5 bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white rounded-lg text-[10px] font-sans font-bold transition flex items-center gap-1">
                                    <i class="fa-solid fa-dice"></i> Random
                                </button>
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">District *</label>
                            <input type="text" name="district" required value="${escapeHtml(user.district)}" 
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Role / Designation *</label>
                            <input type="text" name="role" required value="${escapeHtml(user.role)}" 
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Phone Number</label>
                            <input type="text" name="phone" value="${escapeHtml(user.phone || '')}" 
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-emerald-500">
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Avatar Image URL</label>
                        <input type="url" name="avatar" value="${escapeHtml(user.avatar || '')}" 
                            class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500">
                    </div>

                    <div class="pt-4 border-t border-slate-800 flex justify-end gap-3">
                        <button type="button" onclick="window.closeAdminUserModal()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold">Cancel</button>
                        <button type="submit" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5">
                            <i class="fa-solid fa-floppy-disk"></i> Save Credentials & User
                        </button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modalDiv);

        document.getElementById('admin-user-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const form = e.target;
            const userData = {
                username: form.username.value.trim().toLowerCase(),
                fullName: form.fullName.value.trim(),
                password: form.password.value.trim(),
                district: form.district.value.trim(),
                role: form.role.value.trim(),
                phone: form.phone.value.trim(),
                avatar: form.avatar.value.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                status: 'Active'
            };

            const res = GeoTerraStore.updateUser(isEdit ? user.username : null, userData);
            if (!res.success) {
                GeoTerraStore.showToast('Validation Error', res.error, 'error');
                alert(res.error);
                return;
            }

            window.closeAdminUserModal();
            GeoTerraStore.showToast('Credentials Updated', `Username "${userData.username}" & password successfully saved!`, 'success');
            renderAdminPanel();
        });
    }

    // =========================================================================
    // Modals & Handlers for All 9 Modules Requested by User
    // =========================================================================

    // --- 1. Hero Carousel Slide Modal & Actions ---
    window.openAddSlideAdminModal = function () {
        editingSlideId = null;
        renderAdminSlideModal({
            id: '',
            badgeEn: 'GIS SATELLITE 2026',
            badgeBn: 'জিআইএস স্যাটেলাইট ২০২৬',
            titleEn: '',
            titleBn: '',
            descriptionEn: '',
            descriptionBn: '',
            image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
            actionTextEn: 'Explore Live Plots',
            actionTextBn: 'লাইভ প্লট দেখুন',
            actionTab: 'lands'
        }, false);
    };

    window.openEditSlideAdminModal = function (slideId) {
        const slides = GeoTerraStore.getSlides();
        const slide = slides.find(s => s.id === slideId);
        if (slide) {
            editingSlideId = slideId;
            renderAdminSlideModal(slide, true);
        }
    };

    window.closeAdminSlideModal = function () {
        const m = document.getElementById('admin-slide-modal');
        if (m) m.remove();
    };

    function renderAdminSlideModal(slide, isEdit) {
        window.closeAdminSlideModal();

        const modalDiv = document.createElement('div');
        modalDiv.id = 'admin-slide-modal';
        modalDiv.className = 'fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-sans';
        modalDiv.innerHTML = `
            <div class="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl text-white my-8">
                <div class="bg-gradient-to-r from-emerald-700 to-teal-800 px-6 py-4 flex justify-between items-center">
                    <h3 class="font-bold text-base flex items-center gap-2">
                        <i class="fa-solid fa-sliders"></i> ${isEdit ? 'এডিট হিরো স্লাইডার (Edit Slide)' : 'নতুন হিরো স্লাইডার যোগ (Add Hero Slide)'}
                    </h3>
                    <button type="button" onclick="window.closeAdminSlideModal()" class="text-white/80 hover:text-white text-2xl font-bold leading-none">&times;</button>
                </div>
                <form id="admin-slide-form" class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">ব্যাজ টাইটেল (বাংলা)</label>
                            <input type="text" name="badgeBn" value="${escapeHtml(slide.badgeBn || '')}" placeholder="যেমন: জিআইএস স্যাটেলাইট ২০২৬"
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Badge Title (English)</label>
                            <input type="text" name="badgeEn" value="${escapeHtml(slide.badgeEn || '')}" placeholder="e.g. GIS SATELLITE 2026"
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-emerald-500">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">স্লাইড প্রধান শিরোনাম (বাংলা) *</label>
                            <input type="text" name="titleBn" required value="${escapeHtml(slide.titleBn || '')}" placeholder="স্মার্ট ডিজিটাল ভূমি জরিপ"
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-emerald-500">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Hero Slide Title (English) *</label>
                            <input type="text" name="titleEn" required value="${escapeHtml(slide.titleEn || '')}" placeholder="Smart Cadastral Survey"
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-emerald-500">
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">স্লাইডার ব্যাকগ্রাউন্ড ইমেজ URL *</label>
                        <input type="url" name="image" required value="${escapeHtml(slide.image || '')}" placeholder="https://images.unsplash.com/..."
                            class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500">
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">বিস্তারিত বিবরণ (বাংলা)</label>
                            <textarea name="descriptionBn" rows="2" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500">${escapeHtml(slide.descriptionBn || '')}</textarea>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Description (English)</label>
                            <textarea name="descriptionEn" rows="2" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500">${escapeHtml(slide.descriptionEn || '')}</textarea>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            <label class="block text-[11px] font-semibold text-slate-300 uppercase mb-1">অ্যাকশন বাটন (বাংলা)</label>
                            <input type="text" name="actionTextBn" value="${escapeHtml(slide.actionTextBn || 'লাইভ প্লট দেখুন')}" 
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs">
                        </div>
                        <div>
                            <label class="block text-[11px] font-semibold text-slate-300 uppercase mb-1">Button Text (English)</label>
                            <input type="text" name="actionTextEn" value="${escapeHtml(slide.actionTextEn || 'Explore Live Plots')}" 
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs">
                        </div>
                        <div>
                            <label class="block text-[11px] font-semibold text-slate-300 uppercase mb-1">ক্লিক করলে কোন ট্যাবে যাবে</label>
                            <select name="actionTab" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs">
                                <option value="lands" ${slide.actionTab === 'lands' ? 'selected' : ''}>লাইভ প্লটসমূহ (Plots)</option>
                                <option value="livemap" ${slide.actionTab === 'livemap' ? 'selected' : ''}>লাইভ স্যাটেলাইট ম্যাপ (Live Map)</option>
                                <option value="advisor" ${slide.actionTab === 'advisor' ? 'selected' : ''}>জমি পরিকল্পনা (Advisor)</option>
                                <option value="weather" ${slide.actionTab === 'weather' ? 'selected' : ''}>আবহাওয়া বার্তা (Weather)</option>
                                <option value="officials" ${slide.actionTab === 'officials' ? 'selected' : ''}>কর্মকর্তা তালিকা (Officials)</option>
                                <option value="police" ${slide.actionTab === 'police' ? 'selected' : ''}>জরুরি পুলিশ (Police)</option>
                                <option value="gallery" ${slide.actionTab === 'gallery' ? 'selected' : ''}>চিত্রশালা (Gallery)</option>
                                <option value="dashboard" ${slide.actionTab === 'dashboard' ? 'selected' : ''}>ড্যাশবোর্ড (Dashboard)</option>
                            </select>
                        </div>
                    </div>

                    <div class="pt-4 border-t border-slate-800 flex justify-end gap-3">
                        <button type="button" onclick="window.closeAdminSlideModal()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold">বাতিল</button>
                        <button type="submit" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30">সংরক্ষণ করুন</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modalDiv);

        document.getElementById('admin-slide-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const form = e.target;
            const slideData = {
                id: editingSlideId || ('slide-' + Date.now()),
                badgeBn: form.badgeBn.value.trim(),
                badgeEn: form.badgeEn.value.trim(),
                titleBn: form.titleBn.value.trim(),
                titleEn: form.titleEn.value.trim(),
                image: form.image.value.trim(),
                descriptionBn: form.descriptionBn.value.trim(),
                descriptionEn: form.descriptionEn.value.trim(),
                actionTextBn: form.actionTextBn.value.trim(),
                actionTextEn: form.actionTextEn.value.trim(),
                actionTab: form.actionTab.value
            };

            GeoTerraStore.saveSlide(slideData);
            window.closeAdminSlideModal();
            GeoTerraStore.showToast('স্লাইডার সংরক্ষিত', 'হিরো স্লাইডার তথ্য সফলভাবে আপডেট হয়েছে।', 'success');
            renderAdminPanel();
        });
    }

    window.adminDeleteSlide = function (slideId) {
        if (confirm('আপনি কি নিশ্চিত যে এই হিরো স্লাইডটি ওয়েবসাইট থেকে মুছে ফেলতে চান?')) {
            GeoTerraStore.deleteSlide(slideId);
            GeoTerraStore.showToast('Slide Deleted', 'Hero carousel slide removed.', 'info');
            renderAdminPanel();
        }
    };

    // --- 2. Live Map Handlers ---
    window.resetLiveMapView = function () {
        const cfg = GeoTerraStore.getLiveMapConfig();
        if (adminLiveMapInstance) {
            adminLiveMapInstance.setView(cfg.defaultCenter || [23.8103, 90.4125], cfg.defaultZoom || 11);
            GeoTerraStore.showToast('Map Reset', 'Map view centered to default coordinates.', 'info');
        }
    };

    window.copyClickedCoordinates = function () {
        const coords = document.getElementById('map-clicked-coords-display')?.innerText;
        if (coords && coords !== 'Click anywhere on map...') {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(coords);
            }
            GeoTerraStore.showToast('স্থানাঙ্ক কপি হয়েছে', `GPS: ${coords}`, 'success');
        }
    };

    window.createPlotWithClickedCoords = function () {
        const coords = document.getElementById('map-clicked-coords-display')?.innerText;
        window.openAddPlotAdminModal();
        if (coords && coords !== 'Click anywhere on map...') {
            setTimeout(() => {
                const input = document.querySelector('#admin-plot-form input[name="coordinates"]');
                if (input) input.value = coords;
            }, 60);
        }
    };

    window.flyToAdminMapPlot = function (lat, lng, dagNumber) {
        if (adminLiveMapInstance) {
            adminLiveMapInstance.flyTo([lat, lng], 16, { duration: 1.5 });
            GeoTerraStore.showToast('Plot Located', `Panned map to ${dagNumber}`, 'info');
        }
    };

    // --- 3. Land Advisor Model Modal & Actions ---
    window.openAddAdvisorModelModal = function () {
        editingAdvisorModelKey = null;
        renderAdminAdvisorModelModal({
            key: 'model-' + Date.now(),
            nameBn: '',
            nameEn: '',
            icon: 'fa-seedling',
            color: 'emerald',
            badgeBn: 'নতুন মডেল',
            badgeEn: 'New Model',
            overviewBn: '',
            overviewEn: '',
            suitabilityBn: '',
            suitabilityEn: '',
            expectedYieldBn: '',
            expectedYieldEn: '',
            budgetPerDecBn: '',
            budgetPerDecEn: '',
            roiTimelineBn: '',
            roiTimelineEn: '',
            subsidyBn: '',
            subsidyEn: ''
        }, false);
    };

    window.openEditAdvisorModelModal = function (modelKey) {
        const templates = GeoTerraStore.getLandAdvisorTemplates();
        const model = (templates.models || []).find(m => m.key === modelKey);
        if (model) {
            editingAdvisorModelKey = modelKey;
            renderAdminAdvisorModelModal(model, true);
        }
    };

    window.closeAdminAdvisorModal = function () {
        const m = document.getElementById('admin-advisor-modal');
        if (m) m.remove();
    };

    function renderAdminAdvisorModelModal(model, isEdit) {
        window.closeAdminAdvisorModal();

        const modalDiv = document.createElement('div');
        modalDiv.id = 'admin-advisor-modal';
        modalDiv.className = 'fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-sans';
        modalDiv.innerHTML = `
            <div class="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl text-white my-8">
                <div class="bg-gradient-to-r from-teal-700 to-emerald-800 px-6 py-4 flex justify-between items-center">
                    <h3 class="font-bold text-base flex items-center gap-2">
                        <i class="fa-solid fa-compass-drafting"></i> ${isEdit ? 'এডিট জমি পরিকল্পনা মডেল (Edit Model)' : 'নতুন জমি পরিকল্পনা মডেল তৈরি (Create Model)'}
                    </h3>
                    <button type="button" onclick="window.closeAdminAdvisorModal()" class="text-white/80 hover:text-white text-2xl font-bold leading-none">&times;</button>
                </div>
                <form id="admin-advisor-form" class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">মডেল ইউনিক কি (Key) *</label>
                            <input type="text" name="key" required value="${escapeHtml(model.key)}" ${isEdit ? 'readonly' : ''}
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-teal-400 font-mono text-xs focus:outline-none">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">আইকন ক্লাস (FontAwesome)</label>
                            <input type="text" name="icon" value="${escapeHtml(model.icon || 'fa-seedling')}" placeholder="fa-apple-whole, fa-cow"
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">কালার থিম</label>
                            <select name="color" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs">
                                <option value="emerald" ${model.color === 'emerald' ? 'selected' : ''}>Emerald (Green)</option>
                                <option value="teal" ${model.color === 'teal' ? 'selected' : ''}>Teal (Cyan)</option>
                                <option value="blue" ${model.color === 'blue' ? 'selected' : ''}>Blue</option>
                                <option value="amber" ${model.color === 'amber' ? 'selected' : ''}>Amber (Orange)</option>
                                <option value="indigo" ${model.color === 'indigo' ? 'selected' : ''}>Indigo</option>
                                <option value="purple" ${model.color === 'purple' ? 'selected' : ''}>Purple</option>
                                <option value="rose" ${model.color === 'rose' ? 'selected' : ''}>Rose (Red)</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">মডেলের নাম (বাংলা) *</label>
                            <input type="text" name="nameBn" required value="${escapeHtml(model.nameBn || '')}" placeholder="বাণিজ্যিক ফলদ বাগান"
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-teal-500">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Model Name (English) *</label>
                            <input type="text" name="nameEn" required value="${escapeHtml(model.nameEn || '')}" placeholder="High-Value Fruit Orchard"
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-teal-500">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">হাইলাইট ব্যাজ (বাংলা)</label>
                            <input type="text" name="badgeBn" value="${escapeHtml(model.badgeBn || '')}" placeholder="সর্বাধিক দীর্ঘমেয়াদি মুনাফা"
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Highlight Badge (English)</label>
                            <input type="text" name="badgeEn" value="${escapeHtml(model.badgeEn || '')}" placeholder="Highest Long-Term ROI"
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">মডেল সারসংক্ষেপ (বাংলা)</label>
                            <textarea name="overviewBn" rows="2" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs">${escapeHtml(model.overviewBn || '')}</textarea>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Overview (English)</label>
                            <textarea name="overviewEn" rows="2" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs">${escapeHtml(model.overviewEn || '')}</textarea>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">জমির ধরন ও উপযোগিতা (বাংলা)</label>
                            <input type="text" name="suitabilityBn" value="${escapeHtml(model.suitabilityBn || '')}" placeholder="উঁচু ও মাঝারি উঁচু দোআঁশ জমি"
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Suitability (English)</label>
                            <input type="text" name="suitabilityEn" value="${escapeHtml(model.suitabilityEn || '')}" placeholder="Elevated sandy-loam soil"
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">প্রতি শতাংশে আনুমানিক খরচ (বাংলা)</label>
                            <input type="text" name="budgetPerDecBn" value="${escapeHtml(model.budgetPerDecBn || '')}" placeholder="৮,০০০ - ১২,০০০ টাকা / শতাংশ"
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Budget / Decimal (English)</label>
                            <input type="text" name="budgetPerDecEn" value="${escapeHtml(model.budgetPerDecEn || '')}" placeholder="BDT 8,000 - 12,000 / decimal"
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">প্রত্যাশিত বাৎসরিক আয় (বাংলা)</label>
                            <input type="text" name="expectedYieldBn" value="${escapeHtml(model.expectedYieldBn || '')}" placeholder="প্রতি বিঘায় বার্ষিক ১.৫ - ২.৫ লাখ টাকা"
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Expected Yield (English)</label>
                            <input type="text" name="expectedYieldEn" value="${escapeHtml(model.expectedYieldEn || '')}" placeholder="BDT 1,50,000 - 2,50,000 / bigha"
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">ব্রেক-ইভেন ও লাভজনক সময় (বাংলা)</label>
                            <input type="text" name="roiTimelineBn" value="${escapeHtml(model.roiTimelineBn || '')}" placeholder="১৮ থেকে ২৪ মাস"
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">সরকারি ভর্তুকি ও প্রণোদনা সুবিধা (বাংলা)</label>
                            <input type="text" name="subsidyBn" value="${escapeHtml(model.subsidyBn || '')}" placeholder="বাংলাদেশ ব্যাংকের ৪% রেয়াতি কৃষি ঋণ"
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs">
                        </div>
                    </div>

                    <div class="pt-4 border-t border-slate-800 flex justify-end gap-3">
                        <button type="button" onclick="window.closeAdminAdvisorModal()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold">বাতিল</button>
                        <button type="submit" class="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-teal-600/30">সংরক্ষণ করুন</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modalDiv);

        document.getElementById('admin-advisor-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const form = e.target;
            const modelData = {
                key: form.key.value.trim(),
                nameBn: form.nameBn.value.trim(),
                nameEn: form.nameEn.value.trim(),
                icon: form.icon.value.trim(),
                color: form.color.value,
                badgeBn: form.badgeBn.value.trim(),
                badgeEn: form.badgeEn.value.trim(),
                overviewBn: form.overviewBn.value.trim(),
                overviewEn: form.overviewEn.value.trim(),
                suitabilityBn: form.suitabilityBn.value.trim(),
                suitabilityEn: form.suitabilityEn.value.trim(),
                budgetPerDecBn: form.budgetPerDecBn.value.trim(),
                budgetPerDecEn: form.budgetPerDecEn.value.trim(),
                expectedYieldBn: form.expectedYieldBn.value.trim(),
                expectedYieldEn: form.expectedYieldEn.value.trim(),
                roiTimelineBn: form.roiTimelineBn.value.trim(),
                subsidyBn: form.subsidyBn.value.trim()
            };

            GeoTerraStore.saveLandAdvisorModel(modelData);
            window.closeAdminAdvisorModal();
            GeoTerraStore.showToast('মডেল সংরক্ষিত', `পরিকল্পনা মডেল "${modelData.nameBn}" সংরক্ষিত হয়েছে।`, 'success');
            renderAdminPanel();
        });
    }

    window.adminDeleteAdvisorModel = function (modelKey) {
        if (confirm(`আপনি কি নিশ্চিত যে "${modelKey}" মডেলটি মুছে ফেলতে চান?`)) {
            GeoTerraStore.deleteLandAdvisorModel(modelKey);
            GeoTerraStore.showToast('Model Deleted', `Land planning model ${modelKey} removed.`, 'info');
            renderAdminPanel();
        }
    };

    // --- 4. Agro-Weather Center Modal & Actions ---
    window.openAddWeatherModal = function () {
        editingWeatherDistrict = null;
        renderAdminWeatherModal({
            district: '',
            districtBn: '',
            division: 'Dhaka',
            temp: 29,
            feelsLike: 31,
            conditionBn: 'পরিষ্কার আকাশ ও মনোরম আবহাওয়া',
            conditionEn: 'Clear Sky & Pleasant',
            icon: 'fa-sun',
            humidity: '60%',
            rainChance: '10%',
            wind: '10 km/h S',
            uvIndex: '6 (Moderate)',
            soilMoisture: '৫৮% (পর্যাপ্ত)',
            soilTemp: '২৫°C',
            airQuality: 'AQI 85 (ভালো)',
            agriAdvisory: {
                cropAdviceBn: 'রবি শস্য ও শাকসবজি নার্সারিতে হালকা সেচ দিন।',
                cropAdviceEn: 'Provide light irrigation in vegetable nurseries.',
                sprayAlertBn: 'সকাল ১০টা থেকে দুপুর ২টার মধ্যে স্প্রে করুন।',
                sprayAlertEn: 'Spray window 10am to 2pm.',
                specialAlertBn: 'বৃষ্টির সম্ভাবনা কম।'
            }
        }, false);
    };

    window.openEditWeatherModal = function (districtKey) {
        const weather = GeoTerraStore.getDistrictWeather(districtKey);
        if (weather) {
            editingWeatherDistrict = districtKey;
            renderAdminWeatherModal(weather, true);
        }
    };

    window.closeAdminWeatherModal = function () {
        const m = document.getElementById('admin-weather-modal');
        if (m) m.remove();
    };

    function renderAdminWeatherModal(weather, isEdit) {
        window.closeAdminWeatherModal();

        const modalDiv = document.createElement('div');
        modalDiv.id = 'admin-weather-modal';
        modalDiv.className = 'fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-sans';
        modalDiv.innerHTML = `
            <div class="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl text-white my-8">
                <div class="bg-gradient-to-r from-amber-600 to-orange-700 px-6 py-4 flex justify-between items-center">
                    <h3 class="font-bold text-base flex items-center gap-2">
                        <i class="fa-solid fa-cloud-sun-rain"></i> ${isEdit ? 'এডিট জেলা কৃষি আবহাওয়া (Edit Weather)' : 'নতুন জেলার আবহাওয়া বার্তা যোগ'}
                    </h3>
                    <button type="button" onclick="window.closeAdminWeatherModal()" class="text-white/80 hover:text-white text-2xl font-bold leading-none">&times;</button>
                </div>
                <form id="admin-weather-form" class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">জেলার নাম (English) *</label>
                            <input type="text" name="district" required value="${escapeHtml(weather.district)}" ${isEdit ? 'readonly' : ''} placeholder="Dhaka, Khulna"
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-amber-400 font-bold text-xs focus:outline-none">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">জেলার নাম (বাংলা) *</label>
                            <input type="text" name="districtBn" required value="${escapeHtml(weather.districtBn || '')}" placeholder="ঢাকা, খুলনা"
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-bold">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">বিভাগ (Division)</label>
                            <select name="division" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs">
                                <option value="Dhaka" ${weather.division === 'Dhaka' ? 'selected' : ''}>Dhaka</option>
                                <option value="Chittagong" ${weather.division === 'Chittagong' ? 'selected' : ''}>Chittagong</option>
                                <option value="Rajshahi" ${weather.division === 'Rajshahi' ? 'selected' : ''}>Rajshahi</option>
                                <option value="Khulna" ${weather.division === 'Khulna' ? 'selected' : ''}>Khulna</option>
                                <option value="Sylhet" ${weather.division === 'Sylhet' ? 'selected' : ''}>Sylhet</option>
                                <option value="Barisal" ${weather.division === 'Barisal' ? 'selected' : ''}>Barisal</option>
                                <option value="Rangpur" ${weather.division === 'Rangpur' ? 'selected' : ''}>Rangpur</option>
                                <option value="Mymensingh" ${weather.division === 'Mymensingh' ? 'selected' : ''}>Mymensingh</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                            <label class="block text-[11px] font-semibold text-slate-300 uppercase mb-1">তাপমাত্রা (°C)</label>
                            <input type="number" name="temp" required value="${weather.temp || 28}" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-bold font-mono">
                        </div>
                        <div>
                            <label class="block text-[11px] font-semibold text-slate-300 uppercase mb-1">অনুভূত (°C)</label>
                            <input type="number" name="feelsLike" required value="${weather.feelsLike || 30}" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-bold font-mono">
                        </div>
                        <div>
                            <label class="block text-[11px] font-semibold text-slate-300 uppercase mb-1">আর্দ্রতা (%)</label>
                            <input type="text" name="humidity" value="${escapeHtml(weather.humidity || '60%')}" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono">
                        </div>
                        <div>
                            <label class="block text-[11px] font-semibold text-slate-300 uppercase mb-1">বৃষ্টির সম্ভাবনা</label>
                            <input type="text" name="rainChance" value="${escapeHtml(weather.rainChance || '10%')}" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">আবহাওয়া অবস্থা (বাংলা)</label>
                            <input type="text" name="conditionBn" value="${escapeHtml(weather.conditionBn || 'পরিষ্কার আকাশ')}" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Condition (English)</label>
                            <input type="text" name="conditionEn" value="${escapeHtml(weather.conditionEn || 'Clear Sky')}" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs">
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">কৃষি পরামর্শ বার্তা (Crop Advisory - বাংলা)</label>
                        <textarea name="cropAdviceBn" rows="2" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs">${escapeHtml(weather.agriAdvisory?.cropAdviceBn || '')}</textarea>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">স্প্রে অ্যালার্ট বার্তা (Spray Alert)</label>
                            <input type="text" name="sprayAlertBn" value="${escapeHtml(weather.agriAdvisory?.sprayAlertBn || '')}" placeholder="সকাল ১০টা থেকে দুপুর ২টার মধ্যে স্প্রে করুন"
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">বিশেষ আবহাওয়া সতর্কতা (Alert)</label>
                            <input type="text" name="specialAlertBn" value="${escapeHtml(weather.agriAdvisory?.specialAlertBn || '')}" placeholder="বৃষ্টির সম্ভাবনা কম, সেচ চালু রাখুন"
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs">
                        </div>
                    </div>

                    <div class="pt-4 border-t border-slate-800 flex justify-end gap-3">
                        <button type="button" onclick="window.closeAdminWeatherModal()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold">বাতিল</button>
                        <button type="submit" class="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-600/30">সংরক্ষণ করুন</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modalDiv);

        document.getElementById('admin-weather-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const form = e.target;
            const distKey = form.district.value.trim();
            const weatherData = {
                district: distKey,
                districtBn: form.districtBn.value.trim(),
                division: form.division.value,
                temp: parseInt(form.temp.value) || 28,
                feelsLike: parseInt(form.feelsLike.value) || 30,
                humidity: form.humidity.value.trim(),
                rainChance: form.rainChance.value.trim(),
                conditionBn: form.conditionBn.value.trim(),
                conditionEn: form.conditionEn.value.trim(),
                icon: 'fa-sun',
                agriAdvisory: {
                    cropAdviceBn: form.cropAdviceBn.value.trim(),
                    sprayAlertBn: form.sprayAlertBn.value.trim(),
                    specialAlertBn: form.specialAlertBn.value.trim()
                }
            };

            GeoTerraStore.saveDistrictWeather(distKey, weatherData);
            window.closeAdminWeatherModal();
            GeoTerraStore.showToast('আবহাওয়া বার্তা সংরক্ষিত', `${weatherData.districtBn} জেলার আবহাওয়া আপডেট হয়েছে।`, 'success');
            renderAdminPanel();
        });
    }

    window.adminDeleteWeather = function (districtKey) {
        if (confirm(`আপনি কি "${districtKey}" জেলার আবহাওয়া তথ্য মুছে ফেলতে চান?`)) {
            GeoTerraStore.deleteDistrictWeather(districtKey);
            GeoTerraStore.showToast('Weather Removed', `Weather entry for ${districtKey} deleted.`, 'info');
            renderAdminPanel();
        }
    };

    // --- 5. Land Officials Modal & Actions ---
    window.openAddOfficialModal = function () {
        editingOfficialId = null;
        renderAdminOfficialModal({
            id: '',
            officerNameBn: '',
            officerNameEn: '',
            titleBn: 'সহকারী কমিশনার (ভূমি) - এসি ল্যান্ড',
            titleEn: 'Assistant Commissioner (Land) - AC Land',
            sector: 'land',
            division: 'Dhaka',
            district: 'Dhaka',
            officeBn: '',
            officeEn: '',
            phone: '01700-000000',
            landline: '',
            email: '',
            servicesBn: 'ই-নামজারি, ডিসিআর ও খাজনা দাখিলা, সীমানা নির্ধারণ শুনানী।'
        }, false);
    };

    window.openEditOfficialModal = function (officialId) {
        const officials = GeoTerraStore.getLandOfficials();
        const off = officials.find(o => o.id === officialId);
        if (off) {
            editingOfficialId = officialId;
            renderAdminOfficialModal(off, true);
        }
    };

    window.closeAdminOfficialModal = function () {
        const m = document.getElementById('admin-official-modal');
        if (m) m.remove();
    };

    function renderAdminOfficialModal(official, isEdit) {
        window.closeAdminOfficialModal();

        const modalDiv = document.createElement('div');
        modalDiv.id = 'admin-official-modal';
        modalDiv.className = 'fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-sans';
        modalDiv.innerHTML = `
            <div class="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl text-white my-8">
                <div class="bg-gradient-to-r from-blue-700 to-indigo-800 px-6 py-4 flex justify-between items-center">
                    <h3 class="font-bold text-base flex items-center gap-2">
                        <i class="fa-solid fa-user-tie"></i> ${isEdit ? 'এডিট কর্মকর্তা তথ্য (Edit Official)' : 'নতুন ভূমি/কৃষি কর্মকর্তা যোগ (Add Official)'}
                    </h3>
                    <button type="button" onclick="window.closeAdminOfficialModal()" class="text-white/80 hover:text-white text-2xl font-bold leading-none">&times;</button>
                </div>
                <form id="admin-official-form" class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">কর্মকর্তার নাম (বাংলা) *</label>
                            <input type="text" name="officerNameBn" required value="${escapeHtml(official.officerNameBn || '')}" placeholder="মুহাম্মদ আশরাফুল আলম"
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-blue-500">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Officer Name (English)</label>
                            <input type="text" name="officerNameEn" value="${escapeHtml(official.officerNameEn || '')}" placeholder="Md. Ashraful Alam"
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">পদবী (বাংলা) *</label>
                            <input type="text" name="titleBn" required value="${escapeHtml(official.titleBn || '')}" placeholder="সহকারী কমিশনার (ভূমি) - এসি ল্যান্ড"
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-bold">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">সেক্টর / বিভাগীয় কাজের ধরন</label>
                            <select name="sector" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-bold">
                                <option value="land" ${official.sector === 'land' ? 'selected' : ''}>ভূমি প্রশাসন ও রেজিস্ট্রি (AC Land / Sub-Reg)</option>
                                <option value="agriculture" ${official.sector === 'agriculture' ? 'selected' : ''}>কৃষি সম্প্রসারণ ও মৃত্তিকা (DAE / Agri)</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">জেলা (District) *</label>
                            <input type="text" name="district" required value="${escapeHtml(official.district || 'Dhaka')}" placeholder="Dhaka, Gazipur, Cumilla"
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">বিভাগ (Division)</label>
                            <select name="division" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs">
                                <option value="Dhaka" ${official.division === 'Dhaka' ? 'selected' : ''}>Dhaka</option>
                                <option value="Chittagong" ${official.division === 'Chittagong' ? 'selected' : ''}>Chittagong</option>
                                <option value="Rajshahi" ${official.division === 'Rajshahi' ? 'selected' : ''}>Rajshahi</option>
                                <option value="Khulna" ${official.division === 'Khulna' ? 'selected' : ''}>Khulna</option>
                                <option value="Sylhet" ${official.division === 'Sylhet' ? 'selected' : ''}>Sylhet</option>
                                <option value="Barisal" ${official.division === 'Barisal' ? 'selected' : ''}>Barisal</option>
                                <option value="Rangpur" ${official.division === 'Rangpur' ? 'selected' : ''}>Rangpur</option>
                                <option value="Mymensingh" ${official.division === 'Mymensingh' ? 'selected' : ''}>Mymensingh</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">মোবাইল ফোন নম্বর *</label>
                            <input type="text" name="phone" required value="${escapeHtml(official.phone || '')}" placeholder="01712034567"
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-blue-300 font-mono text-xs font-bold">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">ইমেইল ঠিকানা</label>
                            <input type="email" name="email" value="${escapeHtml(official.email || '')}" placeholder="acland.dhakasdr@land.gov.bd"
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono">
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">অফিসের ঠিকানা (বাংলা)</label>
                        <input type="text" name="officeBn" value="${escapeHtml(official.officeBn || '')}" placeholder="উপজেলা ভূমি অফিস, সদর, ঢাকা"
                            class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs">
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">প্রদত্ত নাগরিক সেবা ও দায়িত্ব</label>
                        <textarea name="servicesBn" rows="2" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs">${escapeHtml(official.servicesBn || '')}</textarea>
                    </div>

                    <div class="pt-4 border-t border-slate-800 flex justify-end gap-3">
                        <button type="button" onclick="window.closeAdminOfficialModal()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold">বাতিল</button>
                        <button type="submit" class="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30">সংরক্ষণ করুন</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modalDiv);

        document.getElementById('admin-official-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const form = e.target;
            const officialData = {
                id: editingOfficialId || ('off-' + Date.now()),
                officerNameBn: form.officerNameBn.value.trim(),
                officerNameEn: form.officerNameEn.value.trim(),
                titleBn: form.titleBn.value.trim(),
                titleEn: form.titleBn.value.trim(),
                sector: form.sector.value,
                sectorBn: form.sector.value === 'land' ? 'ভূমি প্রশাসন ও রেজিস্ট্রি' : 'কৃষি সম্প্রসারণ ও মৃত্তিকা',
                district: form.district.value.trim(),
                division: form.division.value,
                phone: form.phone.value.trim(),
                email: form.email.value.trim(),
                officeBn: form.officeBn.value.trim(),
                servicesBn: form.servicesBn.value.trim()
            };

            GeoTerraStore.saveLandOfficial(officialData);
            window.closeAdminOfficialModal();
            GeoTerraStore.showToast('কর্মকর্তা সংরক্ষিত', `কর্মকর্তা "${officialData.officerNameBn}" সংরক্ষিত হয়েছে।`, 'success');
            renderAdminPanel();
        });
    }

    window.adminDeleteOfficial = function (officialId) {
        if (confirm('আপনি কি নিশ্চিত যে এই কর্মকর্তার তথ্য মুছে ফেলতে চান?')) {
            GeoTerraStore.deleteLandOfficial(officialId);
            GeoTerraStore.showToast('Official Removed', 'Official record permanently removed.', 'info');
            renderAdminPanel();
        }
    };

    // --- 6. Emergency Police Station Modal & Actions ---
    window.openAddPoliceModal = function () {
        editingPoliceId = null;
        renderAdminPoliceModal({
            id: '',
            nameBn: '',
            name: '',
            thanaBn: '',
            thana: '',
            districtBn: 'ঢাকা',
            district: 'Dhaka',
            division: 'Dhaka',
            phone: '01713370000',
            dutyOfficer: '01320000000',
            address: '',
            type: 'Metropolitan Model Thana'
        }, false);
    };

    window.openEditPoliceModal = function (policeId) {
        const stations = GeoTerraStore.getPoliceStations();
        const station = stations.find(s => s.id === policeId);
        if (station) {
            editingPoliceId = policeId;
            renderAdminPoliceModal(station, true);
        }
    };

    window.closeAdminPoliceModal = function () {
        const m = document.getElementById('admin-police-modal');
        if (m) m.remove();
    };

    function renderAdminPoliceModal(station, isEdit) {
        window.closeAdminPoliceModal();

        const modalDiv = document.createElement('div');
        modalDiv.id = 'admin-police-modal';
        modalDiv.className = 'fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-sans';
        modalDiv.innerHTML = `
            <div class="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl text-white my-8">
                <div class="bg-gradient-to-r from-red-700 to-rose-800 px-6 py-4 flex justify-between items-center">
                    <h3 class="font-bold text-base flex items-center gap-2">
                        <i class="fa-solid fa-shield-halved"></i> ${isEdit ? 'এডিট থানা পুলিশ তথ্য (Edit Police Station)' : 'নতুন থানা পুলিশ স্টেশন যোগ (Add Station)'}
                    </h3>
                    <button type="button" onclick="window.closeAdminPoliceModal()" class="text-white/80 hover:text-white text-2xl font-bold leading-none">&times;</button>
                </div>
                <form id="admin-police-form" class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">থানার নাম (বাংলা) *</label>
                            <input type="text" name="nameBn" required value="${escapeHtml(station.nameBn || station.name || '')}" placeholder="রমনা মডেল থানা, ডিএমপি ঢাকা"
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-red-500">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Station Name (English)</label>
                            <input type="text" name="name" value="${escapeHtml(station.name || '')}" placeholder="DMP Ramna Model Police Station"
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">থানা / উপজেলা *</label>
                            <input type="text" name="thana" required value="${escapeHtml(station.thana || '')}" placeholder="Ramna, Savar"
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-bold">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">জেলা (District) *</label>
                            <input type="text" name="district" required value="${escapeHtml(station.district || 'Dhaka')}" placeholder="Dhaka, Bogra"
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-bold">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">বিভাগ (Division)</label>
                            <select name="division" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-bold">
                                <option value="Dhaka" ${station.division === 'Dhaka' ? 'selected' : ''}>Dhaka</option>
                                <option value="Chittagong" ${station.division === 'Chittagong' ? 'selected' : ''}>Chittagong</option>
                                <option value="Rajshahi" ${station.division === 'Rajshahi' ? 'selected' : ''}>Rajshahi</option>
                                <option value="Khulna" ${station.division === 'Khulna' ? 'selected' : ''}>Khulna</option>
                                <option value="Sylhet" ${station.division === 'Sylhet' ? 'selected' : ''}>Sylhet</option>
                                <option value="Barisal" ${station.division === 'Barisal' ? 'selected' : ''}>Barisal</option>
                                <option value="Rangpur" ${station.division === 'Rangpur' ? 'selected' : ''}>Rangpur</option>
                                <option value="Mymensingh" ${station.division === 'Mymensingh' ? 'selected' : ''}>Mymensingh</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">ওসি মোবাইল নম্বর (OC Mobile) *</label>
                            <input type="text" name="phone" required value="${escapeHtml(station.phone || '')}" placeholder="01713373125"
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-red-300 font-mono text-xs font-bold">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">ডিউটি অফিসার নম্বর (Duty Officer)</label>
                            <input type="text" name="dutyOfficer" value="${escapeHtml(station.dutyOfficer || '')}" placeholder="01320037800"
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-amber-300 font-mono text-xs font-bold">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">থানার ধরন (Type)</label>
                            <input type="text" name="type" value="${escapeHtml(station.type || 'Metropolitan Model Thana')}" placeholder="Metropolitan Model Thana, District Thana"
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">ঠিকানা / লোকেশন</label>
                            <input type="text" name="address" value="${escapeHtml(station.address || '')}" placeholder="Ramna, Dhaka-1000"
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs">
                        </div>
                    </div>

                    <div class="pt-4 border-t border-slate-800 flex justify-end gap-3">
                        <button type="button" onclick="window.closeAdminPoliceModal()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold">বাতিল</button>
                        <button type="submit" class="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-600/30">সংরক্ষণ করুন</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modalDiv);

        document.getElementById('admin-police-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const form = e.target;
            const stationData = {
                id: editingPoliceId || ('pol-' + Date.now()),
                nameBn: form.nameBn.value.trim(),
                name: form.name.value.trim() || form.nameBn.value.trim(),
                thanaBn: form.thana.value.trim(),
                thana: form.thana.value.trim(),
                districtBn: form.district.value.trim(),
                district: form.district.value.trim(),
                division: form.division.value,
                divisionBn: form.division.value,
                phone: form.phone.value.trim(),
                dutyOfficer: form.dutyOfficer.value.trim(),
                type: form.type.value.trim(),
                address: form.address.value.trim()
            };

            GeoTerraStore.savePoliceStation(stationData);
            window.closeAdminPoliceModal();
            GeoTerraStore.showToast('থানা সংরক্ষিত', `পুলিশ স্টেশন "${stationData.nameBn}" আপডেট হয়েছে।`, 'success');
            renderAdminPanel();
        });
    }

    window.adminDeletePolice = function (stationId) {
        if (confirm('আপনি কি নিশ্চিত যে এই পুলিশ স্টেশনটি তালিকা থেকে মুছে ফেলতে চান?')) {
            GeoTerraStore.deletePoliceStation(stationId);
            GeoTerraStore.showToast('Police Station Deleted', 'Station record removed.', 'info');
            renderAdminPanel();
        }
    };

    // --- 7. Cadastral Gallery Modal & Actions ---
    window.openAddGalleryModal = function () {
        editingGalleryId = null;
        renderAdminGalleryModal({
            id: '',
            titleBn: '',
            titleEn: '',
            category: 'Agricultural',
            categoryBn: 'কৃষি জমি',
            locationBn: '',
            location: '',
            image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
            descriptionBn: '',
            descriptionEn: ''
        }, false);
    };

    window.openEditGalleryModal = function (photoId) {
        const photos = GeoTerraStore.getGalleryPhotos('all');
        const photo = photos.find(p => p.id === photoId);
        if (photo) {
            editingGalleryId = photoId;
            renderAdminGalleryModal(photo, true);
        }
    };

    window.closeAdminGalleryModal = function () {
        const m = document.getElementById('admin-gallery-modal');
        if (m) m.remove();
    };

    window.filterGalleryCategory = function (cat) {
        galleryCategoryFilter = cat;
        renderAdminPanel();
    };

    function renderAdminGalleryModal(photo, isEdit) {
        window.closeAdminGalleryModal();

        const modalDiv = document.createElement('div');
        modalDiv.id = 'admin-gallery-modal';
        modalDiv.className = 'fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-sans';
        modalDiv.innerHTML = `
            <div class="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl text-white my-8">
                <div class="bg-gradient-to-r from-purple-700 to-violet-800 px-6 py-4 flex justify-between items-center">
                    <h3 class="font-bold text-base flex items-center gap-2">
                        <i class="fa-solid fa-images"></i> ${isEdit ? 'এডিট চিত্রশালা ছবি (Edit Photo)' : 'নতুন ক্যাডাস্ট্রাল ছবি আপলোড (Upload Photo)'}
                    </h3>
                    <button type="button" onclick="window.closeAdminGalleryModal()" class="text-white/80 hover:text-white text-2xl font-bold leading-none">&times;</button>
                </div>
                <form id="admin-gallery-form" class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">ছবির শিরোনাম (বাংলা) *</label>
                            <input type="text" name="titleBn" required value="${escapeHtml(photo.titleBn || '')}" placeholder="উত্তরা অববাহিকার সবুজ আমন ধানের ক্ষেত"
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-purple-500">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Photo Title (English)</label>
                            <input type="text" name="titleEn" value="${escapeHtml(photo.titleEn || '')}" placeholder="Aman Rice Paddies in Uttara"
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">ক্যাটাগরি *</label>
                            <select name="category" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-bold">
                                <option value="Agricultural" ${photo.category === 'Agricultural' ? 'selected' : ''}>কৃষি জমি (Agricultural)</option>
                                <option value="Tea Estate" ${photo.category === 'Tea Estate' ? 'selected' : ''}>চা বাগান (Tea Estate)</option>
                                <option value="Survey" ${photo.category === 'Survey' ? 'selected' : ''}>মাঠ জরিপ (Survey)</option>
                                <option value="Aerial Drone" ${photo.category === 'Aerial Drone' ? 'selected' : ''}>ড্রোন ম্যাপিং (Aerial Drone)</option>
                                <option value="Orchard" ${photo.category === 'Orchard' ? 'selected' : ''}>ফলজ বাগান (Orchard)</option>
                                <option value="Commercial" ${photo.category === 'Commercial' ? 'selected' : ''}>বাণিজ্যিক প্লট (Commercial)</option>
                                <option value="Cadastral" ${photo.category === 'Cadastral' ? 'selected' : ''}>ক্যাডাস্ট্রাল সীমানা (Cadastral)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">অবস্থান / দাগ নম্বর (Location) *</label>
                            <input type="text" name="locationBn" required value="${escapeHtml(photo.locationBn || photo.location || '')}" placeholder="উত্তরা, ঢাকা (দাগ-৮৮৪২)"
                                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs">
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">ছবির লিঙ্ক (Image URL) *</label>
                        <input type="url" name="image" required value="${escapeHtml(photo.image || '')}" placeholder="https://images.unsplash.com/..."
                            class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500">
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">বিবরণ (বাংলা)</label>
                        <textarea name="descriptionBn" rows="2" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs">${escapeHtml(photo.descriptionBn || '')}</textarea>
                    </div>

                    <div class="pt-4 border-t border-slate-800 flex justify-end gap-3">
                        <button type="button" onclick="window.closeAdminGalleryModal()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold">বাতিল</button>
                        <button type="submit" class="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-600/30">সংরক্ষণ করুন</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modalDiv);

        document.getElementById('admin-gallery-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const form = e.target;
            const categoryMap = {
                'Agricultural': 'কৃষি জমি',
                'Tea Estate': 'চা বাগান',
                'Survey': 'মাঠ জরিপ',
                'Aerial Drone': 'ড্রোন ম্যাপিং',
                'Orchard': 'ফলজ বাগান',
                'Commercial': 'বাণিজ্যিক প্লট',
                'Cadastral': 'ক্যাডাস্ট্রাল সীমানা'
            };

            const photoData = {
                id: editingGalleryId || ('gal-' + Date.now()),
                titleBn: form.titleBn.value.trim(),
                titleEn: form.titleEn.value.trim() || form.titleBn.value.trim(),
                category: form.category.value,
                categoryBn: categoryMap[form.category.value] || form.category.value,
                locationBn: form.locationBn.value.trim(),
                location: form.locationBn.value.trim(),
                image: form.image.value.trim(),
                descriptionBn: form.descriptionBn.value.trim(),
                descriptionEn: form.descriptionBn.value.trim()
            };

            GeoTerraStore.saveGalleryPhoto(photoData);
            window.closeAdminGalleryModal();
            GeoTerraStore.showToast('ছবি সংরক্ষিত', 'ক্যাডাস্ট্রাল চিত্রশালায় ছবি সফলভাবে যুক্ত হয়েছে।', 'success');
            renderAdminPanel();
        });
    }

    window.adminDeleteGalleryPhoto = function (photoId) {
        if (confirm('আপনি কি নিশ্চিত যে চিত্রশালা থেকে এই ছবিটি মুছে ফেলতে চান?')) {
            GeoTerraStore.deleteGalleryPhoto(photoId);
            GeoTerraStore.showToast('Photo Deleted', 'Gallery photo removed.', 'info');
            renderAdminPanel();
        }
    };

    // --- 8. Instant Landowner Login from Admin ---
    window.adminLoginAsUser = function (username) {
        const user = GeoTerraStore.getUser(username);
        if (user) {
            GeoTerraStore.setUserSession(user);
            GeoTerraStore.showToast('সেশন সক্রিয়', `মালিক "${user.fullName}" হিসেবে সরাসরি লগইন করা হয়েছে। ওয়েবসাইট পেজ খুলছে...`, 'success');
            window.open('index.html', '_blank');
        }
    };

    // --- Backup & Restore Handlers ---
    window.downloadDatabaseBackup = function () {
        const data = GeoTerraStore.exportData();
        const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute("href", jsonStr);
        dlAnchor.setAttribute("download", `smartland_backup_${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(dlAnchor);
        dlAnchor.click();
        dlAnchor.remove();
        GeoTerraStore.showToast('Backup Exported', 'Database backup downloaded successfully.', 'success');
    };

    window.importDatabaseBackup = function (event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const parsed = JSON.parse(e.target.result);
                const res = GeoTerraStore.importData(parsed);
                if (res.success) {
                    GeoTerraStore.showToast('Database Restored', 'All records imported and synced!', 'success');
                    renderAdminPanel();
                } else {
                    GeoTerraStore.showToast('Import Failed', res.error, 'error');
                }
            } catch (err) {
                GeoTerraStore.showToast('Import Error', 'Invalid JSON file format.', 'error');
            }
        };
        reader.readAsText(file);
    };

    window.resetSystemToDefaults = function () {
        if (confirm('CAUTION: Are you sure you want to reset all records to default 10 users and sample land plots?')) {
            GeoTerraStore.resetToDefaults();
            GeoTerraStore.showToast('System Reset', 'Factory demo records restored.', 'info');
            renderAdminPanel();
        }
    };

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

})();
