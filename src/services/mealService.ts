import apiClient from "@/lib/apiClient";
import { Meal, MealCreate } from "@/types/meal";

/**
 * Yeni bir yemek oluşturur.
 * @param mealData - Oluşturulacak yemeğin verileri.
 * @returns Oluşturulan yemek nesnesi.
 */
export async function createMeal(mealData: MealCreate): Promise<Meal> {
  const response = await apiClient.post<Meal>("/meals/", mealData);
  return response.data;
}

/**
 * Belirtilen yıl ve aydaki tüm yemekleri getirir. (Calendar sayfası için)
 * @param year - Yıl
 * @param month - Ay (1-12)
 * @returns O aya ait yemeklerin listesi.
 */
export async function getMealsByMonth(year: number, month: number): Promise<Meal[]> {
  const response = await apiClient.get<Meal[]>(`/meals/by_month/${year}/${month}`);
  return response.data;
}

/**
 * Veritabanındaki TÜM yemekleri getirir. (Dashboard için)
 * @returns Tüm yemeklerin listesi.
 */
export async function getAllMeals(): Promise<Meal[]> {
  const response = await apiClient.get<Meal[]>("/meals/");
  return response.data;
}