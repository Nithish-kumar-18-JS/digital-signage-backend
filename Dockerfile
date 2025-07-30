FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma

# Provide DATABASE_URL from build arg
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

RUN npx prisma generate
COPY . .

RUN npx prisma migrate deploy
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/main"]
