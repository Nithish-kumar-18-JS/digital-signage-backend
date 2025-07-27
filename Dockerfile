# Dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the app
COPY . .

# Apply Prisma migrations
RUN npx prisma migrate deploy

# Build the app
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]
