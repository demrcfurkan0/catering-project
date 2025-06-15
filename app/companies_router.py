from fastapi import APIRouter, HTTPException
from typing import List
import crud
# SADECE schemas.py'den import yap
from schemas import Company, CompanyCreate

router = APIRouter()

@router.post("/", response_model=Company, status_code=201)
async def create_new_company(company: CompanyCreate):
    created_company = await crud.create_company(company)
    if not created_company:
        raise HTTPException(status_code=500, detail="Company could not be created.")
    return created_company

@router.get("/", response_model=List[Company])
async def read_all_companies():
    return await crud.get_all_companies()