import {mongoDB}  from "../db/database.ts";
import { ObjectId } from "@db/mongo";

interface Product {
     _id: {_oid: string}
    name: string;
    price : number;
    description: string;
    category : string;
}

type Electronic = Product;

const productCollection = () => mongoDB.getDatabase("products").collection<Electronic>("electronics")

export const ProductModel = {
    async findAllProducts () {
        return await productCollection().find({}).toArray();
    },
    async findProductById (id: string) {
        return await productCollection().findOne({_id: new ObjectId(id)});
    },
    async createProduct (product: Omit<Electronic,"_id">) {
        return await productCollection().insertOne(product);
    },
    async updateProduct (id: string,product: Partial<Electronic>) {
        return await productCollection().updateOne({ _id: new ObjectId(id) }, { $set: product });
    },
    async deleteProduct (id: string) {
        return await productCollection().deleteOne({ _id: new ObjectId(id) });
    }
} 