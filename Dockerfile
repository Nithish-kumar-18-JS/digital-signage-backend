# Use Node 18 base image
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy Prisma files
COPY prisma ./prisma

# Generate Prisma client (and ERD if defined)
RUN npx prisma generate || echo "Prisma generate failed (non-critical)"

# Copy rest of the app
COPY . .

# Apply Prisma migrations to DB (e.g. in production)
# This will fail if schema is invalid or DB is unreachable
RUN npx prisma migrate deploy

# Build the NestJS app
RUN npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "dist/main"]
