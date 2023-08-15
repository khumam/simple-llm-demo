import MainController from "../controllers/main.controller";
import DataSourceController from "../controllers/datasource.controller";
import { Router } from "express";
const apiRoute = Router();

apiRoute.post('/datasource', DataSourceController.storeDataSource);
apiRoute.post('/processquery', MainController.processQuery);

export default apiRoute;