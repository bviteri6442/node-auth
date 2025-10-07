import type { User as PrismaUser } from '@prisma/client';
import { CustomError, UserEntity } from '../../domain';

export class PrismaUserMapper {
  static userEntityFromPrisma(prismaUser: PrismaUser): UserEntity {
    const { id, name, email, password, roles, img } = prismaUser;

    if (!id) throw CustomError.badRequest('Invalid missing id');
    if (!name) throw CustomError.badRequest('Invalid missing name');
    if (!email) throw CustomError.badRequest('Invalid missing email');
    if (!password) throw CustomError.badRequest('Invalid missing password');
    if (!roles || roles.length === 0) {
      throw CustomError.badRequest('Invalid missing roles');
    }

    return new UserEntity(
      id,         // UUID en string
      name,
      email,
      password,
      roles,
      img || undefined
    );
  }

  static userEntityFromObject(object: { [key: string]: any }): UserEntity {
    // Para compatibilidad con código existente
    return this.userEntityFromPrisma(object as PrismaUser);
  }
}
