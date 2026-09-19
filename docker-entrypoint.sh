#!/bin/sh
set -e

# Run Prisma db push to sync the schema with the database
node ./node_modules/prisma/build/index.js db push --skip-generate

# Start the Next.js standalone server
node seed-docker.js
exec node server.js
