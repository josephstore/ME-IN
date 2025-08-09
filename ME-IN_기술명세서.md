# ME-IN 플랫폼 기술명세서

## 🏗️ 시스템 아키텍처

### 기술 스택
- **Frontend**: React 18 + TypeScript + Next.js 14
- **Backend**: Node.js + Express + GraphQL
- **Database**: MongoDB + PostgreSQL + Redis + Elasticsearch
- **Infrastructure**: AWS + Docker + Kubernetes
- **Big Data**: Apache Kafka + Spark + TensorFlow

### 시스템 구성
```
Frontend (React) → API Gateway → Backend Services → Database Layer
                                    ↓
                              Big Data Processing
```

## 🗄️ 데이터베이스 설계

### MongoDB Collections
```javascript
// Users Collection
{
  _id: ObjectId,
  email: String,
  userType: "brand" | "influencer",
  profile: {
    name: String,
    language: [String],
    timezone: String
  }
}

// Brands Collection
{
  _id: ObjectId,
  userId: ObjectId,
  companyInfo: {
    name: { ko: String, en: String, ar: String },
    businessNumber: String,
    logo: String
  },
  products: [Product],
  targetMarkets: [String],
  budget: { min: Number, max: Number }
}

// Influencers Collection
{
  _id: ObjectId,
  userId: ObjectId,
  socialAccounts: [{
    platform: String,
    username: String,
    followers: Number,
    avgViews: Number
  }],
  expertise: [String],
  languages: [String],
  locations: [String]
}

// Campaigns Collection
{
  _id: ObjectId,
  brandId: ObjectId,
  title: { ko: String, en: String, ar: String },
  requirements: {
    influencerTypes: [String],
    minFollowers: Number,
    languages: [String]
  },
  budget: { total: Number, perInfluencer: Number },
  status: String,
  applications: [Application]
}
```

## 🔌 핵심 API 명세

### 인증 API
```typescript
POST /api/auth/register
POST /api/auth/login
GET /api/auth/verify
```

### 사용자 관리 API
```typescript
GET /api/users/profile
PUT /api/users/profile
GET /api/brands
POST /api/brands
GET /api/influencers
GET /api/influencers/:id
```

### 캠페인 API
```typescript
POST /api/campaigns
GET /api/campaigns
GET /api/campaigns/:id
PUT /api/campaigns/:id
DELETE /api/campaigns/:id
```

### 매칭 API
```typescript
POST /api/matching/recommend
POST /api/matching/apply
GET /api/matching/status
```

### 분석 API
```typescript
GET /api/analytics/campaign/:id
GET /api/analytics/influencer/:id
GET /api/analytics/dashboard
```

## 🔍 검색 및 매칭 알고리즘

### Elasticsearch 인덱스
```json
{
  "mappings": {
    "properties": {
      "id": { "type": "keyword" },
      "name": { "type": "text" },
      "expertise": { "type": "keyword" },
      "languages": { "type": "keyword" },
      "locations": { "type": "keyword" },
      "followers": { "type": "integer" },
      "rating": { "type": "float" }
    }
  }
}
```

### 매칭 점수 계산
```python
def calculate_match_score(influencer, campaign):
    score = 0
    
    # 콘텐츠 유사도 (30%)
    content_similarity = calculate_content_similarity(
        influencer.expertise, campaign.product.category
    )
    score += content_similarity * 0.3
    
    # 오디언스 중복도 (25%)
    audience_overlap = calculate_audience_overlap(
        influencer.followers_demographics, campaign.target_audience
    )
    score += audience_overlap * 0.25
    
    # 성과 이력 (25%)
    performance_score = calculate_performance_score(
        influencer.avg_rating, influencer.completion_rate
    )
    score += performance_score * 0.25
    
    # 지역 적합성 (20%)
    location_fit = calculate_location_fit(
        influencer.locations, campaign.target_markets
    )
    score += location_fit * 0.2
    
    return min(score, 1.0)
```

## 📊 빅데이터 처리

### Kafka 토픽
```yaml
topics:
  - social_media_data (10 partitions)
  - user_behavior (5 partitions)
  - campaign_performance (8 partitions)
```

