# AntiGravity (PulseMetric)

🚀 **Privacy-First SaaS Web Analytics Platform**

Google Analytics alternatifi, GDPR uyumlu, yüksek performanslı web analitik platformu.

---

## 📁 Proje Yapısı

```text
AntiGravity/
├── backend/                    # ASP.NET Core 8.0 Web API
│   ├── Controllers/
│   │   └── CollectorController.cs
│   ├── Models/
│   │   └── AnalyticsEventPayload.cs
│   ├── Services/
│   │   ├── IQueueService.cs
│   │   └── RedisQueueService.cs
│   ├── Helpers/
│   │   └── IpMaskingHelper.cs
│   ├── wwwroot/
│   │   └── pulse.js
│   ├── Program.cs
│   └── Analytics.API.csproj
├── frontend/
│   ├── tracker/
│   │   └── pulse.js           # Müşteri sitelerine eklenen script
│   └── test-site/
│       └── index.html         # Test için demo site
├── AntiGravity.sln
└── README.md
```

---

## 🚀 Hızlı Başlangıç

### 1. Backend'i Çalıştır

```bash
cd backend
dotnet restore
dotnet run
```

Backend varsayılan olarak `http://localhost:5000` adresinde çalışır.

### 2. Test Sitesini Aç

`frontend/test-site/index.html` dosyasını tarayıcıda aç.

> ⚠️ **Not:** Backend port numarası farklıysa (örn: 5123), `index.html` içindeki script src'yi güncelle.

### 3. Console'u İzle

- Backend terminalinde `[HIT]` loglarını gör
- Browser DevTools > Network sekmesinde `/api/collector` isteklerini kontrol et

---

## ⚙️ Teknik Özellikler

### Backend

| Özellik | Açıklama |
|---------|----------|
| **Mimari** | Controller-based ASP.NET Core 8.0 |
| **CORS** | Dinamik origin desteği (`SetIsOriginAllowed`) |
| **Queue** | Redis Streams (fail-safe, Mock fallback) |
| **GDPR** | IP maskeleme (`192.168.x.x`) |
| **Performans** | Asenkron kuyruk, doğrudan DB yazımı yok |

### Tracker Script (pulse.js)

| Özellik | Açıklama |
|---------|----------|
| **Boyut** | ~3KB (minified) |
| **SPA Desteği** | React, Next.js, Vue uyumlu |
| **API** | `sendBeacon` + `fetch` fallback |
| **Eventler** | `session_start`, `page_view`, `performance`, custom |

---

## 📡 API Endpoints

### POST /api/collector
Event toplama endpoint'i.

**Request Body:**
```json
{
  "clientId": "TENANT_001",
  "eventName": "page_view",
  "url": "https://example.com/page",
  "referrer": "https://google.com",
  "userAgent": "Mozilla/5.0...",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": { "custom": "data" }
}
```

**Response:** `202 Accepted`

### GET /api/collector/health
Health check endpoint.

---

## 🔧 Konfigürasyon

### appsettings.json

```json
{
  "ConnectionStrings": {
    "Redis": "localhost:6379"
  }
}
```

Redis yoksa otomatik olarak Mock moda geçer.

---

## 📜 Lisans

MIT License - Ticari kullanıma açık.
