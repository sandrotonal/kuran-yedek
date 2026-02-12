# CodeBuddy Configuration for Quran Semantic Graph

Bu klasör, Quran Semantic Graph projesi için CodeBuddy AI asistanının davranışını kustomize eden kuralları ve beceri paketlerini içerir.

## 📁 Yapı

```
.codebuddy/
├── rules/                          # Proje standartları ve kurallar
│   ├── quran-project-rules.mdc    # Genel proje kuralları
│   ├── typescript-standards.mdc   # Frontend TypeScript standartları
│   └── backend-api-standards.mdc  # Backend API yazım standartları
│
└── skills/                         # Uzman bilgi paketleri
    ├── quran-embedding-workflow/  # Embedding servisi nasıl çalışır
    └── quran-fullstack-setup/     # Projeyi ayağa kaldırma rehberi
```

## 📋 Rules (Kurallar)

Rules, CodeBuddy'nin kod yazarken ve düzenlerken uyması gereken standartları tanımlar.

### 1. **quran-project-rules** 
   - **Tür**: Always (Her zaman aktif)
   - **Kapsamı**: Tüm proje
   - **İçeriği**:
     - Proje yapısı ve dizin organizasyonu
     - Port yönetimi (5000, 3001, 5173)
     - Commit standartları
     - Dosya isimlendirme kuralları
     - API response format'ı
     - Error handling yaklaşımları

### 2. **typescript-standards**
   - **Tür**: Requested (İstenildiğinde aktif)
   - **Kapsamı**: Frontend kod
   - **İçeriği**:
     - React component template'leri
     - Type güvenliği best practices
     - Hook patterns (useQuery, etc)
     - Tailwind CSS naming conventions
     - Performance optimization tipleri

### 3. **backend-api-standards**
   - **Tür**: Requested (İstenildiğinde aktif)
   - **Kapsamı**: Backend kod
   - **İçeriği**:
     - Express route patterns
     - Service layer architecture
     - Database query best practices
     - Error handling patterns
     - Embedding service entegrasyonu

## 🧠 Skills (Beceri Paketleri)

Skills, belirli görevleri yaparken CodeBuddy'nin başvurabileceği detaylı rehberlerdir.

### 1. **quran-embedding-workflow**
   - **Kullanım zamanı**: Embedding servisiyle ilgili görevler
   - **İçeriği**:
     - Embedding nasıl çalışır (theory)
     - API endpoints (`/health`, `/embed`, `/embed/batch`)
     - Backend integration code
     - Cosine similarity hesaplama
     - Caching stratejisi
     - Common issues & solutions
     - Performance optimization

### 2. **quran-fullstack-setup**
   - **Kullanım zamanı**: Proje setup, debugging, deployment
   - **İçeriği**:
     - Adım-adım kurulum talimatları
     - Environment variables
     - Development workflow
     - Production build talimatları
     - Debugging guide
     - Troubleshooting checklist
     - Git workflow
     - Common tasks

## 🎯 Nasıl Kullanılır?

### CodeBuddy'nin Rules'ı Uyması
```
Örnek: Yeni bir backend route yazarken
→ "quran-project-rules" otomatik uygulanır
→ "backend-api-standards" istenirse aktif olur
→ CodeBuddy, tanımlanan standartları takip eder
```

### CodeBuddy'nin Skills'i Kullanması
```
Örnek: "Embedding servisiyle ilgili sorun var"
→ CodeBuddy, "quran-embedding-workflow" skillini kullanır
→ Sorun çözmek için skill'deki rehberi referans alır
→ Common issues bölümünden çözüm arar
```

## 🔄 Sürekli Geliştirme

Rules ve Skills'i ihtiyaca göre güncelleyin:

1. **Yeni pattern öğrendiyseniz** → Rules'a ekleyin
2. **Tekrarlayan süreçler olursa** → Skills'e yazın
3. **Standart değişirse** → Kuralları güncelleyin

## 📝 Dosya Formatları

- **Rules**: `.mdc` format (Markdown)
- **Skills**: `SKILL.md` (YAML frontmatter + Markdown)

## 🚀 Tips

- Rules'ı **dar ve spesifik** tutun (taşan context'i önlemek için)
- Skills'e **referanslar** (links) ekleyin
- Her rule/skill için **açık örnekler** verin
- Türkçe ve İngilizce **karışık** kullanabilirsin

## 📚 Referanslar

Daha fazla bilgi için:
- [`README.md`](../README.md) - Proje genel bilgiler
- [`backend/README.md`](../backend/README.md) - Backend detayları
- [`frontend/README.md`](../frontend/README.md) - Frontend detayları
- [`embedding-service/README.md`](../embedding-service/README.md) - Python servisi

---

**Version**: 1.0  
**Last Updated**: Feb 7, 2026
