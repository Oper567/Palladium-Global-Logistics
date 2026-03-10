import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
// 🚨 CRITICAL FIX: Import Clerk's server-side auth to protect your storage
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

// This defines the "route" for our uploads. 
export const ourFileRouter = {
  
  // We name this route "vehicleImageUploader"
  vehicleImageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
  
    // 1. MIDDLEWARE: This runs BEFORE the upload begins to verify permissions
    .middleware(async ({ req }) => {
      // 🚨 CRITICAL UPGRADE: auth() must be awaited in Clerk v5!
      // We also destructure sessionClaims to check the user's role metadata.
      const { userId, sessionClaims } = await auth();
      
      // 🚨 CRITICAL UPGRADE: Strict Admin Verification
      // If there is no active session OR the user is not an Admin, block the upload.
      // This physically stops normal users/hackers from bloating your UploadThing storage.
      if (!userId || sessionClaims?.metadata?.role !== "admin") {
        console.warn(`Unauthorized upload attempt intercepted. User ID: ${userId || "Anonymous"}`);
        throw new UploadThingError("Unauthorized: Only verified Administrators can upload fleet assets.");
      }

      // Whatever you return here is passed to the `onUploadComplete` function below
      return { uploaderId: userId };
    })
    
    // 2. ON UPLOAD COMPLETE: This runs AFTER the file is safely in the cloud
    .onUploadComplete(async ({ metadata, file }) => {
      // Secure logging: You now know exactly WHICH admin uploaded the file
      console.log(`Upload complete! Action performed by Admin ID: ${metadata.uploaderId}`);
      console.log("Secure File URL:", file.url);
      
      // We return the URL so our frontend can attach it to the Supabase database entry
      return { url: file.url };
    }),

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;