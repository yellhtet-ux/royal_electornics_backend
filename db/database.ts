import { MongoClient, Database } from "https://deno.land/x/mongo@v0.31.2/mod.ts";

class MongoDB {
  private static instance: MongoDB;
  private client: MongoClient;
  private databases: Map<string, Database> = new Map();

  private constructor() {
    this.client = new MongoClient();
  }

  static getInstance(): MongoDB {
    if (!MongoDB.instance) {
      MongoDB.instance = new MongoDB();
    }
    return MongoDB.instance;
  }

  async connect(uri: string, dbName: string): Promise<Database> {
    if (!this.databases.has(dbName)) {
      await this.client.connect(uri);
      const db = this.client.database(dbName);
      this.databases.set(dbName, db);
    }
    return this.databases.get(dbName)!;
  }

  getDatabase(dbName: string): Database {
    const db = this.databases.get(dbName);
    if (!db) {
      throw new Error(`Database "${dbName}" not connected. Call connect() first.`);
    }
    return db;
  }
}

export const mongoDB = MongoDB.getInstance();
