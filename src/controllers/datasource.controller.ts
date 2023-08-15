import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default class DataSourceController {
  public static storeDataSource = async (req: Request, res: Response) => {
    try {
      const data = await prisma.dataSource.create({
        data: {
          data: req.body.data
        }
      });
      return res.status(200).json({ data });
    } catch (err: any) {
      return res.status(500).json({
        'message': err.message
      });
    }
  }
}