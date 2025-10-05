import { JwtAdapter } from "../../../config";
import type { LoginUserDto } from "../../dtos/auth/login-user.dto";
import type { RegisterUserDto } from "../../dtos/auth/register-user.dto";
import { CustomError } from "../../errors/custom.error";
import type { AuthRepository } from "../../repositories/auth.repository";



interface UserToken {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    }   
}


type SingToken = (payload: object, duration?: string) => Promise<string | null>;

interface LoginUserUseCase {
    execute(registerUserDto: RegisterUserDto ): Promise<UserToken>;
}


export class LoginUser implements LoginUserUseCase {
    

    constructor(
        private readonly authRepository: AuthRepository,
        private readonly singToken: SingToken = JwtAdapter.generateToken,
    ) {}

    


    async execute (loginUserDto: LoginUserDto): Promise<UserToken> {

        //crear usuario
        const user = await this.authRepository.login(loginUserDto);


        //generar token
        const token = await this.singToken({ id: user.id }, '2h');
        if (!token) throw CustomError.internalServer('Error generating token');



        return {
            token: token,
            user:{
                id: user.id,
                name: user.name,
                email: user.email,
            }
        }
    }
}