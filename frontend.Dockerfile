# 1. Aşama: Bağımlılıkları kur ve uygulamayı build et
FROM node:20-alpine AS builder

# Çalışma dizinini ayarla
WORKDIR /app

# package.json ve package-lock.json dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları kur
RUN npm install

# Tüm proje dosyalarını kopyala
COPY . .

# React uygulamasını build et
RUN npm run build


# 2. Aşama: Build edilen statik dosyaları sunmak için hafif bir web sunucusu kullan
FROM nginx:stable-alpine

# Builder aşamasından build edilmiş dosyaları nginx'in sunacağı dizine kopyala
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx'in 80 portunu dinlemesini sağla (Vite'ın varsayılan portu 5173'tür,
# ancak build sonrası Nginx genellikle 80 portunda sunum yapar)
EXPOSE 80

# Nginx'i başlat
CMD ["nginx", "-g", "daemon off;"]