export type Certification = {
  id: string
  title: string
  issuer: string
  type: string
  date: string
  category: string
  description: string
  preview: string
  file: string
  format: 'pdf' | 'image'
  icon?: string
  program?: string
}
// Categories and cards are derived from these records; add future credentials here.
export const certifications: Certification[] = [
  {
    id: 'zapier-completion', title: 'No Code Automation with Zapier',
    issuer: 'Tara AI Community+', type: 'Certificate of Completion', date: 'September 22, 2026', category: 'Automation Training',
    description: 'Training covering Zapier triggers, Formatter, Delay, Filter, Paths, Looping, Sub-Zaps, Webhooks, and AI with Human in the Loop.',
    preview: '/certificates/zapier-preview.png', file: '/certificates/Jefferson_Garde_Zapier.pdf', format: 'pdf', icon: '/logos/zapier.svg',
  },
  {
    id: 'make-com-completion', title: 'No Code Automation with Make.com',
    issuer: 'Tara AI Community+', type: 'Certificate of Completion', date: 'September 23, 2026', category: 'Automation Training',
    description: 'Training covering Make.com interface, scenario structure, filters, triggers, app connections, actions, data manipulation, advanced routing, HTTP requests, and AI Agents.',
    preview: '/certificates/make-com-preview.png', file: '/certificates/Jefferson_Garde_Make.com.pdf', format: 'pdf', icon: '/logos/make.svg',
  },
  {
    id: 'epson-mechatronics', title: 'Mechatronics Training',
    issuer: 'Epson Precision (Philippines), Inc.', type: 'Technical Training', date: 'September–October 2019', category: 'Technical Training', program: 'EPPI Monozukuri Dojo',
    description: 'Technical training in mechatronics completed through EPPI Monozukuri Dojo.',
    preview: '/certificates/epson-mechatronics.png', file: '/certificates/epson-mechatronics.png', format: 'image',
  },
]
