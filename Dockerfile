FROM node:18

WORKDIR /app

# Install deps first (better caching)
COPY package*.json ./
RUN npm install

# Copy env + prisma schema before generate
COPY .env .env
COPY prisma ./prisma
RUN npx prisma generate

# Copy source code
COPY . .

# Apply Prisma migration
RUN npx prisma migrate deploy

# Build app
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]
