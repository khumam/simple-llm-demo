import { Request, Response } from "express";
import { OpenAI } from "langchain/llms/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { RetrievalQAChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ContextualCompressionRetriever } from "langchain/retrievers/contextual_compression";
import { LLMChainExtractor } from "langchain/retrievers/document_compressors/chain_extract";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default class MainController {
  public static processQuery = async (req: Request, res: Response) => {
    try {
      const model = new OpenAI({temperature: 0.1});
      const baseCompressor = LLMChainExtractor.fromLLM(model);
      const text = (await prisma.dataSource.findMany()).map((item) => item.data).join('');
      const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
      const docs = await textSplitter.createDocuments([text]);
      const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
      const retriever = new ContextualCompressionRetriever({
        baseCompressor,
        baseRetriever: vectorStore.asRetriever(),
      });
      const chain = RetrievalQAChain.fromLLM(model, retriever);
      const result = await chain.call({ query: req.body.query });
      return res.status(200).json({ data: {text: result.text.trim()} });
    } catch (err: any) {
      return res.status(500).json({message: err.message})
    }
  }
}