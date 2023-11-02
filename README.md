```sh

# install packages
npm install

# make sure you have docker installed
# The `-d` tells docker to run this in the background
docker compose up -d

cd apps/web
# copy the example env file
cp .env.example .env
# get the postgres DB initialized to match our prisma schema.
npx prisma migrate reset

# 🔥 if you see "npm ERR! code ENOWORKSPACES", execute this:
npx next telemetry disable
```
