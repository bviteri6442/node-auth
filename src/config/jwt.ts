import jwt, { type SignOptions } from 'jsonwebtoken';




export class JwtAdapter {

    static async generateToken( 
        payload: object, 
        duration: string ='2h' ): Promise<string|null> {

        return new Promise( (resolve) => {

            //TODO: generacion del seed

            jwt.sign( payload, 'SEED', { expiresIn: duration } as SignOptions, (err, token) => {
                
                if (err) return resolve(null);
                
                resolve(token!);
                
            });


        });
        
    }



    static  validateToken( token: string )  {
        return new Promise( (resolve) => {
            jwt.verify( token, 'SEED', (err, decoded) => {
                if (err) return resolve(null);

                resolve( decoded );
            });
        });
    }

}




