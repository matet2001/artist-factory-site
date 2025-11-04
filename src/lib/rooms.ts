export type EquipmentType =
    | 'drum'
    | 'cymbal'
    | 'amp'
    | 'guitar'
    | 'bass'
    | 'pedal'
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
        heroImage: 'Room1.jpg',
        images: ['Room1.jpg', 'Room1_3.jpg', 'Room1_4.jpg', 'Room1_5.jpg'],
        price: 5500,
        size: '4-5',
        equipments: [
            { type: 'drum', label: 'Yamaha Stage Custom fusion 10"–12"–14"–20"' },
            { type: 'amp', label: 'Orange Rocker 32 (black)' },
            { type: 'mic', label: 'Shure Beta 57A + Audio-Technica AT PRO31' },
            { type: 'cymbal', label: 'Paiste 14" {{HIHAT}} + Paiste 201 20" {{RIDE}}' },
            { type: 'bass', label: 'Ampeg Micro VR {{HEAD}} + Ampeg SVT-212AV {{CABINET}}' },
            { type: 'pedal', label: 'Joyo Mjolnir' },
            { type: 'guitar', label: 'Vox 4×10" {{CABINET}}' },
            { type: 'mixer', label: 'Yamaha EMX 512SC' },
            { type: 'speaker', label: '2× Yamaha S115V 500W' },
            { type: 'piano', label: '{{UPRIGHT_PIANO}}' },
        ],
    },
    {
        id: 'room2',
        name: 'ROOM2_NAME',
        heroImage: 'Room2.jpg',
        images: ['Room2.jpg'],
        price: 5500,
        size: '4-5',
        equipments: [
            {
                type: 'drum',
                label: 'Natal Originals Maple 10"–12"–16"–22" + Natal brass {{SNARE}}',
            },
            {
                type: 'amp',
                label: 'Marshall 1923 C Limited Edition 85th + Orange TH30 {{HEAD}} + Orange PPC 212-OB {{CABINET}}',
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
        heroImage: 'Room3.jpg',
        images: ['Room3.jpg', 'Room3_2.jpg', 'Room3_3.jpg', 'Room3_4.jpg', 'Room3_5.jpg'],
        price: 6000,
        size: '8-10',
        equipments: [
            { type: 'drum', label: 'Yamaha Tour Custom 10"–12"–14"–22"' },
            { type: 'amp', label: 'Peavey Classic 30 {{HEAD}} + Vox 4×12 {{CABINET}}' },
            { type: 'mic', label: 'Shure Beta 57A + Shure SM58' },
            {
                type: 'cymbal',
                label: 'Meinl Classics Custom 14" {{HIHAT}} + Paiste Sound Creation 20" {{RIDE}}',
            },
            { type: 'bass', label: 'Ampeg SVT-3PRO {{HEAD}} + Ashdown 8×10 (1200W) {{CABINET}}' },
            { type: 'amp', label: 'Peavey EVH 5150 III 50W EL34 + Peavey 412 {{CABINET}}' },
            { type: 'mixer', label: 'Yamaha EMX 512SC' },
            { type: 'speaker', label: '2× Yamaha S115V 500W' },
            { type: 'piano', label: '{{UPRIGHT_PIANO}}' },
        ],
    },
    {
        id: 'room4',
        name: 'ROOM4_NAME',
        heroImage: 'Room4.jpg',
        images: ['Room4.jpg', 'Room4_2.jpg'],
        price: 5500,
        size: '4-5',
        equipments: [
            { type: 'drum', label: 'DW Design 10"–12"–14"–16"–22" + DW Collectors {{SNARE}}' },
            { type: 'amp', label: 'ENGL Screamer {{HEAD}} + 4×12 {{CABINET}}' },
            { type: 'mic', label: 'Shure Beta 57A + Audio-Technica AT PRO31' },
            { type: 'cymbal', label: 'Zildjian, Anatolian' },
            {
                type: 'bass',
                label: 'Orange OB-1 300 {{HEAD}} + Imperator 4×12 (1300W) {{CABINET}}',
            },
            { type: 'amp', label: 'Orange Dual Terror {{HEAD}} + 4×10 {{CABINET}}' },
            { type: 'mixer', label: 'Yamaha EMX 512SC' },
            { type: 'speaker', label: 'Yamaha S115V' },
        ],
    },
    {
        id: 'room5',
        name: 'ROOM5_NAME',
        heroImage: 'Room5.jpg',
        images: ['Room5.jpg', 'Room5_3.jpg'],
        price: 5500,
        size: '4-5',
        equipments: [
            {
                type: 'drum',
                label: 'Gretsch Renown Maple 10"–12"–16"–22" + Ludwig Supraphonic {{SNARE}}',
            },
            { type: 'amp', label: 'Hughes & Kettner TubeMeister Deluxe 40' },
            { type: 'mic', label: 'Shure Beta 57A + Audio-Technica AT PRO31' },
            { type: 'cymbal', label: 'Agean 14" {{HIHAT}} + Zildjian S Family 22" {{RIDE}}' },
            {
                type: 'bass',
                label: 'Ashdown Mark King 500W {{HEAD}} + Warwick 6×10" 900W WCA 211 PRO {{CABINET}}',
            },
            { type: 'amp', label: 'Orange Dual Terror {{HEAD}} + Vox 412 BK {{CABINET}}' },
            { type: 'mixer', label: 'Yamaha EMX 512SC' },
            { type: 'speaker', label: '2× Yamaha S115V 500W' },
        ],
    },
]
