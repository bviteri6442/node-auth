import { Router } from 'express';
import { AuthController } from './controller';
import {
  AuthDatasourceImpl,
  AuthRepositoryImpl,
  PostgresAuthDatasourceImpl,
} from '../../infrastructure';
import { AuthMiddleware } from '../middlewares/auth.middleware';



export class AuthRoutes {

    static get routes(): Router {

        const router = Router();

        // Feature flag para elegir datasource
        const usePostgres = process.env.USE_POSTGRES === 'true';

        const database = usePostgres
          ? new PostgresAuthDatasourceImpl()
          : new AuthDatasourceImpl();
        
        const authRepository = new AuthRepositoryImpl(database);
        
        const controller = new AuthController(authRepository);

//definir todas las rutas de la aplicacion

router.post('/login', controller.loginUser);
router.post('/register', controller.registerUser);

router.get('/', [AuthMiddleware.validateJWT], controller.getUsers);




        return router;
    }   

}