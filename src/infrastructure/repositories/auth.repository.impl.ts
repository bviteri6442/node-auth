import type { AuthDataSource, AuthRepository, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";






export class AuthRepositoryImpl implements AuthRepository {
    
    constructor(

        private readonly authDatasource: AuthDataSource,

    ){}
    login(loginUserDto: LoginUserDto): Promise<UserEntity> {
        return this.authDatasource.login(loginUserDto);
    }
    
    
    register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
       return this.authDatasource.register(registerUserDto);
    }

    getAllUsers(): Promise<UserEntity[]> {
        return this.authDatasource.getAllUsers();
    }

}