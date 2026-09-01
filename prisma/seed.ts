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

  // Seed admin user — credentials come from the environment, never from source control.
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log('• Skipped admin seeding (set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to create one)');
  } else {
    const hashed = await bcrypt.hash(adminPassword, 10);
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { isAdmin: true },
      create: {
        email: adminEmail,
        name: 'ArtistFactory Admin',
        password: hashed,
        isAdmin: true,
        emailVerified: new Date(),
      },
    });

    console.log(`✓ Seeded admin user: ${adminEmail}`);
  }

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
