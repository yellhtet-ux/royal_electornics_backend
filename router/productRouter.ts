import { Hono } from "@hono/hono";
import { ProductModel } from "../model/productModel.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";

const productRouter = new Hono();

productRouter.get("/",authMiddleware,async (ctx) => {
  const products = await ProductModel.findAllProducts();
  if (!products) {
    return ctx.json({ "data": [], "message": "No products found" }, 404);
  } else {
    return ctx.json(
      {
        "data": [
          ...products,
        ],
        "total": products.length,
      },
      200,
    );
  }
});

productRouter.get("/:id", async (ctx) => {
  const id = ctx.req.param("id");
  console.log(id);
  if (!id) {
    return ctx.text("Product ID is required", 400);
  }
  try {
    const product = await ProductModel.findProductById(id);
    if (!product) {
      return ctx.json({ "error": "Product not found" }, 404);
    }
    return ctx.json(product, 200);
  } catch (error) {
    return ctx.text(
      `An error occurred while fetching the product: ${error}`,
      500,
    );
  }
});

productRouter.post("/", async (ctx) => {
  const body = await ctx.req.json();
  const product = await ProductModel.createProduct(body);
//   ctx.res.headers.set("Location", `/${product}`);
  return ctx.json(product, 201);
});

productRouter.put("/:id", async (ctx) => {
  const id = ctx.req.param("id");
  const body = await ctx.req.json();
  await ProductModel.updateProduct(id, body);
  return ctx.newResponse(null, 204);
});

productRouter.delete("/:id", async (ctx) => {
  const id = ctx.req.param("id");
  console.log(`Deleted Product ID is: ${id}`);
  const deletedProduct = await ProductModel.deleteProduct(id);
  if (!deletedProduct) ctx.text("Product is not deleted.", 404);
  return ctx.newResponse(null, 204);
});

export default productRouter;
