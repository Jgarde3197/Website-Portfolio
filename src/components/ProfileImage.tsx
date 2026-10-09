import { useState } from 'react'
import { profile } from '@/data/profile'

const photos = import.meta.glob<string>('../assets/jefferson-profile.png', { eager: true, query: '?url', import: 'default' })
/** Add src/assets/jefferson-profile.png; Vite picks it up on rebuild, without a 404. */
export default function ProfileImage({ className = '', variant = 'about' }: { className?: string; variant?: 'sidebar' | 'about' }) {
  const [missing, setMissing] = useState(false)
  const photo = photos['../assets/jefferson-profile.png']
  return <div className={`profile-photo profile-photo--${variant} ${className}`}>
    <img className="profile-image" src={!missing && photo ? photo : profile.avatarSrc} onError={() => setMissing(true)} alt="Jefferson Garde - AI Automation Specialist" width={1009} height={1559} decoding="async" />
  </div>
}
