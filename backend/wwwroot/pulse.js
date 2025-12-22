/**
 * PulseMetric Analytics Tracker
 * Müşteri sitelerine eklenen hafif analitik scripti
 * 
 * Kullanım:
 * <script src="https://api.pulsemetric.com/pulse.js" data-client-id="TENANT_ID"></script>
 */
(function (window, document) {
    'use strict';

    // --- YAPILANDIRMA ---
    // Script'in yüklendiği domaini backend URL'i olarak kullan
    var scriptTag = document.currentScript || document.querySelector('script[data-client-id]');
    var BACKEND_URL = scriptTag ? scriptTag.src.substring(0, scriptTag.src.lastIndexOf('/')) : '';
    var API_URL = BACKEND_URL + '/api/collector';

    var clientId = scriptTag ? scriptTag.getAttribute('data-client-id') : null;

    if (!clientId) {
        console.error('PulseMetric: data-client-id bulunamadı!');
        return;
    }

    console.log('PulseMetric: Başlatıldı (Tenant: ' + clientId + ')');

    // --- ANA FONKSİYON: Event Gönderimi ---
    function sendEvent(eventName, data) {
        var payload = {
            clientId: clientId,
            eventName: eventName || 'page_view',
            url: window.location.href,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
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
                credentials: 'include' // CORS ile credentials gönderimi
            }).catch(function (err) {
                console.warn('PulseMetric: Event gönderilemedi', err);
            });
        }
    }

    // --- SPA DESTEĞİ (React, Next.js, Vue vb.) ---
    // URL değişimlerini yakala
    var originalPushState = history.pushState;
    history.pushState = function () {
        originalPushState.apply(this, arguments);
        sendEvent('page_view');
    };

    var originalReplaceState = history.replaceState;
    history.replaceState = function () {
        originalReplaceState.apply(this, arguments);
        sendEvent('page_view');
    };

    window.addEventListener('popstate', function () {
        sendEvent('page_view');
    });

    // --- SAYFA PERFORMANS METRİKLERİ ---
    function getPerformanceMetrics() {
        if (!window.performance || !window.performance.timing) {
            return null;
        }

        var timing = window.performance.timing;
        return {
            loadTime: timing.loadEventEnd - timing.navigationStart,
            domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
            firstByte: timing.responseStart - timing.navigationStart
        };
    }

    // --- OTOMATİK EVENTLER ---
    // Session başlangıcı
    sendEvent('session_start');

    // İlk sayfa görüntüleme
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
    // Müşterilerin custom event göndermesi için
    window.PulseMetric = {
        track: sendEvent,
        identify: function (userId, traits) {
            sendEvent('identify', { userId: userId, traits: traits || {} });
        }
    };

})(window, document);
