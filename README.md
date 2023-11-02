```sh
# copy the example env file
cp .env.example .env

# install packages
npm install

# make sure you have docker installed
# The `-d` tells docker to run this in the background
docker compose up -d

# get the postgres DB initialized to match our prisma schema.
npx prisma migrate reset --force --schema apps/web/prisma/schema.prisma
```
