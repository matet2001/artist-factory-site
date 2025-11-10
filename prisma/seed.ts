import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Seed rooms first with explicit IDs matching the slug
  const rooms = [
    { id: 'room1', name: 'ROOM1_NAME', slug: 'room1', size: 5, price: 5500 },
    { id: 'room2', name: 'ROOM2_NAME', slug: 'room2', size: 5, price: 5500 },
    { id: 'room3', name: 'ROOM3_NAME', slug: 'room3', size: 10, price: 6000 },
    { id: 'room4', name: 'ROOM4_NAME', slug: 'room4', size: 5, price: 5500 },
    { id: 'room5', name: 'ROOM5_NAME', slug: 'room5', size: 5, price: 5500 },
  ];

  for (const room of rooms) {
    await prisma.room.upsert({
      where: { slug: room.slug },
      update: {},
      create: room,
    });
  }

  console.log('Rooms seeded.');

  // Seed users
  await Promise.all([
    prisma.user.create({
      data: {
        email: 'alice@example.com',
        name: 'Alice',
        password: await bcrypt.hash('password123', 10),
      },
    }),
    prisma.user.create({
      data: {
        email: 'bob@example.com',
        name: 'Bob',
        password: await bcrypt.hash('password123', 10),
      },
    }),
    prisma.user.create({
      data: {
        email: 'charlie@example.com',
        name: 'Charlie',
        password: await bcrypt.hash('password123', 10),
      },
    }),
    prisma.user.create({
      data: {
        email: 'diana@example.com',
        name: 'Diana',
        password: await bcrypt.hash('password123', 10),
      },
    }),
    prisma.user.create({
      data: {
        email: 'edward@example.com',
        name: 'Edward',
        password: await bcrypt.hash('password123', 10),
      },
    }),
  ]);

  console.log('Seeding completed.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
