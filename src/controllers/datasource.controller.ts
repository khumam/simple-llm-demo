import { PrismaVectorStore } from "langchain/vectorstores/prisma";
import { Request, Response } from "express";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

export default class DataSourceController {
  public static storeDataSource = async (req: Request, res: Response) => {
    try {
      const data = [req.body.data]
      const vectorStore = PrismaVectorStore.withModel(prisma).create(
        new OpenAIEmbeddings(),
        {
          prisma: Prisma,
          tableName: "DataSource",
          vectorColumnName: "vector",
          columns: {
            id: PrismaVectorStore.IdColumn,
            data: PrismaVectorStore.ContentColumn,
          },
        }
      );
      console.log(data);
      await vectorStore.addModels(
        await prisma.$transaction(
          data.map((content) => prisma.dataSource.create({ data: { data: content } }))
        )
      );
      return res.status(200).json({data});
    } catch (err: any) {
      console.log(err);
      return res.status(500).json({
        'message': err.message
      });
    }
  }
}