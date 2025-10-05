import jwt, { type SignOptions } from 'jsonwebtoken';
import { envs } from './envs';


const JWT_SEED = envs.JWT_SEED;

export class JwtAdapter {

    
    static async generateToken( 
        payload: object, 
        duration: string ='2h' ): Promise<string|null> {

        return new Promise( (resolve) => {

            //TODO: generacion del seed

            jwt.sign( payload, JWT_SEED, { expiresIn: duration } as SignOptions, (err, token) => {
                
                if (err) return resolve(null);
                
                resolve(token!);
                
            });


        });
        
    }



    static  validateToken<T>( token: string ): Promise<T|null> {
        return new Promise( (resolve) => {
            jwt.verify( token, JWT_SEED, (err, decoded) => {
                if (err) return resolve(null);

                resolve( decoded as T );
            });
        });
    }

}




