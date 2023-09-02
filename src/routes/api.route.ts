import MainController from "../controllers/main.controller";
import DataSourceController from "../controllers/datasource.controller";
import { Router } from "express";
import HNSWLibController from "../controllers/hnswlib.controller";
import ChromaController from "../controllers/chroma.controller";
const apiRoute = Router();

apiRoute.post('/storeDataSource', DataSourceController.storeDataSource);
apiRoute.post('/storeDataSourceSupabase', DataSourceController.storeDataSourceSupabase);
apiRoute.post('/processQuery', MainController.processQuery);
apiRoute.post('/processQueryFromVectorStore', MainController.processQueryFromVectorStore);
apiRoute.post('/processQueryFromVectorStoreFromSupabase', MainController.processQueryFromVectorStoreFromSupabase);
apiRoute.post('/processQueryWithHNSWLib', HNSWLibController.processQueryWithHNSWLib);
apiRoute.post('/storeDatasourceToHNSWLib', HNSWLibController.storeDatasourceToHNSWLib);
apiRoute.post('/chroma/createCollection', ChromaController.createCollection);
apiRoute.post('/chroma/storeDataset', ChromaController.storeDataset);
apiRoute.post('/chroma/query', ChromaController.query);
apiRoute.delete('/chroma/deleteCollection', ChromaController.deleteCollection);
apiRoute.get('/chroma/check/:collectionName', ChromaController.check);

export default apiRoute;