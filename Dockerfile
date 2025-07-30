# Use Node 20 LTS
FROM node:20

WORKDIR /app

# Copy only package files first to use cached layers
COPY package*.json ./

RUN npm install

# Copy Prisma schema only for generate step
COPY prisma ./prisma

# Generate Prisma client only (no DB connection required)
RUN npx prisma generate --no-engine

# Copy rest of app
COPY . .

# Build NestJS app
RUN npm run build

# Copy runtime startup script
COPY start.sh .

# Make it executable
RUN chmod +x start.sh

EXPOSE 3000

# Run app using start.sh
CMD ["./start.sh"]
