import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.subscription.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const users = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: await bcrypt.hash('password123', 10),
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: await bcrypt.hash('password456', 10),
    },
    {
      name: 'Bob Wilson',
      email: 'bob@example.com',
      password: await bcrypt.hash('password789', 10),
    },
  ];

  for (const userData of users) {
    const user = await prisma.user.create({
      data: userData,
    });

    // Create subscriptions for each user
    await prisma.subscription.createMany({
      data: [
        {
          name: 'Basic Plan',
          status: 'active',
          amount: 9.99,
          nextBillingDate: new Date('2024-05-01'),
          userId: user.id,
        },
        {
          name: 'Pro Plan',
          status: user.name === 'John Doe' ? 'active' : 'pending',
          amount: 19.99,
          nextBillingDate: new Date('2024-05-15'),
          userId: user.id,
        },
      ],
    });
  }

  console.log('Database has been seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 