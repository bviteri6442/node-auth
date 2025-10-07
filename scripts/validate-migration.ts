import mongoose from 'mongoose';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  img: String,
  roles: [String],
});

const UserModel = mongoose.model('User', userSchema);
const prisma = new PrismaClient();

async function validateMigration() {
  try {
    // Conectar a ambas bases
    const mongoUrl = process.env.MONGO_URL || 'mongodb://mongo-user:123456@localhost:27017';
    const dbName = process.env.MONGO_DB_NAME || 'mystore';
    
    await mongoose.connect(mongoUrl, { dbName });
    console.log('✅ Connected to MongoDB');
    console.log('✅ Connected to PostgreSQL\n');

    // Contar registros
    const mongoCount = await UserModel.countDocuments();
    const pgCount = await prisma.user.count();

    console.log('📊 RECORD COUNTS:');
    console.log(`  MongoDB:    ${mongoCount}`);
    console.log(`  PostgreSQL: ${pgCount}`);
    
    if (mongoCount !== pgCount) {
      console.log('⚠️  WARNING: Record counts do not match!\n');
    } else {
      console.log('✅ Record counts match!\n');
    }

    // Comparar samples
    console.log('🔍 SAMPLE COMPARISON:');
    const mongoSamples = await UserModel.find().limit(3).lean();
    
    for (const mongoUser of mongoSamples) {
      if (!mongoUser.email) continue;

      const pgUser = await prisma.user.findUnique({
        where: { email: mongoUser.email },
      });

      console.log(`\n📧 Email: ${mongoUser.email}`);
      console.log(`  Mongo: ${mongoUser.name} | Roles: ${mongoUser.roles?.join(', ')}`);
      if (pgUser) {
        console.log(`  PG:    ${pgUser.name} | Roles: ${pgUser.roles.join(', ')}`);
        console.log(`  ✅ Data matches`);
      } else {
        console.log(`  ❌ NOT FOUND in PostgreSQL`);
      }
    }

    console.log('\n✨ Validation complete!');
  } catch (error) {
    console.error('💥 Validation error:', error);
  } finally {
    await mongoose.disconnect();
    await prisma.$disconnect();
  }
}

validateMigration();
