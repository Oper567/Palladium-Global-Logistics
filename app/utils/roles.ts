import { auth } from "@clerk/nextjs/server";

export async function checkRole(role: string) {
  const { sessionClaims } = await auth();

  // If a brand new user signs up, their metadata object might not exist yet.
  // Without the question mark, Next.js would throw a "Cannot read properties of undefined" 500 error.
  
  // 🚨 TypeScript FIX: Cast metadata as 'any' so TS knows 'role' exists
  return (sessionClaims?.metadata as any)?.role === role;
}