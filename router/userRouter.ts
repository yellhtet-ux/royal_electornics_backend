import { Hono } from "@hono/hono";
import { UserModel } from "../model/userModel.ts";
import {create} from "https://deno.land/x/djwt@v3.0.2/mod.ts"
import { hash, verify } from "@ts-rex/bcrypt"
import { valid } from "https://deno.land/x/validation@v0.4.0/email.ts"

const userRouter = new Hono();

export const key = await crypto.subtle.generateKey(
    { name: "HMAC", hash: "SHA-512" },
    true,
    ["sign", "verify"],
  );

userRouter.post ("/login", async (ctx) => {
    try {
        const {email} = await ctx.req.json();
        const users = await UserModel.findAllUsers();
        if (!users) {
            return ctx.json({ message: "Error fetching users" }, 500);
        }else {
            const usr = users.find(usr => usr.email === email && verify(usr.password,usr.hashed_password));
            if (usr == undefined || usr == null || !usr) {
                return ctx.json({"message": "Invalid username and password!"},404);
            }else {
                const jwt = await create({ alg: "HS512", type: "JWT" }, { userName: usr.userName } ,key);
                if (!jwt) {
                    return ctx.json({"message": "Token is not valid","success": false},500)
                }else {
                    return ctx.json({"success": true,"token": jwt},200);
                }
            }
        }
    }catch(err) {
        console.error("Error Fetching Users Data", err);
    }
});


userRouter.post("/signup", async (ctx) => {
    const jsonUsr = await ctx.req.json();
    const hashedPassword =  hash(jsonUsr.password);
    jsonUsr.hashed_password = hashedPassword

    if (!valid(jsonUsr.email)) {
        return ctx.json({"message": "Invalid Email!"},404);
    }
    try {
        await UserModel.createUser(jsonUsr);
        return ctx.json({"message": "User Created Successfully!"},201);
    }catch (error) {
        return ctx.json({"message": "Error Creating User!", error},404);
    }
})


export default userRouter;