import { PrismaClient } from '@prisma/client';

interface Options {
  databaseUrl?: string;
}

export class PostgresDatabase {
  private static prisma: PrismaClient | null = null;

  static async connect(options: Options = {}): Promise<PrismaClient> {
    if (this.prisma) {
      console.log('Already connected to PostgreSQL');
      return this.prisma;
    }

    try {
      const databaseUrl = options.databaseUrl || process.env.DATABASE_URL;
      
      if (!databaseUrl) {
        throw new Error('DATABASE_URL is not defined');
      }

      this.prisma = new PrismaClient({
        datasources: {
          db: {
            url: databaseUrl,
          },
        },
        log: ['query', 'info', 'warn', 'error'],
      });

      await this.prisma.$connect();
      console.log('✅ Connected to PostgreSQL');
      return this.prisma;
    } catch (error) {
      console.error('❌ Error connecting to PostgreSQL:', error);
      throw error;
    }
  }

  static async disconnect(): Promise<void> {
    if (this.prisma) {
      await this.prisma.$disconnect();
      this.prisma = null;
      console.log('Disconnected from PostgreSQL');
    }
  }

  static get client(): PrismaClient {
    if (!this.prisma) {
      throw new Error('PostgresDatabase not connected. Call connect() first.');
    }
    return this.prisma;
  }
}
