import { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, ExternalLink, Image, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { RiskScore } from './RiskScore';
import { GraphVisualizer } from './GraphVisualizer';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function ReactionMode() {
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [screenshot, setScreenshot] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!url && !screenshot) {
      alert('Proszę podać URL lub przesłać zrzut ekranu');
      return;
    }

    setIsAnalyzing(true);
    setResults(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-efef8e69/analyze/reaction`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ url, screenshot, description }),
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setResults(data.results);
      } else {
        throw new Error(data.error || 'Analiza nie powiodła się');
      }
    } catch (error) {
      console.error('Reaction analysis error:', error);
      alert('Analiza nie powiodła się: ' + error.message);
    }

    setIsAnalyzing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl mb-4 font-mono uppercase tracking-tight">
            <span className="text-orange-400">Tryb</span> Reakcyjny
          </h1>
          <p className="text-gray-400 text-lg">
            Analizuj zgłoszone strony hazardowe i reklamy
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/50 border border-gray-700 rounded-lg p-8 mb-8 backdrop-blur-sm"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-gray-400 uppercase text-sm mb-2 tracking-wider">
                Podejrzany URL
              </label>
              <div className="flex gap-2">
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example-casino.com"
                  className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  disabled={isAnalyzing}
                />
                <Button
                  variant="outline"
                  className="border-gray-700 hover:bg-gray-800"
                  disabled={!url}
                  onClick={() => window.open(url, '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 uppercase text-sm mb-2 tracking-wider">
                Zrzut Ekranu / Reklama
              </label>
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-gray-600 transition-colors">
                {screenshot ? (
                  <div className="relative">
                    <img
                      src={screenshot}
                      alt="Screenshot"
                      className="max-h-64 mx-auto rounded border border-gray-700"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 border-gray-700"
                      onClick={() => setScreenshot('')}
                    >
                      Usuń
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isAnalyzing}
                    />
                    <Image className="w-12 h-12 mx-auto text-gray-600 mb-3" />
                    <p className="text-gray-500">
                      Kliknij aby przesłać lub przeciągnij i upuść
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      PNG, JPG do 10MB
                    </p>
                  </label>
                )}
              </div>
            </div>

            <div>
              <label className="block text-gray-400 uppercase text-sm mb-2 tracking-wider">
                Opis (Opcjonalnie)
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Dodatkowy kontekst dotyczący zgłoszenia..."
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 min-h-[100px]"
                disabled={isAnalyzing}
              />
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || (!url && !screenshot)}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              {isAnalyzing ? (
                <>
                  <Upload className="w-4 h-4 mr-2 animate-pulse" />
                  Analizowanie...
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Analizuj Zagrożenie
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Results */}
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Risk Score */}
            {results.inspector?.data && (
              <RiskScore 
                score={results.inspector.data.riskScore || 0.5} 
                label="Ocena Zagrożenia"
              />
            )}

            {/* Finder Results - NEW! */}
            {results.finder?.data && results.finder.data.length > 0 && (
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 backdrop-blur-sm">
                <h3 className="text-xl mb-4 font-mono uppercase text-blue-400">
                  Wyniki Wyszukiwania EXA
                </h3>
                <div className="space-y-3">
                  {results.finder.data.slice(0, 3).map((finding: any, i: number) => (
                    <div key={i} className="bg-gray-800/50 p-4 rounded border border-gray-700">
                      <div className="flex items-start justify-between mb-2">
                        <a 
                          href={finding.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline font-mono text-sm flex-1"
                        >
                          {finding.url}
                        </a>
                        <span className={`ml-2 px-2 py-1 rounded text-xs font-mono ${
                          finding.risk > 0.7 ? 'bg-red-900/30 text-red-400' : 
                          finding.risk > 0.4 ? 'bg-yellow-900/30 text-yellow-400' :
                          'bg-green-900/30 text-green-400'
                        }`}>
                          Ryzyko: {Math.round(finding.risk * 100)}%
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{finding.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                          {finding.language}
                        </span>
                        {finding.geoTargeting && (
                          <span className="px-2 py-1 bg-purple-900/30 text-purple-400 rounded text-xs">
                            🎯 {finding.geoTargeting}
                          </span>
                        )}
                        {finding.currency && finding.currency.map((curr: string, j: number) => (
                          <span key={j} className="px-2 py-1 bg-green-900/30 text-green-400 rounded text-xs">
                            💰 {curr}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inspector Results */}
            {results.inspector?.data && (
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 backdrop-blur-sm">
                <h3 className="text-xl mb-4 font-mono uppercase text-purple-400">
                  Analiza Inspector
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Wykryto Licencję:</span>
                      <span className={results.inspector.data.licenseDetected ? 'text-green-400' : 'text-red-400'}>
                        {results.inspector.data.licenseDetected ? 'Tak' : 'Nie'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Obsługa BLIK:</span>
                      <span className={results.inspector.data.blikSupport ? 'text-red-400' : 'text-green-400'}>
                        {results.inspector.data.blikSupport ? 'Tak ⚠️' : 'Nie'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Celuje w Polskę:</span>
                      <span className={results.inspector.data.targetPL ? 'text-red-400' : 'text-gray-400'}>
                        {results.inspector.data.targetPL ? 'Tak' : 'Nie'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400 block mb-1">Metody Płatności:</span>
                      <div className="flex flex-wrap gap-1">
                        {(results.inspector.data.paymentMethods || []).map((method: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs">
                            {method}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-400 block mb-1">Gry Hazardowe:</span>
                      <div className="flex flex-wrap gap-1">
                        {(results.inspector.data.hazardGames || []).map((game: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-red-900/20 text-red-400 rounded text-xs">
                            {game}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Graph Analyzer Results */}
            {results.graphAnalyzer?.data && results.graphAnalyzer.data.length > 0 && (
              <>
                <GraphVisualizer data={results.graphAnalyzer.data} />
                
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 backdrop-blur-sm">
                  <h3 className="text-xl mb-4 font-mono uppercase text-cyan-400">
                    Analiza Sieci
                  </h3>
                  
                  {results.graphAnalyzer.data.map((graph: any, i: number) => (
                    <div key={i} className="mb-4 last:mb-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-mono">{graph.primaryDomain}</span>
                        <span className={`px-2 py-1 rounded text-xs font-mono ${
                          graph.networkRisk > 0.7 ? 'bg-red-900/30 text-red-400' : 'bg-yellow-900/30 text-yellow-400'
                        }`}>
                          Ryzyko: {Math.round(graph.networkRisk * 100)}%
                        </span>
                      </div>
                      
                      {graph.aliases && graph.aliases.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {graph.aliases.map((alias: string, j: number) => (
                            <span key={j} className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs">
                              {alias}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Final Report */}
            {results.reporter?.data && (
              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-lg p-8">
                <h3 className="text-2xl mb-6 font-mono uppercase text-green-400">
                  Raport KAS
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <span className="text-gray-400 uppercase text-sm block mb-2">Rekomendacja</span>
                    <div className={`inline-block px-4 py-2 rounded-lg font-mono ${
                      results.reporter.data.recommendation === 'ADD_TO_REGISTRY'
                        ? 'bg-red-900/30 text-red-400 border border-red-700'
                        : results.reporter.data.recommendation === 'OBSERVE'
                        ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-700'
                        : 'bg-green-900/30 text-green-400 border border-green-700'
                    }`}>
                      {results.reporter.data.recommendation}
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-400 uppercase text-sm block mb-2">Podsumowanie</span>
                    <p className="text-white">{results.reporter.data.summary}</p>
                  </div>

                  <div>
                    <span className="text-gray-400 uppercase text-sm block mb-2">Dowody</span>
                    <ul className="space-y-2">
                      {(results.reporter.data.evidence || []).map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-orange-400 mt-1">•</span>
                          <span className="text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}