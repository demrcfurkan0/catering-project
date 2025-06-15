from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Sadece router dosyalarını import et
from companies_router import router as companies_router
from employees_router import router as employees_router
from meals_router import router as meals_router

app = FastAPI(title="Catering Management API")

origins = [
    "http://localhost:5173",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router'ları ana uygulamaya dahil et
# Her router'ın kendi prefix'i ve tag'i olmalı
app.include_router(companies_router, prefix="/companies", tags=["Companies"])
app.include_router(employees_router, prefix="/employees", tags=["Employees"])
app.include_router(meals_router, prefix="/meals", tags=["Meals"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Catering Management API"}