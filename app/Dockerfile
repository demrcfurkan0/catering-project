# Python 3.11'i temel al
FROM python:3.11

# Çalışma dizinini ayarla
WORKDIR /app

# Bağımlılık dosyasını kopyala
COPY requirements.txt .

# Bağımlılıkları kur. Bu komut 'python-dotenv' dahil her şeyi kurmalı.
RUN pip install --no-cache-dir -r requirements.txt

# Projenin geri kalanını kopyala
COPY . .

# Bu satır genellikle docker-compose.yml'deki 'command' ile ezilir,
# ama burada olması iyi bir pratiktir.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8011"]