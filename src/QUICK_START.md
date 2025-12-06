# 🚀 KAS AI Guard - Quick Start Guide

## ⚡ Setup w 3 krokach

### 1. API Keys
System wymaga dwóch kluczy API:

✅ **OPENAI_API_KEY** - już skonfigurowany  
⚠️ **EXA_API_KEY** - wklej swój klucz w ustawieniach

### 2. Launch App
Po ustawieniu kluczy:
1. Aplikacja automatycznie się uruchomi
2. Zobaczysz **Landing Hero** z animacją
3. Kliknij **"Launch System"**

### 3. Wybierz tryb

#### Option A: Proactive Mode (Autonomiczny)
**Najlepsze do demo!**

```
1. Kliknij tab "Proactive Mode"
2. Użyj domyślnego query LUB wpisz własny:
   - "Find new casino sites targeting Poland with BLIK"
   - "Discover illegal gambling websites with Aviator game"
   - "Search for online casinos offering 300% bonus"
3. Kliknij "Start Scan"
4. Obserwuj działanie 5 agentów (30 sekund)
5. Przejrzyj wyniki:
   - Risk Score
   - Agent Cards
   - Network Graph (WOW!)
   - KAS Report
```

#### Option B: Reaction Mode (Analiza zgłoszenia)
**Dla testowania konkretnych stron**

```
1. Kliknij tab "Reaction Mode"  
2. Wpisz URL podejrzanej strony
3. OPCJONALNIE: Wgraj screenshot reklamy
4. Kliknij "Analyze Threat"
5. Otrzymasz raport compliance
```

---

## 🎬 Demo Flow (2 minuty dla jury)

### Scene 1: Problem Statement (15s)
> "KAS otrzymuje tysiące zgłoszeń nielegalnych kasyn. Czas analizy: 3-5 dni. Brak narzędzi do visual analysis."

### Scene 2: Proactive Mode (60s)
```
1. Otwórz Proactive Mode
2. Query: "Find new casinos targeting Poland with BLIK payments"
3. [START SCAN]
4. Pokaż animację agentów (real-time)
5. Wynik:
   - 7 nowych stron wykrytych
   - Risk Score: 0.97 (CRITICAL)
   - Network Graph: 12 mirrorów
   - Recommendation: ADD_TO_REGISTRY
```

**Narrator:**
> "W 30 sekund znaleźliśmy zagrożenia, których człowiek szukałby tygodniami."

### Scene 3: Vision Analysis (45s)
```
1. Przełącz na Reaction Mode
2. Wgraj przykładowy screenshot reklamy:
   - "BONUS 400% • Aviator • Płać BLIKIEM"
3. [ANALYZE THREAT]
4. GPT-4 Vision wykrywa:
   - Bonus: 400% (ILLEGAL)
   - BLIK support (HIGH RISK)
   - Aviator game (PATTERN)
   - Risk: 0.98
```

**Narrator:**
> "AI rozpoznaje nawet subtelne próby ominięcia regulacji."

---

## 🔥 Key Features to Highlight

### 1. Multi-Agent Architecture
- 5 autonomicznych agentów AI
- Orchestration w czasie rzeczywistym
- Wizualizacja postępu

### 2. EXA Integration
- **FINDER**: EXA Search dla discovery
- **INSPECTOR**: EXA Content dla HTML analysis
- **GRAPH ANALYZER**: EXA Find Similar dla network mapping

### 3. Vision Intelligence
- **ADS HUNTER**: GPT-4 Vision dla reklam
- Wykrywanie tekstu, logo, wzorców
- Social media scanning ready

### 4. Network Mapping
- **GraphVisualizer**: Animated canvas graph
- Real-time particle flow
- Risk indicators

### 5. KAS Integration
- Gotowe raporty compliance
- Rekomendacje: ADD_TO_REGISTRY | OBSERVE | LOW_PRIORITY
- Evidence collection

---

## 📊 Example Queries (Copy-Paste Ready)

### Proactive Mode:
```
Find new casino websites targeting Polish users
Search for gambling sites with BLIK payment support
Discover online casinos offering 300% welcome bonus
Find illegal betting websites using Aviator game
Search for crypto casinos targeting Poland
```

### Reaction Mode URLs:
```
https://stake.com
https://1xbet.com
https://22bet.com
(Przykłady - użyj prawdziwych podejrzanych domen)
```

---

## 🎯 Success Metrics

**Co pokazać jury:**

✅ **Speed**: 30 sekund vs 3-5 dni  
✅ **Automation**: 0 human intervention  
✅ **Scalability**: Tysiące analiz/dzień  
✅ **Vision**: Pierwszy system z AI vision dla compliance  
✅ **Network**: Automatyczne mapowanie mirrorów  
✅ **Impact**: Real problem, real solution  

---

## ⚠️ Troubleshooting

### "Missing EXA_API_KEY"
- Idź do ustawień Supabase Secrets
- Dodaj `EXA_API_KEY` z https://exa.ai

### "Analysis failed"
- Sprawdź console logs
- Verify API keys
- Check network connection

### "No results"
- EXA może nie znaleźć wyników dla bardzo specyficznych queries
- Użyj szerszych zapytań
- Przykład: zamiast "casino in Warsaw", użyj "casino targeting Poland"

---

## 🌟 Pro Tips

1. **Demo Preparation**
   - Miej gotowe 2-3 przykładowe screenshots reklam
   - Przetestuj queries przed demo
   - Pokazuj network graph - to wow factor!

2. **Storytelling**
   - Zacznij od problemu (KAS burden)
   - Pokaż solution (autonomiczny system)
   - Zakończ impact (30s vs dni)

3. **Technical Highlights**
   - Podkreśl EXA integration (unique!)
   - Pokaż Vision analysis (impressive!)
   - Wskaż network mapping (complex!)

---

## 🎓 Architecture Quick Reference

```
Frontend (React + Motion)
    ↓
Supabase Edge Functions (Deno + Hono)
    ↓
Multi-Agent Orchestrator
    ↓
┌─────────┬──────────┬────────────┬──────────┬──────────┐
│ FINDER  │INSPECTOR │ ADS HUNTER │  GRAPH   │ REPORTER │
└─────────┴──────────┴────────────┴──────────┴──────────┘
    ↓          ↓           ↓            ↓          ↓
  EXA      EXA+GPT4    GPT4 Vision    EXA      GPT-4
 Search    Content                 FindSimilar
```

---

## 📞 Support

**Docs:**
- README.md - Pełna dokumentacja
- DEMO_GUIDE.md - Szczegółowy scenariusz demo
- Ten plik - Quick start

**Debug:**
- Console logs w przeglądarce (F12)
- Server logs w Supabase Dashboard
- Network tab dla API calls

---

## ✨ Final Checklist

Przed demo upewnij się że:

- [ ] EXA_API_KEY jest ustawiony
- [ ] OPENAI_API_KEY działa
- [ ] Przetestowałeś Proactive Mode
- [ ] Masz przykładowe screenshots
- [ ] Network graph się wyświetla
- [ ] Znasz key talking points

---

**Powodzenia! 🚀**

*"Znajdź zagrożenia, zanim znajdą użytkowników."*
