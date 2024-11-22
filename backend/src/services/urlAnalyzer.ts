import { URL } from 'url';
import axios from 'axios';
import { promisify } from 'util';
import dns from 'dns/promises';  // Using built-in DNS promises

export class UrlAnalyzer {
  private suspiciousKeywords = [
    'login', 'signin', 'account', 'bank', 'verify',
    'secure', 'update', 'password', 'credential',
    'confirm', 'verify', 'wallet', 'payment'
  ];

  private suspiciousTLDs = [
    '.xyz', '.top', '.work', '.click', '.loan',
    '.dating', '.stream', '.gdn'
  ];

  async analyze(url: string) {
    try {
      const urlObj = new URL(url);
      
      const checks = await Promise.all([
        this.checkHttps(urlObj),
        this.checkSuspiciousKeywords(urlObj),
        this.checkDomainAge(urlObj.hostname),
        this.checkRedirects(url),
        this.checkTLD(urlObj)
      ]);

      const [
        hasHttps,
        suspiciousKeywords,
        domainAge,
        redirectCount,
        hasSuspiciousTLD
      ] = checks;

      let threatLevel: 'safe' | 'suspicious' | 'dangerous' = 'safe';
      let threatScore = 0;

      if (!hasHttps) threatScore += 2;
      if (suspiciousKeywords.length >= 2) threatScore += suspiciousKeywords.length;
      if (domainAge && domainAge < 30) threatScore += 2;
      if (redirectCount > 1) threatScore += redirectCount;
      if (hasSuspiciousTLD) threatScore += 2;

      if (threatScore >= 5) {
        threatLevel = 'dangerous';
      } else if (threatScore >= 2) {
        threatLevel = 'suspicious';
      }

      return {
        threatLevel,
        details: {
          hasHttps,
          suspiciousKeywords,
          domainAge,
          redirectCount,
          hasSuspiciousTLD,
          threatScore
        }
      };
    } catch (error) {
      console.error('URL analysis error:', error);
      throw new Error('Failed to analyze URL');
    }
  }

  private checkHttps(urlObj: URL): boolean {
    return urlObj.protocol === 'https:';
  }

  private checkSuspiciousKeywords(urlObj: URL): string[] {
    const urlString = urlObj.toString().toLowerCase();
    return this.suspiciousKeywords.filter(keyword => 
      urlString.includes(keyword.toLowerCase())
    );
  }

  private async checkDomainAge(hostname: string): Promise<number | null> {
    try {
      await dns.lookup(hostname);

      return null;
    } catch {
      return null;
    }
  }

  private async checkRedirects(url: string): Promise<number> {
    try {
      const response = await axios.get(url, {
        maxRedirects: 5,
        validateStatus: null
      });
      return response.request._redirectable._redirectCount || 0;
    } catch {
      return 0;
    }
  }

  private checkTLD(urlObj: URL): boolean {
    return this.suspiciousTLDs.some(tld => 
      urlObj.hostname.toLowerCase().endsWith(tld)
    );
  }
}

export const urlAnalyzer = new UrlAnalyzer();