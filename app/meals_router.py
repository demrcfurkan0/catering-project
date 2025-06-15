from fastapi import APIRouter, HTTPException, Depends
from typing import List
from schemas import Meal, MealCreate, MealUpdate
import crud

router = APIRouter()

@router.post("/", response_model=Meal, status_code=201)
async def create_new_meal(meal: MealCreate):
    return await crud.create_meal(meal)

@router.get("/", response_model=List[Meal])
async def read_all_meals():
    return await crud.get_all_meals()

@router.get("/{meal_id}", response_model=Meal)
async def read_meal_by_id(meal_id: str):
    meal = await crud.get_meal_by_id(meal_id)
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")
    return meal

@router.patch("/{meal_id}", response_model=Meal)
async def update_existing_meal(meal_id: str, meal_update: MealUpdate):
    updated_meal = await crud.update_meal(meal_id, meal_update)
    if updated_meal is None:
        raise HTTPException(status_code=404, detail="Meal not found or no new data to update")
    return updated_meal

@router.delete("/{meal_id}", status_code=204)
async def delete_existing_meal(meal_id: str):
    success = await crud.delete_meal(meal_id)
    if not success:
        raise HTTPException(status_code=404, detail="Meal not found")
    return {"ok": True}

@router.get("/by_month/{year}/{month}", response_model=List[Meal])
async def read_meals_by_month(year: int, month: int):
    """
    Belirli bir aydaki tüm yemekleri getirir.
    """
    if not (2020 <= year <= 2050 and 1 <= month <= 12):
        raise HTTPException(status_code=400, detail="Invalid year or month")
    
    return await crud.get_meals_by_month(year=year, month=month)