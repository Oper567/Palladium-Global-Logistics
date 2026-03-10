import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

// 🚨 CRITICAL: We import the TYPES, not the actual router code. 
// This keeps your frontend bundle size small and secure.
import type { OurFileRouter } from "@/app/api/uploadthing/core";

/**
 * Type-safe UploadThing Components
 * * By passing <OurFileRouter> into these generators, we ensure full, 
 * end-to-end type safety. When you use <UploadDropzone> in your Admin Panel, 
 * your editor will auto-complete the `endpoint="vehicleImageUploader"` prop 
 * and throw a red error if you misspell it!
 */
export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();