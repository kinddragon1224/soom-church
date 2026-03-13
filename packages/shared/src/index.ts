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
