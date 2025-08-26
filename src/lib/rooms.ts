// types/room.ts
export type EquipmentIconKind =
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

    
    export type Room = {
        id: string
        name: string // translation key (e.g., ROOMS.ROOM1_NAME)
        heroImage: string // filename from public/rooms
        price: number // Ft / hour
    size: string // "4-5", "8-10"
    equipments: EquipmentItem[]
}

export type EquipmentItem = {
    icon: EquipmentIconKind
    label: string
}

export const rooms: Room[] = [
    {
        id: 'room1',
        name: 'ROOM1_NAME',
        heroImage: 'Room1.jpg',
        price: 5500,
        size: '4-5',
        equipments: [
            { icon: 'drum', label: `Dob – Yamaha Stage Custom fusion 10"–12"–14"–20"` },
            { icon: 'cymbal', label: `Cinek – Paiste 14" Hi-Hat és Paiste 201 20" Ride` },
            { icon: 'bass', label: 'Bass – Ampeg Micro VR fej és Ampeg SVT-212AV láda' },
            { icon: 'amp', label: 'Gitárerősítők – Orange Rocker 32 (black)' },
            { icon: 'pedal', label: 'Gitár – Joyo Mjolnir' },
            { icon: 'guitar', label: 'Gitár – Vox 4×10" ládával' },
            { icon: 'mixer', label: 'Keverőerősítő – Yamaha EMX 512SC' },
            { icon: 'speaker', label: 'Hangfalak – 2× Yamaha S115V 500W' },
            { icon: 'mic', label: 'Mikrofonok – Shure Beta 57A és Audio-Technica AT PRO31' },
            { icon: 'piano', label: 'Pianínó' },
        ],
    },
    {
        id: 'room2',
        name: 'ROOM2_NAME',
        heroImage: 'Room2.jpg',
        price: 5500,
        size: '4-5',
        equipments: [
            {
                icon: 'drum',
                label: `Dob – Natal Originals Maple 10"–12"–16"–22" – Natal brass pergő`,
            },
            {
                icon: 'cymbal',
                label: `Cinek – Meinl Classics Custom 14" Hi-Hat és Istanbul Agop 20" Ride`,
            },
            {
                icon: 'bass',
                label: 'Bass – Warwick 300W WN Profet 3.3 fej és Ashdown 4x10 (600W) láda',
            },
            {
                icon: 'amp',
                label: 'Gitárerősítők – Marshall 1923 C Limited Edition 85th + Orange TH30 fej – Orange PPC 212-OB ládával',
            },
            { icon: 'mixer', label: 'Keverőerősítő – Yamaha EMX 512SC' },
            { icon: 'speaker', label: 'Hangfalak – 2× Yamaha S115V 500W' },
            { icon: 'mic', label: 'Mikrofonok – Shure Beta 57A és Audio-Technica AT PRO31' },
        ],
    },
    {
        id: 'room3',
        name: 'ROOM3_NAME',
        heroImage: 'Room3.jpg',
        price: 6000,
        size: '8-10',
        equipments: [
            { icon: 'drum', label: `Dob – Yamaha Tour Custom 10"–12"–14"–22"` },
            {
                icon: 'cymbal',
                label: `Cinek – Meinl Classics Custom 14" Hi-Hat és Paiste Sound Creation 20" Ride`,
            },
            { icon: 'bass', label: 'Bass – Ampeg SVT-3PRO fej és Ashdown 8×10 (1200W) láda' },
            { icon: 'amp', label: 'Gitárerősítők – Peavey Classic 30 fej (4×12 Vox ládával)' },
            {
                icon: 'amp',
                label: 'Gitárerősítők – Peavey EVH 5150 III 50W EL34 + Peavey 412 láda',
            },
            { icon: 'mixer', label: 'Keverőerősítő – Yamaha EMX 512SC' },
            { icon: 'speaker', label: 'Hangfalak – 2× Yamaha S115V 500W' },
            { icon: 'mic', label: 'Mikrofonok – Shure Beta 57A és Shure SM58' },
            { icon: 'piano', label: 'Pianínó (havonta hangolva)' },
        ],
    },
    {
        id: 'room4',
        name: 'ROOM4_NAME',
        heroImage: 'Room4.jpg',
        price: 5500,
        size: '4-5',
        equipments: [
            { icon: 'drum', label: `Dob – DW Design 10"–12"–14"–16"–22" + DW Collectors pergő` },
            { icon: 'cymbal', label: `Cinek – Zildjian, Anatolian` },
            { icon: 'bass', label: 'Bass – Orange OB-1 300 fej + Imperator 4×12 (1300W)' },
            { icon: 'amp', label: 'Gitárerősítők – ENGL Screamer fej + 4×12 láda' },
            { icon: 'amp', label: 'Gitárerősítők – Orange Dual Terror fej + 4×10 láda' },
            { icon: 'mixer', label: 'Keverőerősítő – Yamaha EMX 512SC' },
            { icon: 'speaker', label: 'Hangfalak – Yamaha S115V' },
            { icon: 'mic', label: 'Mikrofonok – Shure Beta 57A és Audio-Technica AT PRO31' },
        ],
    },
    {
        id: 'room5',
        name: 'ROOM5_NAME',
        heroImage: 'Room5.jpg',
        price: 5500,
        size: '4-5',
        equipments: [
            {
                icon: 'drum',
                label: `Dob – Gretsch Renown Maple + Ludwig Supraphonic pergő 10"–12"–16"–22"`,
            },
            { icon: 'cymbal', label: `Cinek – Agean 14" Hi-Hat és Zildjian S Family 22" Ride` },
            {
                icon: 'bass',
                label: 'Bass – Ashdown Mark King 500W fej + Warwick 6×10" 900W WCA 211 PRO láda',
            },
            { icon: 'amp', label: 'Gitárerősítők – Hughes & Kettner TubeMeister Deluxe 40' },
            { icon: 'amp', label: 'Gitárerősítők – Orange Dual Terror fej + Vox 412 BK láda' },
            { icon: 'mixer', label: 'Keverőerősítő – Yamaha EMX 512SC' },
            { icon: 'speaker', label: 'Hangfalak – 2× Yamaha S115V 500W' },
            { icon: 'mic', label: 'Mikrofonok – Shure Beta 57A és Audio-Technica AT PRO31' },
        ],
    },
]
