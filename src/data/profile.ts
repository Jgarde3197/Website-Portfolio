import { CONTACT_EMAIL } from './contact-info'
import { Briefcase, Stack, Clock, type Icon } from '@/components/slab'
import { projects } from '@/data/projects'
export type SocialLink = { label: string; href: string; iconPath: string }
export type Stat = { value: string; label: string; Icon: Icon }
export const resumeUrl = '/resume/Jefferson_Garde_Resume.pdf'
export const schedulingUrl =
  'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3UMazeIW1yIy5vdzWaHQ3j7v89hS4xE8mdgHL5jOEgToK1U_5ziIFhfraCMIA6ncWlqfkM32Gt'
export const profile = {
  name: 'Jefferson Garde',
  firstName: 'Jefferson',
  handle: 'AI Automation Specialist',
  role: 'Business workflow automation',
  avatarSrc: '/identity.svg',
  photoFile: 'src/assets/jefferson-profile.png',
  verifiedLabel: '',
  email: CONTACT_EMAIL,
  location: 'PadreGarcia, Batangas, Philippines',
  stats: [
    { value: String(projects.length), label: 'Portfolio projects', Icon: Briefcase },
    { value: 'Make + Zapier', label: 'Automation platforms', Icon: Stack },
    { value: 'UTC+8', label: 'Philippine Time', Icon: Clock },
  ] as Stat[],
  displayName: { line1: 'Connect systems.', line2: 'Automate the work.' },
  hero: {
    body: 'I build reliable Make.com and Zapier workflows that automate lead handling, operations, data processing, and repetitive back-office work — with routing, validation, AI integration, and error handling built in.',
    portraitSrc: '/identity.svg',
    portraitAlt: 'Jefferson Garde initials',
  },
  socials: [
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/jeff-garde-793788204/',
      iconPath: '/logos/linkedin.svg',
    },
    {
      label: 'Upwork',
      href: 'https://www.upwork.com/freelancers/~01fac767f42d10fbf6?viewMode=1',
      iconPath: '/logos/upwork.svg',
    },
    { label: 'GitHub', href: 'https://github.com/Jgarde3197', iconPath: '/logos/github.svg' },
    { label: 'WhatsApp', href: 'https://wa.me/639978950420', iconPath: '/logos/whatsapp.svg' },
  ] as SocialLink[],
}
