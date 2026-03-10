import { createRouteHandler } from "uploadthing/next";
// Import the secure, Clerk-protected router we just built
import { ourFileRouter } from "./core";

/**
 * UploadThing API Route
 * * GET: Handles the initial handshake and configuration requests from the 
 * UploadThing <UploadDropzone /> component on the frontend.
 * * POST: Handles the secure webhook callback from the UploadThing cloud 
 * after a file successfully uploads. This triggers our `onUploadComplete` 
 * function in core.ts.
 */
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});