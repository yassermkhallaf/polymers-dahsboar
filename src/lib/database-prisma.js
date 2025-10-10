// import { PrismaClient } from "../generated/prisma";
import { PrismaClient } from "@prisma/client";
// Initialize PrismaClient only once (to avoid multiple instances in development)
const prisma = global.prisma || new PrismaClient();

// In development, reuse the same PrismaClient instance
if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
}

export const db = prisma;
