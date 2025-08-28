FROM node:18

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install

# Copy env + prisma schema before generate
COPY .env .env
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest
COPY . .

# Apply Prisma migration
RUN npx prisma migrate deploy

# Install dependencies
RUN npm install

# Build app
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]
