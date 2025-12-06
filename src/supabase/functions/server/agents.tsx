// KAS AI Guard - Multi-Agent System for Gambling Site Detection
// Uses EXA API for web search and PLLuM (Polish AI) for analysis
// Powered by CYFRAGOVPL/pllum-12b-nc-chat-250715 - Suwerenne AI dla Administracji

import { callAI, callVisionAI } from './pllum-client.tsx';

interface AgentResult {
  agentName: string;
  status: 'success' | 'error' | 'running';
  data: any;
  timestamp: string;
}

interface FinderResult {
  url: string;
  language: string;
  currency: string[];
  bonuses: string[];
  risk: number;
  aliases: string[];
  description: string;
  geoTargeting: string;
}

interface InspectorResult {
  licenseDetected: boolean;
  paymentMethods: string[];
  blikSupport: boolean;
  hazardGames: string[];
  targetPL: boolean;
  riskScore: number;
  htmlAnalysis: {
    hasLicenseFooter: boolean;
    hasPLNCurrency: boolean;
    aggressiveBonuses: boolean;
    mirrorRedirects: string[];
  };
}

interface AdsHunterResult {
  adScreenshot?: string;
  text: string;
  detectedOperators: string[];
  riskScore: number;
  keywords: string[];
  visualElements: {
    hasBonusText: boolean;
    hasPLNSign: boolean;
    hasBLIK: boolean;
    hasAviator: boolean;
  };
}

interface GraphAnalyzerResult {
  primaryDomain: string;
  aliases: string[];
  ipAddress: string;
  hosting: string;
  relatedDomains: string[];
  commonResources: string[];
  networkRisk: number;
}

interface ReportResult {
  recommendation: 'ADD_TO_REGISTRY' | 'OBSERVE' | 'LOW_PRIORITY' | 'LEGAL';
  confidence: number;
  summary: string;
  evidence: string[];
  riskFactors: string[];
  legalStatus: string;
}

interface ComplianceResult {
  allowedCategories: string[];
  prohibitedCategories: string[];
  lastUpdate: string;
  hasPolishLicense: boolean;
  criticalFindings: string[];
  complianceScore: number;
  regulationsSummary: string;
}

// AGENT 1: FINDER - Discovers new gambling sites
export async function runFinderAgent(
  query: string,
  exaApiKey: string
): Promise<AgentResult> {
  console.log('[FINDER] Starting web search for gambling sites...');
  
  try {
    // EXA Search API call
    const searchQuery = query || 'Find new online casino websites targeting Polish users, created in the last 60 days';
    console.log('[FINDER] Search query:', searchQuery);
    
    const exaResponse = await fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': exaApiKey,
      },
      body: JSON.stringify({
        query: searchQuery,
        num_results: 10,
        use_autoprompt: true,
        type: 'neural',
        contents: {
          text: true,
        },
      }),
    });

    if (!exaResponse.ok) {
      const errorText = await exaResponse.text();
      console.error('[FINDER] EXA API error:', errorText);
      throw new Error(`EXA API error: ${exaResponse.status} - ${errorText}`);
    }

    const exaData = await exaResponse.json();
    console.log('[FINDER] EXA returned', exaData.results?.length || 0, 'results');
    
    if (!exaData.results || exaData.results.length === 0) {
      console.warn('[FINDER] No results found from EXA');
      return {
        agentName: 'FINDER',
        status: 'success',
        data: [],
        timestamp: new Date().toISOString(),
      };
    }
    
    // Process results
    const findings: FinderResult[] = (exaData.results || []).map((result: any) => {
      const text = result.text || '';
      const url = result.url || '';
      
      // Detect Polish targeting
      const targetsPL = /poland|polish|polska|polski|PLN|BLIK/i.test(text);
      
      // Extract bonuses
      const bonusMatches = text.match(/bonus\s+\d+%/gi) || [];
      
      // Calculate risk
      let risk = 0;
      if (targetsPL) risk += 0.3;
      if (bonusMatches.length > 0) risk += 0.2;
      if (/aviator|crash|mines/i.test(text)) risk += 0.3;
      if (/no.?kyc|instant.?withdrawal/i.test(text)) risk += 0.2;
      
      return {
        url,
        language: targetsPL ? 'PL' : 'EN',
        currency: text.match(/PLN|EUR|USD/gi) || ['EUR'],
        bonuses: bonusMatches,
        risk: Math.min(risk, 1),
        aliases: [],
        description: result.title || 'No description',
        geoTargeting: targetsPL ? 'Poland' : 'Unknown',
      };
    });

    console.log('[FINDER] Processed', findings.length, 'findings with avg risk:', 
      (findings.reduce((sum, f) => sum + f.risk, 0) / findings.length).toFixed(2));

    return {
      agentName: 'FINDER',
      status: 'success',
      data: findings,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[FINDER] Error:', error);
    return {
      agentName: 'FINDER',
      status: 'error',
      data: { error: error.message },
      timestamp: new Date().toISOString(),
    };
  }
}

