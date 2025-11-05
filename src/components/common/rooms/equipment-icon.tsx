import Image, { StaticImageData } from 'next/image'

import ampIcon from '@/assets/icons/amp.png'
import cymbalIcon from '@/assets/icons/cymbal.png'
import drumIcon from '@/assets/icons/drum.png'
import micIcon from '@/assets/icons/mic.png'
import mixerIcon from '@/assets/icons/mixer.png'
import pedalIcon from '@/assets/icons/pedal.png'
import pianoIcon from '@/assets/icons/piano.png'
import speakerIcon from '@/assets/icons/speaker.png'
import { EquipmentType } from '@/lib/rooms'

const ICONS: Record<EquipmentType, StaticImageData> = {
    drum: drumIcon,
    cymbal: cymbalIcon,
    amp: ampIcon,
    guitar: ampIcon,
    bass: ampIcon,
    pedal: pedalIcon,
    mixer: mixerIcon,
    speaker: speakerIcon,
    mic: micIcon,
    piano: pianoIcon,
}

type Props = {
    type: EquipmentType
    size?: number // default 24
    alt?: string // fallback to type
}

export function EquipmentIcon({ type, size = 24, alt }: Props) {
    return <Image src={ICONS[type]} width={size} height={size} alt={alt ?? type} />
}
