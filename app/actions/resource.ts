"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

// 🟢 1. CREATE ACTION: Deploys a new asset
export async function addResource(formData: FormData, imageUrl: string) {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId || (sessionClaims?.metadata as any)?.role !== "admin") {
      console.warn(`Unauthorized write attempt by: ${userId || "Anonymous"}`);
      return {
        success: false,
        message: "Security Error: Admin privileges required to modify fleet.",
      };
    }

    const name = (formData.get("name") as string)?.trim();
    const category = formData.get("category") as string;
    const basePrice = (formData.get("basePrice") as string)?.trim();
    const status = formData.get("status") as string;

    if (!name || !category || !basePrice || !status) {
      return { success: false, message: "Validation Error: All fields are mandatory." };
    }

    await prisma.resource.create({
      data: {
        name,
        category,
        basePrice,
        status,
        imageUrl: imageUrl || null,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/admin");
    revalidatePath("/");

    return { success: true, message: `${name} synchronized and deployed successfully.` };
  } catch (error) {
    console.error("Supabase Database Error [addResource]:", error);
    return { success: false, message: "Sync Failure: Database connection timed out." };
  }
}

// 🟠 2. UPDATE ACTION: Modifies existing asset data
export async function updateResource(
  id: string, 
  data: { name: string; basePrice: string; category: string; status: string }
) {
  try {
    // 🚨 DEFENSIVE PROGRAMMING: Secure the Update endpoint
    const { userId, sessionClaims } = await auth();
    if (!userId || (sessionClaims?.metadata as any)?.role !== "admin") {
      return { success: false, message: "Security Error: Unauthorized update attempt blocked." };
    }

    await prisma.resource.update({
      where: { id },
      data: {
        name: data.name,
        basePrice: data.basePrice,
        category: data.category,
        status: data.status,
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/admin");

    return { success: true, message: "Asset successfully updated." };
  } catch (error) {
    console.error("Supabase Database Error [updateResource]:", error);
    return { success: false, message: "Failed to update asset in database." };
  }
}

// 🔴 3. DELETE ACTION: Permanently removes an asset
export async function deleteResource(id: string) {
  try {
    // 🚨 DEFENSIVE PROGRAMMING: Secure the Delete endpoint
    const { userId, sessionClaims } = await auth();
    if (!userId || (sessionClaims?.metadata as any)?.role !== "admin") {
      return { success: false, message: "Security Error: Unauthorized delete attempt blocked." };
    }

    await prisma.resource.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/admin");

    return { success: true, message: "Asset permanently deleted from fleet." };
  } catch (error) {
    console.error("Supabase Database Error [deleteResource]:", error);
    return { success: false, message: "Failed to delete asset from database." };
  }
}