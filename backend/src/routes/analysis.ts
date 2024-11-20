import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { supabase } from '../config/supabase';

const router = express.Router();

router.post('/analyze', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    const userId = req.user?.userId;

    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    if (!userId) {
      return res.status(401).json({ message: 'User ID not found' });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid URL format' });
    }

    // Perform analysis
    const analysis = await analyzeUrl(url);

    // Save analysis result
    const { data: savedAnalysis, error: saveError } = await supabase
      .from('url_analyses')
      .insert([
        {
          user_id: userId,
          url: url,
          threat_level: analysis.threatLevel,
          details: analysis.details
        }
      ])
      .select()
      .single();

    if (saveError) {
      console.error('Error saving analysis:', saveError);
      return res.status(500).json({ message: 'Error saving analysis results' });
    }

    res.json(savedAnalysis);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ message: 'Failed to analyze URL' });
  }
});

async function analyzeUrl(url: string) {
  const urlObj = new URL(url);
  let threatScore = 0;
  const details: any = {
    domain: urlObj.hostname,
    protocol: urlObj.protocol,
    checks: []
  };

  // Check HTTPS
  if (urlObj.protocol !== 'https:') {
    threatScore += 2;
    details.checks.push({
      name: 'HTTPS',
      result: 'Not using HTTPS',
      risk: 'medium'
    });
  }

  // Check for URL encoding
  if (/%[0-9A-Fa-f]{2}/.test(urlObj.href)) {
    threatScore += 1;
    details.checks.push({
      name: 'URL Encoding',
      result: 'URL contains encoded characters',
      risk: 'low'
    });
  }

  // Check for short URL services
  const shortURLDomains = ['bit.ly', 't.co', 'goo.gl', 'tinyurl.com', 'ow.ly'];
  if (shortURLDomains.some(domain => urlObj.hostname === domain)) {
    threatScore += 3;
    details.checks.push({
      name: 'Short URL',
      result: 'URL uses a known shortener service',
      risk: 'high'
    });
  }

  // Check for mismatched protocol and port
  if ((urlObj.protocol === 'http:' && urlObj.port === '443') || (urlObj.protocol === 'https:' && urlObj.port === '80')) {
    threatScore += 2;
    details.checks.push({
      name: 'Protocol and Port',
      result: 'Mismatched protocol and port combination',
      risk: 'medium'
    });
  }

  // Check for uncommon ports
  const commonPorts = [80, 443, 8080];
  if (!commonPorts.includes(Number(urlObj.port)) && urlObj.port) {
    threatScore += 2;
    details.checks.push({
      name: 'Port',
      result: 'Uncommon port detected',
      risk: 'medium'
    });
  }

  // Check for punycode domains
  if (urlObj.hostname.includes('xn--')) {
    threatScore += 3;
    details.checks.push({
      name: 'Punycode',
      result: 'Punycode (internationalized domain) detected',
      risk: 'high'
    });
  }

  // Check for long domain names
  if (urlObj.hostname.length > 63) {
    threatScore += 1;
    details.checks.push({
      name: 'Domain Length',
      result: 'Domain name exceeds typical length',
      risk: 'low'
    });
  }

  // Check for suspicious characters in the path
  const suspiciousPathChars = ['@', '#', '&', ';', '$'];
  if (suspiciousPathChars.some(char => urlObj.pathname.includes(char))) {
    threatScore += 2;
    details.checks.push({
      name: 'Path Characters',
      result: 'Suspicious character in URL path',
      risk: 'medium'
    });
  }

  // Check for phishing-specific subdomains
  const phishingSubdomains = ['login', 'secure', 'signin', 'account', 'verify'];
  if (phishingSubdomains.some(subdomain => urlObj.hostname.split('.').includes(subdomain))) {
    threatScore += 3;
    details.checks.push({
      name: 'Subdomain',
      result: 'Suspicious subdomain detected',
      risk: 'high'
    });
  }

  // Check for duplicate TLDs
  const tldPattern = /\.([a-z]{2,})\.\1$/;
  if (tldPattern.test(urlObj.hostname)) {
    threatScore += 2;
    details.checks.push({
      name: 'TLD',
      result: 'Duplicate TLD detected',
      risk: 'medium'
    });
  }

  // Calculate final threat level
  details.threatScore = threatScore;
  const threatLevel = threatScore <= 2 ? 'safe' : threatScore <= 5 ? 'suspicious' : 'dangerous';

  return {
    threatLevel,
    details
  };
}

export default router;