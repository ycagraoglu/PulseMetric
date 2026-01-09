# PulseMetric Kurulum ve Kullanım Rehberi

## 🏗️ Sistem Mimarisi

```
┌─────────────────────────────────────────────────────────────────┐
│                        KULLANICI WEB SİTESİ                      │
│  <script src="https://api.pulsemetric.com/pulse.js"             │
│          data-client-id="TENANT_ID"></script>                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │ Events (page_view, scroll, click...)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PULSEMETRIC BACKEND                         │
│  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐   │
│  │   Collector   │───▶│     Redis     │───▶│   Processor   │   │
│  │   /api/coll   │    │    Queue      │    │   (Worker)    │   │
│  └───────────────┘    └───────────────┘    └───────┬───────┘   │
│                                                     │           │
│                                            ┌────────▼────────┐  │
│                                            │   TimescaleDB   │  │
│                                            │   (PostgreSQL)  │  │
│                                            └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     PULSEMETRIC DASHBOARD                        │
│        Frontend (React) - Analitik görselleştirme               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1️⃣ Backend Kurulumu

### Gereksinimler
- .NET 9.0 SDK
- PostgreSQL 14+ (TimescaleDB extension)
- Redis 6+

### Adımlar

```bash
# 1. Proje dizinine git
cd c:\Users\ycagr\Music\repos\PulseMetric\backend

# 2. appsettings.json düzenle
# - ConnectionStrings:DefaultConnection (PostgreSQL)
# - ConnectionStrings:Redis (Redis)

# 3. Migration oluştur ve çalıştır
dotnet ef migrations add InitialCreate
dotnet ef database update

# 4. Çalıştır
dotnet run
```

Backend varsayılan olarak `http://localhost:5000` adresinde çalışır.

---

## 2️⃣ Tenant (Müşteri) Oluşturma

### Admin Dashboard Üzerinden
1. `http://localhost:5173/admin/tenants` adresine git
2. "New Tenant" butonuna tıkla
3. Tenant bilgilerini gir:
   - **Name**: Müşteri adı (örn: "Acme Corp")
   - **Domain**: İzin verilen domain (örn: "acme.com")
4. Kaydet

### API Üzerinden
```bash
curl -X POST http://localhost:5000/api/tenants \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Corp",
    "domain": "acme.com"
  }'
```

**Dönen Response:**
```json
{
  "id": "01KCQAE9RP013RTJZE10SQX5TR",
  "name": "Acme Corp",
  "domain": "acme.com",
  "createdAt": "2026-01-09T13:00:00Z"
}
```

> ⚠️ **Tenant ID** = `data-client-id` olarak kullanılacak

---

## 3️⃣ API Key Oluşturma

### Dashboard Üzerinden
1. `http://localhost:5173/api-keys` adresine git
2. "Create API Key" butonuna tıkla
3. Key tipi seç:
   - **Live Key**: Canlı ortam için
   - **Test Key**: Test ortamı için
4. Oluşturulan key'i kopyala (bir daha gösterilmez!)

### API Üzerinden
```bash
curl -X POST http://localhost:5000/api/apikeys \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production Key",
    "isLive": true
  }'
```

**Dönen Response:**
```json
{
  "id": "...",
  "name": "Production Key",
  "key": "pm_live_xxxxxxxxxxxxxxxxxxxxxxxx",  // ⚠️ Sadece bir kez gösterilir!
  "prefix": "pm_live_xxxxx..."
}
```

---

## 4️⃣ Script Entegrasyonu

### Müşteri Web Sitesinde Kurulum

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
    
    <!-- PulseMetric Tracker Script -->
    <script 
        src="https://api.pulsemetric.com/pulse.js" 
        data-client-id="01KCQAE9RP013RTJZE10SQX5TR"
        async>
    </script>
</head>
<body>
    <!-- Site içeriği -->
</body>
</html>
```

### Custom Event Gönderme

```javascript
// Buton tıklama
document.getElementById('signup-btn').addEventListener('click', function() {
    PulseMetric.track('signup_click', { 
        plan: 'premium',
        source: 'homepage' 
    });
});

// Kullanıcı tanımlama (login sonrası)
PulseMetric.identify('user_123', {
    email: 'user@example.com',
    plan: 'enterprise'
});
```

---

## 5️⃣ Veri Akışı

```
1. Kullanıcı siteyi ziyaret eder
   │
2. pulse.js otomatik olarak yüklenir
   │
3. Otomatik eventler gönderilir:
   ├── session_start
   ├── page_view
   ├── scroll_depth (25%, 50%, 75%, 100%)
   ├── time_on_page (sayfa kapanırken)
   ├── performance (sayfa yüklenince)
   └── engaged (30 saniye sonra)
   │
4. Events → /api/collector/batch (10 event = 1 request)
   │
5. Backend:
   ├── Client ID validate
   ├── IP → GeoIP lookup (ülke, şehir)
   ├── User-Agent → Browser/OS parse
   └── Redis Queue'ya at
   │
6. Background Worker:
   ├── Queue'dan oku
   └── TimescaleDB'ye yaz
   │
7. Dashboard'da görüntülenir
```

---

## 6️⃣ Dashboard Kullanımı

### Endpoints

| Sayfa | URL | Açıklama |
|-------|-----|----------|
| Dashboard | `/` | Genel bakış |
| Users | `/users` | Kullanıcı listesi |
| Sessions | `/sessions` | Oturum listesi |
| Events | `/events` | Event listesi |
| Realtime | `/realtime` | Canlı veri |
| API Keys | `/api-keys` | Key yönetimi |
| Settings | `/settings` | Ayarlar |

---

## 7️⃣ Local Development

### Backend + Frontend Çalıştırma

**Terminal 1 - Backend:**
```bash
cd c:\Users\ycagr\Music\repos\PulseMetric\backend
dotnet run
```

**Terminal 2 - Frontend:**
```bash
cd c:\Users\ycagr\Music\repos\PulseMetric\frontend
npm run dev
```

**Terminal 3 - Test Site:**
```html
<!-- test.html -->
<script src="http://localhost:5000/pulse.js" data-client-id="TEST_TENANT_ID" data-debug></script>
```

### Debug Modu
`data-debug` ekleyerek console'da tüm eventleri görebilirsiniz:
```html
<script src="..." data-client-id="..." data-debug></script>
```

---

## 🔑 Önemli Notlar

1. **Tenant ID** = Script'te `data-client-id` olarak kullanılır
2. **API Key** = Backend API çağrıları için (Dashboard auth)
3. **pulse.js** = Client tarafında çalışır, cookie kullanmaz
4. **Events** = Batch olarak gönderilir (performans)
5. **GeoIP** = IP adresi backend'de ülke/şehre çevrilir
