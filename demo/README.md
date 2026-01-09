# PulseMetric Demo Site

Bu demo site `pulse.js` tracker script'inin tüm özelliklerini test etmek için tasarlanmıştır.

## 🚀 Çalıştırma

```bash
# Demo klasörüne gidin
cd demo

# Basit HTTP server başlatın (herhangi biri)
npx serve .
# veya
python -m http.server 8080
# veya
php -S localhost:8080
```

Tarayıcıda: `http://localhost:8080`

## 📄 Sayfalar

| Sayfa | Dosya | Test Edilen Özellikler |
|-------|-------|------------------------|
| Ana Sayfa | `index.html` | Tüm API fonksiyonları |
| Ürünler | `products.html` | add_to_cart event |
| İletişim | `contact.html` | Form tracking |

## 🧪 Test Edilen Özellikler

### Otomatik Eventler
- ✅ `page_view` - Her sayfa yüklemesi
- ✅ `session_start` - Yeni session
- ✅ `scroll_depth` - 25%, 50%, 75%, 100%
- ✅ `time_on_page` - Sayfa kapatıldığında
- ✅ `performance` - Sayfa yükleme metrikleri
- ✅ `engaged` - 30 saniye sonra
- ✅ `outbound_click` - Dış link tıklamaları
- ✅ `js_error` - JavaScript hataları

### Manuel Eventler (Ana Sayfa)
- `PulseMetric.track()` - Custom event
- `PulseMetric.identify()` - Kullanıcı tanımlama
- `PulseMetric.consent()` - GDPR consent
- `PulseMetric.flush()` - Queue flush
- `PulseMetric.getVisitorId()` - Visitor ID
- `PulseMetric.getSessionId()` - Session ID

### E-Commerce (Ürünler)
- `add_to_cart` event
- Product ID, price, currency

### Form Tracking (İletişim)
- `form_field_focus` - Alan odaklanma
- `contact_form_submit` - Form gönderimi

## 🔧 Debug Mode

Script `data-debug` attribute ile yükleniyor, Console'da eventleri görebilirsiniz:

```
[PulseMetric] v3.0.0 initialized (Tenant: demo_tenant_12345)
[PulseMetric] Event queued: session_start (1/10)
[PulseMetric] Event queued: page_view (2/10)
```

## 📊 Event Console

Ana sayfada görsel event console bulunmaktadır.
