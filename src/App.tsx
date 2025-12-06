import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { LandingHero } from './components/LandingHero';
import { ProactiveMode } from './components/ProactiveMode';
import { ReactionMode } from './components/ReactionMode';
import { Shield, Zap, AlertTriangle } from 'lucide-react';

function App() {
  const [showApp, setShowApp] = useState(false);

  // Apply dark mode to body
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  if (!showApp) {
    return <LandingHero onEnter={() => setShowApp(true)} />;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-white font-mono uppercase tracking-wider">KAS AI Guard</h1>
              <p className="text-gray-500 text-xs uppercase tracking-wider">
                System Wieloagentowej Detekcji
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-xs text-gray-500 uppercase tracking-wider">Status</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400 text-sm font-mono">AKTYWNY</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto p-8">
        <Tabs defaultValue="proactive" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-gray-900 border border-gray-800">
            <TabsTrigger 
              value="proactive"
              className="data-[state=active]:bg-blue-900/50 data-[state=active]:text-blue-400"
            >
              <Zap className="w-4 h-4 mr-2" />
              Tryb Proaktywny
            </TabsTrigger>
            <TabsTrigger 
              value="reaction"
              className="data-[state=active]:bg-orange-900/50 data-[state=active]:text-orange-400"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Tryb Reakcyjny
            </TabsTrigger>
          </TabsList>

          <TabsContent value="proactive" className="mt-8">
            <ProactiveMode />
          </TabsContent>

          <TabsContent value="reaction" className="mt-8">
            <ReactionMode />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-8 py-8 text-center text-gray-600">
          <p className="text-sm uppercase tracking-wider mb-2">
            Zasilane przez EXA Search · OpenAI GPT-4 Vision · Supabase
          </p>
          <p className="text-xs text-gray-700">
            KAS AI Guard © 2024 · Krajowa Administracja Skarbowa
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;