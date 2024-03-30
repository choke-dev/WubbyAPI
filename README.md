<h1 align="center">
<sub>
<img src="./WubbyLogo.png" height="38" width="38">
</sub>
Wubby API
</h1>
<p align="center">
A RESTful API built in Deno for the Roblox Building Game, <a href="https://www.roblox.com/games/12519560096">Wubby</a>
</p>

***


# Run
```
deno run --allow-read --allow-env --allow-net ./src/server.ts
```

## Routes

```
GET      /v1/worldInfo/:id
GET      /v1/userInfo/:id
GET      /v1/searchWorld/:searchquery
POST     /v1/insertWorld [ WIP ]
PUT      /v1/updateWorld [ WIP ]
```