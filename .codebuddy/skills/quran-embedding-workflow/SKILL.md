---
name: Quran Embedding Workflow
description: This skill provides step-by-step guidance for working with the Quran Embedding Service, including how embeddings work, API integration, and debugging common issues.
---

# Quran Embedding Workflow

## Purpose

To streamline working with the Python Flask embedding service in the Quran Semantic Graph project. This skill explains how embeddings are generated, cached, and used for semantic similarity calculations.

## When to Use This Skill

Use this skill when:
- Setting up or debugging the embedding service
- Understanding how text is converted to embeddings
- Troubleshooting embedding-related issues
- Integrating embeddings into the backend
- Optimizing embedding cache performance

## How Embeddings Work

### Overview
The embedding service converts Quranic text into numerical vectors using a pre-trained Turkish NLP model. These vectors capture semantic meaning, allowing comparison of similar concepts.

### Flow
```
Arabic Text → Turkish Translation → sentence-transformers → 768-dim Vector
```

### Model Details
- **Model**: `emrecan/bert-base-turkish-cased-mean-nli-stsb-tr`
- **Dimensions**: 768
- **Language**: Turkish (optimized for Turkish NLP tasks)
- **Download size**: ~500MB (happens on first run)

## Service Architecture

### Endpoints

#### 1. Health Check
```
GET /health
Response: { "status": "ok", "model_loaded": true }
```

#### 2. Single Embedding
```
POST /embed
Body: { "text": "Some text here" }
Response: { "embedding": [0.123, -0.456, ...] }
```

#### 3. Batch Embedding
```
POST /embed/batch
Body: { "texts": ["Text 1", "Text 2", ...] }
Response: { "embeddings": [[...], [...], ...] }
```

## Integration with Backend

### From Backend to Embedding Service

**File**: `backend/services/embeddingService.js`

```javascript
import axios from 'axios'

const EMBEDDING_SERVICE_URL = process.env.EMBEDDING_SERVICE_URL || 'http://localhost:5000'

export const getEmbedding = async (text) => {
  try {
    const response = await axios.post(`${EMBEDDING_SERVICE_URL}/embed`, { text })
    return response.data.embedding
  } catch (error) {
    console.error('Embedding service failed:', error.message)
    throw error
  }
}

export const getBatchEmbeddings = async (texts) => {
  try {
    const response = await axios.post(`${EMBEDDING_SERVICE_URL}/embed/batch`, { texts })
    return response.data.embeddings
  } catch (error) {
    console.error('Batch embedding failed:', error.message)
    throw error
  }
}
```

## Caching Strategy

### SQLite Cache
- Embeddings are cached in SQLite to avoid redundant API calls
- Cache miss rate should be < 10% in production

### Cache Lookup
```javascript
const cached = db.prepare('SELECT embedding FROM embeddings WHERE text_hash = ?').get(hash(text))
if (cached) return cached.embedding
```

## Similarity Calculation

### Cosine Similarity Formula
```
similarity = (A · B) / (||A|| × ||B||)
Range: -1 to 1 (higher = more similar)
Threshold: > 0.7 = semantically similar
```

**File**: `backend/services/similarityService.js`

```javascript
export const cosineSimilarity = (vec1, vec2) => {
  const dotProduct = vec1.reduce((sum, v, i) => sum + v * vec2[i], 0)
  const magnitude1 = Math.sqrt(vec1.reduce((sum, v) => sum + v * v, 0))
  const magnitude2 = Math.sqrt(vec2.reduce((sum, v) => sum + v * v, 0))
  return dotProduct / (magnitude1 * magnitude2)
}
```

## Common Issues & Solutions

### Issue 1: "Connection refused" (Port 5000)
**Solution**: 
- Check if embedding service is running: `python app.py` in `/embedding-service`
- Verify `EMBEDDING_SERVICE_URL` env variable in backend
- Check firewall/port blocking

### Issue 2: "Model loading takes too long"
**Solution**:
- First run downloads 500MB model (normal, takes 2-5 min)
- Subsequent runs load from cache (~5 sec)
- Check disk space (need 2GB free)

### Issue 3: "Similarity scores are always 0"
**Solution**:
- Verify embeddings have correct dimensions (768)
- Check if both vectors are non-zero
- Confirm cosine similarity formula implementation

### Issue 4: "Out of memory" on batch requests
**Solution**:
- Reduce batch size: `max_batch_size = 64` instead of 256
- Process in smaller chunks in backend
- Monitor GPU memory usage

## Performance Optimization

### Batch Processing
```python
# Good: Process 100 texts in one request
POST /embed/batch with 100 texts

# Bad: Process 100 texts in 100 requests
100x POST /embed with 1 text each
```

### Caching Priority
1. Cache hit (instant)
2. Batch request (50-100ms per text)
3. Single request (100-200ms per text)

## Development Workflow

### Start Services in Order
```bash
# Terminal 1: Embedding service
cd embedding-service
python app.py

# Terminal 2: Backend API
cd backend
npm run dev

# Terminal 3: Frontend
cd frontend
npm run dev
```

### Test Embedding Integration
```bash
# Test if embedding service is running
curl http://localhost:5000/health

# Test single embedding
curl -X POST http://localhost:5000/embed \
  -H "Content-Type: application/json" \
  -d '{"text": "Bismillah"}'
```

## References

- Sentence Transformers: https://www.sbert.net/
- Cosine Similarity: https://en.wikipedia.org/wiki/Cosine_similarity
- Turkish NLP Model: https://huggingface.co/emrecan/bert-base-turkish-cased-mean-nli-stsb-tr
