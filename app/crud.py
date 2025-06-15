from typing import List, Optional
from bson import ObjectId
from database import db
from schemas import (
    Company, CompanyCreate,
    Employee, EmployeeCreate,
    Meal, MealCreate, MealUpdate
)

# --- Company Operations ---
async def create_company(company: CompanyCreate) -> Company:
    company_dict = company.model_dump()
    result = await db.companies.insert_one(company_dict)
    created_company_data = await db.companies.find_one({"_id": result.inserted_id})
    if created_company_data:
        return Company.model_validate(created_company_data)
    return None

async def get_all_companies() -> List[Company]:
    companies = []
    async for company_data in db.companies.find():
        companies.append(Company.model_validate(company_data))
    return companies

# --- Employee Operations ---
async def create_employee(employee: EmployeeCreate) -> Employee:
    employee_dict = employee.model_dump()
    result = await db.employees.insert_one(employee_dict)
    created_employee_data = await db.employees.find_one({"_id": result.inserted_id})
    if created_employee_data:
        return Employee.model_validate(created_employee_data)
    return None

async def get_all_employees() -> List[Employee]:
    employees = []
    async for employee_data in db.employees.find():
        employees.append(Employee.model_validate(employee_data))
    return employees

# --- Meal Operations (EKSİK OLAN FONKSİYONLARI EKLİYORUZ) ---
async def create_meal(meal: MealCreate) -> Meal:
    meal_dict = meal.model_dump()
    result = await db.meals.insert_one(meal_dict)
    created_meal_data = await db.meals.find_one({"_id": result.inserted_id})
    if created_meal_data:
        return Meal.model_validate(created_meal_data)
    return None

async def get_all_meals() -> List[Meal]:
    meals = []
    async for meal_data in db.meals.find():
        meals.append(Meal.model_validate(meal_data))
    return meals

async def get_meal_by_id(meal_id: str) -> Optional[Meal]:
    meal_data = await db.meals.find_one({"_id": ObjectId(meal_id)})
    if meal_data:
        return Meal.model_validate(meal_data)
    return None

async def update_meal(meal_id: str, meal_update: MealUpdate) -> Optional[Meal]:
    update_data = meal_update.model_dump(exclude_unset=True)
    if len(update_data) >= 1:
        result = await db.meals.update_one(
            {"_id": ObjectId(meal_id)}, {"$set": update_data}
        )
        if result.modified_count == 1:
            updated_meal = await get_meal_by_id(meal_id)
            return updated_meal
    return None

async def delete_meal(meal_id: str) -> bool:
    result = await db.meals.delete_one({"_id": ObjectId(meal_id)})
    return result.deleted_count == 1

async def get_meals_by_month(year: int, month: int) -> List[Meal]:
    """
    Belirtilen yıl ve aydaki tüm yemekleri getirir.
    """
    meals = []
    # find() metoduna sorgu filtresini veriyoruz
    async for meal_data in db.meals.find({"year": year, "month": month}):
        meals.append(Meal.model_validate(meal_data))
    return meals