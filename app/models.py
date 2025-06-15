from typing import Optional
from bson import ObjectId
from pydantic import GetJsonSchemaHandler
from pydantic.json_schema import JsonSchemaValue
from pydantic import BaseModel, EmailStr, Field

class Company(BaseModel):
    id: str = Field(None, alias="_id")
    name: str
    email: str
    address: str

class CompanyCreate(BaseModel):
    name: str
    email: EmailStr
    address: str

class Employee(BaseModel):
    id: str = Field(None, alias="_id")
    name: str
    email: EmailStr
    position: str

class EmployeeCreate(BaseModel):
    name: str
    email: EmailStr
    position: str

class PyObjectId(ObjectId):

    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class CompanyModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str
    email: str
    address: str
    status: str = "Active"
    employeesCount: int = 0

    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}

class EmployeeModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str
    email: str
    role: str
    shift: str = "N/A"

    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}