import 'module-alias/register';
import express, { Request, Response } from "express";
import dotenv from "dotenv"
import routes from "./routes";
import cors from 'cors';
dotenv.config()

class App {
  private app: express.Application;
  private port: string;

  constructor() {
    this.app = express();
    this.port = process.env.APP_PORT;
    this.app.use(express.json());
    this.app.use(cors());
    routes(this.app);

    this.app.use((req: Request, res: Response) => {
      res.status(404).json({message: 'Not found!'});
    })
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`App start in port ${this.port}`)
    });
  }
}

const app = new App();
app.listen();