from fastapi import APIRouter, HTTPException
from typing import List
import crud
# SADECE schemas.py'den import yap
from schemas import Employee, EmployeeCreate

router = APIRouter()

@router.post("/", response_model=Employee, status_code=201)
async def create_new_employee(employee: EmployeeCreate):
    created_employee = await crud.create_employee(employee)
    if not created_employee:
        raise HTTPException(status_code=500, detail="Employee could not be created.")
    return created_employee

@router.get("/", response_model=List[Employee])
async def read_all_employees():
    return await crud.get_all_employees()