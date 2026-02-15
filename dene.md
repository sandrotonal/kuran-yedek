# 🚀 Yeni Özellik İstekleri ve İlerleme Durumu

## ✅ Tamamlanan Özellikler

- [x] **1️⃣ Kıble Bulucu (Mobil Sensör Destekli)**
  - *Durum:* Tamamlandı. Pusula arayüzü ve API entegrasyonu yapıldı.
  - *Özellik:* Hassas yön bulma, animasyonlu pusula.

- [x] **3️⃣ Akıllı Namaz Vakitleri Sistemi**
  - *Durum:* Geliştirildi.
  - *Özellik:* Otomatik bildirimler, ezan vakti sesli uyarı, geri sayım.

- [x] **6️⃣ Esmaül Hüsna (Etkileşimli)**
  - *Durum:* Tamamlandı.
  - *Özellik:* 99 İsim, Türkçe anlamlar, Sesli okuma (TTS), Favorilere ekleme.

- [x] **7️⃣ Vaktin Ayeti (Zaman Bazlı Ayet Sistemi)**
  - *Durum:* Tamamlandı.
  - *Özellik:* Vakte özel ayet/konu önerisi, paylaşma butonu.

- [x] **2️⃣ Konuma Göre Yakın Camiler**
  - *Durum:* Tamamlandı.
  - *Özellik:* Overpass API ile en yakın camileri listeleme ve Leaflet harita entegrasyonu.

- [x] **4️⃣ Kaza Namaz Takip Sistemi**
  - *Durum:* Tamamlandı.
  - *Özellik:* Yerel depolama ile kaza borçlarını takip etme, ekleme/silme ve görselleştirme.

- [x] **5️⃣ Dini Günler & Hatırlatıcı**
  - *Durum:* Tamamlandı.
  - *Özellik:* 2024-2026 statik veri ile önemli günleri listeleme, geri sayım ve pano bildirimi.

---

## 📝 Yapılacaklar Listesi (Sırasıyla)

*(Tüm planlanan özellikler tamamlandı! 🎉)*

---

### Detaylı Gereksinimler (Orijinal Notlar)

#### 2️⃣ Konuma Göre Yakın Camiler
🎯 Amaç: Kullanıcının bulunduğu konuma en yakın camileri göstermek.
📱 Mobilde Çalışma Mantığı:
- GPS konum alınır
- Harita SDK (Leaflet / Mapbox / Google Maps)
- Mosque etiketiyle filtreleme
- Liste + Harita sekmesi
- Gösterilecek Bilgiler: Cami adı, uzaklık, yol tarifi butonu.

#### 4️⃣ Kazalar Namaz Takip Sistemi
🎯 Amaç: Kullanıcının kaza namazlarını takip edebilmesi.
📱 Nasıl Çalışır:
- Günlük kılınan namaz işaretleme
- Kaza borcu girme
- Otomatik düşme sistemi
- Grafikle ilerleme gösterme

#### 5️⃣ Dini Günler & Hatırlatıcı
🎯 Amaç: Önemli İslami günleri kaçırmamak.
Özellikler: Kandiller, Ramazan başlangıcı, Bayramlar, Aşure günü, Hicri takvim.
Mobil Güçlü Özellik: Bildirim hatırlatma, O güne özel ayet / hadis gösterme.
