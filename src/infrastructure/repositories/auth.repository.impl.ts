import type { AuthDataSource, AuthRepository, RegisterUserDto, UserEntity } from "../../domain";






export class AuthRepositoryImpl implements AuthRepository {
    
    constructor(

        private readonly authDatasource: AuthDataSource,

    ){}
    
    
    register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
       return this.authDatasource.register(registerUserDto);
    }



}