// AGENT 2: INSPECTOR - Analyzes HTML, JS, metadata using PLLuM
export async function runInspectorAgent(
  url: string,
  exaApiKey: string,
  openaiApiKey: string
): Promise<AgentResult> {
  console.log(`[INSPECTOR] Analyzing ${url} with PLLuM (Polish AI)...`);
  
  try {
    // Use EXA to get page content
    const exaResponse = await fetch('https://api.exa.ai/contents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': exaApiKey,
      },
      body: JSON.stringify({
        ids: [url],
        text: true,
      }),
    });

    if (!exaResponse.ok) {
      const errorText = await exaResponse.text();
      console.error('[INSPECTOR] EXA API error response:', errorText);
      throw new Error(`EXA API error: ${exaResponse.status} - ${errorText}`);
    }

    const exaData = await exaResponse.json();
    console.log('[INSPECTOR] EXA response:', JSON.stringify(exaData).substring(0, 500));
    const pageContent = exaData.results?.[0]?.text || '';
    
    if (!pageContent) {
      console.warn('[INSPECTOR] No content received from EXA, using URL analysis only');
    }
    
    // Use PLLuM (Polish AI) to analyze content
    const content = await callAI(
      [
        {
          role: 'system',
          content: `Jesteś starszym inspektorem Krajowej Administracji Skarbowej specjalizującym się w wykrywaniu nielegalnych kasyn online.

KRYTYCZNE INSTRUKCJE - BĄDŹ NIEZWYKLE DOKŁADNY:

1. LICENCJA: Sprawdź czy strona posiada polską licencję Ministra Finansów RP.
   - Licencje Malta (MGA), Curacao, Cypr, UK są w Polsce NIELEGALNE
   - Szukaj w stopce: "Licencja MF", "zezwolenie nr", "regulated by"
   
2. PŁATNOŚCI BLIK: To kluczowy dowód kierowania oferty do Polaków
   - Szukaj słów: "BLIK", "szybki przelew", "przelew natychmiastowy"
   - Jeśli znajdziesz BLIK - to nielegalny operator celujący w Polaków
   
3. GRY HAZARDOWE: Sprawdź kategorie gier
   - Nielegalne: Kasyno, Sloty, Aviator, Crash, Mines, Plinko, Ruletka
   - Legalne (z licencją): Zakłady sportowe, Esport
   
4. JĘZYK I WALUTA: 
   - Strona po polsku + PLN = celowanie w polski rynek
   - Domena .pl często oznacza lokalnego operatora

5. RYZYKO (riskScore):
   - 0.9-1.0: Wyraźnie nielegalny (BLIK + brak licencji PL + kasyno)
   - 0.6-0.8: Podejrzany (celuje w Polskę, brak licencji)
   - 0.3-0.5: Do obserwacji
   - 0.0-0.2: Prawdopodobnie legalny (licencja PL + BLIK)

Zwróć TYLKO poprawny JSON (bez markdown):
{
  "licenseDetected": boolean,
  "paymentMethods": string[],
  "blikSupport": boolean,
  "hazardGames": string[],
  "targetPL": boolean,
  "riskScore": number
}`
        },
        {
          role: 'user',
          content: `Przeanalizuj dokładnie tę stronę hazardową:

URL: ${url}

Treść strony:
${pageContent.substring(0, 6000) || 'Brak treści - analizuj tylko URL'}`
        }
      ],
      { temperature: 0.1, maxTokens: 1500 }
    );

    let analysis;
    try {
      analysis = JSON.parse(content);
    } catch (parseError) {
      console.error('[INSPECTOR] JSON parse error:', parseError);
      console.error('[INSPECTOR] Problematic content:', content);
      // Return default values if parsing fails
      analysis = {
        licenseDetected: false,
        paymentMethods: ['Unknown'],
        blikSupport: /blik/i.test(pageContent),
        hazardGames: [],
        targetPL: /poland|polish|polska|pln|\.pl/i.test(url + pageContent),
        riskScore: 0.5,
      };
    }

    const result: InspectorResult = {
      ...analysis,
      htmlAnalysis: {
        hasLicenseFooter: /license|licencja|regulated/i.test(pageContent),
        hasPLNCurrency: /PLN|zł/i.test(pageContent + url),
        aggressiveBonuses: /bonus\s+[234]\d\d%/i.test(pageContent),
        mirrorRedirects: [],
      },
    };

    console.log('[INSPECTOR] Final result:', JSON.stringify(result));

    return {
      agentName: 'INSPECTOR',
      status: 'success',
      data: result,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[INSPECTOR] Error:', error);
    return {
      agentName: 'INSPECTOR',
      status: 'error',
      data: { error: error.message },
      timestamp: new Date().toISOString(),
    };
  }
}

