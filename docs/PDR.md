# 🚀 Product Requirement Document (PRD) - PulseMetric Analytics

| Doküman Bilgisi | Detaylar |
| :--- | :--- |
| **Proje Adı** | PulseMetric (SaaS Web Analytics Platform) |
| **Versiyon** | 1.0.0 (MVP) |
| **Durum** | Geliştirme Aşaması |
| **Platform** | Web (SaaS) |
| **Teknoloji Stack** | ASP.NET Core 10, React (Vite), Redis, PostgreSQL (TimescaleDB) |

---

## 1. Yönetici Özeti (Executive Summary)
PulseMetric, gizlilik odaklı (Privacy-First), açık kaynak kodlu ve yüksek performanslı bir web analitik platformudur. Google Analytics'e alternatif olarak; hafif, GDPR uyumlu ve gerçek zamanlı (Real-time) veri sunmayı hedefler. Sistem, SaaS mimarisinde çalışacak olup, müşterilerin web sitelerine ekleyecekleri tek satırlık bir JavaScript kodu (pulse.js) ile veri toplayacaktır.

## 2. Sorun ve Çözüm (Problem & Solution)
### 2.1. Sorunlar
- **Gizlilik İhlalleri:** GA4 gibi araçların çok fazla kişisel veri toplaması.
- **Performans:** Tracker scriptlerinin site hızını düşürmesi.
- **Veri Sahipliği:** Verilerin dev şirketlerin elinde olması.

### 2.2. Çözüm
- **Cookie-less:** Çerez uyarısı gerektirmeyen takip sistemi.
- **Hafif SDK:** 5KB altı script boyutu.
- **Hız:** .NET Core ve Redis ile milisaniyeler içinde veri işleme.

## 3. Sistem Mimarisi (System Architecture)
Sistem 4 ana katmandan oluşur:
1. **Client Layer:** `pulse.js` (Veriyi toplayan casus script).
2. **Ingestion Layer:** `Collector API` (Veriyi karşılayan .NET kapısı).
3. **Queue Layer:** `Redis` (Yüksek trafikte DB'yi koruyan tampon).
4. **Processing Layer:** `Worker Service` (Veriyi işleyip DB'ye yazan motor).

### 3.1. Veri Akış Diyagramı
- **Adım 1:** Kullanıcı siteye girer, `pulse.js` tetiklenir.
- **Adım 2:** Veri POST ile `Collector API`'ye gider.
- **Adım 3:** API veriyi doğrular ve `Redis` kuyruğuna atar (Yanıt süresi < 50ms).
- **Adım 4:** Arka plandaki `Worker`, Redis'ten batch (toplu) veriyi alır.
- **Adım 5:** Veri `TimescaleDB`'ye kaydedilir.

## 4. Fonksiyonel Gereksinimler (Functional Requirements)
### 4.1. Veri Toplama
- **FR-01:** Her tenant (müşteri) için benzersiz bir `ClientId` oluşturulmalıdır.
- **FR-02:** Veri iletiminde `navigator.sendBeacon` kullanılarak sayfa kapanışları kaçırılmamalıdır.
- **FR-03:** Sayfa başlığı, URL, Referrer, Cihaz tipi otomatik alınmalıdır.
- **FR-04:** Single Page Application (SPA) rota değişimleri otomatik izlenmelidir.

### 4.2. Veri İşleme & Raporlama
- **FR-05:** IP adresi sadece lokasyon bulmak için kullanılmalı, DB'ye asla açık yazılmamalıdır.
- **FR-06:** Anlık (Realtime) ziyaretçi sayısı Dashboard'da canlı gösterilmelidir.
- **FR-07:** Günlük, haftalık ve aylık trafik değişim grafikleri sunulmalıdır.
- **FR-08:** En çok ziyaret edilen sayfalar listelenmelidir.

## 5. Teknik Gereksinimler
- **Backend:** .NET 10,C# 13, Minimal APIs, StackExchange.Redis.
- **Frontend:** React (Vite), Tailwind CSS, Lucide Icons, Recharts.
- **Database:** PostgreSQL + TimescaleDB (Zaman serisi optimizasyonu).

## 6. Veri Modeli (Schema)
### 6.1. Events Tablosu (Hypertable)
- `Timestamp` (Zaman damgası - PK)
- `TenantId` (UUID)
- `EventName` (page_view, click vb.)
- `Url` (Varchar)
- `Country` (Ülke kodu)
- `Device` (Mobile/Desktop)

## 7. API Spesifikasyonu
- **POST /api/collect:** SDK'dan gelen veriyi karşılar.
- **GET /api/stats/summary:** Dashboard için özet verileri döner.

## 8. Güvenlik ve Uyumluluk
- **CORS:** Dinamik domain beyaz listesi (Whitelisting).
- **GDPR:** Kişisel verilerin anonimleştirilmesi.
- **Rate Limit:** API'ye aşırı yüklenmeyi engelleyen kısıtlayıcı.

## 9. Yol Haritası (Roadmap)
- **Faz 1:** Core API ve Tracker SDK (Tamamlanıyor).
- **Faz 2:** Redis Kuyruk ve TimescaleDB entegrasyonu.
- **Faz 3:** React Dashboard UI (Phase tasarımı ile).
- **Faz 4:** Custom Event takibi ve Bildirimler.