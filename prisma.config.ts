import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // 🚨 CRITICAL FOR SUPABASE: The Prisma CLI uses this URL to build your tables.
    // By pointing this to DIRECT_URL, we safely bypass the pooler for structural changes.
    url: env("DIRECT_URL"),
  },
});