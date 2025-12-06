export interface LegalOperator {
  name: string;
  domain: string;
  type: 'bukmacher' | 'kasyno' | 'loteria';
  license: string;
}

export const legalOperators: LegalOperator[] = [
  { name: 'TOTALbet', domain: 'totalbet.pl', type: 'bukmacher', license: 'PL' },
  { name: 'Fortuna', domain: 'efortuna.pl', type: 'bukmacher', license: 'PL' },
  { name: 'STS', domain: 'sts.pl', type: 'bukmacher', license: 'PL' },
  { name: 'Betclic', domain: 'betclic.pl', type: 'bukmacher', license: 'PL' },
  { name: 'Superbet', domain: 'superbet.pl', type: 'bukmacher', license: 'PL' },
  { name: 'LV BET', domain: 'lvbet.pl', type: 'bukmacher', license: 'PL' },
  { name: 'Betfan', domain: 'betfan.pl', type: 'bukmacher', license: 'PL' },
  { name: 'ETOTO', domain: 'etoto.pl', type: 'bukmacher', license: 'PL' },
  { name: 'Totolotek', domain: 'totolotek.pl', type: 'loteria', license: 'PL' },
  { name: 'Lotto', domain: 'lotto.pl', type: 'loteria', license: 'PL' },
];

export const suspiciousPatterns = [
  'aviator',
  'crash',
  'mines',
  'plinko',
  'no-kyc',
  'bonus 200%',
  'bonus 300%',
  'bonus 400%',
  'freebet',
  'pewna wygrana',
  'bez limitu',
  'instant withdrawal',
  'crypto casino',
];

export const highRiskPaymentMethods = [
  'BLIK',
  'Crypto',
  'Bitcoin',
  'Ethereum',
  'USDT',
  'no verification',
];

export const knownIllegalLicenses = [
  'Curacao',
  'Costa Rica',
  'Kahnawake',
  'No License',
];
