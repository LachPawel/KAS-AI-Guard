# KAS AI Guard - Demo Guide

## 🎯 System Overview

**KAS AI Guard** to zaawansowany system multi-agentowy służący do wykrywania nielegalnych operacji hazardowych w Polsce. System wykorzystuje:

- **EXA Search** - do proaktywnego wyszukiwania nowych stron
- **OpenAI GPT-4** - do analizy treści i generowania raportów  
- **OpenAI Vision** - do analizy wizualnej reklam i screenshotów
- **Supabase** - do przechowywania wyników i danych

---

## 🤖 Agenci Systemu

### 1. **FINDER** 🔍
- **Cel**: Automatyczne wykrywanie nowych domen hazardowych
- **Technologia**: EXA Web Search
- **Output**: Lista nowych stron z oceną ryzyka

### 2. **INSPECTOR** 🧠
- **Cel**: Analiza HTML, JavaScript i metadanych
- **Technologia**: EXA Content API + OpenAI GPT-4
- **Output**: Szczegółowa analiza compliance (licencja, metody płatności, gry)

### 3. **ADS HUNTER** 👁️
- **Cel**: Wykrywanie i analiza reklam hazardowych
- **Technologia**: OpenAI GPT-4 Vision
- **Output**: Analiza wizualna z wykryciem słów kluczowych i elementów

### 4. **GRAPH ANALYZER** 🕸️
- **Cel**: Mapowanie sieci mirrorów i aliasów
- **Technologia**: EXA Find Similar
- **Output**: Graf powiązań między domenami

### 5. **REPORTER** 📄
- **Cel**: Generowanie raportów dla KAS
- **Technologia**: OpenAI GPT-4
- **Output**: Rekomendacja + uzasadnienie + dowody

---

## 📱 Tryby Działania

### TRYB A - Proaktywny (Autonomous Discovery)
**Use Case**: Znalezienie NOWYCH zagrożeń przed ich rozprzestrzenieniem

**Workflow**:
1. Agent FINDER przeszukuje Internet z zapytaniem
2. Agent INSPECTOR analizuje znalezione strony
3. Agent ADS HUNTER szuka powiązanych reklam
4. Agent GRAPH ANALYZER mapuje sieć mirrorów
5. Agent REPORTER generuje raport końcowy

**Demo Flow** (2 min):
```
1. Kliknij "Proactive Mode"
2. Wpisz: "Find new casino websites targeting Polish users"
3. Kliknij "Start Scan"
4. Obserwuj działanie agentów w czasie rzeczywistym
5. Po zakończeniu: przejrzyj Risk Score, Evidence i Recommendation
```

---

### TRYB B - Reakcyjny (Report Investigation)
**Use Case**: Analiza zgłoszenia użytkownika/KAS

**Workflow**:
1. Użytkownik podaje URL i/lub screenshot
2. Agent INSPECTOR analizuje stronę
3. Agent ADS HUNTER analizuje screenshot (Vision)
4. Agent GRAPH ANALYZER szuka mirrorów
5. Agent REPORTER generuje raport

**Demo Flow** (2 min):
```
1. Kliknij "Reaction Mode"
2. Wpisz podejrzany URL (np. "goldbets777.com")
3. OPCJONALNIE: Wgraj screenshot reklamy
4. Kliknij "Analyze Threat"
5. Przejrzyj wyniki: Risk Score, Inspector Analysis, Network Analysis, Report
```

---

## 🎬 Scenariusz Demo dla Jury (WOW Factor)

### Demo 1: Proactive Discovery (90 sekund)

**Narrator**:
> "KAS otrzymuje tysiące zgłoszeń dziennie. Ale co z serwisami, które NIE ZOSTAŁY jeszcze zgłoszone?"

**Akcja**:
1. Otwórz **Proactive Mode**
2. Wpisz: `Find new online casino sites targeting Poland with BLIK payments`
3. **Start Scan**

**Co się dzieje**:
- Agenci uruchamiają się sekwencyjnie (wizualna animacja)
- FINDER znajduje 7 nowych domen
- INSPECTOR wykrywa: brak licencji PL, BLIK support, Aviator/Crash gry
- ADS HUNTER znajduje 4 reklamy targetujące PL
- GRAPH ANALYZER pokazuje sieć 12 mirrorów
- REPORTER generuje: **"RECOMMENDATION: ADD TO REGISTRY"**

**Narrator**:
> "W 30 sekund system znalazł zagrożenia, których człowiek szukałby tygodniami."

