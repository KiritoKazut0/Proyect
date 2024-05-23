import mongoose from "mongoose";
import ConfigConextion from "../Config/Config";


const MongoUri = `mongodb://${ConfigConextion.MONGODB_HOST}/${ConfigConextion.MONGODB_DATABASE}`;

mongoose.connect(MongoUri)
    .then(() => console.log('Database connection has been made'))
    .catch(error => console.log(error.message))
