import { Hono } from "hono";
import { handle } from "hono/vercel";
import bachesRoute from "@/features/batches/server/route";

const app = new Hono().basePath("/api");
app.route("/batches", bachesRoute);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
