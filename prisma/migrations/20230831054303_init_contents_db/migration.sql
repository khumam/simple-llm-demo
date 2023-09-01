-- CreateTable
CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE "DataSource" (
    "id" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "vector" vector,

    CONSTRAINT "DataSource_pkey" PRIMARY KEY ("id")
);
