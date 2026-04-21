"use server";

import { revalidatePath } from "next/cache";
import { 
  createProduct, updateProduct, deleteProduct as apiDeleteProduct,
  createAudio, updateAudio, deleteAudio as apiDeleteAudio,
  createSchedule, updateSchedule, deleteSchedule as apiDeleteSchedule
} from "@/lib/api-client";

/**
 * PRODUCTS ACTIONS
 */

export async function upsertProduct(formData: any) {
  const { id, ...data } = formData;
  
  if (id) {
    await updateProduct(id, data);
  } else {
    await createProduct(data);
  }

  revalidatePath("/dashboard/products");
  revalidatePath("/shop");
  return { success: true };
}

export async function deleteProduct(id: number) {
  await apiDeleteProduct(id);
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
    await updateAudio(id, data);
  } else {
    await createAudio(data);
  }

  revalidatePath("/dashboard/library");
  revalidatePath("/library");
  return { success: true };
}

export async function deleteAudio(id: number) {
  await apiDeleteAudio(id);
  revalidatePath("/dashboard/library");
  revalidatePath("/library");
  return { success: true };
}

/**
 * SCHEDULES ACTIONS
 */

export async function upsertSchedule(formData: any) {
  const { id, ...data } = formData;

  if (id) {
    await updateSchedule(id, data);
  } else {
    await createSchedule(data);
  }

  revalidatePath("/dashboard/schedules");
  revalidatePath("/schedules");
  return { success: true };
}

export async function deleteSchedule(id: number) {
  await apiDeleteSchedule(id);
  revalidatePath("/dashboard/schedules");
  revalidatePath("/schedules");
  return { success: true };
}
