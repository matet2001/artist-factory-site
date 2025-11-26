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

  // Seed admin user
  await prisma.user.upsert({
    where: { email: 'artistfactory@artistfactory.hu' },
    update: {
      password: await bcrypt.hash('artistfactory99', 10),
      isAdmin: true,
    },
    create: {
      email: 'artistfactory@artistfactory.hu',
      name: 'ArtistFactory Admin',
      password: await bcrypt.hash('artistfactory99', 10),
      isAdmin: true,
      emailVerified: new Date(),
    },
  });

  console.log('Admin user seeded.');

  // Seed regular users (only if they don't exist)
  const testUsers = [
    { email: 'alice@example.com', name: 'Alice' },
    { email: 'bob@example.com', name: 'Bob' },
    { email: 'charlie@example.com', name: 'Charlie' },
    { email: 'diana@example.com', name: 'Diana' },
    { email: 'edward@example.com', name: 'Edward' },
  ];

  for (const user of testUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        name: user.name,
        password: await bcrypt.hash('password123', 10),
      },
    });
  }

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
