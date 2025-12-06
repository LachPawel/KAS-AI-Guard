import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface Node {
  id: string;
  x: number;
  y: number;
  radius: number;
  isPrimary: boolean;
  risk: number;
}

interface Link {
  source: string;
  target: string;
}

interface GraphVisualizerProps {
  data: {
    primaryDomain: string;
    aliases: string[];
    networkRisk: number;
  }[];
}

export function GraphVisualizer({ data }: GraphVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    const height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Build nodes and links
    const nodes: Node[] = [];
    const links: Link[] = [];
    
    let nodeId = 0;
    
    data.forEach((graph, graphIndex) => {
      // Primary node
      const primaryNode: Node = {
        id: `node-${nodeId++}`,
        x: (width / window.devicePixelRatio) * ((graphIndex + 1) / (data.length + 1)),
        y: height / window.devicePixelRatio / 2,
        radius: 30,
        isPrimary: true,
        risk: graph.networkRisk,
      };
      nodes.push(primaryNode);

      // Alias nodes
      graph.aliases.forEach((alias, aliasIndex) => {
        const angle = (aliasIndex / graph.aliases.length) * Math.PI * 2;
        const distance = 100;
        
        const aliasNode: Node = {
          id: `node-${nodeId++}`,
          x: primaryNode.x + Math.cos(angle) * distance,
          y: primaryNode.y + Math.sin(angle) * distance,
          radius: 15,
          isPrimary: false,
          risk: graph.networkRisk * 0.8,
        };
        
        nodes.push(aliasNode);
        links.push({
          source: primaryNode.id,
          target: aliasNode.id,
        });
      });
    });

    // Animation
    let time = 0;
    
    const animate = () => {
      time += 0.02;
      
      ctx.clearRect(0, 0, width, height);
      
      // Draw links
      links.forEach((link) => {
        const sourceNode = nodes.find((n) => n.id === link.source);
        const targetNode = nodes.find((n) => n.id === link.target);
        
        if (!sourceNode || !targetNode) return;
        
        const pulse = Math.sin(time * 2) * 0.3 + 0.7;
        
        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);
        ctx.strokeStyle = `rgba(59, 130, 246, ${0.3 * pulse})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Animated particles along links
        const particlePos = (time % 1);
        const particleX = sourceNode.x + (targetNode.x - sourceNode.x) * particlePos;
        const particleY = sourceNode.y + (targetNode.y - sourceNode.y) * particlePos;
        
        ctx.beginPath();
        ctx.arc(particleX, particleY, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#3b82f6';
        ctx.fill();
      });
      
      // Draw nodes
      nodes.forEach((node) => {
        const pulse = Math.sin(time * 3) * 0.2 + 0.8;
        
        // Outer glow
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, node.radius * 2
        );
        
        if (node.isPrimary) {
          gradient.addColorStop(0, `rgba(239, 68, 68, ${0.4 * pulse})`);
          gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
        } else {
          gradient.addColorStop(0, `rgba(59, 130, 246, ${0.3 * pulse})`);
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
        }
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        
        if (node.isPrimary) {
          ctx.fillStyle = '#ef4444';
          ctx.fill();
          ctx.strokeStyle = '#dc2626';
        } else {
          ctx.fillStyle = '#1e40af';
          ctx.fill();
          ctx.strokeStyle = '#3b82f6';
        }
        
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Risk indicator
        if (node.risk > 0.7) {
          ctx.fillStyle = 'white';
          ctx.font = '12px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('⚠', node.x, node.y);
        }
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [data]);

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 backdrop-blur-sm"
    >
      <h3 className="text-xl mb-4 font-mono uppercase text-cyan-400">
        Wizualizacja Grafu Sieci
      </h3>
      
      <div className="relative w-full h-96 bg-black/40 rounded-lg border border-gray-800 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ width: '100%', height: '100%' }}
        />
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-black/80 border border-gray-700 rounded-lg p-3 text-xs">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-red-500 rounded-full border border-red-600" />
            <span className="text-gray-300">Domena Główna</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-blue-700 rounded-full border border-blue-500" />
            <span className="text-gray-300">Mirror/Alias</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-blue-500" />
            <span className="text-gray-300">Połączenie</span>
          </div>
        </div>
        
        {/* Stats */}
        <div className="absolute top-4 right-4 bg-black/80 border border-gray-700 rounded-lg p-3">
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Statystyki Sieci</div>
          <div className="text-white font-mono">
            {data.reduce((sum, g) => sum + 1 + g.aliases.length, 0)} węzłów
          </div>
          <div className="text-white font-mono">
            {data.reduce((sum, g) => sum + g.aliases.length, 0)} połączeń
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-400">
        <p>⚠️ Węzły wysokiego ryzyka wskazują domeny z silnymi wskaźnikami nielegalnej aktywności</p>
        <p className="mt-1">Animowane cząsteczki pokazują przepływ danych między połączonymi domenami</p>
      </div>
    </motion.div>
  );
}