export type EquipmentType =
    | 'drum'
    | 'cymbal'
    | 'guitar-amp'
    | 'bass'
    | 'mixer'
    | 'speaker'
    | 'mic'
    | 'piano'

export type EquipmentItem = {
    type: EquipmentType
    label: string
}

export type Room = {
    id: string
    name: string // translation key (e.g., ROOMS.ROOM1_NAME)
    heroImage: string // filename from public/rooms
    images: string[] // first must be heroImage
    price: number // Ft / hour
    size: string // e.g., "4-5", "8-10"
    equipments: EquipmentItem[]
}

export const rooms: Room[] = [
    {
        id: 'room1',
        name: 'ROOM1_NAME',
        heroImage: 'room1/Room1.jpg',
        images: ['room1/Room1.jpg', 'room1/Room1_2.jpg', 'room1/Room1_3.jpg', 'room1/Room1_4.jpg', 'room1/Room1_5.jpg'],
        price: 5500,
        size: '4-5',
        equipments: [
            { type: 'drum', label: 'Yamaha Stage Custom fusion 10"–12"–14"–20"' },
            { type: 'guitar-amp', label: 'Orange Rocker 32 (black) {{COMBO}}' },
            { type: 'mic', label: 'Shure Beta 57A + Audio-Technica AT PRO31' },
            { type: 'cymbal', label: 'Paiste 14" {{HIHAT}} + Paiste 201 20" {{RIDE}}' },
            { type: 'bass', label: 'Ampeg Micro VR {{HEAD}} + Ampeg SVT-212AV {{CABINET}}' },
            { type: 'guitar-amp', label: 'Joyo Mjolnir {{HEAD}} + Vox 4×10" {{CABINET}}' },
            { type: 'mixer', label: 'Yamaha EMX 512SC' },
            { type: 'speaker', label: '2× Yamaha S115V 500W' },
            { type: 'piano', label: '{{UPRIGHT_PIANO}}' },
        ],
    },
    {
        id: 'room2',
        name: 'ROOM2_NAME',
        heroImage: 'room2/Room2.jpg',
        images: ['room2/Room2.jpg', 'room2/Room2_2.jpg', 'room2/Room2_3.jpg'],
        price: 5500,
        size: '4-5',
        equipments: [
            {
                type: 'drum',
                label: 'Natal Originals Maple 10"–12"–16"–22" + Natal brass {{SNARE}}',
            },
            {
                type: 'guitar-amp',
                label: 'Marshall 1923 C Limited Edition 85th {{COMBO}} + Orange TH30 {{HEAD}} + Orange PPC 212-OB {{CABINET}}',
            },
            { type: 'mic', label: 'Shure Beta 57A + Audio-Technica AT PRO31' },
            {
                type: 'cymbal',
                label: 'Meinl Classics Custom 14" {{HIHAT}} + Istanbul Agop 20" {{RIDE}}',
            },
            {
                type: 'bass',
                label: 'Warwick 300W WN Profet 3.3 {{HEAD}} + Ashdown 4×10 (600W) {{CABINET}}',
            },
            { type: 'mixer', label: 'Yamaha EMX 512SC' },
            { type: 'speaker', label: '2× Yamaha S115V 500W' },
        ],
    },
    {
        id: 'room3',
        name: 'ROOM3_NAME',
        heroImage: 'room3/Room3.jpg',
        images: [
            'room3/Room3.jpg',
            'room3/Room3_2.jpg',
            'room3/Room3_3.jpg',
            'room3/Room3_4.jpg',
            'room3/Room3_5.jpg',
            'room3/Room3_6.jpg',
        ],
        price: 6000,
        size: '8-10',
        equipments: [
            { type: 'drum', label: 'Yamaha Tour Custom 10"–12"–14"–22"' },
            { type: 'guitar-amp', label: 'Peavey Classic 30 {{HEAD}} + Vox 4×12 {{CABINET}}' },
            { type: 'mic', label: 'Shure Beta 57A + Shure SM58' },
            {
                type: 'cymbal',
                label: 'Meinl Classics Custom 14" {{HIHAT}} + Paiste Sound Creation 20" {{RIDE}}',
            },
            { type: 'bass', label: 'Ampeg SVT-3PRO {{HEAD}} + Ashdown 8×10 (1200W) {{CABINET}}' },
            { type: 'guitar-amp', label: 'Peavey EVH 5150 III 50W EL34 {{HEAD}} + Peavey 412 {{CABINET}}' },
            { type: 'mixer', label: 'Yamaha EMX 512SC' },
            { type: 'speaker', label: '2× Yamaha S115V 500W' },
            { type: 'piano', label: '{{UPRIGHT_PIANO}}' },
        ],
    },
    {
        id: 'room4',
        name: 'ROOM4_NAME',
        heroImage: 'room4/Room4.jpg',
        images: ['room4/Room4.jpg', 'room4/Room4_2.jpg', 'room4/Room4_3.jpg', 'room4/Room4_4.jpg'],
        price: 5500,
        size: '4-5',
        equipments: [
            { type: 'drum', label: 'DW Design 10"–12"–14"–16"–22" + DW Collectors {{SNARE}}' },
            { type: 'guitar-amp', label: 'ENGL Screamer {{HEAD}} + 4×12 {{CABINET}}' },
            { type: 'mic', label: 'Shure Beta 57A + Audio-Technica AT PRO31' },
            { type: 'cymbal', label: 'Zildjian, Anatolian' },
            {
                type: 'bass',
                label: 'Orange OB-1 300 {{HEAD}} + Imperator 4×12 (1300W) {{CABINET}}',
            },
            { type: 'guitar-amp', label: 'Orange Dual Terror {{HEAD}} + 4×10 {{CABINET}}' },
            { type: 'mixer', label: 'Yamaha EMX 512SC' },
            { type: 'speaker', label: 'Yamaha S115V' },
        ],
    },
    {
        id: 'room5',
        name: 'ROOM5_NAME',
        heroImage: 'room5/Room5.jpg',
        images: ['room5/Room5.jpg', 'room5/Room5_2.jpg', 'room5/Room5_3.jpg', 'room5/Room5_4.jpg'],
        price: 5500,
        size: '4-5',
        equipments: [
            {
                type: 'drum',
                label: 'Gretsch Renown Maple 10"–12"–16"–22" + Ludwig Supraphonic {{SNARE}}',
            },
            { type: 'guitar-amp', label: 'Hughes & Kettner TubeMeister Deluxe 40 {{COMBO}}' },
            { type: 'mic', label: 'Shure Beta 57A + Audio-Technica AT PRO31' },
            { type: 'cymbal', label: 'Agean 14" {{HIHAT}} + Zildjian S Family 22" {{RIDE}}' },
            {
                type: 'bass',
                label: 'Ashdown Mark King 500W {{HEAD}} + Warwick 6×10" 900W WCA 211 PRO {{CABINET}}',
            },
            { type: 'guitar-amp', label: 'Orange Dual Terror {{HEAD}} + Vox 412 BK {{CABINET}}' },
            { type: 'mixer', label: 'Yamaha EMX 512SC' },
            { type: 'speaker', label: '2× Yamaha S115V 500W' },
        ],
    },
]