### Spark 스트리밍
```python
def process_social_media_data():
    df = spark.readStream \
        .format("kafka") \
        .option("subscribe", "social_media_data") \
        .load()
    
    # 실시간 집계
    aggregated_df = df.groupBy("influencer_id") \
        .agg(
            count("*").alias("post_count"),
            avg("metrics.likes").alias("avg_likes"),
            avg("metrics.views").alias("avg_views")
        )
    
    # PostgreSQL에 저장
    query = aggregated_df.writeStream \
        .foreachBatch(write_to_postgresql) \
        .start()
```

## 🔒 보안 및 인증

### JWT 인증
```typescript
const generateToken = (user: User): string => {
  return jwt.sign({
    id: user.id,
    email: user.email,
    userType: user.userType
  }, process.env.JWT_SECRET, { expiresIn: '24h' });
};
```

### RBAC (역할 기반 접근 제어)
```typescript
enum UserRole {
  ADMIN = 'admin',
  BRAND_MANAGER = 'brand_manager',
  INFLUENCER = 'influencer'
}

const rolePermissions = {
  [UserRole.ADMIN]: ['read', 'write', 'delete', 'manage'],
  [UserRole.BRAND_MANAGER]: ['read', 'write'],
  [UserRole.INFLUENCER]: ['read']
};
```

## 📱 모바일 최적화

### 반응형 디자인
```css
.container {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

.grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
}
```

### 터치 최적화
```typescript
const TouchOptimizedButton = ({ children, ...props }) => {
  const [isPressed, setIsPressed] = useState(false);
  
  return (
    <button
      {...props}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      className={`${props.className} ${isPressed ? 'scale-95' : ''}`}
    >
      {children}
    </button>
  );
};
```

## 🚀 배포 및 운영

### Docker 컨테이너
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Kubernetes 배포
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mein-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: mein-backend
  template:
    spec:
      containers:
      - name: backend
        image: mein/backend:latest
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "256Mi"
            cpu: "200m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

## 📊 성능 최적화

### 캐싱 전략
```typescript
const cacheMiddleware = (duration: number = 300) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = `cache:${req.originalUrl}`;
    const cached = await redis.get(key);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    // 원본 응답을 캐시
    const originalSend = res.json;
    res.json = function(data) {
      redis.setex(key, duration, JSON.stringify(data));
      return originalSend.call(this, data);
    };
    
    next();
  };
};
```

### 데이터베이스 최적화
```sql
-- 인덱스 생성
CREATE INDEX idx_influencers_expertise ON influencers USING GIN(expertise);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_budget ON campaigns(budget_total);

-- 파티셔닝
CREATE TABLE analytics_partitioned (
    id SERIAL,
    campaign_id UUID,
    metrics JSONB,
    date DATE
) PARTITION BY RANGE (date);
```

## 📈 모니터링 및 로깅

### 성능 지표
- **시스템 가동률**: 99.9%
- **응답 시간**: 평균 2초 이내
- **동시 사용자**: 1,000명 처리
- **오류율**: 0.1% 이하

### 로깅 시스템
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## 🌐 다국어 지원

### 언어 설정
```typescript
const supportedLanguages = ['ko', 'en', 'ar'];
const defaultLanguage = 'ko';

const i18n = {
  ko: { /* 한국어 번역 */ },
  en: { /* 영어 번역 */ },
  ar: { /* 아랍어 번역 */ }
};
```

### 지역화 설정
```typescript
const localization = {
  currency: {
    ko: 'KRW',
    en: 'USD',
    ar: 'SAR'
  },
  timezone: {
    ko: 'Asia/Seoul',
    en: 'UTC',
    ar: 'Asia/Riyadh'
  }
};
```

## 📝 결론

ME-IN 플랫폼은 다음과 같은 기술적 특징을 가집니다:

1. **확장 가능한 마이크로서비스 아키텍처**
2. **실시간 빅데이터 처리 및 분석**
3. **AI 기반 스마트 매칭 알고리즘**
4. **다국어 지원 및 지역화**
5. **클라우드 네이티브 배포**
6. **강화된 보안 및 인증**

이 기술명세서를 바탕으로 안정적이고 확장 가능한 플랫폼을 구축할 수 있습니다.
