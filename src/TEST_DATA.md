# 🧪 Test Data for KAS AI Guard

## Example Queries for Proactive Mode

### High-Risk Gambling Sites
```
Find new casino websites targeting Polish users
Search for online casinos offering 300% welcome bonus
Discover gambling sites with BLIK payment in Poland
Find websites promoting Aviator crash game
Search for crypto casinos targeting Eastern Europe
Look for online betting sites without proper licenses
Find mirror domains of blocked gambling websites
```

### Specific Pattern Detection
```
Search for websites with "no KYC" gambling
Find casinos accepting cryptocurrency only
Discover sites with instant withdrawal claims
Look for gambling ads on Polish social media
Search for casino affiliate networks in Poland
```

---

## Example URLs for Reaction Mode

### Known Illegal Operators (for testing)
**⚠️ These are examples - use actual suspicious domains**

```
https://1xbet.com
https://22bet.com
https://melbet.com
https://betway.com (check if licensed in PL)
https://stake.com
```

### Test Patterns to Look For:
- No Polish gambling license (brak licencji MF/KAS)
- BLIK payment method offered
- Games: Aviator, Crash, Mines, Plinko
- Bonuses: 200%+, 300%+, 400%+
- Claims: "no limit", "instant payout", "no verification"
- Cryptocurrency-only payments
- Multiple mirror domains

---

## Example Screenshots to Analyze

### Ad Pattern 1: Social Media Casino Ad
**What to include:**
- Large "BONUS 400%" text
- "Aviator" game logo
- "Płać BLIKIEM" badge
- Casino brand logo
- Polish language text

**Expected Analysis:**
- Risk Score: 0.95+
- Recommendation: ADD_TO_REGISTRY
- Detected: Aggressive bonus, BLIK, Aviator, PL targeting

---

### Ad Pattern 2: Crypto Casino
**What to include:**
- "No KYC" claim
- Bitcoin/crypto logos
- "Instant withdrawal"
- No license information

**Expected Analysis:**
- Risk Score: 0.90+
- Recommendation: OBSERVE
- Detected: Crypto-only, no license, suspicious claims

---

### Ad Pattern 3: Legal Operator (Control)
**What to include:**
- STS.pl or Fortuna.pl branding
- License number visible
- Responsible gambling warnings
- "18+" age restriction

**Expected Analysis:**
- Risk Score: 0.10-0.20
- Recommendation: LOW_PRIORITY or LEGAL
- Detected: Valid license, compliance

---

## Expected Agent Outputs

### FINDER Agent
```json
{
  "url": "example-casino777.com",
  "language": "PL",
  "currency": ["PLN", "EUR"],
  "bonuses": ["300% bonus", "free spins"],
  "risk": 0.92,
  "aliases": ["casino777.net", "casino777-pl.com"],
  "description": "New online casino targeting Poland",
  "geoTargeting": "Poland"
}
```

### INSPECTOR Agent
```json
{
  "licenseDetected": false,
  "paymentMethods": ["BLIK", "Visa", "Crypto"],
  "blikSupport": true,
  "hazardGames": ["Aviator", "Crash", "Mines"],
  "targetPL": true,
  "riskScore": 0.95,
  "htmlAnalysis": {
    "hasLicenseFooter": false,
    "hasPLNCurrency": true,
    "aggressiveBonuses": true,
    "mirrorRedirects": ["casino777.net"]
  }
}
```

### ADS HUNTER Agent
```json
{
  "adScreenshot": "base64_image",
  "text": "BONUS 400% • Aviator • Płać BLIKIEM",
  "detectedOperators": ["Unknown Casino"],
  "riskScore": 0.98,
  "keywords": ["bonus", "400%", "aviator", "BLIK"],
  "visualElements": {
    "hasBonusText": true,
    "hasPLNSign": true,
    "hasBLIK": true,
    "hasAviator": true
  }
}
```

### GRAPH ANALYZER Agent
```json
{
  "primaryDomain": "casino777.com",
  "aliases": [
    "casino777.net",
    "casino777-pl.com",
    "casino777mobile.app"
  ],
  "ipAddress": "192.0.2.1",
  "hosting": "Cloudflare",
  "relatedDomains": ["bet777.com", "slots777.com"],
  "commonResources": ["same-logo.png", "same-script.js"],
  "networkRisk": 0.85
}
```

