#!/bin/sh
set -e

# Run Prisma db push to sync the schema with the database
npx --yes prisma@5 db push --skip-generate

# Start the Next.js standalone server
exec node server.js
