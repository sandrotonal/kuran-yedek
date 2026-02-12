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

---

## 📝 Yapılacaklar Listesi (Sırasıyla)

- [ ] **2️⃣ Konuma Göre Yakın Camiler**
  - *Hedef:* Kullanıcının konumuna en yakın camileri listeleme ve haritada gösterme.
  - *Yöntem:* OpenStreetMap / Leaflet (veya Google Maps Link) kullanarak ücretsiz çözüm.

- [ ] **4️⃣ Kaza Namaz Takip Sistemi**
  - *Hedef:* Kılınamayan namazların kaydını tutma, grafiksel raporlama.
  - *Detay:* Günlük giriş, borç hesaplama, motivasyon kartları.

- [ ] **5️⃣ Dini Günler & Hatırlatıcı**
  - *Hedef:* Kandil, bayram ve özel günlerin takvimi.
  - *Detay:* Geri sayım, o güne özel içerik bildirimi.

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
