import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Seed rooms first with explicit IDs matching the slug
  const rooms = [
    { id: 'room1', name: 'ROOM1_NAME', slug: 'room1', size: 16, price: 5500 },
    { id: 'room2', name: 'ROOM2_NAME', slug: 'room2', size: 20, price: 6500 },
    { id: 'room3', name: 'ROOM3_NAME', slug: 'room3', size: 25, price: 7500 },
    { id: 'room4', name: 'ROOM4_NAME', slug: 'room4', size: 30, price: 8500 },
    { id: 'room5', name: 'ROOM5_NAME', slug: 'room5', size: 20, price: 6500 },
    { id: 'studio', name: 'STUDIO_NAME', slug: 'studio', size: 40, price: 10000 },
  ];

  for (const room of rooms) {
    await prisma.room.upsert({
      where: { slug: room.slug },
      update: {},
      create: room,
    });
  }

  console.log('✓ Seeded 6 rooms (Room 1-5 + Studio)');

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

  console.log('✓ Seeded admin user: artistfactory@artistfactory.hu');

  console.log('\n=== Seeding completed successfully! ===');
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
