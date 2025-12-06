import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, Eye, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';

interface LandingHeroProps {
  onEnter: () => void;
}

export function LandingHero({ onEnter }: LandingHeroProps) {
  const [glitchText, setGlitchText] = useState('KAS AI GUARD');

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
      const original = 'KAS AI GUARD';
      let glitched = '';
      
      for (let i = 0; i < original.length; i++) {
        if (Math.random() < 0.1) {
          glitched += chars[Math.floor(Math.random() * chars.length)];
        } else {
          glitched += original[i];
        }
      }
      
      setGlitchText(glitched);
      
      setTimeout(() => {
        setGlitchText('KAS AI GUARD');
      }, 50);
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, #0ea5e9 1px, transparent 1px),
            linear-gradient(to bottom, #0ea5e9 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-flow 20s linear infinite',
        }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl"
        >
          {/* Logo/Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-8 inline-block"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-50" />
              <Shield className="w-24 h-24 text-blue-400 relative z-10" />
            </div>
          </motion.div>

          {/* Title with glitch effect */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-7xl md:text-9xl mb-6 font-mono tracking-tighter"
            style={{
              textShadow: '0 0 30px rgba(59, 130, 246, 0.5)',
            }}
          >
            {glitchText}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-400 mb-4 uppercase tracking-wider"
          >
            System Wieloagentowej Detekcji Anomalii
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-lg text-gray-500 mb-12 max-w-3xl mx-auto"
          >
            Zasilane przez Agentów EXA · OpenAI Vision · OSINT w Czasie Rzeczywistym
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto"
          >
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 backdrop-blur-sm">
              <Zap className="w-8 h-8 text-blue-400 mb-3 mx-auto" />
              <h3 className="uppercase tracking-wider mb-2">Proaktywne Wykrywanie</h3>
              <p className="text-gray-500 text-sm">
                Automatyczne wykrywanie nowych nielegalnych kasyn zanim się rozprzestrzenią
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 backdrop-blur-sm">
              <Eye className="w-8 h-8 text-orange-400 mb-3 mx-auto" />
              <h3 className="uppercase tracking-wider mb-2">Analiza Wizualna</h3>
              <p className="text-gray-500 text-sm">
                AI-analiza reklam hazardowych i podejrzanych zrzutów ekranu
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 backdrop-blur-sm">
              <Shield className="w-8 h-8 text-green-400 mb-3 mx-auto" />
              <h3 className="uppercase tracking-wider mb-2">Integracja z KAS</h3>
              <p className="text-gray-500 text-sm">
                Generowanie raportów zgodności gotowych do wpisu do rejestru
              </p>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, type: 'spring' }}
          >
            <Button
              onClick={onEnter}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-lg px-12 py-6 uppercase tracking-wider"
            >
              <Zap className="w-5 h-5 mr-2" />
              Uruchom System
            </Button>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-16"
          >
            <ChevronDown className="w-8 h-8 text-gray-600 mx-auto animate-bounce" />
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-0 right-0 text-center"
      >
        <p className="text-gray-600 text-sm uppercase tracking-wider">
          Krajowa Administracja Skarbowa · AI-Powered Compliance
        </p>
      </motion.div>

      <style jsx>{`
        @keyframes grid-flow {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(50px);
          }
        }
      `}</style>
    </div>
  );
}