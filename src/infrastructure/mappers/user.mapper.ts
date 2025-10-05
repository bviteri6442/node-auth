import { CustomError, UserEntity } from "../../domain";





export class UserMapper {

    static userEntityFromObject(object: {[key: string]: any}): UserEntity {


        const {id,_id, name, email, password, roles} = object;
        {
        if(!id || !_id) {
            throw CustomError.badRequest('Invalid missing id');
        }

        if (!name ) throw CustomError.badRequest('Invalid missing name');
        if (!email ) throw CustomError.badRequest('Invalid missing email');
        if (!password ) throw CustomError.badRequest('Invalid missing password');
        if (!roles ) throw CustomError.badRequest('Invalid missing roles');
        
        return new UserEntity(
            _id || id,
            name,
            email,
            password,
            roles,
        )
    }


    }   
}   