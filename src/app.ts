import { envs } from "./config";
import { MongoDatabase } from "./data/mongodb";
import { PostgresDatabase } from "./data/postgres";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";





(() => {
    main();
})();

async function main() {
    // Feature flag para migración gradual
    const usePostgres = process.env.USE_POSTGRES === 'true';

    if (usePostgres) {
        console.log('🐘 Using PostgreSQL');
        await PostgresDatabase.connect();
    } else {
        console.log('🍃 Using MongoDB');
        await MongoDatabase.connect({
            dbName: envs.MONGO_DB_NAME,
            mongoUrl: envs.MONGO_URL,
        });
    }

    // Iniciar servidor
    new Server({
        port: envs.PORT,
        routes: AppRoutes.routes
    
    })
    .start();
}