import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from './src/models/User.js';
import { Record } from './src/models/Record.js';
import { connectDB } from './src/config/db.js';

dotenv.config();

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomFrom = (values) => {
  return values[randomInt(0, values.length - 1)];
};

const randomRecentDate = (minMonthsBack = 3, maxMonthsBack = 6) => {
  const now = new Date();
  const monthsBack = randomInt(minMonthsBack, maxMonthsBack);
  const dayOffset = randomInt(0, 27);
  const hour = randomInt(8, 20);
  const minute = randomInt(0, 59);
  const date = new Date(
    now.getFullYear(),
    now.getMonth() - monthsBack,
    randomInt(1, 28),
    hour,
    minute,
    0,
    0
  );

  date.setDate(date.getDate() + dayOffset);
  return date;
};

const buildSampleRecords = (adminId) => {
  const incomeTemplates = [
    {
      category: 'salary',
      noteOptions: [
        'Monthly salary credit',
        'Salary payout via bank transfer',
        'Primary job salary received',
      ],
    },
    {
      category: 'freelance',
      noteOptions: [
        'Freelance web project payment',
        'Consulting income from client',
        'UI/UX contract payout',
      ],
    },
    {
      category: 'bonus',
      noteOptions: [
        'Quarterly performance bonus',
        'Referral bonus received',
        'Project completion bonus',
      ],
    },
  ];

  const expenseTemplates = [
    {
      category: 'food',
      noteOptions: [
        'Groceries and household food items',
        'Dinner with family',
        'Weekly supermarket purchase',
      ],
    },
    {
      category: 'rent',
      noteOptions: [
        'Monthly apartment rent',
        'House rent payment',
        'Rent transfer to landlord',
      ],
    },
    {
      category: 'travel',
      noteOptions: [
        'Cab and metro expenses',
        'Intercity travel booking',
        'Fuel and parking',
      ],
    },
    {
      category: 'shopping',
      noteOptions: [
        'Clothing and essentials',
        'Online marketplace order',
        'Home accessories purchase',
      ],
    },
    {
      category: 'bills',
      noteOptions: [
        'Electricity and water bill',
        'Internet and mobile bill',
        'Utility bill settlement',
      ],
    },
  ];

  const records = [];

  // 10 income records with realistic range 3000-10000
  for (let index = 0; index < 10; index += 1) {
    const template = randomFrom(incomeTemplates);
    records.push({
      amount: randomInt(3000, 10000),
      type: 'income',
      category: template.category,
      date: randomRecentDate(3, 6),
      notes: randomFrom(template.noteOptions),
      createdBy: adminId,
    });
  }

  // 14 expense records with realistic range 50-2000
  for (let index = 0; index < 14; index += 1) {
    const template = randomFrom(expenseTemplates);
    records.push({
      amount: randomInt(50, 2000),
      type: 'expense',
      category: template.category,
      date: randomRecentDate(3, 6),
      notes: randomFrom(template.noteOptions),
      createdBy: adminId,
    });
  }

  return records;
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear collections in dependency-safe order.
    await Record.deleteMany({});
    await User.deleteMany({});

    const users = await User.create([
      {
        name: 'Aarav Mehta',
        email: 'admin@example.com',
        password: 'Admin@12345',
        role: 'admin',
        isActive: true,
      },
      {
        name: 'Nisha Kapoor',
        email: 'analyst@example.com',
        password: 'Analyst@12345',
        role: 'analyst',
        isActive: true,
      },
      {
        name: 'Rohan Verma',
        email: 'viewer@example.com',
        password: 'Viewer@12345',
        role: 'viewer',
        isActive: true,
      },
    ]);

    const adminUser = users.find((user) => user.role === 'admin');
    const sampleRecords = buildSampleRecords(adminUser._id);
    const insertedRecords = await Record.insertMany(sampleRecords);

    console.log('Seed completed successfully');
    console.log(`Users created: ${users.length}`);
    console.log(`Records created: ${insertedRecords.length}`);
    console.log('Admin login credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: Admin@12345');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);

    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }

    process.exit(1);
  }
};

seedData();
