-- 교회 AI 사역 인프라 - 데이터베이스 초기화
-- 각 서비스별 스키마 생성

-- Core Service: 교적/행정
CREATE DATABASE soom_core;

-- Content Service: 설교/콘텐츠
CREATE DATABASE soom_content;

-- Application Service: 신청/주차
CREATE DATABASE soom_application;

-- Notification Service: 알림
CREATE DATABASE soom_notification;

-- Community Service: 소모임/채팅
CREATE DATABASE soom_community;

-- 권한 설정
GRANT ALL PRIVILEGES ON DATABASE soom_core TO soom;
GRANT ALL PRIVILEGES ON DATABASE soom_content TO soom;
GRANT ALL PRIVILEGES ON DATABASE soom_application TO soom;
GRANT ALL PRIVILEGES ON DATABASE soom_notification TO soom;
GRANT ALL PRIVILEGES ON DATABASE soom_community TO soom;
