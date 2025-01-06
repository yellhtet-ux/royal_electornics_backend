import {Hono} from '@hono/hono';
import productRouter from "../router/productRouter.ts";
import userRouter from "../router/userRouter.ts";
import { mongoDB } from "../db/database.ts";


const app = new Hono();

const PRODUCT_DB_NAME = "products"; 
const USER_DB_NAME = "users";
const DB_URI = "mongodb+srv://dbadmin:adminn123@royal.gvs9g.mongodb.net/products?authMechanism=SCRAM-SHA-1";

try {
    await mongoDB.connect(DB_URI,PRODUCT_DB_NAME);
    await mongoDB.connect(DB_URI,USER_DB_NAME);
}catch (error) {
    console.error("Error starting server!", error);
}

app.route('/products', productRouter);
app.route("/auth", userRouter);

app.notFound((ctx) => {
    return ctx.text("Not found", 404);  
});

app.use('*', async (ctx, next) => {
    console.log(`Incoming request: ${ctx.req.method} ${ctx.req.url}`);
    await next();
});


Deno.serve({ port: 2121 }, app.fetch);



