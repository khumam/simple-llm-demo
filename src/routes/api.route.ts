import MainController from "../controllers/main.controller";
import DataSourceController from "../controllers/datasource.controller";
import { Router } from "express";
const apiRoute = Router();

apiRoute.post('/storeDataSource', DataSourceController.storeDataSource);
apiRoute.post('/processQuery', MainController.processQuery);
apiRoute.post('/processQueryFromVectorStore', MainController.processQueryFromVectorStore);

export default apiRoute;