"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

export async function addResource(formData: FormData, imageUrl: string) {
  try {
    // 1. Secure the Action: Fetch user credentials on the server
    const { userId, sessionClaims } = await auth();

    // 2. Validate Permissions: Ensure the user is an 'admin'
    // We cast sessionClaims as 'any' to easily access custom metadata
    if (!userId || (sessionClaims?.metadata as any)?.role !== "admin") {
      console.warn(`Unauthorized write attempt by: ${userId || "Anonymous"}`);
      return {
        success: false,
        message: "Security Error: Admin privileges required to modify fleet.",
      };
    }

    // 3. Extract and Sanitize Form Data
    const name = (formData.get("name") as string)?.trim();
    const category = formData.get("category") as string;
    const basePrice = (formData.get("basePrice") as string)?.trim();
    const status = formData.get("status") as string;

    // 4. Data Validation Guard
    if (!name || !category || !basePrice || !status) {
      return { 
        success: false, 
        message: "Validation Error: All fields are mandatory." 
      };
    }

    // 5. Database Operation (Supabase via Prisma)
    await prisma.resource.create({
      data: {
        name,
        category,
        basePrice,
        status,
        imageUrl: imageUrl || null,
      },
    });

    // 6. Cache Invalidation: Force Next.js to fetch fresh data on next visit
    revalidatePath("/dashboard");
    revalidatePath("/admin");
    revalidatePath("/");

    return { 
      success: true, 
      message: `${name} synchronized and deployed successfully.` 
    };

  } catch (error) {
    console.error("Supabase Database Error [addResource]:", error);
    return { 
      success: false, 
      message: "Sync Failure: Database connection timed out." 
    };
  }
}