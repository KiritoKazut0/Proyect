import express from "express"
import routerAuth from "./Routers/auth/auth.router";
import  routerPublication from "./Routers/publications/publication"
import './Database/database.conection'
import ConfigConextion from "./Config/Config";
import cors from "cors";
import http from "http";


const app = express();
const server = http.createServer(app);
import { setUpWebSocket } from "./Websocked/rooms";

//middlewares
app.use(express.json())
app.use(cors())

const Port = ConfigConextion.PORT || 4000;

setUpWebSocket(server);

server.listen(Port, () => {
    console.log(`Server on port ${Port}`);
});


app.use('/auth', routerAuth)
app.use('/publication', routerPublication)
