"use server";

import { clerkClient } from "@clerk/nextjs/server";
// 🚨 FIX: Added 'app/' to the absolute path alias
import { checkRole } from "@/app/utils/roles"; 
import { revalidatePath } from "next/cache";

export async function setRole(userId: string, role: "admin" | "customer") {
  // 1. Security check: Only an existing Admin can promote/demote others
  const isAdmin = await checkRole("admin");
  if (!isAdmin) {
    return { success: false, message: "Unauthorized: Admin privileges required." };
  }

  try {
    const client = await clerkClient();

    // 2. Update the user metadata in Clerk's database
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: role,
      },
    });

    revalidatePath("/admin"); // Refresh the admin UI
    return { success: true, message: `User role updated to ${role} successfully.` };
  } catch (error) {
    console.error("Clerk Metadata Error:", error);
    return { success: false, message: "Internal Server Error: Failed to update role." };
  }
}