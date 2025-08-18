export type Room = {
    id: string
    name: string // translation key (e.g., ROOMS.ROOM1_NAME)
    image?: string // filename from public/rooms
    price: number // Ft / hour
    size: number // number of people
}

export const rooms: Room[] = [
    {
        id: 'room1',
        name: 'ROOM1_NAME',
        image: 'Room1.jpg',
        price: 5500,
        size: 5,
    },
    {
        id: 'room2',
        name: 'ROOM2_NAME',
        image: 'Room2.jpg',
        price: 5500,
        size: 4,
    },
    {
        id: 'room3',
        name: 'ROOM3_NAME',
        image: 'Room3.jpg',
        price: 6000,
        size: 10,
    },
    {
        id: 'room4',
        name: 'ROOM4_NAME',
        image: 'Room4.jpg',
        price: 5500,
        size: 5,
    },
    {
        id: 'room5',
        name: 'ROOM5_NAME',
        image: 'Room5.jpg',
        price: 5500,
        size: 4,
    },
]
