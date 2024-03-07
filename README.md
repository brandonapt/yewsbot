# yews bot.  

simple little discord bot to send the daily [yews](https://yews.news) into a specific discord channel. you can also browse all yews in the nifty web archive or using the bot itself.  

how to run:  
first, install the packages needed (i use pnpm, but you can use any node package manager):
```pnpm install```  

then, to run the bot and api, fill out the .env file in src/.env using the format below:
```
# Tokens
DISCORD_TOKEN=
OWNERS=
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=

# Mongo
MONGODB_URI=

# Redis
REDIS_PASSWORD=
REDIS_HOST=
REDIS_PORT=

# Node Enviorment
NODE_ENV=
```

finally, to start the bot/api, run:
```pnpm run build && node dist/index.js```  
the api runs on port 4000  

you can also use pm2 to run it:
```pm2 yews-pm2.json```  

and finally, to run the web interface, run:
```cd web && pnpm run build && node .output/server/index.mjs```
and it should run on port 3000
