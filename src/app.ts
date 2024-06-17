import express from "express"
import routerAuth from "./Routers/auth/auth.router";
import  routerPublication from "./Routers/publications/publication"
import './Database/database.conection'
import ConfigConextion from "./Config/Config";
import cors from "cors";
import http from "http";


const app = express();
const server = http.createServer(app);
import { setUpWebSocket } from "./Websocked/websocked";

//middlewares
app.use(express.json())
const corsOptions = {
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token'], 
    optionsSuccessStatus: 200,
    
};

app.use(cors(corsOptions));


const Port = ConfigConextion.PORT || 4000;

setUpWebSocket(server);

server.listen(Port, () => {
    console.clear();
    console.log(`Server on port ${Port}`);
});


app.use('/auth', routerAuth)
app.use('/publication', routerPublication)
