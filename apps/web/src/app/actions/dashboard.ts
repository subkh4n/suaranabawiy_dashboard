"use server";

import { revalidatePath } from "next/cache";
import { db } from "@suara-nabawiy/db";
import { products, audioLibrary, schedules } from "@suara-nabawiy/db/schema";
import { eq } from "drizzle-orm";

/**
 * PRODUCTS ACTIONS
 */

export async function upsertProduct(formData: any) {
  const { id, ...data } = formData;
  
  if (id) {
    // Update
    await db.update(products).set({
      ...data,
      updatedAt: new Date(),
    }).where(eq(products.id, id));
  } else {
    // Insert
    await db.insert(products).values(data);
  }

  revalidatePath("/dashboard/products");
  revalidatePath("/shop");
  return { success: true };
}

export async function deleteProduct(id: number) {
  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/dashboard/products");
  revalidatePath("/shop");
  return { success: true };
}

/**
 * AUDIO LIBRARY ACTIONS
 */

export async function upsertAudio(formData: any) {
  const { id, ...data } = formData;
  
  if (id) {
    await db.update(audioLibrary).set({
      ...data,
    }).where(eq(audioLibrary.id, id));
  } else {
    await db.insert(audioLibrary).values(data);
  }

  revalidatePath("/dashboard/library");
  revalidatePath("/library");
  return { success: true };
}

export async function deleteAudio(id: number) {
  await db.delete(audioLibrary).where(eq(audioLibrary.id, id));
  revalidatePath("/dashboard/library");
  revalidatePath("/library");
  return { success: true };
}

/**
 * SCHEDULES ACTIONS
 */

export async function upsertSchedule(formData: any) {
  const { id, ...data } = formData;
  
  const payload = {
    ...data,
    updatedAt: new Date(),
  };

  if (id) {
    await db.update(schedules).set(payload).where(eq(schedules.id, id));
  } else {
    await db.insert(schedules).values(payload);
  }

  revalidatePath("/dashboard/schedules");
  revalidatePath("/schedules");
  return { success: true };
}

export async function deleteSchedule(id: number) {
  await db.delete(schedules).where(eq(schedules.id, id));
  revalidatePath("/dashboard/schedules");
  revalidatePath("/schedules");
  return { success: true };
}
