FROM node:20-alpine

WORKDIR /app

# 종속성 설치
COPY package*.json ./
RUN npm ci || npm install

# 소스 코드 복사
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
