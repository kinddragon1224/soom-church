#!/bin/bash
# 기존 soom-church → 마이크로서비스 모노레포 마이그레이션 스크립트

set -e

echo "🚀 Soom Church 마이크로서비스 마이그레이션 시작..."

# 색상 정의
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SOOM_DIR="$HOME/wrkciety/soom-church"
CORE_DIR="$SOOM_DIR/services/core-service"

echo -e "${BLUE}Step 1: core-service 디렉토리 준비${NC}"

# 기존 파일들을 core-service로 이동
echo "  - 기존 파일 이동 중..."

# 이동할 파일 목록
FILES_TO_MOVE=(
    "app"
    "components"
    "lib"
    "prisma"
    "public"
    "docs"
    "package.json"
    "package-lock.json"
    "tsconfig.json"
    "next.config.mjs"
    "tailwind.config.ts"
    "postcss.config.mjs"
    "components.json"
    "next-env.d.ts"
    ".env.example"
    "LICENSE"
    "README.md"
    ".gitignore"
)

# 파일 이동
for item in "${FILES_TO_MOVE[@]}"; do
    if [ -e "$SOOM_DIR/$item" ] && [ ! -e "$CORE_DIR/$item" ]; then
        mv "$SOOM_DIR/$item" "$CORE_DIR/"
        echo "    ✓ $item 이동 완료"
    fi
done

echo -e "${BLUE}Step 2: Dockerfile 생성${NC}"

# Core Service Dockerfile
cat > "$CORE_DIR/Dockerfile" << 'EOF'
FROM node:20-alpine

WORKDIR /app

# 종속성 설치
COPY package*.json ./
RUN npm ci

# Prisma CLI 설치
RUN npm install -g prisma

# 소스 코드 복사 (개발 시에는 볼륨 마운트로 오버라이드)
COPY . .

# Prisma Client 생성
RUN npx prisma generate

# 개발 서버 포트
EXPOSE 3000

CMD ["npm", "run", "dev"]
EOF

echo "  ✓ Core Service Dockerfile 생성 완료"

# 다른 서비스용 기본 Dockerfile 생성
for service in content-service application-service notification-service ai-service community-service; do
    SERVICE_DIR="$SOOM_DIR/services/$service"
    
    if [ ! -f "$SERVICE_DIR/Dockerfile" ]; then
        cat > "$SERVICE_DIR/Dockerfile" << EOF
FROM node:20-alpine

WORKDIR /app

# 종속성 설치
COPY package*.json ./
RUN npm ci || npm install

# 소스 코드 복사
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
EOF
        echo "  ✓ $service Dockerfile 생성 완료"
    fi
done

echo -e "${BLUE}Step 3: 공유 패키지 구조 생성${NC}"

# packages/shared 기본 구조
mkdir -p "$SOOM_DIR/packages/shared/src"
cat > "$SOOM_DIR/packages/shared/package.json" << 'EOF'
{
  "name": "@soom/shared",
  "version": "1.0.0",
  "description": "Soom Church 공유 패키지",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "devDependencies": {
    "typescript": "^5.5.3"
  }
}
EOF

cat > "$SOOM_DIR/packages/shared/src/index.ts" << 'EOF'
// Soom Church 공유 유틸리티
export const SOOM_VERSION = '1.0.0';

// 공통 에러 클래스
export class SoomError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'SoomError';
  }
}

// 공통 응답 형식
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
EOF

cat > "$SOOM_DIR/packages/shared/tsconfig.json" << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"]
}
EOF

echo "  ✓ 공유 패키지 구조 생성 완료"

echo -e "${BLUE}Step 4: 환경 변수 설정${NC}"

# 루트 .env.example
cat > "$SOOM_DIR/.env.example" << 'EOF'
# Soom Church - 마이크로서비스 환경 변수

# OpenAI (설교 요약, 나눔지 생성)
OPENAI_API_KEY=sk-...

# Anthropic Claude
ANTHROPIC_API_KEY=sk-ant-...

# Google Gemini
GEMINI_API_KEY=...

# ElevenLabs (TTS)
ELEVENLABS_API_KEY=...

# 이메일 (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# SMS (선택)
# SMS_PROVIDER=aligo
# SMS_API_KEY=...
# SMS_API_SECRET=...

# 파일 저장 (선택 - AWS S3 등)
# AWS_ACCESS_KEY_ID=...
# AWS_SECRET_ACCESS_KEY=...
# AWS_S3_BUCKET=...
# AWS_REGION=ap-northeast-2
EOF

