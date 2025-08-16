FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy rest of the source code
COPY . .

# Build your app
RUN npm run build

# Run migrations + start app (at runtime, when DB is accessible)
CMD npx prisma migrate deploy && npm start
