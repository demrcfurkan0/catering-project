from pydantic import BaseModel, EmailStr, Field, GetJsonSchemaHandler
from pydantic_core import CoreSchema, core_schema # Bu import önemli
from typing import Any, Dict, Optional, List
from bson import ObjectId

# BSON ObjectId'sini Pydantic V2'ye uygun hale getiren EN DOĞRU yardımcı sınıf
class PyObjectId(str):
    @classmethod
    def __get_pydantic_core_schema__(
        cls, source_type: Any, handler: Any
    ) -> CoreSchema:
        def validate(v: str) -> ObjectId:
            if not ObjectId.is_valid(v):
                raise ValueError("Invalid ObjectId")
            return ObjectId(v)

        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema(
                [
                    core_schema.is_instance_schema(ObjectId),
                    core_schema.chain_schema([core_schema.str_schema(), core_schema.no_info_plain_validator_function(validate)])
                ]
            ),
            serialization=core_schema.to_string_ser_schema(),
        )

# --- Company Şemaları ---
class CompanyBase(BaseModel):
    name: str
    email: EmailStr
    address: str

class CompanyCreate(CompanyBase):
    pass

class Company(CompanyBase):
    id: PyObjectId = Field(alias="_id")
    status: str = "Active"
    employeesCount: int = 0

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


# --- Employee Şemaları ---
class EmployeeBase(BaseModel):
    name: str
    email: EmailStr
    position: str

class EmployeeCreate(EmployeeBase):
    company_id: Optional[str] = None

class Employee(EmployeeBase):
    id: PyObjectId = Field(alias="_id")
    shift: str = "N/A"
    company_id: Optional[str] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


# --- Meal Şemaları ---
class MealBase(BaseModel):
    day: int
    month: int
    year: int
    type: str
    menu: str
    count: int

class MealCreate(MealBase):
    pass

class MealUpdate(BaseModel):
    type: Optional[str] = None
    menu: Optional[str] = None
    count: Optional[int] = None

class Meal(MealBase):
    id: PyObjectId = Field(alias="_id")

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}