// AGENT 3: ADS HUNTER - Finds and analyzes gambling ads using Vision
export async function runAdsHunterAgent(
  query: string,
  exaApiKey: string,
  openaiApiKey: string,
  imageUrl?: string
): Promise<AgentResult> {
  console.log('[ADS HUNTER] Searching for gambling ads...');
  
  try {
    // If image provided, use Vision API
    if (imageUrl) {
      console.log('[ADS HUNTER] Using Vision API for image analysis');
      const visionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `You are an expert at analyzing gambling advertisements for KAS (Krajowa Administracja Skarbowa).
                  
Analyze this gambling advertisement image and return ONLY a valid JSON object with:
- text: string (all text visible in the image)
- detectedOperators: string[] (gambling operator names/brands found)
- riskScore: number (0-1, higher = more suspicious)
- keywords: string[] (key gambling-related terms found)
- visualElements: {
    hasBonusText: boolean (are there bonus offers like "200% bonus"?),
    hasPLNSign: boolean (is PLN currency mentioned?),
    hasBLIK: boolean (is BLIK payment mentioned?),
    hasAviator: boolean (is Aviator game shown?)
  }

Return ONLY valid JSON, no markdown, no explanation.`
                },
                {
                  type: 'image_url',
                  image_url: { url: imageUrl }
                }
              ]
            }
          ],
          max_tokens: 1000,
          temperature: 0.3,
        }),
      });

      if (!visionResponse.ok) {
        const errorText = await visionResponse.text();
        console.error('[ADS HUNTER] Vision API error:', errorText);
        throw new Error(`Vision API error: ${visionResponse.status} - ${errorText}`);
      }

      const visionData = await visionResponse.json();
      console.log('[ADS HUNTER] Vision API raw response:', visionData.choices[0].message.content);
      
      let analysis;
      try {
        let content = visionData.choices[0].message.content.trim();
        if (content.startsWith('```json')) {
          content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        } else if (content.startsWith('```')) {
          content = content.replace(/```\n?/g, '');
        }
        analysis = JSON.parse(content);
      } catch (parseError) {
        console.error('[ADS HUNTER] JSON parse error:', parseError);
        analysis = {
          text: 'Unable to parse image content',
          detectedOperators: [],
          riskScore: 0.5,
          keywords: [],
          visualElements: {
            hasBonusText: false,
            hasPLNSign: false,
            hasBLIK: false,
            hasAviator: false,
          },
        };
      }

      return {
        agentName: 'ADS_HUNTER',
        status: 'success',
        data: {
          adScreenshot: imageUrl,
          ...analysis,
        },
        timestamp: new Date().toISOString(),
      };
    }
    
    // Otherwise use EXA to find ads
    console.log('[ADS HUNTER] Using EXA to search for ads');
    const searchQuery = query || 'online casino advertisements targeting Polish users with bonus offers';
    
    const exaResponse = await fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': exaApiKey,
      },
      body: JSON.stringify({
        query: searchQuery,
        num_results: 5,
        use_autoprompt: true,
      }),
    });

    if (!exaResponse.ok) {
      const errorText = await exaResponse.text();
      console.error('[ADS HUNTER] EXA API error:', errorText);
      throw new Error(`EXA API error: ${exaResponse.status}`);
    }

    const exaData = await exaResponse.json();
    console.log('[ADS HUNTER] EXA found', exaData.results?.length || 0, 'results');
    
    const ads = (exaData.results || []).map((result: any) => ({
      text: result.title || '',
      url: result.url || '',
      detectedOperators: [],
      riskScore: 0.7,
      keywords: [],
      visualElements: {
        hasBonusText: /bonus/i.test(result.title || ''),
        hasPLNSign: /PLN/i.test(result.title || ''),
        hasBLIK: /BLIK/i.test(result.title || ''),
        hasAviator: /aviator/i.test(result.title || ''),
      },
    }));

    return {
      agentName: 'ADS_HUNTER',
      status: 'success',
      data: ads,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[ADS HUNTER] Error:', error);
    return {
      agentName: 'ADS_HUNTER',
      status: 'error',
      data: { error: error.message },
      timestamp: new Date().toISOString(),
    };
  }
}

// AGENT 4: GRAPH ANALYZER - Maps mirror networks
export async function runGraphAnalyzerAgent(
  urls: string[],
  exaApiKey: string
): Promise<AgentResult> {
  console.log('[GRAPH ANALYZER] Mapping domain network...');
  console.log('[GRAPH ANALYZER] Analyzing', urls.length, 'URLs');
  
  try {
    const graph: GraphAnalyzerResult[] = [];
    
    for (const url of urls.slice(0, 3)) { // Limit to 3 to avoid rate limits
      try {
        // Ensure URL has protocol
        let fullUrl = url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          fullUrl = `https://${url}`;
          console.log('[GRAPH ANALYZER] Added protocol to URL:', fullUrl);
        }
        
        console.log('[GRAPH ANALYZER] Finding similar sites for:', fullUrl);
        
        // Find similar domains using EXA
        const exaResponse = await fetch('https://api.exa.ai/findSimilar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': exaApiKey,
          },
          body: JSON.stringify({
            url: fullUrl,
            num_results: 5,
          }),
        });

        if (!exaResponse.ok) {
          const errorText = await exaResponse.text();
          console.error('[GRAPH ANALYZER] EXA findSimilar error:', errorText);
          // Continue with next URL instead of failing completely
          continue;
        }

        const exaData = await exaResponse.json();
        console.log('[GRAPH ANALYZER] Found', exaData.results?.length || 0, 'similar sites');
        
        const domain = new URL(fullUrl).hostname;
        const relatedDomains = (exaData.results || []).map((r: any) => {
          try {
            return new URL(r.url).hostname;
          } catch {
            return '';
          }
        }).filter(Boolean);

        graph.push({
          primaryDomain: domain,
          aliases: relatedDomains,
          ipAddress: '0.0.0.0', // Would need actual DNS lookup
          hosting: 'Unknown',
          relatedDomains,
          commonResources: [],
          networkRisk: relatedDomains.length > 2 ? 0.8 : 0.4,
        });
      } catch (urlError) {
        console.error('[GRAPH ANALYZER] Error processing URL', url, ':', urlError);
        // Continue with next URL
      }
    }

    console.log('[GRAPH ANALYZER] Successfully mapped', graph.length, 'networks');

    return {
      agentName: 'GRAPH_ANALYZER',
      status: 'success',
      data: graph,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[GRAPH ANALYZER] Error:', error);
    return {
      agentName: 'GRAPH_ANALYZER',
      status: 'error',
      data: { error: error.message },
      timestamp: new Date().toISOString(),
    };
  }
}

