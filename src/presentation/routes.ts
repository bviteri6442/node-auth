import { Router } from 'express';
import { AuthRoutes } from './auth/routes';



export class AppRoutes {

    static get routes(): Router {

        const router = Router();

//definir todas las rutas de la aplicacion

router.use('/api/auth', AuthRoutes.routes);


        return router;
    }   

}