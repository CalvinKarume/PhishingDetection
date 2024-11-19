// User related types
export interface User {
    id: string;
    email: string;
  }
  
  // Authentication context types
  export interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
  }
  
  // URL Analysis related types
  export interface AnalysisResult {
    id: string;
    url: string;
    threatLevel: 'safe' | 'suspicious' | 'dangerous';
    details: {
      hasHttps: boolean;
      suspiciousKeywords: string[];
      domainAge?: number;
      redirectCount: number;
      hasSuspiciousTLD: boolean;
      threatScore: number;
    };
    analyzedAt: string;
  }
  
  // API Error type
  export interface ApiError {
    message: string;
    field?: string;
  }