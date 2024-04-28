<h1 align="center">
<sub>
<img src="./WubbyLogo.png" height="38" width="38">
</sub>
Wubby API
</h1>
<p align="center">
A RESTful API built in <sub><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Deno_2021.svg/1024px-Deno_2021.svg.png" height="20"></sub> Deno for the Roblox Building Game, <a href="https://www.roblox.com/games/12519560096">Wubby</a>
</p>

***

# Info
- This API uses PostgreSQL for its database.
- Specific endpoints can be protected with API Keys, and they must be defined manually in [routes.ts](./src/routes.ts).

# Run
```
deno run --allow-read --allow-env --allow-net ./src/server.ts
```

## Routes

```
GET      /v1/worldInfo/:id
GET      /v1/userInfo/:id
GET      /v1/activeWorlds?sort= // asc or desc
GET      /v1/searchWorld?query= &limit=
POST     /v1/insertWorld
PATCH    /v1/updateWorld
```