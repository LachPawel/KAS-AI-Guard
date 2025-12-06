import { motion } from 'motion/react';
import { Activity, CheckCircle, XCircle, Loader } from 'lucide-react';

interface AgentCardProps {
  name: string;
  status: 'idle' | 'running' | 'success' | 'error';
  description: string;
  icon: React.ReactNode;
  data?: any;
  index: number;
}

export function AgentCard({ name, status, description, icon, data, index }: AgentCardProps) {
  const statusColors = {
    idle: 'bg-gray-800/50 border-gray-700',
    running: 'bg-blue-900/30 border-blue-500/50',
    success: 'bg-green-900/30 border-green-500/50',
    error: 'bg-red-900/30 border-red-500/50',
  };

  const statusIcons = {
    idle: null,
    running: <Loader className="w-4 h-4 animate-spin text-blue-400" />,
    success: <CheckCircle className="w-4 h-4 text-green-400" />,
    error: <XCircle className="w-4 h-4 text-red-400" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`rounded-lg border p-6 ${statusColors[status]} backdrop-blur-sm transition-all duration-300`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/10">
            {icon}
          </div>
          <div>
            <h3 className="text-white font-mono uppercase tracking-wider">{name}</h3>
            <p className="text-gray-400 text-sm mt-1">{description}</p>
          </div>
        </div>
        {statusIcons[status]}
      </div>

      {status === 'running' && (
        <div className="mt-4">
          <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>
      )}

      {data && status === 'success' && (
        <div className="mt-4 p-3 bg-black/30 rounded border border-gray-700">
          <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
            {JSON.stringify(data, null, 2).substring(0, 200)}...
          </pre>
        </div>
      )}
    </motion.div>
  );
}
