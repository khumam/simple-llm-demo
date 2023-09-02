import { Request, Response } from "express"
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { HuggingFaceInferenceEmbeddings } from "langchain/embeddings/hf";

export default class HNSWLibController {
  public static storeDatasourceToHNSWLib = async (req: Request, res: Response) => {
    try {
      const embeddings = new HuggingFaceInferenceEmbeddings({
        apiKey: process.env.HUGGINGFACE_KEY
      });
      const vectorStore = await HNSWLib.fromTexts(
        [req.body.data],
        [req.body.metadata], embeddings
      );
      const directory = "../documents";
      await vectorStore.save(directory);
      return res.status(200).json({ result: "ok" });
    } catch (err: any) {
      return res.status(500).json({message: err.message})
    }
  }

  public static processQueryWithHNSWLib = async (req: Request, res: Response) => {
    try {
      const embeddings = new HuggingFaceInferenceEmbeddings({
        apiKey: process.env.HUGGINGFACE_KEY
      });
       const directory = "../documents";
      const loadedVectorStore = await HNSWLib.load(directory, embeddings);
      const result = await loadedVectorStore.similaritySearch(req.body.query, 1);
      return res.status(200).json({ result });
    } catch (err: any) {
      return res.status(500).json({message: err.message})
    }
  }
}