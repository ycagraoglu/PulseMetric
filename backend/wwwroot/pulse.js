/**
 * PulseMetric Analytics Tracker v3.0
 * Enterprise-Grade Analytics Script - Privacy-First, Cookie-less
 * 
 * Security Features:
 * - Client ID Validation
 * - XSS Input Sanitization
 * - URL Protocol Validation
 * - CSP Compatible (no unsafe-inline)
 * 
 * Performance Features:
 * - Event Batching (10 events = 1 request)
 * - Session Persistence (sessionStorage)
 * - Retry with Exponential Backoff
 * - SendBeacon API
 * 
 * Usage:
 * <script src="https://api.pulsemetric.com/pulse.js" data-client-id="TENANT_ID" async></script>
 * 
 * Debug Mode:
 * <script src="..." data-client-id="TENANT_ID" data-debug></script>
 */
(function (window, document) {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================

    var scriptTag = document.currentScript || document.querySelector('script[data-client-id]');
    if (!scriptTag) return;

    var BACKEND_URL = scriptTag.src.substring(0, scriptTag.src.lastIndexOf('/'));
    var API_URL = BACKEND_URL + '/api/collector';
    var BATCH_URL = API_URL + '/batch';
    var clientId = scriptTag.getAttribute('data-client-id');
    var DEBUG = scriptTag.hasAttribute('data-debug');

    // ============================================
    // CONSTANTS
    // ============================================

    var VERSION = '3.0.0';
    var BATCH_SIZE = 10;
    var FLUSH_INTERVAL = 5000;
    var MAX_RETRIES = 3;
    var SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
    var SESSION_KEY = 'pm_sid';
    var MAX_URL_LENGTH = 2000;
    var MAX_TITLE_LENGTH = 200;
    var MAX_TEXT_LENGTH = 100;

    // ============================================
    // DEBUG LOGGING
    // ============================================

    function log() {
        if (DEBUG && console && console.log) {
            var args = ['[PulseMetric]'].concat(Array.prototype.slice.call(arguments));
            console.log.apply(console, args);
        }
    }

    function warn() {
        if (DEBUG && console && console.warn) {
            var args = ['[PulseMetric]'].concat(Array.prototype.slice.call(arguments));
            console.warn.apply(console, args);
        }
    }

    // ============================================
    // SECURITY: VALIDATION & SANITIZATION
    // ============================================

    /**
     * Validate client ID format
     * Accepts: ULID, UUID, alphanumeric with dash/underscore
     */
    function isValidClientId(id) {
        return typeof id === 'string' &&
            id.length >= 8 &&
            id.length <= 64 &&
            /^[a-zA-Z0-9\-_]+$/.test(id);
    }

    /**
     * Sanitize string input - XSS Prevention
     */
    function sanitize(str, maxLen) {
        if (typeof str !== 'string') return '';
        return str
            .replace(/[<>'"&\\]/g, '')
            .replace(/javascript:/gi, '')
            .replace(/data:/gi, '')
            .replace(/vbscript:/gi, '')
            .substring(0, maxLen || 500);
    }

    /**
     * Validate and sanitize URL - only http/https
     */
    function sanitizeUrl(url) {
        if (typeof url !== 'string') return '';
        try {
            var parsed = new URL(url, window.location.origin);
            if (!/^https?:$/.test(parsed.protocol)) return '';
            return sanitize(parsed.href, MAX_URL_LENGTH);
        } catch (e) {
            return '';
        }
    }

    // ============================================
    // CLIENT ID VALIDATION
    // ============================================

    if (!clientId || !isValidClientId(clientId)) {
        warn('Invalid or missing data-client-id');
        return;
    }

    log('v' + VERSION + ' initialized (Tenant: ' + clientId + ')');

    // ============================================
    // FNV-1a HASH (Better Distribution)
    // ============================================

    function fnv1aHash(str) {
        var hash = 2166136261; // FNV offset basis
        for (var i = 0; i < str.length; i++) {
            hash ^= str.charCodeAt(i);
            // FNV prime: 16777619
            hash += (hash << 1) + (hash << 4) + (hash << 7) +
                (hash << 8) + (hash << 24);
        }
        return (hash >>> 0).toString(36);
    }

    /**
     * Generate unique visitor ID (cookie-less, GDPR friendly)
     */
    function generateVisitorId() {
        var components = [
            navigator.userAgent || '',
            navigator.language || '',
            screen.width + 'x' + screen.height + 'x' + (screen.colorDepth || 24),
            new Date().getTimezoneOffset(),
            navigator.hardwareConcurrency || 0,
            navigator.maxTouchPoints || 0,
            navigator.platform || ''
        ];
        return 'v_' + fnv1aHash(components.join('|'));
    }

    // ============================================
    // SESSION MANAGEMENT (sessionStorage)
    // ============================================

    function getSessionId() {
        try {
            var stored = sessionStorage.getItem(SESSION_KEY);
            if (stored) {
                var data = JSON.parse(stored);
                if (Date.now() - data.ts < SESSION_TIMEOUT) {
                    data.ts = Date.now();
                    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
                    return data.id;
                }
            }
        } catch (e) { }

        // New session
        var newId = 'ses_' + Date.now().toString(36) +
            Math.random().toString(36).substr(2, 9);
        try {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify({
                id: newId,
                ts: Date.now()
            }));
        } catch (e) { }
        return newId;
    }

    // ============================================
    // STATE MANAGEMENT
    // ============================================

    var state = {
        sessionId: getSessionId(),
        visitorId: generateVisitorId(),
        sessionStart: Date.now(),
        pageStart: Date.now(),
        pageViews: 0,
        scrollMilestones: { 25: false, 50: false, 75: false, 100: false },
        lastUrl: window.location.href,
        consentGranted: true // Default: granted
    };

    // ============================================
    // EVENT QUEUE & BATCHING
    // ============================================

    var eventQueue = [];
    var flushTimer = null;

    function buildPayload(eventName, data) {
        return {
            eventName: sanitize(eventName || 'page_view', 50),
            url: sanitizeUrl(window.location.href),
            pageTitle: sanitize(document.title, MAX_TITLE_LENGTH),
            referrer: sanitizeUrl(document.referrer),
            device: getDeviceType(),
            screenWidth: window.innerWidth || screen.width,
            screenHeight: window.innerHeight || screen.height,
            language: sanitize(navigator.language || '', 10),
            timezone: sanitize(Intl.DateTimeFormat().resolvedOptions().timeZone || '', 50),
            timestamp: Date.now(),
            sessionDuration: Math.round((Date.now() - state.sessionStart) / 1000),
            data: data || {}
        };
    }

    function queueEvent(eventName, data) {
        if (!state.consentGranted) {
            log('Event blocked: consent not granted');
            return;
        }

        var payload = buildPayload(eventName, data);
        eventQueue.push(payload);
        log('Event queued:', eventName, '(' + eventQueue.length + '/' + BATCH_SIZE + ')');

        if (eventQueue.length >= BATCH_SIZE) {
            flushNow();
        } else if (!flushTimer) {
            flushTimer = setTimeout(flushNow, FLUSH_INTERVAL);
        }
    }

    function flushNow() {
        if (eventQueue.length === 0) return;

        var batch = eventQueue.splice(0, BATCH_SIZE);
        sendBatch(batch);

        if (flushTimer) {
            clearTimeout(flushTimer);
            flushTimer = null;
        }

        // If there are remaining events, schedule another flush
        if (eventQueue.length > 0) {
            flushTimer = setTimeout(flushNow, FLUSH_INTERVAL);
        }
    }

    // ============================================
    // NETWORK: SEND WITH RETRY
    // ============================================

    function sendBatch(events) {
        var payload = {
            clientId: clientId,
            visitorId: state.visitorId,
            sessionId: state.sessionId,
            events: events
        };

        log('Sending batch:', events.length, 'events');

        if (navigator.sendBeacon) {
            var blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            var success = navigator.sendBeacon(BATCH_URL, blob);
            if (!success) {
                sendWithRetry(payload, BATCH_URL, MAX_RETRIES);
            }
        } else {
            sendWithRetry(payload, BATCH_URL, MAX_RETRIES);
        }
    }

    function sendSingle(payload) {
        var singlePayload = {
            clientId: clientId,
            visitorId: state.visitorId,
            sessionId: state.sessionId,
            eventName: payload.eventName,
            url: payload.url,
            pageTitle: payload.pageTitle,
            referrer: payload.referrer,
            device: payload.device,
            screenWidth: payload.screenWidth,
            screenHeight: payload.screenHeight,
            language: payload.language,
            timezone: payload.timezone,
            userAgent: navigator.userAgent,
            timestamp: payload.timestamp,
            sessionDuration: payload.sessionDuration,
            utm: getUtmParams(),
            data: payload.data
        };

        if (navigator.sendBeacon) {
            var blob = new Blob([JSON.stringify(singlePayload)], { type: 'application/json' });
            navigator.sendBeacon(API_URL, blob);
        } else {
            sendWithRetry(singlePayload, API_URL, MAX_RETRIES);
        }
    }

    function sendWithRetry(payload, url, retries) {
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' },
            keepalive: true
        }).catch(function (err) {
            if (retries > 0) {
                var delay = Math.pow(2, MAX_RETRIES - retries + 1) * 1000;
                log('Retry in', delay, 'ms (', retries - 1, 'left)');
                setTimeout(function () {
                    sendWithRetry(payload, url, retries - 1);
                }, delay);
            } else {
                warn('Failed to send after retries');
            }
        });
    }

    // ============================================
    // DEVICE DETECTION
    // ============================================

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

    // ============================================
    // UTM PARAMETER PARSING
    // ============================================

    function getUtmParams() {
        try {
            var params = new URLSearchParams(window.location.search);
            var utm = {};
            ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(function (key) {
                var value = params.get(key);
                if (value) {
                    utm[key.replace('utm_', '')] = sanitize(value, 100);
                }
            });
            return Object.keys(utm).length > 0 ? utm : null;
        } catch (e) {
            return null;
        }
    }

    // ============================================
    // SCROLL DEPTH TRACKING
    // ============================================

    function getScrollPercentage() {
        var docHeight = Math.max(
            document.body.scrollHeight || 0,
            document.documentElement.scrollHeight || 0,
            document.body.offsetHeight || 0,
            document.documentElement.offsetHeight || 0
        );
        var winHeight = window.innerHeight || 0;
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;

        if (docHeight <= winHeight) return 100;
        return Math.round((scrollTop / (docHeight - winHeight)) * 100);
    }

    function trackScrollDepth() {
        var percentage = getScrollPercentage();
        var milestones = [25, 50, 75, 100];

        milestones.forEach(function (milestone) {
            if (percentage >= milestone && !state.scrollMilestones[milestone]) {
                state.scrollMilestones[milestone] = true;
                queueEvent('scroll_depth', { depth: milestone });
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

    // ============================================
    // TIME ON PAGE TRACKING
    // ============================================

    function sendTimeOnPage() {
        var timeSpent = Math.round((Date.now() - state.pageStart) / 1000);
        if (timeSpent > 0) {
            // Time on page needs immediate send (page closing)
            sendSingle(buildPayload('time_on_page', { seconds: timeSpent }));
        }
    }

    window.addEventListener('beforeunload', function () {
        flushNow(); // Flush remaining events
        sendTimeOnPage();
    });

    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'hidden') {
            flushNow();
            sendTimeOnPage();
        }
    });

    // ============================================
    // OUTBOUND LINK TRACKING
    // ============================================

    function isOutboundLink(url) {
        try {
            var link = new URL(url, window.location.origin);
            return link.hostname !== window.location.hostname;
        } catch (e) {
            return false;
        }
    }

    document.addEventListener('click', function (e) {
        var target = e.target.closest ? e.target.closest('a') : null;
        if (target && target.href && isOutboundLink(target.href)) {
            queueEvent('outbound_click', {
                url: sanitizeUrl(target.href),
                text: sanitize(target.innerText || '', MAX_TEXT_LENGTH)
            });
        }
    }, true);

    // ============================================
    // SPA SUPPORT (React, Next.js, Vue, etc.)
    // ============================================

    function onPageChange() {
        if (window.location.href === state.lastUrl) return;

        // Send time on page for previous page
        sendTimeOnPage();

        // Reset state
        state.pageStart = Date.now();
        state.pageViews++;
        state.scrollMilestones = { 25: false, 50: false, 75: false, 100: false };
        state.lastUrl = window.location.href;

        // New page view
        queueEvent('page_view');
    }

    var originalPushState = history.pushState;
    history.pushState = function () {
        originalPushState.apply(this, arguments);
        setTimeout(onPageChange, 0);
    };

    var originalReplaceState = history.replaceState;
    history.replaceState = function () {
        originalReplaceState.apply(this, arguments);
        setTimeout(onPageChange, 0);
    };

    window.addEventListener('popstate', function () {
        setTimeout(onPageChange, 0);
    });

    // ============================================
    // PERFORMANCE METRICS
    // ============================================

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

    // ============================================
    // ERROR TRACKING
    // ============================================

    window.addEventListener('error', function (e) {
        queueEvent('js_error', {
            msg: sanitize(e.message || '', 200),
            file: sanitize(e.filename || '', 100),
            line: e.lineno || 0,
            col: e.colno || 0
        });
    });

    window.addEventListener('unhandledrejection', function (e) {
        queueEvent('promise_error', {
            msg: sanitize(String(e.reason || ''), 200)
        });
    });

    // ============================================
    // BOUNCE DETECTION (30s engagement)
    // ============================================

    var engagementTimer = setTimeout(function () {
        queueEvent('engaged', { afterSeconds: 30 });
    }, 30000);

    // ============================================
    // AUTOMATIC EVENTS
    // ============================================

    // Session start
    queueEvent('session_start', {
        visitorId: state.visitorId,
        sessionId: state.sessionId,
        utm: getUtmParams()
    });

    // First page view
    state.pageViews++;
    queueEvent('page_view');

    // Performance metrics (after page load)
    window.addEventListener('load', function () {
        setTimeout(function () {
            var metrics = getPerformanceMetrics();
            if (metrics) {
                queueEvent('performance', metrics);
            }
        }, 100);
    });

    // ============================================
    // PUBLIC API
    // ============================================

    window.PulseMetric = {
        version: VERSION,

        // Track custom event
        track: function (eventName, data) {
            queueEvent(sanitize(eventName, 50), data);
        },

        // Identify user
        identify: function (userId, traits) {
            queueEvent('identify', {
                userId: sanitize(String(userId), 100),
                traits: traits || {}
            });
        },

        // Get visitor ID
        getVisitorId: function () {
            return state.visitorId;
        },

        // Get session ID
        getSessionId: function () {
            return state.sessionId;
        },

        // Get session duration
        getSessionDuration: function () {
            return Math.round((Date.now() - state.sessionStart) / 1000);
        },

        // Consent management
        consent: function (granted) {
            state.consentGranted = !!granted;
            log('Consent:', granted ? 'granted' : 'denied');
        },

        // Force flush events
        flush: function () {
            flushNow();
        },

        // Debug mode
        debug: function (enable) {
            if (typeof enable === 'boolean') {
                DEBUG = enable;
            }
            return DEBUG;
        }
    };

    log('Ready');

})(window, document);