### REPORTER Agent
```json
{
  "recommendation": "ADD_TO_REGISTRY",
  "confidence": 0.96,
  "summary": "Illegal gambling website targeting Polish users with aggressive bonuses, BLIK payment support, and high-risk games (Aviator, Crash). No valid Polish or EU license detected. Part of a network with 3+ mirror domains.",
  "evidence": [
    "No gambling license from MF/KAS found",
    "Offers BLIK payment method (targets Polish users)",
    "Promotes Aviator and Crash games (high-risk pattern)",
    "Advertises 300%+ welcome bonus (excessive)",
    "Connected to mirror network (casino777.net, casino777-pl.com)",
    "No responsible gambling warnings",
    "No age verification visible"
  ],
  "riskFactors": [
    "No License",
    "BLIK Support",
    "Aviator Game",
    "300%+ Bonus",
    "Mirror Network",
    "Polish Targeting"
  ],
  "legalStatus": "ILLEGAL - recommend immediate registry addition"
}
```

---

## Demo Scenarios

### Scenario 1: New Illegal Casino Discovery
**Goal:** Show proactive detection capability

**Steps:**
1. Query: "Find new casino sites with Aviator game targeting Poland"
2. FINDER discovers 5-7 sites
3. INSPECTOR analyzes first site
4. Result: 0.95+ risk score
5. GRAPH maps 10+ mirror domains
6. REPORTER recommends ADD_TO_REGISTRY

**Talking Points:**
- "System found these BEFORE any user reported them"
- "Network graph shows organized operation"
- "From discovery to recommendation in 30 seconds"

---

### Scenario 2: Social Media Ad Analysis
**Goal:** Demonstrate Vision AI capability

**Steps:**
1. Upload Instagram/Facebook casino ad screenshot
2. Vision API analyzes visual elements
3. Detects: "400% BONUS", "BLIK", "Aviator"
4. Result: 0.98 risk score (CRITICAL)
5. REPORTER confirms illegal operation

**Talking Points:**
- "Traditional tools can't analyze images"
- "GPT-4 Vision detects subtle compliance violations"
- "Can process thousands of social media ads daily"

---

### Scenario 3: Mirror Network Mapping
**Goal:** Show GRAPH ANALYZER power

**Steps:**
1. Analyze known illegal domain
2. GRAPH discovers 12 related domains
3. All share: same IP, same resources, same pattern
4. Visualization shows network structure

**Talking Points:**
- "Operators create mirrors to evade blocking"
- "Manual discovery would take weeks"
- "System maps entire network automatically"

---

## Testing Checklist

Before demo, verify:

- [ ] **Proactive Mode** returns results for standard query
- [ ] **Reaction Mode** analyzes a test URL
- [ ] **Risk Score** displays correctly
- [ ] **Agent Cards** show status progression
- [ ] **Network Graph** renders with animation
- [ ] **Report** generates with all fields
- [ ] **Vision analysis** works with uploaded image
- [ ] **Error handling** shows helpful messages

---

## Known Limitations (Be Honest)

1. **EXA API Rate Limits**
   - Free tier: limited searches/day
   - Solution: Mention production would use paid tier

2. **Vision API Accuracy**
   - May miss subtle visual elements
   - Solution: Emphasize it's better than NO automation

3. **Network Discovery**
   - Limited to publicly accessible data
   - Solution: Could integrate with DNS databases

4. **Response Time**
   - 30-60 seconds per full analysis
   - Solution: Fast enough for compliance (vs days manual)

---

## Success Metrics for Demo

**What jury should see:**

✅ **Automation**: 0 human clicks after "Start Scan"  
✅ **Speed**: Results in 30 seconds  
✅ **Accuracy**: High-risk sites correctly identified  
✅ **Visualization**: Impressive network graph  
✅ **Scalability**: Could process thousands daily  
✅ **Innovation**: First EXA + Vision compliance tool  

---

## Post-Demo Q&A Preparation

**Expected Questions:**

**Q: How accurate is the risk scoring?**
A: Based on pattern matching against known illegal operations. In production, would train on KAS historical data for 95%+ accuracy.

**Q: Can operators fake compliance?**
A: Vision AI detects subtle patterns (layout, wording, visual style). Hard to fake consistently across network.

**Q: What about false positives?**
A: System recommends OBSERVE for unclear cases. Final decision always with KAS experts. Tool assists, not replaces.

**Q: Integration with existing KAS systems?**
A: API-first design. Can feed directly into registry. Webhook support for real-time alerts.

**Q: Cost to operate?**
A: EXA + OpenAI APIs. Estimated €0.50-1.00 per full analysis. Fraction of manual review cost.

---

**Remember:** This is a prototype demonstrating feasibility. Production system would include:
- ML model training on Polish data
- Integration with DNS providers
- Real-time social media monitoring
- Automated blocking workflows
- Compliance dashboard for KAS analysts

🚀 **Ready to impress!**