---

### Demo 2: Vision Analysis (60 sekund)

**Narrator**:
> "Instagram, Facebook, TikTok - pełne reklam nielegalnych kasyn. KAS nie ma narzędzi do ich analizy."

**Akcja**:
1. Otwórz **Reaction Mode**
2. Wgraj screenshot reklamy (przykład: "BONUS 400% • Aviator • Płać BLIKIEM")
3. **Analyze Threat**

**Co się dzieje**:
- Vision API wykrywa:
  - Tekst: "BONUS 400%", "BLIK", "Aviator"
  - Logo: nieznane kasyno
  - Język: Polski
- Risk Score: **0.98 (CRITICAL)**
- Recommendation: **"ADD TO REGISTRY"**

**Narrator**:
> "AI rozpoznaje nawet subtelne próby ominięcia regulacji."

---

## 🔥 Kluczowe Argumenty dla Jury

### 1. **Real Impact**
- KAS obecnie analizuje zgłoszenia RĘCZNIE
- Ten system redukuje czas z **tygodni do sekund**
- Proaktywne wykrywanie = ochrona przed szkodą

### 2. **Technical Excellence**
- Multi-agent architecture (orchestration)
- EXA dla OSINT
- GPT-4 Vision dla visual intelligence
- Real-time processing

### 3. **Scalability**
- Może skanować tysiące stron dziennie
- Automatyczna aktualizacja rejestru
- Integracja z istniejącymi systemami KAS

### 4. **Innovation**
- Pierwszy system łączący EXA + Vision + OSINT dla compliance
- Graph analysis mirrorów (black market networks)
- Predykcyjne wykrywanie zagrożeń

---

## 📊 Metryki Success

**Przed systemem**:
- Czas analizy zgłoszenia: 3-5 dni
- Wykrywanie mirrorów: manualne
- Analiza reklam: niemożliwa na skalę

**Po wdrożeniu**:
- Czas analizy: 30 sekund
- Automatyczne mapowanie sieci
- Tysiące reklam dziennie

---

## 🛠️ Tech Stack

**Frontend**:
- React + TypeScript
- Motion (animations)
- Tailwind CSS + ShadCN UI
- Custom WebGL visuals

**Backend**:
- Supabase Edge Functions (Deno + Hono)
- Supabase KV Store
- Multi-agent orchestration

**AI/ML**:
- EXA Search API (web discovery)
- EXA Content API (HTML extraction)
- EXA Find Similar (network mapping)
- OpenAI GPT-4 (analysis + reports)
- OpenAI GPT-4 Vision (ad analysis)

---

## 🎯 Key Differentiators

1. **EXA Integration**: Pierwszy system używający EXA do compliance
2. **Vision Analysis**: Automatyczna analiza reklam wizualnych
3. **Network Mapping**: Wykrywanie powiązanych mirrorów
4. **Proactive Mode**: Nie czeka na zgłoszenia - ZNAJDUJE zagrożenia
5. **Production Ready**: Gotowy do wdrożenia w KAS

---

## 💡 Next Steps (dla KAS)

1. **Integracja z oficjalnym rejestrem domen zakazanych**
2. **Automatyczne blokowanie wykrytych stron**
3. **Dashboard dla analityków KAS**
4. **API dla partnerów (Google Ads, Meta, TikTok)**
5. **ML model training na polskich danych**

---

## 🚀 Quick Start

1. Ustaw zmienne środowiskowe:
   - `EXA_API_KEY` - twój klucz API EXA
   - `OPENAI_API_KEY` - już skonfigurowany
   
2. Uruchom aplikację

3. Wybierz tryb:
   - **Proactive** - autonomiczne skanowanie
   - **Reaction** - analiza zgłoszenia

4. Czekaj na wyniki!

---

## 📞 Contact & Support

**Projekt**: KAS AI Guard  
**Technologia**: EXA Agents + OpenAI Vision  
**Hackathon**: EXA Challenge 2024  

**Motto**: *"Znajdź zagrożenia, zanim znajdą użytkowników."*

---

## ⚡ Pro Tips for Demo

1. **Przygotuj przykładowe screenshoty** reklam z Pinterest/Instagram
2. **Użyj prawdziwych domen** z rejestru KAS dla porównania
3. **Pokaż risk score wizualnie** - publiczność to kocha
4. **Podkreśl network graph** - pokazuje skalę problemu
5. **Końcowy slajd**: "Od zgłoszenia do blokady w 30 sekund"

🎬 **Break a leg!**
