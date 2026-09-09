import {
  ArrowRight, BrainCircuit, Check, Code2, Database, Gauge, Mail, MapPin, Network, Phone, Route, Search, ShieldCheck, Sparkles, Workflow, Zap, Leaf, Compass,
} from 'lucide-react'

export const icons = {
  'arrow-right': ArrowRight, 'brain-circuit': BrainCircuit, check: Check, 'code-2': Code2, database: Database, gauge: Gauge, mail: Mail,
  'map-pin': MapPin, network: Network, phone: Phone, route: Route, search: Search, 'shield-check': ShieldCheck, sparkles: Sparkles,
  workflow: Workflow, zap: Zap, leaf: Leaf, compass: Compass,
} as const

export type IconName = keyof typeof icons

/** Iconografía Lucide, trazo fino 1.6 como manda el design system. Decorativa: siempre aria-hidden. */
export function Icon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  const Cmp = icons[name]
  return <Cmp size={size} strokeWidth={1.6} aria-hidden="true" focusable="false" className={className} />
}
