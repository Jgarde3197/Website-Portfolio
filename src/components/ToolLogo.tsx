import { tools } from '@/data/tools'

type Props = { name: string; src?: string; size?: 'xs' | 'sm' | 'md' | 'lg'; decorative?: boolean; className?: string }
const pixels = { xs: 16, sm: 20, md: 28, lg: 40 }
const projectLogos: Record<string, string> = {
  HubSpot: '/logos/hubspot.svg', Trello: '/logos/trello.svg',
  'Storage by Zapier': '/logos/zapier.svg', 'Filter by Zapier': '/logos/zapier.svg',
}
/** Local SVGs only. Adjacent readable labels can use the decorative mode. */
export default function ToolLogo({ name, src, size = 'sm', decorative = false, className = '' }: Props) {
  const path = src ?? projectLogos[name] ?? tools.find(t => t.name === name)?.iconPath
  if (!path) return null
  return <img className={`tool-logo tool-logo--${size} ${className}`} src={path} alt={decorative ? '' : name} aria-hidden={decorative || undefined} width={pixels[size]} height={pixels[size]} loading="lazy" decoding="async" />
}
