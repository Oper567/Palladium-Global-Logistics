"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
// 🚨 CRITICAL UPGRADE: We must import auth to secure the Server Action
import { auth } from "@clerk/nextjs/server";

export async function addResource(formData: FormData, imageUrl: string) {
  try {
    // 🚨 CRITICAL UPGRADE: Server-Side Authorization Check
    // This physically prevents unauthorized API requests from writing to Supabase.
    const { userId, sessionClaims } = await auth();

    // Check if they are logged in AND if their Clerk role is exactly "admin"
    if (!userId || sessionClaims?.metadata?.role !== "admin") {
      console.warn(`Unauthorized fleet creation attempt by User: ${userId || "Anonymous"}`);
      return {
        success: false,
        message: "Security Error: Only verified Administrators can modify the fleet.",
      };
    }

    // 1. Grab the typed data from the Admin form
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const basePrice = formData.get("basePrice") as string;
    const status = formData.get("status") as string;

    // 2. Basic Validation: Prevent empty submissions from polluting your database
    if (!name || !category || !basePrice || !status) {
      return { 
        success: false, 
        message: "Missing required fields. Please fill out the entire form." 
      };
    }

    // 3. Save it directly to your Supabase Postgres Database
    await prisma.resource.create({
      data: {
        name: name.trim(),
        category,
        basePrice: basePrice.trim(),
        status,
        imageUrl: imageUrl || null, // Fallback if the upload fails or is skipped
      },
    });

    [Image of Next.js Server Actions security architecture]

    // 4. Instantly clear the Next.js cache so the new vehicle shows up immediately
    revalidatePath("/dashboard"); // Updates the customer portal
    revalidatePath("/"); // Updates the homepage FleetGrid
    revalidatePath("/admin"); // 🚨 UPGRADE: Refreshes the admin panel itself

    return { 
      success: true, 
      message: `${name} has been added to the fleet successfully!` 
    };

  } catch (error) {
    // 5. Safe Error Handling
    console.error("Supabase Database Error [addResource]:", error);
    return { 
      success: false, 
      message: "A database connection error occurred. Please try again." 
    };
  }
}