import Image, { StaticImageData } from 'next/image'

import ampIcon from '@/assets/icons/amp.png'
import bassIcon from '@/assets/icons/bass.png'
import cymbalIcon from '@/assets/icons/cymbal.png'
import drumIcon from '@/assets/icons/drum.png'
import guitarIcon from '@/assets/icons/guitar.png'
import micIcon from '@/assets/icons/mic.png'
import mixerIcon from '@/assets/icons/mixer.png'
import pedalIcon from '@/assets/icons/pedal.png'
import pianoIcon from '@/assets/icons/piano.png'
import speakerIcon from '@/assets/icons/speaker.png'
import { EquipmentIconKind } from '@/lib/rooms'

const ICONS: Record<EquipmentIconKind, StaticImageData> = {
    drum: drumIcon,
    cymbal: cymbalIcon,
    amp: ampIcon,
    guitar: guitarIcon,
    bass: bassIcon,
    pedal: pedalIcon,
    mixer: mixerIcon,
    speaker: speakerIcon,
    mic: micIcon,
    piano: pianoIcon,
}

type Props = {
    type: EquipmentIconKind
    size?: number // default 24
    alt?: string // fallback to type
}

export function EquipmentIcon({ type, size = 24, alt }: Props) {
    return <Image src={ICONS[type]} width={size} height={size} alt={alt ?? type} />
}
