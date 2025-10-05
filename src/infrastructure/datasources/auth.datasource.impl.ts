import { BcryptAdapter } from "../../config";
import { UserModel } from "../../data/mongodb";
import { CustomError, UserEntity, type RegisterUserDto } from "../../domain";
import { AuthDataSource } from "../../domain/datasources/auth.datasource"
import { UserMapper } from "../mappers/user.mapper";

type HashFunction = (password: string) => string;
type CompareFunction = (password: string, hashed: string) => boolean;


export class AuthDatasourceImpl implements AuthDataSource{
    

    
    constructor(
        private readonly hashPassword: HashFunction = BcryptAdapter.hash,
        private readonly comparePassword: CompareFunction = BcryptAdapter.compare,
    ){}



    async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
        const {  name, email, password } = registerUserDto;
    
        try {

            //1. verificar si el correo existe

            const exists = await UserModel.findOne({email: email});
            if(exists) throw CustomError.badRequest('User already exists');

            const user = await UserModel.create({
                name: name,
                email: email,
                password: this.hashPassword(password),
                
            });
            //2. hash  de la contraseña 

            await user.save();


            //3. mapear la respuesta a la entidad
            // TODO: falta un mapper
            return UserMapper.userEntityFromObject(user);

            
        } catch (error) {
            if (error instanceof CustomError) {
            throw error;
        
        }
        throw CustomError.internalServer();

        }
    }

}