import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# .env dosyasındaki değişkenleri yükle
load_dotenv()

MONGO_HOST = os.getenv("MONGO_HOST", "mongo")
MONGO_PORT = os.getenv("MONGO_PORT", "27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "catering_project_db")

MONGO_URL = f"mongodb://{MONGO_HOST}:{MONGO_PORT}"

client = None
db = None

try:
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[MONGO_DB_NAME]
    print(f"Successfully connected to MongoDB at {MONGO_URL}")
except Exception as e:
    print(f"!!! FAILED TO CONNECT TO MONGODB: {e}")

# 'db' nesnesinin varlığını doğru şekilde kontrol et
if db is not None:
    companies_collection = db.get_collection("companies")
    employees_collection = db.get_collection("employees")
    meals_collection = db.get_collection("meals")
    print(f"Collections initialized for database '{MONGO_DB_NAME}'")
else:
    companies_collection = None
    employees_collection = None
    meals_collection = None
    print("!!! DATABASE NOT AVAILABLE, COLLECTIONS ARE NONE")