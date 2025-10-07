import mongoose from 'mongoose';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

// Mongoose Model (copiar de src/data/mongodb/models/user.model.ts)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  img: String,
  roles: [String],
});

const UserModel = mongoose.model('User', userSchema);

const prisma = new PrismaClient();

interface MigrationStats {
  totalMongo: number;
  migrated: number;
  skipped: number;
  errors: number;
}

async function migrateUsers(): Promise<MigrationStats> {
  const stats: MigrationStats = {
    totalMongo: 0,
    migrated: 0,
    skipped: 0,
    errors: 0,
  };

  console.log('📊 Starting migration from MongoDB to PostgreSQL...\n');

  try {
    // 1. Conectar a MongoDB
    const mongoUrl = process.env.MONGO_URL || 'mongodb://mongo-user:123456@localhost:27017';
    const dbName = process.env.MONGO_DB_NAME || 'mystore';
    
    await mongoose.connect(mongoUrl, { dbName });
    console.log('✅ Connected to MongoDB');

    // 2. Obtener todos los usuarios de Mongo
    const mongoUsers = await UserModel.find().lean();
    stats.totalMongo = mongoUsers.length;
    console.log(`📄 Found ${stats.totalMongo} users in MongoDB\n`);

    // 3. Migrar cada usuario a Postgres
    for (const mongoUser of mongoUsers) {
      try {
        // Validar email
        if (!mongoUser.email) {
          console.log(`⚠️  Skipping user without email`);
          stats.skipped++;
          continue;
        }

        // Verificar si ya existe por email
        const existing = await prisma.user.findUnique({
          where: { email: mongoUser.email },
        });

        if (existing) {
          console.log(`⚠️  Skipping ${mongoUser.email} (already exists)`);
          stats.skipped++;
          continue;
        }

        // Crear en Postgres (se genera UUID automáticamente)
        await prisma.user.create({
          data: {
            name: mongoUser.name || 'Unknown',
            email: mongoUser.email,
            password: mongoUser.password || '',
            img: mongoUser.img || null,
            roles: mongoUser.roles || ['USER_ROLE'],
          },
        });

        console.log(`✅ Migrated: ${mongoUser.email}`);
        stats.migrated++;
      } catch (error) {
        console.error(`❌ Error migrating ${mongoUser.email}:`, error);
        stats.errors++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📈 MIGRATION SUMMARY:');
    console.log('='.repeat(50));
    console.log(`Total in MongoDB:      ${stats.totalMongo}`);
    console.log(`Successfully migrated: ${stats.migrated}`);
    console.log(`Skipped (duplicates):  ${stats.skipped}`);
    console.log(`Errors:                ${stats.errors}`);
    console.log('='.repeat(50) + '\n');

    return stats;
  } catch (error) {
    console.error('💥 Fatal error during migration:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    await prisma.$disconnect();
    console.log('🔌 Disconnected from databases');
  }
}

// Ejecutar migración
migrateUsers()
  .then(() => {
    console.log('✨ Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  });
