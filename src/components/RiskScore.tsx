import { motion } from 'motion/react';
import { AlertTriangle, Shield, AlertOctagon } from 'lucide-react';

interface RiskScoreProps {
  score: number; // 0-1
  label?: string;
}

export function RiskScore({ score, label = 'Risk Score' }: RiskScoreProps) {
  const percentage = Math.round(score * 100);
  
  const getRiskLevel = (score: number) => {
    if (score >= 0.8) return { level: 'CRITICAL', color: 'text-red-500', bg: 'bg-red-500', icon: AlertOctagon };
    if (score >= 0.5) return { level: 'HIGH', color: 'text-orange-500', bg: 'bg-orange-500', icon: AlertTriangle };
    if (score >= 0.3) return { level: 'MEDIUM', color: 'text-yellow-500', bg: 'bg-yellow-500', icon: AlertTriangle };
    return { level: 'LOW', color: 'text-green-500', bg: 'bg-green-500', icon: Shield };
  };

  const risk = getRiskLevel(score);
  const Icon = risk.icon;

  return (
    <div className="bg-black/40 border border-gray-700 rounded-lg p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${risk.color}`} />
          <span className="text-gray-400 uppercase tracking-wider text-sm">{label}</span>
        </div>
        <span className={`${risk.color} uppercase tracking-wider text-sm font-mono`}>
          {risk.level}
        </span>
      </div>

      <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden mb-3">
        <motion.div
          className={`h-full ${risk.bg}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>

      <div className="flex justify-between items-center">
        <span className="text-gray-500 text-sm font-mono">0%</span>
        <span className={`${risk.color} font-mono`}>{percentage}%</span>
        <span className="text-gray-500 text-sm font-mono">100%</span>
      </div>
    </div>
  );
}
