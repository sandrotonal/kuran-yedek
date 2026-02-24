Bismillahirahmanirahim

# Quran Semantic Graph & Spiritual Compass

Modern NLP (Dogal Dil Isleme) teknikleri ve graph (ag) gorsellestirme algoritmalari kullanilarak Kur'an-i Kerim ayetleri arasindaki anlamsal iliskileri haritalandiran, aynizamanda zenginlestirilmis Islami araclar ile donatilmis full-stack web uygulamasidir.

Uygulama, "Glassmorphism" (cam efekti) tabanli premium bir arayuz tasarimina sahip olup, kullanici deneyimini puruzsuz animasyonlar ve karanlik/aydinlik mod destekleriyle ust seviyeye tasimaktadir.

## Temel Ozellikler

### Anlamsal Analiz (Semantic Search)
- **NLP Modeli:** Turkce dili icin optimize edilmis `sentence-transformers` modeli.
- **Benzerlik Algoritmasi:** Cosine similarity (Kosinus Benzerligi) yaklasimi ile ayetler arasi derin baglam iliskilerinin saptanmasi.
- **Node Graph:** React Flow entegrasyonu ile anlamsal iliskilerin interaktif ag haritasi uzerinde gorsellestirilmesi.

### Islami Araclar (Kesfet Modulu)
Uygulamanin sol menusunde yer alan "Kesfet" bolumu altina entegre edilmis birbirine bagli moduller:

- **Gunun Akisi:** Ayet, hadis, esma ve tefekkur planlarini barindiran gunluk manevi program.
- **Namaz Asistani:** Cemaat takibi, vakit istatistikleri ve namaz esnasinda sessiz mod yonetimi.
- **Kaza Borcu Takibi:** Kaza namazlarinin loglanmasi ve erimesinin takip edilmesi.
- **Ramazan Iklimi:** Iftar duasina kalan sureyi saniye saniye sayan fener efektli gorsel sayac ve fitre hesaplamalari.
- **Hatim Takip Sistemi:** Cuz bazli isaretleme ve kalan hedeflerin radial progress (dairesel ilerleme) grafikleriyle takibi.
- **Dua Defteri:** Gizli (Private) mod destekli, kilit animasyonlu kisisel not ve dua gunlugu.
- **Kuran Dinleme Modu:** Apple Music tarzi arkaplan glow efektleriyle desteklenen, Arapca filigranli sure dinleme oynaticisi.
- **Sessiz Zikir Modu:** AMOLED/OLED siyah arkaplan uzerinde, dokunma titresimli (haptic feedback) ripple efektli zikirmatik.
- **Dini Gunler ve Manevi Takvim:** Kandillerin ve ozel islam gunlerinin tarihi onemi, ilgili hadisler ve yapilmasi tavsiye edilen ibadetlerle detaylandirilmis hali.
- **Akilli Bildirim Sistemi:** Uygulama icinde (in-app) suzulerek gelen ozel gun uyarilari (Toast/Alert) ve vakit girdiginde tetiklenen isletim sistemi seviyesinde push bildirimleri.
- **Esmaul Husna ve Kible Pusulasi:** 99 ismin anlami detaylari ve cihazin konum servislerini kullanarak yon tayini yapan pusula sistemi.

## Proje Mimarisi

```text
kuran/
├── embedding-service/   # Python Flask embedding microservice (Port: 5000)
├── backend/             # Node.js Express API (Port: 3001)
└── frontend/            # React + TypeScript + Vite frontend (Port: 5173)
```

## Kurulum Adimlari

Sistemin tam anlamiyla islevsel olabilmesi icin asagidaki 3 servisin ayri terminallerde baslatilmasi gerekmektedir.

### 1. Python Embedding Service
Anlamsal arama (Semantic Search) ozelliginin calismasi icin NLP servisinin aktif olmasi sarttir. Ilk calistirmada yaklasik 500MB boyutundaki BERT NLP modeli otomatik olarak indirilecektir.

```bash
cd embedding-service
pip install -r requirements.txt
python app.py
```

### 2. Backend (Node.js API)
Veritabanina ve dis servislere erisimi saglayan ana API katmani.

```bash
cd backend
npm install
npm run dev
```

### 3. Frontend (React PWA)
Kullanici arayuzunu sunan React istemcisi.

```bash
cd frontend
npm install
npm run dev
```

Tüm servisler baslatildiktan sonra `http://localhost:5173` adresi uzerinden uygulamaya erisebilirsiniz.

## Kullanilan Teknolojiler

**Frontend:**
- React 18, TypeScript, Vite
- Tailwind CSS (Premium Glassmorphism & Animations)
- React Flow (Ayet Ag Gorsellestirme)
- TanStack Query
- Lucide React (Ikonografi)

**Backend:**
- Node.js, Express
- SQLite (Veritabani yapilanmasi ve Onbellekleme sistemi)
- Axios

**Yapay Zeka / NLP Servisi:**
- Python 3, Flask
- sentence-transformers (BERT Modeli)
- Model: `emrecan/bert-base-turkish-cased-mean-nli-stsb-tr`

## Onemli Not (Akademik Yasal Uyari)

Bu uygulamada kullanilan anlamsal (semantic) bag kurma islemleri, NLP tabanli matematiksel otomatik hesaplamalara (Cosine Similarity) dayanmaktadir. Cikan benzerlik skorlari veya grafiksel iliskiler asla dogrudan bir "tefsir" veya "fetva" yerine gecmez. Yalnizca dilbilimsel yaklasimi gosteren arastirma amaci tasimaktadir.

## Lisans

MIT Lisansi altinda yayimlanmistir.