// AGENT 5: REPORTER - Generates final report using PLLuM
export async function runReporterAgent(
  allResults: {
    finder?: AgentResult;
    inspector?: AgentResult;
    adsHunter?: AgentResult;
    graphAnalyzer?: AgentResult;
  },
  openaiApiKey: string
): Promise<AgentResult> {
  console.log('[REPORTER] Generating final report with PLLuM (Polish AI)...');
  
  try {
    // Extract only key information to avoid token limits
    const summarizedResults = {
      inspector: allResults.inspector?.data ? {
        licenseDetected: allResults.inspector.data.licenseDetected,
        blikSupport: allResults.inspector.data.blikSupport,
        targetPL: allResults.inspector.data.targetPL,
        riskScore: allResults.inspector.data.riskScore,
        paymentMethods: allResults.inspector.data.paymentMethods?.slice(0, 5),
        hazardGames: allResults.inspector.data.hazardGames?.slice(0, 5),
      } : null,
      finder: allResults.finder?.data ? {
        sitesFound: Array.isArray(allResults.finder.data) ? allResults.finder.data.length : 0,
        topRisk: Array.isArray(allResults.finder.data) && allResults.finder.data[0] ? {
          url: allResults.finder.data[0].url,
          risk: allResults.finder.data[0].risk,
          language: allResults.finder.data[0].language,
        } : null,
      } : null,
      adsHunter: allResults.adsHunter?.data ? {
        riskScore: Array.isArray(allResults.adsHunter.data) 
          ? allResults.adsHunter.data[0]?.riskScore 
          : allResults.adsHunter.data.riskScore,
        visualElements: Array.isArray(allResults.adsHunter.data)
          ? allResults.adsHunter.data[0]?.visualElements
          : allResults.adsHunter.data.visualElements,
        detectedOperators: Array.isArray(allResults.adsHunter.data)
          ? allResults.adsHunter.data[0]?.detectedOperators?.slice(0, 3)
          : allResults.adsHunter.data.detectedOperators?.slice(0, 3),
      } : null,
      graphAnalyzer: allResults.graphAnalyzer?.data ? {
        networksFound: Array.isArray(allResults.graphAnalyzer.data) ? allResults.graphAnalyzer.data.length : 0,
        highestRisk: Array.isArray(allResults.graphAnalyzer.data) && allResults.graphAnalyzer.data[0] ? {
          domain: allResults.graphAnalyzer.data[0].primaryDomain,
          aliasCount: allResults.graphAnalyzer.data[0].aliases?.length || 0,
          networkRisk: allResults.graphAnalyzer.data[0].networkRisk,
        } : null,
      } : null,
    };

    console.log('[REPORTER] Summarized data size:', JSON.stringify(summarizedResults).length, 'chars');

    // Use PLLuM (Polish AI) to generate report
    const content = await callAI(
      [
        {
          role: 'system',
          content: `Jesteś starszym oficerem compliance Krajowej Administracji Skarbowa przygotowującym oficjalny raport z analizy strony hazardowej.

ZADANIE: Na podstawie wyników analizy agentów wygeneruj raport w formacie JSON.

KRYTERIA DECYZYJNE:
- ADD_TO_REGISTRY: BLIK + brak polskiej licencji + gry kasynowe (riskScore > 0.7)
- OBSERVE: Podejrzany (celuje w PL, brak licencji, riskScore 0.5-0.7)
- LOW_PRIORITY: Niskie ryzyko (riskScore < 0.5)
- LEGAL: Posiada polską licencję MF + legalna działalność

STRUKTURA RAPORTU:
{
  "recommendation": "ADD_TO_REGISTRY" | "OBSERVE" | "LOW_PRIORITY" | "LEGAL",
  "confidence": 0.0-1.0,
  "summary": "Zwięzła analiza 2-3 zdania PO POLSKU",
  "evidence": ["Dowód 1", "Dowód 2", "Dowód 3"] // PO POLSKU
  "riskFactors": ["BLIK payment", "No license", "Targets Poland"],
  "legalStatus": "Ocena zgodności z prawem PO POLSKU"
}

WAŻNE: Jeśli operator ma polską licencję I BLIK, to jest LEGALNY (nie mylić z nielegalnym!).
Zwróć TYLKO poprawny JSON bez markdown.`
        },
        {
          role: 'user',
          content: `Przeanalizuj wyniki agentów i wygeneruj raport:

${JSON.stringify(summarizedResults, null, 2)}`
        }
      ],
      { temperature: 0.3, maxTokens: 1500 }
    );
    
    let report;
    try {
      report = JSON.parse(content);
    } catch (parseError) {
      console.error('[REPORTER] JSON parse error:', parseError);
      console.error('[REPORTER] Problematic content:', content);
      
      // Generate fallback report based on available data
      const inspectorData = allResults.inspector?.data;
      const hasHighRisk = inspectorData?.riskScore > 0.7 || inspectorData?.blikSupport;
      
      report = {
        recommendation: hasHighRisk ? 'ADD_TO_REGISTRY' : 'OBSERVE',
        confidence: 0.7,
        summary: 'Analiza wykryła podejrzaną aktywność hazardową. Wymagane dalsze monitorowanie.',
        evidence: [
          inspectorData?.blikSupport ? 'Wykryto obsługę płatności BLIK' : 'Brak licencji',
          inspectorData?.targetPL ? 'Strona celuje w polskich użytkowników' : 'Nielegalny operator',
        ],
        riskFactors: [
          inspectorData?.blikSupport && 'BLIK payment',
          !inspectorData?.licenseDetected && 'No license',
          inspectorData?.targetPL && 'Targets Poland',
        ].filter(Boolean),
        legalStatus: 'Wymaga weryfikacji przez KAS',
      };
    }

    console.log('[REPORTER] Final report:', JSON.stringify(report));

    return {
      agentName: 'REPORTER',
      status: 'success',
      data: report,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[REPORTER] Error:', error);
    return {
      agentName: 'REPORTER',
      status: 'error',
      data: { 
        error: error.message,
        recommendation: 'OBSERVE',
        confidence: 0.5,
        summary: 'Wystąpił błąd podczas generowania raportu',
        evidence: [],
        riskFactors: [],
        legalStatus: 'Nieznany',
      },
      timestamp: new Date().toISOString(),
    };
  }
}

// AGENT 6: COMPLIANCE_OFFICER - Analyzes regulations using PLLuM (NEW!)
// This is the killer feature - PLLuM understands Polish legal language better than GPT
export async function runComplianceOfficerAgent(
  regulationsText: string,
  url: string
): Promise<AgentResult> {
  console.log('[COMPLIANCE_OFFICER] Analyzing regulations with PLLuM (Polish Legal AI)...');
  
  try {
    // Use PLLuM to analyze regulations - this is where Polish AI shines!
    const content = await callAI(
      [
        {
          role: 'system',
          content: `Jesteś prawnikiem Krajowej Administracji Skarbowej specjalizującym się w analizie regulaminów zakładów wzajemnych i kasyn online.

ZADANIE: Przeanalizuj poniższy regulamin pod kątem zgodności z polskim prawem hazardowym (Ustawa o grach hazardowych).

KLUCZOWE PUNKTY DO SPRAWDZENIA:

1. DOZWOLONE KATEGORIE GIER:
   - Czy regulamin wymienia kategorie gier (Sport, eSport, Zakłady wzajemne)?
   - Czy wymienia nielegalne kategorie (Kasyno, Sloty, Gry losowe)?

2. LICENCJA:
   - Czy regulamin wspomina o polskiej licencji Ministra Finansów?
   - Czy wymienia licencje zagraniczne (MGA, Curacao, UK)?

3. NIEZGODNOŚCI Z POLSKIM PRAWEM:
   - Szukaj zapisów o grach kasynowych, slotach, grach losowych
   - Sprawdź ograniczenia wiekowe (18+ wymagane)
   - Sprawdź politykę odpowiedzialnej gry

4. DATA AKTUALIZACJI:
   - Kiedy ostatnio zaktualizowano regulamin?
   - Czy jest aktualny zgodnie z obecnym prawem?

ZWRÓĆ JSON:
{
  "allowedCategories": ["Sport", "eSport"],
  "prohibitedCategories": ["Kasyno", "Sloty"],
  "lastUpdate": "data lub 'Unknown'",
  "hasPolishLicense": boolean,
  "criticalFindings": ["Naruszenie 1", "Naruszenie 2"],
  "complianceScore": 0.0-1.0,
  "regulationsSummary": "Krótkie podsumowanie PO POLSKU"
}

Gdzie complianceScore:
- 0.0-0.3: KRYTYCZNE NARUSZENIA (kasyno + brak licencji PL)
- 0.4-0.6: PODEJRZANY (brak jasnych informacji o licencji)
- 0.7-0.9: ZGODNY Z PRAWEM (polska licencja + legalne gry)
- 1.0: PEŁNA ZGODNOŚĆ

Zwróć TYLKO poprawny JSON bez markdown.`
        },
        {
          role: 'user',
          content: `Przeanalizuj regulamin strony: ${url}

TEKST REGULAMINU:
${regulationsText.substring(0, 10000)}`
        }
      ],
      { temperature: 0.2, maxTokens: 2000 }
    );

    let compliance;
    try {
      compliance = JSON.parse(content);
    } catch (parseError) {
      console.error('[COMPLIANCE_OFFICER] JSON parse error:', parseError);
      console.error('[COMPLIANCE_OFFICER] Problematic content:', content);
      
      // Fallback analysis
      const hasKasyno = /kasyno|slot|ruletka|blackjack/i.test(regulationsText);
      const hasLicense = /licencja|minister|finans/i.test(regulationsText);
      
      compliance = {
        allowedCategories: hasKasyno ? ['Kasyno', 'Sloty'] : ['Sport'],
        prohibitedCategories: hasKasyno ? ['Kasyno'] : [],
        lastUpdate: 'Unknown',
        hasPolishLicense: hasLicense,
        criticalFindings: hasKasyno ? ['Wykryto gry kasynowe w regulaminie'] : [],
        complianceScore: hasKasyno ? (hasLicense ? 0.4 : 0.2) : 0.8,
        regulationsSummary: 'Automatyczna analiza regulaminu. Wymaga weryfikacji ręcznej.',
      };
    }

    console.log('[COMPLIANCE_OFFICER] Final compliance:', JSON.stringify(compliance));

    return {
      agentName: 'COMPLIANCE_OFFICER',
      status: 'success',
      data: compliance,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[COMPLIANCE_OFFICER] Error:', error);
    return {
      agentName: 'COMPLIANCE_OFFICER',
      status: 'error',
      data: { 
        error: error.message,
        allowedCategories: [],
        prohibitedCategories: [],
        lastUpdate: 'Unknown',
        hasPolishLicense: false,
        criticalFindings: ['Błąd podczas analizy'],
        complianceScore: 0.5,
        regulationsSummary: 'Nie udało się przeanalizować regulaminu',
      },
      timestamp: new Date().toISOString(),
    };
  }
}

// ORCHESTRATOR - Coordinates all agents
export async function orchestrateAgents(
  mode: 'reaction' | 'proactive',
  input: {
    url?: string;
    screenshot?: string;
    query?: string;
  },
  apiKeys: {
    exaApiKey: string;
    openaiApiKey: string;
  }
): Promise<{
  finder?: AgentResult;
  inspector?: AgentResult;
  adsHunter?: AgentResult;
  graphAnalyzer?: AgentResult;
  reporter?: AgentResult;
}> {
  console.log(`[ORCHESTRATOR] Starting ${mode} mode analysis...`);
  
  const results: any = {};

  if (mode === 'proactive') {
    // Proactive mode: Find new sites, then analyze them
    results.finder = await runFinderAgent(input.query || '', apiKeys.exaApiKey);
    
    if (results.finder.status === 'success' && results.finder.data.length > 0) {
      const firstSite = results.finder.data[0];
      
      results.inspector = await runInspectorAgent(
        firstSite.url,
        apiKeys.exaApiKey,
        apiKeys.openaiApiKey
      );
      
      results.adsHunter = await runAdsHunterAgent(
        `ads for ${firstSite.url}`,
        apiKeys.exaApiKey,
        apiKeys.openaiApiKey
      );
      
      const urls = results.finder.data.slice(0, 3).map((s: any) => s.url);
      results.graphAnalyzer = await runGraphAnalyzerAgent(urls, apiKeys.exaApiKey);
    }
  } else {
    // Reaction mode: Analyze specific URL/screenshot
    if (input.url) {
      // First use FINDER to search for information about this URL
      console.log('[ORCHESTRATOR] Running FINDER to verify URL:', input.url);
      const domain = input.url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      results.finder = await runFinderAgent(
        `site:${domain} OR "${domain}" online casino gambling`,
        apiKeys.exaApiKey
      );
      
      // Then run INSPECTOR for detailed analysis
      results.inspector = await runInspectorAgent(
        input.url,
        apiKeys.exaApiKey,
        apiKeys.openaiApiKey
      );
      
      // Run GRAPH ANALYZER to find mirrors
      results.graphAnalyzer = await runGraphAnalyzerAgent(
        [input.url],
        apiKeys.exaApiKey
      );
    }
    
    if (input.screenshot) {
      results.adsHunter = await runAdsHunterAgent(
        '',
        apiKeys.exaApiKey,
        apiKeys.openaiApiKey,
        input.screenshot
      );
    }
  }

  // Generate final report
  results.reporter = await runReporterAgent(results, apiKeys.openaiApiKey);

  return results;
}