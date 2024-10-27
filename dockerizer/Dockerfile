# 1. İlk olarak, Node.js'in resmi imajını kullanarak bir temel imaj oluşturun.
FROM node:18-alpine AS build

# 2. Çalışma dizinini oluşturun.
WORKDIR /app

# 3. package.json ve package-lock.json (ya da yarn.lock) dosyalarını kopyalayın.
COPY package*.json ./

# 4. Uygulamanın bağımlılıklarını yükleyin. production argümanını true olarak belirleyin.
RUN npm install --production

# 5. Geri kalan uygulama dosyalarını kopyalayın.
COPY . .

# 6. Next.js uygulamasını build edin.
RUN npm run build

# 7. Uygulamanız için uploads klasörünü oluşturun ve izinleri ayarlayın.
RUN mkdir -p ./public/uploads && chmod -R 755 ./public/uploads

# 8. Uygulamanızı production modda çalıştırmak için minimal bir Node.js imajı kullanın.
FROM node:18-alpine AS runner

# 9. Çalışma dizinini tekrar oluşturun.
WORKDIR /app

# 10. Gerekli yapı dosyalarını kopyalayın.
COPY --from=build /app/ ./

# 11. uploads klasörünün silinmemesi için volume ayarlayın (docker-compose ile yapılabilir).
VOLUME /app/public/uploads

# 12. 3000 portunu expose edin.
EXPOSE 3000

# 13. Next.js uygulamasını başlatın.
CMD ["npm", "start"]