echo "  ✓ .env.example 생성 완료"

echo -e "${BLUE}Step 5: 루트 README 업데이트${NC}"

cat > "$SOOM_DIR/README.md" << 'EOF'
# ⛪ Soom Church - 교회 AI 사역 인프라

교회 교적/행정/콘텐츠/커뮤니티를 위한 마이크로서비스 기반 플랫폼

## 🏗️ 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                        API Gateway (8081)                    │
│                        Nginx                                │
└─────────────┬─────────────┬─────────────┬───────────────────┘
              │             │             │
    ┌─────────▼──┐  ┌──────▼────┐  ┌────▼───┐  ┌──────────────┐
    │   Core    │  │  Content  │  │   App   │  │ Notification │
    │  :3002    │  │   :3003   │  │  :3004  │  │    :3005     │
    └────────────┘  └───────────┘  └────────┘  └──────────────┘
         │                                    ┌──────────────┐
         │                                    │      AI      │
         │                                    │    :3007     │
         │                                    └──────────────┘
    ┌────┴────────────────────────────┐
    │     PostgreSQL (5434)           │     Redis (6379)
    │  soom_core, soom_content...     │     Cache/Queue
    └─────────────────────────────────┘
```

## 🚀 빠른 시작

```bash
# 1. 클론 및 이동
cd ~/wrkciety/soom-church

# 2. 환경 변수 설정
cp .env.example .env
# .env 파일에 API 키 입력

# 3. Docker Compose 실행
npm run dev
# 또는
yarn dev

# 4. 서비스 접속
# Gateway:     http://localhost:8081
# Core:        http://localhost:3002
# Content:     http://localhost:3003
# Application: http://localhost:3004
# Notification: http://localhost:3005
# AI:          http://localhost:3007
```

## 📁 디렉토리 구조

```
soom-church/
├── docker/                    # Docker Compose 설정
│   ├── docker-compose.yml
│   ├── nginx.conf              # API Gateway 설정
│   └── init-db.sql             # DB 초기화
├── packages/                   # 공유 패키지
│   └── shared/                 # 공통 유틸리티
├── services/                   # 마이크로서비스
│   ├── core-service/           # 교적/행정 (Next.js)
│   ├── content-service/        # 설교/콘텐츠
│   ├── application-service/    # 신청/주차
│   ├── notification-service/    # 알림/SMS/이메일
│   ├── ai-service/             # LLM 통합
│   └── community-service/      # 소모임/채팅
└── scripts/                    # 유틸리티 스크립트
```

## 📋 서비스별 포트

| 서비스 | 포트 | 설명 |
|--------|------|------|
| Gateway | 8081 | API Gateway, Nginx |
| Core | 3002 | 교적/행정/인증 |
| Content | 3003 | 설교/쇼츠/TTS |
| Application | 3004 | 신청/주차 관리 |
| Notification | 3005 | SMS/이메일/푸시 |
| Community | 3006 | 소모임/채팅 |
| AI | 3007 | OpenAI/Claude/Gemini |
| PostgreSQL | 5434 | 공유 데이터베이스 |
| Redis | 6379 | 캐시/큐 |

## 🛠️ 개발 명령어

```bash
# 모든 서비스 시작
npm run dev

# 백그라운드에서 시작
npm run dev:detach

# 서비스 중지
npm run down

# 로그 확인
npm run logs

# DB 리셋
npm run db:reset

# 시드 데이터 삽입
npm run seed
```

## 📚 문서

- [멀티테넌트 가이드](docs/MULTITENANT_FOUNDATION.md)
- [API 문서](docs/API.md) (예정)
- [배포 가이드](docs/DEPLOYMENT.md) (예정)

## 📝 라이선스

MIT
EOF

echo "  ✓ 루트 README 생성 완료"

# 실행 권한 부여
chmod +x "$SOOM_DIR/scripts/migrate-to-monorepo.sh"

echo ""
echo -e "${GREEN}✅ 마이그레이션 완료!${NC}"
echo ""
echo "다음 단계:"
echo "  1. cd $SOOM_DIR"
echo "  2. cp .env.example .env  # 환경 변수 설정"
echo "  3. npm run dev           # 서비스 시작"
echo ""
echo "접속 포트:"
echo "  - Gateway:     http://localhost:8081"
echo "  - Core:        http://localhost:3002"
echo "  - PostgreSQL:  localhost:5434"
echo "  - Redis:       localhost:6379"
