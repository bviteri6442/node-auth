import type { PrismaClient } from '@prisma/client';
import { BcryptAdapter } from '../../config';
import { PostgresDatabase } from '../../data/postgres';
import {
  CustomError,
  LoginUserDto,
  UserEntity,
  type RegisterUserDto,
} from '../../domain';
import { AuthDataSource } from '../../domain/datasources/auth.datasource';
import { PrismaUserMapper } from '../mappers/prisma-user.mapper';

type HashFunction = (password: string) => string;
type CompareFunction = (password: string, hashed: string) => boolean;

export class PostgresAuthDatasourceImpl implements AuthDataSource {
  private prisma: PrismaClient;

  constructor(
    private readonly hashPassword: HashFunction = BcryptAdapter.hash,
    private readonly comparePassword: CompareFunction = BcryptAdapter.compare
  ) {
    this.prisma = PostgresDatabase.client;
  }

  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const { email, password } = loginUserDto;

    try {
      // 1. Buscar usuario por email
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw CustomError.badRequest('User not exists - email');
      }

      // 2. Comparar contraseña
      const isMatching = this.comparePassword(password, user.password);
      if (!isMatching) {
        throw CustomError.unauthorized('Invalid credentials');
      }

      // 3. Mapear a entidad
      return PrismaUserMapper.userEntityFromPrisma(user);
    } catch (error) {
      console.error(error);
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }

  async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    const { name, email, password } = registerUserDto;

    try {
      // 1. Verificar si el correo existe
      const exists = await this.prisma.user.findUnique({
        where: { email },
      });

      if (exists) {
        throw CustomError.badRequest('User already exists');
      }

      // 2. Crear usuario con password hasheado
      const user = await this.prisma.user.create({
        data: {
          name,
          email,
          password: this.hashPassword(password),
          roles: ['USER_ROLE'], // Default role
        },
      });

      // 3. Mapear a entidad
      return PrismaUserMapper.userEntityFromPrisma(user);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error(error);
      throw CustomError.internalServer();
    }
  }

  async getAllUsers(): Promise<UserEntity[]> {
    try {
      const users = await this.prisma.user.findMany();
      return users.map(user => PrismaUserMapper.userEntityFromPrisma(user));
    } catch (error) {
      console.error(error);
      throw CustomError.internalServer();
    }
  }
}
