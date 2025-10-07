import type { Request, Response } from "express";
import { AuthRepository, CustomError, LoginUser, LoginUserDto, RegisterUser, RegisterUserDto } from "../../domain";
import { JwtAdapter } from "../../config";

export class AuthController {
  //DI
    constructor(

        private readonly authRepository: AuthRepository,



    ) {}

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        console.log(error); //winston
        return res.status(500).json({ error: 'Internal Server Error ' });
    }


    registerUser =  (req: Request, res: Response) => {
        //TODO
        const [error, registerUserDto] = RegisterUserDto.create(req.body);
        if (error) return res.status(400).json({ error });
        
        new RegisterUser(this.authRepository)
        .execute(registerUserDto!)
        .then( data => res.json(data) )
        .catch( error => this.handleError(error, res) );
    }

    loginUser =  (req: Request, res: Response) => {
        //TODO
        const [error, loginUserDto] = LoginUserDto.create(req.body);
        if (error) return res.status(400).json({ error });
        
        new LoginUser(this.authRepository)
        .execute(loginUserDto!)
        .then( data => res.json(data) )
        .catch( error => this.handleError(error, res) );
    }


    getUsers = async (req: Request, res: Response) => {
        try {
            const users = await this.authRepository.getAllUsers();
            res.json({
                users,
                user: req.body.user
            });
        } catch (error) {
            this.handleError(error, res);
        }
    }



}