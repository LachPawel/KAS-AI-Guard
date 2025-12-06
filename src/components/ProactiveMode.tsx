import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Brain, Eye, Network, FileText, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { AgentCard } from './AgentCard';
import { RiskScore } from './RiskScore';
import { GraphVisualizer } from './GraphVisualizer';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface AgentStatus {
  name: string;
  status: 'idle' | 'running' | 'success' | 'error';
  description: string;
  icon: React.ReactNode;
  data?: any;
}

export function ProactiveMode() {
  const [query, setQuery] = useState('Znajdź nowe strony kasyn celujące w polskich użytkowników');
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  const [agents, setAgents] = useState<AgentStatus[]>([
    {
      name: 'FINDER',
      status: 'idle',
      description: 'Automatyczne wykrywanie nowych domen hazardowych',
      icon: <Search className="w-5 h-5 text-blue-400" />,
    },
    {
      name: 'INSPECTOR',
      status: 'idle',
      description: 'Analiza HTML/JS i ekstrakcja metadanych',
      icon: <Brain className="w-5 h-5 text-purple-400" />,
    },
    {
      name: 'ADS HUNTER',
      status: 'idle',
      description: 'Analiza wizualna reklam hazardowych',
      icon: <Eye className="w-5 h-5 text-orange-400" />,
    },
    {
      name: 'GRAPH ANALYZER',
      status: 'idle',
      description: 'Mapowanie sieci mirrorów i aliasów',
      icon: <Network className="w-5 h-5 text-cyan-400" />,
    },
    {
      name: 'REPORTER',
      status: 'idle',
      description: 'Generowanie raportu zgodności KAS',
      icon: <FileText className="w-5 h-5 text-green-400" />,
    },
  ]);

  const runProactiveAnalysis = async () => {
    setIsRunning(true);
    setResults(null);

    // Simulate agent execution sequence
    const agentSequence = ['FINDER', 'INSPECTOR', 'ADS HUNTER', 'GRAPH ANALYZER', 'REPORTER'];
    
    for (const agentName of agentSequence) {
      setAgents((prev) =>
        prev.map((agent) =>
          agent.name === agentName ? { ...agent, status: 'running' } : agent
        )
      );

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setAgents((prev) =>
        prev.map((agent) =>
          agent.name === agentName ? { ...agent, status: 'success' } : agent
        )
      );
    }

    // Call backend API
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-efef8e69/analyze/proactive`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ query }),
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setResults(data.results);
        
        // Update agents with actual data
        setAgents((prev) =>
          prev.map((agent) => {
            const agentKey = agent.name.toLowerCase().replace(' ', '');
            const agentData = data.results[agentKey];
            return agentData
              ? { ...agent, data: agentData.data, status: 'success' }
              : agent;
          })
        );
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Proactive analysis error:', error);
      setAgents((prev) =>
        prev.map((agent) => ({ ...agent, status: 'error' }))
      );
    }

    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl mb-4 font-mono uppercase tracking-tight">
            <span className="text-blue-400">Tryb</span> Proaktywny
          </h1>
          <p className="text-gray-400 text-lg">
            Autonomiczne wykrywanie nielegalnych operacji hazardowych z wykorzystaniem EXA
          </p>
        </motion.div>

        {/* Search Input */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex gap-4">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Wpisz zapytanie wyszukiwania..."
              className="flex-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
              disabled={isRunning}
            />
            <Button
              onClick={runProactiveAnalysis}
              disabled={isRunning}
              className="bg-blue-600 hover:bg-blue-700 px-8"
            >
              {isRunning ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-pulse" />
                  Skanowanie...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Rozpocznij Skan
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Risk Score (if results available) */}
        {results?.reporter?.data && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <RiskScore 
              score={results.reporter.data.confidence || 0.85} 
              label="Ogólny Poziom Zagrożenia"
            />
          </motion.div>
        )}

        {/* Agent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {agents.map((agent, index) => (
            <AgentCard key={agent.name} {...agent} index={index} />
          ))}
        </div>

        {/* Graph Visualizer */}
        {results?.graphAnalyzer?.data && results.graphAnalyzer.data.length > 0 && (
          <div className="mb-8">
            <GraphVisualizer data={results.graphAnalyzer.data} />
          </div>
        )}

        {/* Final Report */}
        {results?.reporter?.data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-lg p-8"
          >
            <h2 className="text-2xl mb-6 font-mono uppercase tracking-wider text-blue-400">
              Raport Zgodności KAS
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-gray-400 uppercase text-sm mb-2">Rekomendacja</h3>
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
                <h3 className="text-gray-400 uppercase text-sm mb-2">Podsumowanie</h3>
                <p className="text-white">{results.reporter.data.summary}</p>
              </div>

              <div>
                <h3 className="text-gray-400 uppercase text-sm mb-2">Dowody</h3>
                <ul className="space-y-2">
                  {(results.reporter.data.evidence || []).map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-gray-400 uppercase text-sm mb-2">Czynniki Ryzyka</h3>
                <div className="flex flex-wrap gap-2">
                  {(results.reporter.data.riskFactors || []).map((factor: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-red-900/20 text-red-400 border border-red-800 rounded-full text-sm font-mono"
                    >
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}