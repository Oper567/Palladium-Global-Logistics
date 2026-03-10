import { auth } from "@clerk/nextjs/server";

// 🚨 UPGRADE: Explicitly define the return type as Promise<boolean> for strict type safety
export const checkRole = async (role: "admin"): Promise<boolean> => {
  const { sessionClaims } = await auth();
  
  // 🚨 UPGRADE: Added optional chaining to `metadata` (?.) 
  // If a brand new user signs up, their metadata object might not exist yet.
  // Without the question mark, Next.js would throw a "Cannot read properties of undefined" 500 error.
  return sessionClaims?.metadata?.role === role;
};