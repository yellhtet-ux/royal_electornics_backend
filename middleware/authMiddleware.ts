import { MiddlewareHandler } from "@hono/hono";
import { verify } from "https://deno.land/x/djwt@v3.0.2/mod.ts";
import { key } from "../router/userRouter.ts";

export const authMiddleware: MiddlewareHandler = async (ctx,next) => {
    const authHeader = ctx.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return ctx.json({"message": "Authorization Header is required!"},401);
    }

    const token = authHeader.substring(7);
    try {
        const payload = await verify(token, key);
        console.log(`Payload: ${payload}`);
        ctx.set("user",payload);
        await next();
    }catch (error) {
        ctx.status(401);
        return ctx.json({"message": "Invalid Token!","error": error});
    }
}