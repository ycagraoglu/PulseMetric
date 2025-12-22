/**
 * PulseMetric Analytics Tracker v2.0
 * Gelişmiş analitik scripti - Privacy-First, Cookie-less
 * 
 * Özellikler:
 * - Page View & SPA Tracking
 * - Scroll Depth (25%, 50%, 75%, 100%)
 * - Time on Page
 * - Bounce Detection
 * - UTM Parameter Parsing
 * - Outbound Link Tracking
 * - Unique Visitor Hash (Cookie-less)
 * - Performance Metrics
 * 
 * Kullanım:
 * <script src="https://api.pulsemetric.com/pulse.js" data-client-id="TENANT_ID"></script>
 */
(function (window, document) {
    'use strict';

    // --- YAPILANDIRMA ---
    var scriptTag = document.currentScript || document.querySelector('script[data-client-id]');
    var BACKEND_URL = scriptTag ? scriptTag.src.substring(0, scriptTag.src.lastIndexOf('/')) : '';
    var API_URL = BACKEND_URL + '/api/collector';

    var clientId = scriptTag ? scriptTag.getAttribute('data-client-id') : null;

    if (!clientId) {
        console.error('PulseMetric: data-client-id bulunamadı!');
        return;
    }

    console.log('PulseMetric v2.0: Başlatıldı (Tenant: ' + clientId + ')');

    // --- STATE YÖNETİMİ ---
    var state = {
        sessionStart: Date.now(),
        pageStart: Date.now(),
        pageViews: 0,
        scrollMilestones: { 25: false, 50: false, 75: false, 100: false },
        lastUrl: window.location.href,
        visitorId: null
    };

    // --- UNIQUE VISITOR HASH (Cookie-less, GDPR Uyumlu) ---
    function generateVisitorHash() {
        var components = [
            navigator.userAgent,
            navigator.language,
            screen.width + 'x' + screen.height,
            new Date().getTimezoneOffset(),
            navigator.hardwareConcurrency || 'unknown',
            navigator.platform || 'unknown'
        ];

        var str = components.join('|');
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            var char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 32bit integer
        }
        return 'v_' + Math.abs(hash).toString(36);
    }

    state.visitorId = generateVisitorHash();

    // --- CİHAZ TESPİTİ ---
    function getDeviceType() {
        var ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return 'Tablet';
        }
        if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            return 'Mobile';
        }
        return 'Desktop';
    }

    // --- UTM PARAMETER PARSING ---
    function getUtmParams() {
        var params = new URLSearchParams(window.location.search);
        var utm = {};
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(function (key) {
            var value = params.get(key);
            if (value) {
                utm[key.replace('utm_', '')] = value;
            }
        });
        return Object.keys(utm).length > 0 ? utm : null;
    }

    // --- ANA FONKSİYON: Event Gönderimi ---
    function sendEvent(eventName, data) {
        var payload = {
            clientId: clientId,
            visitorId: state.visitorId,
            eventName: eventName || 'page_view',
            url: window.location.href,
            pageTitle: document.title || '',
            referrer: document.referrer,
            device: getDeviceType(),
            screenWidth: window.innerWidth || screen.width,
            screenHeight: window.innerHeight || screen.height,
            language: navigator.language || navigator.userLanguage || '',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
            userAgent: navigator.userAgent,
            timestamp: Date.now(),
            sessionDuration: Math.round((Date.now() - state.sessionStart) / 1000),
            utm: getUtmParams(),
            data: data || {}
        };

        // Navigator.sendBeacon: Sayfa kapanırken bile veri gönderir
        if (navigator.sendBeacon) {
            var blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            navigator.sendBeacon(API_URL, blob);
        } else {
            // Fallback: fetch API
            fetch(API_URL, {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: { 'Content-Type': 'application/json' },
                keepalive: true,
                credentials: 'include'
            }).catch(function (err) {
                console.warn('PulseMetric: Event gönderilemedi', err);
            });
        }
    }

    // --- SCROLL DEPTH TRACKING ---
    function getScrollPercentage() {
        var docHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight
        );
        var winHeight = window.innerHeight;
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (docHeight <= winHeight) return 100;
        return Math.round((scrollTop / (docHeight - winHeight)) * 100);
    }

    function trackScrollDepth() {
        var percentage = getScrollPercentage();
        var milestones = [25, 50, 75, 100];

        milestones.forEach(function (milestone) {
            if (percentage >= milestone && !state.scrollMilestones[milestone]) {
                state.scrollMilestones[milestone] = true;
                sendEvent('scroll_depth', { depth: milestone });
            }
        });
    }

    // Throttled scroll listener
    var scrollTimeout;
    window.addEventListener('scroll', function () {
        if (scrollTimeout) return;
        scrollTimeout = setTimeout(function () {
            trackScrollDepth();
            scrollTimeout = null;
        }, 200);
    }, { passive: true });

    // --- TIME ON PAGE TRACKING ---
    function sendTimeOnPage() {
        var timeSpent = Math.round((Date.now() - state.pageStart) / 1000);
        if (timeSpent > 0) {
            sendEvent('time_on_page', { seconds: timeSpent });
        }
    }

    // Sayfa kapanırken time on page gönder
    window.addEventListener('beforeunload', function () {
        sendTimeOnPage();
    });

    // Visibility değiştiğinde de gönder (tab switch)
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'hidden') {
            sendTimeOnPage();
        }
    });

    // --- OUTBOUND LINK TRACKING ---
    function isOutboundLink(url) {
        try {
            var link = new URL(url, window.location.origin);
            return link.hostname !== window.location.hostname;
        } catch (e) {
            return false;
        }
    }

    document.addEventListener('click', function (e) {
        var target = e.target.closest('a');
        if (target && target.href && isOutboundLink(target.href)) {
            sendEvent('outbound_click', {
                url: target.href,
                text: target.innerText?.substring(0, 100) || ''
            });
        }
    }, true);

    // --- SPA DESTEĞİ (React, Next.js, Vue vb.) ---
    function onPageChange() {
        // Önceki sayfa için time on page gönder
        sendTimeOnPage();

        // State'i resetle
        state.pageStart = Date.now();
        state.pageViews++;
        state.scrollMilestones = { 25: false, 50: false, 75: false, 100: false };
        state.lastUrl = window.location.href;

        // Yeni sayfa görüntüleme
        sendEvent('page_view');
    }

    var originalPushState = history.pushState;
    history.pushState = function () {
        originalPushState.apply(this, arguments);
        onPageChange();
    };

    var originalReplaceState = history.replaceState;
    history.replaceState = function () {
        originalReplaceState.apply(this, arguments);
        onPageChange();
    };

    window.addEventListener('popstate', onPageChange);

    // --- SAYFA PERFORMANS METRİKLERİ ---
    function getPerformanceMetrics() {
        if (window.performance && window.performance.getEntriesByType) {
            var navEntries = window.performance.getEntriesByType('navigation');
            if (navEntries && navEntries.length > 0) {
                var nav = navEntries[0];
                return {
                    loadTime: Math.round(nav.loadEventEnd - nav.startTime),
                    domReady: Math.round(nav.domContentLoadedEventEnd - nav.startTime),
                    firstByte: Math.round(nav.responseStart - nav.startTime),
                    dns: Math.round(nav.domainLookupEnd - nav.domainLookupStart),
                    tcp: Math.round(nav.connectEnd - nav.connectStart),
                    ttfb: Math.round(nav.responseStart - nav.requestStart)
                };
            }
        }
        return null;
    }

    // --- BOUNCE DETECTION ---
    // Bounce = Tek sayfa görüntüleyip 30 saniye içinde çıkan
    var engagementTimer = setTimeout(function () {
        sendEvent('engaged', { afterSeconds: 30 });
    }, 30000);

    // --- OTOMATİK EVENTLER ---
    // Session başlangıcı
    sendEvent('session_start', {
        visitorId: state.visitorId,
        utm: getUtmParams()
    });

    // İlk sayfa görüntüleme
    state.pageViews++;
    sendEvent('page_view');

    // Sayfa yüklendiğinde performans metrikleri gönder
    window.addEventListener('load', function () {
        setTimeout(function () {
            var metrics = getPerformanceMetrics();
            if (metrics) {
                sendEvent('performance', metrics);
            }
        }, 100);
    });

    // --- PUBLIC API ---
    window.PulseMetric = {
        track: sendEvent,
        identify: function (userId, traits) {
            sendEvent('identify', { userId: userId, traits: traits || {} });
        },
        getVisitorId: function () {
            return state.visitorId;
        },
        getSessionDuration: function () {
            return Math.round((Date.now() - state.sessionStart) / 1000);
        }
    };

})(window, document);
