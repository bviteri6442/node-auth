import mongoose from "mongoose";


interface Options {
    mongoUrl: string;
    dbName: string;
}


export class MongoDatabase {
  
    static async connect(options: Options) {
        // Implementation for connecting to MongoDB

        const { mongoUrl, dbName } = options;



        try {
           await mongoose.connect(mongoUrl, {
               dbName: dbName
           });

              console.log("Connected to MongoDB");
              return true;

        } catch (error) {
            console.log("Error connecting to MongoDB:", error);
            throw error;
        }

    }
    
    
}
    
