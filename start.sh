#!/bin/sh

# Stop on any error
set -e

# Run Prisma migration after DATABASE_URL is available (at runtime)
npx prisma migrate deploy

# Start your NestJS app
node dist/main
