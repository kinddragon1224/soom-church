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
