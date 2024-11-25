import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  password: string;
  created_at?: string;
}

export interface DecodedToken {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: DecodedToken;
}

export interface AnalysisResult {
  threatLevel: 'safe' | 'suspicious' | 'dangerous';
  details: {
    hasHttps: boolean;
    suspiciousKeywords: string[];
    domainAge?: number;
    redirectCount: number;
    hasSuspiciousTLD: boolean;
    threatScore: number;
  };
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  confirmPassword?: string;
}
