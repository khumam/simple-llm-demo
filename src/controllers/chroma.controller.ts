import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb";
import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { Chroma } from "langchain/vectorstores/chroma";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
const client = new ChromaClient();

export default class ChromaController {
  public static createCollection = async (req: Request, res: Response) => {
    try {
      const embeddings = new OpenAIEmbeddingFunction({
        openai_api_key: process.env.OPENAI_API_KEY
      });  
      const collection = await client.createCollection({
        name: req.body.collectionName,
        embeddingFunction: embeddings
      });
      const result = await client.getCollection({
        name: req.body.collectionName,
        embeddingFunction: embeddings
      });
      return res.status(200).json({ data: result });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  public static deleteCollection = async (req: Request, res: Response) => {
    try {
      const deleteClient = await client.deleteCollection({ name: req.body.collectionName });
      const collection = await client.getCollection({ name: req.body.collectionName });
      return res.status(200).json({ data: collection });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  public static storeDataset = async (req: Request, res: Response) => {
    try {
      let ids: string[] = [];
      let metadatas: any[] = [];
      let documents: string[] = [];
      const embeddings = new OpenAIEmbeddingFunction({
        openai_api_key: process.env.OPENAI_API_KEY
      }); 
      const collection = await client.getCollection({
        name: req.body.collectionName,
        embeddingFunction: embeddings
      });
      const data = req.body.data;
      data.forEach((item: any) => {
        ids.push(uuidv4());
        metadatas.push(item.metadata);
        documents.push(item.document);
      });
      await collection.add({ ids, metadatas, documents });
      return res.status(200).json({
        data: {
          ids,
          metadatas,
          documents
      } });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  public static query = async (req: Request, res: Response) => {
    try {
      const embeddings = new OpenAIEmbeddingFunction({
        openai_api_key: process.env.OPENAI_API_KEY
      }); 
      const collection = await client.getCollection({
        name: req.body.collectionName,
        embeddingFunction: embeddings
      });
      const results = await collection.query({
        nResults: req.body.nResults,
        queryTexts: req.body.queryTexts
      });
      console.log(results);
      if (results.distances[0][0] > 0.5) {
        return res.status(200).json({ data: { result: "Maaf kami tidak menemukan data yang relevant. Coba pertanyaan lain" } });
      } else {
        return res.status(200).json({data: { result: results.documents[0][0]}});
      }
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  public static check = async (req: Request, res: Response) => {
    try {
      const collection = await client.getCollection({ name: req.params.collectionName });
      const data = {
        peek: await collection.peek(),
        count: await collection.count()
      }
      return res.status(200).json({data});
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }
}