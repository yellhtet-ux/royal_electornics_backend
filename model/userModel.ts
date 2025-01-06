import {mongoDB}  from "../db/database.ts";
import { ObjectId } from "@db/mongo"

interface User {
    _id: {_oid: string};
    userName: string;
    email: string;
    phoneNumber: string;
    readonly password: string;
    hashed_password: string;
}

const userCollection = () => mongoDB.getDatabase("users").collection<User>("user");

export const UserModel = {
    async findAllUsers() {
        return await userCollection().find({}).toArray();
    },

    async createUser(user: Omit<User,"_id">) {
        return await userCollection().insertOne(user);
    },

    async deleteUser(id: string) {
        return await userCollection().deleteOne({_id: new ObjectId(id)});
    }
};