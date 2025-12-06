# KAS AI Guard - Instrukcje Testowania

## Status Implementacji

System KAS AI Guard jest w pełni połączony z prawdziwymi API:
- ✅ **EXA API** - wyszukiwanie i analiza stron
- ✅ **OpenAI GPT-4o** - analiza treści i generowanie raportów  
- ✅ **OpenAI GPT-4o-mini** - szybsze generowanie raportów (REPORTER)
- ✅ **OpenAI Vision (GPT-4o)** - analiza obrazów reklam

## Wymagane Klucze API

System wymaga następujących kluczy API (wszystkie są już skonfigurowane):
- `EXA_API_KEY` ✅ 
- `OPENAI_API_KEY` ✅

## Ostatnie Poprawki (Fix)

### ✅ Naprawione Błędy:
1. **GRAPH ANALYZER** - Dodano automatyczne dodawanie protokołu `https://` do URLs bez protokołu
2. **REPORTER** - Zredukowano rozmiar danych wysyłanych do OpenAI:
   - Używa `gpt-4o-mini` zamiast `gpt-4o` (szybsze i tańsze)
   - Wysyła tylko kluczowe informacje zamiast pełnych danych
   - Limit tokenów: z 472k → ~5k (99% redukcja)

## Testowanie Reaction Mode (Tryb Reakcyjny)

### Test 1: Analiza URL
1. Przejdź do **Reaction Mode**
2. Wpisz URL podejrzanej strony hazardowej, np.:
   - `https://stake.com`
   - `https://www.casino.com`
3. Kliknij **Analyze Threat**
4. System wykona:
   - INSPECTOR: Pobierze treść strony przez EXA i przeanalizuje przez GPT-4o
   - GRAPH ANALYZER: Znajdzie podobne strony
   - REPORTER: Wygeneruje raport KAS

### Test 2: Analiza Screenshota
1. Przejdź do **Reaction Mode**
2. Prześlij screenshot reklamy hazardowej
3. System wykona:
   - ADS HUNTER: Przeanalizuje obraz przez GPT-4o Vision
   - REPORTER: Wygeneruje raport

### Test 3: Kombinacja URL + Screenshot
1. Wpisz URL i prześlij screenshot
2. System uruchomi wszystkie agenty

## Testowanie Proactive Mode (Tryb Proaktywny)

### Test: Autonomiczne Wyszukiwanie
1. Przejdź do **Proactive Mode**
2. Wpisz zapytanie, np.:
   - "Find new casino websites targeting Polish users"
   - "Illegal gambling sites with BLIK payments"
3. Kliknij **Start Scan**
4. System wykona pełny cykl:
   - FINDER: Znajdzie strony przez EXA
   - INSPECTOR: Przeanalizuje pierwszą stronę
   - ADS HUNTER: Znajdzie reklamy
   - GRAPH ANALYZER: Zmapuje sieć mirrorów
   - REPORTER: Wygeneruje raport

## Czego Się Spodziewać

### Rzeczywiste Dane
- Każde uruchomienie generuje **unikalne wyniki** na podstawie prawdziwych API
- Wyniki mogą się różnić w zależności od aktualnych danych w internecie
- Czas analizy: 10-30 sekund (zależnie od liczby agentów)

### Struktura Wyników

**INSPECTOR:**
- `licenseDetected`: Czy wykryto licencję?
- `blikSupport`: Czy obsługuje BLIK?
- `hazardGames`: Lista gier hazardowych
- `targetPL`: Czy celuje w Polskę?
- `riskScore`: 0-1

**ADS HUNTER (Vision):**
- `text`: Tekst z obrazu
- `detectedOperators`: Nazwy operatorów
- `visualElements`: hasBonusText, hasPLNSign, hasBLIK, hasAviator

**GRAPH ANALYZER:**
- `primaryDomain`: Główna domena
- `aliases`: Lista podobnych domen
- `networkRisk`: 0-1

**REPORTER:**
- `recommendation`: ADD_TO_REGISTRY | OBSERVE | LOW_PRIORITY
- `confidence`: 0-1
- `summary`: Podsumowanie po polsku
- `evidence`: Lista dowodów
- `riskFactors`: Czynniki ryzyka

## Debugging

### Sprawdzanie Logów
Wszystkie logi są dostępne w konsoli przeglądarki (F12) i logach Supabase.

Przykładowe logi:
```
[FINDER] Starting web search...
[FINDER] EXA returned 10 results
[INSPECTOR] Analyzing https://...
[INSPECTOR] OpenAI raw response: {...}
[REPORTER] Generating final report...
```

### Typowe Problemy

**Problem: "Missing API keys"**
- Rozwiązanie: Sprawdź czy EXA_API_KEY jest ustawiony w sekretach Supabase

**Problem: "EXA API error"**  
- Rozwiązanie: Sprawdź limit API, URL może być nieprawidłowy

**Problem: "JSON parse error"**
- Rozwiązanie: System używa fallback values - wynik zostanie zwrócony mimo błędu parsowania

## Przykładowe Wyniki

### Reaction Mode - Analiza Stake.com
```json
{
  "inspector": {
    "licenseDetected": true,
    "blikSupport": false,
    "hazardGames": ["Slots", "Crash", "Roulette"],
    "targetPL": false,
    "riskScore": 0.6
  },
  "reporter": {
    "recommendation": "OBSERVE",
    "confidence": 0.75,
    "summary": "Strona posiada licencję ale nie celuje bezpośrednio w polski rynek..."
  }
}
```

### Proactive Mode - Wyszukiwanie
```json
{
  "finder": {
    "data": [
      {
        "url": "https://example-casino.com",
        "risk": 0.8,
        "language": "PL",
        "geoTargeting": "Poland"
      }
    ]
  }
}
```

## Podsumowanie

System jest w pełni funkcjonalny i łączy się z prawdziwymi API. Każdy test generuje **dynamiczne, rzeczywiste wyniki** na podstawie aktualnych danych z internetu.