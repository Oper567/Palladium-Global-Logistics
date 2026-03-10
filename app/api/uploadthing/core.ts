import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  vehicleImageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const { userId, sessionClaims } = await auth();

      // 🚨 TypeScript FIX: Cast metadata as 'any' so TS knows 'role' exists
      if (!userId || (sessionClaims?.metadata as any)?.role !== "admin") {
        console.warn(`Unauthorized upload attempt intercepted. User ID: ${userId || "Anonymous"}`);
        throw new UploadThingError("Unauthorized: Only verified Administrators can upload fleet assets.");
      }

      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;