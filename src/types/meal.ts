export interface Meal {
  _id: string;
  day: number;
  month: number;
  year: number;
  type: string;
  menu: string;
  count: number;
}

export type MealCreate = Omit<Meal, '_id'>;