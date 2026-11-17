import {
  BarChart3,
  Cpu,
  Database,
  LineChart,
  PenTool,
  Rocket,
  Target,
  Zap,
} from 'lucide-react';

const ICONS = {
  BarChart3,
  LineChart,
  Database,
  PenTool,
  Rocket,
  Target,
  Cpu,
  Zap,
};

export default function Icon({ name, size = 22, className = '' }) {
  const Cmp = ICONS[name] || BarChart3;
  return <Cmp size={size} className={className} />;
}
